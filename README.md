# NodeJs 12306购票研究

## 免责声明

代码开源，但仅供学习研究，如用于商业或恶意攻击引起的纠纷或不良影响责任自负！！

## 环境

* NodeJs v8.9.4
* Java 1.8.0_161

## 登录

### 效果

![](https://github.com/MedusaLeee/12306/blob/master/constants/12306-login.gif)

### 使用

> 开启DEBUG模式

    LEVEL=debug node 12306-login.js
    
> 不开启DEBUG模式

    node 12306-login.js

## 验证码

* 第一阶段半自动购票，手工输入验证码
* 第二阶段使用验证码自动识别。

### 验证码渲染

> 验证码渲染使用java开发，见[12306-captcha-viewer](https://github.com/MedusaLeee/12306-captcha-viewer)。

#### 渲染测试

    node test/simpleImageView.js