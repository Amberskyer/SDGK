'use strict';
const {Controller} = require('egg');

class BaseApiController extends Controller {

    constructor(ctx) {
        super(ctx);
        this.apiHeader = ctx.app.config.apiHeader;
    }


    /**
     * 获取列表
     * @query {page,pageSize}
     * @returns
     */
    async index() {

    }

    /**
     * 获取详情
     * @params :id
     * @returns :model
     */
    async show() {
    }

    /**
     * 创建
     * @request :model
     * @returns :model
     */
    async create() {
    }

    /**
     * 更新
     * @params :id
     * @request :model
     * @returns :model
     */
    async update() {
    }

    /**
     * 销毁
     * @params :id
     * @returns :msg
     */
    async destroy() {
    }

}

module.exports = BaseApiController;