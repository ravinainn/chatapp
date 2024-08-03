import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function CreateRoom() {
  const [roomName, setRoomName] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (roomName.trim()) {
      navigate(`/${roomName}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div>
        <h1 className="text-4xl sm:text-6xl font-bold text-center mb-2">
          DONTCHAT
        </h1>
        <p className="text-color1 font-semibold text-center mb-12">
          The simplest way to Chat online
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            placeholder="Enter room name"
            className="md:min-w-64 border bg-transparent border-slate-800 p-2 rounded rounded-e-none focus:outline-none"
            required
          />
          <button
            type="submit"
            className="border font-semibold text-l bg-slate-100 text-color1 border-slate-800 p-2 rounded rounded-s-none"
          >
            Create Room
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateRoom;
