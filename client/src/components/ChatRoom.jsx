import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";

const socket = io("https://chatapp-8get.onrender.com");

function ChatRoom() {
  const { roomId } = useParams();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [users, setUsers] = useState([]);

  const messageContainerRef = useRef(null);

  useEffect(() => {
    socket.emit("join room", roomId);

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

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-1/4 p-4 bg-white border-r border-gray-200">
        <h2 className="mb-4 text-xl font-semibold text-gray-800">
          Room: {roomId}
        </h2>
        <h3 className="mb-2 text-lg font-medium text-gray-700">
          Users in room:
        </h3>
        <ul className="space-y-1">
          {users.map((user) => (
            <li key={user} className="text-gray-600">
              {user}
            </li>
          ))}
        </ul>
      </div>
      <div className="flex flex-col w-3/4">
        <div ref={messageContainerRef} className="flex-1 p-4 overflow-y-auto">
          {messages.map((msg, index) => (
            <div key={index} className="mb-2">
              <span className="font-semibold text-blue-600">
                {msg.userId}:{" "}
              </span>
              <span className="text-gray-800">{msg.message}</span>
              <span className="ml-2 text-xs text-gray-500">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </span>
            </div>
          ))}
        </div>
        <form
          onSubmit={sendMessage}
          className="flex p-4 bg-white border-t border-gray-200"
        >
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type a message"
            className="flex-1 px-4 py-2 mr-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChatRoom;
