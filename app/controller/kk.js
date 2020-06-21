'use strict';
const MD5 = require('md5-node');
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

  async loadRate() {

    const { ctx } = this;
    // schoolList = await ctx.kkModel.school.findAll();


    // const rate = null;
    // const rank = null;
    // const last_rank = null;
    // const rankStep = 1000;
    let sumNum = 0;

    await initItem(100, 1, 1, 1000, null);
    async function initItem(rate, rank, last_rank, rankStep = 1000, id) {


      let rateList = [];
      if (id) {
        rateList = await ctx.kkModel.Rate.findAll({
          where: {
            id: id + 1,
            status: -1,
          }, // WHERE 条件
          // order: [[ 'probability' ]],
          limit: 1,
        });
      } else {
        rateList = await ctx.kkModel.RateTable.findAll({
          where: {
            status: -1,
            // probability: rate,
          }, // WHERE 条件
          // order: [[ 'probability' ]],
          limit: 1,
        });
      }
      const rateListItem = rateList[0];
      if (rateListItem) {
        if (rateListItem.probability === 100) {
          last_rank = 1;
          rank = 1;
          rate = 100;
          rankStep = 1000;
        } else {
          rank = rank || last_rank + rankStep;
          rate = rateListItem.probability;
        }
      }
      sumNum++;
      console.log({ sumNum });
      console.log('排名为', rank, '概率为', rate);
      const student_rank = rank;
      const score = 750;
      const college = rateListItem.college;
      const location = rateListItem.location;
      const aos = rateListItem.aos;
      const year = 2019;

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
      } else if (schoolProvinceResult.status === 200) {
        const rateInfo = schoolProvinceResult.data.data;
        const _rate = Math.round(rateInfo.probability * 100);
        const low_rank = rateInfo.lowest_rank;
        const item = {
          college,
          aos,
          batch: rateInfo.batch,
          location,
          student_rank: rank,
          low_rank: rateInfo.lowest_rank,
          low_score: rateInfo.lowest_score,
          score,
          year,
          probability: _rate,
          status: 200,
        };
        console.log('录取概率', rate, _rate);
        console.log('排名', rank, last_rank);

        if (low_rank === 0) {
          // 不招生
          await ctx.kkModel.Rate.update({
            status: 600,
          }, {
            where: {
              college,
              aos,
              location,
              year,
            },
          });
          await initItem(100, 1, 1, 1000, null);
        }

        if (_rate === rate) {
          console.log('类型一');
          // await ctx.kkModel.Rate.bulkCreate([ item ]);
          // 更新排名
          await ctx.kkModel.Rate.update(item, {
            where: {
              id: rateListItem.id,
            },
          });

          rate = _rate - 1;
          last_rank = rank;
          rank = rank + rankStep;
          rank = low_rank && low_rank < rank ? low_rank : rank;
          if (rate === 50 || rate === 49) {
            await initItem(rate, rank, last_rank, rankStep, rateListItem.id);
          } else {
            await initItem(rate, rank, last_rank, rankStep);
          }
        } else if (_rate < rate) {
          rank = Math.floor((last_rank + rank) / 2);
          console.log('类型二', rank, last_rank, rankStep);
          if (Math.abs(rank - last_rank) === 1 || Math.abs(rank - last_rank) === 0) {
            console.log('进来了', rank, last_rank);

            // 跳过该概率
            await ctx.kkModel.Rate.update({
              status: 404,
            }, {
              where: {
                id: rateListItem.id,
              },
            });

            // rankStep = 1000;
            rate = rate - 1;
            // last_rank = rank;
            rank = last_rank + rankStep;
            rank = low_rank && low_rank < rank ? low_rank : rank;
            await initItem(rate, rank, last_rank, rankStep);
          } else {
            await initItem(rate, rank, last_rank, rankStep);
          }
        } else if (_rate > rate) {
          console.log('类型三');
          last_rank = rank;
          rank = rank + rankStep;
          rank = low_rank && low_rank < rank ? low_rank : rank;
          await initItem(rate, rank, last_rank, rankStep);
        }
      }
    }
  }


}

module.exports = KKController;
