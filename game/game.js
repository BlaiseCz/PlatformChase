const Game = function () {

    this.world = {

        background_color: "rgba(40,48,56,0.25)",
        friction: 0.5,
        player: new Game.Player(),
        height: 72,
        width: 128,

        collideObject: function (object) {
            if (object.x < 0) {
                object.x = 0;
                object.velocity_x = 0;
            } else if (object.x + object.width > this.width) {
                object.x = this.width - object.width;
                object.velocity_x = 0;
            }
            if (object.y < 0) {
                object.y = 0;
                object.velocity_y = 0;
            } else if (object.y + object.height > this.height) {
                object.y = this.height - object.height;
                object.velocity_y = 0;
            }
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
    }
};
