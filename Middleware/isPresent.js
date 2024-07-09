const db = require('../Model');
const User = db.user;
const { Op } = require("sequelize");

exports.isUserPresent = async (req, res, next) => {
    try {
        const user = await User.findOne({
            where: {
                [Op.and]: [
                    { id: req.user.id }, { email: req.user.email }
                ]
            }
        });
        if (!user) {
            return res.send({
                message: "user is not present! Are you register?.. "
            })
        }
        next();
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
}