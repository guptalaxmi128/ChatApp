const { Server } = require("socket.io");

const io = new Server();

const onlineUser = [];
const user = [];
io.on("connection", (socket) => {
    // Online User
    socket.on("onlineUser", (userId) => {
        !onlineUser.some((user) => user.userId === userId) &&
            onlineUser.push({
                userId: userId,
                socketId: socket.id
            })
    });
    io.emit("getOnlineUser", onlineUser);
});

io.listen(3000);