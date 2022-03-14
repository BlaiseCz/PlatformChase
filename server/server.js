const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server, {
    cors: {
        origin: '*',
    }
});

app.get('/', (req, res) => {
    res.send('Hello World!')
})

io.on('connection', connected)

server.listen(3000, () => {
    console.log('listening on *:3000');
});

let players = {};

function connected(socket) {
    socket.on('newPlayer', data => {
        console.log("New cli-client connected, with id: "+socket.id);
        players[socket.id] = data;
        console.log("Current number of players: "+Object.keys(players).length);
        console.log("players dictionary: ", players);
        io.emit('updatePlayers', players);
    })

    socket.on('update', data=> {
        players[socket.id] = data;
        console.log(`${data.position_x} -- ${data.position_y}`)
    })

    socket.on('disconnect', function(){
        delete players[socket.id];
        console.log("Goodbye cli-client with id "+socket.id);
        console.log("Current number of players: "+Object.keys(players).length);
        console.log("players dictionary: ", players);
        io.emit('updatePlayers', players);
    })

    socket.on('ClientClientHello', data => {
        socket.broadcast.emit('ServerClientHello', data);
    })

    socket.on('updatePosition', data => {
        players[socket.id] = data
        console.log('move by ' + socket.id)
        console.log(`${data.position_x} -- ${data.position_y}`)
    })
}