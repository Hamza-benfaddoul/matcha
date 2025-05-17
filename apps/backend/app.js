const express = require("express");
const app = express();
const images = require("./routes/api/user/images.js");
const user = require("./routes/api/user/user.js");
const { logger } = require("./middleware/logEvent.js");
const verifyJWT = require("./middleware/verifyJWT");
const cookieparser = require("cookie-parser");
const cors = require("cors");
const port = process.env.PORT || 5000; // Fixed bitwise OR to logical OR
const corsOptions = require("./conf/corsOrigins");
const allowedOrigins = require("./conf/allowedOrigins");
const credentials = require("./middleware/credentials");
const path = require("path");
const fs = require("fs");

const http = require("http");
const { Server } = require("socket.io");

// Create HTTP server with Express app
const server = http.createServer(app);

// Socket.io setup
const io = new Server(server, {
  path: "/ws/socket.io",
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Use the same verifyJWT middleware for WebSockets
io.use(verifyJWT);

// Initialize socket services
const notificationNamespace = io.of("/notifications");

require("./services/socketServiceExample").socketServiceExample(
  io.of("/example"),
);
require("./services/socketServiceExample").testConnection(io.of("/test"));
require("./services/socketServiceChat").socketServiceChat(
  io.of("/chat"),
  notificationNamespace,
);
require("./services/socketOnlineService").socketOnlineService(io.of("/online"));
require("./services/socketNotificationService").socketNotificationService(
  io.of("/notifications"),
);

// In your app.js, after creating the namespaces:
// Store the namespace in app for easy access
app.set("notificationNamespace", notificationNamespace);

// Express Middleware (unchanged from your original)
app.use(logger);
app.use(credentials);
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieparser());
app.use(express.urlencoded({ extended: true }));

// Uploads directory setup
const uploadsDir = path.join("./uploads");
console.log("uploadsDir: ", uploadsDir, __dirname);
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

app.use("/api/uploads", express.static(uploadsDir));

// Add Google OAuth routes
app.use("/api/auth/google", require("./routes/api/auth/googleAuthRoutes"));

// Routes (completely unchanged from your original)
app.use("/api/login", require("./routes/api/auth/login"));
app.use("/api/register", require("./routes/api/auth/register"));
app.use("/api/logout", require("./routes/api/auth/logout"));
app.use("/api/reset-password", require("./routes/api/auth/reset-password"));
app.use("/api/refresh", require("./routes/api/auth/refresh"));
app.use(
  "/api/new-verification",
  require("./routes/api/auth/new-verification-token"),
);

// Protected routes (unchanged)
app.use(verifyJWT);
app.use("/api/change-password", require("./routes/api/auth/change-password"));
app.use("/api/users", user);
app.use("/api/profile", user);
app.use("/api/images", images);
app.use("/api/user/views", require("./routes/api/user/views"));
app.use("/api/user/likes", require("./routes/api/user/likes"));
app.use("/api/user/tags", require("./routes/api/user/tags"));
app.use("/api/user/block", require("./routes/api/user/block"));
app.use("/api/user/chat", require("./routes/api/user/chat"));
app.use(
  "/api/matching-profiles",
  require("./routes/api/browsing/matching-profiles"),
);
app.use("/api/location", require("./routes/api/user/gps"));

app.use("/api/search", require("./routes/api/search/searchRoutes"));
// geting user States
app.use("/api/user/state", require("./routes/api/user/state"));
// Add dates routes
app.use("/api/dates", require("./routes/api/dates/index"));
// Error handling (unchanged)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send(err.message);
});

app.all("*", (req, res) => {
  res.status(404);
  res.json({ error: 404, message: "Not Found" });
});

// Start the combined HTTP/WebSocket server
server.listen(port, () => {
  console.log(`Server listening on port ${port} (HTTP + WebSocket)`);
});
