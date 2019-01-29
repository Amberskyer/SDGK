'use strict';

const Controller = require('../care/base_controller');

class VipController extends Controller {

    //主页 => 开通Vip
    async index() {
        const { ctx } = this;
        await ctx.render("/vip/index",{
            msg:"开通VIP"
        })
    }
}

module.exports = VipController;
