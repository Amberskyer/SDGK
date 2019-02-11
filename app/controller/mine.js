'use strict';

const Controller = require('../care/base_controller');

class UserInfoController extends Controller {

  // 我的 => 基本信息
  async userinfo() {
    const { ctx } = this;
    ctx.body = 'hi, InforQueryController';
  }

  // 我的 => 重置密码
  async resetPSW() {
    const { ctx } = this;
    ctx.body = 'hi, 重置密码';
  }

  // 我的 => 基本信息
  async myPreference() {
    const { ctx } = this;
    ctx.body = 'hi, 我的志愿';
  }
  // 我的 => 志愿详情
  async preferenceDetail() {
    const { ctx } = this;
    ctx.body = 'hi, 志愿详情';
  }
  // 我的 => 我关注的学校
  async favoriteCollege() {
    const { ctx } = this;
    ctx.body = 'hi, 我关注的学校';
  }
  // 我的 => 我关注的专业
  async favoriteMajor() {
    const { ctx } = this;
    ctx.body = 'hi, 我关注的专业';
  }
  // 我的 => 我关注的文章
  async favoriteArticle() {
    const { ctx } = this;
    ctx.body = 'hi, 我关注的文章';
  }
}

module.exports = UserInfoController;
