'use strict';
const MD5 = require('md5-node');
const fs = require('fs');
const Controller = require('../care/base_controller');
const SchoolListJson = require('../data/rest.json');
const qs = 'qs';

/**
 * @controller 第三方 组别接口
 */
class KKController extends Controller {

  constructor(ctx) {
    super(ctx);
    this.schoolList = [];
    this.provinceList = [];
    this.subjectTypeList = [ '文科', '理科' ];
  }

  async initSchool() {

    const { ctx } = this;
    const schoolArr = [];
    SchoolListJson.data.colleges.forEach(item => {
      const schoolArrItem = {
        school_name: item.name,
      };
      schoolArr.push(schoolArrItem);
    });
    await ctx.kkModel.School.bulkCreate(schoolArr);

  }

  async initRateTable() {

    const { ctx } = this;
    const schoolList = await ctx.kkModel.School.findAll();
    const provinceList = await ctx.kkModel.Province.findAll();
    const subjectTypeList = this.subjectTypeList;
    for (let i = 0; i < schoolList.length; i++) {
      const schoolRateArr = [];
      const schoolItem = schoolList[i];
      for (let j = 0; j < provinceList.length; j++) {
        const provinceItem = provinceList[j];
        for (let l = 0; l < subjectTypeList.length; l++) {
          const subjectTypeItem = subjectTypeList[l];
          const item = {
            college: schoolItem.school_name,
            location: provinceItem.province_name,
            year: 2019,
            aos: subjectTypeItem,
            probability: null,
            student_rank: 1,
          };
          schoolRateArr.push(item);
        }

      }

      await ctx.kkModel.RateTable.bulkCreate(schoolRateArr);
    }
  }

  async loadRateTable() {

    const { ctx } = this;
    // schoolList = await ctx.kkModel.school.findAll();


    // const rate = null;
    // const rank = null;
    // const last_rank = null;
    // const rankStep = 1000;

    for (let i = 0; i < 168640; i = i + 4000) {

      initItem(i);
    }

    async function initItem(offsetNum) {


      const rateList = await ctx.kkModel.RateTable.findAll({
        where: {
          status: -1,
          id: {
            $gt: offsetNum,
          },
          // probability: rate,
        }, // WHERE 条件
        // order: [[ 'probability' ]],
        limit: 50,
        // offset: offsetNum,
      });

      let sumNum = 0;
      for (let i = 0; i < 50; i++) {
        const rateListItem = rateList[i];
        if (!rateListItem) {
          await initItem(offsetNum);
          return;
        }
        const student_rank = rateListItem.student_rank;
        const score = 750;
        const college = rateListItem.college;
        const location = rateListItem.location;
        const aos = rateListItem.aos;
        const year = rateListItem.year;

        const url = 'https://quark.sm.cn/api/rest';
        const params = {
          url: '/api/rest',
          method: 'QuarkGaoKao.getPredictColleges',
          location,
          aos,
          score,
          student_rank,
          year,
          college,
        };
        // url = url + '?' + qs.stringify(params);
        // console.log({ url });
        const cookie = '__wpkreporterwid_=f4f9c5ea-fa79-46d6-22b7-4b37c8c14713; sm_diu=241e20eaddceb7aaee89eea2fbbcad02%7C%7C11eef1ee4faf608587%7C1589539220; sm_uuid=e4e969d7e31bec7e0bd2fe182355e710%7C%7C%7C1592634858; sm_sid=a0780ee052cbc310f3e278133a78d241; phid=a0780ee052cbc310f3e278133a78d241';
        const schoolProvinceResult = await ctx.baseGet(url, params, cookie);
        // console.log(schoolProvinceResult.data);
        if (schoolProvinceResult.status !== 200) {
          console.log('停了停了————————————————————————————————————');
          sumNum++;
        } else if (schoolProvinceResult.status === 200) {
          const rateInfo = schoolProvinceResult.data.data;
          const item = {
            college,
            aos,
            batch: rateInfo.batch,
            location,
            student_rank: rateInfo.student_rank,
            score,
            year,
            probability: rateInfo.probability,
            low_rank: rateInfo.lowest_rank,
            low_score: rateInfo.lowest_score,
            status: 200,
            html: JSON.stringify(schoolProvinceResult.data),
          };

          await ctx.kkModel.RateTable.update(item, {
            where: {
              id: rateListItem.id,
            },
          });
          sumNum++;
        }
      }


      if (sumNum === 50) {
        await initItem(offsetNum);
      }
    }
  }


  async initRate() {

    const { ctx } = this;
    const provinceList = await ctx.kkModel.Province.findAll();
    const provinceObj = {};
    provinceList.forEach(item => {
      provinceObj[item.province_name] = 'Rate' + item.pin_yin_two;
    });

    for (let i = 0; i < provinceList.length; i = i + 4000) {

      initItem(provinceList[i].province_name);
    }

    async function initItem(location) {


      const rateArrResult = await ctx.kkModel.RateTable.findAll({
        where: {
          status: 200,
          location,
          // probability: rate,
        }, // WHERE 条件
        attributes: [ 'college', 'aos', 'location', 'score', 'year', 'low_rank', 'low_score', 'status' ],
        // order: [[ 'probability' ]],
        limit: 10,
        // offset: offsetNum,
      });

      const rateArr = [];
      const idsArr = [];
      for (let j = 0; j < rateArrResult.length; j++) {
        const rateResult = rateArrResult[j];

        const minScore = rateResult.low_score;

        for (let i = minScore; i <= 750; i++) {
          const item = {
            college: rateResult.college,
            aos: rateResult.aos,
            batch: rateResult.batch,
            location: rateResult.location,
            student_rank: rateResult.student_rank,
            score: rateResult.score,
            year: rateResult.year,
            low_rank: rateResult.low_rank,
            low_score: rateResult.low_score,
          };
          rateArr.push(item);
        }

        idsArr.push(rateResult.id);
      }

      await ctx.kkModel[provinceObj.location].bulkCreate(rateArr);

      await ctx.kkModel.RateTable.update({
        status: 6666,
      }, {
        where: {
          id: {
            $in: idsArr,
          },
        },
      });

      await initItem(location);
    }

  }

  async initRateProvinceSql() {
    const { ctx } = this;
    const provinceList = await ctx.kkModel.Province.findAll();
    // for (let i = 0; i < provinceList.length; i++) {
    //   const provinceListItem = provinceList[i];
    //   const RateSqlStr = await fs.readFileSync('.\\app\\data\\rate.sql');
    //   console.log(RateSqlStr.toString());
    //   const sqlStr = RateSqlStr.toString().replace(/rate/g, `rate_${provinceListItem.pin_yin}`);
    //   await fs.writeFileSync(`.\\app\\data\\rate_${provinceListItem.pin_yin}.sql`, sqlStr);
    // }
    for (let i = 0; i < provinceList.length; i++) {
      const provinceListItem = provinceList[i];
      const RateSqlStr = await fs.readFileSync('.\\app\\model\\kk\\rate.js');
      console.log(RateSqlStr.toString());
      const sqlStr = RateSqlStr.toString().replace(/rate/g, `rate_${provinceListItem.pin_yin}`);
      await fs.writeFileSync(`.\\app\\model\\kk\\rate_${provinceListItem.pin_yin}.js`, sqlStr);
    }
  }
}


module.exports = KKController;
