const io = require("socket.io-client");
const socket = io('http://localhost:3000')

let players = {}
let selfID;

socket.on("connect", () => {
    selfID = socket.id
    console.log(socket.id);
    socket.emit('clientToServer', "Hello, server! " + socket.id)
});

socket.on('updatePlayers', data=> {
    players = data
    console.log("players dictionary: ", players);
    console.log("Current number of players: "+Object.keys(players).length);
})

socket.emit('newPlayer', { position_x: 11, position_y:11 })
