const tf = require('@tensorflow/tfjs')

const model = tf.sequential({
    layers: [
        tf.layers.dense({inputShape: 126, units: 32, activation: 'relu'}),
        tf.layers.dense({units: 64, activation: 'relu'}),
        tf.layers.dense({units: 5, activation: 'softmax'}),
    ],
    optimizer: tf.train.adam({learningRate: 0.001, epsilon: 0.0001}),
    loss: 'meanSquaredError'
});

console.log(model.summary())
