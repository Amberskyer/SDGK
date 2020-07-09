'use strict';
const Controller = require('../care/base_controller');
const cheerio = require('cheerio');
const CryptoJS = require('crypto-js');
const Md5 = require('js-md5');
const moment = require('moment');


class gkcxController extends Controller {

  constructor(ctx) {
    super(ctx);
    this.batchList = [ 7, 8, 10 ];
    this.subjectTypeList = [ 1, 2 ];
  }

  async initMajorAdmissionPlanTable() {

    const { ctx } = this;
    const schoolList = await ctx.zsgkModel.School.findAll({
      where: {
        r_school_id: {
          $ne: null,
        },
      },
    });
    const provinceList = await ctx.zsgkModel.Province.findAll({
      where: {
        status: {
          $ne: 404,
        },
      },
    });
    const subjectTypeList = this.subjectTypeList;
    const batchList = this.batchList;
    for (let i = 0; i < schoolList.length; i++) {
      const tableArr = [];
      const schoolItem = schoolList[i];
      for (let j = 0; j < provinceList.length; j++) {
        const provinceItem = provinceList[j];
        for (let l = 0; l < subjectTypeList.length; l++) {
          const subjectTypeItem = subjectTypeList[l];
          for (let k = 0; k < batchList.length; k++) {
            const batchItem = batchList[k];
            const item = {
              school_id: schoolItem.school_id,
              school_name: schoolItem.school_name,
              r_school_id: schoolItem.r_school_id,
              province_id: provinceItem.province_id,
              province_name: provinceItem.province_name,
              subject_type: subjectTypeItem,
              batch_id: batchItem,
              year: 2019,
            };
            tableArr.push(item);
          }
        }

      }

      await ctx.zsgkModel.MajorAdmissionPlanTable.bulkCreate(tableArr);
    }
  }


  async loadSchoolTopicTableHtml() {
    const { ctx } = this;

    const { type = 1 } = ctx.query;

    const provinceList = await ctx.zsgkModel.Province.findAll({
      where: {
        status: {
          $ne: 404,
        },
      },
    });

    for (let i = 4 * (parseInt(type) - 1); i < 4 * parseInt(type); i++) {
      if (provinceList[i]) {
        await initItem(provinceList[i]);
      }
    }

    async function initItem(provinceInfo) {

      const majorAdmissionPlanTableList = await ctx.zsgkModel.MajorAdmissionPlanTable.findAll({
        where: {
          status: -1,
          province_id: provinceInfo.province_id,
          province_name: provinceInfo.province_name,
          // id: {
          //   $between: [ offsetNum, offsetNum + 100000 ],
          // },
          // id: 409,
        },
        limit: 4,
      });

      let listSum = 0;
      for (let i = 0; i < majorAdmissionPlanTableList.length; i++) {

        const majorAdmissionPlanTableInfo = majorAdmissionPlanTableList[i];
        console.log(majorAdmissionPlanTableInfo.school_name);
        if (!majorAdmissionPlanTableInfo) {
          return;
        }
        const { school_id, province_id, subject_type, batch_id, year } = majorAdmissionPlanTableInfo;

        let url = `api.eol.cn/gkcx/api/?local_batch_id=${batch_id}&local_province_id=${province_id}&local_type_id=${subject_type}&page=1&school_id=${school_id}&size=200&uri=apidata/api/gk/plan/special&year=${year}`;
        let signsafe = CryptoJS.HmacSHA1(CryptoJS.enc.Utf8.parse(url), 'D23ABC@#56');
        signsafe = CryptoJS.enc.Base64.stringify(signsafe).toString();
        signsafe = Md5(signsafe).toString();
        url = `https://${url}&signsafe=${signsafe}&access_token`;

        const result = await ctx.baseGet(url);
        if (result.status === 200 && result.data.code === '0000') {
          const jsonObj = decodeHtml(result.data.data.text);
          await ctx.zsgkModel.MajorAdmissionPlanTable.update({
            status: 222,
            html: JSON.stringify(jsonObj),
            count: JSON.parse(jsonObj).numFound,
          }, {
            where: {
              id: majorAdmissionPlanTableInfo.id,
            },
          });
        } else {
          await ctx.zsgkModel.MajorAdmissionPlanTable.update({
            status: result.status,
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
        await initItem(provinceInfo);
      }

      function decodeHtml(P1) {
        const N1 = 'apidata/api/gk/plan/special';
        const w1 = CryptoJS.PBKDF2('D23ABC@#56', 'secret', {
          keySize: 8,
          iterations: 1e3,
          hasher: CryptoJS.algo.SHA256,
        }).toString();
        const q1 = CryptoJS.PBKDF2(N1, 'secret', {
          keySize: 4,
          iterations: 1e3,
          hasher: CryptoJS.algo.SHA256,
        }).toString();
        const H1 = CryptoJS.lib.CipherParams.create({
          ciphertext: CryptoJS.enc.Hex.parse(P1),
        });
        const B1 = CryptoJS.AES.decrypt(H1, CryptoJS.enc.Hex.parse(w1), {
          iv: CryptoJS.enc.Hex.parse(q1),
        });
        return B1.toString(CryptoJS.enc.Utf8);
      }

    }

  }


}


module.exports = gkcxController;
