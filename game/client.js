const socket = io('http://localhost:3000')
let players = {}
let selfID;

socket.on("connect", () => {
    selfID = socket.id
    console.log(socket.id);
});

socket.on('updatePlayers', data => {
    players = data
    console.log("players dictionary: ", players);
    console.log("Current number of players: " + Object.keys(players).length);
})

socket.emit('newPlayer')