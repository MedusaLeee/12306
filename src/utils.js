const axios = require('axios');
const tough = require('tough-cookie');
const rua = require('random-useragent');
const log4js = require('log4js');
const axiosCookieJarSupport = require('@3846masa/axios-cookiejar-support').default;

axiosCookieJarSupport(axios);
const cookieJar = new tough.CookieJar();

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
    return axios.post(url, body, newOption);
};

/**
 * 根据验证码编号获取验证码校验请求所需的坐标字符串
 * @param numberString
 * @returns {string}
 */
const getCaptchaString = (numberString) => {
    const positionArr = ['43,47', '43,37', '114,35', '186,37', '255,39', '40,111', '111,107', '177,112', '252,113'];
    const numberArr = numberString.split(',');
    return numberArr.reduce((a, b) => a.concat(positionArr[b - 1]), []).join(',');
};

const getLogger = (category) => {
    const logger = log4js.getLogger(category);
    logger.level = process.env.LEVEL || 'info';
    return logger;
};

module.exports = {
    getCaptchaString,
    httpGet,
    httpPost,
    getLogger
};

