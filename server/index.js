import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import mongoose from "mongoose";

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(cors());
app.use(express.json());
const mongoUri = process.env.MONGODB;
mongoose.connect(mongoUri);

const messageSchema = new mongoose.Schema({
  roomId: String,
  userId: String,
  userName: String,
  message: String,
  timestamp: { type: Date, default: Date.now },
});

const Message = mongoose.model("Message", messageSchema);

const rooms = new Map();
const userNames = new Map();

io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("join room", async (roomId, userName) => {
    socket.join(roomId);
    if (!rooms.has(roomId)) {
      rooms.set(roomId, new Map());
    }
    rooms.get(roomId).set(socket.id, userName || "Anonymous");
    userNames.set(socket.id, userName || "Anonymous");
    io.to(roomId).emit("user joined", Array.from(rooms.get(roomId)));

    const messages = await Message.find({ roomId }).sort("timestamp").limit(50);
    socket.emit("previous messages", messages);
  });

  socket.on("leave room", (roomId) => {
    socket.leave(roomId);
    if (rooms.has(roomId)) {
      rooms.get(roomId).delete(socket.id);
      if (rooms.get(roomId).size === 0) {
        rooms.delete(roomId);
      } else {
        io.to(roomId).emit("user left", Array.from(rooms.get(roomId)));
      }
    }
  });

  socket.on("chat message", async ({ roomId, message }) => {
    const userName = userNames.get(socket.id) || "Anonymous";
    const newMessage = new Message({
      roomId,
      userId: socket.id,
      userName,
      message,
    });
    await newMessage.save();
    io.to(roomId).emit("chat message", {
      userId: socket.id,
      userName,
      message,
      timestamp: newMessage.timestamp,
    });
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
    rooms.forEach((users, roomId) => {
      if (users.has(socket.id)) {
        users.delete(socket.id);
        if (users.size === 0) {
          rooms.delete(roomId);
        } else {
          io.to(roomId).emit("user left", Array.from(users));
        }
      }
    });
    userNames.delete(socket.id);
  });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
