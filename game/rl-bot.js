const RlModel = function (hiddenSize, numStates, numActions, batchSize) {

    this.numStates = numStates;
    this.numActions = numActions;
    this.batchSize = batchSize;

    console.log('model init')

    this.makeMove = function () {
        console.log()
        return 2;
    };
}

