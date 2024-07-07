module.exports = (sequelize, DataTypes) => {
    const Message = sequelize.define("messages", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        message: {
            type: DataTypes.STRING
        },
        senderId: {
            type: DataTypes.STRING
        }
    });
    return Message;
};