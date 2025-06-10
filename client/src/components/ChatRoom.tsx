import { useEffect, useRef, useState } from "react";
import { FiCopy, FiUser, FiArrowLeft } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

type User = {
  name: string;
  avatar?: string;
  color: string; // Added user color
};

type ChatMessage = {
  user: User;
  content: string;
  timestamp: Date;
  isLocal?: boolean;
  roomId: string;
};

type ChatRoomProps = {
  roomId: string;
  user: User;
  onLeaveRoom: () => void;
};

export const ChatRoom = ({ roomId, user, onLeaveRoom }: ChatRoomProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const ws = useRef<WebSocket | null>(null);

  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId);
    addSystemMessage("Room ID copied to clipboard!");
  };

  const addSystemMessage = (content: string) => {
    setMessages((prev) => [
      ...prev,
      {
        user: { name: "System", color: "#9CA3AF" },
        content,
        timestamp: new Date(),
        roomId,
      },
    ]);
  };

  const sendMessage = () => {
    if (!input.trim() || !isConnected || !ws.current) return;

    const message = {
      type: "chat",
      user,
      content: input,
      roomId,
      timestamp: new Date(),
    };

    // Add message to local state immediately
    setMessages((prev) => [
      ...prev,
      {
        user,
        content: input,
        isLocal: true,
        timestamp: new Date(),
        roomId,
      },
    ]);

    // Send to server
    ws.current.send(JSON.stringify(message));
    setInput("");
  };

  useEffect(() => {
    ws.current = new WebSocket("ws://localhost:8080");

    ws.current.onopen = () => {
      setIsConnected(true);
      addSystemMessage("Connected to server");

      // Join the room
      const joinMessage = {
        type: "join",
        user,
        roomId,
      };
      ws.current?.send(JSON.stringify(joinMessage));
    };

    ws.current.onclose = () => {
      setIsConnected(false);
      addSystemMessage("Disconnected from server");
    };

    ws.current.onerror = (error) => {
      console.error("WebSocket error:", error);
      addSystemMessage("Connection error");
    };

    ws.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        switch (data.type) {
          case "room-joined":
            addSystemMessage(`Joined room ${data.roomId}`);
            break;

          case "chat":
            if (data.roomId === roomId && data.user.name !== user.name) {
              setMessages((prev) => [
                ...prev,
                {
                  user: data.user,
                  content: data.content,
                  timestamp: new Date(data.timestamp),
                  roomId: data.roomId,
                },
              ]);
            }
            break;

          default:
            addSystemMessage(event.data);
        }
      } catch (e) {
        addSystemMessage(event.data);
      }
    };

    return () => {
      ws.current?.close();
    };
  }, [roomId, user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const roomMessages = messages.filter((msg) => msg.roomId === roomId);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-[350px] h-[500px] bg-gray-900/90 backdrop-blur-sm rounded-lg border border-gray-700 flex flex-col overflow-hidden shadow-xl"
    >
      {/* Header */}
      <div className="p-3 border-b border-gray-700 flex items-center justify-between bg-gray-800/50">
        <div className="flex items-center gap-2">
          <div className="flex space-x-1">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <h3 className="text-sm font-medium text-gray-300">room:~/{roomId}</h3>
        </div>
        <div className="flex items-center gap-2">
          <div
            className={`h-2 w-2 rounded-full ${
              isConnected ? "bg-green-500" : "bg-red-500"
            }`}
          ></div>
          <button
            onClick={copyRoomId}
            className="text-xs flex items-center gap-1 bg-gray-800 hover:bg-gray-700 border border-gray-600 px-2 py-1 rounded text-gray-300 transition-colors"
          >
            <FiCopy size={12} /> Copy ID
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-3">
        <AnimatePresence>
          {roomMessages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={`max-w-[90%] flex flex-col ${
                msg.user.name === user.name ? "items-end" : "items-start"
              }`}
            >
              {msg.user.name === "System" ? null : (
                <>
                  <div className="flex items-center gap-2 w-full">
                    {msg.user.name !== user.name && (
                      <>
                        {msg.user.avatar ? (
                          <img
                            src={msg.user.avatar}
                            className="w-5 h-5 rounded-full border border-gray-600"
                            alt="avatar"
                          />
                        ) : (
                          <div
                            className="w-5 h-5 rounded-full flex items-center justify-center border border-gray-600"
                            style={{ backgroundColor: msg.user.color }}
                          >
                            <FiUser size={12} className="text-white" />
                          </div>
                        )}
                        <span
                          className="text-xs font-medium"
                          style={{ color: msg.user.color }}
                        >
                          {msg.user.name}
                        </span>
                      </>
                    )}
                    {msg.user.name === user.name && (
                      <span className="text-xs text-gray-400 mr-2">you</span>
                    )}
                    <span className="text-xs text-gray-500">
                      {formatTime(msg.timestamp)}
                    </span>
                  </div>
                  <div
                    className={`
        px-3 py-2 rounded-lg break-words leading-snug mt-1
        ${
          msg.user.name === user.name
            ? "bg-blue-600 text-white"
            : "bg-gray-800 text-gray-200"
        }
        transition-colors duration-200
      `}
                  >
                    {msg.content}
                  </div>
                </>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-gray-700 bg-gray-800/50">
        <div className="flex items-center gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type a message..."
            className="flex-1 bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-gray-200 outline-none placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all"
          />
          <motion.button
            onClick={sendMessage}
            disabled={!input.trim() || !isConnected}
            whileTap={{ scale: 0.95 }}
            className={`
              px-3 py-2 rounded-lg font-medium transition-all
              ${
                input.trim() && isConnected
                  ? "bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
                  : "bg-gray-700 text-gray-500 cursor-not-allowed"
              }
            `}
          >
            Send
          </motion.button>
        </div>
        <button
          onClick={onLeaveRoom}
          className="mt-2 text-xs text-gray-500 hover:text-gray-300 transition-colors flex items-center gap-1"
        >
          <FiArrowLeft size={12} /> Leave room
        </button>
      </div>
    </motion.div>
  );
};
