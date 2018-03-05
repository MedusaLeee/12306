const path = require('path');
const Promise = require('bluebird');
const Dama2 = require('dama2');
const util = require('util');
const setTimeoutPromise = util.promisify(setTimeout);

const username = process.argv[2];
const password = process.argv[3];

if (!username || !password) {
    throw new Error('username或者password必须.');
}

console.log('username: ', username, 'password: ', password);

class Damatu {
    constructor(user, pwd) {
        this.user = user;
        this.pwd = pwd;
        this.appID = '54841';
        this.appKey = '68cca4334b6612efca7a21ddf770df30';
        this.dama2 = null;
    }
    async login() {
        this.dama2 = new Dama2(this.appID, this.appKey, this.user, this.pwd);
        return Promise.fromCallback(cb => this.dama2.login(cb));
    }
    async getBalance() {
        return Promise.fromCallback(cb => this.dama2.getBalance(cb));
    }
    async decodeFile(imagePath) {
        return Promise.fromCallback(cb => this.dama2.decodeFile(310, imagePath, null, 60, cb));
    }
    async getResult(id) {
        return Promise.fromCallback(cb => this.dama2.getResult(id, cb));
    }
    async waitResult(id, attemptNum) {
        await setTimeoutPromise(1000);
        if (attemptNum > 0) {
            try {
                console.log('尝试次数：', attemptNum);
                const res = await this.getResult(id);
                return res.result;
            } catch (e) {
                const newAttemptNum = attemptNum - 1;
                return await this.waitResult(id, newAttemptNum);
            }
        }
        return Promise.reject(new Error('重试次数内未得到查询结果'));
    }
    async decodeFileAndWaitResult(imagePath, attemptNum) {
        const { id } = await this.decodeFile(imagePath);
        const result = await this.waitResult(id, attemptNum);
        return result;
    }
}

const imagePath = path.resolve(__dirname, '../constants/captcha.jpeg');

const test = async(user, pwd) => {
    try {
        const d = new Damatu(user, pwd);
        await d.login();
        const { balance } = await d.getBalance();
        console.log('余额为: ', balance);
        const result = await d.decodeFileAndWaitResult(imagePath);
        console.log('识别成功，结果为：', result);
    } catch (e) {
        console.log('识别错误：', e);
    }
};

test(username, password).then();
