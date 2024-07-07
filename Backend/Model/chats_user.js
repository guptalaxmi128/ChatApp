module.exports = (sequelize, DataTypes) => {
    const Chat_User = sequelize.define("chats_users", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        userName: {
            type: DataTypes.STRING
        }
    });

    return Chat_User;
};

// userId
// chatId