import ChatRoom from "./components/ChatRoom"

function App() {
  return (
    <div>
      <ChatRoom/>
    </div>
  )
}

export default App

// import { useState } from 'react';
// import ChatRoom from "./components/ChatRoom"

// type User = {
//   name: string;
//   avatar?: string;
//   color: string;
// };

// export const App = () => {
//   const [currentRoom, setCurrentRoom] = useState<string | null>('default-room');
//   const [currentUser, setCurrentUser] = useState<User | null>({
//     name: 'GuestUser',
//     color: '#93C5FD'
//   });

//   const handleLeaveRoom = () => {
//     setCurrentRoom(null);
//   };

//   if (currentRoom && currentUser) {
//     return (
//       <ChatRoom 
//         roomId={currentRoom} 
//         user={currentUser} 
//         onLeaveRoom={handleLeaveRoom} 
//       />
//     );
//   }

//   // Placeholder UI while RoomSelection is not implemented
//   return (
//     <div className="flex flex-col items-center justify-center h-screen gap-4">
//       <h1 className="text-2xl font-bold">Loading chat room...</h1>
//       <button
//         className="bg-blue-600 text-white px-4 py-2 rounded"
//         onClick={() => {
//           setCurrentRoom('default-room');
//           setCurrentUser({ name: 'GuestUser', color: '#93C5FD' });
//         }}
//       >
//         Join Default Room
//       </button>
//     </div>
//   );
// };

// export default App;
