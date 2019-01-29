'use strict';

const Controller = require('../care/base_controller');

class MajorController extends Controller {

    //信息查询 => 专业查询
    async index() {
        const { ctx } = this;
        await ctx.render("/major/index",{
            msg:"找专业"
        })
    }
    //信息查询 => 搜大学
    async info() {
        const {ctx} = this;
        const {id} = ctx.params;
        ctx.body = 'hi, 信息查询 => 搜大学';
    }
    //信息查询 => 专业录取概率(按批次)
    async evaluation() {
        const {ctx} = this;
        const {type} = ctx.params;
        ctx.body = `hi, 信息查询 => 专业录取概率(按${type})`;
    }
    //信息查询 => 专业录取概率(按批次)
    async evaluationByBatch() {
        const {ctx} = this;
        const {id} = ctx.params;
        ctx.body = 'hi, 信息查询 => 专业录取概率(按批次)';
    }
    //信息查询 => 专业录取概率(按位次)
    async evaluationByRank() {
        const {ctx} = this;
        const {id} = ctx.params;
        ctx.body = 'hi, 信息查询 => 专业录取概率(按位次)';
    }
    //信息查询 => 专业录取概率(按分数)
    async evaluationByScore() {
        const { ctx } = this;
        const {id} = ctx.params;
        ctx.body = 'hi, 信息查询 => 专业录取概率(按分数)';
    }
    //信息查询 => 专业招生计划
    async admissionPlan() {
        const {ctx} = this;
        const {id} = ctx.params;
        ctx.body = 'hi, 信息查询 => 专业招生计划';
    }
    //信息查询 => 专业就业前景
    async prospect() {
        const { ctx } = this;
        const {id} = ctx.params;
        ctx.body = 'hi, 信息查询 => 专业就业前景';
    }



}

module.exports = MajorController;
