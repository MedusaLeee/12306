const { httpGet, httpPost, getLogger } = require('./utils');
const Promise = require('bluebird');

const logger = getLogger('Http');

/**
 * 访问登录页获取session
 * @returns {Promise<*>}
 */
const redirectToLogin = async() => {
    try {
        const url = 'https://kyfw.12306.cn/otn/login/init';
        const option = {
            headers: {
                'Referer': 'https://kyfw.12306.cn/otn/passport?redirect=/otn/'
            }
        };
        const resp = await httpGet(url, option);
        return resp;
    } catch (e) {
        logger.error('redirectToLogin error: ', e.stack || e);
        return Promise.reject(e);
    }
};

/**
 * 获取登录验证码的图片流
 * @returns {Promise<Stream>}
 */
const getLoginCaptcha = async() => {
    try {
        const url = 'https://kyfw.12306.cn/passport/captcha/captcha-image?' +
            `login_site=E&module=login&rand=sjrand&${Math.random()}`;
        const option = {
            headers: {
                'Referer': 'https://kyfw.12306.cn/otn/login/init'
            },
            responseType: 'stream'
        };
        const resp = await httpGet(url, option);
        return resp.data;
    } catch (e) {
        logger.error('getLoginCaptcha error: ', e);
        return Promise.reject(e);
    }
};

/**
 * 登录验证码校验
 * @param positionStr
 * @returns {Promise<*>}
 */
const loginCaptchaCheck = async(positionStr) => {
    try {
        const url = 'https://kyfw.12306.cn/passport/captcha/captcha-check';
        const option = {
            headers: {
                'Referer': 'https://kyfw.12306.cn/otn/login/init'
            }
        };
        const body = {
            answer: positionStr,
            login_site: 'E',
            rand: 'sjrand'
        };
        const resp = await httpPost(url, body, option);
        if (resp.status === 200) {
            if (resp.data.result_code === '4') {
                logger.debug('loginCaptchaCheck resp: ', resp.data);
                return true;
            }
            logger.error('loginCaptchaCheck result error: ', resp.data);
            return Promise.reject(resp.data);
        }
        logger.error('loginCaptchaCheck status error: ', resp.status, resp.data);
        return Promise.reject(resp.status);
    } catch (e) {
        logger.error('loginCaptchaCheck error: ', e);
        return Promise.reject(e);
    }
};

/**
 * 登录接口
 * @param username
 * @param password
 * @returns {Promise<*>}
 */
const doLogin = async(username, password) => {
    try {
        const url = 'https://kyfw.12306.cn/passport/web/login';
        const option = {
            headers: {
                'Referer': 'https://kyfw.12306.cn/otn/login/init'
            }
        };
        const body = {
            username,
            password,
            appid: 'otn'
        };
        const resp = await httpPost(url, body, option);
        if (resp.status !== 200) {
            logger.error('doLogin status error: ', resp.status, resp.data);
            return Promise.reject(resp.status);
        }
        if (resp.data.result_code !== 0) {
            logger.error('doLogin result code error: ', resp.data);
            return Promise.reject(resp.data.result_code);
        }
        logger.debug('doLogin success: ', resp.data);
        return true;
    } catch (e) {
        logger.error('doLogin error: ', e);
        return Promise.reject(e);
    }
};

/**
 * 登录成功后的session校验
 * @returns {Promise<*>}
 */
const authUamtk = async() => {
    try {
        const url = 'https://kyfw.12306.cn/passport/web/auth/uamtk';
        const option = {
            headers: {
                'Referer': 'https://kyfw.12306.cn/otn/passport?redirect=/otn/login/userLogin'
            }
        };
        const body = {
            appid: 'otn'
        };
        const resp = await httpPost(url, body, option);
        if (resp.status !== 200) {
            logger.error('authUamtk status error: ', resp.status, resp.data);
            return Promise.reject(resp.status);
        }
        logger.debug('authUamtk success: ', resp.data);
        return resp.data.newapptk;
    } catch (e) {
        logger.error('authUamtk error: ', e);
        return Promise.reject(e);
    }
};

/**
 * 客户端session校验
 * @param newAppTk
 * @returns {Promise<*>}
 */
const uamAuthClient = async(newAppTk) => {
    try {
        const url = 'https://kyfw.12306.cn/otn/uamauthclient';
        const option = {
            headers: {
                'Referer': 'https://kyfw.12306.cn/otn/passport?redirect=/otn/login/userLogin'
            }
        };
        const body = {
            tk: newAppTk
        };
        const resp = await httpPost(url, body, option);
        if (resp.status !== 200) {
            logger.error('uamAuthClient status error: ', resp.status, resp.data);
            return Promise.reject(resp.status);
        }
        logger.debug('uamAuthClient success: ', resp.data);
        return {
            appTk: resp.data.apptk,
            username: resp.data.username
        };
    } catch (e) {
        logger.error('uamAuthClient error: ', e);
        return Promise.reject(e);
    }
};

module.exports = {
    redirectToLogin,
    getLoginCaptcha,
    loginCaptchaCheck,
    doLogin,
    authUamtk,
    uamAuthClient
};