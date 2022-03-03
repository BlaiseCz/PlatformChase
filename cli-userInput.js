const readline = require('readline');
readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);
process.stdin.on('keypress', (str, key) => {
    if (key.ctrl && key.name === 'c') {
        process.exit();
    } else if (key.name === 'left') {
        console.log('lewo')
    } else if (key.name === 'right') {
        console.log('prawo')
    } else if (key.name === 'up') {
        console.log('skok')
    }
    else {
        console.log(`You pressed the "${str}" key`);
        console.log();
        console.log(key);
        console.log();
    }
});
console.log('Press any key...');