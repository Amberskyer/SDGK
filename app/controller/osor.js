'use strict';
const Controller = require('../care/base_controller');
const fs = require('fs');
const xlsx = require('node-xlsx');
const cheerio = require('cheerio');
const querystring = require('querystring');
const qs = require('qs');


class CompareController extends Controller {

  constructor(ctx) {
    super(ctx);
  }

  async init() {

    const { ctx, app } = this;
    const path = './osor/2019年一分一段表.xlsx';
    const xlxsData = xlsx.parse(path);

    const dataArr = [];
    console.log(xlxsData[0].data);

    xlxsData.forEach((xlsxItem, xlsxIndex) => {
      const end = [ 1000 ];
      const begin = [ ];
      xlsxItem.data.forEach((item, index) => {
        if (!item[0] && !item[1]) {
          // ...
        } else if (index === 0) {
          // ...
        } else if (index === 1) {
          dataArr.push({
            year: 2019,
            province_id: 32,
            subject_type: xlsxIndex === 0 ? 'WEN' : 'LI',
            start: item[0],
            end: 1000,
            count: item[1],
            rank: item[3],
          });
          // ...
        } else if (index > 1 && index <= xlsxItem.data.length) {
          dataArr.push({
            year: 2019,
            province_id: 32,
            subject_type: xlsxIndex === 0 ? 'WEN' : 'LI',
            start: item[0],
            end: xlsxItem.data[index - 1][0] - 1,
            count: item[1],
            rank: item[3],
          });
        }
      });

      dataArr.push({
        year: 2019,
        province_id: 32,
        subject_type: xlsxIndex === 0 ? 'WEN' : 'LI',
        start: 0,
        end: xlsxItem.data[xlsxItem.data.length - 1][0] - 1,
        count: 0,
        rank: 0,
      });
    });

    await ctx.kkModel.TGkScoreRanges.bulkCreate(dataArr);

  }


}

module.exports = CompareController;
