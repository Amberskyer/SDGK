'use strict';
const Controller = require('../../../care/base_api_controller');

class CollegeController extends Controller {
    constructor(ctx) {
        super(ctx);
        this.tableId = 232;
    }


    async index() {
        const {ctx} = this;
        //参数验证规则
        const rule = {
            page: {type: 'string'},
            pageSize: {type: 'string'},
        };
        //验证
        ctx.validate(rule, ctx.query);
        //解析参数
        const {page = 1, pageSize = 10} = ctx.query;
        //获取数据
        const result = await ctx.curl(`${this.apiHeader}/datasets/${this.tableId}/items`, {
            method: 'get',
            dataType: 'json',
            contentType: 'json',
            data: {
                page, pageSize
            }
        });
        //处理数据
        ctx.status = result.status;//设置状态码
        ctx.set(result.header);//设置请求头
        ctx.body = result.data;//设置数据
    }

    async show() {
        const {ctx} = this;
        //参数验证规则
        const rule = {
            id: {type: 'string'},
        };
        //验证
        ctx.validate(rule, ctx.params);
        //获取ID
        const {id} = ctx.params;
        //获取数据
        const result = await ctx.curl(`${this.apiHeader}/datasets/${this.tableId}/items/${id}`, {
            method: 'get',
            dataType: 'json',
            contentType: 'json',
        });
        //处理数据
        ctx.status = result.status;//设置状态码
        ctx.set(result.header);//设置请求头
        ctx.body = result.data;//设置数据
    }

}

module.exports = CollegeController;
