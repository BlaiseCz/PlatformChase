const Game = function () {

    this.world = {

        background_color: "rgba(40,48,56,0.25)",
        friction: 0.5,
        player: new Game.Player(), //current view player
        players: {}, //all players
        height: 72,
        width: 128,

        lava: {
            map: [[25, 60], [35, 55], [99, 10], [45, 66],
                [20, 10], [20, 14], [20, 18], [20, 22], [20, 26], [20, 30],
                [100, 10], [104, 10], [108, 10], [112, 10], [116, 10], [120, 10],
                [44, 48], [48, 48], [52, 48], [56, 48], [60, 48], [64, 48], [68, 48], [72, 48], [76, 48]],
            h: 4,
            w: 4,
        },

        coins: {
            cords: [],
            limit: 20,
            h: 2,
            w: 2,
        },



        updatePlayers: function () {
            this.players['me'] = this.player
        },

        updateCoins: function () {
            if (this.coins.cords.length !== this.coins.limit) {
                let cord_x, cord_y, canDraw = true;
                for (let i = 0; i < this.coins.limit; i++) {
                    while (this.coins.cords.length < this.coins.limit) {

                        cord_x = this.randBetween(0, 126)
                        cord_y = this.randBetween(0, 70)

                        for (let j = 0; j < this.lava.map.length; j++) {
                            if (this.detectCollision(cord_x, cord_y, this.lava.map[j][0], this.lava.map[j][1], 4)) {
                                canDraw = false
                                break
                            }
                        }
                        if (canDraw) {
                            this.coins.cords.push([cord_x, cord_y])
                        }
                        canDraw = true
                    }
                }
            }
        },

        collideWalls: function (player) {

            //map boundaries
            if (player.x < 0) {
                player.x = 0;
                player.velocity_x = 0;
            } else if (player.x + player.width > this.width) {
                player.x = this.width - player.width;
                player.velocity_x = 0;
            }
            if (player.y < 0) {
                player.y = 0;
                player.velocity_y = 0;
            } else if (player.y + player.height > this.height) {
                player.y = this.height - player.height;
                player.velocity_y = 0;
            }

            //map blocks, so called  'lava'
            for (let i = 0; i < this.lava.map.length; i++) {
                if (this.detectCollision(player.x, player.y, this.lava.map[i][0], this.lava.map[i][1], player.width - 1)) {
                    player.x = 10
                    player.y = 10
                    player.velocity_x = 0
                    player.velocity_y = 0

                    player.result -= 10
                    break;
                }
            }
        },


        collideCoins: function (player) {
            for (let i = 0; i < this.coins.cords.length; i++) {
                if (this.detectCoinsCollision(player.x, player.y, this.coins.cords[i][0], this.coins.cords[i][1])) {
                    player.result += 1
                    this.coins.cords.splice(i, 1)
                    break;
                }
            }
        },

        detectCollision: function (p_x, p_y, tile_x, tile_y, rect_side_len) {
            return !(Math.floor(p_x) > tile_x + rect_side_len ||
                Math.floor(p_x) + rect_side_len < tile_x ||
                Math.floor(p_y) > tile_y + rect_side_len ||
                Math.floor(p_y) + rect_side_len < tile_y)
        },

        detectCoinsCollision: function (p_x, p_y, tile_x, tile_y) {
            return !(Math.floor(p_x) > tile_x + 2 ||
                Math.floor(p_x) + 4 < tile_x ||
                Math.floor(p_y) > tile_y + 2 ||
                Math.floor(p_y) + 4 < tile_y)
        },

        update: function () {
            for (const [, player] of Object.entries(this.players)) {
                player.update();
                player.velocity_x *= this.friction;
                player.velocity_y *= this.friction;
                this.collideWalls(player);
                this.collideCoins(player);
                this.updateCoins();
            }
        },
        //HELPER FUNCTIONS
        randBetween: function (min, max) {
            return Math.floor(Math.random() * (max - min) + min
            )
        },
    };

    this.update = function () {
        this.world.update();
    };

    socket.on('updatePlayers', data => {
        if(data.id !== selfID) {
            let newPlayer = new Game.Player()
            newPlayer.color =  "green"
            this.world.players[data.id] = newPlayer
        }
    })

};

Game.prototype = {constructor: Game};


Game.Player = function (x, y, color) {
    this.color = "#0090ff";
    this.id = selfID
    this.height = 4;
    this.width = 4;
    this.velocity_x = 0;
    this.velocity_y = 0;
    this.x = 60;
    this.y = 20;
    this.result = 0;
};

Game.Player.prototype = {

    constructor: Game.Player,

    moveLeft: function () {
        this.velocity_x -= 0.3;
    },
    moveRight: function () {
        this.velocity_x += 0.3;
    },
    moveDown: function () {
        this.velocity_y += 0.3;
    },
    moveUp: function () {
        this.velocity_y -= 0.3;
    },

    update: function () {
        this.x += this.velocity_x;
        this.y += this.velocity_y;

    }
};
