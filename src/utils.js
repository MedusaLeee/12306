const axios = require('axios');
const tough = require('tough-cookie');
const rua = require('random-useragent');
const log4js = require('log4js');
const path = require('path');
const { spawn } = require('child_process');
const querystring = require('querystring');
const axiosCookieJarSupport = require('@3846masa/axios-cookiejar-support').default;

axiosCookieJarSupport(axios);
const cookieJar = new tough.CookieJar();

const getLogger = (category) => {
    const logger = log4js.getLogger(category);
    logger.level = process.env.LEVEL || 'info';
    return logger;
};

const logger = getLogger('Utils');

/**
 * 使用cookieJar封装axios的get请求
 * @param url
 * @param option
 * @returns {Promise<void>}
 */
const httpGet = async(url, option) => {
    const ua = rua.getRandom();
    const headers = {
        'User-Agent': ua,
        'Host': 'kyfw.12306.cn',
        'Origin': 'https://kyfw.12306.cn',
        'Pragma': 'no-cache',
        ...option.headers
    };
    option.headers = headers;
    const newOption = {
        jar: cookieJar,
        withCredentials: true,
        ...option
    };
    return axios.get(url, newOption);
};

/**
 * 使用cookieJar封装axios的post请求
 * @param url
 * @param body
 * @param option
 * @returns {Promise<AxiosPromise<any>>}
 */
const httpPost = async(url, body, option) => {
    const ua = rua.getRandom();
    const headers = {
        'User-Agent': ua,
        'Host': 'kyfw.12306.cn',
        'Origin': 'https://kyfw.12306.cn',
        'Pragma': 'no-cache',
        ...option.headers
    };
    option.headers = headers;
    const newOption = {
        jar: cookieJar,
        withCredentials: true,
        ...option
    };
    console.log('body: ', body);
    return axios.post(url, querystring.stringify(body), newOption);
};

/**
 * 根据验证码编号获取验证码校验请求所需的坐标字符串
 * @param numberString
 * @returns {string}
 */
const getCaptchaString = (numberString) => {
    const positionArr = ['35,35','105,35','175,35','245,35','35,105','105,105','175,105','245,105'];
    const numberArr = numberString.split(',');
    return numberArr.reduce((a, b) => a.concat(positionArr[b - 1]), []).join(',');
};

const imageView = async(imageStream, ) => {
    return new Promise((resolve, reject) => {
        const jarPath = path.resolve(__dirname, '../lib/imageViewer-1.0-shaded.jar');
        const child = spawn('java', ['-jar', jarPath]);
        child.on('exit', (code) => {
            logger.debug('imageView exec exit: ', code);
        });
        child.on('error', (err) => {
            logger.error('imageView exec err: ', err);
            reject(err);
        });
        const wStream = imageStream.pipe(child.stdin);
        wStream.on('close', () => {
            resolve(child);
        });
    });
};

module.exports = {
    getCaptchaString,
    httpGet,
    httpPost,
    getLogger,
    imageView
};

