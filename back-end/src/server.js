require("dotenv").config();
import express from "express";
import configViewEngine from "./config/viewEngine";
import initWebAllRoutes from "./routes/web";
import session from "express-session";
// import authRoutes from "./routes/authRoutes";
import cors from "cors"; // Import cors


let app = express();

// Enable CORS for all routes
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "swp391",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false,
      maxAge: 1 * 60 * 1000, // 1 minutes
    }, // Set to true if using HTTPS
  })
);
//config view engine
configViewEngine(app);

//init all web routes
initWebAllRoutes(app);
// app.use(authRoutes);

let port = process.env.PORT;

app.listen(port, () => {
  console.log(`App is running at the port ${port}`);
});
