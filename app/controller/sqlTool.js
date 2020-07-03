'use strict';
const MD5 = require('md5-node');
const fs = require('fs');
const Controller = require('../care/base_controller');
const SchoolListJson = require('../data/rest.json');
const qs = 'qs';

/**
 * @controller 第三方 组别接口
 */
class SqlToolController extends Controller {

  constructor(ctx) {
    super(ctx);
  }


  async addProvinceTable() {

    const { ctx } = this;
    const provinceList = await ctx.kkModel.Province.findAll({
      where: {
        status: {
          // $notIn: [ 404 ],
        },
      },
    });

    let sqlStr = '';
    for (let i = 0; i < provinceList.length; i++) {

      await initItem(provinceList[i]);
    }

    console.log(sqlStr);
    fs.writeFileSync('provinceRateForResTableSql.sql', Buffer.from(sqlStr), { flag: 'w' });


    // initItem('四川');

    async function initItem(provinceInfo) {
      sqlStr = sqlStr + `
                CREATE TABLE \`rate_${provinceInfo.pin_yin}_data\` (
                  \`id\` int(11) NOT NULL AUTO_INCREMENT,
                  \`school_id\` int(11) DEFAULT NULL,
                  \`college\` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
                  \`aos\` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
                  \`batch\` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
                  \`location\` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
                  \`year\` int(11) DEFAULT NULL,
                  \`score\` int(11) DEFAULT NULL,
                  \`student_rank\` int(11) DEFAULT NULL,
                  \`rate\` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
                  \`risky\` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
                  \`r_rank\` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
                  \`r_rate\` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
                  \`low_rank\` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
                  \`low_score\` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
                  \`status\` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT '-1',
                  \`r_school_id\` int(11) DEFAULT NULL,
                  \`r_province_id\` int(11) DEFAULT NULL,
                  \`r_subject_type\` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
                  \`r_batch_id\` int(11) DEFAULT NULL,
                  PRIMARY KEY (\`id\`) USING BTREE,
                  KEY \`id\` (\`id\`) USING BTREE,
                  KEY \`college\` (\`college\`) USING BTREE,
                  KEY \`location\` (\`location\`) USING BTREE,
                  KEY \`status\` (\`status\`) USING BTREE,
                  KEY \`aos\` (\`aos\`),
                  KEY \`rate\` (\`rate\`),
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

  async updateResRate() {

    const { ctx } = this;
    const provinceList = await ctx.kkModel.Province.findAll({
      where: {
        status: {
          $notIn: [ 404 ],
        },
      },
    });

    let sqlStr = '';
    for (let i = 0; i < provinceList.length; i++) {

      await initItem(provinceList[i]);
    }

    console.log(sqlStr);
    fs.writeFileSync('provinceRateForResTableSql.sql', Buffer.from(sqlStr), { flag: 'w' });


    // initItem('四川');

    async function initItem(provinceInfo) {
      sqlStr = sqlStr + `
                UPDATE tb_gk_rank_rates_${provinceInfo.r_province_id}
                SET rank_rate=99
                WHERE rank_begin=1 and rank_rate <> 99 and rank_end>=1000;
                          `;
    }
  }

  async addProvinceRateResTable() {

    const { ctx } = this;
    const provinceList = await ctx.kkModel.Province.findAll({
      where: {
        // status: {
        // $notIn: [ 404 ],
        // },
      },
    });

    let sqlStr = '';
    for (let i = 0; i < provinceList.length; i++) {

      await initItem(provinceList[i]);
    }

    console.log(sqlStr);
    fs.writeFileSync('provinceRateForResTableSql.sql', Buffer.from(sqlStr), { flag: 'w' });


    // initItem('四川');

    async function initItem(provinceInfo) {
      sqlStr = sqlStr + `
                CREATE TABLE \`tb_gk_rank_rates_${provinceInfo.r_province_id}\` (
                \`id\` bigint(20) NOT NULL AUTO_INCREMENT,
                \`school_id\` varchar(36) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
                \`major_id\` varchar(36) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
                \`batch_id\` int(11) DEFAULT NULL,
                \`subject_type\` varchar(16) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
                \`province_id\` int(10) DEFAULT NULL,
                \`rank_begin\` int(10) DEFAULT NULL,
                \`rank_end\` int(10) DEFAULT NULL,
                \`rank_rate\` int(10) DEFAULT NULL,
                PRIMARY KEY (\`id\`) USING BTREE,
                KEY \`id\` (\`id\`) USING BTREE,
                KEY \`school_id\` (\`school_id\`) USING BTREE,
                KEY \`batch_id\` (\`batch_id\`) USING BTREE,
                KEY \`subject_type\` (\`subject_type\`) USING BTREE,
                KEY \`province_id\` (\`province_id\`) USING BTREE,
                KEY \`rank_begin\` (\`rank_begin\`) USING BTREE,
                KEY \`rank_end\` (\`rank_end\`) USING BTREE,
                KEY \`rank_rate\` (\`rank_rate\`) USING BTREE
              ) ENGINE=InnoDB AUTO_INCREMENT=4273658 DEFAULT CHARSET=utf8;
                          `;
    }
  }


  async initProvinceId() {

    const { ctx } = this;
    const provinceList = await ctx.kkModel.Province.findAll({
      where: {
        status: {
          $notIn: [ 404 ],
        },
      },
    });

    let sqlStr = '';
    for (let i = 0; i < provinceList.length; i++) {

      await initItem(provinceList[i]);
    }

    console.log(sqlStr);
    fs.writeFileSync('provinceRateUpdateSql.text', Buffer.from(sqlStr), { flag: 'w' });


    // initItem('四川');

    async function initItem(provinceInfo) {
      // sqlStr = sqlStr + `
      //                   UPDATE \`rate_${provinceInfo.pin_yin}\`
      //                     SET r_province_id=${provinceInfo.r_province_id}
      //                     WHERE location='${provinceInfo.province_name}';
      //                     `;

      // sqlStr = sqlStr + `
      //                   UPDATE \`rate_${provinceInfo.pin_yin}\`
      //                     SET r_subject_type = 'LI'
      //                     WHERE
      //                     \taos = '理科';
      //
      //                     UPDATE \`rate_${provinceInfo.pin_yin}\`
      //                     SET r_subject_type = 'WEN'
      //                     WHERE
      //                     \taos = '文科';
      //
      //                     `;

      sqlStr = sqlStr + `
            UPDATE rate_${provinceInfo.pin_yin}
            SET r_rate=floor(rate*100)
            WHERE rate is not null;
        `;
    }
  }


  async addRateProvinceSql() {
    const { ctx } = this;
    const provinceList = await ctx.kkModel.Province.findAll();
    for (let i = 0; i < provinceList.length; i++) {
      const provinceListItem = provinceList[i];
      const RateSqlStr = await fs.readFileSync('.\\app\\model\\kk\\tb_gk_rank_rates.js');
      console.log(RateSqlStr.toString());
      const sqlStr = RateSqlStr.toString().replace(/'tb_gk_rank_rates'/g, `'tb_gk_rank_rates_${provinceListItem.r_province_id}'`);
      await fs.writeFileSync(`.\\app\\model\\kk\\tb_gk_rank_rates_${provinceListItem.r_province_id}.js`, sqlStr);
    }
  }

}


module.exports = SqlToolController;
