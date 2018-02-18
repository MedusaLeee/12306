const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const jarPath = path.resolve(__dirname, '../lib/imageViewer-1.0-shaded.jar');
const imagePath = path.resolve(__dirname, '../constants/captcha.jpeg');
const paramArr = ['-jar', jarPath];

const child = spawn('java', paramArr);
child.on('exit', (code) => {
    console.log('jar exec exit: ', code);
});

child.on('error', (err) => {
    console.log('jar exec err: ', err);
});

fs.createReadStream(imagePath).pipe(child.stdin);
