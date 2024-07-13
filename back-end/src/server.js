require("dotenv").config();
import express from "express";
import configViewEngine from "./config/viewEngine";
import initWebAllRoutes from "./routes/web";
import session from "express-session";
import cors from "cors";
import multer from "multer";
import path from "path";
import vnpay from "./routes/vnpay";
require('./service/scheduler');
let app = express();

// Enable CORS for all routes
app.use(
  cors({
    origin: ["http://datlich99.site","http://localhost:5173"], // URL của ứng dụng React
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
      maxAge: 24 * 60 * 60 * 1000, // 1 days
    }, // Set to true if using HTTPS
  })
);
app.use("/uploads", express.static("uploads"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/order", vnpay);
//config view engine
configViewEngine(app);

//init all web routes
initWebAllRoutes(app);
// app.use(authRoutes);
app.on('clientError', (err, socket) => {
  socket.destroy(err); // Xử lý và đóng socket khi xảy ra lỗi
});
let port = process.env.PORT;

app.listen(port, () => {
  console.log(`App is running at the port ${port}`);
});
