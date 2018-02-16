const axios = require('axios');
const tough = require('tough-cookie');
const rua = require('random-useragent');
const axiosCookieJarSupport = require('@3846masa/axios-cookiejar-support').default;

axiosCookieJarSupport(axios);
const cookieJar = new tough.CookieJar();

const ua = rua.getRandom();
const headers = {
    'User-Agent': ua,
    'Host': 'kyfw.12306.cn',
    'Referer': 'https://kyfw.12306.cn/otn/passport?redirect=/otn/'
};

const option = {
    jar: cookieJar,
    withCredentials: true,
    headers
};
// 登录页
const url = 'https://kyfw.12306.cn/otn/login/init';

axios.get(url, option).then((resp) => {
    console.log('resp: ', resp.headers['set-cookie']);
    const config = resp.config;
    console.log('jar: ', config.jar.toJSON());
}).catch((e) => {
    console.log('e: ', e.stack || e);
});