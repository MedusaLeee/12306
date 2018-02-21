const rs = require('readline-sync');
const chalk = require('chalk');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const jarPath = path.resolve(__dirname, '../lib/imageViewer-1.0-shaded.jar');
const imagePath = path.resolve(__dirname, '../constants/captcha.jpeg');
const paramArr = ['-jar', jarPath];

console.log(chalk.green('正在加载验证码请等待...'));
const child = spawn('java', paramArr);

child.on('exit', (code) => {
    console.log('jar exec exit: ', code);
});

child.on('error', (err) => {
    console.log('jar exec err: ', err);
    process.exit(0);
});

const readStream = fs.createReadStream(imagePath).pipe(child.stdin);

readStream.on('close', () => {
    const captchaString = rs.question(chalk.green.underline('请输入正确验证码的图片编号?') + '\n');
    console.log(`输入的内容为：${captchaString}!`);
    child.kill('SIGHUP');
});