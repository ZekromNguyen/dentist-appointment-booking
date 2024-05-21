require("dotenv").config();
import express from "express";
import configViewEngine from "./config/viewEngine";
import initWebAllRoutes from "./routes/web";

let app = express();

//config view engine
configViewEngine(app);

//init all web routes
initWebAllRoutes(app);

let port = process.env.PORT;

app.listen(3000, () => {
  console.log(`App is running at the port ${3000}`);
});

