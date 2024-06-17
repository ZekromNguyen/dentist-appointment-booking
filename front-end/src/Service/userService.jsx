import axios from "axios";

// Đăng ký tài khoản
const register = async (username, password, email, phone) => {
    try {
        const response = await axios.post("http://localhost:3000/register", {
            username,
            password,
            email,
            phone,
        });
        return response;
    } catch (error) {
        console.error("Error during registration:", error);
        throw error;
    }
};

// Đăng nhập
const login = async (email, password) => {
    try {
        const response = await axios.post("http://localhost:3000/login", {
            email: email,
            password: password,
        }, { withCredentials: true });
        return response;
    } catch (error) {
        console.error("Error during login:", error);
        return error.response;
    }
};

// Quên mật khẩu
const forgotPassword = async (email) => {
    const response = await axios.post("http://localhost:3000/forgotPassword", {
        email,
    });
    return response.data; // Return the data from the response
};

// Đặt lại mật khẩu
const resetPassword = async (token, password, confirmPassword) => {
    try {
        const response = await axios.post("http://localhost:3000/resetPassword", {
            token,
            password,
            confirmPassword,
        });
        return response;
    } catch (error) {
        throw new Error(
            "Error resetting password: " +
            (error.response ? error.response.data.message : error.message)
        );
    }
};

// Xác minh email
const verifyEmail = async (token) => {
    try {
        if (!token) {
            throw new Error("Invalid token");
        }
        const response = await axios.get(
            `http://localhost:3000/verify?token=${token}`
        );
        return response.data.id; // Trả về id từ dữ liệu phản hồi
    } catch (error) {
        throw new Error("Error verifying email: " + error.message); // Ném lỗi để xử lý ở nơi gọi hàm
    }
};

// const resetEmail = async (token) => {
//     try {
//         if (!token) {
//             throw new Error('Invalid token');
//         }
//         const response = await axios.get(`http://localhost:5173/ResetPassword?token=${token}`);
//         return response.data.id; // Trả về id từ dữ liệu phản hồi
//     } catch (error) {
//         throw new Error('Error verifying email: ' + error.message); // Ném lỗi để xử lý ở nơi gọi hàm
//     }
// };
const resetEmail = async (token) => {
    try {
        if (!token) {
            throw new Error("Invalid token");
        }

        const response = await axios.get("http://localhost:5173/ResetPassword", {
            params: { token },
        });

        return response.data;
    } catch (error) {
        throw new Error(
            "Error verifying email: " +
            (error.response ? error.response.data.message : error.message)
        );
    }
};
// Hàm để kiểm tra session
const checkSession = async () => {
    try {
        const response = await axios.get('http://localhost:3000/get-session', { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error('Error fetching session:', error);
        return null;
    }
};

// Hàm để xử lý logout
const logout = async () => {
    try {
        await axios.post('http://localhost:3000/logout', {}, { withCredentials: true });
    } catch (error) {
        console.error('Error during logout:', error);
        throw error;
    }
};
// const ResetPassword = () => {
//     const location = useLocation();
//     const queryParams = new URLSearchParams(location.search);
//     const token = queryParams.get('token');
// }

// Lấy id từ token
const getIdFromToken = async (token) => {
    try {
        // Gọi API xác minh email để lấy id từ token
        const id = await verifyEmail(token);
        return id;
    } catch (error) {
        throw new Error("Error getting id from token: " + error.message); // Ném lỗi để xử lý ở nơi gọi hàm
    }
};
const getAllUSer = async (AccountID) => {
    try {
        const response = await axios.get(
            `http://localhost:3000/getAllUser?id=${AccountID}`,
            {
                params: { AccountID: AccountID },
            }
        );
        return response.data; // Return the data from the response
    } catch (error) {
        throw new Error("Error getting AccountID from account: " + error.message);
    }
};

export {
    register,
    login,
    verifyEmail,
    resetPassword,
    getIdFromToken,
    getAllUSer,
    resetEmail,
    forgotPassword,
    checkSession,
    logout
};
