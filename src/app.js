import express from "express";

const app = express();

// Settings
app.set("port", process.env.PORT || 3000);

// Middlewares
app.use(express.json());

// Routes
app.get("/api", (req, res) => res.json("You're not gonna get anything here"));

export { app };
