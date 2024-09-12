import { disconnect as mongooseDisconnect } from "mongoose";
import { Server as socketIOserver } from "socket.io";
import Message from "./models/MessagesModel.js";

const setupSocket = (server) => {
  const io = new socketIOserver(server, {
    cors: {
      origin: [process.env.ORIGIN],
      methods: ["GET", "PUT", "POST", "DELETE"],
      credentials: true,
    },
  });

  const userSocketMap = new Map();

  const handleSocketDisconnect = (socket) => {
    console.log(`Client Disconnected: ${socket.id}`);
    for (const [userId, socketId] of userSocketMap.entries()) {
      if (socketId === socket.id) {
        userSocketMap.delete(userId);
        break;
      }
    }
  };

  const sendMessage = async (message) => {
    const sendSocketId = userSocketMap.get(message.sender);
    const recipientSocketId = userSocketMap.get(message.recipient);

    const createMessage = await Message.create(message);
    const messageData = await Message.findById(createMessage._id).populate("sender","id firstname color image lastname ").populate("recipient","id firstname color image lastname ")

    if (recipientSocketId) {
      io.to(recipientSocketId).emit("recieveMessage",messageData);
      
    }
    if (sendSocketId) {
      io.to(sendSocketId).emit("recieveMessage",messageData);
    }
  
  };

  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;

    if (userId) {
      userSocketMap.set(userId, socket.id);
      console.log(`User Connected: ${userId} with socket ID: ${socket.id}`);
    } else {
      console.log("User did not connect with socket (missing userId)");
    }

    socket.on("sendMessage", sendMessage);
    socket.on("disconnect", () => handleSocketDisconnect(socket));
  });
};

export default setupSocket;
