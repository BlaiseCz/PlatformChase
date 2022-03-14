window.addEventListener("load", function (event) {

    "use strict";

    var keyPressed = function (event) {
        controller.moveKey(event.type, event.keyCode);
    };

    var resize = function (event) {
        display.resize(document.documentElement.clientWidth - 32, document.documentElement.clientHeight - 32, game.world.height / game.world.width);
        display.render();

        var rectangle = display.context.canvas.getBoundingClientRect();

        p.style.left = (rectangle.left - 220) + "px";
        p.style.top  = rectangle.top + "px";
        p.style.fontSize = "25px";
    };

    var render = function () {
        display.fill(game.world.background_color);
        display.drawRectangle(game.world.player.x, game.world.player.y, game.world.player.width, game.world.player.height, game.world.player.color);
        display.drawRectanglesFromCords(game.world.lava.map, game.world.lava.h, game.world.lava.w, "red");
        display.drawRectanglesFromCords(game.world.coins.cords, game.world.coins.h, game.world.coins.w, "yellow");

        p.innerHTML = "Player1: " + game.world.player.result;

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
    var engine = new Engine(1000 / 24, render, update);

    var p = document.createElement("p");
    p.setAttribute("style", "color:#c07000; font-size:2.0em; position:fixed;");
    p.innerHTML = "Player1: 0";
    document.body.appendChild(p);

    display.buffer.canvas.height = game.world.height;
    display.buffer.canvas.width = game.world.width;

    window.addEventListener("keydown", keyPressed);
    window.addEventListener("keyup", keyPressed);
    window.addEventListener("resize", resize);

    game.world.updateCoins()

    resize();
    engine.start();
});
