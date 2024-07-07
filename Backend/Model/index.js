const dbConfig = require('../Config/db.config.js');

const Sequelize = require('sequelize');
const sequelize = new Sequelize(dbConfig.database, dbConfig.user, dbConfig.password, {
    host: dbConfig.host,
    dialect: dbConfig.dialect,
    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle
    }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require('./user.js')(sequelize, Sequelize);
db.chat = require('./chat.js')(sequelize, Sequelize);
db.chats_user = require('./chats_user.js')(sequelize, Sequelize);
db.chatMessage = require('./chatMessage.js')(sequelize, Sequelize);

db.user.hasMany(db.chats_user, { foreignKey: 'userId', as: 'chats' });

db.chat.hasMany(db.chats_user, { foreignKey: 'chatId', as: 'users' });
db.chats_user.belongsTo(db.chat, { foreignKey: 'chatId', as: 'chats' });

db.chat.hasMany(db.chatMessage, { foreignKey: 'chatId', as: 'messages' });

module.exports = db;