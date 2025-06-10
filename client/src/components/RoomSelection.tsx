import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { FiUser, FiArrowLeft, FiUpload } from 'react-icons/fi';

const USER_COLORS = [
  '#6EE7B7', // Teal
  '#93C5FD', // Light blue
  '#C4B5FD', // Lavender
  '#FCA5A5', // Salmon
  '#FCD34D', // Amber
];

type User = {
  name: string;
  avatar?: string;
  color: string;
};

type RoomSelectionProps = {
  onJoinRoom: (roomId: string, user: User) => void;
  onCreateRoom: (user: User) => string;
};

export const RoomSelection = ({ onJoinRoom, onCreateRoom }: RoomSelectionProps) => {
  const [roomIdInput, setRoomIdInput] = useState('');
  const [action, setAction] = useState<'select' | 'join' | 'create' | 'user'>('user');
  const [user, setUser] = useState<User>({ 
    name: '', 
    color: USER_COLORS[Math.floor(Math.random() * USER_COLORS.length)]
  });
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateRoom = () => {
    const newUser = {
      name: user.name || `User${Math.floor(Math.random() * 1000)}`,
      avatar: avatarPreview || undefined,
      color: user.color
    };
    const newRoomId = onCreateRoom(newUser);
    onJoinRoom(newRoomId, newUser);
  };

  const handleJoinRoom = () => {
    if (roomIdInput.trim()) {
      const newUser = {
        name: user.name || `User${Math.floor(Math.random() * 1000)}`,
        avatar: avatarPreview || undefined,
        color: user.color
      };
      onJoinRoom(roomIdInput.trim(), newUser);
    }
  };

  if (action === 'user') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-[350px] h-[500px] bg-gray-900/90 backdrop-blur-sm rounded-lg border border-gray-700 flex flex-col overflow-hidden shadow-xl p-6"
      >
        <h2 className="text-xl font-bold text-gray-200 mb-8">Welcome to LeetCollab</h2>
        
        <div className="mb-6">
          <label className="block text-gray-400 mb-2 text-sm">Your Name</label>
          <input
            type="text"
            value={user.name}
            onChange={(e) => setUser({...user, name: e.target.value})}
            placeholder="Enter your name"
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-gray-200 outline-none placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all"
          />
        </div>
        
        <div className="mb-8">
          <label className="block text-gray-400 mb-2 text-sm">Profile Picture (optional)</label>
          <div className="flex items-center gap-4">
            <div 
              className="w-14 h-14 rounded-full border-2 border-gray-700 flex items-center justify-center overflow-hidden"
              style={{ backgroundColor: !avatarPreview ? user.color : undefined }}
            >
              {avatarPreview ? (
                <img src={avatarPreview} className="w-full h-full object-cover" alt="avatar" />
              ) : (
                <FiUser size={24} className="text-white" />
              )}
            </div>
            <motion.button
              onClick={() => fileInputRef.current?.click()}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 px-4 py-2 rounded-lg text-gray-300 text-sm transition-colors"
            >
              <FiUpload size={16} /> Upload
            </motion.button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleAvatarChange}
              accept="image/*"
              className="hidden"
            />
          </div>
        </div>
        
        <motion.button
          onClick={() => setAction('select')}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors disabled:bg-gray-700 disabled:text-gray-500"
          disabled={!user.name.trim()}
        >
          Continue
        </motion.button>
      </motion.div>
    );
  }

  if (action === 'select') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-[350px] h-[500px] bg-gray-900/90 backdrop-blur-sm rounded-lg border border-gray-700 flex flex-col overflow-hidden shadow-xl p-6"
      >
        <h2 className="text-xl font-bold text-gray-200 mb-8">Get Started</h2>
        
        <div className="flex flex-col gap-4 mb-8">
          <motion.button
            onClick={() => setAction('create')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors"
          >
            Create New Room
          </motion.button>
          <motion.button
            onClick={() => setAction('join')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-200 py-3 rounded-lg font-medium transition-colors"
          >
            Join Existing Room
          </motion.button>
        </div>
        
        <button
          onClick={() => setAction('user')}
          className="text-sm text-gray-500 hover:text-gray-300 transition-colors flex items-center gap-1"
        >
          <FiArrowLeft size={14} /> Back to profile
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-[350px] h-[500px] bg-gray-900/90 backdrop-blur-sm rounded-lg border border-gray-700 flex flex-col overflow-hidden shadow-xl p-6"
    >
      <button
        onClick={() => setAction('select')}
        className="text-sm text-gray-500 hover:text-gray-300 transition-colors flex items-center gap-1 mb-6"
      >
        <FiArrowLeft size={14} /> Back
      </button>
      
      <h2 className="text-xl font-bold text-gray-200 mb-6">
        {action === 'create' ? 'Create New Room' : 'Join Room'}
      </h2>
      
      {action === 'join' && (
        <>
          <div className="mb-6">
            <label className="block text-gray-400 mb-2 text-sm">Room ID</label>
            <input
              type="text"
              value={roomIdInput}
              onChange={(e) => setRoomIdInput(e.target.value)}
              placeholder="Paste room ID here"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-gray-200 outline-none placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all"
            />
          </div>
          <motion.button
            onClick={handleJoinRoom}
            disabled={!roomIdInput.trim()}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors disabled:bg-gray-700 disabled:text-gray-500"
          >
            Join Room
          </motion.button>
        </>
      )}
      
      {action === 'create' && (
        <motion.button
          onClick={handleCreateRoom}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors"
        >
          Create Room
        </motion.button>
      )}
    </motion.div>
  );
};