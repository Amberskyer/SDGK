'use strict';
const Controller = require('../care/base_controller');
const cheerio = require('cheerio');
const urlencode = require('urlencode');
const fs = require('fs');

class ZsgkController extends Controller {

  constructor(ctx) {
    super(ctx);
    this.schoolList = null;
    this.provinceList = [
      {
        id: 1,
        name: '北京',
      },
      {
        id: 2,
        name: '天津',
      },
      {
        id: 12,
        name: '浙江',
      },
      {
        id: 3,
        name: '上海',
      },
      {
        id: 7,
        name: '山东',
      },
      {
        id: 29,
        name: '海南',
      },
      {
        id: 15,
        name: '广东',
      },
      {
        id: 4,
        name: '重庆',
      },
      {
        id: 5,
        name: '河北',
      },
      {
        id: 11,
        name: '江苏',
      },
      {
        id: 13,
        name: '湖北',
      },
      {
        id: 14,
        name: '湖南',
      },
      {
        id: 25,
        name: '辽宁',
      },
      {
        id: 30,
        name: '福建',
      },

    ];
    this.yearList = [ 2016, 2017, 2018, 2019 ];
    this.subjectList = [ 1, 2 ];
    this.batchList = [
      { batch: 1, batch_name: '本科批', batch_ex: 0, diploma_id: 7 },
      { batch: 2, batch_name: '本科第二批', batch_ex: 0, diploma_id: 7 },
      { batch: 1, batch_name: '高职专科批', batch_ex: 0, diploma_id: 5 },
      { batch: 1, batch_name: '专科批B', batch_ex: 2, diploma_id: 5 }];
    this.page = 1;
    this.size = 20;
  }

  async init() {
    console.log('开始');
    // const interval = setInterval(this.loadSchoolMajorAdmission(), 1800);
    await this.initSchoolAdmission();
  }


  async loadSchool() {
    super.loadSchool();
    const { ctx } = this;
    this.pageCount = 139;
    const size = this.size;
    const page = this.page;
    // console.log(schoolListHtml);
    const wmzySql = ctx.app.mysql.get('wmzy');
    const apiJsonText = fs.readFileSync(`C:\\Users\\Ambersky_keke\\Downloads\\爬虫\\完美志愿\\school\\新建文本文档 - 副本 (${this.page}).txt`, 'utf-8');

    const apiJson = JSON.parse(apiJsonText);
    // console.log(apiJson.data.sch_short_info);
    if (this.page === apiJson.data.page) {
      const itemArr = apiJson.data.sch_short_info.map(item => {
        return {
          school_id: item.sch_id,
          school_name: item.sch_name,
        };
      });
      console.log(itemArr);
      await wmzySql.insert('school', itemArr);
      if (page <= this.pageCount) {
        this.page = this.page + 1;
        console.log('学校爬取进度', { page, size }, '已爬取' + (page * size));
        await this.loadSchool();
      } else {
        console.log('爬完了');
      }
    }
  }

  async loadMajor() {
    const { ctx } = this;
    this.pageCount = 139;
    const size = this.size;
    const page = this.page;
    // console.log(schoolListHtml);
    const wmzySql = ctx.app.mysql.get('wmzy');
    const apiJsonText = fs.readFileSync(`C:\\Users\\Ambersky_keke\\Downloads\\完美志愿\\新建文本文档 - 副本 (${this.page}).txt`, 'utf-8');

    const apiJson = JSON.parse(apiJsonText);
    // console.log(apiJson.data.sch_short_info);
    if (this.page === apiJson.data.page) {
      const itemArr = apiJson.data.sch_short_info.map(item => {
        return {
          sch_id: item.sch_id,
          sch_name: item.sch_name,
          sch_english_name: item.sch_english_name,
          province: item.province,
        };
      });
      console.log(itemArr);
      await wmzySql.insert('school', itemArr);
      if (page <= this.pageCount) {
        this.page = this.page + 1;
        console.log('学校爬取进度', { page, size }, '已爬取' + (page * size));
        await this.loadSchool();
      } else {
        console.log('爬完了');
      }
    }
  }

  async initMajorAdmissionTable() {
    const { ctx } = this;
    const wmzySql = ctx.app.mysql.get('wmzy');
    this.schoolList = await wmzySql.select('school');
    this.provinceList = await wmzySql.select('province');
    for (let i = 0; i < this.schoolList.length; i++) {
      const item = this.schoolList[i];
      const schoolAdmissionJson = [];
      this.provinceList.forEach((item2, index2) => {
        this.yearList.forEach(item3 => {
          this.subjectList.forEach(item4 => {
            this.batchList.forEach(item5 => {
              const schoolAdmissionJsonItem = {
                school_id: item.school_id,
                school_name: item.school_name,
                province_id: item2.province_id,
                province_name: item2.province_name,
                year: item3,
                subject: item4,
                batch: item5.batch,
                batch_name: item5.batch_name,
                batch_ex: item5.batch_ex,
                diploma_id: item5.diploma_id,
              };
              schoolAdmissionJson.push(schoolAdmissionJsonItem);
            });
          });
        });
      });
      console.log(schoolAdmissionJson);
      console.log(`第${i}个学校`);
      await wmzySql.insert('major_admisssion_html', schoolAdmissionJson);
    }

  }


  async loadMajorAdmission() {
    // super.loadMajorAdmission();
    const { ctx } = this;
    const wmzySql = ctx.app.mysql.get('wmzy');

    console.log('开始');
    for (let i = 0; i <= 3017024; i = i + 500000) {
      loadSchoolAdmissionHtml(i);
    }
    // loadSchoolAdmissionHtml(1);
    async function loadSchoolAdmissionHtml(id) {
      const majorAdmissionInfo = await ctx.model.MajorAdmissionHtml.find({
        where: {
          id: {
          	$gt: id,
          },
          // isHave: {
          // 	$ne:456
          // },
          status: -1,
          province_id: '440000000000',
        },
        order: [[ 'id' ]],
        limit: 30,
      });
      // const majorAdmissionInfo = await wmzySql.get('major_admission_html', { id, status: -1, province_id: '440000000000' });
      // console.log(majorAdmissionInfo);
      // return;
      if (!majorAdmissionInfo) {
        loadSchoolAdmissionHtml(parseInt(id) + 1);
        return;
      }

      const url = 'https://www.wmzy.com/gw/api/sku/enroll_admission_service/major_enroll_data';
      const params = {
        academic_year: majorAdmissionInfo.year,
        batch: majorAdmissionInfo.batch,
        batch_ex: majorAdmissionInfo.batch_ex,
        batch_name: majorAdmissionInfo.batch_name,
        diploma_id: majorAdmissionInfo.diploma_id,
        enroll_category: 1,
        enroll_mode: 1,
        enroll_stage: 0,
        enroll_unit_id: majorAdmissionInfo.school_id,
        enroll_year: majorAdmissionInfo.year,
        only_admission: true,
        page: 1,
        page_size: 200,
        score_line: null,
        sort_key: 'min_score',
        sort_type: 1,
        stu_province_id: majorAdmissionInfo.province_id,
        wenli: majorAdmissionInfo.subject,
        year: majorAdmissionInfo.year,
      };
      // const cookie = '__wpkreporterwid_=453516a8-935d-4cfc-8235-492248df3b57; jwtToken=lPtw4XYfpJ482FKFbm8dBHrXnXPu4h/2SH5fMTI7J95bq3Wvk7AYNys8Qy59PSse; uid=1443207; acw_tc=2f624a3815901456652826384e61114ab90eaa0386f13b60aa4aff7f72a7b4';
      // const cookie = '__wpkreporterwid_=453516a8-935d-4cfc-8235-492248df3b57; jwtToken=lPtw4XYfpJ482FKFbm8dBHrXnXPu4h/2SH5fMTI7J95bq3Wvk7AYNys8Qy59PSse; uid=1443207; acw_tc=2f624a3415902897164488513e0f6460245908ceec60e45b466268a3f3ed5e';
      const cookie = '__wpkreporterwid_=62e4e737-862a-4227-0c05-282b83208ba0; acw_tc=2f624a6c15903770041758306e5efc1c6aec2e0641e52cdacc9e933b9dbfe8; jwtToken=lPtw4XYfpJ482FKFbm8dBG7wfUvdVA22XqFYEEJGFQh7M6GJFBpO+D9oNszWhAZa; uid=1443207';

      const result = await ctx.basePostForWmzy(url, params, cookie);
      console.log(result);
      console.log(result.data);
      if (result.status === 200 && result.data && result.data.code === 10015) {
        console.log('重新登录');
        return;
      } else if (result.status === 200 && result.data && result.data.code === 0) {
        const item = {
          status: 200,

          html: JSON.stringify(result.data),
          total: result.data.data.total,

          code: result.data.code,
          message: result.data.message,
          ttl: result.data.ttl,
        };
        console.log(item);
        await wmzySql.update('major_admission_html', item, {
          where: {
            id: majorAdmissionInfo.id,
          },
        });
      } else {
        await wmzySql.update('major_admission_html', {
          status: 500,
          code: result.data.code,
          message: result.data.message,
          ttl: result.data.ttl,
        }, {
          where: {
            id: majorAdmissionInfo.id,
          },
        });
      }
      await loadSchoolAdmissionHtml(parseInt(id) + 1);
    }

    console.log('结束');
  }

}


module.exports = ZsgkController;
