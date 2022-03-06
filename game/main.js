window.addEventListener("load", function (event) {

    "use strict";

    var keyPressed = function (event) {
        controller.moveKey(event.type, event.keyCode);
    };


    var resize = function (event) {
        display.resize(document.documentElement.clientWidth - 32, document.documentElement.clientHeight - 32, game.world.height / game.world.width);
        display.render();
    };

    var render = function () {
        display.fill(game.world.background_color);// Clear background to game's background color.
        display.drawRectangle(game.world.player.x, game.world.player.y, game.world.player.width, game.world.player.height, game.world.player.color);
        display.render();
    };

    var update = function () {
        if (controller.left.active) {
            game.world.player.moveLeft();
        }
        if (controller.right.active) {
            game.world.player.moveRight();
        }
        if (controller.down.active) {
            game.world.player.moveDown();
        }
        if (controller.up.active) {
            game.world.player.moveUp();
        }
        game.update();
    };

    var controller = new Controller();
    var display = new Display(document.querySelector("canvas"));
    var game = new Game();
    var engine = new Engine(1000 / 30, render, update);


    display.buffer.canvas.height = game.world.height;
    display.buffer.canvas.width = game.world.width;

    window.addEventListener("keydown", keyPressed);
    window.addEventListener("keyup", keyPressed);
    window.addEventListener("resize", resize);

    resize();

    engine.start();

});
