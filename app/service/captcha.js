'use strict';
const svgCaptcha = require('svg-captcha');
const Service = require('egg').Service;

/**
 * 验证码Service
 */
class CaptchaService extends Service {


    /**
     * 获取验证码
     * @throws {450} 参数缺失
     * @throws {10001} 刚发过
     */
    async captcha () {
        const ctx = this.ctx;
        // 生成验证码
        const captcha = svgCaptcha.create({
            width: 96,
            height: 32,
            fontSize: 40,
            color: true
        });
        return captcha
    }

    /**
     * CHECK
     * @returns {Boolean}
     */
    async check (captcha) {
        return captcha ? this.ctx.session.user.captcha === captcha.toLowerCase() : false;
    }



}

module.exports = CaptchaService;