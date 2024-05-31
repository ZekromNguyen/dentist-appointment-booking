require("dotenv").config();
import nodemailer from "nodemailer";
const transporter = nodemailer.createTransport({
  serivice: "gmail",
  auth: {
    user: process.env.EMAIL_APP_GMAIL,
    pass: process.env.EMAIL_APP_PASS,
  },
});
module.exports = transporter;
