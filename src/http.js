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
                'Referer': 'https://kyfw.12306.cn/otn/passport?redirect=/otn/'
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
                'Referer': 'https://kyfw.12306.cn/otn/passport?redirect=/otn/'
            }
        };
        const body = {
            answer: positionStr,
            login_site: 'E',
            rand: 'sjrand'
        };
        const resp = await httpPost(url, body, option);
        if (resp.status === 200) {
            if (resp.data.result_code !== '4') {
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
module.exports = {
    redirectToLogin,
    getLoginCaptcha,
    loginCaptchaCheck
};