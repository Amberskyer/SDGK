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
    // schoolList = await ctx.kkModel.school.findAll();


    // const rate = null;
    // const rank = null;
    // const last_rank = null;
    // const rankStep = 1000;

    for (let i = 0; i < 168640; i = i + 40000) {
      initItem(i);
    }

    async function initItem(offsetNum) {

      const rateList = await ctx.kkModel.RateTable.findAll({
        where: {
          status: 6666,
          id: {
            $lte: offsetNum + 40000,
            $gte: offsetNum,
          },
          // probability: rate,
        }, // WHERE 条件
        // order: [[ 'probability' ]],
        limit: 50,
        // offset: offsetNum,
      });

      let sumNum = 0;
      const idsArrFor222 = [];
      const idsArrFor444 = [];

      for (let i = 0; i < rateList.length; i++) {
        const rateListItem = rateList[i];
        const dataJson = JSON.parse(rateListItem.html);
        if (dataJson.data.college.luqu_genre === rateListItem.aos) {
          idsArrFor222.push(rateListItem.id);
        } else {
          idsArrFor444.push(rateListItem.id);
        }
        sumNum++;


      }

      if (sumNum !== 0 && sumNum === rateList.length) {
        console.log(idsArrFor222);
        console.log(idsArrFor444);
        await ctx.kkModel.RateTable.update({
          status: 222,
        }, {
          where: {
            id: {
              $in: idsArrFor222,
            },
          },
        });


        await ctx.kkModel.RateTable.update({
          status: 444,
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

    // for (let i = 0; i < 168640; i = i + 40000) {
    //   initItem(i);
    // }

    initItem(0);

    async function initItem(offsetNum) {


      const rateList = await ctx.kkModel.RateTable.findAll({
        where: {
          status: 200,
          // id: {
          // $lte: offsetNum + 40000,
          // $gte: offsetNum,
          // },
          // probability: rate,
        }, // WHERE 条件
        // order: [[ 'probability' ]],
        limit: 1,
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
        const score = 750;
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
          const item = {
            college,
            aos,
            location,
            score,
            year,
            batch: rateInfo.college.batch,
            student_rank: rateInfo.student_rank,
            probability: rateInfo.college.probability,
            low_rank: rateInfo.lowest_rank,
            low_score: rateInfo.lowest_score,
            status: 6666,
            html: JSON.stringify(schoolProvinceResult.data),
          };
          console.log(item);

          await ctx.kkModel.RateTable.update(item, {
            where: {
              id: rateListItem.id,
            },
          });
          sumNum++;
        } else {
          sumNum++;
          idsArrFor404.push(rateListItem.id);
        }
      }


      if (sumNum === rateList.length) {
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
            status: 30303,
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
          status: 200,
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

      if (idsArr === rateArrResult.length) {

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
          status: 200,
          location,
          // probability: rate,
        }, // WHERE 条件
        attributes: [ 'id', 'college', 'aos', 'location', 'score', 'year', 'low_rank', 'low_score', 'status', 'r_school_id', 'r_province_id', 'r_subject_type', 'r_batch_id' ],
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
            r_school_id: rateResult.r_school_id,
            r_province_id: rateResult.r_province_id,
            r_subject_type: rateResult.r_subject_type,
            r_batch_id: rateResult.r_batch_id,
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

      if (idsArr.length === rateArrResult.length) {

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
    const provinceList = await ctx.kkModel.Province.findAll();
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
          status: {
            $in: [ -1, 222 ],
          },
        // probability: rate,
        }, // WHERE 条件
        // order: [[ 'probability' ]],
        attributes: [ 'id', 'college', 'aos', 'location', 'score', 'year', 'low_rank', 'low_score', 'status' ],
        limit: 20,
      // offset: offsetNum,
      });


      let sumNum = 0;
      const idsArrFor404 = [];
      const idsArrFor301 = [];
      const idsArrForError = [];
      for (let i = 0; i < rateList.length; i++) {
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
          const item = {
            batch: rateInfo.college.batch,
            student_rank: rateInfo.student_rank,
            rate: rateInfo.college.probability,
            status: 2222,
          };

          if (aos === rateInfo.college.luqu_genre) {
            await ctx.kkModel[provinceObj[location]].update(item, {
              where: {
                id: rateListItem.id, status: {
                  $in: [ -1, 222 ],
                },
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
              rate: null,
              status: 6666,
            }, {
              where: {
                college, aos, status: -1,
              },
            });
          }
        } else {
          sumNum++;
          idsArrFor404.push(rateListItem.id);
        }
      }


      if (sumNum === rateList.length) {
        if (idsArrFor404.length !== 0) {
          await ctx.kkModel[provinceObj[location]].update({
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
          await ctx.kkModel[provinceObj[location]].update({
            status: 30303,
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
            status: 505,
          }, {
            where: {
              id: {
                $in: idsArrForError,
              },
            },
          });
        }
        await initItem(location);
      }


    }
  }


  async transferRate() {

    const { ctx } = this;
    const provinceList = await ctx.kkModel.Province.findAll();
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
                                 r_school_id,
                                 college,
                                 aos,
                                 batch,
                                 location,
                                 student_rank,
                                 score,
                                 YEAR,
                                 probability,
                                 rate,
                                 low_rank,
                                 low_score
                                )(
                                 SELECT
                                  school_id,
                                  college,
                                  aos,
                                  batch,
                                  location,
                                  student_rank,
                                  score,
                                  YEAR,
                                  probability,
                                \trate,
                                  low_rank,
                                  low_score
                                 FROM
                                  ${provinceObj[location]}
                                 WHERE status=222
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
DROP TABLE IF EXISTS \`rate_${provinceInfo.pin_yin}\`;
CREATE TABLE \`rate_${provinceInfo.pin_yin}\` (
  \`id\` int(11) NOT NULL AUTO_INCREMENT,
  \`school_id\` int(11) DEFAULT NULL,
  \`college\` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  \`aos\` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  \`batch\` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  \`location\` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  \`student_rank\` int(11) DEFAULT NULL,
  \`score\` int(11) DEFAULT NULL,
  \`year\` int(11) DEFAULT NULL,
  \`probability\` int(11) DEFAULT NULL,
  \`low_rank\` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  \`low_score\` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  \`status\` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT '-1',
  \`rate\` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  \`r_school_id\` int(11) DEFAULT NULL,
  \`r_province_id\` int(11) DEFAULT NULL,
  \`r_subject_type\` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  \`r_batch_id\` int(11) DEFAULT NULL,
  \`r_rank\` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  \`r_rate\` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (\`id\`) USING BTREE,
  KEY \`id\` (\`id\`) USING BTREE,
  KEY \`college\` (\`college\`) USING BTREE,
  KEY \`location\` (\`location\`) USING BTREE,
  KEY \`probability\` (\`probability\`) USING BTREE,
  KEY \`status\` (\`status\`) USING BTREE,
  KEY \`aos\` (\`aos\`),
  KEY \`school_id\` (\`school_id\`),
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
      sqlStr = sqlStr + `UPDATE rate_table
                          SET r_batch_id=${batchInfo.r_batch_id}
                          WHERE batch='${batchInfo.batch_name}';`;
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
      const sqlStr = RateSqlStr.toString().replace(/'rate'/g, `'rate_${provinceListItem.pin_yin}'`);
      await fs.writeFileSync(`.\\app\\model\\kk\\rate_${provinceListItem.pin_yin}.js`, sqlStr);
    }
  }
}


module.exports = KKController;
