import { useNavigate } from "react-router-dom";


function WelcomePage() {
const navigate = useNavigate();

  return (
    <>
      <div>
        <h1 className="text-3xl font-bold">Welcome to LCSolve</h1>
        <div className="space-x-4">
          <button
            className="bg-green-500 text-white px-6 py-3 rounded hover:bg-green-600"
            onClick={() => navigate("/create")}
          >
            Create a room
          </button>

          <button
            className="bg-green-500 text-white px-6 py-3 rounded hover:bg-green-600"
            onClick={() => navigate("/join")}
          >
            Join a room
          </button>
        </div>
      </div>
    </>
  );
}

export default WelcomePage;
