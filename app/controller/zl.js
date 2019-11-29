'use strict';
const Controller = require('../care/base_controller');
const fs = require('fs');
const xlsx = require('node-xlsx');
const cheerio = require('cheerio');
const querystring = require('querystring');
const qs = require('qs');


class CompareController extends Controller {

  constructor(ctx) {
    super(ctx);
    this.schoolList = null;
    // this.cookie = 'Ecp_notFirstLogin=OQrSST; Ecp_ClientId=6190911142100983984; LID=WEEvREdxOWJmbC9oM1NjYkdwUlVZM3B0Uzl2bXNoL0FIQlQxRk03c0E1dTU=$R1yZ0H6jyaa0en3RxVUd8df-oHi7XMMDo7mtKT6mSmEvTuk11l2gFA!!; ASP.NET_SessionId=wx4iekl2rgr0b52e5b31kjfq; SID_kns=123113; SID_klogin=125141; Ecp_session=1; Ecp_LoginStuts=%7B%22IsAutoLogin%22%3Afalse%2C%22UserName%22%3A%22K10140%22%2C%22ShowName%22%3A%22%25E5%258D%258E%25E4%25B8%25AD%25E5%25B8%2588%25E8%258C%2583%25E5%25A4%25A7%25E5%25AD%25A6%22%2C%22UserType%22%3A%22bk%22%2C%22r%22%3A%22OQrSST%22%7D; SID_krsnew=125131; cnkiUserKey=835d0e60-9e10-4f42-7460-2c2bec73b436; _pk_ses=*; KNS_SortType=; RsPerPage=20; KNS_DisplayModel=custommode@SCDB; c_m_LinID=LinID=WEEvREdxOWJmbC9oM1NjYkdwUlVZM3B0Uzl2bXNoL0FIQlQxRk03c0E1dTU=$R1yZ0H6jyaa0en3RxVUd8df-oHi7XMMDo7mtKT6mSmEvTuk11l2gFA!!&ot=09/11/2019 14:43:26; c_m_expire=2019-09-11 14:43:26';
    // this.cookie2 = 'Ecp_notFirstLogin=OQrSST; Ecp_ClientId=6190911142100983984; LID=WEEvREdxOWJmbC9oM1NjYkdwUlVZM3B0Uzl2bXNoL0FIQlQxRk03c0E1dTU=$R1yZ0H6jyaa0en3RxVUd8df-oHi7XMMDo7mtKT6mSmEvTuk11l2gFA!!; ASP.NET_SessionId=wx4iekl2rgr0b52e5b31kjfq; SID_kns=123113; SID_klogin=125141; Ecp_session=1; Ecp_LoginStuts=%7B%22IsAutoLogin%22%3Afalse%2C%22UserName%22%3A%22K10140%22%2C%22ShowName%22%3A%22%25E5%258D%258E%25E4%25B8%25AD%25E5%25B8%2588%25E8%258C%2583%25E5%25A4%25A7%25E5%25AD%25A6%22%2C%22UserType%22%3A%22bk%22%2C%22r%22%3A%22OQrSST%22%7D; SID_krsnew=125131; cnkiUserKey=835d0e60-9e10-4f42-7460-2c2bec73b436; _pk_ses=*; KNS_SortType=; RsPerPage=20; KNS_DisplayModel=custommode@SCDB; c_m_LinID=LinID=WEEvREdxOWJmbC9oM1NjYkdwUlVZM3B0Uzl2bXNoL0FIQlQxRk03c0E1dTU=$R1yZ0H6jyaa0en3RxVUd8df-oHi7XMMDo7mtKT6mSmEvTuk11l2gFA!!&ot=09/11/2019 14:42:39; c_m_expire=2019-09-11 14:42:39';

    this.cookie = 'ecp_uid5=089d2b9e3ffc423b822b21320e46622d; Ecp_notFirstLogin=7IbgcB; Ecp_ClientId=8190905104000826551; RsPerPage=20; cnkiUserKey=7375b9b3-9b88-6b5b-9832-d5692a8e0d33; KNS_DisplayModel=custommode@SCDB; LID=WEEvREcwSlJHSldRa1FhcTdWa2JLS2NzbnRQTTJpTDRWUVY5UDlFbFhHUT0=$9A4hF_YAuvQ5obgVAqNKPCYcEjKensW4IQMovwHtwkF4VYPoHbKxJw!!; ASP.NET_SessionId=rc52pdxsry1mceebzo3niyjp; SID_kns=123105; Ecp_session=1; SID_klogin=125144; KNS_SortType=; SID_krsnew=125133; _pk_ref=%5B%22%22%2C%22%22%2C1569136201%2C%22https%3A%2F%2Fwww.cnki.net%2F%22%5D; _pk_ses=*; SID_kcms=124116; Ecp_LoginStuts=%7B%22IsAutoLogin%22%3Afalse%2C%22UserName%22%3A%22K10140%22%2C%22ShowName%22%3A%22%25E5%258D%258E%25E4%25B8%25AD%25E5%25B8%2588%25E8%258C%2583%25E5%25A4%25A7%25E5%25AD%25A6%22%2C%22UserType%22%3A%22bk%22%2C%22r%22%3A%227IbgcB%22%7D; c_m_LinID=LinID=WEEvREcwSlJHSldRa1FhcTdWa2JLS2NzbnRQTTJpTDRWUVY5UDlFbFhHUT0=$9A4hF_YAuvQ5obgVAqNKPCYcEjKensW4IQMovwHtwkF4VYPoHbKxJw!!&ot=09/22/2019 16:01:55; c_m_expire=2019-09-22 16:01:55';
    this.cookie2 = 'ecp_uid5=089d2b9e3ffc423b822b21320e46622d; Ecp_notFirstLogin=7IbgcB; Ecp_ClientId=8190905104000826551; RsPerPage=20; cnkiUserKey=7375b9b3-9b88-6b5b-9832-d5692a8e0d33; KNS_DisplayModel=custommode@SCDB; LID=WEEvREcwSlJHSldRa1FhcTdWa2JLS2NzbnRQTTJpTDRWUVY5UDlFbFhHUT0=$9A4hF_YAuvQ5obgVAqNKPCYcEjKensW4IQMovwHtwkF4VYPoHbKxJw!!; ASP.NET_SessionId=rc52pdxsry1mceebzo3niyjp; SID_kns=123105; Ecp_session=1; SID_klogin=125144; KNS_SortType=; SID_krsnew=125133; _pk_ref=%5B%22%22%2C%22%22%2C1569136201%2C%22https%3A%2F%2Fwww.cnki.net%2F%22%5D; _pk_ses=*; SID_kcms=124116; Ecp_LoginStuts=%7B%22IsAutoLogin%22%3Afalse%2C%22UserName%22%3A%22K10140%22%2C%22ShowName%22%3A%22%25E5%258D%258E%25E4%25B8%25AD%25E5%25B8%2588%25E8%258C%2583%25E5%25A4%25A7%25E5%25AD%25A6%22%2C%22UserType%22%3A%22bk%22%2C%22r%22%3A%227IbgcB%22%7D; c_m_LinID=LinID=WEEvREcwSlJHSldRa1FhcTdWa2JLS2NzbnRQTTJpTDRWUVY5UDlFbFhHUT0=$9A4hF_YAuvQ5obgVAqNKPCYcEjKensW4IQMovwHtwkF4VYPoHbKxJw!!&ot=09/22/2019 16:01:55; c_m_expire=2019-09-22 16:01:55';

  }

  async init() {
    const { ctx, app } = this;
    const jyrc = app.mysql.get('jyrc');
    let num = 1810;
    const cookie = this.cookie;
    const cookie2 = this.cookie2;
    initItem();
    async function initItem() {
      const zhuan_li = await jyrc.get('zhuan_lis', { status: null });
      // const teacher = await jyrc.get('tb_100000_yan_jiu_ren_yuan', { id: zhuan_li.yan_jiu_ren_yuan_id });
      if (zhuan_li) {

        const url = 'https://kns.cnki.net/kns/request/SearchHandler.ashx';
        const params = {
          action: '',
          NaviCode: '*',
          ua: '1.21',
          isinEn: '0',
          PageName: 'ASP.brief_result_aspx',
          DbPrefix: 'SCOD',
          DbCatalog: '专利数据总库',
          ConfigFile: 'SCOD.xml',
          db_opt: 'SCOD',
          db_value: '中国专利数据库,国外专利数据库',
          txt_1_sel: 'FMR',
          txt_1_value1: zhuan_li.name,
          txt_1_relation: '#CNKI_AND',
          txt_1_special1: '=',
          txt_2_sel: 'SQR',
          txt_2_value1: zhuan_li.school,
          txt_2_logical: 'and',
          txt_2_relation: '#CNKI_AND',
          txt_2_special1: '=',
          his: 0,
          __: 'Sun Sep 22 2019 16:14:14 GMT+0800 (中国标准时间)',
        };
        const referer = 'https://kns.cnki.net/kns/brief/result.aspx?dbprefix=SCDB&crossDbcodes=CJFQ,CDFD,CMFD,CPFD,IPFD,CCND,CCJD';
        await ctx.basePost(url, params, cookie, referer);

        const params2 = {
          pagename: 'ASP.brief_result_aspx',
          isinEn: '0',
          dbPrefix: 'SCOD',
          dbCatalog: '专利数据总库',
          ConfigFile: 'SCOD.xml',
          research: 'off',
          t: '1569140054899',
          keyValue: zhuan_li.name,
          S: '1',
          sorttype: '',
        };
        const url2 = 'https://kns.cnki.net/kns/brief/brief.aspx?' + qs.stringify(params2);
        // // const referer = 'https://kns.cnki.net/kns/brief/brief.aspx?pagename=ASP.brief_result_aspx&isinEn=1&dbPrefix=SCDB&dbCatalog=%e4%b8%ad%e5%9b%bd%e5%ad%a6%e6%9c%af%e6%96%87%e7%8c%ae%e7%bd%91%e7%bb%9c%e5%87%ba%e7%89%88%e6%80%bb%e5%ba%93&ConfigFile=SCDB.xml&research=off&t=1567582977022&keyValue=&S=1&sorttype=';
        const result = await ctx.baseGet(url2, {}, cookie2, null);
        const $ = cheerio.load(result.data);
        let totalNum = $('#lbPagerTitle')[0].next.data;
        const patt1 = new RegExp('找到 ', 'g');
        const patt2 = new RegExp(' 条结果', 'g');
        totalNum = totalNum.replace(patt1, '');
        totalNum = totalNum.replace(patt2, '');
        console.log(totalNum);
        await jyrc.update('zhuan_lis', {
          html: result.data,
          num: parseInt(totalNum),
          status: 22,
          url: url2,
        }, {
          where: {
            id: zhuan_li.id,
          },
        });
        num++;
        await initItem();
      }
    }
    const teacher = await jyrc.get('zhuan_lis', { id: 234 });
    ctx.status = 200;
    ctx.body = teacher.html;
  }


  async initLunwenHtml() {
    const { ctx, app } = this;
    const jyrc = app.mysql.get('jyrc');
    let num = 1;

    initItem();
    async function initItem() {
      const teacher = await jyrc.get('zhuan_lis', { status: 22 });
      if (teacher) {
        const $ = cheerio.load(teacher.html);
        const totalNum = teacher.num;
        if (totalNum && parseInt(totalNum) !== 0) {
          for (let i = 1; i <= Math.ceil(totalNum / 20); i++) {
            if (i === 1) {
              await jyrc.insert('zhuan_li', {
                name: teacher.name,
                school: teacher.school,
                person_id: teacher.id,
                url: teacher.url, // // const referer = 'https://kns.cnki.net/kns/brief/brief.aspx?pagename=ASP.brief_result_aspx&isinEn=1&dbPrefix=SCDB&dbCatalog=%e4%b8%ad%e5%9b%bd%e5%ad%a6%e6%9c%af%e6%96%87%e7%8c%ae%e7%bd%91%e7%bb%9c%e5%87%ba%e7%89%88%e6%80%bb%e5%ba%93&ConfigFile=SCDB.xml&research=off&t=1567582977022&keyValue=&S=1&sorttype=';
                html: teacher.html,
                page: 1,
                num: parseInt(totalNum),
              });
            } else {

              let url = 'https://kns.cnki.net/kns/brief/brief.aspx' + $('.TitleLeftCell a')[0].attribs.href;
              const patt1 = new RegExp('curpage=2', 'g');
              url = url.replace(patt1, 'curpage=' + i);
              await jyrc.insert('zhuan_li', {
                name: teacher.name,
                school: teacher.school,
                person_id: teacher.id,
                url,
                page: i,
                num: parseInt(totalNum),
              });
            }

            console.log({ num });
            if (i == Math.ceil(totalNum / 20)) {

              await jyrc.update('zhuan_lis', { status: 66 }, {
                where: {
                  id: teacher.id,
                },
              });
              num++;
              await initItem();
            }

          }
        } else {

          await jyrc.update('zhuan_lis', { status: 66 }, {
            where: {
              id: teacher.id,
            },
          });
          num++;
          await initItem();

        }
      }
    }
    ctx.status = 200;
    ctx.body = 111;
  }


  async loadLunwenHtml() {
    const { ctx, app } = this;
    const jyrc = app.mysql.get('jyrc');
    const cookie = this.cookie;
    const cookie2 = this.cookie2;

    initItem();
    async function initItem() {
      const zhuan_li = await jyrc.get('zhuan_li', { status: null, html: null });


      const url = 'https://kns.cnki.net/kns/request/SearchHandler.ashx';
      const params = {
        action: '',
        NaviCode: '*',
        ua: '1.21',
        isinEn: '0',
        PageName: 'ASP.brief_result_aspx',
        DbPrefix: 'SCOD',
        DbCatalog: '专利数据总库',
        ConfigFile: 'SCOD.xml',
        db_opt: 'SCOD',
        db_value: '中国专利数据库,国外专利数据库',
        txt_1_sel: 'FMR',
        txt_1_value1: zhuan_li.name,
        txt_1_relation: '#CNKI_AND',
        txt_1_special1: '=',
        txt_2_sel: 'SQR',
        txt_2_value1: zhuan_li.school,
        txt_2_logical: 'and',
        txt_2_relation: '#CNKI_AND',
        txt_2_special1: '=',
        his: 0,
        __: 'Sun Sep 22 2019 16:14:14 GMT+0800 (中国标准时间)',
      };
      const referer = 'https://kns.cnki.net/kns/brief/result.aspx?dbprefix=SCDB&crossDbcodes=CJFQ,CDFD,CMFD,CPFD,IPFD,CCND,CCJD';
      await ctx.basePost(url, params, cookie, referer);

      const params2 = {
        pagename: 'ASP.brief_result_aspx',
        isinEn: '0',
        dbPrefix: 'SCOD',
        dbCatalog: '专利数据总库',
        ConfigFile: 'SCOD.xml',
        research: 'off',
        t: '1569140054899',
        keyValue: zhuan_li.name,
        S: '1',
        sorttype: '',
      };
      const url2 = zhuan_li.url;
      // // const referer = 'https://kns.cnki.net/kns/brief/brief.aspx?pagename=ASP.brief_result_aspx&isinEn=1&dbPrefix=SCDB&dbCatalog=%e4%b8%ad%e5%9b%bd%e5%ad%a6%e6%9c%af%e6%96%87%e7%8c%ae%e7%bd%91%e7%bb%9c%e5%87%ba%e7%89%88%e6%80%bb%e5%ba%93&ConfigFile=SCDB.xml&research=off&t=1567582977022&keyValue=&S=1&sorttype=';
      const result = await ctx.baseGet(url2, {}, cookie2, null);
      const $ = cheerio.load(result.data);
      let totalNum = $('#lbPagerTitle')[0].next.data;
      const patt1 = new RegExp('找到 ', 'g');
      const patt2 = new RegExp(' 条结果', 'g');
      totalNum = totalNum.replace(patt1, '');
      totalNum = totalNum.replace(patt2, '');
      console.log(totalNum);
      await jyrc.update('zhuan_li', {
        html: result.data,
        num: parseInt(totalNum),
        status: 22,
      }, {
        where: {
          id: zhuan_li.id,
        },
      });
      await initItem();
    }
    const zhuan_li = await jyrc.get('zhuan_li', { page: 2 });
    // const $ = cheerio.load(teacher.html);
    // console.log(teacher.url);
    // console.log($('font.Mark').parent().eq(0)
    //   .text());
    ctx.status = 200;
    ctx.body = zhuan_li.html;
  }

  async checkLunwen() {
    const { ctx, app } = this;
    const jyrc = app.mysql.get('jyrc');

    // initItem();
    async function initItem() {
      const teacher = await jyrc.get('lun_wen', { status: 11 });
      const $ = cheerio.load(teacher.html);
      const num = teacher.num;
      console.log(teacher);
      if (parseInt(num) <= 20) {
        await jyrc.update('lun_wen', {
          status: 2,
        }, {
          where: {
            id: teacher.id,
          },
        });
      } else if (!$('div.TitleLeftCell font.Mark')[0]) {
        await jyrc.update('lun_wen', {
          status: 3,
        }, {
          where: {
            id: teacher.id,
          },
        });
      } else {
        const pageA = $('div.TitleLeftCell font.Mark')[0].children[0].data;
        const pageB = teacher.page;

        if (parseInt(num) > 20 && parseInt(pageA) === parseInt(pageB)) {
          await jyrc.update('lun_wen', {
            status: 2,
          }, {
            where: {
              id: teacher.id,
            },
          });
        } else {
          await jyrc.update('lun_wen', {
            status: 3,
          }, {
            where: {
              id: teacher.id,
            },
          });

        }
      }

      await initItem();

    }

    initItem2();
    async function initItem2() {
      const teacher = await jyrc.get('lun_wen', { status: 0 });
      const person = await jyrc.get('tb_100000_yan_jiu_ren_yuan', { id: teacher.person_id });
      const $ = cheerio.load(teacher.html);

      const name1 = person.xing_ming;
      const name2 = $('font.Mark').eq(0)
        .text();

      if (name2 && name2.replace(/\s*/g, '').toUpperCase() === name1.replace(/\s*/g, '').toUpperCase()) {
        // console.log($('font.Mark')[0].text());
        // console.log(person.xing_ming);
        await jyrc.update('lun_wen', {
          html_name: null,
          status: 22,
        }, {
          where: {
            id: teacher.id,
          },
        });
      } else
      if (name2 && name2.replace(/\s*/g, '').toUpperCase() !== name1.replace(/\s*/g, '').toUpperCase()) {
        console.log(person.id);
        console.log(name2);
        console.log(person.xing_ming);
        await jyrc.update('lun_wen', {
          status: 33,
          html_name: name2,
        }, {
          where: {
            id: teacher.id,
          },
        });
      } else {

        await jyrc.update('lun_wen', {
          status: 44,
        }, {
          where: {
            id: teacher.id,
          },
        });
      }
      await initItem2();
    }

    const teacher = await jyrc.get('lun_wen', { id: 2844 });
    const $ = cheerio.load(teacher.html);
    console.log($('font.Mark').eq(0)
      .text());
    ctx.status = 200;
    ctx.body = teacher.html;

  }

  async initLunwen() {
    const { ctx, app } = this;
    const jyrc = app.mysql.get('jyrc');

    initItem();
    async function initItem() {
      const zhuan_li = await jyrc.get('zhuan_li', { status: 66 });
      const $ = cheerio.load(zhuan_li.html);
      const tdArr = $('table.GridTableContent tr:not(:first-child)');
      console.log(tdArr.eq(0).children('td').eq(3)
        .text());
      for (let i = 0; i < 20; i++) {
        const item = {
          zhuan_li_ming_cheng: null,
          fa_ming_ren: zhuan_li.school,
          shen_qing_ren: zhuan_li.school,
          zhuan_li_guo_bie: zhuan_li.school,
          shou_li_shi_jian: zhuan_li.school,
          shou_quan_shi_jian: zhuan_li.school,
          yan_jiu_ren_yuan_id: zhuan_li.person_id,
          url: '',
        };
        if (tdArr.eq(i) && tdArr.eq(i).children('td') && tdArr.eq(i).children('td').eq(1)
          .text()
          .replace(/\s*/g, '')) {
          item.zhuan_li_ming_cheng = tdArr.eq(i).children('td').eq(1)
            .text()
            .replace(/\s*/g, '');
          item.url = tdArr.eq(i).children('td').eq(1)
            .children('a')
            .eq(0)
            .attr('href');
          item.fa_ming_ren = tdArr.eq(i).children('td').eq(2)
            .text()
            .replace(/\s*/g, '');
          item.shen_qing_ren = tdArr.eq(i).children('td').eq(3)
            .text()
            .replace(/\s*/g, '');
          item.zhuan_li_guo_bie = tdArr.eq(i).children('td').eq(4)
            .text()
            .replace(/\s*/g, '');
          item.shou_li_shi_jian = tdArr.eq(i).children('td').eq(5)
            .text()
            .replace(/\s*/g, '');
          item.shou_quan_shi_jian = tdArr.eq(i).children('td').eq(6)
            .text()
            .replace(/\s*/g, '');
          console.log(zhuan_li.yan_jiu_ren_yuan_id, item.zhuan_li_ming_cheng);
          await jyrc.update('tb_100010_zhuan_li', {
            yan_jiu_ren_yuan_id: item.yan_jiu_ren_yuan_id,
          }, {
            where: {
              zhuan_li_ming_cheng: item.zhuan_li_ming_cheng,
            },
          });
        }
      }
      console.log(zhuan_li.id);
      await jyrc.update('zhuan_li', {
        status: 22,
      }, {
        where: {
          id: zhuan_li.id,
        },
      });
      await initItem();
    }
    const teacher = await jyrc.get('lun_wen', { person_id: 2130 });
    const $ = cheerio.load(teacher.html);
    const tdArr = $('div.GridSingleRow div.GridRightColumn').eq(0).find('h3.title_c a')
      .first()
      .text();
    // console.log(tdArr);
    ctx.status = 200;
    ctx.body = teacher.html;

  }

  async getlunwenGx() {
    const { ctx, app } = this;
    const jyrc = app.mysql.get('jyrc');

    initItem();
    async function initItem() {
      const lunwen = await jyrc.get('tb_100007_lun_wen', { status: null });
      const pearson = await jyrc.get('tb_100000_yan_jiu_ren_yuan', { id: lunwen.yan_jiu_ren_yuan_id });
      let zzStr = lunwen.qi_ta_zuo_zhe;
      const patt1 = new RegExp(',', 'g');
      const patt2 = new RegExp('，', 'g');
      const patt3 = new RegExp('；', 'g');
      zzStr = zzStr.replace(patt1, ';');
      zzStr = zzStr.replace(patt2, ';');
      zzStr = zzStr.replace(patt3, ';');

      const zzArr = zzStr.split(';');
      zzArr.forEach(async (item, index) => {
        item = item.replace(/\s*/g, '');
        if (index === 0) {
          await jyrc.update('tb_100007_lun_wen', {
            di_yi_zuo_zhe: item,
          }, {
            where: {
              id: lunwen.id,
            },
          });
        }
        if (item !== pearson.xing_ming && item !== '') {
          const gxItem = {
            yan_jiu_ren_yuan_id: lunwen.yan_jiu_ren_yuan_id,
            he_zuo_zhe: item,
            lun_wen_id: lunwen.id,
          };
          await jyrc.insert('tb_100015_lun_wen_xie_zuo', gxItem);
        }
      });
      console.log(lunwen.id);
      await jyrc.update('tb_100007_lun_wen', {
        status: 22,
      }, {
        where: {
          id: lunwen.id,
        },
      });

      await initItem();
    }
    ctx.status = 200;
    ctx.body = 200;

  }

  async loadLunwenDetailHtml() {
    const { ctx, app } = this;
    const jyrc = app.mysql.get('jyrc');
    const cookie = this.cookie;
    const cookie2 = this.cookie2;

    initItem();
    async function initItem() {
      const zhuan_li = await jyrc.get('tb_100010_zhuan_li', { status: 22 });
      const urlParam = querystring.parse(zhuan_li.url);
      const params = {
        dbcode: urlParam.dbcode,
        dbname: urlParam.dbname,
        filename: urlParam.filename,
      };
      const url = 'http://dbpub.cnki.net/grid2008/dbpub/detail.aspx?' + qs.stringify(params);
      console.log(zhuan_li.id);
      console.log(url);
      const result = await ctx.baseGet(url, {}, cookie, null);

      await jyrc.update('tb_100010_zhuan_li', {
        html: result.data,
        status: 66,
      }, {
        where: {
          id: zhuan_li.id,
        },
      });
      await initItem();
    }
    const teacher = await jyrc.get('tb_100010_zhuan_li', { id: 1 });
    ctx.status = 200;
    ctx.body = teacher.html;
  }


  async initLunwenDetail() {
    const { ctx, app } = this;
    const jyrc = app.mysql.get('jyrc');

    initItem();

    async function initItem() {
      const zhuan_li = await jyrc.get('tb_100010_zhuan_li', { status: 22 });
      if (zhuan_li.html) {

        const $ = cheerio.load(zhuan_li.html);
        const tdArr = $('table:nth-child(3) tr');
        const item = {
          shen_qing_hao: tdArr.eq(0).children('td')
            .eq(1)
            .text()
            .replace(/\s*/g, ''),
          shen_qing_ri: tdArr.eq(0).children('td')
            .eq(3)
            .text()
            .replace(/\s*/g, ''),
          gong_kai_hao: tdArr.eq(1).children('td')
            .eq(1)
            .text()
            .replace(/\s*/g, ''),
          gong_kai_ri: tdArr.eq(1).children('td')
            .eq(3)
            .text()
            .replace(/\s*/g, ''),
          shen_qing_ren: tdArr.eq(2).children('td')
            .eq(1)
            .text()
            .replace(/\s*/g, ''),
          di_zhi: tdArr.eq(2).children('td')
            .eq(3)
            .text()
            .replace(/\s*/g, ''),
          gong_tong_shen_qing_ren: tdArr.eq(3).children('td')
            .eq(1)
            .text()
            .replace(/\s*/g, ''),
          fa_ming_ren: tdArr.eq(4).children('td')
            .eq(1)
            .text()
            .replace(/\s*/g, ''),
          guo_ji_shen_qing: tdArr.eq(5).children('td')
            .eq(1)
            .text()
            .replace(/\s*/g, ''),
          guo_ji_gong_bu: tdArr.eq(5).children('td')
            .eq(3)
            .text()
            .replace(/\s*/g, ''),
          jin_ru_guo_jia_ri_qi: tdArr.eq(6).children('td')
            .eq(1)
            .text()
            .replace(/\s*/g, ''),
          zhuan_li_dai_li_ji_gou: tdArr.eq(7).children('td')
            .eq(1)
            .text()
            .replace(/\s*/g, ''),
          dai_li_ren: tdArr.eq(7).children('td')
            .eq(3)
            .text()
            .replace(/\s*/g, ''),
          fen_an_yuan_shen_qing_hao: tdArr.eq(8).children('td')
            .eq(1)
            .text()
            .replace(/\s*/g, ''),
          guo_shen_bian_hao: tdArr.eq(9).children('td')
            .eq(1)
            .text()
            .replace(/\s*/g, ''),
          zai_yao: tdArr.eq(10).children('td')
            .eq(1)
            .text()
            .replace(/\s*/g, ''),
          zhu_quan_xiang: tdArr.eq(11).children('td')
            .eq(1)
            .text()
            .replace(/\s*/g, ''),
          ye_shu: tdArr.eq(12).children('td')
            .eq(1)
            .text()
            .replace(/\s*/g, ''),
          zhu_fen_lei_hao: tdArr.eq(13).children('td')
            .eq(1)
            .text()
            .replace(/\s*/g, ''),
          zhuan_li_fen_lei_hao: tdArr.eq(14).children('td')
            .eq(1)
            .text()
            .replace(/\s*/g, ''),
          status: 66,
        };
        console.log(item);
        await jyrc.update('tb_100010_zhuan_li', item, {
          where: {
            id: zhuan_li.id,
          },
        });
        await initItem();
      } else {
        await jyrc.update('tb_100010_zhuan_li', {
          status: 66,
        }, {
          where: {
            id: zhuan_li.id,
          },
        });
        await initItem();

      }
    }

    const teacher = await jyrc.get('tb_100010_zhuan_li', { id: 1 });
    ctx.status = 200;
    ctx.body = teacher.html;
  }

}

module.exports = CompareController;
