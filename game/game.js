const Game = function () {

    this.world = {

        background_color: "rgba(40,48,56,0.25)",
        friction: 0.5,
        player: new Game.Player(),
        height: 72,
        width: 128,

        map: [[25,60], [35, 55], [99,10], [45, 66],
            [20, 10],[20, 14],[20, 18],[20, 22],[20, 26],[20, 30],
            [100, 10],[104, 10],[108,10],[112,10],[116,10],[120,10],
            [44,48], [48,48], [52,48], [56, 48], [60, 48], [64, 48], [68, 48], [72, 48], [76,48]],

        collideObject: function (player) {

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

            //map blocks
            for (let i = 0; i < this.map.length; i++) {
                if(this.detectCollision(player, this.map[i][0], this.map[i][1])) {
                    console.log(player.x + ' ' + player.y)
                    console.log(this.map[i])
                    player.x = 10
                    player.y = 10
                    player.velocity_x = 0
                    player.velocity_y = 0
                    break;
                }
            }
        },

        detectCollision: function(player, tile_x, tile_y) {
            return !(player.x>tile_x+4 || player.x + player.width < tile_x || player.y > tile_y + 4 || player.y + player.height < tile_y)
        },

        update: function () {
            this.player.update();
            this.player.velocity_x *= this.friction;
            this.player.velocity_y *= this.friction;
            this.collideObject(this.player);
        }
    };

    this.update = function () {
        this.world.update();
    };

};

Game.prototype = {constructor: Game};

Game.Player = function (x, y) {
    this.color = "#ff0000";
    this.height = 4;
    this.width = 4;
    this.velocity_x = 0;
    this.velocity_y = 0;
    this.x = 50;
    this.y = 10;
};

Game.Player.prototype = {

    constructor: Game.Player,

    moveLeft: function () {
        this.velocity_x -= 0.5;
    },
    moveRight: function () {
        this.velocity_x += 0.5;
    },
    moveDown: function () {
        this.velocity_y += 0.5;
    },
    moveUp: function () {
        this.velocity_y -= 0.5;
    },

    update: function () {
        this.x += this.velocity_x;
        this.y += this.velocity_y;

        socket.emit('updatePosition',
            {
                position_x: this.x,
                position_y: this.y
        })
    }
};
