'use strict';
const svgCaptcha = require('svg-captcha');
const Controller = require('../care/base_controller');

/**
 * 验证码相关Controller
 */
class CaptchaController extends Controller {


    /**
     * 校验短信验证码
     * @throws {450} 参数缺失
     * @throws {404} 未检索到该手机号验证码
     * @throws {10002} 验证码错误
     * @throws {10003} 验证码超时
     */
    async captcha() {
        const {ctx} = this;
        const captcha = await ctx.service.captcha.captcha(); // 服务里面的方法
        ctx.session.user = {
            captcha: captcha.text.toLowerCase()
        };
        ctx.response.type = 'image/svg+xml';
        ctx.body = captcha.data;
        ctx.status = 200;
    }

    async verify() {

        const ctx = this.ctx;
        const rule = {
            captcha: {type: 'string'}
        };
        // 校验参数
        try {
            ctx.validate(rule);
        } catch (err) {
            this.failure('参数缺失', 450);
            return;
        }
        try {
            this.success(await ctx.service.captcha.check(ctx.request.body.captcha));
        } catch (err) {
            this.failure('校验异常', err.message);
        }
    }

}

module.exports = CaptchaController;