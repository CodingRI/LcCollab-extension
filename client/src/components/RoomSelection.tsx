import { useState } from 'react';

type RoomSelectionProps = {
  onJoinRoom: (roomId: string) => void;
  onCreateRoom: () => string;
};

export const RoomSelection = ({ onJoinRoom, onCreateRoom }: RoomSelectionProps) => {
  const [roomIdInput, setRoomIdInput] = useState('');
  const [action, setAction] = useState<'select' | 'join' | 'create'>('select');

  const handleCreateRoom = () => {
    const newRoomId = onCreateRoom();
    onJoinRoom(newRoomId);
  };

  const handleJoinRoom = () => {
    if (roomIdInput.trim()) {
      onJoinRoom(roomIdInput.trim());
    }
  };

  if (action === 'select') {
    return (
      <div className="w-[350px] h-[500px] bg-gray-900/85 backdrop-blur-lg rounded-xl border border-gray-700 flex flex-col shadow-2xl overflow-hidden text-gray-200 font-sans p-6">
        <h2 className="text-xl font-bold mb-6 text-center">LcCollab</h2>
        <div className="flex flex-col gap-4">
          <button
            onClick={() => setAction('create')}
            className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
          >
            Create New Room
          </button>
          <button
            onClick={() => setAction('join')}
            className="bg-gray-700 hover:bg-gray-600 text-white py-3 px-4 rounded-lg font-medium transition-colors"
          >
            Join Existing Room
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-[350px] h-[500px] bg-gray-900/85 backdrop-blur-lg rounded-xl border border-gray-700 flex flex-col shadow-2xl overflow-hidden text-gray-200 font-sans p-6">
      <h2 className="text-xl font-bold mb-6 text-center">
        {action === 'create' ? 'Create New Room' : 'Join Room'}
      </h2>
      
      {action === 'join' && (
        <>
          <input
            type="text"
            value={roomIdInput}
            onChange={(e) => setRoomIdInput(e.target.value)}
            placeholder="Enter Room ID"
            className="bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 mb-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleJoinRoom}
            disabled={!roomIdInput.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-3 px-4 rounded-lg font-medium transition-colors"
          >
            Join Room
          </button>
        </>
      )}
      
      {action === 'create' && (
        <button
          onClick={handleCreateRoom}
          className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
        >
          Generate Room ID & Join
        </button>
      )}
      
      <button
        onClick={() => setAction('select')}
        className="mt-4 text-gray-400 hover:text-gray-300 text-sm underline"
      >
        Back to options
      </button>
    </div>
  );
};