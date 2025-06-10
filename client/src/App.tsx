import { useState } from 'react';
import { RoomSelection } from './components/RoomSelection';
import { ChatRoom } from './components/ChatRoom';

export const App = () => {
  const [currentRoom, setCurrentRoom] = useState<string | null>(null);
  const username = `User${Math.floor(Math.random() * 1000)}`;

  const generateRoomId = () => {
    return `room-${Math.random().toString(36).substring(2, 8)}`;
  };

  const handleCreateRoom = () => {
    return generateRoomId();
  };

  const handleJoinRoom = (roomId: string) => {
    setCurrentRoom(roomId);
  };

  const handleLeaveRoom = () => {
    setCurrentRoom(null);
  };

  if (currentRoom) {
    return (
      <ChatRoom 
        roomId={currentRoom} 
        username={username} 
        onLeaveRoom={handleLeaveRoom} 
      />
    );
  }

  return (
    <RoomSelection 
      onJoinRoom={handleJoinRoom}
      onCreateRoom={handleCreateRoom}
    />
  );
};

export default App;