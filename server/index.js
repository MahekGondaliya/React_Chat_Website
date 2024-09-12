import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import authRoutes from "./routes/AuthRoutes.js";
import contactRoutes from "./routes/ContactRoutes.js";
import setupSocket from "./socket.js";
import messagesRoutes from "./routes/MessageRoutes.js";

dotenv.config(); // Load environment variables

const app = express();
const port = process.env.PORT;
const db_url = process.env.MONGODB_URL;

// Middleware setup
app.use(cors({
  origin: process.env.ORIGIN,
  methods: ["GET","PUT","POST","DELETE"],
  credentials: true,
}));

app.use(cookieParser());
app.use(express.json());
app.use("/uploads/profiles",express.static("/uploads/profiles"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/message", messagesRoutes);


// MongoDB connection
mongoose.connect(db_url)
  .then(() => console.log("Database connected successfully"))
  .catch((error) => {
    console.error("Database connection error:", error.message);
    process.exit(1);
  });


// Error handling middleware (optional but useful)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: "Something went wrong!" });
});

// Start server
const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

setupSocket(server);
