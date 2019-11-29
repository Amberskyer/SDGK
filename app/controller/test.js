'use strict';
const Controller = require('../care/base_controller');
const fs = require('fs');
const xlsx = require('node-xlsx');


class CompareController extends Controller {

  constructor(ctx) {
    super(ctx);
    this.schoolList = null;
  }


  async index() {
    const { ctx, app } = this;
    const jyrc = app.mysql.get('jyrc');
    const str = '发明/实用新型/外观设计'



    const strArr = str.split('/');

    // 读取文件内容
    // const obj = await xlsx.parse('./app/public/jyrc.xlsx');

    strArr.forEach(async (item, index) => {
      const sqlItem = {
        id: index + 1,
        name: item,
      };
      await jyrc.insert('tb_type_zhuan_li_lei_bie', sqlItem);
    });
    ctx.status = 200;
    ctx.body = 1111;
  }


}

module.exports = CompareController;
