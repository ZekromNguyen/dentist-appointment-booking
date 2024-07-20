import ChatService from '../service/chatService.js'; // Đảm bảo đường dẫn đúng đến file chatService.js
import ChatMessage from '../model/messageModel.js'; // Đảm bảo đường dẫn đúng đến file messageModel.js

class ChatController {
    constructor(chatService) {
        this.chatService = chatService;
        this.getMessages = this.getMessages.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
    }

    async getMessages(req, res) {
        const { senderId, receiverId } = req.params;
        try {
            console.log(`Retrieving messages for senderId: ${senderId}, receiverId: ${receiverId}`);
            const messages = await this.chatService.getMessages(senderId, receiverId);
            res.json(messages);
        } catch (error) {
            console.error('Error retrieving messages in ChatController:', error);
            res.status(500).json({ error: 'Failed to retrieve messages' });
        }
    }

    async sendMessage(req, res) {
        const { senderId, receiverId, messageText } = req.body;
        try {
            console.log(`Sending message from senderId: ${senderId}, receiverId: ${receiverId}, messageText: ${messageText}`);
            const message = await this.chatService.sendMessage(senderId, receiverId, messageText);
            res.json(message);
        } catch (error) {
            console.error('Error sending message in ChatController:', error);
            res.status(500).json({ error: 'Failed to send message' });
        }
    }
}

export default new ChatController(new ChatService(ChatMessage));