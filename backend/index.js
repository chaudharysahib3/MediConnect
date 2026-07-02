import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { Server } from "socket.io";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import Message from "./models/Message.js";
import videoSocket from "./sockets/videoSocket.js";
import aiRoutes from "./routes/aiRoutes.js";
dotenv.config();
connectDB();
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/ai",aiRoutes);

const server = app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});

const io = new Server(server, {
    cors: {
        origin: "*"
    },
});

//store online users
let onlineUsers = {};

io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("join", (userId) => {
        onlineUsers[userId] = socket.id;
    });

    socket.on("sendMessage", async ({ sender, receiver, text }) => {
        const message = await Message.create({ sender, receiver, text });

        if (onlineUsers[receiver]) {
            io.to(onlineUsers[receiver]).emit("receiveMessage", message);
        }
    });

    socket.on("typing", ({ sender, receiver }) => {
        if (onlineUsers[receiver]) {
            io.to(onlineUsers[receiver]).emit("typing", sender);
        }
    });

    socket.on("stopTyping", ({ sender, receiver }) => {
        if (onlineUsers[receiver]) {
            io.to(onlineUsers[receiver]).emit("stopTyping", sender);
        }
    });

    socket.on("markSeen", async ({ sender, receiver }) => {
        await Message.updateMany(
            {
                sender, receiver, seen: false
            },
            { seen: true }
        );

        if (onlineUsers[sender]) {
            io.to(onlineUsers[sender]).emit("messagesSeen");
        }
    });

    socket.on("disconnect", () => {
        console.log("User disconnected");
    });
});

io.on("connection", (socket) => {
    videoSocket(io, socket);
});
