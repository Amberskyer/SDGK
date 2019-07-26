'use strict';
const { Controller } = require('egg');

class BaseController extends Controller {

  constructor(ctx) {
    super(ctx);
    this.apiHeader = ctx.app.config.apiHeader;
    this.schoolNum = null;
    this.provinceNum = null;
    this.provinceList = null;
    this.subjectTypeList = [ 'WEN', 'LI' ];
    this.yearList = [ 2016, 2017, 2018 ];
    this.batchNum = null;
    this.page = 1;
    this.pageCount = null;
    this.size = 10;
  }


  async loadSchool() {
  // ...
  }
  async loadProvince() {
    // ...
  }
  async loadSubject() {
    // ...
  }

  async loadBatch() {
    // ...
  }

  async initSchoolAdmissionTable() {
    // ...
  }

  async loadSchoolAdmission() {
    // ...
  }

  async initSchoolAdmission() {
    // ...
  }
  async initSchoolMajorAdmissionTable() {
    // ...
  }

  async loadSchoolMajorAdmission() {
    // ...
  }

  async initSchoolMajorAdmission() {
    // ...
  }

}

module.exports = BaseController;
