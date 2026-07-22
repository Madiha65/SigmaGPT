import express from "express";
import "dotenv/config";
import cors from "cors";
import mongoose from "mongoose";


import authRoutes from "./routes/auth.js";
import chatRoutes from "./routes/chat.js";


const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://sigma-gpt-ho5t.vercel.app/signup"
  ],
  credentials: true
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