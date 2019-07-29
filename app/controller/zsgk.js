'use strict';
const Controller = require('../care/base_controller');
const { data: rSchoolJson } = require('../public/json/r_school');
const { data: rProvinceJson } = require('../public/json/r_province');

class ZsgkController extends Controller {

  constructor(ctx) {
    super(ctx);
    this.schoolList = null;
  }

  async init() {
    console.log('开始');
    // const interval = setInterval(this.loadSchoolMajorAdmission(), 1800);
    await this.initSchoolMajorAdmission();
  }

  async loadSchool() {
    super.loadSchool();
    const { ctx } = this;
    this.schoolNum = 2835;
    const size = this.size;
    const page = this.page;
    if (!this.pageCount) {
      this.pageCount = Math.ceil(this.schoolNum / size);
    }
    const url = 'https://api.eol.cn/gh5/api';
    const params = {
      page, size,
      uri: 'apigkcx/api/school/hotlists',
    };
    const result = await ctx.basePost(url, params);
    // console.log(result.data);
    if (result.data && result.data.item && result.data.item.length !== 0) {
      this.initSchool(result.data.item, ctx);
    }
    if (page <= this.pageCount) {
      this.page = this.page + 1;
      console.log('学校爬取进度', { page, size }, '已爬取' + (page * size));
      await this.loadSchool();
    }
  }

  async initSchool(schoolList, ctx) {
    schoolList = schoolList.map(item => {
      return {
        id: item.school_id,
        school_id: item.school_id,
        name: item.name,
      };
    });
    await ctx.model.School.bulkCreate(schoolList);
    return;
  }

  async compareSchool() {
    const { ctx } = this;
    const schoolArr = await ctx.model.School.findAll({
      where: {
        // id:{
        // 	$gt:minId
        // },
        // isHave: {
        // 	$ne:456
        // },
        status: 0,
      },
      order: [[ 'id' ]],
      limit: 10,
    });
    console.log(schoolArr);
    let loadNum = 0;
    for (let i = 0; i < schoolArr.length; i++) {
      const schoolItem = schoolArr[i];
      let rSchoolItem = null;
      rSchoolJson.forEach(async item => {
        if (schoolItem.name === item.xue_xiao_ming_cheng) {
          rSchoolItem = item;
          console.log(schoolItem.id);
        }
      });
      if (rSchoolItem) {
        await ctx.model.School.update({
          status: 1,
          r_school_id: rSchoolItem.id,
          r_school_name: rSchoolItem.xue_xiao_ming_cheng,
        }, {
          where: {
            id: schoolItem.id,
          },
        });
      } else {
        await ctx.model.School.update({
          status: 404,
        }, {
          where: {
            id: schoolItem.id,
          },
        });
      }
      loadNum++;
      if (loadNum === 10) {
        await this.compareSchool();
      }
    }
  }

  async loadProvince() {
    super.loadProvince();
    const provinceList = [
      {
        id: 11,
        name: '北京',
      },
      {
        id: 12,
        name: '天津',
      },
      {
        id: 13,
        name: '河北',
      },
      {
        id: 14,
        name: '山西',
      },
      {
        id: 15,
        name: '内蒙古',
      },
      {
        id: 21,
        name: '辽宁',
      },
      {
        id: 22,
        name: '吉林',
      },
      {
        id: 23,
        name: '黑龙江',
      },
      {
        id: 31,
        name: '上海',
      },
      {
        id: 32,
        name: '江苏',
      },
      {
        id: 33,
        name: '浙江',
      },
      {
        id: 34,
        name: '安徽',
      },
      {
        id: 35,
        name: '福建',
      },
      {
        id: 36,
        name: '江西',
      },
      {
        id: 37,
        name: '山东',
      },
      {
        id: 41,
        name: '河南',
      },
      {
        id: 42,
        name: '湖北',
      },
      {
        id: 43,
        name: '湖南',
      },
      {
        id: 44,
        name: '广东',
      },
      {
        id: 45,
        name: '广西',
      },
      {
        id: 46,
        name: '海南',
      },
      {
        id: 50,
        name: '重庆',
      },
      {
        id: 51,
        name: '四川',
      },
      {
        id: 52,
        name: '贵州',
      },
      {
        id: 53,
        name: '云南',
      },
      {
        id: 54,
        name: '西藏',
      },
      {
        id: 61,
        name: '陕西',
      },
      {
        id: 62,
        name: '甘肃',
      },
      {
        id: 63,
        name: '青海',
      },
      {
        id: 64,
        name: '宁夏',
      },
      {
        id: 65,
        name: '新疆',
      },
    ];
    return provinceList;
  }

  async compareProvince() {
    const { ctx } = this;
    const provinceArr = await this.loadProvince();
    console.log(provinceArr.length);
    const nProvinceArr = provinceArr.map(item => {
      const nProvinceItem = {
        status: 0,
        id: item.id,
        name: item.name,
        r_province_id: null,
        r_province_name: null,
      };
      rProvinceJson.forEach(itemR => {
        if (itemR.name === item.name) {
          nProvinceItem.r_province_id = itemR.id;
          nProvinceItem.r_province_name = itemR.name;
          nProvinceItem.status = 1;
        }
      });
      return nProvinceItem;
    });
    await ctx.model.Province.bulkCreate(nProvinceArr);
  }

  async loadSubject() {
    super.loadSubject();
  }

  async loadBatch() {
    super.loadBatch();
  }

  async initSchoolAdmissionTable() {
    super.initSchoolAdmissionTable();
    const { ctx } = this;
    this.provinceList = await this.loadProvince();
    this.schoolList = await ctx.model.School.findAll();
    const schoolAdmissionJson = [];
    this.schoolList.forEach(item => {
      this.provinceList.forEach(item2 => {
        const schoolAdmissionJsonItem = {
          school_id: item.school_id,
          school_name: item.name,
          province_id: item2.id,
          province_name: item2.name,
        };
        schoolAdmissionJson.push(schoolAdmissionJsonItem);
      });
    });
    await ctx.model.SchoolAdmissionJson.bulkCreate(schoolAdmissionJson);
  }

  async loadSchoolAdmission() {
    const { ctx } = this;
    const schoolProvinceArr = await ctx.model.SchoolAdmissionJson.findAll({
      where: {
        // id:{
        // 	$gt:minId
        // },
        // isHave: {
        // 	$ne:456
        // },
        status: 0,
      },
      order: [[ 'id' ]],
      limit: 15,
    });
    let loadNum = 0;
    for (let i = 0; i < schoolProvinceArr.length; i++) {
      const url = 'https://api.eol.cn/gh5/api';
      const item = schoolProvinceArr[i];
      const params = {
        uri: 'apidata/api/gk/score/province',
        size: '30',
        local_province_id: item.province_id,
        school_id: item.school_id,
      };
      const schoolProvinceResult = await ctx.basePost(url, params);
      if (schoolProvinceResult) {
        const result = await ctx.model.SchoolAdmissionJson.update({
          status: 1,
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
          if (loadNum === 15) {
            await this.loadSchoolAdmission();
          }
        }
      }
    }
  }

  async initSchoolAdmission() {
    super.initSchoolAdmission();
    const { ctx } = this;
    const schoolProvinceArr = await ctx.model.SchoolAdmissionJson.findAll({
      where: {
        status: 1,
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
      status: 600,
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
