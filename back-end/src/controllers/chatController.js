import { Router } from 'express';
import ChatService from '../service/chatService.js';
import ChatMessage from '../model/messageModel.js';
import Customer from '../model/customer.js';
import Dentist from '../model/dentist.js';

const router = Router();

class ChatController {
    constructor(chatService) {
        this.chatService = chatService;
        this.getMessages = this.getMessages.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
        this.getAllSenderDetails = this.getAllSenderDetails.bind(this);
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

    async getAllSenderDetails(req, res) {
        const receiverId = req.params.receiverId;

        try {
            const senderDetails = await this.chatService.getAllSenderDetails(receiverId);
            res.status(200).json(senderDetails);
        } catch (error) {
            console.error('Error in ChatController:', error);
            res.status(500).json({ message: error.message });
        }
    }

}

const chatController = new ChatController(new ChatService(ChatMessage, Customer, Dentist));

export default chatController;