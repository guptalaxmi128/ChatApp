const joi = require('joi');

exports.validateUser = (data) => {
    const schema = joi.object().keys({
        fullName: joi.string().min(3).max(50).required(),
        email: joi.string().email().optional().label('Email'),
        mobileNumber: joi.string().length(10).pattern(/^[0-9]+$/).optional(),
        password: joi.string()
            // .regex(RegExp(pattern))
            .required()
            .min(8)
            .max(8)
    });
    return schema.validate(data);
}

exports.userLogin = (data) => {
    const schema = joi.object().keys({
        email: joi.string().email().required().label('Email'),
        password: joi.string()
            // .regex(RegExp(pattern))
            .required()
            .min(8)
            .max(8)
    })//.options({ allowUnknown: true });
    return schema.validate(data);
}

exports.createPrivateChat = (data) => {
    const schema = joi.object().keys({
        secondId: joi.string().required()
    });
    return schema.validate(data);
}

exports.createMessage = (data) => {
    const schema = joi.object().keys({
        chatId: joi.string().required(),
        message: joi.string().required()
    });
    return schema.validate(data);
}