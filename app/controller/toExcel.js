// 'use strict';
// const Controller = require('../care/base_controller');
// const xlsx = require('node-xlsx');
// const fs = require('fs');
//
//
// class CompareController extends Controller {
//
//   constructor(ctx) {
//     super(ctx);
//     this.schoolList = null;
//   }
//
//
//   async index() {
//
//     const { ctx, app } = this;
//     const information_schema = app.mysql.get('information_schema');
//
//     const excelDataArr = [];
//       const information_schema = await information_schema.get('lun_wen_detail', { id: 26843 });
//
//     const buffer = xlsx.build([
//       {
//         name: 'sheet1',
//         data,
//       },
//     ]);
//
//     // 将文件内容插入新的文件中
//     fs.writeFileSync('test1.xlsx', buffer, { flag: 'w' });
//   }
//
// }
//
// module.exports = CompareController;
//
