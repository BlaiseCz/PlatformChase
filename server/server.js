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
        console.log("New player connected, with id: "+socket.id);
        players[socket.id] = data;
        console.log("Current number of players: "+Object.keys(players).length);
        console.log("players dictionary: ", players);

        console.log(data)
        let player = {
            id: socket.id
        }
        io.emit('updatePlayers', player);
    })

    socket.on('update', data=> {
        players[socket.id] = data;
        console.log(`${data.x} -- ${data.y}`)
    })

    socket.on('disconnect', function(){
        delete players[socket.id];
        console.log("Goodbye cli-client with id "+socket.id);
        console.log("Current number of players: "+Object.keys(players).length);
        console.log("players dictionary: ", players);
        io.emit('playerDisconnected', players);
    })


    socket.on('updatePosition', data => {
        players[socket.id] = data
        console.log(socket.id)
        console.log(`${data.x} -- ${data.y}`)

        io.emit()
    })
}