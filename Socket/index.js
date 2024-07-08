const { Server } = require("socket.io");

const io = new Server();

const onlineUser = [];
const user = [];
io.on("connection", (socket) => {
    // Online User
    socket.on("onlineUser", (userId, name) => {
        !onlineUser.some((user) => user.userId === userId) &&
            onlineUser.push({
                userId: userId,
                socketId: socket.id,
                name: name
            })
    });
    io.emit("getOnlineUser", onlineUser);

    // Send Message
    // socket.on("messageSend", message => {
    //     socket.broadcast.emit("messageReceive", { message: message, userName: });
    // })
});

io.listen(3000);