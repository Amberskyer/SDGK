'use strict';
const Controller = require('../care/base_controller');
const cheerio = require('cheerio');


class PhoneController extends Controller {

  constructor(ctx) {
    super(ctx);
    this.threePhoneArr = [
      139, 138, 137, 136, 135, 134, 147, 150, 151, 152, 157, 158, 159, 172, 178, 182, 183, 184, 187, 188, 198,
      130, 131, 132, 140, 145, 146, 155, 156, 166, 167, 185, 186, 145, 175, 176,
      162, 165, 170, 171,
    ];
  }

  async initThreePhoneHtmlTable() {
    const { ctx } = this;
    const threePhoneTableArr = [];
    for (let i = 0; i < this.threePhoneArr.length; i++) {
      const threePhoneArrItem = this.threePhoneArr[i];
      threePhoneTableArr.push({
        three: threePhoneArrItem,
      });
    }
    await ctx.phoneModel.ThreeProvinceCityHtml.bulkCreate(threePhoneTableArr);

  }

  async loadThreePhoneHtmlTable() {
    const { ctx } = this;
    const threeProvinceCityList = await ctx.phoneModel.ThreeProvinceCityHtml.findAll({
      where: {
        status: 200,
        // id: 409,
      },
      // order: [[ 'id' ]],
      limit: 1,
    });

    let listSum = 0;
    for (let i = 0; i < threeProvinceCityList.length; i++) {
      const threeProvinceCityInfo = threeProvinceCityList[i];
      if (!threeProvinceCityInfo) {
        return;
      }
      const result = await ctx.baseGet(`https://www.jihaoba.com/haoduan/${threeProvinceCityInfo.three}/`);
      if (result.status === 200) {
        await ctx.phoneModel.ThreeProvinceCityHtml.update({
          status: 222,
          html: JSON.stringify(result.data),
        }, {
          where: {
            id: threeProvinceCityInfo.id,
          },
        });
      } else {
        await ctx.phoneModel.ThreeProvinceCityHtml.update({
          status: result.status,
          html: result.data,
        }, {
          where: {
            id: threeProvinceCityInfo.id,
          },
        });
      }
      listSum++;
    }

    if (listSum && listSum === threeProvinceCityList.length) {
      await this.loadThreePhoneHtml();
    }

  }


  async initThreePhoneHtml() {
    const { ctx } = this;
    const threeProvinceCityList = await ctx.phoneModel.ThreeProvinceCityHtml.findAll({
      where: {
        status: 222,
        // id: 409,
      },
      // order: [[ 'id' ]],
      limit: 1,
    });

    let listSum = 0;
    for (let i = 0; i < threeProvinceCityList.length; i++) {
      const threeProvinceCityInfo = threeProvinceCityList[i];

      const $ = cheerio.load(JSON.parse(threeProvinceCityInfo.html));
      const provinceCityArr = $('div.hd_mar');
      const sevenPhoneArr = [];
      for (let j = 0; j < provinceCityArr.length; j++) {
        const province = $('div.hd_mar').eq(j).find('p')
          .eq(0)
          .text();
        const cityArr = $('div.hd_mar').eq(j).find('div.hd_number1 a');
        for (let k = 0; k < cityArr.length; k++) {
          const city = $('div.hd_mar').eq(j).find('div.hd_number1 a')
            .eq(k)
            .text();
          const url = $('div.hd_mar').eq(j).find('div.hd_number1 a')
            .eq(k)
            .attr('href');
          sevenPhoneArr.push({
            province,
            city,
            url,
          });
        }
      }
      console.log(sevenPhoneArr);
      await ctx.phoneModel.ThreeProvinceCity.bulkCreate(sevenPhoneArr);

      await ctx.phoneModel.ThreeProvinceCityHtml.update({
        status: 666,
      }, {
        where: {
          id: threeProvinceCityInfo.id,
        },
      });
      listSum++;
    }

    if (listSum && listSum === threeProvinceCityList.length) {
      await this.initThreePhoneHtml();
    }

  }


  async loadThreePhoneHtml() {
    const { ctx } = this;


    for (let i = 0; i < 15000; i = i + 3000) {

      initItem(i);
    }

    async function initItem(offsetNum) {

      const threeProvinceCityList = await ctx.phoneModel.ThreeProvinceCity.findAll({
        where: {
          status: -1,
          id: {
            $between: [ offsetNum, offsetNum + 3000 ],
          },
          // id: 409,
        },
        attributes: [ 'id', 'three', 'province', 'city', 'url', 'status' ],
        // order: [[ 'id' ]],
        limit: 10,
      });

      let listSum = 0;
      for (let i = 0; i < threeProvinceCityList.length; i++) {
        const threeProvinceCityInfo = threeProvinceCityList[i];
        if (!threeProvinceCityInfo) {
          return;
        }
        const result = await ctx.baseGet(`https://www.jihaoba.com/${threeProvinceCityInfo.url}`);
        if (result.status === 200) {
          await ctx.phoneModel.ThreeProvinceCity.update({
            status: 222,
            html: JSON.stringify(result.data),
          }, {
            where: {
              id: threeProvinceCityInfo.id,
            },
          });
        } else {
          await ctx.phoneModel.ThreeProvinceCity.update({
            status: result.status,
            html: result.data,
          }, {
            where: {
              id: threeProvinceCityInfo.id,
            },
          });
        }
        listSum++;
      }

      if (listSum && listSum === threeProvinceCityList.length) {
        await initItem(offsetNum);
      }
    }

  }


  async initSevenPhoneHtml() {
    const { ctx } = this;


    for (let i = 0; i < 15000; i = i + 3000) {

      initItem(i);
    }
    // initItem(0);

    async function initItem(offsetNum) {

      const threeProvinceCityList = await ctx.phoneModel.ThreeProvinceCity.findAll({
        where: {
          id: {
            $between: [ offsetNum, offsetNum + 3000 ],
          },
          status: -1,
          // id: 409,
        },
        // order: [[ 'id' ]],
        limit: 20,
      });

      let listSum = 0;
      const idsArr = [];
      for (let i = 0; i < threeProvinceCityList.length; i++) {
        const threeProvinceCityInfo = threeProvinceCityList[i];

        const $ = cheerio.load(JSON.parse(threeProvinceCityInfo.html));
        const sevenArr = $('ul.hd-city li.hd-city01 a');
        const sevenPhoneArr = [];
        for (let j = 0; j < sevenArr.length; j++) {
          const seven = $('ul.hd-city li.hd-city01 a').eq(j)
            .text();
          const yys = $('ul.hd-city li.hd-city06 a').eq(j)
            .text();
          sevenPhoneArr.push({
            province: threeProvinceCityInfo.province,
            city: threeProvinceCityInfo.city,
            yys,
            seven,
          });
        }
        await ctx.phoneModel.SevenProvinceCity.bulkCreate(sevenPhoneArr);

        idsArr.push(threeProvinceCityInfo.id);
        //
        listSum++;
      }

      if (listSum && listSum === threeProvinceCityList.length) {
        await ctx.phoneModel.ThreeProvinceCity.update({
          status: 666,
        }, {
          where: {
            id: {
              $in: idsArr,
            },
          },
        });
        await initItem(offsetNum);
      }
    }

  }
}


module.exports = PhoneController;
