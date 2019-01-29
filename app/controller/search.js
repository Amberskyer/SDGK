'use strict';

const Controller = require('../care/base_controller');

class SearchController extends Controller {

    //主页 => 搜索结果
    async index() {
        const { ctx } = this;
        await ctx.render("/search/index",{
            msg:"搜索结果"
        })
    }

}

module.exports = SearchController;
