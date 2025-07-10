import { useNavigate } from "react-router-dom";
import { useState } from "react";

function WelcomePage() {
  const navigate = useNavigate();
  const [isHoveringCreate, setIsHoveringCreate] = useState(false);
  const [isHoveringJoin, setIsHoveringJoin] = useState(false);

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-6">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500 mb-4 animate-fade-in">
          Welcome to LCSolve
        </h1>
        <p className="text-gray-400 text-lg max-w-md animate-fade-in delay-100">
          Collaborative problem solving made simple
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-6 animate-fade-in delay-200">
        <button
          className={`relative overflow-hidden px-8 py-4 rounded-lg font-medium text-lg transition-all duration-300 ${
            isHoveringCreate 
              ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/20"
              : "bg-gray-800 text-emerald-400 border border-gray-700"
          }`}
          onClick={() => navigate("/create")}
          onMouseEnter={() => setIsHoveringCreate(true)}
          onMouseLeave={() => setIsHoveringCreate(false)}
        >
          {isHoveringCreate && (
            <span className="absolute inset-0 bg-gradient-to-r from-emerald-500/30 to-transparent animate-shine"></span>
          )}
          <span className="relative z-10 flex items-center justify-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Create a room
          </span>
        </button>

        <button
          className={`relative overflow-hidden px-8 py-4 rounded-lg font-medium text-lg transition-all duration-300 ${
            isHoveringJoin 
              ? "bg-cyan-600 text-white shadow-lg shadow-cyan-500/20"
              : "bg-gray-800 text-cyan-400 border border-gray-700"
          }`}
          onClick={() => navigate("/join")}
          onMouseEnter={() => setIsHoveringJoin(true)}
          onMouseLeave={() => setIsHoveringJoin(false)}
        >
          {isHoveringJoin && (
            <span className="absolute inset-0 bg-gradient-to-r from-cyan-500/30 to-transparent animate-shine"></span>
          )}
          <span className="relative z-10 flex items-center justify-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
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
            Join a room
          </span>
        </button>
      </div>
    </div>
  );
}

export default WelcomePage;