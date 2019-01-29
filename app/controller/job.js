'use strict';

const Controller = require('../care/base_controller');

class JobController extends Controller {

    //信息查询 => 搜职业
    async index() {
        const { ctx } = this;
        await ctx.render("/job/index",{
            msg:"找职业"
        })
    }
    //信息查询 => 职业介绍
    async info() {
        const { ctx } = this;
        const {id} = ctx.params;
        ctx.body = 'hi, 信息查询 => 职业介绍';
    }
    //信息查询 => 对口专业
    async major() {
        const { ctx } = this;
        const {id} = ctx.params;
        ctx.body = 'hi, 信息查询 => 对口专业';
    }
    //信息查询 => 职业前景
    async prospect () {
        const { ctx } = this;
        const {id} = ctx.params;
        ctx.body = 'hi, 信息查询 => 职业前景';
    }


}

module.exports = JobController;
