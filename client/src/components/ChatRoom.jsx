import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";

// const socket = io("http://localhost:8080");
const socket = io("https://chatapp-8get.onrender.com");

function ChatRoom() {
  const { roomId } = useParams();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [users, setUsers] = useState([]);
  const [userName, setUserName] = useState("");
  const [isUserName, setIsUserName] = useState(false);
  const messageContainerRef = useRef(null);

  useEffect(() => {
    const storedUserName = localStorage.getItem("chatUserName");
    if (storedUserName) {
      setUserName(storedUserName);
      setIsUserName(true);
    }

    socket.emit("join room", roomId, storedUserName);

    socket.on("previous messages", (prevMessages) => {
      setMessages(prevMessages);
    });

    socket.on("chat message", (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    socket.on("user joined", (userList) => {
      setUsers(userList);
    });

    socket.on("user left", (userList) => {
      setUsers(userList);
    });

    return () => {
      socket.emit("leave room", roomId);
      socket.off("previous messages");
      socket.off("chat message");
      socket.off("user joined");
      socket.off("user left");
    };
  }, [roomId]);

  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (inputMessage.trim()) {
      socket.emit("chat message", { roomId, message: inputMessage });
      setInputMessage("");
    }
  };

  const handleSetUserName = (e) => {
    e.preventDefault();
    if (userName.trim()) {
      localStorage.setItem("chatUserName", userName);
      socket.emit("join room", roomId, userName);
      setIsUserName(true);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-60 p-4  border-r border-gray-200">
        <h2 className="mb-8  text-xl font-semibold text-gray-900">
          Room: {roomId}
        </h2>
        <h3 className="mb-2 text-base font-semibold text-gray-700">
          ACTIVE USERS:
        </h3>
        <ul className="space-y-1">
          {users.map(([userId, userName]) => (
            <li key={userId} className="text-gray-600 pl-2">
              {userName}
            </li>
          ))}
        </ul>
        {!isUserName && (
          <form onSubmit={handleSetUserName} className="mt-4">
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Set your name"
              className="w-3/5 border bg-transparent border-slate-800 p-2 rounded rounded-e-none focus:outline-none"
            />
            <button
              type="submit"
              className="border font-semibold text-l bg-slate-100 text-color1 border-slate-800 py-2 px-4 rounded rounded-s-none"
            >
              Set
            </button>
          </form>
        )}
      </div>
      <div className="flex-1 flex flex-col bg-white">
        <div ref={messageContainerRef} className="flex-1 p-4 overflow-y-auto">
          {messages.map((msg, index) => (
            <div key={index} className="mb-2">
              <span className="font-semibold text-slate-800">
                {msg.userName || "Anonymous"}:{" "}
              </span>
              <span className="text-gray-800">{msg.message}</span>
              <span className="ml-2 text-xs text-gray-500">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </span>
            </div>
          ))}
        </div>
        <form onSubmit={sendMessage} className="flex p-4 ">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type a message"
            className="flex-1 border bg-transparent border-slate-800 p-2 rounded rounded-e-none focus:outline-none"
          />
          <button
            type="submit"
            className="px-8 border font-semibold text-lg bg-slate-100 text-color1 border-slate-800 p-2 rounded rounded-s-none hover:bg-color1 hover:text-white "
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChatRoom;
