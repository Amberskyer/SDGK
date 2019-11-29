'use strict';
const Controller = require('../care/base_controller');
const fs = require('fs');


class CompareController extends Controller {

  constructor(ctx) {
    super(ctx);
    this.schoolList = null;
  }

  async init() {
    const { ctx } = this;
    const data = fs.readFileSync('qxtd.txt');
    ctx.status = 200;
    ctx.body = {
      data,
    };
  }

}
module.exports = CompareController;
