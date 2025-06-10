import { useEffect, useRef, useState } from 'react';

type ChatMessage = {
  user: string;
  content: string;
  isLocal?: boolean;
  roomId: string;
};

type ChatRoomProps = {
  roomId: string;
  username: string;
  onLeaveRoom: () => void;
};

export const ChatRoom = ({ roomId, username, onLeaveRoom }: ChatRoomProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const ws = useRef<WebSocket | null>(null);

  const sendMessage = () => {
    if (!input.trim() || !isConnected || !ws.current) return;
    
    const message = {
      type: 'chat',
      username,
      content: input,
      roomId
    };

    // Add message to local state immediately
    setMessages(prev => [...prev, { user: username, content: input, isLocal: true, roomId }]);
    
    // Send to server
    ws.current.send(JSON.stringify(message));
    setInput('');
  };

  useEffect(() => {
    ws.current = new WebSocket("ws://localhost:8080");

    ws.current.onopen = () => {
      setIsConnected(true);
      setMessages(prev => [...prev, { user: 'System', content: 'Connected to server', roomId: '' }]);
      
      // Join the room
      const joinMessage = {
        type: 'join',
        username,
        roomId
      };
      ws.current?.send(JSON.stringify(joinMessage));
    };

    ws.current.onclose = () => {
      setIsConnected(false);
      setMessages(prev => [...prev, { user: 'System', content: 'Disconnected from server', roomId: '' }]);
    };

    ws.current.onerror = (error) => {
      console.error('WebSocket error:', error);
      setMessages(prev => [...prev, { user: 'System', content: 'Connection error', roomId: '' }]);
    };

    ws.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        switch(data.type) {
          case 'room-joined':
            setMessages(prev => [...prev, { user: 'System', content: `Joined room ${data.roomId}`, roomId: data.roomId }]);
            break;
            
          case 'chat':
            if (data.roomId === roomId && data.username !== username) {
              setMessages(prev => [...prev, { user: data.username, content: data.content, roomId: data.roomId }]);
            }
            break;
            
          default:
            setMessages(prev => [...prev, { user: 'System', content: event.data, roomId: '' }]);
        }
      } catch (e) {
        setMessages(prev => [...prev, { user: 'System', content: event.data, roomId: '' }]);
      }
    };

    return () => {
      ws.current?.close();
    };
  }, [roomId, username]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const roomMessages = messages.filter(msg => msg.roomId === roomId);

  return (
    <div className="w-[350px] h-[500px] bg-gray-900/85 backdrop-blur-lg rounded-xl border border-gray-700 flex flex-col shadow-2xl overflow-hidden text-gray-200 font-sans">
      {/* Header */}
      <div className="p-4 border-b border-gray-700 flex items-center justify-between bg-gray-800/50">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-white">Room: {roomId}</h3>
          <div className={`h-2 w-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
        </div>
        <div className="text-xs text-gray-400 bg-gray-700/50 px-2 py-1 rounded-full">
          {username}
        </div>
      </div>
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
        {roomMessages.map((msg, i) => (
          <div 
            key={i} 
            className={`max-w-[80%] flex flex-col ${msg.user === username ? 'items-end' : 'items-start'}`}
          >
            {msg.user !== username && (
              <div className={`text-xs mb-1 font-medium ${msg.user === 'System' ? 'text-gray-400' : 'text-blue-400'}`}>
                {msg.user}
              </div>
            )}
            <div className={`
              px-3.5 py-2.5 rounded-lg break-words leading-snug
              ${msg.user === username 
                ? 'bg-gradient-to-br from-blue-400 to-blue-500 text-white rounded-br-none' 
                : 'bg-gray-800/80 text-gray-200 border border-gray-700 rounded-bl-none'}
            `}>
              {msg.content}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input */}
      <div className="p-4 border-t border-gray-700 bg-gray-800/50">
        <div className="flex gap-2 items-center">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Type a message..."
            className="flex-1 px-3.5 py-2.5 rounded-full border-none bg-gray-700/50 text-white outline-none text-sm placeholder-gray-400 focus:ring-1 focus:ring-blue-500"
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || !isConnected}
            className={`
              text-white border-none rounded-full px-4 py-2.5 text-sm font-medium
              flex items-center justify-center transition-all duration-200
              ${input.trim() && isConnected 
                ? 'bg-gradient-to-br from-blue-400 to-blue-500 cursor-pointer hover:from-blue-500 hover:to-blue-600' 
                : 'bg-gray-700/50 cursor-not-allowed'}
            `}
          >
            Send
          </button>
        </div>
        <button
          onClick={onLeaveRoom}
          className="mt-2 text-sm text-gray-400 hover:text-gray-300 underline w-full text-center"
        >
          Leave Room
        </button>
      </div>
    </div>
  );
};