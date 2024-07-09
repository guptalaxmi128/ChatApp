module.exports = (sequelize, DataTypes) => {
    const Chat = sequelize.define("chats", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        chatType: {
            type: DataTypes.STRING,
            validate: {
                isIn: [['Private', 'Group']]
            }
        },
        groupName: {
            type: DataTypes.STRING
        }
    });
    return Chat;
};