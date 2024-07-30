import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import CreateRoom from "./components/CreateRoom";
import ChatRoom from "./components/test";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route path="/" element={<CreateRoom />} />
          <Route path="/:roomId" element={<ChatRoom />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
