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

  async checkRateTableFor2020() {

    const { ctx } = this;

    const provinceList = await ctx.kkModel.Province.findAll();
    const provinceObj = {};
    provinceList.forEach(item => {
      provinceObj[item.province_name] = 'Rate' + item.pin_yin_two;
    });

    for (let i = 0; i < 168640; i = i + 40000) {
      initItem(i);
    }

    // initItem(0);
    async function initItem(offsetNum) {

      const rateTableList = await ctx.kkModel.RateTable.findAll({
        where: {
          init_status: -1,
          status: {
            $notIn: [ '6-888' ],
          },
          id: {
            $between: [ offsetNum, offsetNum + 40000 ],
          },
        }, // WHERE 条件
        limit: 50,
      });

      let sumNum = 0;
      const idsArrFor222 = [];
      const idsArrFor444 = [];

      for (let i = 0; i < rateTableList.length; i++) {

        const rateTableInfo = rateTableList[i];
        console.log(rateTableInfo);

        const rateList = await ctx.kkModel[provinceObj[rateTableInfo.location]].findAll({
          where: {
            college: rateTableInfo.college,
            aos: rateTableInfo.aos,
          }, // WHERE 条件
          // order: [[ 'probability' ]],
          group: [ 'college', 'aos' ],
          attributes: [ 'id', 'college', 'aos', 'location', 'batch' ],
          // offset: offsetNum,
        });

        if (rateList.length >= 1) {
          idsArrFor222.push(rateTableInfo.id);
        } else {
          idsArrFor444.push(rateTableInfo.id);
        }
        console.log(rateList.length);
        sumNum++;
      }

      if (sumNum !== 0 && sumNum === rateTableList.length) {

        await ctx.kkModel.RateTable.update({
          init_status: 200,
        }, {
          where: {
            id: {
              $in: idsArrFor222,
            },
          },
        });


        await ctx.kkModel.RateTable.update({
          init_status: 404,
        }, {
          where: {
            id: {
              $in: idsArrFor444,
            },
          },
        });
      }

      await initItem(offsetNum);

    }
  }

  async loadRateTableFor2020() {

    const { ctx } = this;
    // schoolList = await ctx.kkModel.school.findAll();


    // const rate = null;
    // const rank = null;
    // const last_rank = null;
    // const rankStep = 1000;

    for (let i = 0; i < 168640; i = i + 40000) {
      initItem(i);
    }

    // initItem(0);

    async function initItem(offsetNum) {


      const rateList = await ctx.kkModel.RateTable.findAll({
        where: {
          status: {
            $in: [ 222 ],
          },
          id: {
            // $lte: offsetNum + 40000,
            $gte: offsetNum,
          },
          // probability: rate,
        }, // WHERE 条件
        // order: [[ 'probability' ]],
        limit: 30,
        // offset: offsetNum,
      });

      let sumNum = 0;
      const idsArrFor404 = [];
      const idsArrFor301 = [];
      const idsArrForError = [];
      for (let i = 0; i < rateList.length; i++) {
        const rateListItem = rateList[i];
        if (!rateListItem) {
          await initItem(offsetNum);
          return;
        }
        const student_rank = '';
        const score = rateListItem.low_score;
        const batch = rateListItem.batch;
        const college = rateListItem.college;
        const location = rateListItem.location;
        const aos = rateListItem.aos;
        const year = rateListItem.year;

        const url = 'https://quark.sm.cn/api/rest';
        const params = {
          url: '/api/rest',
          method: 'QuarkGaoKao2020.getPredictColleges',
          location,
          aos,
          score,
          student_rank,
          subjects: aos,
          year,
          college,
        };
        // url = url + '?' + qs.stringify(params);
        // console.log({ url });
        const cookie = '__wpkreporterwid_=e07d46a8-717d-4902-aaa0-4b59ccbcee4d; sm_uuid=1fce9782176379015c32aca4cfb2e9ae%7C%7C%7C1592793954; sm_diu=1fce9782176379015c32aca4cfb2e9ae%7C%7C11eef1ee4fe10a7301%7C1592793954; PHPSESSID=614h35h64mfgu20mlck5l1qulk';
        const schoolProvinceResult = await ctx.baseGet(url, params, cookie);
        // console.log(schoolProvinceResult.data);
        if (schoolProvinceResult.status !== 200) {
          console.log('停了停了————————————————————————————————————');
          sumNum++;
          idsArrFor404.push(rateListItem.id);
        } else if (schoolProvinceResult.data.data.status_code === 301) {
          console.log(params, '301301————————————————————————————————————');
          sumNum++;
          idsArrFor301.push(rateListItem.id);
        } else if (schoolProvinceResult.data.data.error === false) {
          console.log(params, 'error————————————————————————————————————');
          sumNum++;
          idsArrForError.push(rateListItem.id);
        } else if (schoolProvinceResult.status === 200 && schoolProvinceResult.data.status === 0) {
          console.log(schoolProvinceResult);
          const rateInfo = schoolProvinceResult.data.data;
          if (batch === rateInfo.college.batch) {
            const item = {
              status: 222222,
              low_score: rateInfo.lowest_score,
              low_rank: rateInfo.lowest_rank,
              rate: rateInfo.college.probability,
            };
            await ctx.kkModel.RateTable.update(item, {
              where: {
                id: rateListItem.id,
              },
            });
          } else {
            const item = {
              status: 444444,
              low_score_two: rateInfo.lowest_score,
              low_rank_two: rateInfo.lowest_rank,
              batch_two: rateInfo.college.batch,
              rate_two: rateInfo.college.probability,
            };
            await ctx.kkModel.RateTable.update(item, {
              where: {
                id: rateListItem.id,
              },
            });
          }
          sumNum++;
        } else {
          sumNum++;
          idsArrFor404.push(rateListItem.id);
        }
      }


      if (sumNum !== 0 && sumNum === rateList.length) {
        if (idsArrFor404.length !== 0) {
          await ctx.kkModel.RateTable.update({
            status: 404,
          }, {
            where: {
              id: {
                $in: idsArrFor404,
              },
            },
          });
        }
        if (idsArrFor301.length !== 0) {
          await ctx.kkModel.RateTable.update({
            status: 303,
          }, {
            where: {
              id: {
                $in: idsArrFor301,
              },
            },
          });
        }
        if (idsArrForError.length !== 0) {
          await ctx.kkModel.RateTable.update({
            status: 505,
          }, {
            where: {
              id: {
                $in: idsArrForError,
              },
            },
          });
        }
        await initItem(offsetNum);
      }
    }
  }

  async destroyRate() {

    const { ctx } = this;
    for (let i = 0; i < 168640; i = i + 40000) {
      initItem(i);
    }

    // initItem(0);

    async function initItem(offsetNum) {


      const rateList = await ctx.kkModel.RateTable.findAll({
        where: {
          status: {
            $in: [ 444444 ],
          },
          id: {
            $lte: offsetNum + 40000,
            $gte: offsetNum,
          },
          // probability: rate,
        }, // WHERE 条件
        // order: [[ 'probability' ]],
        limit: 10,
        // offset: offsetNum,
      });

      let sumNum = 0;
      const idsArrFor404 = [];
      const idsArrFor301 = [];
      const idsArrForError = [];
      for (let i = 0; i < rateList.length; i++) {
        const rateListItem = rateList[i];
        if (!rateListItem) {
          await initItem(offsetNum);
          return;
        }
        const r_batch_id = rateListItem.r_batch_id;
        const r_school_id = rateListItem.r_school_id;
        const r_province_id = rateListItem.r_province_id;
        const r_subject_type = rateListItem.r_subject_type;

        await ctx.kkModel.Rate.destroy({
          where: {
            school_id: r_school_id, province_id: r_province_id, subject_type: r_subject_type,
          },
        });

        sumNum++;
        idsArrFor404.push(rateListItem.id);
      }


      if (sumNum !== 0 && sumNum === rateList.length) {
        if (idsArrFor404.length !== 0) {
          await ctx.kkModel.RateTable.update({
            status: 4040404,
          }, {
            where: {
              id: {
                $in: idsArrFor404,
              },
            },
          });
        }
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

    for (let i = 0; i < provinceList.length; i++) {

      initItem(provinceList[i].province_name);
    }

    async function initItem(location) {


      const rateArrResult = await ctx.kkModel.RateTable.findAll({
        where: {
          status: 222,
          location,
          // probability: rate,
        }, // WHERE 条件
        attributes: [ 'id', 'college', 'aos', 'location', 'score', 'year', 'low_rank', 'low_score', 'status' ],
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
            score: i,
            year: rateResult.year,
            low_rank: rateResult.low_rank,
            low_score: rateResult.low_score,
          };
          rateArr.push(item);
        }

        idsArr.push(rateResult.id);
      }
      console.log(provinceObj);
      console.log(location);
      console.log(provinceObj[location]);
      console.log(idsArr);

      await ctx.kkModel[provinceObj[location]].bulkCreate(rateArr);

      if (idsArr.length !== 0 && idsArr.length === rateArrResult.length) {

        await ctx.kkModel.RateTable.update({
          status: 888,
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

  }


  async initRateFor2020() {

    const { ctx } = this;
    const provinceList = await ctx.kkModel.Province.findAll();
    const provinceObj = {};
    provinceList.forEach(item => {
      provinceObj[item.province_name] = 'Rate' + item.pin_yin_two;
    });

    for (let i = 0; i < provinceList.length; i++) {

      initItem(provinceList[i].province_name);
    }

    async function initItem(location) {


      const rateArrResult = await ctx.kkModel.RateTable.findAll({
        where: {
          status: 222222,
          location,
          // probability: rate,
        }, // WHERE 条件
        attributes: [ 'id', 'college', 'aos', 'location', 'batch', 'batch_two', 'score', 'year', 'low_rank', 'low_rank_two', 'low_score', 'low_score_two', 'status', 'r_school_id', 'r_province_id', 'r_subject_type', 'r_batch_id', 'r_batch_id_two' ],
        // order: [[ 'probability' ]],
        limit: 1,
        // offset: offsetNum,
      });

      const rateArr = [];
      const idsArr = [];
      for (let j = 0; j < rateArrResult.length; j++) {
        const rateResult = rateArrResult[j];

        if (rateResult.batch && !rateResult.batch_two) {
          const minScore = rateResult.low_score;

          for (let i = minScore; i <= 750; i++) {
            const item = {
              college: rateResult.college,
              aos: rateResult.aos,
              batch: rateResult.batch,
              location: rateResult.location,
              student_rank: rateResult.student_rank,
              score: i,
              year: rateResult.year,
              low_rank: rateResult.low_rank,
              low_score: rateResult.low_score,
              r_school_id: rateResult.r_school_id,
              r_province_id: rateResult.r_province_id,
              r_subject_type: rateResult.r_subject_type,
              r_batch_id: rateResult.r_batch_id,
            };
            rateArr.push(item);
          }
        }

        if (rateResult.batch && rateResult.batch_two) {
          const minScore = rateResult.low_score_two;

          for (let i = minScore; i <= 750; i++) {
            const item = {
              college: rateResult.college,
              aos: rateResult.aos,
              location: rateResult.location,
              student_rank: rateResult.student_rank,
              score: i,
              year: rateResult.year,
              batch: rateResult.batch_two,
              low_rank: rateResult.low_rank_two,
              low_score: rateResult.low_score_two,
              r_batch_id: rateResult.r_batch_id_two,
              r_school_id: rateResult.r_school_id,
              r_province_id: rateResult.r_province_id,
              r_subject_type: rateResult.r_subject_type,
            };
            rateArr.push(item);
          }
        }

        idsArr.push(rateResult.id);
      }

      await ctx.kkModel[provinceObj[location]].bulkCreate(rateArr);

      if (idsArr.length !== 0 && idsArr.length === rateArrResult.length) {

        await ctx.kkModel.RateTable.update({
          status: 'F-222222',
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

  }


  async loadRate2() {

    const { ctx } = this;
    for (let i = 0; i < 2665009; i = i + 10000) {

      initItem(i);
    }

    // initItem(99000);

    async function initItem(offsetNum) {


      const rateList = await ctx.kkModel.Rate.findAll({
        where: {
          id: {
            $lte: offsetNum + 10000,
            $gte: offsetNum,
          },
          status: {
            $notIn: [ 666, 404 ],
          },
          // probability: rate,
        }, // WHERE 条件
        // order: [[ 'probability' ]],
        attributes: [ 'id', 'r_school_id', 'r_province_id', 'r_batch_id', 'r_subject_type', 'r_rank' ],
        limit: 40,
        // offset: offsetNum,
      });

      if (rateList.length !== 0) {

        let sumNum = 0;
        const idsArrFor404 = [];
        for (let i = 0; i < rateList.length; i++) {
          const rateListItem = rateList[i];
          const r_school_id = rateListItem.r_school_id;
          const r_province_id = rateListItem.r_province_id;
          const r_subject_type = rateListItem.r_subject_type;
          const r_batch_id = rateListItem.r_batch_id;
          const r_rank = rateListItem.r_rank;

          // console.log('11111', rateList);

          const rateInfo = await ctx.kkModel.TbGkRankRates.findOne({
            where: {
              school_id: r_school_id,
              province_id: r_province_id,
              subject_type: r_subject_type,
              batch_id: r_batch_id,
              rank_begin: {
                $lte: r_rank,
              },
              rank_end: {
                $gte: r_rank,
              },
            },
          });

          // console.log('22222', rateInfo);

          if (!rateInfo) {
            // 统一处理拉取失败的数据
            idsArrFor404.push(rateListItem.id);
            sumNum++;
          } else {
            await ctx.kkModel.Rate.update({
              status: 666,
              r_rate: rateInfo.rank_rate,
            }, {
              where: {
                id: rateListItem.id,
              },
            });
            sumNum++;
          }
        }
        if (sumNum === rateList.length) {
          if (idsArrFor404.length !== 0) {
            await ctx.kkModel.Rate.update({
              status: 404,
            }, {
              where: {
                id: {
                  $in: idsArrFor404,
                },
              },
            });
          }
          await initItem(offsetNum);
        }
      }
    }
  }

  async loadRate() {

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

      initItem(provinceList[i].province_name);
    }

    // initItem('四川');

    async function initItem(location) {


      const rateList = await ctx.kkModel[provinceObj[location]].findAll({
        where: {
          // status: {
          //   $notIn: [ 222, 888 ],
          // },
          status: 2222,
        // probability: rate,
        }, // WHERE 条件
        // order: [[ 'probability' ]],
        attributes: [ 'id', 'college', 'aos', 'location', 'score', 'year', 'low_rank', 'low_score', 'status' ],
        limit: 40,
      // offset: offsetNum,
      });


      let sumNum = 0;
      let isEnough = false;
      const idsArrFor404 = [];
      const idsArrFor301 = [];
      const idsArrForError = [];
      for (let i = 0; i < rateList.length; i++) {
        if (!isEnough) {
          const rateListItem = rateList[i];
          // if (!rateListItem) {
          //   await initItem(location);
          //   return;
          // }
          const student_rank = '';
          const score = rateListItem.score;
          const college = rateListItem.college;
          const location = rateListItem.location;
          const aos = rateListItem.aos;
          const year = rateListItem.year;

          const _last_score_rank = 1;

          const url = 'https://quark.sm.cn/api/rest';
          const params = {
            url: '/api/rest',
            method: 'QuarkGaoKao2020.getPredictColleges',
            location,
            aos,
            score,
            student_rank,
            subjects: aos,
            year,
            college,
          };
          // url = url + '?' + qs.stringify(params);
          // console.log({ url });
          const cookie = '__wpkreporterwid_=e07d46a8-717d-4902-aaa0-4b59ccbcee4d; sm_uuid=1fce9782176379015c32aca4cfb2e9ae%7C%7C%7C1592793954; sm_diu=1fce9782176379015c32aca4cfb2e9ae%7C%7C11eef1ee4fe10a7301%7C1592793954; PHPSESSID=614h35h64mfgu20mlck5l1qulk';
          const schoolProvinceResult = await ctx.baseGet(url, params, cookie);
          // console.log(schoolProvinceResult.data);
          if (schoolProvinceResult.status !== 200) {
            console.log('停了停了————————————————————————————————————'); -sumNum++;
            idsArrFor404.push(rateListItem.id);
          } else if (schoolProvinceResult.data.data.status_code === 301) {
            console.log(params, '301301————————————————————————————————————');
            sumNum++;
            idsArrFor301.push(rateListItem.id);
          } else if (schoolProvinceResult.data.data.error === false) {
            console.log(params, 'error————————————————————————————————————');
            sumNum++;
            idsArrForError.push(rateListItem.id);
          } else if (schoolProvinceResult.status === 200 && schoolProvinceResult.data.status === 0) {
            console.log(schoolProvinceResult);
            const rateInfo = schoolProvinceResult.data.data;
            const _rate = Math.ceil(rateInfo.college.probability * 100);
            const item = {
              batch: rateInfo.college.batch,
              student_rank: rateInfo.student_rank,
              r_rank: _last_score_rank,
              rate: rateInfo.college.probability,
              risky: rateInfo.college.risky,
              status: 222,
            };

            if (aos === rateInfo.college.luqu_genre) {
              await ctx.kkModel[provinceObj[location]].update(item, {
                where: {
                  id: rateListItem.id, status: -1,
                },
              });
            } else {
              await ctx.kkModel[provinceObj[location]].update({
                status: 444,
              }, {
                where: {
                  college, aos,
                },
              });
            }
            sumNum++;
            if (_rate === 100) {

              await ctx.kkModel[provinceObj[location]].update({
                status: 'last_one',
              }, {
                where: {
                  id: rateListItem.id,
                },
              });


              await ctx.kkModel[provinceObj[location]].update({
                rate: null,
                status: 6666,
              }, {
                where: {
                  college, aos, status: -1,
                },
              });
              isEnough = true;
            }
          } else {
            sumNum++;
            idsArrFor404.push(rateListItem.id);
          }
        }

      }


      if (isEnough || (sumNum !== 0 && sumNum === rateList.length)) {
        // if (idsArrFor404.length !== 0) {
        //   await ctx.kkModel[provinceObj[location]].update({
        //     status: 404,
        //   }, {
        //     where: {
        //       id: {
        //         $in: idsArrFor404,
        //       },
        //     },
        //   });
        // }
        // if (idsArrFor301.length !== 0) {
        //   await ctx.kkModel[provinceObj[location]].update({
        //     status: 30303,
        //   }, {
        //     where: {
        //       id: {
        //         $in: idsArrFor301,
        //       },
        //     },
        //   });
        // }
        // if (idsArrForError.length !== 0) {
        //   await ctx.kkModel[provinceObj[location]].update({
        //     status: 505,
        //   }, {
        //     where: {
        //       id: {
        //         $in: idsArrForError,
        //       },
        //     },
        //   });
        // }
        await initItem(location);
      }


    }
  }

  async loadRateFor2020() {

    const { ctx } = this;
    const provinceList = await ctx.kkModel.Province.findAll({
      where: {
        status: 6,
      },
    });
    const provinceObj = {};
    provinceList.forEach(item => {
      provinceObj[item.province_name] = 'Rate' + item.pin_yin_two;
    });

    for (let i = 0; i < provinceList.length; i++) {

      initItem(provinceList[i].province_name);
    }

    // initItem('四川');

    async function initItem(location) {


      const rateList = await ctx.kkModel[provinceObj[location]].findAll({
        where: {
          // status: {
          //   $notIn: [ 222, 888 ],
          // },
          status: 505,
          // probability: rate,
        }, // WHERE 条件
        // order: [[ 'probability' ]],
        attributes: [ 'id', 'college', 'aos', 'location', 'score', 'year', 'low_rank', 'low_score', 'status' ],
        limit: 40,
        // offset: offsetNum,
      });


      let sumNum = 0;
      const isEnough = false;
      const idsArrFor404 = [];
      const idsArrFor301 = [];
      const idsArrForError = [];

      if (rateList.length === 0) {
        return;
      }

      for (let i = 0; i < rateList.length; i++) {
        if (!isEnough) {
          const rateListItem = rateList[i];
          // if (!rateListItem) {
          //   await initItem(location);
          //   return;
          // }
          const student_rank = '';
          const score = rateListItem.score;
          const college = rateListItem.college;
          const location = rateListItem.location;
          const aos = rateListItem.aos;
          const year = rateListItem.year;

          const url = 'https://quark.sm.cn/api/rest';
          const params = {
            url: '/api/rest',
            method: 'QuarkGaoKao2020.getPredictColleges',
            location,
            aos,
            score,
            student_rank,
            subjects: aos,
            year,
            college,
          };
          // url = url + '?' + qs.stringify(params);
          // console.log({ url });
          const cookie = '__wpkreporterwid_=e07d46a8-717d-4902-aaa0-4b59ccbcee4d; sm_uuid=1fce9782176379015c32aca4cfb2e9ae%7C%7C%7C1592793954; sm_diu=1fce9782176379015c32aca4cfb2e9ae%7C%7C11eef1ee4fe10a7301%7C1592793954; PHPSESSID=614h35h64mfgu20mlck5l1qulk';
          const schoolProvinceResult = await ctx.baseGet(url, params, cookie);
          // console.log(schoolProvinceResult.data);
          if (schoolProvinceResult.status !== 200) {
            console.log('停了停了————————————————————————————————————'); -sumNum++;
            idsArrFor404.push(rateListItem.id);
          } else if (schoolProvinceResult.data.data.status_code === 301) {
            console.log(params, '301301————————————————————————————————————');
            sumNum++;
            idsArrFor301.push(rateListItem.id);
          } else if (schoolProvinceResult.data.data.error === false) {
            console.log(params, 'error————————————————————————————————————');
            sumNum++;
            idsArrForError.push(rateListItem.id);
          } else if (schoolProvinceResult.status === 200 && schoolProvinceResult.data.status === 0) {
            console.log(schoolProvinceResult);
            const rateInfo = schoolProvinceResult.data.data;
            const _rate = Math.ceil(rateInfo.college.probability * 100);
            const item = {
              batch: rateInfo.college.batch,
              student_rank: rateInfo.student_rank,
              rate: rateInfo.college.probability,
              risky: rateInfo.college.risky,
              r_rank: null,
              status: 200,

            };

            if (aos === rateInfo.college.luqu_genre) {
              await ctx.kkModel[provinceObj[location]].update(item, {
                where: {
                  id: rateListItem.id,
                },
              });
            } else {
              await ctx.kkModel[provinceObj[location]].update({
                status: 444,
              }, {
                where: {
                  college, aos,
                },
              });
            }
            sumNum++;
            // if (_rate === 100) {
            //
            //   await ctx.kkModel[provinceObj[location]].update({
            //     status: 'last_one',
            //   }, {
            //     where: {
            //       id: rateListItem.id,
            //     },
            //   });
            //
            //   await ctx.kkModel[provinceObj[location]].update({
            //     rate: null,
            //     status: 6666,
            //   }, {
            //     where: {
            //       college, aos, status: -1,
            //     },
            //   });
            //   isEnough = true;
            // }
          } else {
            sumNum++;
            idsArrFor404.push(rateListItem.id);
          }
        }

      }


      if (isEnough || (sumNum !== 0 && sumNum === rateList.length)) {
        // if (idsArrFor404.length !== 0) {
        //   await ctx.kkModel[provinceObj[location]].update({
        //     status: 404,
        //   }, {
        //     where: {
        //       id: {
        //         $in: idsArrFor404,
        //       },
        //     },
        //   });
        // }
        // if (idsArrFor301.length !== 0) {
        //   await ctx.kkModel[provinceObj[location]].update({
        //     status: 30303,
        //   }, {
        //     where: {
        //       id: {
        //         $in: idsArrFor301,
        //       },
        //     },
        //   });
        // }
        // if (idsArrForError.length !== 0) {
        //   await ctx.kkModel[provinceObj[location]].update({
        //     status: 505,
        //   }, {
        //     where: {
        //       id: {
        //         $in: idsArrForError,
        //       },
        //     },
        //   });
        // }
        await initItem(location);
      }


    }
  }


  async loadRateForEnd222() {

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

      initItem(provinceList[i].province_name);
    }

    // initItem('河南');

    async function initItem(location) {


      const rateTableResult = await ctx.kkModel.RateTable.findAll({
        where: {
          status: '2222',
          location,
          // probability: rate,
        }, // WHERE 条件
        attributes: [ 'id', 'college', 'aos', 'location', 'batch', 'batch_two', 'score', 'year', 'low_rank', 'low_rank_two', 'low_score', 'low_score_two', 'status', 'r_school_id', 'r_province_id', 'r_subject_type', 'r_batch_id', 'r_batch_id_two' ],
        // order: [[ 'probability' ]],
        limit: 1,
        // offset: offsetNum,
      });

      const rateTableInfo = rateTableResult[0];

      if (!rateTableInfo) {
        return;
      }


      const rateList = await ctx.kkModel[provinceObj[location]].findAll({
        where: {
          r_school_id: rateTableInfo.r_school_id,
          r_province_id: rateTableInfo.r_province_id,
          r_subject_type: rateTableInfo.r_subject_type,
        }, // WHERE 条件
        attributes: [ 'id', 'college', 'aos', 'location', 'score', 'year', 'low_rank', 'low_score', 'status' ],
      });

      console.log('查到了这么多哦', rateList.length);

      let sumNum = 0;
      let isEnough = false;
      const idsArrFor404 = [];
      const idsArrFor301 = [];
      const idsArrForError = [];
      let _last_score_rank = 3000000;
      let _last_batch = null;

      for (let i = 0; i < rateList.length; i++) {
        if (!isEnough) {
          const rateListItem = rateList[i];
          console.log(rateListItem.score, rateListItem.college);
          const student_rank = '';
          const score = rateListItem.score;
          const college = rateListItem.college;
          const location = rateListItem.location;
          const aos = rateListItem.aos;
          const year = rateListItem.year;

          const url = 'https://quark.sm.cn/api/rest';
          const params = {
            url: '/api/rest',
            method: 'QuarkGaoKao2020.getPredictColleges',
            location,
            aos,
            score,
            student_rank,
            subjects: aos,
            year,
            college,
          };
          console.log('参数是', params);

          const cookie = '__wpkreporterwid_=e07d46a8-717d-4902-aaa0-4b59ccbcee4d; sm_uuid=1fce9782176379015c32aca4cfb2e9ae%7C%7C%7C1592793954; sm_diu=1fce9782176379015c32aca4cfb2e9ae%7C%7C11eef1ee4fe10a7301%7C1592793954; PHPSESSID=614h35h64mfgu20mlck5l1qulk';
          const schoolProvinceResult = await ctx.baseGet(url, params, cookie);
          // console.log(schoolProvinceResult.data);
          if (schoolProvinceResult.status !== 200) {
            console.log('停了停了————————————————————————————————————');
            -sumNum++;
            idsArrFor404.push(rateListItem.id);
          } else if (schoolProvinceResult.data.data.status_code === 301) {
            console.log(params, '301301————————————————————————————————————');
            sumNum++;
            idsArrFor301.push(rateListItem.id);
          } else if (schoolProvinceResult.data.data.error === false) {
            console.log(params, 'error————————————————————————————————————');
            sumNum++;
            idsArrForError.push(rateListItem.id);
          } else if (schoolProvinceResult.status === 200 && schoolProvinceResult.data.status === 0) {
            console.log('报错了', schoolProvinceResult, rateListItem);
            const rateInfo = schoolProvinceResult.data.data;
            const _rate = Math.ceil(rateInfo.college.probability * 100);
            const batch = rateInfo.college.batch;
            const item = {
              batch: rateInfo.college.batch,
              student_rank: rateInfo.student_rank,
              r_rank: null,
              rate: rateInfo.college.probability,
              risky: rateInfo.college.risky,
              status: '200',
            };
            if (rateInfo.student_rank === 1) {
              isEnough = true;
            }
            if (_last_batch && _last_batch !== rateInfo.college.batch) {
              _last_batch = null;
              _last_score_rank = 3000000;
            }
            _last_batch = rateInfo.college.batch;

            if (aos === rateInfo.college.luqu_genre) {
              await ctx.kkModel[provinceObj[location]].update(item, {
                where: {
                  id: rateListItem.id,
                },
              });
            }
            _last_score_rank = rateInfo.student_rank + 1;
            if (isEnough || _rate === 100) {

              await ctx.kkModel[provinceObj[location]].update({
                batch: null,
                student_rank: null,
                r_rank: null,
                rate: null,
                risky: null,
                status: '600',
              }, {
                where: {
                  college, aos,
                  id: {
                    $gt: rateListItem.id,
                  },
                },
              });
              isEnough = true;
              _last_batch = null;
              _last_score_rank = 3000000;
            }

            sumNum++;
          } else {
            sumNum++;
            idsArrFor404.push(rateListItem.id);
          }

        }

      }


      if (isEnough || (sumNum !== 0 && sumNum === rateList.length)) {
        if (idsArrFor404.length !== 0) {
          await ctx.kkModel[provinceObj[location]].update({
            status: '40404',
          }, {
            where: {
              id: {
                $in: idsArrFor404,
              },
            },
          });
        }
        if (idsArrFor301.length !== 0) {
          await ctx.kkModel[provinceObj[location]].update({
            status: '30303',
          }, {
            where: {
              id: {
                $in: idsArrFor301,
              },
            },
          });
        }
        if (idsArrForError.length !== 0) {
          await ctx.kkModel[provinceObj[location]].update({
            status: '50505',
          }, {
            where: {
              id: {
                $in: idsArrForError,
              },
            },
          });
        }
        await ctx.kkModel.RateTable.update({
          status: 'F-222-End',
        }, {
          where: {
            id: rateTableInfo.id,
          },
        });
        await initItem(location);
      }


    }
  }


  async loadRateForEnd444() {

    const { ctx } = this;
    const provinceList = await ctx.kkModel.Province.findAll({
      where: {
        status: 6,
      },
    });
    const provinceObj = {};
    provinceList.forEach(item => {
      provinceObj[item.province_name] = 'Rate' + item.pin_yin_two;
    });

    // for (let i = 0; i < provinceList.length; i++) {
    //
    //   initItem(provinceList[i].province_name);
    // }

    initItem('湖北', 18);
    async function initItem(location) {


      const rateTableResult = await ctx.kkModel.RateTable.findAll({
        where: {
          status: 'F-444444',
          location,
          // id: 167092,
          // probability: rate,
        }, // WHERE 条件
        attributes: [ 'id', 'college', 'aos', 'location', 'batch', 'batch_two', 'score', 'year', 'low_rank', 'low_rank_two', 'low_score', 'low_score_two', 'status', 'r_school_id', 'r_province_id', 'r_subject_type', 'r_batch_id', 'r_batch_id_two' ],
        // order: [[ 'probability' ]],
        limit: 1,
        // offset: offsetNum,
      });


      let fatherSumNum = 0;
      for (let m = 0; m < rateTableResult.length; m++) {

        const rateTableInfo = rateTableResult[m];
        if (!rateTableInfo) {
          return;
        }


        const rateList = await ctx.kkModel[provinceObj[location]].findAll({
          where: {
            // status: {
            //   $in: [ 'ALL', 'All-200', 'ALL-303' ],
            // },
            // status: -1,
            r_school_id: rateTableInfo.r_school_id,
            r_province_id: rateTableInfo.r_province_id,
            r_subject_type: rateTableInfo.r_subject_type,
            // probability: rate,
          }, // WHERE 条件
          // order: [[ 'probability' ]],
          attributes: [ 'id', 'college', 'aos', 'location', 'score', 'year', 'low_rank', 'low_score', 'status' ],
          // offset: offsetNum,
        });

        console.log(rateList);

        let sumNum = 0;
        let isEnough = false;
        const idsArrFor404 = [];
        const idsArrFor301 = [];
        const idsArrForError = [];
        let _last_score_rank = 3000000;
        let _last_batch = null;

        for (let i = 0; i < rateList.length; i++) {
          if (!isEnough) {
            const rateListItem = rateList[i];
            const student_rank = '';
            const score = rateListItem.score;
            const college = rateListItem.college;
            const location = rateListItem.location;
            const aos = rateListItem.aos;
            const year = rateListItem.year;

            const url = 'https://quark.sm.cn/api/rest';
            const params = {
              url: '/api/rest',
              method: 'QuarkGaoKao2020.getPredictColleges',
              location,
              aos,
              score,
              student_rank,
              subjects: aos,
              year,
              college,
            };
            const cookie = 'sm_uuid=a1548c914ec0d19e8115e780e41af399%7C%7C%7C1593417757; sm_diu=a1548c914ec0d19e8115e780e41af399%7C%7C11eef1664fe8b10ca7%7C1593417757; PHPSESSID=tdlm8qlf3gs3c0pp6ppvdv2j3b';
            const schoolProvinceResult = await ctx.baseGet(url, params, cookie);
            // console.log(schoolProvinceResult.data);
            if (schoolProvinceResult.status !== 200) {
              console.log({
                location,
                aos,
                score,
                student_rank,
                subjects: aos,
                year,
                college });
              console.log('停了停了————————————————————————————————————');
              sumNum++;
              idsArrFor404.push(rateListItem.id);
            } else if (schoolProvinceResult.data.data.status_code === 301) {
              console.log(params, '301301————————————————————————————————————');
              sumNum++;
              idsArrFor301.push(rateListItem.id);
            } else if (schoolProvinceResult.data.data.error === false) {
              console.log(params, 'error————————————————————————————————————');
              sumNum++;
              idsArrForError.push(rateListItem.id);
            } else if (schoolProvinceResult.status === 200 && schoolProvinceResult.data.status === 0) {
              console.log(schoolProvinceResult);
              const rateInfo = schoolProvinceResult.data.data;
              const _rate = Math.ceil(rateInfo.college.probability * 100);
              const batch = rateInfo.college.batch;
              const item = {
                batch: rateInfo.college.batch,
                student_rank: rateInfo.student_rank,
                r_rank: null,
                rate: rateInfo.college.probability,
                risky: rateInfo.college.risky,
                status: 'ALL-202',
              };
              if (rateInfo.student_rank === 1) {
                isEnough = true;
              }
              if (_last_batch && _last_batch !== rateInfo.college.batch) {
                _last_batch = null;
                _last_score_rank = 3000000;
              }
              _last_batch = rateInfo.college.batch;

              if (aos === rateInfo.college.luqu_genre) {
                await ctx.kkModel[provinceObj[location]].update(item, {
                  where: {
                    id: rateListItem.id,
                    // status: {
                    //   $in: [ 'ALL' ],
                    // },
                  },
                });
              } else {
                // await ctx.kkModel[provinceObj[location]].update({
                //   status: 'ALL-4000',
                // }, {
                //   where: {
                //     college, aos,
                //   },
                // });
              }
              _last_score_rank = rateInfo.student_rank + 1;

              console.log('停不停', batch, _rate);
              if ((rateInfo.student_rank === 1) || (batch === '本一' || batch === '本一A段' || batch === '本一B段' || batch === '本科'
                  || batch === '本科A批' || batch === '本科批' || batch === '本科批A段') && _rate === 100) {

                console.log('给我停啊啊啊啊啊啊啊啊啊');
                // await ctx.kkModel[provinceObj[location]].update({
                //   batch: rateInfo.college.batch,
                //   student_rank: _last_score_rank,
                //   r_rank: 1,
                //   rate: rateInfo.college.probability,
                //   risky: rateInfo.college.risky,
                // }, {
                //   where: {
                //     id: rateListItem,
                //   },
                // });

                await ctx.kkModel[provinceObj[location]].update({
                  batch: null,
                  student_rank: null,
                  r_rank: null,
                  rate: null,
                  risky: null,
                  status: 'ALL-6000',
                }, {
                  where: {
                    college, aos,
                    status: {
                      $notIn: [ 'ALL-202', 'ALL-303', 'ALL-505' ],
                    },
                  },
                });
                isEnough = true;
                _last_batch = null;
                _last_score_rank = 3000000;
              }

              sumNum++;
            } else {
              sumNum++;
              idsArrFor404.push(rateListItem.id);
            }

          }
        }


        if (isEnough || (sumNum !== 0 && sumNum === rateList.length)) {
          if (idsArrFor404.length !== 0) {
            await ctx.kkModel[provinceObj[location]].update({
              status: 'ALL-404',
            }, {
              where: {
                id: {
                  $in: idsArrFor404,
                },
              },
            });
          }
          if (idsArrFor301.length !== 0) {
            await ctx.kkModel[provinceObj[location]].update({
              status: 'ALL-303',
            }, {
              where: {
                id: {
                  $in: idsArrFor301,
                },
              },
            });
          }
          if (idsArrForError.length !== 0) {
            await ctx.kkModel[provinceObj[location]].update({
              status: 'ALL-505',
            }, {
              where: {
                id: {
                  $in: idsArrForError,
                },
              },
            });
          }
          await ctx.kkModel.RateTable.update({
            status: 'F-444-End',
          }, {
            where: {
              id: rateTableInfo.id,
            },
          });
          fatherSumNum++;
        }
      }

      if (fatherSumNum && fatherSumNum === rateTableResult.length) {

        await initItem(location);
      }

    }
  }


  async initRateForEnd222() {

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

      console.log(provinceList[i].province_name, provinceList[i].r_province_id);
      initItem(provinceList[i].province_name, provinceList[i].r_province_id);
    }

    // initItem('重庆');

    async function initItem(location, locationId) {


      const rateTableResult = await ctx.kkModel.RateTable.findAll({
        where: {
          status: {
            $in: [ `F-222-End_${location}`, `F-444-End_${location}` ],
          },
          location,
          // id: 250,
          // probability: rate,
        }, // WHERE 条件
        attributes: [ 'id', 'college', 'aos', 'location', 'batch', 'batch_two', 'score', 'year', 'low_rank', 'low_rank_two', 'low_score', 'low_score_two', 'status', 'r_school_id', 'r_province_id', 'r_subject_type', 'r_batch_id', 'r_batch_id_two' ],
        // order: [[ 'probability' ]],
        limit: 1,
        // offset: offsetNum,
      });

      const rateTableInfo = rateTableResult[0];

      if (!rateTableInfo) {
        console.log('没有哦');
        return;
      }
      console.log(rateTableInfo.id);

      const rateList = await ctx.kkModel[provinceObj[location]].findAll({
        where: {
          status: {
            $in: [ '200', 'ALL-202' ],
          },
          // status: -1,
          r_school_id: rateTableInfo.r_school_id,
          r_province_id: rateTableInfo.r_province_id,
          r_subject_type: rateTableInfo.r_subject_type,
          // probability: rate,
        }, // WHERE 条件
        // order: [[ 'probability' ]],
        attributes: [ 'id', 'college', 'aos', 'location', 'batch', 'score', 'year', 'student_rank', 'rate', 'r_rate', 'low_rank', 'low_score', 'status', 'r_school_id', 'r_province_id', 'r_subject_type', 'r_batch_id' ],
        group: [ 'college', 'location', 'aos', 'batch', 'student_rank', 'r_rank' ],
        // offset: offsetNum,
      });

      // console.log(rateList);

      const batchArr = rateList.map(item => {
        return item.batch;
      });
      const batchSet = new Set(batchArr);


      const rateArr = [];
      batchSet.forEach(batchValue => {
        let r_school_id = null;
        let r_province_id = null;
        let r_subject_type = null;
        let r_batch_id = null;
        let batch = batchValue;


        const _batchBeginRateArr = [ ];
        const _batchEndRateArr = [ 3000000 ];

        const _rateLit = [];

        rateList.forEach((item, index) => {
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

        _rateLit.forEach((item, index) => {
          r_school_id = item.r_school_id;
          r_province_id = item.r_province_id;
          r_subject_type = item.r_subject_type;
          r_batch_id = item.r_batch_id;
          batch = item.batch;
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
              rank_rate: 0.1,
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
                rank_begin: item,
                rank_end: _batchEndRateArr[index],
                rank_rate: _rateLit[index - 1].r_rate,
                status: 200,
              });
            }
          }
        });
      });

      await ctx.kkModel[`TbGkRankRates_${locationId}`].bulkCreate(rateArr);

      await ctx.kkModel.RateTable.update({
        status: rateTableInfo.status + '_2',
      }, {
        where: {
          id: rateTableInfo.id,
        },
      });

      await initItem(location, locationId);
    }
  }


  async transferRate() {

    const { ctx } = this;
    const provinceList = await ctx.kkModel.Province.findAll({
      where: {
        status: 6,
      },
    });
    const provinceObj = {};
    provinceList.forEach(item => {
      provinceObj[item.province_name] = 'rate_' + item.pin_yin;
    });

    let sqlStr = '';

    for (let i = 0; i < provinceList.length; i++) {

      await initItem(provinceList[i].province_name);
    }

    console.log(sqlStr);

    // initItem('四川');

    async function initItem(location) {
      sqlStr = sqlStr + `INSERT INTO rate (
                              \tschool_id,
                              \tprovince_id,
                              \tbatch_id,
                              \tsubject_type,
                              \trank_begin,
                              \trank_end,
                              \trank_rate
                              )(
                              \tSELECT
                              \t\tr_school_id,
                              \t\tr_province_id,
                              \t\tr_batch_id,
                              \t\tr_subject_type,
                              \t\tr_rank,
                              \t\tstudent_rank,
                              \t\trate
                              \tFROM
                              \t\t${provinceObj[location]}
                              \tWHERE
                              \t\trate is not null
                              );`;
    }
  }

  async addProvinceTable() {

    const { ctx } = this;
    const provinceList = await ctx.kkModel.Province.findAll({
      where: {
        status: 6,
      },
    });

    let sqlStr = '';
    for (let i = 0; i < provinceList.length; i++) {

      await initItem(provinceList[i]);
    }

    console.log(sqlStr);
    fs.writeFileSync('provinceTableSql.txt', Buffer.from(sqlStr), { flag: 'w' });


    // initItem('四川');

    async function initItem(provinceInfo) {
      sqlStr = sqlStr + `
CREATE TABLE \`rate_${provinceInfo.pin_yin}_data\` (
  \`id\` int(11) NOT NULL AUTO_INCREMENT,
  \`school_id\` int(11) DEFAULT NULL,
  \`college\` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  \`aos\` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  \`batch\` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  \`location\` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  \`year\` int(11) DEFAULT NULL,
  \`score\` int(11) DEFAULT NULL,
  \`student_rank\` int(11) DEFAULT NULL,
  \`rate\` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  \`risky\` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  \`r_rank\` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  \`r_rate\` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  \`low_rank\` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  \`low_score\` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  \`status\` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT '-1',
  \`r_school_id\` int(11) DEFAULT NULL,
  \`r_province_id\` int(11) DEFAULT NULL,
  \`r_subject_type\` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  \`r_batch_id\` int(11) DEFAULT NULL,
  PRIMARY KEY (\`id\`) USING BTREE,
  KEY \`id\` (\`id\`) USING BTREE,
  KEY \`college\` (\`college\`) USING BTREE,
  KEY \`location\` (\`location\`) USING BTREE,
  KEY \`status\` (\`status\`) USING BTREE,
  KEY \`aos\` (\`aos\`),
  KEY \`rate\` (\`rate\`),
  KEY \`r_school_id\` (\`r_school_id\`),
  KEY \`r_province_id\` (\`r_province_id\`),
  KEY \`r_subject_type\` (\`r_subject_type\`),
  KEY \`r_batch_id\` (\`r_batch_id\`),
  KEY \`r_rank\` (\`r_rank\`),
  KEY \`r_rate\` (\`r_rate\`)
) ENGINE=InnoDB AUTO_INCREMENT=993675 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci ROW_FORMAT=DYNAMIC;
                          `;
    }
  }

  async initSchoolId() {

    const { ctx } = this;
    const schoolList = await ctx.kkModel.School.findAll();

    let sqlStr = '';
    for (let i = 0; i < schoolList.length; i++) {

      await initItem(schoolList[i]);
    }

    console.log(sqlStr);
    fs.writeFileSync('schoolSql.text', Buffer.from(sqlStr), { flag: 'w' });


    // initItem('四川');

    async function initItem(schoolInfo) {
      sqlStr = sqlStr + `UPDATE rate_an_hui
                          SET r_school_id=${schoolInfo.r_school_id}
                          WHERE college='${schoolInfo.school_name}';`;
    }
  }

  async initProvinceId() {

    const { ctx } = this;
    const provinceList = await ctx.kkModel.Province.findAll();

    let sqlStr = '';
    for (let i = 0; i < provinceList.length; i++) {

      await initItem(provinceList[i]);
    }

    console.log(sqlStr);
    fs.writeFileSync('provinceSql.text', Buffer.from(sqlStr), { flag: 'w' });


    // initItem('四川');

    async function initItem(provinceInfo) {
      sqlStr = sqlStr + `
                        UPDATE \`rate_${provinceInfo.pin_yin}\`
                          SET r_province_id=${provinceInfo.r_province_id}
                          WHERE location='${provinceInfo.province_name}';
                          `;
      sqlStr = sqlStr + `
                        UPDATE \`rate_${provinceInfo.pin_yin}\`
                          SET r_batch_id = 11
                          WHERE
                          \tbatch = '专科';
                          
                          UPDATE \`rate_${provinceInfo.pin_yin}\`
                          SET r_batch_id = 1
                          WHERE
                          \tbatch = '本一';
                          
                          UPDATE \`rate_${provinceInfo.pin_yin}\`
                          SET r_batch_id = 4
                          WHERE
                          \tbatch = '本二';
                          
                          UPDATE \`rate_${provinceInfo.pin_yin}\`
                          SET r_batch_id = NULL
                          WHERE
                          \tbatch = '本三';
                          
                          UPDATE \`rate_${provinceInfo.pin_yin}\`
                          SET r_batch_id = NULL
                          WHERE
                          \tbatch = '本科';
                          `;

      sqlStr = sqlStr + `
                        UPDATE \`rate_${provinceInfo.pin_yin}\`
                          SET r_subject_type = 'LI'
                          WHERE
                          \taos = '理科';
                          
                          UPDATE \`rate_${provinceInfo.pin_yin}\`
                          SET r_subject_type = 'WEN'
                          WHERE
                          \taos = '文科';

                          `;
    }
  }

  async initTableId() {

    const { ctx } = this;
    const provinceList = await ctx.kkModel.Province.findAll();

    let sqlStr = '';
    for (let i = 0; i < provinceList.length; i++) {

      await initItem(provinceList[i]);
    }

    console.log(sqlStr);
    fs.writeFileSync('tableSql.text', Buffer.from(sqlStr), { flag: 'w' });


    // initItem('四川');

    async function initItem(provinceInfo) {
      sqlStr = sqlStr + `
                        ALTER TABLE \`rate_${provinceInfo.pin_yin}\`
                         ADD COLUMN \`r_school_id\`  int NULL AFTER \`rate\`,
                         ADD COLUMN \`r_province_id\`  int NULL AFTER \`r_school_id\`,
                         ADD COLUMN \`r_subject_type\`  varchar(255) NULL AFTER \`r_province_id\`,
                         ADD COLUMN \`r_batch_id\`  int NULL AFTER \`r_subject_type\`,
                         ADD COLUMN \`r_rank\`  varchar(255) NULL AFTER \`r_batch_id\`;`;

      sqlStr = sqlStr + `
                        ALTER TABLE \`rate_${provinceInfo.pin_yin}\`
                         ADD INDEX \`r_school_id\` (\`r_school_id\`),
                         ADD INDEX \`r_province_id\` (\`r_province_id\`),
                         ADD INDEX \`r_subject_type\` (\`r_subject_type\`),
                         ADD INDEX \`r_batch_id\` (\`r_batch_id\`),
                         ADD INDEX \`r_rank\` (\`r_rank\`);
                         `;
    }
  }

  async initBatchId() {

    const { ctx } = this;
    const batchList = await ctx.kkModel.Batch.findAll({
      where: {
        status: {
          $ne: null,
        },
      },
    });

    let sqlStr = '';
    for (let i = 0; i < batchList.length; i++) {

      await initItem(batchList[i]);
    }

    console.log(sqlStr);
    fs.writeFileSync('batchSql.text', Buffer.from(sqlStr), { flag: 'w' });


    // initItem('四川');

    async function initItem(batchInfo) {
      sqlStr = sqlStr + `UPDATE rate_hu_bei
                          SET r_batch_id=${batchInfo.r_batch_id}
                          WHERE batch='${batchInfo.batch_name}';`;
      // sqlStr = sqlStr + `UPDATE rate_table
      //                     SET r_batch_id_two=${batchInfo.r_batch_id}
      //                     WHERE batch_two='${batchInfo.batch_name}';`;
    }
  }

  async loadRateBatch() {

    const { ctx } = this;

    // for (let i = 0; i < 166930; i = i + 1000) {
    //
    //   initItem(i);
    // }

    await initItem(0);

    async function initItem(offsetNum) {


      const rateList = await ctx.kkModel.RateTable.findAll({
        where: {
          // id: {
          // $lt: offsetNum + 1000,
          // $gt: offsetNum,
          // },
          status: 6666,
          // probability: rate,
        }, // WHERE 条件
        // order: [[ 'probability' ]],
        attributes: [ 'id', 'college', 'aos', 'batch', 'location', 'score', 'year', 'low_rank', 'low_score', 'status' ],
        limit: 30,
        // offset: offsetNum,
      });

      console.log(rateList.length);

      if (rateList.length !== 0) {

        let sumNum = 0;
        const idsArrFor200 = [];
        for (let i = 0; i < rateList.length; i++) {
          const rateListItem = rateList[i];
          // const score = rateListItem.student_rank;
          const college = rateListItem.college;
          const location = rateListItem.location;
          const aos = rateListItem.aos;
          // const year = rateListItem.year;
          const batch = rateListItem.batch;

          await ctx.kkModel.Rate.update({
            batch,
            status: 200,
          }, {
            where: {
              college,
              location,
              aos,
            },
          });
          sumNum++;
          idsArrFor200.push(rateListItem.id);
        }

        if (sumNum === rateList.length) {
          await ctx.kkModel.RateTable.update({
            status: 666,
          }, {
            where: {
              id: {
                $in: idsArrFor200,
              },
            },
          });
          await initItem(offsetNum);
        }
      }

    }
  }

  async loadRateSchool() {

    const { ctx } = this;

    const schoolList = await ctx.kkModel.School.findAll();
    for (let i = 0; i < schoolList.length; i++) {

      await initItem(schoolList[i]);
    }
    console.log('完成了');

    // await initItem(0);

    async function initItem(schoolInfo) {
      console.log(schoolInfo.school_name);
      await ctx.kkModel.Rate.update({
        r_school_id: schoolInfo.r_school_id,
      }, {
        where: {
          college: schoolInfo.school_name,
        },
      });
    }
  }

  async loadRateProvince() {

    const { ctx } = this;

    const provinceList = await ctx.kkModel.Province.findAll();
    for (let i = 0; i < provinceList.length; i++) {

      await initItem(provinceList[i]);
    }
    console.log('完成了');

    // await initItem(0);

    async function initItem(provinceInfo) {
      console.log(provinceInfo.province_name);
      await ctx.kkModel.Rate.update({
        r_province_id: provinceInfo.r_province_id,
      }, {
        where: {
          location: provinceInfo.province_name,
        },
      });
    }
  }


  async initRateProvinceSql() {
    const { ctx } = this;
    const provinceList = await ctx.kkModel.Province.findAll({
      where: {
        status: {
          $notIn: [ 404 ],
        },
      },
    });
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
      const sqlStr = RateSqlStr.toString().replace(/'rate'/g, `'rate_${provinceListItem.pin_yin}'`);
      await fs.writeFileSync(`.\\app\\model\\kk\\rate_${provinceListItem.pin_yin}.js`, sqlStr);
    }
  }
}


module.exports = KKController;
