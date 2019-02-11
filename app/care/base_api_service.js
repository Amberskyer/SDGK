'use strict';
const { Service } = require('egg');

class BaseApiService extends Service {

  constructor(ctx) {
    super(ctx);
    this.apiHeader = ctx.app.config.apiHeader;
  }


  /**
   * 获取列表
   * @query {page,pageSize}
   */
  async index() {
    // ...
  }

  /**
   * 获取详情
   * @params :id
   */
  async show() {
    // ...
  }

  /**
   * 创建
   * @request :model
   */
  async create() {
    // ...
  }

  /**
   * 更新
   * @params :id
   * @request :model
   */
  async update() {
    // ...
  }

  /**
   * 销毁
   * @params :id
   */
  async destroy() {
    // ...
  }

}

module.exports = BaseApiService;
