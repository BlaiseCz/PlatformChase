window.addEventListener("load", function (event) {

    "use strict";

    const keyPressed = function (event) {
        controller.moveKey(event.type, event.keyCode);
    };

    const resize = function (event) {
        display.resize(document.documentElement.clientWidth - 32, document.documentElement.clientHeight - 32, game.world.height / game.world.width);
        display.render();

        let rectangle = display.context.canvas.getBoundingClientRect();

        p.style.left = (rectangle.left - 220) + "px";
        p.style.top = rectangle.top + "px";
        p.style.fontSize = "25px";
    };

    const render = function () {
        display.fill(game.world.background_color);
        display.drawRectanglesFromCords(game.world.lava.map, game.world.lava.h, game.world.lava.w, "red");
        display.drawRectanglesFromCords(game.world.coins.cords, game.world.coins.h, game.world.coins.w, "yellow");
        let text = ""
        for (const [key, player] of Object.entries(game.world.players)) {
            display.drawRectangle(player.x, player.y, player.width, player.height, player.color)
           text += "Player " + key + ": " + player.result + "  <br>  "
        }
        p.innerHTML = text
        display.render();
    };

    const update = function () {
        game.world.makeMoveWithBot();

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

    const game = new Game();
    const controller = new Controller();
    const display = new Display(document.querySelector("canvas"));
    const engine = new Engine(1000 / 24, render, update);

    const p = document.createElement("p");

    p.setAttribute("style", "color:#c07000; font-size:2.0em; position:fixed;");
    document.body.appendChild(p);

    display.buffer.canvas.height = game.world.height;
    display.buffer.canvas.width = game.world.width;

    window.addEventListener("keydown", keyPressed);
    window.addEventListener("keyup", keyPressed);
    window.addEventListener("resize", resize);

    game.world.updateCoins()
    game.world.updatePlayers()

    resize();
    engine.start();
});
