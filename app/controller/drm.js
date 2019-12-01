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
    this.cookie = 'Ecp_ClientId=5191129184101813420; Ecp_IpLoginFail=19112927.17.105.240; ASP.NET_SessionId=h1zii3qeqmx0u53j2ycuq1ji; SID_kns=123116; SID_klogin=125143; SID_kns_new=123119; KNS_SortType=; RsPerPage=20; SID_krsnew=125133; cnkiUserKey=309e9733-3a0f-66e0-9ca0-cd912b92bd7f; KNS_DisplayModel=custommode@SCDB; SID_kcms=124104; _pk_ref=%5B%22%22%2C%22%22%2C1575043871%2C%22https%3A%2F%2Fwww.cnki.net%2F%22%5D; _pk_ses=*';

    this.lunwenKeyArr = [ 'biao_ti', 'yu_zhong', 'fa_biao_tu_jing', 'hui_yi_ming', 'kan_wu_hui_yi_ri_qi',
      'kan_wu_hui_yi_ming', 'chu_ban_nian_fen', 'qi_shi_ye_ma', 'zhong_zhi_ye_ma', 'ye_shu',
      'di_yi_zuo_zhe', 'di_yi_zuo_zhe_dan_wei', 'tong_xun_zuo_zhe', 'tong_xun_zuo_zhe_dan_wei', 'qi_ta_zuo_zhe',
      'yan_jiu_fang_xiang', 'guan_jian_ci', 'zhai_yao', 'lun_wen_shu_ju_ku', 'can_kao_wen_xian',
      'bei_yin_ming_xi', 'bei_yin_shu', 'suo_huo_xiang_mu_zi_zhu', 'url', 'fen_lei_hao' ];
  }

  async init() {
    const { ctx, app } = this;
    const jyrc = app.mysql.get('jyrc');
    const cookie = this.cookie;
    await initItem();
    async function initItem() {
      const teacher = await jyrc.get('tb_100000_yan_jiu_ren_yuan', { status: 0 });
      if (!teacher) {
        return;
      }
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
      const result = await ctx.baseGet(url2, {}, cookie, null);
      const $ = cheerio.load(result.data);
      let totalNum = $('#lbPagerTitle')[0].next.data;
      const patt1 = new RegExp('找到 ', 'g');
      const patt2 = new RegExp(' 条结果', 'g');
      totalNum = totalNum.replace(patt1, '');
      totalNum = totalNum.replace(patt2, '');
      console.log(totalNum);
      await jyrc.insert('lun_wen_list_html', {
        name: teacher.xing_ming,
        school: teacher.xue_xiao,
        person_id: teacher.id,
        html: result.data,
        num: parseInt(totalNum),
      });
      await jyrc.update('tb_100000_yan_jiu_ren_yuan', { status: 1 }, {
        where: {
          id: teacher.id,
        },
      });
      await initItem();
    }
    await this.initLunwenHtml();
    ctx.status = 200;
    ctx.body = 1111;
  }


  async initLunwenHtml() {
    const { ctx, app } = this;
    const jyrc = app.mysql.get('jyrc');
    await initItem();
    async function initItem() {
      const lunwens = await jyrc.get('lun_wen_list_html', { status: 0 });
      if (lunwens) {
        const $ = cheerio.load(lunwens.html);
        const totalNum = lunwens.num;
        for (let i = 1; i <= Math.ceil(totalNum / 20); i++) {
          if (i === 1) {
            await jyrc.insert('lun_wen', {
              person_id: lunwens.person_id,
              url: 'https://kns.cnki.net/kns/brief/brief.aspx?pagename=ASP.brief_result_aspx&isinEn=1&dbPrefix=SCDB&dbCatalog=%e4%b8%ad%e5%9b%bd%e5%ad%a6%e6%9c%af%e6%96%87%e7%8c%ae%e7%bd%91%e7%bb%9c%e5%87%ba%e7%89%88%e6%80%bb%e5%ba%93&ConfigFile=SCDB.xml&research=off&t=1568165876825&keyValue=&S=1&sorttype=&DisplayMode=custommode',
              html: lunwens.html,
              page: 1,
              num: parseInt(totalNum),
            });
          } else {
            let url = 'https://kns.cnki.net/kns/brief/brief.aspx' + $('.TitleLeftCell a')[0].attribs.href;
            const patt1 = new RegExp('curpage=2', 'g');
            url = url.replace(patt1, 'curpage=' + i);
            await jyrc.insert('lun_wen', {
              person_id: lunwens.person_id,
              url,
              page: i,
              num: parseInt(totalNum),
            });
          }

        }
        await jyrc.update('lun_wen_list_html', { status: 66 }, {
          where: {
            id: lunwens.id,
          },
        });
        await initItem();
      }
    }
    await this.loadLunwenHtml();
    ctx.status = 200;
    ctx.body = 111;
  }

  async loadLunwenHtml() {
    const { ctx, app } = this;
    const jyrc = app.mysql.get('jyrc');
    const cookie = this.cookie;
    const cookie2 = this.cookie;

    await initItem();
    async function initItem() {
      const lun_wen = await jyrc.get('lun_wen', { status: 0 });
      if (!lun_wen) {
        return;
      }
      const pearson = await jyrc.get('tb_100000_yan_jiu_ren_yuan', { id: lun_wen.person_id });

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
      const url2 = lun_wen.url;
      const result = await ctx.baseGet(url2, {}, cookie, null);
      await jyrc.update('lun_wen', {
        html: result.data,
        status: 1,
      }, {
        where: {
          id: lun_wen.id,
        },
      });
      await initItem();
    }
    await this.checkLunwen();
  }

  async checkLunwen() {
    const { ctx, app } = this;
    const jyrc = app.mysql.get('jyrc');

    await initItem();
    async function initItem() {
      const lunwen = await jyrc.get('lun_wen', { status: 1 });
      if (!lunwen) {
        return;
      }
      const $ = cheerio.load(lunwen.html);
      const num = lunwen.num;
      if (parseInt(num) <= 20) {
        await jyrc.update('lun_wen', {
          status: 2,
        }, {
          where: {
            id: lunwen.id,
          },
        });
      } else if (!$('div.TitleLeftCell font.Mark')[0]) {
        await jyrc.update('lun_wen', {
          status: 3,
        }, {
          where: {
            id: lunwen.id,
          },
        });
      } else {
        const pageA = $('div.TitleLeftCell font.Mark')[0].children[0].data;
        const pageB = lunwen.page;

        if (parseInt(num) > 20 && parseInt(pageA) === parseInt(pageB)) {
          await jyrc.update('lun_wen', {
            status: 2,
          }, {
            where: {
              id: lunwen.id,
            },
          });
        } else {
          await jyrc.update('lun_wen', {
            status: 3,
          }, {
            where: {
              id: lunwen.id,
            },
          });

        }
      }

      await initItem();

    }

    await initItem2();
    async function initItem2() {
      const lunwen = await jyrc.get('lun_wen', { status: 2 });
      if (!lunwen) {
        return;
      }
      const person = await jyrc.get('tb_100000_yan_jiu_ren_yuan', { id: lunwen.person_id });
      const $ = cheerio.load(lunwen.html);

      const name1 = person.xing_ming;
      const name2 = $('font.Mark').eq(0)
        .text();
      if (name2 && name2.replace(/\s*/g, '').toUpperCase() === name1.replace(/\s*/g, '').toUpperCase()) {
        await jyrc.update('lun_wen', {
          html_name: null,
          status: 22,
        }, {
          where: {
            id: lunwen.id,
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
            id: lunwen.id,
          },
        });
      } else {

        await jyrc.update('lun_wen', {
          status: 44,
        }, {
          where: {
            id: lunwen.id,
          },
        });
      }
      await initItem2();
    }

    await this.initLunwen();
  }

  async initLunwen() {
    const { ctx, app } = this;
    const jyrc = app.mysql.get('jyrc');

    await initItem();
    async function initItem() {
      const lun_wen = await jyrc.get('lun_wen', { status: 22 });
      if (!lun_wen) {
        return;
      }
      const teacher = await jyrc.get('tb_100000_yan_jiu_ren_yuan', { person_id: lun_wen.person_id });
      const $ = cheerio.load(lun_wen.html);
      for (let i = 0; i < 20; i++) {
        const item = {
          biao_ti: null,
          qi_ta_zuo_zhe: null,
          di_yi_zuo_zhe: teacher.xing_ming,
          di_yi_zuo_zhe_dan_wei: teacher.xue_xiao,
          kan_wu_hui_yi_ming: null,
          chu_ban_nian_fen: null,
          fa_biao_tu_jing: null,
          bei_yin_shu: null,
          bei_xia_zai: null,
          sort: null,
          url: null,
          yan_jiu_ren_yuan_id: lun_wen.person_id,
          zai_yao: null,
          kan_wu_hui_yi_ri_qi: null,
        };
        if ($('div.GridRightColumn h3.title_c a').eq(i) && $('div.GridRightColumn h3.title_c a').eq(i).text()
          .replace(/\s*/g, '') !== '') {
          item.sort = (parseInt(teacher.page) - 1) * 20 + i + 1;
          item.biao_ti = $('div.GridRightColumn div.GridTitleDiv').eq(i).find('a')
            .eq(0)
            .text()
            .replace(/\s*/g, '');
          item.url = $('div.GridRightColumn div.GridTitleDiv').eq(i).find('h3.title_c a')
            .eq(0)
            .attr('href');
          item.qi_ta_zuo_zhe = $('div.GridRightColumn div.GridContentDiv').eq(i).find('div.detailinfo_c span.author')
            .eq(0)
            .text();
          item.di_yi_zuo_zhe_dan_wei = $('div.GridRightColumn div.GridContentDiv').eq(i).find('div.detailinfo_c span.orgn')
            .eq(0)
            .text();
          item.kan_wu_hui_yi_ming = $('div.GridRightColumn div.GridContentDiv').eq(i).find('div.detailinfo_c span.journal')
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
          item.kan_wu_hui_yi_ri_qi = $('div.GridRightColumn div.GridContentDiv').eq(i).find('  div.DetailNum label')
            .last()
            .text()
            .replace(/\s*/g, '');
          console.log(i, item);
          await jyrc.insert('lun_wen_detail', item);
        }
      }
      await jyrc.update('lun_wen', {
        status: 6,
      }, {
        where: {
          id: lun_wen.id,
        },
      });
      await initItem();
    }
    await this.loadLunwenDetailHtml();
  }

  async loadLunwenDetailHtml() {
    const { ctx, app } = this;
    const jyrc = app.mysql.get('jyrc');
    const cookie = this.cookie;

    await initBaseInfoItem();
    async function initBaseInfoItem() {
      const lun_wen = await jyrc.get('lun_wen_detail', { base_info_html_status: 0 });
      if (!lun_wen) {
        return;
      }
      const urlParam = querystring.parse(lun_wen.url);
      const params = {
        dbcode: urlParam.DbCode,
        dbname: urlParam.DbName,
        filename: urlParam.FileName,
        uid: null,
        v: null,
      };
      const url = 'https://kns.cnki.net/KCMS/detail/detail.aspx?' + qs.stringify(params);
      const result = await ctx.baseGet(url, {}, cookie, null);
      await jyrc.update('lun_wen_detail', {
        base_info_html: result.data,
        base_info_html_status: 1,
      }, {
        where: {
          id: lun_wen.id,
        },
      });
      await initBaseInfoItem();
    }

    await loadCkwxInfoData();
    async function loadCkwxInfoData() {
      const lun_wen = await jyrc.get('lun_wen_detail', { ckwx_info_html_status: 0 });
      if (!lun_wen) {
        return;
      }
      const urlParam = querystring.parse(lun_wen.url);
      const params = {
        dbcode: urlParam.DbCode,
        dbname: urlParam.DbName,
        filename: urlParam.FileName,
        RefType: 1,
        v1: null,
      };
      const url = 'https://kns.cnki.net/kcms/detail/frame/list.aspx?' + qs.stringify(params);
      const result = await ctx.baseGet(url, {}, cookie, null);
      await jyrc.update('lun_wen_detail', {
        ckwx_info_html: result.data,
        ckwx_info_html_status: 1,
      }, {
        where: {
          id: lun_wen.id,
        },
      });
      await loadCkwxInfoData();
    }
    await this.initLunwenDetailHtml();
  }

  async initLunwenDetailHtml() {
    const { ctx, app } = this;
    const jyrc = app.mysql.get('jyrc');

    await initItem();
    async function initItem() {
      const lun_wen = await jyrc.get('lun_wen_detail', { base_info_html_status: 1 });
      if (!lun_wen) {
        return;
      }
      const $ = cheerio.load(lun_wen.base_info_html);
      const item = {
        guan_jian_ci: $('#catalog_KEYWORD').parent().text()
          .replace(/\s*/g, ''),
        fen_lei_hao: $('#catalog_ZTCLS').parent().text()
          .replace(/\s*/g, ''),
        kan_wu_hui_yi_ming: $('.sourinfo p.title').eq(0).text()
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
        base_info_html_status: 2,
      };
      await jyrc.update('lun_wen_detail', item, {
        where: {
          id: lun_wen.id,
        },
      });
      await initItem();
    }
    await this.toExcel();
  }

  async toExcel() {

    const { ctx, app } = this;
    const jyrc = app.mysql.get('jyrc');
    const lunWenData = await jyrc.select('lun_wen_detail');

    console.log(lunWenData.length);

    const excelDataArr = [];
    lunWenData.forEach(item => {
      const excelDataItem = [];
      this.lunwenKeyArr.forEach(keyItem => {
        excelDataItem.push(item[keyItem]);
      });
      excelDataArr.push(excelDataItem);
    });

    console.log(excelDataArr);
    const excelHeader =
        [ '论文标题', '语种', '发表途径:期刊/会议', '会议名', '会议日期',
          '期刊名', '出版年份', '起始页码', '终止页码', '页数',
          '第一作者', '第一作者单位', '通讯作者', '通讯作者单位', '其它作者',
          '研究方向类别', '关键词', '论文摘要', '论文数据库收录', '参考文献',
          '被引明细:他引情况', '被引数:他引情况', '所获项目资助', '论文链接', '分类号' ];

    const buffer = xlsx.build([
      {
        name: '论文',
        data: [ excelHeader, ...excelDataArr ],
      },
    ]);

    // 将文件内容插入新的文件中
    fs.writeFileSync('论文.xlsx', buffer, { flag: 'w' });
  }


}

module.exports = CompareController;
