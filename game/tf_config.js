const tf = require('@tensorflow/tfjs-node-gpu')

model = tf.sequential();
model.add(tf.layers.dense({ units: 1, inputShape: [200] }));
model.compile({
    loss: 'meanSquaredError',
    optimizer: 'sgd',
    metrics: ['MAE']
});

