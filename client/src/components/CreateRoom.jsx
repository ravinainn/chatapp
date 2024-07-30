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
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h1 className="mb-6 text-2xl font-bold text-center text-gray-800">
          Create a Chat Room
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            placeholder="Enter room name"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Create Room
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateRoom;
