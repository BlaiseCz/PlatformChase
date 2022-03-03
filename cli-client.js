const io = require("socket.io-client");
const socket = io('http://localhost:3000')
const readline = require('readline');
readline.emitKeypressEvents(process.stdin);

let players = {}
let selfID;

socket.on("connect", () => {
    selfID = socket.id
    console.log(socket.id);
    socket.emit('clientToServer', "Hello, server! " + socket.id)
});

socket.on('updatePlayers', data => {
    players = data
    console.log("players dictionary: ", players);
    console.log("Current number of players: " + Object.keys(players).length);
})

socket.emit('newPlayer', {position_x: 11, position_y: 11})

cliMovesListener()

function userCommands(data) {
    socket.emit('userCommands', data)
}

function cliMovesListener() {
    process.stdin.setRawMode(true);
    process.stdin.on('keypress', (str, key) => {
        if (key.ctrl && key.name === 'c') {
            process.exit();
        } else if (key.name === 'left') {
            console.log('lewo')
            players[selfID].position_x -=1
            userCommands({position_x: players[selfID].position_x, position_y: players[selfID].position_y})
        } else if (key.name === 'right') {
            console.log('prawo')
            players[selfID].position_x += 1
            userCommands({position_x: players[selfID].position_x, position_y: players[selfID].position_y})
        } else if (key.name === 'up') {
            console.log('skok')
            players[selfID].position_y +=1
            userCommands({position_x: players[selfID].position_x, position_y: players[selfID].position_y})
        }
    });
    console.log('Press any key...');
}