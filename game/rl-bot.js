let QLMemory = class {
    constructor(max_size, input_dims) {
        this.mem_size = max_size
        this.mem_cntr = 0
        this.observation_memory = []
        this.next_observation_memory = []
        this.action_memory = []
        this.reward_memory = []
    }

    save(prev_state, action, reward, current_state) {
        let index = this.mem_cntr % this.mem_size
        this.observation_memory[index] = prev_state
        this.next_observation_memory[index] = current_state
        this.reward_memory[index] = reward
        this.action_memory[index] = action

        this.mem_cntr += 1

        console.log('index: ', index, ' memory_cntr: ', this.mem_cntr)
        console.log(this.reward_memory)
    }

    pickBatches(batch) {
        console.log('pickingBatches')
        let observation_batch = []
        let new_observation_batch = []
        let reward_batch = []
        let action_batch = []

        for(let i = 0; i < batch.length; i++) {
            observation_batch[i] = this.observation_memory.indexOf(batch[i], 0)
            new_observation_batch[i] = this.next_observation_memory.indexOf(batch[i], 0)
            reward_batch[i] = this.reward_memory.indexOf(batch[i], 0)
            action_batch[i] = this.action_memory.indexOf(batch[i], 0)
        }

        console.log(action_batch)
        return [action_batch, new_observation_batch, observation_batch, reward_batch]
    }

};

const RlModel = function (numStatesSize, numActions, memory_size, map) {

    this.numStatesSize = numStatesSize;
    this.numActions = numActions;
    this.map = map

    this.batch_size = 16

    this.memory = new QLMemory(memory_size, this.numStatesSize)

    this.epsilon = 0.95;
    this.eps_dec = 0.01;
    this.eps_min = 0.01;

    this.model = tf.sequential({
        layers: [
            tf.layers.dense({units: 64, inputShape: [this.numStatesSize], activation: 'relu' }), //state input size
            tf.layers.dense({units: 128, activation: 'relu'}),
            tf.layers.dense({units: this.numActions, activation: 'softmax'})] //output -> 5 moves
    });

    this.model.compile({
        loss: 'meanSquaredError',
        optimizer: 'sgd',
        metrics: ['MAE']
    });

    console.log(this.model.summary())


    this.train = function (prev_state, action, reward, current_state) {
        this.memory.save(prev_state, action, reward, current_state)
        this.learn()
    }

    this.learn = function () {
        if(this.memory.mem_cntr < this.batch_size) {
            return
        }

        let max_mem = Math.min(this.memory.mem_cntr, this.memory.mem_size)
        let batch = this.getRandomIntListNoRepeat(max_mem, this.batch_size)
        let batch_data = this.memory.pickBatches(batch)

        let action_batch = batch_data[0]
        let new_observation_batch = batch_data[1]
        let observation_batch = batch_data[2]
        let reward_batch = batch_data[3]

        console.log(batch_data)
        let q_eval = this.predictMove(observation_batch)
        let q_next = this.predictMove(new_observation_batch)

        console.log(q_next)
        let q_target = reward_batch + this.gamma * Math.max(q_next)
        //
        // loss = self.Q_eval.loss(q_target, q_eval).to(self.Q_eval.device)
        // loss.backward()
        // self.Q_eval.optimizer.step()

        if (this.epsilon > this.eps_min) {
            this.epsilon = this.epsilon - this.eps_dec
        } else {
            this.epsilon = this.eps_min
        }
    }

    this.predictMove = function (gameState, learning= true) {
        let distancesToLava = this.getPlayerDistanceToLava(gameState['playerCords'])
        let distancesToCoins = this.getPlayerDistanceToCoins(gameState['coinsCords'],gameState['playerCords'])

        let state = distancesToCoins.concat(distancesToLava);
        console.log(state.dataSync())

        if(!learning) {
            return this.getNextAction(state)
        }

        if (Math.random() < this.epsilon) {
            return this.randomMove(); //explore
        } else {
            return this.getNextAction(state) //exploit
        }
    };

    this.randomMove = function () {
        return Math.floor(Math.random() * 6) + 1
    }

    this.getNextAction = function (gameState){
        let actions = this.model.predict(gameState.reshape([-1, gameState.shape[0]]))
        let arr = actions.dataSync()
        return [].map.call(arr, (x, i) => [x, i]).reduce((r, a) => (a[0] > r[0] ? a : r))[1];
    }

    //HELPER FUNCTIONS - STATE
    this.getPlayerDistanceToLava = function (playerPos) {
        let playerLavaDistance = []
        for(let i = 0; i < this.map.length ; i++) {
            let distance = this.getDistance(playerPos[0], playerPos[1], this.map[i][0], this.map[i][1])
            playerLavaDistance.push(distance)
        }

        playerLavaDistance = playerLavaDistance.sort().slice(0,8)
        return tf.tensor1d(playerLavaDistance);
    }

    this.getPlayerDistanceToCoins = function (coinsCords, playerPos) {
        let playerCoinsDistance = []
        for(let i = 0; i < coinsCords.length ; i++) {
            let distance = this.getDistance(playerPos[0], playerPos[1], coinsCords[i][0], coinsCords[i][1])
            playerCoinsDistance.push(distance)
        }

        playerCoinsDistance = playerCoinsDistance.sort().slice(0,50)
        return tf.tensor1d(playerCoinsDistance);
    }

    this.getDistance = function(x1, y1, x2, y2){
        let y = x2 - x1;
        let x = y2 - y1;
        return Math.sqrt(x * x + y * y);
    }

    //HELPER GENERAL

    this.getRandomIntListNoRepeat = function(max, r) {
        let numbers = []; // new empty array
        let n, p;
        let min = 0;

        for (let i = 0; i < r; i++) {
            do {
                n = Math.floor(Math.random() * (max - min + 1)) + min;
                p = numbers.includes(n);
                if(!p){
                    numbers.push(n);
                }
            }
            while(p);
        }

        return numbers
    }

}

