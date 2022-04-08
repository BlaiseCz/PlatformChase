let QLMemory = class {
    constructor(max_size) {
        this.mem_size = max_size
        this.mem_cntr = 0
        this.action_memory = []
        this.reward_memory = []
        this.observation_memory = []
        this.next_observation_memory = []
    }

    save(prev_state, action, reward, current_state) {
        let index = this.mem_cntr % this.mem_size
        this.observation_memory[index] = prev_state
        this.next_observation_memory[index] = current_state
        this.reward_memory[index] = reward
        this.action_memory[index] = action

        this.mem_cntr += 1
    }

    pickBatches(batch) {
        let observation_batch = []
        let next_observation_batch = []
        let reward_batch = []
        let action_batch = []

        for(let i = 0; i < batch.length; i++) {
            observation_batch[i] = this.observation_memory[batch[i]]
            next_observation_batch[i] = this.next_observation_memory[batch[i]]
            reward_batch[i] = this.reward_memory[batch[i]]
            action_batch[i] = this.action_memory[batch[i]]
        }

        return [action_batch, next_observation_batch, observation_batch, reward_batch]
    }

};

const RlModel = function (numStatesSize, numActions, memory_size, map) {

    this.verbose = false

    this.numStatesSize = numStatesSize;
    this.numActions = numActions;
    this.map = map

    this.batch_size = 32

    this.memory = new QLMemory(memory_size, this.numStatesSize)

    this.epsilon = 0.9;
    this.eps_dec = 0.01;
    this.eps_min = 0.01;
    this.gamma = 0.97;

    this.model = tf.sequential({
        layers: [
            tf.layers.dense({units: 64, inputShape: [this.numStatesSize], activation: 'relu' }), //state input size
            tf.layers.dense({units: 128, activation: 'relu'}),
            tf.layers.dense({units: this.numActions, activation: 'softmax'})] //output -> 5 moves (nothing,up,down,right,left)
    });

    this.model.compile({
        loss: 'meanSquaredError',
        optimizer: 'sgd',
        metrics: ['MAE']
    });

    if(this.verbose) {
        console.log(this.model.summary())
    }

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

        if(this.verbose) {
            console.log(batch_data)
        }

        let action_batch = batch_data[0]
        let next_observation_batch = batch_data[1]
        let observation_batch = batch_data[2]
        let reward_batch = batch_data[3]

        let q_eval = [],
            q_target = [],
            q_next;

        console.log(observation_batch)
        console.log(reward_batch)

        reward_batch = reward_batch.map(value => isNaN(value) ? 0 : value);

        for(let i = 0; i < batch.length; i++) { //TODO
            if(next_observation_batch[i] !== undefined || observation_batch[i] !== undefined) {
                let obs_tensor = tf.tensor1d(observation_batch[i]);
                let next_obs_tensor = tf.tensor1d(next_observation_batch[i]);

                q_eval[i] = this.model.predict(obs_tensor.reshape([-1, this.numStatesSize])).reshape([5])
                q_eval[i] = q_eval[i].dataSync()[action_batch[i]]

                q_next = this.predictMove(next_obs_tensor)
                q_target[i] = reward_batch[i] + this.gamma * q_next
            } else {
                q_target[i] = 0
                q_eval[i] = 0
            }
        }

        console.log(this.model.summary())
        this.model.optimizer.minimize(() => this.model.loss(q_target, q_eval));

        if (this.epsilon > this.eps_min) {
            this.epsilon = this.epsilon - this.eps_dec
        } else {
            this.epsilon = this.eps_min
        }
    }

    this.predictMove = function (gameState, learning= true) {
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
        return Math.floor(Math.random() * 5)
    }

    this.getNextAction = function (gameState){
        let actions = this.model.predict(gameState.reshape([-1, gameState.shape[0]]))
        let arr = actions.dataSync()
        return [].map.call(arr, (x, i) => [x, i]).reduce((r, a) => (a[0] > r[0] ? a : r))[1];
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

