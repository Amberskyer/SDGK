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
    this.subjectTypeList = [ 'WEN', 'LI' ];
  }

  async initRateTable() {

    const { ctx } = this;
    const schoolList = await ctx.kkModel.SdgkSchool.findAll();
    const provinceList = await ctx.kkModel.Province.findAll({
      where: {
        status: {
          $notIn: [ 444 ],
        },
      },
    });
    const subjectTypeList = this.subjectTypeList;
    for (let i = 0; i < schoolList.length; i++) {
      const schoolRateArr = [];
      const schoolItem = schoolList[i];
      for (let j = 0; j < provinceList.length; j++) {
        const provinceItem = provinceList[j];
        for (let l = 0; l < subjectTypeList.length; l++) {
          const subjectTypeItem = subjectTypeList[l];
          const item = {
            school_id: schoolItem.id,
            school_name: schoolItem.xue_xiao_ming_cheng,
            province_id: provinceItem.r_province_id,
            province_name: provinceItem.province_name,
            subject_type: subjectTypeItem,
            student_rank: 1,
          };
          schoolRateArr.push(item);
        }

      }

      await ctx.kkModel.SdgkRateTable.bulkCreate(schoolRateArr);
    }
  }


  async initRateForEnd() {

    const { ctx } = this;
    const provinceList = await ctx.kkModel.Province.findAll({
      where: {
        status: {
          $notIn: [ 404 ],
        },
      },
    });
    const provinceObj = {};
    provinceList.forEach(item => {
      provinceObj[item.province_name] = 'Rate' + item.pin_yin_two;
    });

    for (let i = 0; i < provinceList.length; i++) {

      initItem(provinceList[i].province_name, provinceList[i].r_province_id);
    }

    // initItem('山西', 5);

    async function initItem(location, locationId) {


      const rateTableResult = await ctx.kkModel.SdgkRateTable.findAll({
        where: {
          status: {
            $in: [ 1 ],
          },
          province_id: locationId,
          // id: 250,
          // probability: rate,
        }, // WHERE 条件
        // order: [[ 'probability' ]],
        limit: 1,
        // offset: offsetNum,
      });

      const sdgkRateTableInfo = rateTableResult[0];

      if (!sdgkRateTableInfo) {
        console.log('没有哦');
        return;
      }

      // const rateList = [];
      const rateList = await ctx.kkModel[provinceObj[location]].findAll({
        where: {
          // status: {
          // $in: [ '2222', '200' ],
          // },
          r_rate: {
            $ne: null,
          },
          r_batch_id: {
            $ne: null,
          },
          // status: -1,
          r_school_id: sdgkRateTableInfo.school_id,
          r_province_id: sdgkRateTableInfo.province_id,
          r_subject_type: sdgkRateTableInfo.subject_type,
          // probability: rate,
        }, // WHERE 条件
        order: [[ 'score' ]],
        attributes: [ 'id', 'college', 'aos', 'location', 'batch', 'score', 'year', 'student_rank', 'rate', 'r_rate', 'low_rank', 'low_score', 'status', 'r_school_id', 'r_province_id', 'r_subject_type', 'r_batch_id' ],
        group: [ 'r_school_id', 'r_province_id', 'r_subject_type', 'r_batch_id', 'student_rank' ],
        // offset: offsetNum,
      });

      if (rateList && rateList.length !== 0) {
        // console.log(rateList);

        const batchArr = rateList.map(item => {
          return item.r_batch_id;
        });
        const batchSet = new Set(batchArr);


        const rateArr = [];
        batchSet.forEach(batchValue => {
          let r_school_id = null;
          let r_province_id = null;
          let r_subject_type = null;
          let r_batch_id = null;


          const _batchBeginRateArr = [ ];
          const _batchEndRateArr = [ 3000000 ];

          const _rateLit = [];

          rateList.forEach((item, index) => {
            if (item.r_batch_id === batchValue) {
              _rateLit.push(item);
            }

          });

          _rateLit.forEach((item, index) => {
            r_school_id = item.r_school_id;
            r_province_id = item.r_province_id;
            r_subject_type = item.r_subject_type;
            r_batch_id = item.r_batch_id;
            _batchBeginRateArr.push(item.student_rank + 1);
            _batchEndRateArr.push(item.student_rank);
          });

          _batchBeginRateArr.push(1);

          _batchBeginRateArr.forEach((item, index) => {
            if (index === 0) {
              rateArr.push({
                school_id: r_school_id,
                province_id: r_province_id,
                subject_type: r_subject_type,
                batch_id: r_batch_id,
                rank_begin: item,
                rank_end: _batchEndRateArr[index],
                rank_rate: 10,
                status: 200,
              });
            } else if (index === _batchBeginRateArr.length - 1) {

              rateArr.push({
                school_id: r_school_id,
                province_id: r_province_id,
                subject_type: r_subject_type,
                batch_id: r_batch_id,
                rank_begin: item,
                rank_end: _batchEndRateArr[index],
                rank_rate: 99,
                status: 200,
              });
            } else {
              rateArr.push({
                school_id: r_school_id,
                province_id: r_province_id,
                subject_type: r_subject_type,
                batch_id: r_batch_id,
                rank_begin: item,
                rank_end: _batchEndRateArr[index],
                rank_rate: _rateLit[index - 1].r_rate,
                status: 200,
              });
            }
          });
        });

        await ctx.kkModel[`TbGkRankRates_${locationId}`].bulkCreate(rateArr);

        await ctx.kkModel.SdgkRateTable.update({
          status: 200,
          count_two: rateArr.length,
        }, {
          where: {
            id: sdgkRateTableInfo.id,
          },
        });

      } else {

        let sdgkRateList = await ctx.kkModel[`SdgkRate_${locationId}`].findAll({
          where: {
            // status: -1,
            rank_rate: {
              $ne: null,
            },
            school_id: sdgkRateTableInfo.school_id,
            province_id: sdgkRateTableInfo.province_id,
            subject_type: sdgkRateTableInfo.subject_type,
            // probability: rate,
          }, // WHERE 条件
          // order: [[ 'probability' ]],
        });
        if (sdgkRateList && sdgkRateList.length !== 0) {
          sdgkRateList = sdgkRateList.map(item => {
            if (item.rank_rate < 50) {
              item.rank_rate = 0;
            }
            return item;
          });
          await ctx.kkModel[`TbGkRankRates_${locationId}`].bulkCreate(sdgkRateList);
        }

        // console.log(sdgkRateTableInfo, '2222222222');

        await ctx.kkModel.SdgkRateTable.update({
          status: 404,
          count_two: sdgkRateList.length,
        }, {
          where: {
            id: sdgkRateTableInfo.id,
          },
        });
      }


      await initItem(location, locationId);
    }
  }

  async initRateForEndByScore() {

    const { ctx } = this;
    const provinceList = await ctx.kkModel.Province.findAll({
      where: {
        status: {
          $notIn: [ 404 ],
        },
      },
    });
    const provinceObj = {};
    provinceList.forEach(item => {
      provinceObj[item.province_name] = 'Rate' + item.pin_yin_two;
    });

    // for (let i = 0; i < provinceList.length; i++) {
    //
    //   initItem(provinceList[i].province_name, provinceList[i].r_province_id);
    // }

    initItem('新疆', 32);

    async function initItem(location, locationId) {


      const rateTableResult = await ctx.kkModel.SdgkRateTable.findAll({
        where: {
          status: {
            $in: [ -1 ],
          },
          province_id: locationId,
          // id: 250,
          // probability: rate,
        }, // WHERE 条件
        // order: [[ 'probability' ]],
        limit: 1,
        // offset: offsetNum,
      });

      const sdgkRateTableInfo = rateTableResult[0];

      if (!sdgkRateTableInfo) {
        console.log('没有哦');
        return;
      }

      // const rateList = [];
      const rateList = await ctx.kkModel[provinceObj[location]].findAll({
        where: {
          status: {
            $in: [ '2222' ],
          },
          // rate: {
          //   $notIn: [ null ],
          // },
          // status: -1,
          r_school_id: sdgkRateTableInfo.school_id,
          r_province_id: sdgkRateTableInfo.province_id,
          r_subject_type: sdgkRateTableInfo.subject_type,
          // probability: rate,
        }, // WHERE 条件
        order: [[ 'score' ]],
        attributes: [ 'id', 'college', 'aos', 'location', 'batch', 'score', 'year', 'student_rank', 'rate', 'r_rate', 'low_rank', 'low_score', 'status', 'r_school_id', 'r_province_id', 'r_subject_type', 'r_batch_id' ],
        group: [ 'college', 'location', 'aos', 'batch', 'r_rate' ],
        // offset: offsetNum,
      });


      if (rateList && rateList.length !== 0) {
        // console.log(rateList);

        const batchArr = rateList.map(item => {
          return item.dataValues.batch;
        });
        console.log(rateList[1]);
        console.log(batchArr);
        const batchSet = new Set(batchArr);
        console.log(batchSet);


        const rateArr = [];
        batchSet.forEach(batchValue => {
          let r_school_id = null;
          let r_province_id = null;
          let r_subject_type = null;
          let r_batch_id = null;
          let batch = batchValue;


          const _batchBeginRateArr = [ ];
          const _batchEndRateArr = [ 0 ];

          const _rateLit = [];

          console.log(rateList.length);

          rateList.forEach((item, index) => {
            item = item.dataValues;
            if (rateList.length >= 2) {
              if (index === 0) {
                _rateLit.push(item);
              } else if (item.batch === batchValue && item.r_rate !== rateList[index - 1].r_rate) {
                _rateLit.push(item);
              }
            } else if (rateList.length === 1) {
              if (item.batch === batchValue) {
                _rateLit.push(item);
              }
            }

          });

          console.log({ batchValue });
          console.log(rateList.length);


          _rateLit.forEach((item, index) => {
            r_school_id = item.r_school_id;
            r_province_id = item.r_province_id;
            r_subject_type = item.r_subject_type;
            r_batch_id = item.r_batch_id;
            batch = item.batch;
            _batchBeginRateArr.push(item.score - 1);
            _batchEndRateArr.push(item.score);
          });

          _batchBeginRateArr.push(750);

          console.log(_rateLit.length);
          console.log(_batchBeginRateArr);
          console.log(_batchEndRateArr);

          _batchBeginRateArr.forEach((item, index) => {
            if (index === 0) {
              rateArr.push({
                school_id: r_school_id,
                province_id: r_province_id,
                subject_type: r_subject_type,
                batch_id: r_batch_id,
                score_begin: item,
                score_end: _batchEndRateArr[index],
                rank_rate: 0,
                status: 200,
              });
            } else {
              if (index >= 2 && _rateLit[index - 1].r_rate === 99 && _rateLit[index - 2].r_rate === 99) {
                // ...
              } else {
                rateArr.push({
                  school_id: r_school_id,
                  province_id: r_province_id,
                  subject_type: r_subject_type,
                  batch_id: r_batch_id,
                  score_begin: item,
                  score_end: _batchEndRateArr[index],
                  rank_rate: _rateLit[index - 1].r_rate,
                  status: 200,
                });
              }
            }
          });
        });

        await ctx.kkModel[`TbGkRankRates_${locationId}`].bulkCreate(rateArr);

        await ctx.kkModel.SdgkRateTable.update({
          status: '200_score',
          count: rateArr.length,
        }, {
          where: {
            id: sdgkRateTableInfo.id,
          },
        });

      } else {

        await ctx.kkModel.SdgkRateTable.update({
          status: '222_score',
        }, {
          where: {
            id: sdgkRateTableInfo.id,
          },
        });
      }


      await initItem(location, locationId);
    }
  }


}


module.exports = KKController;
