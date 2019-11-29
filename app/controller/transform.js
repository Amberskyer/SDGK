'use strict';
const Controller = require('../care/base_controller');
const fs = require('fs');
const xlsx = require('node-xlsx');

const iesKeyArr = {
  AwardNum: 'bian_hao',
  Abstract: 'jian_jie',
  Title: 'ming_cheng',
  PrincipalName: 'can_yu_ren',
  PrincipalAffiliationName: 'can_yu_dan_wei',
  FundTypeDesc: 'guo_wai_xiang_mu_lei_xing',
  CenterName: 'cheng_dan_dan_wei',
  ProgramName: 'guo_wai_xiang_mu_suo_shu_fang_xiang',
};
const yjryKeyArr = {

  AU: 'ming_cheng',
  EM: 'email',
  C1: 'di_zhi',
};
const qkKeyArr = {
  SO: 'qi_kan_ming_cheng',
  PT: 'lei_xing',
  SN: 'issn',
};
const paperJournalKeyArr = {
  PT: 'bian_hao',
  AU: 'di_yi_zuo_zhe',
  AF: 'di_yi_zuo_zhe',
  TI: 'biao_ti',
  LA: 'yu_zhong',
  DE: 'guan_jian_ci',
  AB: 'zhai_yao',
  TC: 'bei_yin_shu',
  PD: 'kan_wu_hui_yi_ri_qi',
  PY: 'nian_fen',
  IS: 'qi_juan',
  VL: 'qi_juan',
  PG: 'ye_shu',
  BP: 'qi_shi_ye_ma',
  EP: 'zhong_zhi_ye_ma',
};


class CompareController extends Controller {

  constructor(ctx) {
    super(ctx);
    this.schoolList = null;
  }


  async initIes() {
    const { ctx, app } = this;
    const jyrc = app.mysql.get('jyrc');
    const nfsawards = app.mysql.get('nfsawards');
    const resultA = await nfsawards.select('Project_ies', { // 搜索 post 表
      where: { }, // WHERE 条件
      // columns: [ 'AwardNum', 'Abstract', 'Title', 'PrincipalName', 'PrincipalAffiliationName' ], // 要查询的表字段
      // orders: [[ 'created_at', 'desc' ], [ 'id', 'desc' ]], // 排序方式
      // limit: 10, // 返回数据量
      // offset: 0, // 数据偏移量
    });
    resultA.forEach(async (item, index) => {
      const newItem = {
        xiang_mu_lei_bie_id: 25,
      };
      Object.keys(item).forEach(async key => {
        if (key === 'AwardPer') {
          const timeStr = item[key];
          if (timeStr.indexOf('(') !== -1 && timeStr.indexOf(')') !== -1) {
            const timeArr = timeStr.split('(')[1].split(')')[0]
              .replace(/\s*/g, '')
              .replace('–', '-')
              .replace('to', '-')
              .split('-');
            newItem.qi_shi_shi_jian = timeArr[0];
            newItem.jie_zhi_shi_jian = timeArr[1];
          }
        } else {
          if (iesKeyArr[key]) {
            newItem[iesKeyArr[key]] = item[key];
          }
        }
      });
      console.log(index);
      await jyrc.insert('tb_100005_ke_yan_xiang_mu', newItem);
      // newArr.push(newItem);
    });

    ctx.status = 200;
    ctx.body = 111;
  }

  async initPaperJournal() {
    const { ctx, app } = this;
    const jyrc = app.mysql.get('jyrc');
    const nfsawards = app.mysql.get('nfsawards');
    const resultA = await nfsawards.select('Project_ies', { // 搜索 post 表
      where: { }, // WHERE 条件
      // columns: [ 'AwardNum', 'Abstract', 'Title', 'PrincipalName', 'PrincipalAffiliationName' ], // 要查询的表字段
      // orders: [[ 'created_at', 'desc' ], [ 'id', 'desc' ]], // 排序方式
      // limit: 10, // 返回数据量
      // offset: 0, // 数据偏移量
    });
    resultA.forEach(async (item, index) => {
      const newItem = {
        xiang_mu_lei_bie_id: 25,
      };
      Object.keys(item).forEach(async key => {
        if (key === 'AwardPer') {
          const timeStr = item[key];
          if (timeStr.indexOf('(') !== -1 && timeStr.indexOf(')') !== -1) {
            const timeArr = timeStr.split('(')[1].split(')')[0]
              .replace(/\s*/g, '')
              .replace('–', '-')
              .replace('to', '-')
              .split('-');
            newItem.qi_shi_shi_jian = timeArr[0];
            newItem.jie_zhi_shi_jian = timeArr[1];
          }
        } else {
          if (iesKeyArr[key]) {
            newItem[iesKeyArr[key]] = item[key];
          }
        }
      });
      console.log(index);
      await jyrc.insert('tb_100005_ke_yan_xiang_mu', newItem);
      // newArr.push(newItem);
    });

    ctx.status = 200;
    ctx.body = 111;
  }

}


module.exports = CompareController;
