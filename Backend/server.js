import express from "express";
import "dotenv/config";
import cors from "cors";
import mongoose from "mongoose";


import authRoutes from "./routes/auth.js";
import chatRoutes from "./routes/chat.js";


const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
const allowedOrigins = [
  "http://localhost:5173",
  "https://sigma-gpt-ho5t.vercel.app",
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (Postman, mobile apps, etc.)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
}));

// Authentication routes
app.use("/api/auth", authRoutes);

// Chat routes
app.use("/api", chatRoutes);



const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        console.log("Connected with Database!");

        app.listen(PORT, () => {
            console.log(`Server running on ${PORT}`);
        });

    } catch (err) {
        console.log("Failed to connect with DB:", err);
        process.exit(1);
    }
};

connectDB();