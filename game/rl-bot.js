const RlModel = function (numStatesSize, numActions, batchSize) {

    this.numStatesSize = numStatesSize;
    this.numActions = numActions;
    this.batchSize = batchSize;

    this.epsilon = 0.001;

    console.log('model init')
    this.model = tf.sequential({
        layers: [
            tf.layers.dense({units: 32, inputShape: [this.numStatesSize]}), //state input size
            tf.layers.dense({units: 64}),
            tf.layers.dense({units: 16}),
            tf.layers.dense({units: this.numActions})] //output -> 5 moves
    });

    this.model.compile({
        loss: 'meanSquaredError',
        optimizer: 'sgd',
        metrics: ['MAE']
    });

    console.log(this.model)

    this.train = function () {

    }

    this.makeMove = function (gameState, learning) {
        if(!learning) {
            return this.getNextAction(gameState)
        }

        if (Math.random() < this.epsilon) {
            return this.randomMove(); //explore
        } else {
            return this.getNextAction(gameState) //exploit
        }
    };

    this.randomMove = function () {
        return Math.floor(Math.random() * 6) + 1
    }

    this.getNextAction = function (gameState){
        let state = tf.tensor(gameState)
        let actions = this.model.predict(state)
        return tf.argMax(actions)
    }
}

