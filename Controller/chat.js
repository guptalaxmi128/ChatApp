const db = require('../Model');
const { createMessage, createPrivateChat } = require("../Middleware/validation");
const User = db.user;
const Chat = db.chat;
const Chat_User = db.chats_user;
const Message = db.chatMessage
const { Op } = require("sequelize");

exports.createPrivateChat = async (req, res) => {
    try {
        // Validate Body
        const { error } = createPrivateChat(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        }
        const { secondId } = req.body;
        const firstId = req.user.id;
        const userArray = [firstId, secondId];
        const chats = await Chat.findAll({
            where: {
                chatType: "Private"
            },
            include: [{
                model: Chat_User,
                as: "users",
                where: {
                    userId: firstId
                },
                require: true
            }]
        });
        let chat;
        for (let i = 0; i < chats.length; i++) {
            const isSecond = await Chat_User.findOne({ where: { chatId: chats[i].id, userId: secondId } });
            if (isSecond) {
                chat = {
                    ...chats[i].dataValues,
                    users: [chats[i].dataValues.users[0].dataValues, isSecond.dataValues]
                }
                break;
            }
        }
        if (chat) {
            return res.status(200).json(chat);
        }
        // return;
        const newChat = await Chat.create({ chatType: "Private" });
        const users = [];
        for (let i = 0; i < userArray.length; i++) {
            const user = await User.findOne({ where: { id: userArray[i] } });
            const chat_user = await Chat_User.create({
                chatId: newChat.id,
                userId: userArray[i],
                userName: user.fullName
            });
            users.push(chat_user);
        }
        const response = { ...newChat.dataValues, users: users }
        res.status(200).json(response);
    } catch (err) {
        res.status(500).send({
            success: false,
            message: err.message
        });
    }
};

exports.getUserChat = async (req, res) => {
    try {
        const userId = req.user.id;
        const chat = await Chat.findAll({
            include: [{
                model: Chat_User,
                as: "users",
                where: {
                    userId: userId
                },
                require: true
            }]
        });
        res.status(200).json(chat);
    } catch (err) {
        res.status(500).send({
            success: false,
            message: err.message
        });
    }
};

exports.findChat = async (req, res) => {
    try {
        const chatId = req.params.id;
        const chat = await Chat.findOne({
            where: {
                id: chatId
            },
            include: [{
                model: Chat_User,
                as: "users"
            }]
        });
        res.status(200).json(chat);
    } catch (err) {
        res.status(500).send({
            success: false,
            message: err.message
        });
    }
};

exports.createMessage = async (req, res) => {
    try {
        // Validate Body
        const { error } = createMessage(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        }
        const { chatId, message } = req.body;
        const senderId = req.user.id;
        const chat = await Message.create({
            senderId: senderId,
            message: message,
            chatId: chatId
        });
        res.status(200).json(chat);
    } catch (err) {
        res.status(500).send({
            success: false,
            message: err.message
        });
    }
};

exports.getMessage = async (req, res) => {
    try {
        const chatId = req.params.id;
        const chat = await Message.findAll({
            where: {
                chatId: chatId
            },
            order: [
                ['createdAt', 'DESC']
            ]
        });
        res.status(200).json(chat);
    } catch (err) {
        res.status(500).send({
            success: false,
            message: err.message
        });
    }
};