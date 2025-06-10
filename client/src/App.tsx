import { useState } from 'react';
import { RoomSelection } from './components/RoomSelection';
import { ChatRoom } from './components/ChatRoom';

// const USER_COLORS = [
//   '#6EE7B7', // Teal
//   '#93C5FD', // Light blue
//   '#C4B5FD', // Lavender
//   '#FCA5A5', // Salmon
//   '#FCD34D', // Amber
// ];

type User = {
  name: string;
  avatar?: string;
  color: string;
};

export const App = () => {
  const [currentRoom, setCurrentRoom] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const generateRoomId = () => {
    return `room-${Math.random().toString(36).substring(2, 8)}`;
  };

  const handleCreateRoom = (user: User) => {
    setCurrentUser(user);
    return generateRoomId();
  };

  const handleJoinRoom = (roomId: string, user: User) => {
    setCurrentUser(user);
    setCurrentRoom(roomId);
  };

  const handleLeaveRoom = () => {
    setCurrentRoom(null);
  };

  if (currentRoom && currentUser) {
    return (
      <ChatRoom 
        roomId={currentRoom} 
        user={currentUser}
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