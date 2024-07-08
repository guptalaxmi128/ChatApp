const db = require('../Model');
const { validateUser, userLogin } = require("../Middleware/validation");
const User = db.user;
const { USER_JWT_SECRET_KEY, JWT_VALIDITY } = process.env;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");
const SALT = 10;

exports.register = async (req, res) => {
    try {
        // Validate Body
        const { error } = validateUser(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        }
        // If Email is already present
        const isUser = await User.findOne({
            where: {
                email: req.body.email,
            }
        });
        if (isUser) {
            return res.status(400).send({
                success: false,
                message: "User already present!"
            });
        }
        // Hash password
        const salt = await bcrypt.genSalt(SALT);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        // Create USer in database
        const user = await User.create({
            ...req.body,
            password: hashedPassword
        });
        // generate JWT Token
        const authToken = jwt.sign(
            {
                id: user.id,
                email: req.body.email
            },
            USER_JWT_SECRET_KEY,
            { expiresIn: JWT_VALIDITY } // five day
        );
        // Send final success response
        res.status(200).send({
            success: true,
            message: 'Registered successfully!',
            data: { authToken: authToken, name: req.body.name, email: req.body.email, mobileNumber: req.body.mobileNumber }
        });
    } catch (err) {
        res.status(500).send({
            success: false,
            message: err.message
        });
    }
};

exports.login = async (req, res) => {
    try {
        // Validate Body
        const { error } = userLogin(req.body);
        if (error) {
            console.log(error);
            return res.status(400).send(error.details[0].message);
        }
        // If Email is already present
        const user = await User.findOne({
            where: {
                email: req.body.email
            }
        });
        if (!user) {
            return res.status(400).send({
                success: false,
                message: "Invalid email or password!"
            });
        }
        // Compare password with hashed password
        const validPassword = await bcrypt.compare(
            req.body.password,
            user.password
        );
        if (!validPassword) {
            return res.status(400).send({
                success: false,
                message: "Invalid email or password!"
            });
        }
        // generate JWT Token
        const authToken = jwt.sign(
            {
                id: user.id,
                email: req.body.email
            },
            USER_JWT_SECRET_KEY,
            { expiresIn: JWT_VALIDITY } // five day
        );
        // Send final success response
        res.status(200).send({
            success: true,
            message: 'Loged in successfully!',
            data: { authToken: authToken, name: user.name, email: req.body.email, mobileNumber: user.mobileNumber }
        });
    } catch (err) {
        res.status(500).send({
            success: false,
            message: err.message
        });
    }
};

exports.getMe = async (req, res) => {
    try {
        // If Email is already present
        const user = await User.findOne({
            where: {
                email: req.user.email, id: req.user.id
            }
        });
        // Send final success response
        res.status(200).send({
            success: true,
            message: 'My details successfully!',
            data: user
        });
    } catch (err) {
        res.status(500).send({
            success: false,
            message: err.message
        });
    }
};

exports.getAllUser = async (req, res) => {
    try {
        // If Email is already present
        const user = await User.findAll({
            where: {
                email: { [Op.ne]: req.user.email }
            }
        });
        // Send final success response
        res.status(200).send({
            success: true,
            message: 'User details successfully!',
            data: user
        });
    } catch (err) {
        res.status(500).send({
            success: false,
            message: err.message
        });
    }
};