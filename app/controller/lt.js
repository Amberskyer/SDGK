'use strict';
const MD5 = require('md5-node');
const Controller = require('../care/base_controller');

/**
 * @controller 第三方 组别接口
 */
class ChinaUnicomController extends Controller {

  constructor(ctx) {
    super(ctx);
    this.productCodeArr = ctx.app.config.ChinaUnicom.productCode;
    this.key = ctx.app.config.ChinaUnicom.key;
  }

  /**
     * @summary 开通VIP接口
     * @router post /api/v1/unicom/coupon
     * @request body ltVip *body
     */
  async ltVip() {
    const { ctx } = this;
    const { account = '222222', clientOrderNo = '12345678', notifyUrl = 'http://127.0.0.1:7003/api/v1/unicom/notifyUrl', phone = '13600000000', productCode = 'gk0001' } = ctx.request.body;
    const timestamp = new Date().getTime() / 1000;


    // 验证sign
    const stringA = `account=${account}&clientOrderNo=${clientOrderNo}&notifyUrl=${notifyUrl}&phone=${phone}&productCode=${productCode}&timestamp=${timestamp}`;
    const stringSignTemp = stringA + '&key=' + this.key;
    const sign = MD5(stringSignTemp).toUpperCase();

    const params = {
      clientOrderNo,
      timestamp,
      productCode,
      phone,
      account,
      notifyUrl,
      sign,
    };


    const result = await ctx.basePost('http://api.gk.nercel.com/api/v1/unicom/coupon', params);


    ctx.status = 200;
    ctx.body = result;

  }


  async notifyUrl() {
    const { ctx } = this;
    const {
      clientOrderNo, // 联通提供订单号
      coupon, // 券值？
      couponPwd, // 如果产品是券码+密码类型的产品，返回的密码存入该字段
      couponValidDate, // 时间格式为yyyyMMddHHmmss 如20160626014303
      errCode, // 错误码
      errCodeDes, // 错误描述内容
      merOrderNo, // 我们提供的订单号
      productCode, // 产品码，不知道是否是固定值？
      productType, // 产品类型，券/直充/url/券码+URL/其他
      resultCode, // SUCCESS/FAIL
      returnCode, // SUCCESS/FAIL
      returnMsg, // SUCCESS/FAIL
      url, // 如果是链接类型的产品，返回url链接
      sign,
    } = ctx.request.body;


    // 验证sign
    const stringA = `clientOrderNo=${clientOrderNo}&coupon=${coupon}&couponPwd=${couponPwd}&couponValidDate=${couponValidDate}&errCode=${errCode}&errCodeDes=${errCodeDes}&merOrderNo=${merOrderNo}&productCode=${productCode}&productType=${productType}&resultCode=${resultCode}&returnCode=${returnCode}&returnMsg=${returnMsg}&url=${url}`;
    const stringSignTemp = stringA + '&key=' + this.key;
    const _sign = MD5(stringSignTemp).toUpperCase();

    console.log({
      clientOrderNo, // 联通提供订单号
      coupon, // 券值？
      couponPwd, // 如果产品是券码+密码类型的产品，返回的密码存入该字段
      couponValidDate, // 时间格式为yyyyMMddHHmmss 如20160626014303
      errCode, // 错误码
      errCodeDes, // 错误描述内容
      merOrderNo, // 我们提供的订单号
      productCode, // 产品码，不知道是否是固定值？
      productType, // 产品类型，券/直充/url/券码+URL/其他
      resultCode, // SUCCESS/FAIL
      returnCode, // SUCCESS/FAIL
      returnMsg, // SUCCESS/FAIL
      url, // 如果是链接类型的产品，返回url链接
      sign,
    });

    if (_sign === sign) {
      ctx.status = 200;
      ctx.body = {
        code: 0,
        returnCode, // SUCCESS/FAIL
        returnMsg, // SUCCESS/FAIL
        sign,
      };
    } else {
      console.log('sign错误');
      ctx.status = 200;
      ctx.body = {
        code: 0,
        returnCode, // SUCCESS/FAIL
        returnMsg, // SUCCESS/FAIL
        sign,
      };
    }

  }


  /**
     * @summary 消费券开通VIP
     * @router post /api/v1/unicom/coupon/activate
     * @request header string *Authorization eg:eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo5MCwicHJvdmluY2VfaWQiOjcsInN1YmplY3RfdHlwZSI6IldFTiIsInZpcCI6dHJ1ZSwiZmlsbGVkIjpmYWxzZSwiaWF0IjoxNTg1ODE1MDYwLCJleHAiOjE1ODU4MjIyNjB9.Sghdum2RtRxhNuidAuXEKodugLdGBTgXOckDHhyDtF0
     * @request body ltVipActivate *body
     */

  async ltVipActivate() {
    const { ctx } = this;
    const { code } = ctx.request.body;
    const { user_id = null } = this.user;
    console.log({ code, user_id });
    const result = await ctx.basePost(`${this.apiHeader}/coupons/activate`, {
      code,
      userId: user_id,
    });
    ctx.status = result.status;
    ctx.body = result.data;
  }

}

module.exports = ChinaUnicomController;
