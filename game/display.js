const Display = function(canvas) {

    this.coinsLimit = 5;
    this.coinHeight = 2;
    this.coinsCords = [];

    this.buffer  = document.createElement("canvas").getContext("2d");
    this.context = canvas.getContext("2d");

    this.drawMap = function (map) {
        for (let i = 0; i < map.length; i++) {
            this.drawRectangle(map[i][0], map[i][1], 4, 4, "black")
        }
    };

    this.drawCoins = function(map) {
        if(this.coinsCords.length !== this.coinsLimit) {
            let cord_x, cord_y, canDraw;

            for (let i = 0; i < this.coinsLimit; i++) {
                canDraw = true
                while (this.coinsCords.length < this.coinsLimit) {
                    cord_x = randBetween(0, 126)
                    cord_y = randBetween(0, 70)
                    for (let j = 0; j < map.length; j++) {
                        if (this.detectCollision(cord_x, cord_y, map[j][0], map[j][1])) {
                            canDraw = false
                        }
                    }
                    if (canDraw) {
                        this.coinsCords.push([cord_x, cord_y])
                    }
                }
            }
        }
        for(let i = 0; i < this.coinsLimit; i++) {
            this.drawRectangle(this.coinsCords[i][0], this.coinsCords[i][1], 2, 2, "yellow")
        }
    };

    this.detectCollision = function (random_x, random_y, tile_x, tile_y) {
        return !(random_x > tile_x + 4 || random_x + this.coinHeight < tile_x || random_y > tile_y + 4 || random_y + this.coinHeight < tile_y)
    }

    this.drawRectangle = function(x, y, width, height, color) {
        this.buffer.fillStyle = color;
        this.buffer.fillRect(Math.floor(x), Math.floor(y), width, height);
    };

    this.fill = function(color) {
        this.buffer.fillStyle = color;
        this.buffer.fillRect(0, 0, this.buffer.canvas.width, this.buffer.canvas.height);
    };

    this.render = function() { this.context.drawImage(this.buffer.canvas, 0, 0, this.buffer.canvas.width, this.buffer.canvas.height, 0, 0, this.context.canvas.width, this.context.canvas.height); };

    this.resize = function(width, height, height_width_ratio) {

        if (height / width > height_width_ratio) {
            this.context.canvas.height = width * height_width_ratio;
            this.context.canvas.width = width;
        } else {
            this.context.canvas.height = height;
            this.context.canvas.width = height / height_width_ratio;
        }
        this.context.imageSmoothingEnabled = false;
    };
};

Display.prototype = {
    constructor : Display
};

function randBetween(min, max) {
    return Math.floor(
        Math.random() * (max - min) + min
    )
}