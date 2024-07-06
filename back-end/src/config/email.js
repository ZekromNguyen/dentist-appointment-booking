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

const sendReminderEmail = (email, appointmentDetails) => {
  const mailOptions = {
    from: process.env.EMAIL_APP_GMAIL,
    to: email,
    subject: 'Nhắc nhở cuộc hẹn',
    text: `Đây là nhắc nhở về cuộc hẹn của bạn được lên lịch vào ${appointmentDetails.date} lúc ${appointmentDetails.time}. Đây là thông báo tự động vui lòng không phản hồi lại.`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Lỗi khi gửi email:', error);
    } else {
      console.log('Email đã được gửi:', info.response);
    }
  });
};

const sendVerificationEmail = (email, verificationLink) => {
  const mailOptions = {
    from: process.env.EMAIL_APP_GMAIL,
    to: email,
    subject: "Email Verification",
    text: `Please verify your email by clicking the following link: ${verificationLink}`,
    html: `<p>Please verify your email by clicking the following link: <a href="${verificationLink}">Verify Email</a></p>`,
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        reject(error);
      } else {
        resolve(info);
      }
    });
  });
};

const sendResetPasswordEmail = (email, verificationLink) => {
  const mailOptions = {
    from: process.env.EMAIL_APP_GMAIL,
    to: email,
    subject: "Email ResetPassword",
    text: `Please reset your password by clicking the following link: ${verificationLink}`,
    html: `<p>Please reset your password by clicking the following link: <a href="${verificationLink}">Verify ResetPassword</a></p>`,
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        reject(error);
      } else {
        resolve(info);
      }
    });
  });
};

const sendReactivateEmail = async (email, verificationLink) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_APP_GMAIL,
      to: email,
      subject: "Reactivate Your Account",
      text: `Your account is inactive. Please reset your password to reactivate your account by clicking the following link: ${verificationLink}`,
      html: `<p>Your account is inactive. Please reset your password to reactivate your account by clicking the following link: <a href="${verificationLink}">Reset Password</a></p>`,
    };

    let info = await transporter.sendMail(mailOptions);
    console.log("sendReactivateEmail:", info.response);
    return { success: true, message: `sendReactivateEmail sent to ${email}` };
  } catch (error) {
    console.error("Error sendReactivateEmail:", error);
    throw new Error(`Failed to send sendReactivateEmail: ${error.message}`);
  }
};


module.exports = {
  sendReminderEmail,
  sendVerificationEmail,
  sendResetPasswordEmail,
  sendReactivateEmail,
};
