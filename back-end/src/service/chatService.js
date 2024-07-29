import { Op, Sequelize } from 'sequelize';

class ChatService {
    constructor(model, customerModel, dentistModel) {
        this.model = model;
        this.customerModel = customerModel;
        this.dentistModel = dentistModel;
    }

    async getMessages(senderId, receiverId) {
        try {
            const messages = await this.model.findAll({
                where: {
                    [Op.or]: [
                        { SenderID: senderId, ReceiverID: receiverId },
                        { SenderID: receiverId, ReceiverID: senderId },
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

    // Function to fetch the latest message per conversation
    async getAllSenderDetails(receiverId) {
        try {
            // Subquery to get the latest message for each sender and receiver pair
            const latestMessages = await this.model.findAll({
                attributes: [
                    'SenderID',
                    'ReceiverID',
                    'MessageText',
                    'Timestamp',
                    [Sequelize.literal(`ROW_NUMBER() OVER (PARTITION BY SenderID, ReceiverID ORDER BY Timestamp DESC)`), 'rn']
                ],
                where: {
                    ReceiverID: receiverId
                },
                order: [
                    ['Timestamp', 'DESC']
                ]
            });

            // Filter the subquery results to only keep the latest message per sender-receiver pair
            const latestMessagesFiltered = latestMessages.filter(item => item.dataValues.rn === 1);

            // Build an array of sender IDs to fetch customer details
            const senderIDs = latestMessagesFiltered.map(item => item.SenderID);

            // Fetch customer details based on the sender IDs
            const customerDetails = await this.customerModel.findAll({
                attributes: [
                    'CustomerID',
                    'CustomerName',
                    'AccountID'
                ],
                where: {
                    AccountID: {
                        [Op.in]: senderIDs
                    }
                }
            });

            // Merge the latest messages with the corresponding customer details
            const mergedResult = latestMessagesFiltered.map(message => {
                const customer = customerDetails.find(c => c.AccountID === message.SenderID);
                return {
                    SenderID: message.SenderID,
                    ReceiverID: message.ReceiverID,
                    CustomerID: customer ? customer.CustomerID : null,
                    CustomerName: customer ? customer.CustomerName : null,
                    AccountID: customer ? customer.AccountID : null,
                    MessageText: message.MessageText,
                    Timestamp: message.Timestamp
                };
            });

            // Return the sorted merged result by timestamp
            return mergedResult.sort((a, b) => new Date(b.Timestamp) - new Date(a.Timestamp));
        } catch (error) {
            console.error('Error retrieving sender details in ChatService:', error);
            throw new Error(`Error retrieving sender details: ${error.message}`);
        }
    }

    async getMessagesForClinicOwner(clinicOwnerId) {
        try {
            // Fetch the clinic ID for the given clinic owner
            const clinicOwner = await this.clinicOwnerModel.findOne({
                where: { ClinicOwnerID: clinicOwnerId },
                include: [{ model: this.clinicModel }],
            });

            if (!clinicOwner) {
                throw new Error('Clinic owner not found');
            }

            const clinicId = clinicOwner.ClinicID;

            // Fetch all dentists and customers associated with the clinic
            const dentists = await this.dentistModel.findAll({
                where: { ClinicID: clinicId },
            });
            const customers = await this.customerModel.findAll({
                where: { ClinicID: clinicId },
            });

            // Extract IDs
            const dentistIds = dentists.map(dentist => dentist.AccountID);
            const customerIds = customers.map(customer => customer.AccountID);

            // Fetch messages where either dentist or customer is involved
            const messages = await this.model.findAll({
                where: {
                    [Op.or]: [
                        { SenderID: { [Op.in]: dentistIds }, ReceiverID: { [Op.in]: customerIds } },
                        { SenderID: { [Op.in]: customerIds }, ReceiverID: { [Op.in]: dentistIds } },
                    ],
                },
                order: [['Timestamp', 'ASC']],
            });

            return messages;
        } catch (error) {
            console.error('Error retrieving messages for clinic owner in ChatService:', error);
            throw new Error(`Error retrieving messages for clinic owner: ${error.message}`);
        }
    }


}

export default ChatService;
