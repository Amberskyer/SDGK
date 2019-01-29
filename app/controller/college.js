'use strict';

const Controller = require('../care/base_controller');


class CollegeController extends Controller {

    //信息查询 => 搜大学
    async index() {
        const {ctx} = this;
        await ctx.render("/college/index", {
            msg: "找大学"
        })
    }

    //信息查询 => 大学详情
    async info() {
        const {ctx} = this;
        const id = ctx.params.id
        ctx.body = `hi, 信息查询 => 大学${id}详情`;
    }

    //信息查询 => 大学录取概率
    async evaluation() {
        const {ctx} = this;
        const id = ctx.params.id
        ctx.body = 'hi, 信息查询 => 大学录取概率';
    }

    //信息查询 => 大学专业录取概率
    async majorEvaluation() {
        const {ctx} = this;
        const id = ctx.params.id
        ctx.body = 'hi, 信息查询 => 大学专业录取概率';
    }

    //信息查询 => 大学招生简章
    async admissionInfo() {
        const {ctx} = this;
        const id = ctx.params.id
        ctx.body = 'hi, 信息查询 => 大学招生简章';
    }

    //信息查询 => 大学招生计划
    async admissionPlan() {
        const {ctx} = this;
        const id = ctx.params.id
        ctx.body = 'hi, 信息查询 => 大学招生计划';
    }

    //信息查询 => 大学就业前景
    async prospect() {
        const {ctx} = this;
        const id = ctx.params.id
        ctx.body = 'hi, 信息查询 => 大学就业前景';
    }


}

module.exports = CollegeController;
