'use strict';

const Controller = require('../care/base_controller');

class TestEvaluationController extends Controller {
    //录取测试 => 录取概率测试
    async index() {
        const {ctx} = this;
        await ctx.render("/testEvaluation/index", {
            msg: "录取概率测试"
        })
    }

    //录取测试 => 职业性格测试
    async jobForYou() {
        const {ctx} = this;
        await ctx.render("/testEvaluation/jobForYou", {
            msg: "职业性格测试"
        })
    }

    //录取测试 => 院校对比
    async compare() {
        const {ctx} = this;
        const type = ctx.params.type;
        await ctx.render("/testEvaluation/jobForYou", {
            msg: `${type}对比`
        })
    }

    // //录取测试 => 院校对比
    // async schoolComparison() {
    //     const { ctx } = this;
    //     ctx.body = 'hi, 录取概率 => 院校对比';
    // }
    // //录取测试 => 专业对比
    // async majorComparison() {
    //     const { ctx } = this;
    //     ctx.body = 'hi, 录取概率 => 专业对比';
    // }
}

module.exports = TestEvaluationController;
