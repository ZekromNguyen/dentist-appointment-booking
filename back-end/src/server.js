require("dotenv").config();
import express from "express";
import configViewEngine from "./config/viewEngine.js";
import initWebAllRoutes from "./routes/web.js";
import session from "express-session";
import cors from "cors";
import multer from "multer";
import path from "path";
import vnpay from "./routes/vnpay.js";
import http from 'http';
import socketIo from 'socket.io';
import { Sequelize } from 'sequelize';
import chatController from './controllers/chatController.js';

require('./service/scheduler.js');

let app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  }
});

// Initialize Sequelize
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite'
});

// Sync database
sequelize.sync();

// Enable CORS for all routes
app.use(
  cors({
    origin: ["http://datlich99.site", "http://localhost:5173"],
    credentials: true,
  })
);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/images/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

app.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const imageUrl = `/uploads/images/${req.file.filename}`;
  return res.status(201).json({ imageUrl });
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "swp391",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    },
  })
);

app.use("/uploads", express.static("uploads"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/order", vnpay);

// Configure view engine
configViewEngine(app);

// Initialize all web routes
initWebAllRoutes(app);

app.on('clientError', (err, socket) => {
  socket.destroy(err); // Handle and close socket on error
});

// Socket.io configuration
io.on('connection', (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  socket.on('sendMessage', async (data) => {
    try {
      const { senderId, receiverId, messageText } = data;
      console.log(`Received sendMessage event with data: ${JSON.stringify(data)}`);

      // Mock req and res objects
      const req = { body: { senderId, receiverId, messageText } };
      const res = {
        json: (message) => {
          console.log(`Message sent successfully: ${JSON.stringify(message)}`);
          io.emit('newMessage', message); // Broadcast message to all clients
        },
        status: (statusCode) => ({
          json: (error) => {
            console.error(`Error sending message: ${statusCode}, ${error}`);
          }
        })
      };

      await chatController.sendMessage(req, res);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  });

  socket.on('getMessages', async (data, callback) => {
    try {
      const { senderId, receiverId } = data;
      console.log(`Received getMessages event with data: ${JSON.stringify(data)}`);

      // Mock req and res objects
      const req = { params: { senderId, receiverId } };
      const res = {
        json: (messages) => {
          console.log(`Messages retrieved successfully: ${JSON.stringify(messages)}`);
          callback(messages); // Send result back to client
        },
        status: (statusCode) => ({
          json: (error) => {
            console.error(`Error retrieving messages: ${statusCode}, ${error}`);
          }
        })
      };

      await chatController.getMessages(req, res);
    } catch (error) {
      console.error('Error retrieving messages:', error);
    }
  });

  socket.on('getConversations', async (data, callback) => {
    try {
      const { dentistId } = data;
      console.log(`Received getConversations event with data: ${JSON.stringify(data)}`);

      // Mock req and res objects
      const req = { params: { dentistId } };
      const res = {
        json: (conversations) => {
          console.log(`Conversations retrieved successfully: ${JSON.stringify(conversations)}`);
          callback(conversations); // Send result back to client
        },
        status: (statusCode) => ({
          json: (error) => {
            console.error(`Error retrieving conversations: ${statusCode}, ${error}`);
          }
        })
      };

      await chatController.getConversations(req, res);
    } catch (error) {
      console.error('Error retrieving conversations:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(`App is running on port ${port}`);
});


/* 
require("dotenv").config();
import express from "express";
import configViewEngine from "./config/viewEngine.js";
import initWebAllRoutes from "./routes/web.js";
import session from "express-session";
import cors from "cors";
import multer from "multer";
import path from "path";
import vnpay from "./routes/vnpay.js";
import http from 'http';
import socketIo from 'socket.io';
import { Sequelize } from 'sequelize';
import chatController from './controllers/chatController.js';

require('./service/scheduler.js');

let app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  }
});

// Initialize Sequelize
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite'
});

// Sync database
sequelize.sync();

// Enable CORS for all routes
app.use(
  cors({
    origin: ["http://datlich99.site", "http://localhost:5173"],
    credentials: true,
  })
);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/images/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

app.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const imageUrl = `/uploads/images/${req.file.filename}`;
  return res.status(201).json({ imageUrl });
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "swp391",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    },
  })
);

app.use("/uploads", express.static("uploads"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/order", vnpay);

// Configure view engine
configViewEngine(app);

// Initialize all web routes
initWebAllRoutes(app);

app.on('clientError', (err, socket) => {
  socket.destroy(err); // Handle and close socket on error
});

// Socket.io configuration
io.on('connection', (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  socket.on('sendMessage', async (data) => {
    try {
      const { senderId, receiverId, messageText } = data;
      console.log(`Received sendMessage event with data: ${JSON.stringify(data)}`);

      // Mock req and res objects
      const req = { body: { senderId, receiverId, messageText } };
      const res = {
        json: (message) => {
          console.log(`Message sent successfully: ${JSON.stringify(message)}`);
          io.emit('newMessage', message); // Broadcast message to all clients
        },
        status: (statusCode) => ({
          json: (error) => {
            console.error(`Error sending message: ${statusCode}, ${error}`);
          }
        })
      };

      await chatController.sendMessage(req, res);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  });

  socket.on('getMessages', async (data, callback) => {
    try {
      const { senderId, receiverId } = data;
      console.log(`Received getMessages event with data: ${JSON.stringify(data)}`);

      // Mock req and res objects
      const req = { params: { senderId, receiverId } };
      const res = {
        json: (messages) => {
          console.log(`Messages retrieved successfully: ${JSON.stringify(messages)}`);
          callback(messages); // Send result back to client
        },
        status: (statusCode) => ({
          json: (error) => {
            console.error(`Error retrieving messages: ${statusCode}, ${error}`);
          }
        })
      };

      await chatController.getMessages(req, res);
    } catch (error) {
      console.error('Error retrieving messages:', error);
    }
  });

  socket.on('getConversations', async (data, callback) => {
    try {
      const { dentistId } = data;
      console.log(`Received getConversations event with data: ${JSON.stringify(data)}`);

      // Mock req and res objects
      const req = { params: { dentistId } };
      const res = {
        json: (conversations) => {
          console.log(`Conversations retrieved successfully: ${JSON.stringify(conversations)}`);
          callback(conversations); // Send result back to client
        },
        status: (statusCode) => ({
          json: (error) => {
            console.error(`Error retrieving conversations: ${statusCode}, ${error}`);
          }
        })
      };

      await chatController.getConversations(req, res);
    } catch (error) {
      console.error('Error retrieving conversations:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
*/