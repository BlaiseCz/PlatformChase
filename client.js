const socket = io('http://localhost:3000')

socket.on("connect", () => {
    console.log(socket.id);
    socket.emit('clientToServer', "Hello, server! " + socket.id)
});

socket.on('serverToClient', (data) => {
    console.log(data)
})

