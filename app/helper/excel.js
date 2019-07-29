'use strict'
const xlsx = require('node-xlsx');
const fs = require('fs');
// 读取文件内容
const obj = xlsx.parse('test.xlsx');
const excelObj = obj[0].data;

const data = [];
for (const i in excelObj) {
  const arr = [];
  const value = excelObj[i];
  for (const j in value) {
    arr.push(value[j]);
  }
  data.push(arr);
}

// 将文件内容插入新的文件中
fs.writeFileSync('test1.json', JSON.stringify(data), { flag: 'w' });
