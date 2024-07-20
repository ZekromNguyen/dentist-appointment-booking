// Định nghĩa mô hình ChatMessage trong Sequelize

const { DataTypes, Model } = require('sequelize');
import sequelize from "../config/database";

class ChatMessage extends Model { }

ChatMessage.init(
    {
        MessageID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        SenderID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'account', // Tên bảng Accounts
                key: 'AccountID' // Khóa chính trong bảng Accounts
            }
        },
        ReceiverID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'account', // Tên bảng Accounts
                key: 'AccountID' // Khóa chính trong bảng Accounts
            }
        },
        MessageText: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        Timestamp: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    },
    {
        sequelize,
        modelName: 'ChatMessage',
        tableName: 'ChatMessage',
        timestamps: false // Nếu bạn không cần sử dụng các mốc thời gian createdAt và updatedAt
    }
);

module.exports = ChatMessage;