'use strict';
const Controller = require('../care/base_controller');
const cheerio = require('cheerio');
const urlencode = require('urlencode');

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
    this.yearList = [ 2019, 2020, 2021 ];
    this.kqList = [ 1, 2, 3 ];
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
    this.schoolNum = 3000;
    const size = this.size;
    const page = this.page;
    if (!this.pageCount) {
      this.pageCount = Math.ceil(this.schoolNum / size);
    }
    const url = 'https://www.baokaodaxue.com/bkdx/search/college?dq=&type=&bz=&kp=&page=' + page;
    const cookie = 'PHPSESSID=c5mnt0gmt940dpf62rte6egkel; bkdx_kaoqu=%7B%22name%22%3A%22%E4%B8%8A%E6%B5%B7%22%2C%22id%22%3A%223%22%7D; Hm_lvt_0004f9f3a5e4418fff51359e308a8f03=1584423738,1584531574; Hm_lpvt_0004f9f3a5e4418fff51359e308a8f03=1584534276';
    const result = await ctx.baseGet(url, {}, cookie);
    // console.log(result.data);
    // ctx.body = result;
    // ctx.satus = 200;
    if (result.data) {
      await this.initSchool(result.data, ctx);
    }
    if (page <= this.pageCount) {
      this.page = this.page + 1;
      console.log('学校爬取进度', { page, size }, '已爬取' + (page * size));
      await this.loadSchool();
    } else {
      console.log('爬完了');
    }
  }

  async initSchool(schoolListHtml, ctx) {
    // console.log(schoolListHtml);
    const bkzySql = ctx.app.mysql.get('bkzy');

    const $ = cheerio.load(schoolListHtml);
    const schoolList = $('div.result-college-item.cls');
    const schoolArr = [];
    for (let i = 0; i < schoolList.length; i++) {
      const schoolHref = $('div.result-college-item.cls').eq(i).find('a')
        .eq(0)
        .attr('href');
      const schoolId = schoolHref.split('?cid=')[1];
      const schoolName = $('div.result-college-item.cls').eq(i).find('a')
        .eq(0)
        .text();
      schoolArr.push({
        id: schoolId,
        name: schoolName,
        href: schoolHref,
      });
    }
    bkzySql.insert('school', schoolArr);
    // console.log(schoolArr);
    return;
  }

  async initSchoolAdmissionTable() {
    const { ctx } = this;
    const bkzySql = ctx.app.mysql.get('bkzy');
    this.schoolList = await bkzySql.select('school');
    console.log(this.schoolList);
    const schoolAdmissionJson = [];
    for (let i = 0; i < this.schoolList.length; i++) {
      const item = this.schoolList[i];
      this.provinceList.forEach((item2, index2) => {
        this.yearList.forEach(item3 => {
          const schoolAdmissionJsonItem = {
            school_id: item.id,
            school_name: item.name,
            province_id: item2.id,
            province_name: item2.name,
            year: item3,
          };
          schoolAdmissionJson.push(schoolAdmissionJsonItem);
        });
        console.log(`第${index2}个省份`);
      });
    }

    await bkzySql.insert('admission_html', schoolAdmissionJson);
  }


  async loadSchoolAdmission() {
    const { ctx } = this;
    const { id = 150000 } = ctx.query;
    const bkzySql = ctx.app.mysql.get('bkzy');

    for (let i = 0; i < 113862; i = i + 10000) {
      loadSchoolAdmissionHtml(i);
    }
    async function loadSchoolAdmissionHtml(id) {
      const schoolAdmissionTable = await bkzySql.get('admission_html', { id, status: null });
      if (!schoolAdmissionTable) {
        console.log({ id });
        await loadSchoolAdmissionHtml(parseInt(id) + 1);
        // ctx.status = 200;
        // ctx.body = '结束';
        return;
      }

      console.log(schoolAdmissionTable);
      const { school_id, province_id, province_name, year } = schoolAdmissionTable;
      const url = `https://www.baokaodaxue.com/bkdx/xgk/getMajor?kq=${province_id}&year=${year}&cid=${school_id}&type=1`;
      const code = urlencode('{"name":"上海","id":"3"}');
      const cookie = `bkdx_kaoqu=${code}; PHPSESSID=ckiua974k0eoh3cc0fg3pbngjt; user=13628624946; pwd=bHV2NTk4NTYyNzQ3; Hm_lvt_0004f9f3a5e4418fff51359e308a8f03=1585059951,1587516495; Hm_lpvt_0004f9f3a5e4418fff51359e308a8f03=1587634765`;
      const result = await ctx.baseGet(url, {}, cookie);
      if (result.status === 200 && result.data) {
        await bkzySql.update('admission_html', {
          status: result.status,
          html: result.data,
        }, {
          where: {
            id: schoolAdmissionTable.id,
          },
        });
        await loadSchoolAdmissionHtml(parseInt(id) + 1);
      }
    }

  }


  async checkSchoolAdmissionData() {
    const { ctx, app } = this;
    const bkzySql = ctx.app.mysql.get('bkzy');


    for (let i = 6364; i < 113862; i = i + 10000) {
      initItem(i);
    }
    async function initItem(id) {
      const admissionHtml = await bkzySql.get('admission_html', { id, status: 200 });
      if (!admissionHtml) {
        await initItem(id + 1);
        return;
      }
      const $ = cheerio.load(admissionHtml.html);
      const trArr = $('table.table-data tbody tr');
      const itemArr = [];
      if ($('table.table-data tbody tr').length > 1) {
        for (let i = 1; i < trArr.length; i++) {
          const item = {
            from_id: admissionHtml.id,
            province_id: null,
            province_name: null,
            school_id: admissionHtml.school_id,
            school_name: admissionHtml.school_name,
            major_id: null,
            major_name: null,
            year: admissionHtml.year,
            level: null,
            subject_type: null,
            student_province_id: admissionHtml.province_id,
            student_province_name: admissionHtml.province_name,
            parent_major_id: null,
            parent_major_name: null,
          };
          item.parent_major_name = trArr.eq(i).find('td')
            .eq(1)
            .text()
            .replace(/\s*/g, '');
          item.subject_type = trArr.eq(i).find('td')
            .eq(2)
            .text()
            .replace(/\s*/g, '');
          item.major_name = trArr.eq(i).find('td')
            .eq(3)
            .text()
            .replace(/\s*/g, '');
          itemArr.push(item);
        }
      }
      console.log(itemArr);
      if (itemArr.length !== 0) {
        await bkzySql.insert('admission_data', itemArr);
        await bkzySql.update('admission_html', {
          status: 111,
        }, {
          where: {
            id: admissionHtml.id,
          },
        });
      } else {
        await bkzySql.update('admission_html', {
          status: 404,
        }, {
          where: {
            id: admissionHtml.id,
          },
        });
      }
      await initItem(id + 1);
    }
    const teacher = await bkzySql.get('admission_html', { id: 2 });
    const $ = cheerio.load(teacher.html);
    const tdArr = $('table.table-data tbody tr');
    console.log(tdArr.length);
    console.log(tdArr.eq(0).find('td').length);
    console.log(tdArr.eq(1).find('td').eq(1)
      .text()
      .replace(/\s*/g, ''));
    console.log(tdArr.eq(1).find('td').eq(2)
      .text()
      .replace(/\s*/g, ''));
    ctx.status = 200;
    ctx.body = teacher.html;

  }


  async loadProvince() {
    super.loadProvince();
    const provinceList = [
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
    return provinceList;
  }

  async loadSubject() {
    super.loadSubject();
  }

  async loadBatch() {
    super.loadBatch();
  }


  async initSchoolAdmission() {
    super.initSchoolAdmission();
    const { ctx } = this;
    const schoolProvinceArr = await ctx.model.SchoolAdmissionJson.findAll({
      where: {
        status: 600,
      },
      order: [[ 'id' ]],
      limit: 35,
    });
    let loadNum = 0;
    const schoolAdmissionArr = [];
    const idsArr = [];
    for (let i = 0; i < schoolProvinceArr.length; i++) {
      const item = schoolProvinceArr[i];
      idsArr.push(item.id);
      if (item.json) {
        const schoolProvinceItem = JSON.parse(item.json);
        schoolProvinceItem.forEach(itemJson => {
          schoolAdmissionArr.push({
            school_id: item.school_id,
            r_school_id: item.r_school_id,
            school_name: item.school_name,
            r_school_name: item.r_school_name,
            province_id: item.province_id,
            r_province_id: item.r_province_id,
            province_name: item.province_name,
            r_province_name: item.r_province_name,

            year: itemJson.year,
            min_score: itemJson.min,
            avg_score: itemJson.average,
            max_score: itemJson.max,
            batch_name: itemJson.local_batch_name,
            prov_score: itemJson.proscore,
            subject_type_name: itemJson.local_type_name,
          });
        });
      }
      loadNum++;
    }
    await ctx.model.SchoolAdmission.bulkCreate(schoolAdmissionArr);
    await ctx.model.SchoolAdmissionJson.update({
      status: 666,
    }, {
      where: {
        id: {
          $in: idsArr,
        },
      },
    });
    if (loadNum === 35) {
      this.initSchoolAdmission();
    }
  }

  async initSchoolMajorAdmissionTable() {
    const { ctx } = this;
    this.provinceList = await this.loadProvince();
    this.schoolList = await ctx.model.School.findAll();
    const schoolMajorAdmissionJson = [];
    this.schoolList.forEach(item => {
      this.provinceList.forEach(item2 => {
        this.yearList.forEach(item3 => {
          this.subjectTypeList.forEach(item4 => {
            const schoolMajorAdmissionJsonItem = {
              school_id: item.school_id,
              school_name: item.name,
              province_id: item2.id,
              province_name: item2.name,
              year: item3,
              subject_type: item4,
            };
            schoolMajorAdmissionJson.push(schoolMajorAdmissionJsonItem);
          });
        });
      });
    });
    await ctx.model.SchoolMajorAdmissionJson.bulkCreate(schoolMajorAdmissionJson);
  }

  async loadSchoolMajorAdmission() {
    const { ctx } = this;
    const schoolProvinceArr = await ctx.model.SchoolMajorAdmissionJson.findAll({
      where: {
        // id:{
        // 	$gt:minId
        // },
        // isHave: {
        // 	$ne:456
        // },
        status: 1,
      },
      order: [[ 'id' ]],
      limit: 30,
    });
    if (schoolProvinceArr) {
      let loadNum = 0;
      for (let i = 0; i < schoolProvinceArr.length; i++) {
        const url = 'https://api.eol.cn/gh5/api';
        const item = schoolProvinceArr[i];
        const params = {
          local_province_id: item.province_id,
          local_type_id: item.subject_type === 'WEN' ? 2 : 1,
          uri: 'apidata/api/gk/score/special',
          school_id: item.school_id,
          year: item.year,
          size: '100',
        };
        const schoolProvinceResult = await ctx.basePost(url, params);
        if (schoolProvinceResult && schoolProvinceResult.data && schoolProvinceResult.data.item) {
          const result = await ctx.model.SchoolMajorAdmissionJson.update({
            status: 2,
            json: JSON.stringify(schoolProvinceResult.data.item),
            num: schoolProvinceResult.data.numFound,
            code: schoolProvinceResult.code,
            message: schoolProvinceResult.message,
          }, {
            where: {
              id: item.id,
            },
          });
          if (result) {
            loadNum++;
            if (loadNum === 30) {
              await this.loadSchoolMajorAdmission();
            }
          }
        } else {
          loadNum = loadNum + 1;
        }
      }
    } else {
      this.loadSchoolMajorAdmission();
    }
  }

  async initSchoolMajorAdmission() {
    super.initSchoolMajorAdmission();
    const { ctx } = this;
    const schoolProvinceArr = await ctx.model.SchoolMajorAdmissionJson.findAll({
      where: {
        status: 2,
      },
      order: [[ 'id' ]],
      limit: 50,
    });
    let loadNum = 0;
    const schoolMajorAdmissionArr = [];
    const idsArr = [];
    for (let i = 0; i < schoolProvinceArr.length; i++) {
      const item = schoolProvinceArr[i];
      idsArr.push(item.id);
      if (item.json) {
        const schoolProvinceItem = JSON.parse(item.json);
        schoolProvinceItem.forEach(itemJson => {
          schoolMajorAdmissionArr.push({
            school_id: item.school_id,
            r_school_id: item.r_school_id,
            school_name: item.school_name,
            r_school_name: item.r_school_name,
            province_id: item.province_id,
            r_province_id: item.r_province_id,
            province_name: item.province_name,
            r_province_name: item.r_province_name,

            year: itemJson.year,
            min_score: itemJson.min,
            min_score_rank: itemJson.min_section,
            max_score: itemJson.max,
            avg_score: itemJson.average,

            major_id: itemJson.special_id,
            major_name: itemJson.spname,

            batch_name: itemJson.local_batch_name,
            subject_type_name: itemJson.local_type_name,

            province_score: itemJson.proscore,
            dual_class_name: itemJson.dual_class_name,
          });
        });
      }
      loadNum++;
    }
    await ctx.model.SchoolMajorAdmission.bulkCreate(schoolMajorAdmissionArr);
    await ctx.model.SchoolMajorAdmissionJson.update({
      status: 600,
    }, {
      where: {
        id: {
          $in: idsArr,
        },
      },
    });
    if (loadNum === 50) {
      this.initSchoolMajorAdmission();
    }
  }

}


module.exports = ZsgkController;
