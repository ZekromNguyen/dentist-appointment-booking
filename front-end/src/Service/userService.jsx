import axios from "axios";

// Đăng ký tài khoản
const register = async (username, password, email, phone) => {
    try {
        const response = await axios.post('http://localhost:3000/register', {
            username,
            password,
            email,
            phone
        });
        return response.data; // Trả về dữ liệu từ phản hồi
    } catch (error) {
        console.error('Lỗi trong quá trình đăng ký:', error);
        throw error; // Ném lỗi để xử lý ở nơi gọi hàm
    }
}

// Đăng nhập
const login = async (email, password) => {
    try {
        const response = await axios.post('http://localhost:3000/login', {
            email,
            password,
        });
        return response.data; // Trả về dữ liệu từ phản hồi
    } catch (error) {
        console.error('Lỗi trong quá trình đăng nhập:', error);
        throw error.response.data; // Ném lỗi để xử lý ở nơi gọi hàm
    }
};

// Quên mật khẩu
const forgotPassword = async (email) => {
    try {
        const response = await axios.post('http://localhost:3000/forgotPassword', { email });
        return response.data; // Trả về dữ liệu từ phản hồi
    } catch (error) {
        throw error; // Ném lỗi để xử lý ở nơi gọi hàm
    }
};

// Đặt lại mật khẩu
const resetPassword = async (token, password, confirmPassword) => {
    try {
        const id = await getIdFromToken(token); // Xác minh token và lấy id
        const response = await axios.post('http://localhost:3000/resetPassword', {
            id,
            password,
            confirmPassword,
        });
        return response.data; // Trả về dữ liệu từ phản hồi
    } catch (error) {
        throw error; // Ném lỗi để xử lý ở nơi gọi hàm
    }
};

// Xác minh email
const verifyEmail = async (token) => {
    try {
        if (!token) {
            throw new Error('Invalid token');
        }
        const response = await axios.get(`http://localhost:3000/verify?token=${token}`);
        return response.data.id; // Trả về id từ dữ liệu phản hồi
    } catch (error) {
        throw new Error('Error verifying email: ' + error.message); // Ném lỗi để xử lý ở nơi gọi hàm
    }
};

// Lấy id từ token
const getIdFromToken = async (token) => {
    try {
        // Gọi API xác minh email để lấy id từ token
        const id = await verifyEmail(token);
        return id;
    } catch (error) {
        throw new Error('Error getting id from token: ' + error.message); // Ném lỗi để xử lý ở nơi gọi hàm
    }
};


export { register, login, forgotPassword, verifyEmail, resetPassword, getIdFromToken };
