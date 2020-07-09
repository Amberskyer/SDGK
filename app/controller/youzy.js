'use strict';
const Controller = require('../care/base_controller');
const urlencode = require('urlencode');
const youzyEptService = require('../helper/youzyEpt.service');
// const commonService = require('../helper/common.service');
const { data: rSchoolJson } = require('../public/json/r_school');
const { data: rProvinceJson } = require('../public/json/r_province');
const fontArr = require('../public/json/font_word');


class YouzyController extends Controller {

  constructor(ctx) {
    super(ctx);
    this.schoolList = null;
    this.subjectTypeList = [ 0, 1 ];
    this.yearList = [ 2019 ];
    this.yearArrList = [ 2019, 2018, 2017 ];
  }

  async init() {
    const { ctx, app } = this;
    const result = await app.curl('https://apigateway-toci.youzy.cn/Data/TZY/Probability/Get', {
      method: 'post',
      dataType: 'json',
      contentType: 'json',
      data: { uCode: '42_964_0_0', totalScore: 560, collegeId: 964, course: 0, provinceId: 849, rank: 0, batch: 1 },
      headers: {
        YouzyApp_ApiSign: 'LyWVULVLWVlQLYWRyWVrhYyRlLLIyl',
        YouzyApp_DataSign: 'ITOSTPTEATTIPIPSSSPRAYTTWTAYEAITtEIOOTYWIU',
        YouzyApp_FromSource: 'iOS-13.46.1',
        YouzyApp_Sign: 'TCCZTZLZsCLZSBCTODFCsDTfDFEfGtFtTFENNS',
        YouzyApp_SuperSign: 'CqqLHMZqqHCKZHBqXqQXCNqCCCBNC',
        'Youzy-CurrentUserId': '14184607',
        'Youzy-Signature': '138d9ca92a8ea2d38f4962d1d6995ae8',
        Host: 'apigateway-toci.youzy.cn',
      },
    }).then(async res => {
      return res;
    }).catch(function() {
      return [];
    });

    console.log(result);
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
        name: '北京',
        id: 834,
      },
      {
        name: '安徽',
        id: 844,
      },
      {
        name: '澳门',
        id: 19340,
      },
      {
        name: '福建',
        id: 845,
      },
      {
        name: '甘肃',
        id: 860,
      },
      {
        name: '广东',
        id: 851,
      },
      {
        name: '广西',
        id: 852,
      },
      {
        name: '贵州',
        id: 856,
      },
      {
        name: '海南',
        id: 853,
      },
      {
        name: '河北',
        id: 1128,
      },
      {
        name: '河南',
        id: 848,
      },
      {
        name: '黑龙江',
        id: 841,
      },
      {
        name: '湖北',
        id: 849,
      },
      {
        name: '湖南',
        id: 850,
      },
      {
        name: '吉林',
        id: 840,
      },
      {
        name: '江苏',
        id: 1,
      },
      {
        name: '江西',
        id: 846,
      },
      {
        name: '辽宁',
        id: 839,
      },
      {
        name: '内蒙古',
        id: 838,
      },
      {
        name: '宁夏',
        id: 862,
      },
      {
        name: '青海',
        id: 861,
      },
      {
        name: '山东',
        id: 847,
      },
      {
        name: '山西',
        id: 837,
      },
      {
        name: '陕西',
        id: 859,
      },
      {
        name: '上海',
        id: 842,
      },
      {
        name: '四川',
        id: 855,
      },
      {
        name: '天津',
        id: 835,
      },
      {
        name: '西藏',
        id: 858,
      },
      {
        name: '香港',
        id: 16733,
      },
      {
        name: '新疆',
        id: 1120,
      },
      {
        name: '云南',
        id: 857,
      },
      {
        name: '浙江',
        id: 843,
      },
      {
        name: '重庆',
        id: 854,
      },
    ];
    return provinceList;
  }


  async initOneScoreOneRankTable() {
    super.initSchoolAdmissionTable();
    const { ctx } = this;
    this.provinceList = await ctx.youzyModel.Province.findAll();
    this.subjectTypeList = await ctx.youzyModel.SubjectType.findAll();
    const tableArr = [];
    this.provinceList.forEach(provinceItem => {
      this.subjectTypeList.forEach(subjectTypeItem => {
        this.yearArrList.forEach(yearItem => {
          const tableArrItem = {
            province_id: provinceItem.province_id,
            province_id_two: provinceItem.province_id_two,
            province_name: provinceItem.province_name,
            r_province_id: provinceItem.r_province_id,
            r_province_name: provinceItem.r_province_name,
            subject_type: subjectTypeItem.subject_type,
            r_subject_type: subjectTypeItem.r_subject_type,
            year: yearItem,
          };
          tableArr.push(tableArrItem);
        });
      });
    });
    await ctx.youzyModel.OneScoreOneRankHtml.bulkCreate(tableArr);
  }


  async startLoadOneScoreOneRank() {
    const { ctx } = this;
    setInterval(() => {
      this.loadOneScoreOneRank(ctx);
    }, 1200);
    // this.loadSchoolAdmission(ctx);
  }


  async loadOneScoreOneRank(ctx) {

    await initItem(0);

    async function initItem(offsetNum) {

      const tableArr = await ctx.youzyModel.OneScoreOneRankHtml.findAll({
        where: {
          // id:{
          // 	$gt:minId
          // },
          // isHave: {
          // 	$ne:456
          // },
          // id: {
          //   $in: [ 45 ],
          // },
          // id: 172,
          status: -1,
        },
        order: [[ 'id' ]],
        limit: 1,

        // offset: Math.floor(Math.random() * 20),
      });

      for (let i = 0; i < tableArr.length; i++) {
        const tableItem = tableArr[i];
        const url = 'https://www.youzy.cn/Data/ScoreLines/YFYD/QueryEquivalents';
        const data = {
          provinceId: tableItem.province_id_two,
          year: tableItem.year,
          bzType: 1,
          course: tableItem.subject_type,
          score: 560,
          isFillPcl: true,
          isFillYFYD: true,
        };
        console.log(data);
        const text = JSON.stringify(data);
        const textBytes = youzyEptService.utils.utf8.toBytes(text);
        const aesCtr = new youzyEptService.ModeOfOperation.ctr([ 11, 23, 32, 43, 45, 46, 67, 8, 9, 10, 11, 12, 13, 14, 15, 16 ], new youzyEptService.Counter(5));
        const encryptedBytes = aesCtr.encrypt(textBytes);
        const encryptedHex = youzyEptService.utils.hex.fromBytes(encryptedBytes);
        if (encryptedHex === 'af4f744668a5050fcb34bc057e2f914b54684ecca4c26099f264ea684bb242daa2f92f72eb9c7b6eb4bd215f22ad46dd8f7068bbe42388036c7483be03acfc81b37f1f2ff3ed6c25ee30d22d4d253d013dd38c0c6a96b33fabbd718ed5934df7d5a741e04121d30967d07d75ae') {
          console.log('相同');
        }

        // return;

        const params = {
          data: encryptedHex,
        };
        const cookie = 'UM_distinctid=17278148a385f6-0baf146f3735f7-f7d1d38-1fa400-17278148a399da; sensorsdata2015jssdkcross=%7B%22distinct_id%22%3A%2214184607%22%2C%22%24device_id%22%3A%2217278148e60763-05f948b35351d8-f7d1d38-2073600-17278148e61b03%22%2C%22props%22%3A%7B%22%24latest_traffic_source_type%22%3A%22%E8%87%AA%E7%84%B6%E6%90%9C%E7%B4%A2%E6%B5%81%E9%87%8F%22%2C%22%24latest_search_keyword%22%3A%22%E6%9C%AA%E5%8F%96%E5%88%B0%E5%80%BC%22%2C%22%24latest_referrer%22%3A%22https%3A%2F%2Fwww.baidu.com%2Flink%22%7D%2C%22first_id%22%3A%2217278148e60763-05f948b35351d8-f7d1d38-2073600-17278148e61b03%22%7D';

        const referer = 'https://ia-pv4y.youzy.cn/colleges/cfraction?p=af4f744668a5050fcb34bc057e2f8b47597d4e90f4d47391ee25b50418ef16c1baf7eba9072d8e89f3b3391460c80b90877e729ff234d950212a83a847bef39da467&u=af4f675b72a11f04fc2885047e2f835f42320395f4c860acf936b50f17f71ec1bae52132f6a96d55b0f0421872fd48c5de2f2ff9bb64cd522f14d3fd57b6f18da438077ba4b43639ee7b9b256e113b1b38ed8c0506d9aa04bafa679488d927bcd0b85aeb790b905476d02a2ab5ec8dcbd59ff271c4bbf69487c087b2b6ee8a5046d1fc888df2f9fae00c48b7dca1721581dfc03dc5328fde2552636b1ae65ebee6f80386a1&us=af4f6a416a9a08439261d9432c67dc05093f0f85c8ce68b1e464ea7a55a00391efa3647ef2ad4c7fbcfa39477dfa0693c03d69a6e327c61b74748db042b0ea9cb27f696ca1bd1371ee26c0681c1135033aa1d550648ea425b1b72ec9f0857dfbd5846af56d079b5670d67b32e9e394d4dc9ff26bd480fdd3e9df96bbe7b1965e0dc1cebdb7f2f9c4a7404bbaf6bd6554c2dd8b77ce0ad1912f497f6d06ed2ff1f0e01380a802c0deadeaba0350393214e9&dfs=af4f775b72a10f048a6bd7153356915f42250485ebde27c2b97fe9665be4018ced807f7cb3f22031fee86c0a3df6058a966633aaf964861b3e27cdc753b3bdd4e3351262a6af746ca3698a3d10003a4225f9964f3bc9a63fbdb072dcdf8c24f7d7af7dde3a49d3507cce6475b4e8b4cadc91ea3a98c0f8c1ca889fb1b0f1df5c4ccc89a6a2f8b3fba7575cb5d8fd7456cfc5cc2af024d2db234c757214ef19abfae51b868c10e1d4fdabf91a1369063bd9454cd8f7bf57992e26ce01d75adfef3474692cbb5604695764fba7a23cd90c21de5a84be191e1727838331cd456736b0ca9eb2c1f25a4294cbddf0f48a12a45a3826f26383fcae924e4c93fe8d143fe8ea73ef8ae5c1eafcf60ce5079b059327b44344a4504d1b9460d355c224f6a9e2276c704081fc5f&tcode=af4f675b6bbf0906cd18914366378b40587311&toUrl=/colleges/cfraction&timestamp=1591443833316';


        const schoolProvinceResult = await ctx.basePostForYouzy(url, params, cookie, referer);

        if (schoolProvinceResult && schoolProvinceResult.staus) {

          await ctx.youzyModel.OneScoreOneRankHtml.update({
            status: schoolProvinceResult.staus,
          }, {
            where: {
              id: tableItem.id,
            },
          });
        } else if (schoolProvinceResult.isSuccess && schoolProvinceResult.result) {
          await ctx.youzyModel.OneScoreOneRankHtml.update({
            status: 200,
            html: JSON.stringify(schoolProvinceResult.result),
          }, {
            where: {
              id: tableItem.id,
            },
          });
        } else {
          await ctx.youzyModel.OneScoreOneRankHtml.update({
            status: 40404,
          }, {
            where: {
              id: tableItem.id,
            },
          });
        }

      }

    }

  }


  async initOneScoreOneRank() {

    const { ctx } = this;
    const schoolProvinceListArr = await ctx.youzyModel.OneScoreOneRankHtml.findAll({
      where: {
        status: 666,
        html: {
          $ne: null,
        },
        // compare_status: 0,
      },
      // order: [[ 'id' ]],
      limit: 1,
    });
      // console.log(schoolProvinceArr);

    let loadNum = 0;
    const schoolAdmissionArr = [];
    const idsArr = [];
    for (let i = 0; i < schoolProvinceListArr.length; i++) {
      const item = schoolProvinceListArr[i];

      const schoolProvinceItem = JSON.parse(item.html);

      schoolProvinceItem.yfyds.forEach((itemJson, indexJson) => {
        if (indexJson === 0) {

          schoolAdmissionArr.push({
            province_id: item.province_id,
            r_province_id: item.r_province_id,
            r_province_name: item.r_province_name,

            year: itemJson.year,

            province_name: itemJson.provinceName,
            subject_type: itemJson.courseName,

            start: itemJson.minScore + 1,
            end: 1000,


            count: itemJson.sameNumber,
            rank: itemJson.lowestRank,
          });

          schoolAdmissionArr.push({
            province_id: item.province_id,
            r_province_id: item.r_province_id,
            r_province_name: item.r_province_name,

            year: itemJson.year,

            province_name: itemJson.provinceName,
            subject_type: itemJson.courseName,

            start: itemJson.minScore,
            end: itemJson.minScore,


            count: itemJson.sameNumber,
            rank: itemJson.lowestRank,
          });
        } else {


          schoolAdmissionArr.push({
            province_id: item.province_id,
            r_province_id: item.r_province_id,
            r_province_name: item.r_province_name,

            year: itemJson.year,

            province_name: itemJson.provinceName,
            subject_type: itemJson.courseName,

            start: itemJson.minScore,
            end: itemJson.maxScore,


            count: itemJson.sameNumber,
            rank: itemJson.lowestRank,
          });
        }

        // console.log('prov_score', itemJson.lowSort);
      });

      idsArr.push(item.id);
      loadNum++;
    }
    console.log('解析完毕', idsArr);
    if (loadNum === schoolProvinceListArr.length) {
      await ctx.youzyModel.OneScoreOneRank.bulkCreate(schoolAdmissionArr);
      await ctx.youzyModel.OneScoreOneRankHtml.update({
        status: 200,
      }, {
        where: {
          id: {
            $in: idsArr,
          },
        },
      });
      await this.initOneScoreOneRank();
    }
  }

  async initSchoolAdmissionTable() {
    super.initSchoolAdmissionTable();
    const { ctx } = this;
    this.provinceList = await ctx.youzyModel.Province.findAll();
    this.schoolList = await ctx.youzyModel.School.findAll();
    const schoolAdmissionJson = [];
    this.schoolList.forEach(schoolItem => {
      this.provinceList.forEach(provinceItem => {
        const schoolAdmissionJsonItem = {
          school_id: schoolItem.school_id,
          school_name: schoolItem.school_name,
          r_school_id: schoolItem.r_school_id,
          r_school_name: schoolItem.r_school_name,
          province_id: provinceItem.province_id,
          province_id_two: provinceItem.province_id_two,
          province_name: provinceItem.province_name,
          r_province_id: provinceItem.r_province_id,
          r_province_name: provinceItem.r_province_name,
        };
        schoolAdmissionJson.push(schoolAdmissionJsonItem);
      });
    });
    await ctx.youzyModel.SchoolAdmissionHtml.bulkCreate(schoolAdmissionJson);
  }


  async startLoadSchoolAdmission() {
    const { ctx } = this;
    setInterval(() => {
      this.loadSchoolAdmission(ctx);
    }, 800);
    // this.loadSchoolAdmission(ctx);
  }


  async loadSchoolAdmission(ctx) {

    await initItem(0, 1000);

    async function initItem(offsetNum, diffNum) {

      const schoolAdmissionList = await ctx.youzyModel.SchoolAdmissionHtml.findAll({
        where: {
          id: {
            $between: [ offsetNum, offsetNum + diffNum ],
          },
          status: 404,
        },
        limit: 1,
      });
      const loadNum = 0;
      const idsArrFor404 = [];

      for (let i = 0; i < schoolAdmissionList.length; i++) {
        const schoolProvinceItem = schoolAdmissionList[i];
        if (schoolProvinceItem) {

          const url = 'https://www.youzy.cn/Data/ScoreLines/Fractions/Colleges/Query';
          const data = {
            provinceNumId: schoolProvinceItem.province_id_two,
            ucode: schoolProvinceItem.province_id + '_' + schoolProvinceItem.school_id + '_0_0',
          };
          const text = JSON.stringify(data);
          const textBytes = youzyEptService.utils.utf8.toBytes(text);
          const aesCtr = new youzyEptService.ModeOfOperation.ctr([ 11, 23, 32, 43, 45, 46, 67, 8, 9, 10, 11, 12, 13, 14, 15, 16 ], new youzyEptService.Counter(5));
          const encryptedBytes = aesCtr.encrypt(textBytes);
          const encryptedHex = youzyEptService.utils.hex.fromBytes(encryptedBytes);
          if (encryptedHex === 'af4f744668a5050fcb34bb14315cd7515a6958d9aa99709bef22b56843a047d1dfed3e28cef85d2ef3e2') {
            console.log('相同');
          }


          const params = {
            data: encryptedHex,
          };

          const cookie = 'UM_distinctid=17278148a385f6-0baf146f3735f7-f7d1d38-1fa400-17278148a399da; sensorsdata2015jssdkcross=%7B%22distinct_id%22%3A%2214184607%22%2C%22%24device_id%22%3A%2217278148e60763-05f948b35351d8-f7d1d38-2073600-17278148e61b03%22%2C%22props%22%3A%7B%22%24latest_traffic_source_type%22%3A%22%E7%9B%B4%E6%8E%A5%E6%B5%81%E9%87%8F%22%2C%22%24latest_search_keyword%22%3A%22%E6%9C%AA%E5%8F%96%E5%88%B0%E5%80%BC_%E7%9B%B4%E6%8E%A5%E6%89%93%E5%BC%80%22%2C%22%24latest_referrer%22%3A%22%22%7D%2C%22first_id%22%3A%2217278148e60763-05f948b35351d8-f7d1d38-2073600-17278148e61b03%22%7D';

          const referer = 'https://ia-pv4y.youzy.cn/colleges/cfraction?p=af4f744668a5050fcb34bc057e2f8b47597d4e90f4d47391ee25b50418ef16c1baf7eba9072d8e89f3b3391460c80b90877e729ff234d950212a83a847bef39da467&u=af4f675b72a11f04fc2885047e2f835f42320395f4c860acf936b50f17f71ec1bae52132f6a96d55b0f0421872fd48c5de2f2ff9bb64cd522f14d3fd57b6f18da438077ba4b43639ee7b9b256e113b1b38ed8c0506d9aa04bafa679488d927bcd0b85aeb790b905476d02a2ab5ec8dcbd59ff271c4bbf69487c087b2b6ee8a5046d1fc888df2f9fae00c48b7dca1721581dfc03dc5328fde2552636b1ae65ebee6f80386a1&us=af4f6a416a9a08439261d9432c67dc05093f0f85c8ce68b1e464ea7a55a00391efa3647ef2ad4c7fbcfa39477dfa0693c03d69a6e327c61b74748db042b0ea9cb27f696ca1bd1371ee26c0681c1135033aa1d550648ea425b1b72ec9f0857dfbd5846af56d079b5670d67b32e9e394d4dc9ff26bd480fdd3e9df96bbe7b1965e0dc1cebdb7f2f9c4a7404bbaf6bd6554c2dd8b77ce0ad1912f497f6d06ed2ff1f0e01380a802c0deadeaba0350393214e9&dfs=af4f775b72a10f048a6bd7153356915f42250485ebde27c2b97fe9665be4018ced807f7cb3f22031fee86c0a3df6058a966633aaf964861b3e27cdc753b3bdd4e3351262a6af746ca3698a3d10003a4225f9964f3bc9a63fbdb072dcdf8c24f7d7af7dde3a49d3507cce6475b4e8b4cadc91ea3a98c0f8c1ca889fb1b0f1df5c4ccc89a6a2f8b3fba7575cb5d8fd7456cfc5cc2af024d2db234c757214ef19abfae51b868c10e1d4fdabf91a1369063bd9454cd8f7bf57992e26ce01d75adfef3474692cbb5604695764fba7a23cd90c21de5a84be191e1727838331cd456736b0ca9eb2c1f25a4294cbddf0f48a12a45a3826f26383fcae924e4c93fe8d143fe8ea73ef8ae5c1eafcf60ce5079b059327b44344a4504d1b9460d355c224f6a9e2276c704081fc5f&tcode=af4f675b6bbf0906cd18914366378b40587311&toUrl=/colleges/cfraction&timestamp=1591443833316';


          const schoolProvinceResult = await ctx.basePostForYouzy2020(url, params, cookie, referer);


          if (schoolProvinceResult.status !== 200) {
            await ctx.youzyModel.SchoolAdmissionHtml.update({
              status: schoolProvinceResult.status,
            }, {
              where: {
                id: schoolProvinceItem.id,
              },
            });
          } else if (schoolProvinceResult.status === 200 && schoolProvinceResult.data.isSuccess && schoolProvinceResult.data.result) {
            const schoolAdmissionInfo = schoolProvinceResult.data;
            await ctx.youzyModel.SchoolAdmissionHtml.update({
              status: 200,
              html: JSON.stringify(schoolAdmissionInfo.result),
              num: schoolAdmissionInfo.result.length,
              code: schoolAdmissionInfo.code,
              message: schoolAdmissionInfo.message,
              is_success: schoolAdmissionInfo.isSuccess,
            }, {
              where: {
                id: schoolProvinceItem.id,
              },
            });
          } else {
            idsArrFor404.push(schoolProvinceItem.id);
          }
        }
      }

      if (loadNum && loadNum === schoolAdmissionList.length) {
        if (idsArrFor404.length !== 0) {
          await ctx.youzyModel.SchoolAdmissionHtml.update({
            status: 40404,
          }, {
            where: {
              id: {
                $in: idsArrFor404,
              },
            },
          });
        }
        await initItem();
      }
    }

  }


  async initSchoolAdmission() {
    super.initSchoolAdmission();

    const { ctx } = this;
    const schoolAdmissionList = await ctx.youzyModel.SchoolAdmissionHtml.findAll({
      where: {
        status: 200,
        // id: 409,
      },
      // order: [[ 'id' ]],
      limit: 50,
    });
    // console.log(schoolProvinceArr);

    let sumNum = 0;
    const schoolAdmissionArr = [];
    const idsArr = [];
    for (let i = 0; i < schoolAdmissionList.length; i++) {
      const item = schoolAdmissionList[i];
      idsArr.push(item.id);

      const schoolProvinceItem = await this.jiemiSchoolData(JSON.parse(item.html));

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

          batch_id: itemJson.batch,
          batch_name: itemJson.batchName,
          subject_type: parseInt(itemJson.course),

          min_score: itemJson.minScore,
          max_score: itemJson.maxScore,
          avg_score: itemJson.avgScore,


          count: itemJson.enterNum,
          min_score_rank: parseInt(itemJson.lowSort),
          max_score_rank: parseInt(itemJson.maxSort),

          province_score: itemJson.prvControlLines,
        });

        // console.log('prov_score', itemJson.lowSort);
      });
      sumNum++;
    }
    console.log('解析完毕', idsArr);
    if (sumNum && sumNum === schoolAdmissionList.length) {
      await ctx.youzyModel.SchoolAdmission.bulkCreate(schoolAdmissionArr);
      await ctx.youzyModel.SchoolAdmissionHtml.update({
        status: 666,
      }, {
        where: {
          id: {
            $in: idsArr,
          },
        },
      });
      await this.initSchoolAdmission();
    }
  }

  async aaa(p, a, c, k, e, d) {
    [ p, a, c, k, e, d ] = [ '4 5=3(2){4 1="";2.7("|").6(3(0){0=0.b(/[c-d]/8,"");1+="&#9"+0+";"});a 1}', 14, 14, 'value|number|myNumbers|function|var|showNumber|forEach|split|ig|x|return|replace|g|t'.split('|'), 0, {}];
    e = function(c) {
      return (c < a ? '' : e(parseInt(c / a))) + ((c = c % a) > 35 ? String.fromCharCode(c + 29) : c.toString(36));
    };
    if (!''.replace(/^/, String)) {
      while (c--) d[e(c)] = k[c] || e(c);
      k = [ function(e) {
        return d[e];
      } ];
      e = function() {
        return '\\w+';
      };
      c = 1;
    }
    while (c--) {
      if (k[c]) p = p.replace(new RegExp('\\b' + e(c) + '\\b', 'g'), k[c]);
    }
    console.log(p);
    return p;
  }

  showNumber(myNumbers) {
    let number = '';
    myNumbers.split('|').forEach(function(value) {
      value = value.replace(/[g-t]/ig, '');
      number += '&#x' + value + ';';
    });
    return this.decodeSr(number);
  }

  cnDeCrypt(zlVjhiyMm1) {
    let YB2 = '';
    zlVjhiyMm1.split('\x7c').forEach(function($lvd3) {
      if ($lvd3.search(/【(.*?)】/) !== -1) {
        YB2 += $lvd3.replace('\u3010', '').replace('\u3011', '');
      } else {
        $lvd3 = $lvd3.replace(/[g-t]/ig, '');
        YB2 += '\x26\x23\x78' + $lvd3 + '\x3b';
      }
    });
    return this.decodeWord(YB2);
  }

  decodeSr(str) {
    const fontNumArr = [
      {
        name: '&#xa8f2e;',
        value: '0',
      },
      {
        name: '&#xc15f9;',
        value: '1',
      },
      {
        name: '&#x7d3ae;',
        value: '2',
      },
      {
        name: '&#xf8b41;',
        value: '3',
      },
      {
        name: '&#xc2e7a;',
        value: '4',
      },
      {
        name: '&#xe7f11;',
        value: '5',
      },
      {
        name: '&#x6f732;',
        value: '6',
      },
      {
        name: '&#xaa86e;',
        value: '7',
      },
      {
        name: '&#xfc6a6;',
        value: '8',
      },
      {
        name: '&#x72ef1;',
        value: '9',
      },
    ];
    fontNumArr.forEach(item => {
      str = str.replace(item.name, item.value);
      str = str.replace(item.name, item.value);
      str = str.replace(item.name, item.value);
      str = str.replace(item.name, item.value);
      str = str.replace(item.name, item.value);
      str = str.replace(item.name, item.value);
    });
    return str;
  }

  decodeWord(str) {
    // const fontArr = [
    //   {
    //     name: '&#xa8f2e;',
    //     value: '0',
    //   },
    //   {
    //     name: '&#xc15f9;',
    //     value: '1',
    //   },
    //   {
    //     name: '&#x7d3ae;',
    //     value: '2',
    //   },
    //   {
    //     name: '&#xf8b41;',
    //     value: '3',
    //   },
    //   {
    //     name: '&#xc2e7a;',
    //     value: '4',
    //   },
    //   {
    //     name: '&#xe7f11;',
    //     value: '5',
    //   },
    //   {
    //     name: '&#x6f732;',
    //     value: '6',
    //   },
    //   {
    //     name: '&#xaa86e;',
    //     value: '7',
    //   },
    //   {
    //     name: '&#xfc6a6;',
    //     value: '8',
    //   },
    //   {
    //     name: '&#x72ef1;',
    //     value: '9',
    //   },
    // ];
    fontArr.forEach(item => {
      item.name = item.name.toLowerCase();
      const patt1 = new RegExp(`&#x${item.name};`, 'g');
      str = str.replace(patt1, item.value);
      // str = str.replace(`&#x${item.name};`, item.value);
      // console.log(str, item.name);
    });
    return str;
  }

  async jiemiSchoolData(result) {
    for (let index = 0; index < result.length; index++) {
      const element = result[index];
      // if (element.maxScore !== 0) { element.maxScore = this.showNumber(element.maxScore.substring(0, element.maxScore.length - 1)); }
      // if (element.avgScore !== 0) { element.avgScore = this.showNumber(element.avgScore.substring(0, element.avgScore.length - 1)); }
      // if (element.minScore !== 0) { element.minScore = this.showNumber(element.minScore.substring(0, element.minScore.length - 1)); }
      // if (element.lowSort !== 0) { element.lowSort = this.showNumber(element.lowSort.substring(0, element.lowSort.length - 1)); }
      // if (element.enterNum !== 0) { element.enterNum = this.showNumber(element.enterNum.substring(0, element.enterNum.length - 1)); }
      if (element.planNum !== 0) { element.planNum = this.showNumber(element.planNum.substring(0, element.planNum.length - 1)); }
      if (element.learnYear !== 0) { element.learnYear = this.showNumber(element.learnYear.substring(0, element.learnYear.length - 1)); }
      // if (element.cost !== 0) { element.cost = this.showNumber(element.cost.substring(0, element.cost.length - 1)); }
      if (element.cost && element.cost !== '') { element.cost = this.cnDeCrypt(element.cost.substring(0, element.cost.length - 1)); }
      if (element.professionName && element.professionName !== '') { element.professionName = this.cnDeCrypt(element.professionName.substring(0, element.professionName.length - 1)); }
      if (element.professionCode && element.professionCode !== '') { element.professionCode = this.cnDeCrypt(element.professionCode.substring(0, element.professionCode.length - 1)); }
    }
    // console.log('result', result);
    return result;
  }


  async initSchoolMajorAdmissionTable() {
    const { ctx } = this;
    this.provinceList = await ctx.youzyModel.Province.findAll();
    this.schoolList = await ctx.youzyModel.School.findAll();
    const schoolMajorAdmissionJson = [];
    this.schoolList.forEach(item => {
      this.provinceList.forEach(item2 => {
        if (item2.province_id) {
          this.subjectTypeList.forEach(item4 => {
            this.yearList.forEach(item5 => {
              const schoolMajorAdmissionJsonItem = {
                school_id: item.school_id,
                school_name: item.school_name,
                r_school_id: item.r_school_id,
                r_school_name: item.r_school_name,
                province_id: item2.province_id,
                province_name: item2.province_name,
                r_province_id: item2.r_province_id,
                r_province_name: item2.r_province_name,
                subject_type: item4,
                year: item5,
              };
              schoolMajorAdmissionJson.push(schoolMajorAdmissionJsonItem);
            });
          });
        }
      });
    });
    await ctx.youzyModel.SchoolMajorAdmissionHtml.bulkCreate(schoolMajorAdmissionJson);
  }

  async startLoadSchoolMajorAdmission() {
    const { ctx } = this;
    setInterval(() => {
      this.loadSchoolMajorAdmission(ctx);
    }, 500);
  }

  async loadSchoolMajorAdmission(ctx) {

    const provList = [
      {
        name: '安徽',
        value: 34,
      },
      {
        name: '北京',
        value: 11,
      },
      {
        name: '重庆',
        value: 50,
      },
      {
        name: '福建',
        value: 35,
      },
      {
        name: '广东',
        value: 44,
      },
      {
        name: '广西',
        value: 45,
      },
      {
        name: '甘肃',
        value: 62,
      },
      {
        name: '贵州',
        value: 52,
      },
      {
        name: '河北',
        value: 13,
      },
      {
        name: '河南',
        value: 41,
      },
      {
        name: '海南',
        value: 46,
      },
      {
        name: '湖北',
        value: 42,
      },
      {
        name: '湖南',
        value: 43,
      },
      {
        name: '黑龙江',
        value: 23,
      },
      {
        name: '吉林',
        value: 22,
      },
      {
        name: '江苏',
        value: 32,
      },
      {
        name: '江西',
        value: 36,
      },
      {
        name: '辽宁',
        value: 21,
      },
      {
        name: '内蒙古',
        value: 15,
      },
      {
        name: '宁夏',
        value: 64,
      },
      {
        name: '青海',
        value: 63,
      },
      {
        name: '上海',
        value: 31,
      },
      {
        name: '四川',
        value: 51,
      },
      {
        name: '山东',
        value: 37,
      },
      {
        name: '山西',
        value: 14,
      },
      {
        name: '陕西',
        value: 61,
      },
      {
        name: '天津',
        value: 12,
      },
      {
        name: '新疆',
        value: 65,
      },
      {
        name: '云南',
        value: 53,
      },
      {
        name: '浙江',
        value: 33,
      },
      {
        name: '西藏',
        value: 54,
      },
    ];

    const schoolProvinceArr = await ctx.youzyModel.SchoolMajorAdmissionHtml.findAll({
      where: {
        // id: {
        // 	$gt: 75000,
        // },
        // isHave: {
        // 	$ne:456
        // },
        // id: 188918,
        status: -1,
        // id: 1,
      },
      order: [[ 'id' ]],
      limit: 1,
      // offset: offsetNum,
    });
    if (schoolProvinceArr) {
      const loadNum = 0;
      for (let i = 0; i < schoolProvinceArr.length; i++) {
        const item = schoolProvinceArr[i];

        // let provItem = null;
        // provList.forEach(itemProv => {
        //   if (itemProv.name === item.province_name) {
        //     provItem = itemProv.value;
        //   }
        // });

        const url = 'https://www.youzy.cn/Data/ScoreLines/Fractions/Professions/Query';
        const data = {
          year: item.year,
          ucode: item.province_id + '_' + item.school_id + '_0_0',
          courseType: item.subject_type,
          // collegeId: item.school_id,
        };
        const text = JSON.stringify(data);
        const textBytes = youzyEptService.utils.utf8.toBytes(text);
        const aesCtr = new youzyEptService.ModeOfOperation.ctr([ 11, 23, 32, 43, 45, 46, 67, 8, 9, 10, 11, 12, 13, 14, 15, 16 ], new youzyEptService.Counter(5));
        const encryptedBytes = aesCtr.encrypt(textBytes);
        const params = {
          data: youzyEptService.utils.hex.fromBytes(encryptedBytes),
        };
        // const other = 'connect.sid=s:s9vPCDWoZmy3pWdxbsOYD83X6ZZfbTgz.Qr2PlEMdYqrC+Va46Vw5vXPLeCklWA1UClr+hsB2esM;';
        // const Youzy2CUser = {
        //   numId: 11461160,
        //   realName: '张三',
        //   avatarUrl: null,
        //   gender: 0,
        //   provinceId: item.province_id,
        //   cityId: 1140,
        //   countyId: 10018,
        //   schoolId: -10,
        //   class: '高三',
        //   gkYear: 2018,
        //   isZZUser: false,
        //   zzCount: 0,
        //   isElective: false,
        //   active: true,
        //   courseType: 1,
        //   secretName: '张同学',
        //   userPermissionId: 3,
        //   identityExpirationTime: '2019-10-22T08:13:05.943Z',
        //   username: '18602756630',
        //   mobilePhone: '18602756630',
        //   provinceName: null,
        //   cityName: null,
        //   countyName: null,
        //   schoolName: '',
        //   updateGaoKaoCount: 0,
        //   lastLoginDate: '0001-01-01T00:00:00',
        //   creationTime: '2018-04-16T09:49:03.773+08:00',
        //   id: '5cf584aa9e742b1f884ed01b',
        //   vipPermission: true,
        // };
        // const Youzy2CCurrentProvince = {
        //   provinceId: item.province_id,
        //   provinceName: item.province_name,
        //   isGaokaoVersion: true,
        // };
        // const Youzy2CCurrentScore = {
        //   numId: 0,
        //   provinceNumId: item.province_id,
        //   provinceName: item.province_name,
        //   total: 0,
        //   courseTypeId: 0,
        //   rank: 0,
        //   chooseLevelOrSubjects: null,
        //   scoreType: 0,
        //   chooseLevelFormat: [],
        //   chooseSubjectsFormat: [],
        // };
        // const cookie = other + 'Youzy2CUser=' + urlencode(JSON.stringify(Youzy2CUser))
        //             + ';Youzy2CCurrentProvince=' + urlencode(JSON.stringify(Youzy2CCurrentProvince))
        //             + ';Youzy2CCurrentScore=' + urlencode(JSON.stringify(Youzy2CCurrentScore));
        const cookie = 'UM_distinctid=17250d114b849-04054b9aa3b8a2-d373666-219a80-17250d114b95da; sensorsdata2015jssdkcross=%7B%22distinct_id%22%3A%2214184607%22%2C%22%24device_id%22%3A%2217250d1159ca1-0572f02bc64a16-d373666-2202240-17250d1159d3b0%22%2C%22props%22%3A%7B%22%24latest_traffic_source_type%22%3A%22%E7%9B%B4%E6%8E%A5%E6%B5%81%E9%87%8F%22%2C%22%24latest_search_keyword%22%3A%22%E6%9C%AA%E5%8F%96%E5%88%B0%E5%80%BC_%E7%9B%B4%E6%8E%A5%E6%89%93%E5%BC%80%22%2C%22%24latest_referrer%22%3A%22%22%7D%2C%22first_id%22%3A%2217250d1159ca1-0572f02bc64a16-d373666-2202240-17250d1159d3b0%22%7D';
        // const referer = `https://www.youzy.cn/tzy/search/colleges/homepage/cfrationIndex?cid=${item.school_id}`;
        const referer = 'https://ia-pv4y.youzy.cn/colleges/pfraction?p=af4f744668a5050fcb34bc057e2f8b47597d4e90f4d47391ee25b50418ef16c1baf7eba9072d8e89f3b3391460c80b90877e729ff234d950212a83a847bef39da467&u=af4f675b72a11f04fc2885047e2f835f42320395f4c860acf936b50f17f71ec1bae52132f6a96d55b0f0421872fd48c5de2f2ff9bb64cd522f14d3fd57b6f18da438077ba4b43639ee7b9b256e113b1b38ed8c0506d9aa04bafa679488d927bcd0b85aeb790b905476d02a2ab5ec8dcbd59ff271c4bbf69487c087b2b6ee8a5046d1fc888df2f9fae00c48b7dca1721581dfc03dc5328fde2552636b1ae65ebee6f80386a1&us=af4f6a416a9a08439261d9432c67dc05093f0f85c8ce68b1e464ea7a55a00391efa3647ef2ad4c7fbcfa39477dfa0693c03d69a6e327c61b74748db042b0ea9cb27f696ca1bd1371ee26c0681c1135033aa1d550648ea425b1b72ec9f0857dfbd5846af56d079b5670d67b32e9e394d4dc9ff26bd480fdd3e9df96bbe7b1965e0dc1cebdb7f2f9c4a7404bbaf6bd6554c2dd8b77ce0ad1912f497f6d06ed2ff1f0e01380a802c0deadeaba0350393214e9&dfs=af4f775b72a10f048a6bd7153356915f42250485ebde27c2b97fe9665be4018ced807f7cb3f22031fee86c0a3df6058a966633aaf964861b3e27cdc753b3bdd4e3351262a6af746ca3698a3d10003a4225f9964f3bc9a63fbdb072dcdf8c24f7d7af7dde3a49d3507cce6475b4e8b4cadc91ea3a98c0f8c1ca889fb1b0f1df5c4ccc89a6a2f8b3fba7575cb5d8fd7456cfc5cc2af024d2db234c757214ef19abfae51b868c10e1d4fdabf91a1369063bd9454cd8f7bf57992e26ce01d75adfef3474692cbb5604695764fba7a23cd90c21de5a84be191e1727838331cd456736b0ca9eb2c1f25a4294cbddf0f48a12a45a3826f26383fcae924e4c93fe8d143fe8ea73ef8ae5c1eafcf60ce5079b059327b44344a4504d1b9460d355c224f6a9e2276c704081fc5f&tcode=af4f675b6bbf0906cd18914366378b40587340c2f3c860bef528b33e10ed1dafefb27e32abea2063&toUrl=/colleges/pfraction&timestamp=1590576917942';


        // console.log({
        //   url, params, cookie, referer,
        // });

        const schoolProvinceResult = await ctx.basePostForYouzy(url, params, cookie, referer);
        // console.log(schoolProvinceResult);
        // console.log(schoolProvinceResult);
        if (schoolProvinceResult && schoolProvinceResult.isSuccess && schoolProvinceResult.result) {
          await ctx.youzyModel.SchoolMajorAdmissionHtml.update({
            status: 200,
            html: JSON.stringify(schoolProvinceResult.result),
            // num: schoolProvinceResult.result.length,
            // code: schoolProvinceResult.code,
            // message: schoolProvinceResult.message,
            // is_success: schoolProvinceResult.isSuccess,
          }, {
            where: {
              id: item.id,
            },
          });
        } else {
          console.log(schoolProvinceResult);
        }
        // await this.loadSchoolMajorAdmission();
      }
    } else {
      // await this.loadSchoolMajorAdmission();
    }
  }


  async initSchoolMajorAdmission() {
    super.initSchoolMajorAdmission();
    const { ctx } = this;
    const schoolProvinceArr = await ctx.youzyModel.SchoolMajorAdmissionHtml.findAll({
      where: {
        // id: 188918,
        status: 200,
        // id: 3,
      },
      limit: 35,
    });
    let loadNum = 0;
    const schoolMajorAdmissionArr = [];
    const idsArr = [];
    for (let i = 0; i < schoolProvinceArr.length; i++) {
      const item = schoolProvinceArr[i];
      idsArr.push(item.id);
      if (item.html) {
        const schoolProvinceItem = await this.jiemiSchoolData(JSON.parse(item.html));
        console.log(schoolProvinceItem.length);
        console.log(schoolProvinceItem);

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

            batch: itemJson.batch,
            batch_name: itemJson.batchName,
            subject_type: itemJson.courseType,

            min_score_rank: itemJson.lowSort,
            max_score_rank: itemJson.maxSort,
            min_score: itemJson.minScore,
            max_score: itemJson.maxScore,
            avg_score: itemJson.avgScore,

            chooseLevel: itemJson.chooseLevel,
            countOfZJZY: itemJson.countOfZJZY,
            lineDiff: itemJson.lineDiff,

            count: itemJson.enterNum,

            major_code: itemJson.majorCode,
            profession_code: itemJson.professionCode,
            profession_name: itemJson.professionName,


            // province_score: itemJson.proscore,
            // dual_class_name: itemJson.dual_class_name,
          });
        });
      }
      loadNum++;
    }
    // console.log(schoolMajorAdmissionArr);
    // console.log(schoolMajorAdmissionArr);
    await ctx.youzyModel.SchoolMajorAdmission.bulkCreate(schoolMajorAdmissionArr);
    await ctx.youzyModel.SchoolMajorAdmissionHtml.update({
      status: 600,
    }, {
      where: {
        id: {
          $in: idsArr,
        },
      },
    });
    if (loadNum === 35) {
      this.initSchoolMajorAdmission();
    }
  }


  async initMajorAdmissionPlanTable() {

    const { ctx } = this;
    const schoolList = await ctx.youzyModel.School.findAll({
      where: {
        status: {
          $ne: 404,
        },
      },
    });
    const provinceList = await ctx.youzyModel.Province.findAll({
      where: {
        status: {
          $ne: 404,
        },
      },
    });
    const subjectTypeList = this.subjectTypeList;
    for (let i = 0; i < schoolList.length; i++) {
      const tableArr = [];
      const schoolItem = schoolList[i];
      for (let j = 0; j < provinceList.length; j++) {
        const provinceItem = provinceList[j];
        const item = {
          school_id: schoolItem.school_id,
          school_name: schoolItem.school_name,
          r_school_id: schoolItem.r_school_id,
          province_id: provinceItem.province_id,
          province_name: provinceItem.province_name,
          year: 2019,
        };
        tableArr.push(item);
      }

      await ctx.youzyModel.MajorAdmissionPlanTable.bulkCreate(tableArr);
    }
  }


  async loadMajorAdmissionPlanTable() {
    const { ctx } = this;


    // for (let i = 0; i < 130000; i = i + 20000) {
    //   await initItem(i);
    // }

    const _this = this;

    setInterval(function() {
      initItem(0);
    }, 1500);

    async function initItem(offsetNum) {

      const majorAdmissionPlanTableList = await ctx.youzyModel.MajorAdmissionPlanTable.findAll({
        where: {
          status: -1,
          // id: {
          //   $between: [ offsetNum, offsetNum + 100000 ],
          // },
          // id: 391480,
        },
        limit: 1,
      });

      let listSum = 0;
      for (let i = 0; i < majorAdmissionPlanTableList.length; i++) {

        const majorAdmissionPlanTableInfo = majorAdmissionPlanTableList[i];
        if (!majorAdmissionPlanTableInfo) {
          return;
        }
        const { school_id, province_id, subject_type, batch_id, year } = majorAdmissionPlanTableInfo;


        const url = 'https://ia-pv4y.youzy.cn/Data/ScoreLines/Plans/Professions/Query';
        const data = {
          year: 2019,
          ucodes: province_id + '_' + school_id + '_0_0',
          // collegeId: item.school_id,
        };
        const text = JSON.stringify(data);
        const textBytes = youzyEptService.utils.utf8.toBytes(text);
        const aesCtr = new youzyEptService.ModeOfOperation.ctr([ 11, 23, 32, 43, 45, 46, 67, 8, 9, 10, 11, 12, 13, 14, 15, 16 ], new youzyEptService.Counter(5));
        const encryptedBytes = aesCtr.encrypt(textBytes);
        const encryptedHex = youzyEptService.utils.hex.fromBytes(encryptedBytes);
        const params = {
          data: encryptedHex,
        };
        // console.log(data);
        // console.log(encryptedHex);
        // if (encryptedHex === 'af4f7d5166a14e5b9a61c4587037c6100f350993a48127ccb219e17e4bb32cd3dfe52f6d') {
        //   console.log('匹配');
        // }
        //
        // return;

        const cookie = 'UM_distinctid=17278148a385f6-0baf146f3735f7-f7d1d38-1fa400-17278148a399da; sensorsdata2015jssdkcross=%7B%22distinct_id%22%3A%2214184607%22%2C%22%24device_id%22%3A%2217278148e60763-05f948b35351d8-f7d1d38-2073600-17278148e61b03%22%2C%22props%22%3A%7B%22%24latest_traffic_source_type%22%3A%22%E8%87%AA%E7%84%B6%E6%90%9C%E7%B4%A2%E6%B5%81%E9%87%8F%22%2C%22%24latest_search_keyword%22%3A%22%E6%9C%AA%E5%8F%96%E5%88%B0%E5%80%BC%22%2C%22%24latest_referrer%22%3A%22https%3A%2F%2Fwww.baidu.com%2Flink%22%7D%2C%22first_id%22%3A%2217278148e60763-05f948b35351d8-f7d1d38-2073600-17278148e61b03%22%7D; Youzy2CCurrentProvince=%7B%22provinceId%22%3A849%2C%22provinceName%22%3A%22%E6%B9%96%E5%8C%97%22%2C%22isGaokaoVersion%22%3Afalse%7D; youzy.toc.uid=14184607; CNZZDATA1254568697=1555115846-1591147762-https%253A%252F%252Fwww.baidu.com%252F%7C1594293801; youzy.utype=toc; youzy_bottom_ad=true; youzy.uid=14184607; Youzy2CCurrentScore=%7B%22numId%22%3A4093973%2C%22provinceNumId%22%3A849%2C%22provinceName%22%3A%22%E6%B9%96%E5%8C%97%22%2C%22total%22%3A560%2C%22courseTypeId%22%3A0%2C%22rank%22%3A0%2C%22chooseLevelOrSubjects%22%3A%22%22%2C%22scoreType%22%3A1%2C%22creationTime%22%3A%222020-06-19T10%3A25%3A43.565%2B08%3A00%22%2C%22chooseLevelFormat%22%3A%5B%5D%2C%22chooseSubjectsFormat%22%3A%5B%5D%7D; Youzy2CUser=%7B%22numId%22%3A14184607%2C%22realName%22%3A%22%E5%BC%A0%E4%B8%89%22%2C%22avatarUrl%22%3A%22%22%2C%22gender%22%3A1%2C%22provinceId%22%3A849%2C%22cityId%22%3A1324%2C%22countyId%22%3A9240%2C%22schoolId%22%3A9241%2C%22class%22%3A%22%22%2C%22gkYear%22%3A2020%2C%22isZZUser%22%3Afalse%2C%22zzCount%22%3A0%2C%22isElective%22%3Afalse%2C%22active%22%3Atrue%2C%22courseType%22%3A0%2C%22userTypeId%22%3A0%2C%22secretName%22%3A%22%E5%BC%A0%E5%90%8C%E5%AD%A6%22%2C%22userPermissionId%22%3A3%2C%22userPermissionProvinceId%22%3A849%2C%22identityExpirationTime%22%3Anull%2C%22username%22%3A%2213628624946%22%2C%22mobilePhone%22%3A%2213628624946%22%2C%22provinceName%22%3Anull%2C%22cityName%22%3Anull%2C%22countyName%22%3Anull%2C%22schoolName%22%3A%22%22%2C%22updateGaoKaoCount%22%3A1%2C%22lastLoginDate%22%3A%222020-07-09T20%3A42%3A20.841Z%22%2C%22creationTime%22%3A%222020-05-26T13%3A54%3A45.22%2B08%3A00%22%2C%22machineCode%22%3A%22%22%2C%22userPermissionExpiryTime%22%3A%222020-09-01T00%3A00%3A00Z%22%2C%22electiveExpiryTime%22%3Anull%2C%22ziZhuExpiryTime%22%3Anull%2C%22userPermissionStatus%22%3A2%2C%22ziZhuPermissionStatus%22%3A0%2C%22electivePermissionStatus%22%3A0%2C%22registrationSourceType%22%3A2%2C%22registrationPlatform%22%3A1%2C%22registrationDevice%22%3A1%2C%22appVersion%22%3A%22%22%2C%22appChannel%22%3A%22%22%2C%22sourceSign%22%3A%22%22%2C%22punishmentType%22%3A0%2C%22punishmentEndTime%22%3Anull%2C%22capacityType%22%3A1%2C%22fansCount%22%3A0%2C%22isTiyan%22%3Afalse%2C%22hasTiYanLoged%22%3Afalse%2C%22isDeleted%22%3Afalse%2C%22authAliPayMiniApp%22%3A%22%22%2C%22id%22%3A%225eccaf25c9ec0f042c8dccc6%22%2C%22vipPermission%22%3Atrue%7D; connect.sid=s%3AcnAhgsmjSvrMgziiM-KtEtTlqEMDz-n8.EP5hWh%2BSopap9v6sIwm%2BrbImjbsIpDX1wNlC%2BgXJGII';
        const Referer = 'https://www.youzy.cn/tzy/search/colleges/homepage/homePage?cid=' + school_id;

        const result = await ctx.basePostForYouzy(url, params, cookie, Referer);

        // console.log(result);

        if (result.isSuccess === true) {
          const majorAdmissionPlan = await _this.jiemiSchoolData(result.result.plans);
          await ctx.youzyModel.MajorAdmissionPlanTable.update({
            status: 222,
            html: JSON.stringify(majorAdmissionPlan),
            count: majorAdmissionPlan.length,
          }, {
            where: {
              id: majorAdmissionPlanTableInfo.id,
            },
          });
        } else {
          await ctx.youzyModel.MajorAdmissionPlanTable.update({
            status: 500,
            html: result.data,
          }, {
            where: {
              id: majorAdmissionPlanTableInfo.id,
            },
          });
        }
        listSum++;
      }
      if (listSum && listSum === majorAdmissionPlanTableList.length) {
        // await initItem(offsetNum);
      }


    }

  }

}


module.exports = YouzyController;
