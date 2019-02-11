'use strict';

const Controller = require('../care/base_controller');

class UserInfoController extends Controller {

  // 志愿填报 => 智能模拟填报
  async smartSimulate() {
    const { ctx } = this;
    await ctx.render('preference/smartSimulate', {
      msg: '智能模拟填报',
    });
  }

  // 志愿填报 => 录取相关查询
  async aboutEnroll() {
    const { ctx } = this;
    await ctx.render('preference/aboutEnroll', {
      msg: '录取相关查询',
    });
  }

  // 志愿填报 => 招生计划查询
  async admissionPlan() {
    const { ctx } = this;
    await ctx.render('preference/admissionPlan', {
      msg: '招生计划查询',
    });
  }

  // 志愿填报 => 院校优先
  async collegeFirst() {
    const { ctx } = this;
    ctx.body = 'hi, 院校优先';
  }

  // 志愿填报 => 专业优先
  async majorFirst() {
    const { ctx } = this;
    ctx.body = 'hi, 专业优先';
  }

  // 志愿填报 => 一键填报
  async easyFill() {
    const { ctx } = this;
    ctx.body = 'hi, 一键填报';
  }

}

module.exports = UserInfoController;
