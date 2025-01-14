require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const profileRoutes = require("./routes/profile");
const errorMiddleware = require("./error/error.js");
const mentorRoutes = require("./routes/mentorRoutes.js");
const meetingRoutes = require("./routes/meetingRoute.js");

const app = express();

// Increase payload size limits
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Middleware
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());

// Routes
app.use("/api/profile", profileRoutes);
app.use("/api/contact", require("./routes/contactRoutes"));
app.use("/auth", require("./routes/userRoutes"));
app.use("/api/mentor", mentorRoutes);
app.use("/api/user", require("./routes/userRoutes"));
app.use("/api/meetings", meetingRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/api/notifications", require("./routes/notificationsRoute.js"));
app.use(errorMiddleware);


// Test route
app.get("/api/test", (req, res) => {
  res.json({ message: "API is working" });
});

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
