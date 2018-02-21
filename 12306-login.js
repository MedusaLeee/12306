const rs = require('readline-sync');
const chalk = require('chalk');
const http = require('./src/http');
const utils  = require('./src/utils');

const logger = utils.getLogger('12306-login');

const login = async() => {
    console.log(chalk.green('12306登录Demo启动...'));
    console.log(chalk.green('正在跳转至登录页面...'));
    await http.redirectToLogin();
    const username = rs.question(chalk.green.underline('请输入账号:') + '\n');
    const password = rs.question(chalk.green.underline('请输入密码:') + '\n', {
        hideEchoBack: true
    });
    console.log(chalk.green('正在获取12306登录验证码...'));
    const stream = await http.getLoginCaptcha();
    console.log(chalk.green('正在加载验证码请等待...'));
    const imageViewProcess = await utils.imageView(stream);
    const captchaNum = rs.question(chalk.green.underline('请输入正确验证码的图片编号?') + '\n');
    imageViewProcess.kill('SIGHUP');
    // 通过图片编号获取验证码图片坐标
    const captchaStr = utils.getCaptchaString(captchaNum);
    logger.debug('captchaStr: ', captchaStr);
    console.log(chalk.green('正在执行登录验证码校验...'));
    await http.loginCaptchaCheck(captchaStr);
    console.log(chalk.green('正在执行用户名/密码校验...'));
    await http.doLogin(username, password);
    console.log(chalk.green('正在执行用户会话校验...'));
    const newAppTk = await http.authUamtk();
    console.log(chalk.green('正在执行oauth客户端会话校验...'));
    const resp = await http.uamAuthClient(newAppTk);
    logger.debug('resp: ', resp);
    console.log(chalk.green('登录成功...'));
};

login().then();


