'use strict';
const Controller = require('../care/base_controller');


class CompareController extends Controller {

  constructor(ctx) {
    super(ctx);
    this.schoolList = null;
  }


  async schoolAdmission() {
    const { ctx, app } = this;
    const sdgk = app.mysql.get('sdgk');
    const zsgk = app.mysql.get('zsgk');
    const youzy = app.mysql.get('youzy');
    const sdgkReulst = await sdgk.select('t_gk_school_admissions', { // 搜索 post 表
      where: { school_id: 161, year: 2018, province_id: 9 }, // WHERE 条件
      // columns: [ 'author', 'title' ], // 要查询的表字段
      orders: [[ 'year', 'desc' ]], // 排序方式
    });
    const zsgkResult = await zsgk.select('school_admission', { // 搜索 post 表
      where: { r_school_id: 161, year: 2018, r_province_id: 9 }, // WHERE 条件
      // columns: [ 'author', 'title' ], // 要查询的表字段
      orders: [[ 'year', 'desc' ]], // 排序方式
    });
    const youzyResult = await youzy.select('school_admission', { // 搜索 post 表
      where: { r_school_id: 161, year: 2018, r_province_id: 9 }, // WHERE 条件
      // columns: [ 'author', 'title' ], // 要查询的表字段
      orders: [[ 'year', 'desc' ]], // 排序方式
    });
    ctx.status = 200;
    ctx.body = {
      sdgkReulst, zsgkResult, youzyResult,
    };
  }


}
module.exports = CompareController;
