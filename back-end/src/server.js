require("dotenv").config();
import express from "express";
import configViewEngine from "./config/viewEngine";
import initWebAllRoutes from "./routes/web";
// import authRoutes from "./routes/authRoutes";

let app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//config view engine
configViewEngine(app);

//init all web routes
initWebAllRoutes(app);
// app.use(authRoutes);

let port = process.env.PORT;

app.listen(port, () => {
  console.log(`App is running at the port ${port}`);
});
