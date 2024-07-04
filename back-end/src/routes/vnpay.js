import express from "express";
import moment from "moment";
import crypto from "crypto";
import querystring from "qs";
import config from "../config/configVnpay";

const router = express.Router();

router.post("/create_payment_url", (req, res) => {
  // Thiết lập múi giờ cho quá trình xử lý
  process.env.TZ = "Asia/Ho_Chi_Minh";

  // Lấy ngày giờ hiện tại
  const currentDate = new Date();
  const createDate = moment(currentDate).format("YYYYMMDDHHmmss");

  // Lấy địa chỉ IP của người dùng
  const ipAddr =
    req.headers["x-forwarded-for"] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;

  // Lấy thông tin cấu hình từ file config
  const tmnCode = config.vnp_TmnCode;
  const secretKey = config.vnp_HashSecret;
  let vnpUrl = config.vnp_Url;
  const returnUrl = config.vnp_ReturnUrl;

  // Lấy thông tin từ body của request
  console.log(req.body);
  const amount = req.body.amount;
  const bankCode = req.body.bankCode;
  let locale = req.body.language;

  // Thiết lập ngôn ngữ mặc định là 'vn' nếu không được cung cấp
  if (!locale || locale === "") {
    locale = "vn";
  }

  // Thiết lập mã tiền tệ là VND (Việt Nam Đồng)
  const currCode = "VND";

  // Thiết lập các thông số cho VNPay
  const vnp_Params = {
    vnp_Version: "2.1.0",
    vnp_Command: "pay",
    vnp_TmnCode: tmnCode,
    vnp_Locale: locale,
    vnp_CurrCode: currCode,
    vnp_TxnRef: moment(currentDate).format("DDHHmmss"), // Mã đơn hàng unique
    vnp_OrderInfo: `Thanh toan cho ma GD: ${moment(currentDate).format(
      "DDHHmmss"
    )}`, // Thông tin đơn hàng
    // vnp_OrderInfo:`Thanh toan cho booking so: ${id}`,
    vnp_OrderType: "other",
    vnp_Amount: amount * 100, // Số tiền thanh toán, chuyển đổi sang đơn vị VNĐ
    vnp_ReturnUrl: returnUrl,
    vnp_IpAddr: ipAddr,
    vnp_CreateDate: createDate,
  };

  // Nếu có mã ngân hàng được cung cấp, thêm vào các thông số của VNPay
  if (bankCode) {
    vnp_Params.vnp_BankCode = bankCode;
  }

  // Sắp xếp lại các thông số trước khi tạo chữ ký bảo mật
  const sortedParams = sortObject(vnp_Params);

  // Tạo chuỗi dữ liệu cần ký bằng chữ ký bảo mật
  const signData = querystring.stringify(sortedParams, { encode: false });

  // Tạo chữ ký bảo mật bằng thuật toán SHA512
  const hmac = crypto.createHmac("sha512", secretKey);
  const secureHash = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

  // Thêm chữ ký bảo mật vào thông số của VNPay
  vnp_Params.vnp_SecureHashType = "SHA512";
  vnp_Params.vnp_SecureHash = secureHash;

  // Tạo URL thanh toán của VNPay
  vnpUrl += "?" + querystring.stringify(vnp_Params, { encode: false });

  // Chuyển hướng người dùng đến URL thanh toán của VNPay
  //   res.redirect(vnpUrl);
  res.send(vnpUrl);
});

// router.get("/vnpay_return", (req, res) => {
//   const vnpParams = req.query;
//   const secureHash = vnpParams["vnp_SecureHash"];

//   // Xóa các trường vnp_SecureHash và vnp_SecureHashType để không tính vào việc tạo lại hash
//   delete vnpParams["vnp_SecureHash"];
//   delete vnpParams["vnp_SecureHashType"];

//   // Sắp xếp các tham số theo thứ tự alphabetically
//   const sortedParams = sortObject(vnpParams);

//   // Lấy các thông tin cần thiết từ config
//   const tmnCode = config.vnp_TmnCode;
//   const secretKey = config.vnp_HashSecret;

//   // Tạo chuỗi dữ liệu cần hash
//   const signData = querystring.stringify(sortedParams, { encode: false });

//   // Tạo mã hash từ chuỗi dữ liệu và secretKey
//   const hmac = crypto.createHmac("SHA512", secretKey);
//   const calculatedHash = hmac
//     .update(Buffer.from(signData, "utf-8"))
//     .digest("hex");

//   // So sánh mã hash từ VNPay và mã hash được tính toán
//   if (secureHash === calculatedHash) {
//     // Xác thực thành công
    
//     const orderInfo = vnpParams["vnp_OrderInfo"];
//     const responseCode = vnpParams["vnp_ResponseCode"];
//     if (responseCode === "00") {
//       res.json({ message: "Payment success", data: responseCode,info:orderInfo });
//     }
//     res.json({ message: "Payment failed", data: responseCode ,info:orderInfo});
//   } else {
//     // Xác thực thất bại
//     res.json({ message: "Payment failed" });
//   }
// });
router.get("/", (req, res) => {
  res.render("payment_form");
});
function sortObject(obj) {
  let sorted = {};
  let str = [];
  let key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
  }
  return sorted;
}

module.exports = router;
