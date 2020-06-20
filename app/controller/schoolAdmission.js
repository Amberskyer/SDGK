'use strict';
const Controller = require('../care/base_controller');

class schoolMajorAdmissionController extends Controller {

  constructor(ctx) {
    super(ctx);
    this.batchCompareList = {
      1: [ '本一批', '本科批', '本科A批', '本科A段' ],
      4: [ '本二批', '第二批', '本三批', '本科二批C类', '二批C', '本科B批', '本科B段' ],
      11: [ '专科批', '高职专科', '高职高专' ],
    };
    this.batchList = [ 1, 4, 11 ];
    this.yearList = [ 2016, 2017, 2018, 2019 ];
    this.subjectTypeList = [ 'WEN', 'LI' ];
  }


  async compare() {
    const { ctx } = this;


    // for (let i = 0; i < 10202; i = i + 1000) {
    //
    // }

    initItem(0);

    // initItem(0);

    async function initItem(offsetNum) {

      const SchoolMajorAdmissionResult = await ctx.sdgkModel.SchoolAdmissionTable.findAll({
        where: {
          status: -1,
          // year: {
          //   $in: this.yearList,
          // },
        },
        order: [[ 'id' ]],
        limit: 22,
        offset: offsetNum,
      });
      // SchoolMajorAdmissionInfo = SchoolMajorAdmissionInfo[0];
      // console.log(SchoolMajorAdmissionInfo);

      const t404Arr = [];
      const t200Arr = [];

      let numCount = 0;
      for (let i = 0; i < SchoolMajorAdmissionResult.length; i++) {

        const SchoolMajorAdmissionInfo = SchoolMajorAdmissionResult[i];

        if (SchoolMajorAdmissionInfo) {

          const result = await ctx.sdgkModel.SchoolAdmission.findAll({
            where: {
              school_id: SchoolMajorAdmissionInfo.school_id,
              province_id: SchoolMajorAdmissionInfo.province_id,
              subject_type: SchoolMajorAdmissionInfo.subject_type,
              year: SchoolMajorAdmissionInfo.year,
            },
          });
          if (!result || result.length === 0) {
            console.log(`${SchoolMajorAdmissionInfo.school_name}在${SchoolMajorAdmissionInfo.province_name}的${SchoolMajorAdmissionInfo.subject_type}科，${SchoolMajorAdmissionInfo.year}年不招生`);


            // await ctx.youzyModel.SchoolMajorAdmission.update({
            //   status: 404,
            // }, {
            //   where: {
            //     r_school_id: SchoolMajorAdmissionInfo.school_id,
            //     r_province_id: SchoolMajorAdmissionInfo.province_id,
            //     subject_type: SchoolMajorAdmissionInfo.subject_type === 'WEN' ? 1 : 0,
            //     year: SchoolMajorAdmissionInfo.year,
            //     // batch_name: {
            //     //   $in: this.batchCompareList[batchItem],
            //     // },
            //   },
            // });
            //
            // console.log('结束');
            t404Arr.push(SchoolMajorAdmissionInfo.id);

          } else {

            t200Arr.push(SchoolMajorAdmissionInfo.id);
          }
          // console.log(t404Arr);
          // console.log(t200Arr);
        }
        numCount++;
        if (numCount === 22) {

          console.log(t404Arr);
          console.log(t200Arr);

          await ctx.sdgkModel.SchoolAdmissionTable.update({
            status: 404,
          }, {
            where: {
              id: {
                $in: t404Arr,
              },
            },
          });


          await ctx.sdgkModel.SchoolAdmissionTable.update({
            status: 200,
          }, {
            where: {
              id: {
                $in: t200Arr,
              },
            },
          });

          initItem(offsetNum);
        }
      }


    }


  }


  async compareToYouzy() {
    const { ctx } = this;


    // for (let i = 0; i < 10202; i = i + 1000) {
    //
    // }

    initItem(0);

    // initItem(0);

    async function initItem(offsetNum) {

      const SchoolMajorAdmissionResult = await ctx.sdgkModel.SchoolAdmissionTable.findAll({
        where: {
          status: 404,
          // year: {
          //   $in: this.yearList,
          // },
        },
        order: [[ 'id' ]],
        limit: 83,
        offset: offsetNum,
      });
      // SchoolMajorAdmissionInfo = SchoolMajorAdmissionInfo[0];
      // console.log(SchoolMajorAdmissionInfo);

      const t404Arr = [];

      let numCount = 0;
      for (let i = 0; i < SchoolMajorAdmissionResult.length; i++) {

        const SchoolMajorAdmissionInfo = SchoolMajorAdmissionResult[i];

        if (SchoolMajorAdmissionInfo) {

          await ctx.youzyModel.SchoolAdmission.update({
            status: 404,
          }, {
            where: {
              r_school_id: SchoolMajorAdmissionInfo.school_id,
              r_province_id: SchoolMajorAdmissionInfo.province_id,
              subject_type: SchoolMajorAdmissionInfo.subject_type,
              year: SchoolMajorAdmissionInfo.year,
            },
          });

          console.log('结束');
          t404Arr.push(SchoolMajorAdmissionInfo.id);
        }
        numCount++;
        if (numCount === 83) {

          await ctx.sdgkModel.SchoolAdmissionTable.update({
            status: 40404,
          }, {
            where: {
              id: {
                $in: t404Arr,
              },
            },
          });

          initItem(offsetNum);
        }
      }


    }


  }


  async initSchoolAdmissionTable() {
    const { ctx } = this;

    this.schoolList = await ctx.sdgkModel.School.findAll();
    this.provinceList = await ctx.sdgkModel.Province.findAll({

      where: {
        parent_id: 1,
      },

    });

    // console.log(this.provinceList);
    // console.log(this.provinceList.length);
    //
    // return ;


    const schoolAdmissionJson = [];

    for (let i = 0; i < this.schoolList.length; i++) {
      const schoolItem = this.schoolList[i];

      for (let j = 0; j < this.provinceList.length; j++) {
        const provinceItem = this.provinceList[j];

        for (let k = 0; k < this.subjectTypeList.length; k++) {
          const subjectTypeItem = this.subjectTypeList[k];

          for (let l = 0; l < this.yearList.length; l++) {
            const yearItem = this.yearList[l];


            const schoolAdmissionJsonItem = {

              school_id: schoolItem.id,
              school_name: schoolItem.xue_xiao_ming_cheng,
              province_id: provinceItem.id,
              province_name: provinceItem.name,
              subject_type: subjectTypeItem,
              year: yearItem,
              // batch_id: batchItem,
            };
            schoolAdmissionJson.push(schoolAdmissionJsonItem);

          }

        }

      }


    }
    console.log(schoolAdmissionJson.length);
    await ctx.youzyModel.SchoolAdmissionTable.bulkCreate(schoolAdmissionJson);
    console.log('结束');


  }


}


module.exports = schoolMajorAdmissionController;
