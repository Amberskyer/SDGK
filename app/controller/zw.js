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
      const teacher = await jyrc.get('tb_100000_yan_jiu_ren_yuan', { id: num });
      if (teacher) {

        const url = 'https://kns.cnki.net/kns/request/SearchHandler.ashx';
        const params = {
          action: '',
          NaviCode: '*',
          ua: '1.21',
          isinEn: 1,
          PageName: 'ASP.brief_result_aspx',
          DbPrefix: 'SCDB',
          DbCatalog: '中国学术文献网络出版总库',
          ConfigFile: 'SCDB.xml',
          db_opt: 'CJFQ,CDFD,CMFD,CPFD,IPFD,CCND,CCJD',
          au_1_sel: 'AU',
          au_1_sel2: 'AF',
          au_1_value1: teacher.xing_ming,
          au_1_value2: teacher.xue_xiao,
          au_1_special1: '=',
          au_1_special2: '%',
          his: 0,
          __: 'Wed Sep 04 2019 11:45:21 GMT+0800 (中国标准时间)',
        };
        const referer = 'https://kns.cnki.net/kns/brief/result.aspx?dbprefix=SCDB&crossDbcodes=CJFQ,CDFD,CMFD,CPFD,IPFD,CCND,CCJD';
        await ctx.basePost(url, params, cookie, referer);
        const url2 = 'https://kns.cnki.net/kns/brief/brief.aspx?pagename=ASP.brief_result_aspx&isinEn=1&dbPrefix=SCDB&dbCatalog=%e4%b8%ad%e5%9b%bd%e5%ad%a6%e6%9c%af%e6%96%87%e7%8c%ae%e7%bd%91%e7%bb%9c%e5%87%ba%e7%89%88%e6%80%bb%e5%ba%93&ConfigFile=SCDB.xml&research=off&t=1568165876825&keyValue=&S=1&sorttype=&DisplayMode=custommode';// // const referer = 'https://kns.cnki.net/kns/brief/brief.aspx?pagename=ASP.brief_result_aspx&isinEn=1&dbPrefix=SCDB&dbCatalog=%e4%b8%ad%e5%9b%bd%e5%ad%a6%e6%9c%af%e6%96%87%e7%8c%ae%e7%bd%91%e7%bb%9c%e5%87%ba%e7%89%88%e6%80%bb%e5%ba%93&ConfigFile=SCDB.xml&research=off&t=1567582977022&keyValue=&S=1&sorttype=';
        const result = await ctx.baseGet(url2, {}, cookie2, null);
        const $ = cheerio.load(result.data);
        let totalNum = $('#lbPagerTitle')[0].next.data;
        const patt1 = new RegExp('找到 ', 'g');
        const patt2 = new RegExp(' 条结果', 'g');
        totalNum = totalNum.replace(patt1, '');
        totalNum = totalNum.replace(patt2, '');
        console.log(totalNum);
        await jyrc.insert('lun_wens', {
          name: teacher.xing_ming,
          school: teacher.xue_xiao,
          person_id: teacher.id,
          html: result.data,
          num: parseInt(totalNum),
        });
        await jyrc.update('tb_100000_yan_jiu_ren_yuan', { lun_wen_status: 1 }, {
          where: {
            id: teacher.id,
          },
        });
        num++;
        await initItem();
      }
    }
    const teacher = await jyrc.get('lun_wens', { id: 1 });
    const $ = cheerio.load(teacher.html);
    console.log($('font.Mark').parent().eq(0)
      .text());
    ctx.status = 200;
    ctx.body = teacher.html;
  }


  async initLunwenHtml() {
    const { ctx, app } = this;
    const jyrc = app.mysql.get('jyrc');
    let num = 1;

    initItem();
    async function initItem() {
      const teacher = await jyrc.get('lun_wens', { status: 22 });
      if (teacher) {
        const $ = cheerio.load(teacher.html);
        const totalNum = teacher.num;
        for (let i = 1; i <= Math.ceil(totalNum / 20); i++) {
          if (i === 1) {
            await jyrc.insert('lun_wen', {
              // name: teacher.xing_ming,
              // school: teacher.xue_xiao,
              person_id: teacher.id,
              // html: teacher.data,
              url: 'https://kns.cnki.net/kns/brief/brief.aspx?pagename=ASP.brief_result_aspx&isinEn=1&dbPrefix=SCDB&dbCatalog=%e4%b8%ad%e5%9b%bd%e5%ad%a6%e6%9c%af%e6%96%87%e7%8c%ae%e7%bd%91%e7%bb%9c%e5%87%ba%e7%89%88%e6%80%bb%e5%ba%93&ConfigFile=SCDB.xml&research=off&t=1568165876825&keyValue=&S=1&sorttype=&DisplayMode=custommode',
              // // const referer = 'https://kns.cnki.net/kns/brief/brief.aspx?pagename=ASP.brief_result_aspx&isinEn=1&dbPrefix=SCDB&dbCatalog=%e4%b8%ad%e5%9b%bd%e5%ad%a6%e6%9c%af%e6%96%87%e7%8c%ae%e7%bd%91%e7%bb%9c%e5%87%ba%e7%89%88%e6%80%bb%e5%ba%93&ConfigFile=SCDB.xml&research=off&t=1567582977022&keyValue=&S=1&sorttype=';
              html: teacher.html,
              page: 1,
              num: parseInt(totalNum),
            });
          } else {

            let url = 'https://kns.cnki.net/kns/brief/brief.aspx' + $('.TitleLeftCell a')[0].attribs.href;
            const patt1 = new RegExp('curpage=2', 'g');
            url = url.replace(patt1, 'curpage=' + i);
            await jyrc.insert('lun_wen', {
              person_id: teacher.id,
              url,
              page: i,
              num: parseInt(totalNum),
            });
          }

        }
        await jyrc.update('lun_wens', { status: 66 }, {
          where: {
            id: teacher.id,
          },
        });
        console.log({ num });
        num++;
        await initItem();
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
      const teacher = await jyrc.get('lun_wen', { status: 33 });
      const pearson = await jyrc.get('tb_100000_yan_jiu_ren_yuan', { id: teacher.person_id });

      const url = 'https://kns.cnki.net/kns/request/SearchHandler.ashx';
      const params = {
        action: '',
        NaviCode: '*',
        ua: '1.21',
        isinEn: 1,
        PageName: 'ASP.brief_result_aspx',
        DbPrefix: 'SCDB',
        DbCatalog: '中国学术文献网络出版总库',
        ConfigFile: 'SCDB.xml',
        db_opt: 'CJFQ,CDFD,CMFD,CPFD,IPFD,CCND,CCJD',
        au_1_sel: 'AU',
        au_1_sel2: 'AF',
        au_1_value1: pearson.xing_ming,
        au_1_value2: pearson.xue_xiao,
        au_1_special1: '=',
        au_1_special2: '%',
        his: 0,
        __: 'Wed Sep 04 2019 11:45:21 GMT+0800 (中国标准时间)',
      };
      const referer = 'https://kns.cnki.net/kns/brief/result.aspx?dbprefix=SCDB&crossDbcodes=CJFQ,CDFD,CMFD,CPFD,IPFD,CCND,CCJD';
      await ctx.basePost(url, params, cookie2, referer);
      const url2 = teacher.url;
      // const url2 = 'https://kns.cnki.net/kns/brief/brief.aspx?pagename=ASP.brief_result_aspx&isinEn=1&dbPrefix=SCDB&dbCatalog=%e4%b8%ad%e5%9b%bd%e5%ad%a6%e6%9c%af%e6%96%87%e7%8c%ae%e7%bd%91%e7%bb%9c%e5%87%ba%e7%89%88%e6%80%bb%e5%ba%93&ConfigFile=SCDB.xml&research=off&t=1568165876825&keyValue=&S=1&sorttype=&DisplayMode=custommode';// // const referer = 'https://kns.cnki.net/kns/brief/brief.aspx?pagename=ASP.brief_result_aspx&isinEn=1&dbPrefix=SCDB&dbCatalog=%e4%b8%ad%e5%9b%bd%e5%ad%a6%e6%9c%af%e6%96%87%e7%8c%ae%e7%bd%91%e7%bb%9c%e5%87%ba%e7%89%88%e6%80%bb%e5%ba%93&ConfigFile=SCDB.xml&research=off&t=1567582977022&keyValue=&S=1&sorttype=';

      const result = await ctx.baseGet(url2, {}, cookie, null);
      console.log('id', pearson.id);
      await jyrc.update('lun_wen', {
        html: result.data,
        status: 11,
      }, {
        where: {
          id: teacher.id,
        },
      });
      // await jyrc.update('tb_100000_yan_jiu_ren_yuan', { status: 1 }, {
      //   where: {
      //     id: pearson.id,
      //   },
      // });
      await initItem();
    }
    const teacher = await jyrc.get('lun_wen', { person_id: 6, page: 2 });
    const $ = cheerio.load(teacher.html);
    console.log(teacher.url);
    console.log($('font.Mark').parent().eq(0)
      .text());
    ctx.status = 200;
    ctx.body = teacher.html;
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
      const teacher = await jyrc.get('lun_wen', { status: 66 });
      const $ = cheerio.load(teacher.html);
      for (let i = 0; i < 20; i++) {
        const item = {
          lun_wen_biao_ti: null,
          qi_ta_zuo_zhe: null,
          di_yi_zuo_zhe: teacher.name,
          zuo_zhe_dan_wei: teacher.school,
          kan_wu__hui_yi_ming: null,
          chu_ban_nian_fen: null,
          fa_biao_tu_jing: null,
          bei_yin_shu: null,
          bei_xia_zai: null,
          sort: null,
          url: null,
          yan_jiu_ren_yuan_id: teacher.person_id,
          zai_yao: null,
          kan_wu__hui_yi_ri_qi: null,
        };
        if ($('div.GridRightColumn h3.title_c a').eq(i) && $('div.GridRightColumn h3.title_c a').eq(i).text()
          .replace(/\s*/g, '') !== '') {
          item.sort = (parseInt(teacher.page) - 1) * 20 + i + 1;
          item.lun_wen_biao_ti = $('div.GridRightColumn div.GridTitleDiv').eq(i).find('a')
            .eq(0)
            .text()
            .replace(/\s*/g, '');
          item.url = $('div.GridRightColumn div.GridTitleDiv').eq(i).find('h3.title_c a')
            .eq(0)
            .attr('href');
          item.qi_ta_zuo_zhe = $('div.GridRightColumn div.GridContentDiv').eq(i).find('div.detailinfo_c span.author')
            .eq(0)
            .text();
          item.kan_wu__hui_yi_ming = $('div.GridRightColumn div.GridContentDiv').eq(i).find('div.detailinfo_c span.journal')
            .eq(0)
            .text()
            .replace(/\s*/g, '');
          item.chu_ban_nian_fen = $('div.GridRightColumn div.GridContentDiv').eq(i).find('div.detailinfo_c span.pubdate')
            .eq(0)
            .text()
            .replace(/\s*/g, '');
          item.fa_biao_tu_jing = $('div.GridRightColumn div.GridContentDiv').eq(i).find('div.detailinfo_c span.database')
            .eq(0)
            .text()
            .replace(/\s*/g, '');
          item.bei_yin_shu = $('div.GridRightColumn div.GridContentDiv').eq(i).find('div.DetailNum  label a')
            .eq(0)
            .text()
            .replace(/\s*/g, '');
          item.bei_xia_zai = $('div.GridRightColumn div.GridContentDiv').eq(i).find('div.DetailNum span.downloadCount')
            .eq(0)
            .text()
            .replace(/\s*/g, '');
          item.zai_yao = $('div.GridRightColumn div.GridContentDiv').eq(i).find(' p.abstract_c')
            .eq(0)
            .text()
            .replace(/\s*/g, '');
          item.kan_wu__hui_yi_ri_qi = $('div.GridRightColumn div.GridContentDiv').eq(i).find('  div.DetailNum label')
            .last()
            .text()
            .replace(/\s*/g, '');
          console.log(i, item);
          await jyrc.insert('tb_100007_lun_wen', item);
        }
      }
      console.log(teacher.id);
      await jyrc.update('lun_wen', {
        status: 22,
      }, {
        where: {
          id: teacher.id,
        },
      });
      await initItem();
    }
    const teacher = await jyrc.get('lun_wen', { person_id: 2130 });
    const $ = cheerio.load(teacher.html);
    const tdArr = $('div.GridSingleRow div.GridRightColumn').eq(0).find('h3.title_c a')
      .first()
      .text();
    console.log(tdArr);
    ctx.status = 200;
    ctx.body = teacher.html;

  }

  async getlunwenGx() {
    const { ctx, app } = this;
    const jyrc = app.mysql.get('jyrc');

    initItem();
    async function initItem() {
      const lunwen = await jyrc.get('tb_100007_lun_wen', { status: 44 });
      console.log(lunwen);
      const pearson = await jyrc.get('tb_100000_yan_jiu_ren_yuan', { id: lunwen.yan_jiu_ren_yuan_id });
      console.log(pearson);
      let zzStr = lunwen.qi_ta_zuo_zhe;
      if (zzStr) {
        const patt1 = new RegExp(',', 'g');
        const patt2 = new RegExp('，', 'g');
        const patt3 = new RegExp('；', 'g');
        zzStr = zzStr.replace(patt1, ';');
        zzStr = zzStr.replace(patt2, ';');
        zzStr = zzStr.replace(patt3, ';');

        const zzArr = zzStr.split(';');
        zzArr.forEach(async (item, index) => {
          item = item.replace(/\s*/g, '');
          if (item === '') {
            return;
          }
          if (item.indexOf(pearson.xing_ming) != '-1') {
            item = pearson.xing_ming;
          }
          const hzzPerson = await jyrc.get('tb_100000_yan_jiu_ren_yuan', { xing_ming: item, xue_xiao: pearson.xue_xiao });

          if (index === 0) {
            await jyrc.update('tb_100007_lun_wen', {
              di_yi_zuo_zhe: item,
            }, {
              where: {
                id: lunwen.id,
              },
            });
          }
          if (item !== pearson.xing_ming) {
            const gxItem = {
              yan_jiu_ren_yuan_id: lunwen.yan_jiu_ren_yuan_id,
              he_zuo_zhe: item,
              lun_wen_id: lunwen.id,
              lun_wen_biao_ti: lunwen.lun_wen_biao_ti,
              order: index + 1,
              xue_xiao: pearson.xue_xiao,
              he_zuo_zhe_id: hzzPerson ? hzzPerson.id : null,
              is_yan_jiu_ren_yuan: 0,
            };
            await jyrc.insert('tb_100015_lun_wen_xie_zuo', gxItem);
          } else if (item === pearson.xing_ming) {
            const gxItem = {
              yan_jiu_ren_yuan_id: lunwen.yan_jiu_ren_yuan_id,
              he_zuo_zhe: item,
              lun_wen_id: lunwen.id,
              lun_wen_biao_ti: lunwen.lun_wen_biao_ti,
              order: index + 1,
              xue_xiao: pearson.xue_xiao,
              he_zuo_zhe_id: hzzPerson ? hzzPerson.id : null,
              is_yan_jiu_ren_yuan: 1,
            };
            await jyrc.insert('tb_100015_lun_wen_xie_zuo', gxItem);
          }
        });
      }
      await jyrc.update('tb_100007_lun_wen', {
        status: 66,
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
      const lun_wen = await jyrc.get('lun_wen_detail', { status: 66 });
      const urlParam = querystring.parse(lun_wen.url);
      const params = {
        dbcode: urlParam.DbCode,
        dbname: urlParam.DbName,
        filename: urlParam.FileName,
        uid: null,
        v: null,
      };
      const url = 'https://kns.cnki.net/KCMS/detail/detail.aspx?' + qs.stringify(params);
      console.log(lun_wen.id);
      console.log(url);
      const result = await ctx.baseGet(url, {}, cookie, null);
      // console.log(result.data);

      await jyrc.update('lun_wen_detail', {
        html: result.data,
        status: 22,
      }, {
        where: {
          id: lun_wen.id,
        },
      });
      await initItem();
    }
    const teacher = await jyrc.get('lun_wen_detail', { id: 26843 });
    ctx.status = 200;
    ctx.body = teacher.html;
  }

  async initLunwenDetailHtml() {
    const { ctx, app } = this;
    const jyrc = app.mysql.get('jyrc');

    initItem();
    async function initItem() {
      const lun_wen = await jyrc.get('lun_wen_detail', { status: 22 });

      const $ = cheerio.load(lun_wen.html);
      const item = {
        guan_jian_ci: $('#catalog_KEYWORD').parent().text()
          .replace(/\s*/g, ''),
        fen_lei_hao: $('#catalog_ZTCLS').parent().text()
          .replace(/\s*/g, ''),
        kan_wu__hui_yi_ming: $('.sourinfo p.title').eq(0).text()
          .replace(/\s*/g, ''),
        qi_kan_ying_wen_ming: $('.sourinfo p:nth-child(2) ').text()
          .replace(/\s*/g, ''),
        qi_kan_lei_xing: $('.sourinfo p:nth-child(5) ').text()
          .replace(/\s*/g, ''),
        // qi_kan_logo: $('#jpic').next(),
        chu_ban_nian_fen: $('.sourinfo p:nth-child(3) ').text()
          .replace(/\s*/g, ''),
        qi_kan_iss: $('.sourinfo p:nth-child(4) ').text()
          .replace(/\s*/g, ''),
      };
      console.log(item);

      await jyrc.update('tb_100007_lun_wen', item, {
        where: {
          id: lun_wen.id,
        },
      });
      await jyrc.update('lun_wen_detail', {
        status: 888,
      }, {
        where: {
          id: lun_wen.id,
        },
      });
      await initItem();
    }
    const teacher = await jyrc.get('lun_wen_detail', { id: 26843 });
    ctx.status = 200;
    ctx.body = teacher.html;

  }


}

module.exports = CompareController;
