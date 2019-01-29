'use strict';
const {Controller} = require('egg');

class BaseController extends Controller {

    constructor(ctx) {
        super(ctx);
        this.apiHeader = ctx.app.config.apiHeader;
    }

    get user() {
        return this.ctx.session.user;
    }

    success(data, message, code) {
        this.ctx.body = {
            success: true,
            data: data == null || data === undefined ? {} : data,
            version: null,
            status: 'ok',
            code: code || 200,
            message: message || 'success'
        };
    }

    failure(message, code, data) {
        this.ctx.body = {
            success: true,
            data: data || {},
            version: null,
            status: 'ok',
            code: code || 500,
            message: message || 'error'
        };
    }


    async loadCount() {
        const {ctx} = this;
        let count = ctx.cookies.get('count');
        count = count ? Number(count) : 0;
        ctx.cookies.set('count', ++count, {
            httpOnly: false,
            signed: true,//是否可修改
            encrypt: false, // 是否加密
        });
    }

    async removeCount() {
        const {ctx} = this;
        ctx.cookies.set('count', null);
        ctx.status = 204;
    }

}

module.exports = BaseController;