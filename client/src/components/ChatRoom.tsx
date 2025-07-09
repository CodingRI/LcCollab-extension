import { useState, useRef, useEffect } from "react";

interface ChatMessage {
  type: "chat" | "join";
  username: string;
  content: string;
  roomId?: string;
}

interface SystemMessage {
  type: "system";
  content: string;
  roomId?: string;
}

type WsMessage = ChatMessage | SystemMessage;
function ChatRoom() {
  const [username, setUsername] = useState<string>("");
  const [roomId, setRoomId] = useState<string>("");
  const [joined, setJoined] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<WsMessage[]>([]);

  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    ws.current = new WebSocket("ws://localhost:8080");

    ws.current.onopen = () => {
      console.log("Websocket connected");
    };

    ws.current.onmessage = (event: MessageEvent) => {
      const msg: WsMessage = JSON.parse(event.data);
      setMessages((prev) => [...prev, msg]);
    };

    ws.current.onclose = () => {
      console.log("Websocket disconnected");
    };
  }, []);

  const joinRoom = () => {
    if (!username || !roomId) return alert("Username and room are required");
    const joinMessage = {
      type: "join",
      username,
      content: "",
      roomId: null,
    };

    ws.current?.send(JSON.stringify(joinMessage));
    setJoined(true);
  };

  const sendMessage = () => {
    if (!message) return alert("Message is required");

    const chatMessage: ChatMessage = {
      type: "chat",
      username,
      content: message,
      roomId,
    };

    ws.current?.send(JSON.stringify(chatMessage));
    setMessages((prev) => [...prev, chatMessage]);
    setMessage("");
  };

  return <>
      <div>
        (!joined ? (
          <div>
            <input
            type="text" placeholder="Username" value={username}
            className="w-full p-2 border rounded" 
            onChange={(e) => setUsername(e.target.value)}>
            </input>
            <input
            type= "text" placeholder="Room-ID" value={roomId}
            className="w-full p-2 border rounded"
            onChange={(e) => setRoomId(e.target.value)}>
            </input>
            <button onClick={joinRoom}
            className="bg-blue-500 text-white px-4 py-2 rounded">
              Join room
            </button>
          </div>
        ) : (
          <div>
          <div className="mb-4 h-80 overflow-y-auto border p-2 rounded bg-gray-100">
            {messages.map((msg, idx) => (
              <div key={idx} className="mb-1">
                {msg.type === 'system' ? (
                  <em className="text-gray-500">{msg.content}</em>
                ) : (
                  <span><strong>{msg.username}:</strong> {msg.content}</span>
                )}
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              className="flex-1 p-2 border rounded"
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            />
            <button
              className="bg-green-500 text-white px-4 py-2 rounded"
              onClick={sendMessage}
            >
              Send
            </button>
          </div>
        </div>
        ))
      </div>
  
  </>;
}

export default ChatRoom;

