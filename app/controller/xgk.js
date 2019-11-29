'use strict';
const Controller = require('../care/base_controller');
const cheerio = require('cheerio');


class CompareController extends Controller {

  constructor(ctx) {
    super(ctx);
    this.provinceList = [
      { label: '北京', value: 'bj' },
      { label: '安徽', value: 'ah' },
      { label: '重庆', value: 'cq' },
      { label: '福建', value: 'fj' },
      { label: '甘肃', value: 'gs' },
      { label: '广东', value: 'gd' },
      { label: '广西', value: 'gx' },
      { label: '贵州', value: 'gz' },
      { label: '海南', value: 'hain' },
      { label: '河北', value: 'heb' },

      { label: '河南', value: 'hen' },
      { label: '黑龙江', value: 'hlj' },
      { label: '湖北', value: 'hub' },
      { label: '湖南', value: 'hun' },
      { label: '吉林', value: 'jl' },
      { label: '江苏', value: 'js' },
      { label: '江西', value: 'jx' },
      { label: '辽宁', value: 'ln' },
      { label: '内蒙古', value: 'nmg' },
      { label: '宁夏', value: 'nx' },

      { label: '青海', value: 'qh' },
      { label: '四川', value: 'sc' },
      { label: '山东', value: 'sd' },
      { label: '上海', value: 'sh' },
      { label: '陕西', value: 'shx' },
      { label: '山西', value: 'sx' },
      { label: '天津', value: 'tj' },
      { label: '香港', value: 'xg' },
      { label: '新疆', value: 'xj' },
      { label: '云南', value: 'yn' },
      { label: '浙江', value: 'zj' },
    ];
    this.studentProvinceList = [
      { label: '北京', value: 'bj' },
      { label: '山东', value: 'sd' },
      { label: '浙江', value: 'zj' },
      { label: '天津', value: 'tj' },
      { label: '海南', value: 'hn' },
      { label: '上海', value: 'sh' },
    ];
    this.majorList = [
      '不提科目要求', '地理', '化学', '化学/地理', '化学/历史/地理',
      '化学/生物', '化学+生物', '历史', '历史/地理', '历史+地理',
      '生物', '生物/历史/地理', '生物/思想政治/地理', '生物/思想政治/历史', '思想政治',
      '思想政治/历史', '思想政治/历史/地理', '思想政治+历史', '物理', '物理/地理',
      '物理/化学', '物理/化学/地理', '物理/化学/历史', '物理/化学/生物', '物理/化学/思想政治',
      '物理/历史', '物理/历史/地理', '物理/生物', '物理/生物/地理', '物理/生物/历史', '物理/生物/思想政治',
      '物理/思想政治', '物理/思想政治/地理', '物理/思想政治/历史', '物理+地理', '物理+化学',
      '物理+化学+生物', '物理+生物',
    ];
  }

  async init() {
    const { ctx, app } = this;
    const xgk = app.mysql.get('xgk');
    console.log('sss');
    for (let i = 0; i < this.studentProvinceList.length; i++) {
      const studentProvinceItem = this.studentProvinceList[i];
      for (let j = 0; j < this.provinceList.length; j++) {
        const provinceItem = this.provinceList[j];
        const url = `https://www.eol.cn/e_html/gk/${studentProvinceItem.value}xk/html/html_${provinceItem.value}.html`;
        await xgk.update('html', { // 搜索 post 表
          year: 2020,
          url,
        }, {
          where: {
            province_name: provinceItem.label,
            student_province_name: studentProvinceItem.label,

          },
        });
        console.log({ i, j });
      }
    }

  }

  async loadHtml() {
    const { ctx, app } = this;
    const xgk = app.mysql.get('xgk');
    const htmlArr = await xgk.select('html', {
      where: { // 搜索 post 表
        count: 0,
      },
    });
    console.log(htmlArr.length);
    for (let i = 0; i < htmlArr.length; i++) {
      const htmlItem = htmlArr[i];
      const url = htmlItem.url;
      const result = await app.curl(url, {
        method: 'GET',
        contentType: 'text',
        dataType: 'text',
      });
      const $ = cheerio.load('<table>' + result.data + '</table>');
      const trArr = $('table tr ');
      const count = trArr.length;
      await xgk.update('html', { // 搜索 post 表
        year: 2020,
        html: JSON.stringify(result.data),
        url,
        count,
        status: 1,
        status2: 1,
      }, {
        where: {
          id: htmlItem.id,
        },
      });
      console.log(htmlItem.province_name, htmlItem.student_province_name, htmlItem.url, { i });
    }
    // 处理数据
    // ctx.status = result.status;// 设置状态码
    // ctx.set(result.header);// 设置请求头
    // ctx.body = result;// 设置数据
  }

  async checkHtml() {

    const { ctx, app } = this;
    const xgk = app.mysql.get('xgk');
    const htmlArr = await xgk.select('html', {
      where: { // 搜索 post 表
        status: 1,
      },
    });
    console.log(htmlArr.length);
    for (let i = 0; i < htmlArr.length; i++) {
      const provinceItem = htmlArr[i];
      const htmlResult = await xgk.get('html', { // 搜索 post 表
        province_name: provinceItem.province_name,
      });
      const $ = cheerio.load('<table>' + htmlResult.html + '</table>');
      const trArr = $('table tr ');
      // console.log('trArr', htmlArr.length, trArr.length);
      if (trArr.length !== provinceItem.count) {
        console.log('不一样', provinceItem.count, trArr.length);
      }
      await xgk.update('html', {
        count: trArr.length,
        status: 22,
      }, {
        where: {
          id: provinceItem.id,
        },
      });
      console.log({ i });
      // 处理数据
      // ctx.status = result.status;// 设置状态码
      // ctx.set(result.header);// 设置请求头
      ctx.body = {
        data: 111,
      };// 设置数据
    }
  }

  async initHtml() {
    const { ctx, app } = this;
    const xgk = app.mysql.get('xgk');
    const htmlArr = await xgk.select('html', {
      where: { // 搜索 post 表
        status: 1,
      },
    });
    console.log(htmlArr.length);
    for (let i = 0; i < htmlArr.length; i++) {
      const provinceItem = htmlArr[i];
      const htmlResult = await xgk.get('html', { // 搜索 post 表
        province_name: provinceItem.province_name,
      });
      const $ = cheerio.load('<table>' + htmlResult.html + '</table>');
      const trArr = $('table tr ');
      console.log('trArr', htmlArr.length, trArr.length);
      for (let j = 0; j < trArr.length; j++) {
        const tdArr = trArr.eq(j).children('td');

        const item = {
          year: 2020,
          province_name: provinceItem.province_name,
          student_province_name: provinceItem.student_province_name,
          school_name: tdArr.eq(2).text().replace(/\s*/g, ''),
          level: 'BK',
          major_name: tdArr.eq(4).text().replace(/\s*/g, ''),
          subject_type: tdArr.eq(5).text().replace(/\s*/g, ''),
        };
        await xgk.insert('index', item);
        console.log({ j });
      }
      await xgk.update('html', {
        status: 22,
      }, {
        where: {
          id: provinceItem.id,
        },
      });
      console.log({ i });
      // 处理数据
      // ctx.status = result.status;// 设置状态码
      // ctx.set(result.header);// 设置请求头
      ctx.body = {
        data: 111,
      };// 设置数据
    }
  }


}

module.exports = CompareController;
