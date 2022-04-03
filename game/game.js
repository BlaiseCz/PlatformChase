const Game = function (map) {

    this.duration = 10000;
    this.game_num = 1;

    this.world = {
        background_color: "rgba(40,48,56,1)",
        friction: 0.5,
        players: {}, //all players
        height: 100,
        width: 128,

        lava: {
            map: map,
            h: 4,
            w: 4,
        },

        coins: {
            cords: [],
            limit: 80,
            h: 2,
            w: 2,
        },

        //players
        // human_player: new Game.Player("me", "#0090ff"), //current view player
        // bot: new Game.Player("bot1", "#37ab84"), //random bot
        rl_bot: new Game.Player("rl_bot1", "#ee038e", map), //rl bot

        resetState: function () {
            let results = []

            for (const [, player] of Object.entries(this.players)) {
                let score = player.score
                let name = player.name

                results.push(
                    {
                        "name": name,
                        "score": score
                    })
                player.resetState()
            }

            let best_score = 0
            for (let i = 0; i < results.length; i++) {
                if (results[i].score >= best_score) {
                    best_score = results[i].score
                }
            }

            for (let i = 0; i < results.length; i++) {
                if (results[i].score === best_score) {
                    this.players[results[i].name].wins += 1
                }
            }

            this.coins.cords = []
            this.updatePlayers()
            this.updateCoins()
        },

        makeMoveWithBot: function () {
            for (const [, player] of Object.entries(this.players)) {
                if (player.name === "bot1") {
                    player.randomMove()
                } else if (player.name === "rl_bot1") {
                    player.learnedMove(this.coins.cords)
                }
            }
        },

        learn_bots: function (previous_coins_setup, previous_player_state, coins_cords) {
            for (const [, player] of Object.entries(this.players)) {
                if (player.name === "rl_bot1") {
                    let reward = player.score - player.prev_score
                    let prev_state = {
                        'coinsCords' : previous_coins_setup,
                        'playerCords': [previous_player_state.x, previous_player_state.y]
                    }

                    let current_state = {
                        'coinsCords' : coins_cords,
                        'playerCords': [this.x, this.y]
                    }

                    console.log('learning')
                    console.log(prev_state, player.last_action, reward, current_state)
                    player.train(prev_state, player.last_action, reward, current_state)
                }
            }
        },

        updatePlayers: function () {
            // this.players['me'] = this.human_player
            // this.players['bot1'] = this.bot
            this.players['rl_bot1'] = this.rl_bot
        },

        updateCoins: function () {
            if (this.coins.cords.length !== this.coins.limit) {
                let cord_x, cord_y, canDraw = true;
                for (let i = 0; i < this.coins.limit; i++) {
                    while (this.coins.cords.length < this.coins.limit) {

                        cord_x = this.randBetween(0, 126)
                        cord_y = this.randBetween(0, 98)

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

                    player.score -= 5
                    break;
                }
            }
        },

        collideCoins: function (player) {
            for (let i = 0; i < this.coins.cords.length; i++) {
                if (this.detectCoinsCollision(player.x, player.y, this.coins.cords[i][0], this.coins.cords[i][1])) {
                    player.score += 1
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
                player.prev_score = player.score
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
};

Game.prototype = {constructor: Game};


Game.Player = function (type, color, map) {
    this.name = type
    this.color = color;
    this.height = 4;
    this.width = 4;
    this.velocity_x = 0;
    this.velocity_y = 0;
    this.x = 60;
    this.y = 20;
    this.score = 0;
    this.prev_score = 0;
    this.wins = 0;
    this.last_action = 0

    if(type === 'rl_bot1') { //
        let memory_size = 1000
        let actions = 5
        let state_size = 58
        this.model = new RlModel(state_size, actions,  memory_size, map)
    }
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
    },

    resetState: function () {
        this.velocity_x = 0;
        this.velocity_y = 0;
        this.x = 60;
        this.y = 20;
        this.score = 0;
    },

    randomMove: function () {
        const randomMove = Math.floor(Math.random() * 6) + 1
        this.makeMove(randomMove)
    },

    learnedMove: function (coinsCords) {
        let move = this.model.predictMove({
            'coinsCords' : coinsCords,
            'playerCords': [this.x, this.y]
        }, false)

        this.makeMove(move)
    },

    train: function (prev_state, action, reward, current_state) {
      this.model.train(prev_state, action, reward, current_state)
    },

    makeMove: function (moveNum) {
        console.log('move num ', moveNum)
        switch (moveNum) {
            case 1:
                this.moveRight()
                break
            case 2:
                this.moveLeft()
                break
            case 3:
                this.moveUp()
                break
            case 4:
                this.moveDown()
                break
            default:
                // console.log("doing nothing")
        }
        this.last_action = moveNum
    },
};

