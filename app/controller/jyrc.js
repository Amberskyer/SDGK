'use strict';
const Controller = require('../care/base_controller');
const fs = require('fs');
const xlsx = require('node-xlsx');


class CompareController extends Controller {

  constructor(ctx) {
    super(ctx);
    this.schoolList = null;
  }


  async init() {
    const { ctx, app } = this;
    const jyrc = app.mysql.get('jyrc');
    const pyArr = await jyrc.select('tb_pinyins', { // 搜索 post 表
      // where: { id: 1 }, // WHERE 条件
      // columns: [ 'author', 'title' ], // 要查询的表字段
      // orders: [[ 'year', 'desc' ]], // 排序方式
    });

    // 读取文件内容
    const obj = await xlsx.parse('./app/public/jyrc.xlsx');

    let sqlStr = '';
    obj.forEach((objDataItem, index) => {
      let keyStr = '';
      if (objDataItem.name !== '高校与研究机构') {
        objDataItem.data.forEach((item, index) => {
          if (index === 0) {
            return;
          }
          let key = item[0];
          const comment = item[1] ? (item[0] + ':' + item[1]) : item[0];
          if (key) {
            pyArr.forEach(item2 => {

              const patt = new RegExp(item2.hanzi, 'g');
              key = key.replace(patt, item2.pinyin + '_');
            });
            // 符号转义
            const patt = new RegExp('\/', 'g');
            key = key.replace(patt, '_');
            key = key.toLocaleLowerCase();
            key = key.substring(0, key.length - 1);
            if (comment) {
              keyStr = keyStr + `\`${key}\` text (255) DEFAULT NULL COMMENT \'${comment}\',`;
            } else {
              keyStr = keyStr + `\`${key}\` text (255) DEFAULT NULL ,`;
            }

          }
        });
        let title = objDataItem.name;
        pyArr.forEach(item2 => {
          const patt = new RegExp(item2.hanzi, 'g');
          title = title.replace(patt, item2.pinyin + '_');
        });
        title = title.substring(0, title.length - 1);
        const num = index < 10 ? ('0' + index) : index;
        title = 'tb_1000' + num + '_' + title;
        const sqlStrItem = `DROP TABLE IF EXISTS \`${title}\`;
                        CREATE TABLE \`${title}\` (
                          \`id\` int(11) NOT NULL AUTO_INCREMENT,
                          PRIMARY KEY (\`id\`),
                          ${keyStr}
                          KEY \`id\` (\`id\`)
                        ) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8;`;
        sqlStr = sqlStr + `
        ` + sqlStrItem;
      }
    });
    ctx.status = 200;
    ctx.body = sqlStr;
  }


  async initExcel() {
    const { ctx, app } = this;
    const jyrc = app.mysql.get('jyrc');
    // 读取文件内容
    const obj = await xlsx.parse('./app/public/科研大数据(最新).xlsx');
    const teacherArr = obj[0].data;
    const result = [];
    teacherArr[1].forEach(async (item, index) => {
      // if (index === 3) {
      //   const jyrcItem = {
      //     id: index - 2,
      //     xing_ming: teacherArr[1][index],
      //     xing_bie: teacherArr[2][index],
      //     zhi_cheng: teacherArr[3][index],
      //     ren_cai_ji_hua_he_xue_shu_tou_xian: teacherArr[10][index],
      //     huo_jiang: teacherArr[13][index],
      //   };
      //   result.push(teacherArr);
      //   // console.log(teacherArr);
      //   await jyrc.insert('tb_100000_yan_jiu_ren_yuan', jyrcItem);
      // }
      if (index >= 3) {
        const jyrcItem = {
          id: index - 2,
          xue_xiao_yan_jiu_ji_gou: teacherArr[4][index],
          yuan_xi__yan_jiu_shi: teacherArr[5][index], // 院系/研究室
          xue_ke_zhuan_ye: teacherArr[6][index], // 学科专业
          ke_yan_ping_tai: teacherArr[7][index], // 科研平台
          yan_jiu_fang_xiang: teacherArr[8][index], // 研究方向
          qi_shi_gong_zuo_shi_jian: teacherArr[9][index], // 起始工作时间
          yan_jiu_ren_yuan_id: index - 2, // 起始工作时间
        };
        result.push(jyrcItem);
        console.log(jyrcItem);
        await jyrc.insert('tb_100014_gong_zuo_jing_li', jyrcItem);
      }
    });
    ctx.status = 200;
    ctx.body = result;

  }


}


module.exports = CompareController;
