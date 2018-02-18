# NodeJs 12306购票研究

## 验证码

* 第一阶段半自动购票，手工输入验证码
* 第二阶段使用验证码自动识别。

### 验证码渲染

> 验证码渲染使用java开发，见[12306-captcha-viewer](https://github.com/MedusaLeee/12306-captcha-viewer)。

#### 渲染测试

    node test/simpleImageView.js