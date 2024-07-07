const express = require('express');

const { register, login, getMe, getAllUser } = require('../Controller/user');
const { createPrivateChat, getUserChat, findChat, createMessage, getMessage } = require('../Controller/chat');

const yoga = express.Router();

// middleware
const { verifyUserJWT } = require('../Middleware/verifyJWTToken');
const { isUserPresent } = require('../Middleware/isPresent');

yoga.post("/register", register);
yoga.post("/login", login);
yoga.get("/me", verifyUserJWT, getMe);
yoga.get("/users", verifyUserJWT, isUserPresent, getAllUser);

yoga.post("/createPrivateChat", verifyUserJWT, isUserPresent, createPrivateChat);
yoga.get("/getUserChat", verifyUserJWT, isUserPresent, getUserChat);
yoga.get("/findChat/:id", verifyUserJWT, isUserPresent, findChat);

yoga.post("/createMessage", verifyUserJWT, isUserPresent, createMessage);
yoga.get("/messages/:id", verifyUserJWT, isUserPresent, getMessage);

module.exports = yoga;