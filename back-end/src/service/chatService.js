import ChatMessage from '../model/messageModel.js';
import { Sequelize, Op } from 'sequelize';  // Import Op from Sequelize. It's used for operators.

class ChatService {
    constructor(model) {
        this.model = model;
    }

    async getMessages(senderId, receiverId) {
        try {
            const messages = await this.model.findAll({
                where: {
                    [Op.or]: [
                        { SenderID: senderId, ReceiverID: receiverId },
                        { SenderID: receiverId, ReceiverID: senderId }
                    ],
                },
                order: [['Timestamp', 'ASC']],
            });
            return messages;
        } catch (error) {
            console.error('Error retrieving messages in ChatService:', error);
            throw new Error(`Error retrieving messages: ${error.message}`);
        }
    }

    async sendMessage(senderId, receiverId, messageText) {
        try {
            const message = await this.model.create({
                SenderID: senderId,
                ReceiverID: receiverId,
                MessageText: messageText,
            });
            return message;
        } catch (error) {
            console.error('Error sending message in ChatService:', error);
            throw new Error(`Error sending message: ${error.message}`);
        }
    }
}

export default ChatService;