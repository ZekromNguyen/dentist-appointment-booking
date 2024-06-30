import axios from "axios";

// Đăng ký tài khoản

const register = async (username, password, email, phone, name) => {
    try {
        const response = await axios.post("http://localhost:3000/register", {
            username,
            password,
            email,
            phone,
            name,
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

const deleteUser = async (id) => {
    try {
        const response = await axios.delete('http://localhost:3000/deleteUser', {
            data: { AccountID: id }
        });

        // Assuming the server returns JSON data
        return response.data;
    } catch (error) {
        // Handle error, log it, etc.
        console.error('Error deleting user:', error);
        throw error; // Optional: re-throw the error to be handled upstream
    }
};

const handelAddUser = async ({ username, password, email, phone, roleID, name, clinicID, dentistName, description, imagePath, clinicOwnerName }) => {
    try {
        const response = await axios.post("http://localhost:3000/handleCreateUser", {
            username,
            password,
            email,
            phone,
            roleID,
            name,
            clinicID,
            dentistName,
            description,
            imagePath,
            clinicOwnerName
        });
        return response.data; // Assuming the backend returns appropriate data
    } catch (error) {
        console.error("Error during registration:", error);
        throw error;
    }
};


const handleEditUser = async (userData) => {
    try {
        const response = await axios.put("http://localhost:3000/editUser", userData);
        return response.data; // Assuming backend returns a JSON response
    } catch (error) {
        throw error; // Propagate the error for handling in the calling code
    }
};

const handleEditCustomer = async (userData) => {
    try {
        const response = await axios.put("http://localhost:3000/editCustomer", userData);
        return response.data; // Assuming backend returns a JSON response
    } catch (error) {
        throw error; // Propagate the error for handling in the calling code
    }
};





// // Đăng ký tài khoản
// const registerDentist = async (username, password, email, phone, dentistName, clinicID, roleID) => {
//     try {
//         const response = await axios.post("http://localhost:3000/registerDentist", {
//             username,
//             password,
//             email,
//             phone,
//             dentistName,
//             clinicID,
//             roleID // Include roleID in the request body
//         });
//         return response;
//     } catch (error) {
//         console.error("Error during registration:", error);
//         throw error;
//     }
// };
const registerDentist = async (username, password, email, phone, dentistName, clinicID, roleID, imageFile) => {
    try {
        const formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);
        formData.append('email', email);
        formData.append('phone', phone);
        formData.append('dentistName', dentistName);
        formData.append('clinicID', clinicID);
        formData.append('image', imageFile); // Thêm hình ảnh vào FormData

        const response = await axios.post('http://localhost:3000/registerDentist', formData, {
            headers: {
                'Content-Type': 'multipart/form-data', // Đặt loại nội dung là multipart/form-data cho việc tải lên file
            },
        });

        return response;
    } catch (error) {
        console.error('Error during registration:', error);
        throw error;
    }
};


const getAllDentist = async (DentistID) => {
    try {
        const response = await axios.get(
            `http://localhost:3000/handleGetAllDentist?id=${DentistID}`,
            {
                params: { DentistID: DentistID },
            }
        );
        return response.data; // Return the data from the response
    } catch (error) {
        throw new Error("Error getting AccountID from account: " + error.message);
    }
};

/////////////customer 
const getAllCustomer = async (CustomerID) => {
    try {
        const response = await axios.get(
            `http://localhost:3000/handleGetAllCustomer?id=${CustomerID}`,
            {
                params: { CustomerID: CustomerID },
            }
        );
        return response.data; // Return the data from the response
    } catch (error) {
        throw new Error("Error getting AccountID from account: " + error.message);
    }
};
// Xóa bác sĩ nha khoa
const deleteDentist = async (DentistID) => {
    try {
        const response = await axios.delete('http://localhost:3000/handleDeleteDentist', {
            data: { DentistID: DentistID }
        });

        // Assuming the server returns JSON data
        return response.data;
    } catch (error) {
        // Handle error, log it, etc.
        console.error('Error deleting dentist:', error);
        throw error; // Optional: re-throw the error to be handled upstream
    }
};
// Chỉnh sửa bác sĩ nha khoa
const handleEditDentist = async (dentistData) => {
    try {
        const response = await axios.put("http://localhost:3000/handleEditDentist", dentistData);
        return response.data; // Assuming backend returns a JSON response
    } catch (error) {
        throw error; // Propagate the error for handling in the calling code
    }
};


/////////////////////////
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
    logout,
    deleteUser,
    handelAddUser,
    handleEditUser,
    registerDentist,
    getAllDentist,
    deleteDentist,
    handleEditDentist,
    getAllCustomer,
    handleEditCustomer
};


