import { useState } from "react";
import { useNavigate } from "react-router-dom";

const LANGUAGES = [
  "cpp",
  "java",
  "python",
  "javascript",
  "c",
  "csharp",
  "go",
  "typescript",
  "ruby",
];
function CreateRoom() {
  const [username, setUsername] = useState("");
  const [roomId] = "9273y46";
  const [language, setLanguage] = useState("Java");
  const [avatar, setAvatar] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setAvatar(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleCreateRoom = () => {
    if(!username){
        alert('Username is required')
        return;
    }
    navigate(`/chat/${roomId}`, {
        state: {
            username,
            language,
            avatar,
            roomId,
        }
    })
  };
  return (
    <>
      <div>
        <h2>Create a new room</h2>
        <div>
          <label>Username</label>
          <input
            type="text"
            className=""
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          ></input>
        </div>
      </div>
      <div>
        <label>Room-ID</label>
        <input type="text" className="" value={roomId} readOnly></input>
      </div>
      <div>
        <label>Upload Avatar (optional)</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
        ></input>
        {avatar && (
          <img
            src={avatar}
            alt="Avatar preview"
            className="h-16 w-16 rounded-full mt-2"
          />
        )}
      </div>

      <div>
        <label>Preferred laguage</label>
        <select>
          {LANGUAGES.map((lang) => (
            <option key={lang} value={lang}>
              {lang.toUpperCase()}
            </option>
          ))}
        </select>
      </div>

      <div>
        <button onClick={handleCreateRoom}>Create room</button>
      </div>
    </>
  );
}

export default CreateRoom;
