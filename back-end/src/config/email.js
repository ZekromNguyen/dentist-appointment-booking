require("dotenv").config();
const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com", // sử dụng host thay vì service để chỉ định rõ ràng máy chủ SMTP
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_APP_GMAIL,
    pass: process.env.EMAIL_APP_PASS,
  },
});

// Kiểm tra kết nối với máy chủ email
transporter.verify((error, success) => {
  if (error) {
    console.error("Error connecting to email server:", error);
  } else {
    console.log("Email server is ready to take our messages:", success);
  }
});

module.exports = transporter;
