'use strict';
const Controller = require('../care/base_controller');
const cheerio = require('cheerio');


class YggkController extends Controller {

  constructor(ctx) {
    super(ctx);
  }

  async initSchoolTopicTable() {
    const { ctx } = this;
    const tableArr = [];
    for (let i = 0; i < 29; i++) {
      tableArr.push({
        url: `https://gaokao.chsi.com.cn/zsgs/zhangcheng/listVerifedZszc--method-index,lb-1,start-${100 * i}.dhtml`,
        status: -1,
      });
    }
    await ctx.yggkModel.SchoolTopicTable.bulkCreate(tableArr);

  }


  async loadSchoolTopicTableHtml() {
    const { ctx } = this;
    const schoolTopicTableList = await ctx.yggkModel.SchoolTopicTable.findAll({
      where: {
        status: -1,
        // id: 409,
      },
      // order: [[ 'id' ]],
      limit: 1,
    });

    let listSum = 0;
    for (let i = 0; i < schoolTopicTableList.length; i++) {
      const schoolTopicTableInfo = schoolTopicTableList[i];
      if (!schoolTopicTableInfo) {
        return;
      }
      const result = await ctx.baseGet(schoolTopicTableInfo.url);
      if (result.status === 200) {
        await ctx.yggkModel.SchoolTopicTable.update({
          status: 222,
          html: JSON.stringify(result.data),
        }, {
          where: {
            id: schoolTopicTableInfo.id,
          },
        });
      } else {
        await ctx.phoneModel.ThreeProvinceCityHtml.update({
          status: result.status,
          html: result.data,
        }, {
          where: {
            id: schoolTopicTableInfo.id,
          },
        });
      }
      listSum++;
    }

    if (listSum && listSum === schoolTopicTableList.length) {
      await this.loadSchoolTopicTableHtml();
    }

  }


  async initSchoolTopicTableHtml() {
    const { ctx } = this;
    const SchoolTopicTableList = await ctx.yggkModel.SchoolTopicTable.findAll({
      where: {
        status: 222,
        // id: 409,
      },
      // order: [[ 'id' ]],
      limit: 1,
    });

    let listSum = 0;
    for (let i = 0; i < SchoolTopicTableList.length; i++) {
      const SchoolTopicTableInfo = SchoolTopicTableList[i];

      const $ = cheerio.load(JSON.parse(SchoolTopicTableInfo.html));
      const schoolTopicList = $('tbody tr td a');
      const schoolTopicArr = [];
      for (let j = 0; j < schoolTopicList.length; j++) {
        const school_name = schoolTopicList.eq(j)
          .text().replace(/\s*/g, '');
        const url = schoolTopicList.eq(j)
          .attr('href');
        schoolTopicArr.push({
          school_name,
          url,
        });
      }
      console.log(schoolTopicArr);
      await ctx.yggkModel.SchoolTopic.bulkCreate(schoolTopicArr);

      await ctx.yggkModel.SchoolTopicTable.update({
        status: 666,
      }, {
        where: {
          id: SchoolTopicTableInfo.id,
        },
      });
      listSum++;
    }

    if (listSum && listSum === SchoolTopicTableList.length) {
      await this.initSchoolTopicTableHtml();
    }

  }


  async loadSchoolTopicHtml() {
    const { ctx } = this;


    for (let i = 0; i < 3000; i = i + 1000) {

      initItem(i);
    }

    async function initItem(offsetNum) {

      const schoolTopicList = await ctx.yggkModel.SchoolTopic.findAll({
        where: {
          status: -1,
          id: {
            $between: [ offsetNum, offsetNum + 1000 ],
          },
          // id: 409,
        },
        // order: [[ 'id' ]],
        limit: 10,
      });

      let listSum = 0;
      for (let i = 0; i < schoolTopicList.length; i++) {
        const schoolTopicInfo = schoolTopicList[i];
        if (!schoolTopicInfo) {
          return;
        }
        const result = await ctx.baseGet(`https://gaokao.chsi.com.cn${schoolTopicInfo.url}`);
        if (result.status === 200) {
          await ctx.yggkModel.SchoolTopic.update({
            status: 222,
            html: JSON.stringify(result.data),
          }, {
            where: {
              id: schoolTopicInfo.id,
            },
          });
        } else {
          await ctx.yggkModel.SchoolTopic.update({
            status: result.status,
            html: result.data,
          }, {
            where: {
              id: schoolTopicInfo.id,
            },
          });
        }
        listSum++;
      }

      if (listSum && listSum === schoolTopicList.length) {
        await initItem(offsetNum);
      }
    }

  }


  async initSchoolTopicHtml() {
    const { ctx } = this;


    for (let i = 0; i < 3000; i = i + 1000) {

      initItem(i);
    }

    // initItem(0);

    async function initItem(offsetNum) {

      const schoolTopicList = await ctx.yggkModel.SchoolTopic.findAll({
        where: {
          status: 222,
          id: {
            $between: [ offsetNum, offsetNum + 1000 ],
          },
          // id: 409,
        },
        // order: [[ 'id' ]],
        limit: 10,
      });

      let listSum = 0;
      for (let i = 0; i < schoolTopicList.length; i++) {
        const schoolTopicInfo = schoolTopicList[i];
        if (!schoolTopicInfo) {
          return;
        }

        const $ = cheerio.load(JSON.parse(schoolTopicInfo.html));
        const topicUrl = $('.zszcdel').eq(0).find('td a')
          .eq(0)
          .attr('href');
        console.log(topicUrl);
        await ctx.yggkModel.SchoolTopic.update({
          topic_url: topicUrl,
          status: 666,
        }, {
          where: {
            id: schoolTopicInfo.id,
          },
        });
        listSum++;
      }

      if (listSum && listSum === schoolTopicList.length) {
        await initItem(offsetNum);
      }
    }

  }


  async loadTopicHtml() {
    const { ctx } = this;


    for (let i = 0; i < 3000; i = i + 1000) {

      initItem(i);
    }

    async function initItem(offsetNum) {

      const schoolTopicList = await ctx.yggkModel.SchoolTopic.findAll({
        where: {
          status: 888,
          id: {
            $between: [ offsetNum, offsetNum + 1000 ],
          },
          // id: 409,
        },
        // order: [[ 'id' ]],
        limit: 10,
      });

      let listSum = 0;
      for (let i = 0; i < schoolTopicList.length; i++) {
        const schoolTopicInfo = schoolTopicList[i];
        if (!schoolTopicInfo) {
          return;
        }
        const result = await ctx.baseGet(`https://gaokao.chsi.com.cn${schoolTopicInfo.topic_url}`);
        if (result.status === 200) {
          await ctx.yggkModel.SchoolTopic.update({
            status: 88888,
            topic_html: JSON.stringify(result.data),
          }, {
            where: {
              id: schoolTopicInfo.id,
            },
          });
        } else {
          await ctx.yggkModel.SchoolTopic.update({
            status: result.status,
            topic_html: result.data,
          }, {
            where: {
              id: schoolTopicInfo.id,
            },
          });
        }
        listSum++;
      }

      if (listSum && listSum === schoolTopicList.length) {
        await initItem(offsetNum);
      }
    }

  }


  async initTopicHtml() {
    const { ctx } = this;


    for (let i = 0; i < 3000; i = i + 1000) {

      initItem(i);
    }

    // initItem(0);

    async function initItem(offsetNum) {

      const schoolTopicList = await ctx.yggkModel.SchoolTopic.findAll({
        where: {
          status: 999,
          id: {
            $between: [ offsetNum, offsetNum + 1000 ],
          },
          // id: 409,
        },
        // order: [[ 'id' ]],
        limit: 10,
      });

      let listSum = 0;
      for (let i = 0; i < schoolTopicList.length; i++) {
        const schoolTopicInfo = schoolTopicList[i];
        if (!schoolTopicInfo) {
          return;
        }

        const $ = cheerio.load(JSON.parse(schoolTopicInfo.topic_html), { decodeEntities: false });
        const topicTitle = $('h2.center').eq(0).text();
        const topicContent = $('div.content').eq(0).html();
        // console.log(topicContent);
        // console.log($.html());
        await ctx.yggkModel.SchoolTopic.update({
          title: topicTitle,
          topic_content: topicContent,
          status: 900,
        }, {
          where: {
            id: schoolTopicInfo.id,
          },
        });
        listSum++;
      }

      if (listSum && listSum === schoolTopicList.length) {
        await initItem(offsetNum);
      }
    }

  }


}


module.exports = YggkController;

