import { useState } from "react";
import { useNavigate } from "react-router-dom";

const LANGUAGES = [
  "java",
  "cpp",
  "python",
  "javascript",
  "c",
  "csharp",
  "go",
  "typescript",
  "ruby",
];

function JoinRoom() {
  const [username, setUsername] = useState("");
  const [roomId, setRoomId] = useState("");
  const [language, setLanguage] = useState("java");
  const [avatar, setAvatar] = useState<string | null>(null);
  const [isHovering, setIsHovering] = useState(false);

  const navigate = useNavigate();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setAvatar(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleJoinRoom = () => {
    if (!username) {
      alert("Username is required");
      return;
    }
    if (!roomId) {
      alert("Room ID is required");
      return;
    }
    navigate(`/chat/${roomId}`, {
      state: {
        username,
        language,
        avatar,
        roomId,
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6 animate-fade-in">
      <div className="w-full max-w-md bg-gray-800 rounded-xl shadow-2xl overflow-hidden border border-gray-700">
        <div className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-500">
              Join a Room
            </h2>
            <p className="text-gray-400 mt-2">
              Connect with your coding collaborators
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-gray-300 mb-2 font-medium">
                Username <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white placeholder-gray-400 transition-all"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2 font-medium">
                Room ID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white placeholder-gray-400 transition-all"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                placeholder="Enter room ID"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2 font-medium">
                Upload Avatar (optional)
              </label>
              <div className="flex items-center gap-4">
                <label className="flex flex-col items-center px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg cursor-pointer hover:bg-gray-600 transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="text-sm text-gray-400">Choose file</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
                {avatar && (
                  <img
                    src={avatar}
                    alt="Avatar preview"
                    className="h-12 w-12 rounded-full border-2 border-cyan-500 object-cover"
                  />
                )}
              </div>
            </div>

            <div>
              <label className="block text-gray-300 mb-2 font-medium">
                Preferred Language
              </label>
              <select
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white appearance-none transition-all"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                {LANGUAGES.map((lang) => (
                  <option
                    key={lang}
                    value={lang}
                    className="bg-gray-800 text-white"
                  >
                    {lang.charAt(0).toUpperCase() + lang.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleJoinRoom}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              className={`w-full mt-6 relative overflow-hidden px-6 py-3 rounded-lg font-medium text-lg transition-all duration-300 ${
                isHovering
                  ? "bg-cyan-600 text-white shadow-lg shadow-cyan-500/20"
                  : "bg-gradient-to-r from-cyan-500 to-emerald-600 text-white"
              }`}
            >
              {isHovering && (
                <span className="absolute inset-0 bg-gradient-to-r from-cyan-500/30 to-transparent animate-shine"></span>
              )}
              <span className="relative z-10 flex items-center justify-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                Join Room
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JoinRoom;