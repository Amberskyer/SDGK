'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;

  /*   (important:)   页面相关   */
  // router.get('/compare/school-admission', controller.compare.schoolAdmission);// 主页=>index
  // router.get('/test', controller.test.index);// 主页=>index
  // router.get('/toExcel', controller.toExcel.index);// 主页=>index
  // router.get('/bkzy/load-school', controller.bkzy.loadSchool);// 主页=>index
  // router.get('/bkzy/init_school_admission_table', controller.bkzy.initSchoolAdmissionTable);// 主页=>index
  // router.get('/bkzy/load_school_admission_html', controller.bkzy.loadSchoolAdmission);// 主页=>index
  // router.get('/bkzy/check_school_admission_data', controller.bkzy.checkSchoolAdmissionData);// 主页=>index
  // router.get('/zsgk/load-school', controller.zsgk.loadSchool);// 主页=>index
  // router.get('/zsgk/init-school-major', controller.zsgk.initSchoolMajorAdmissionTable);// 主页=>index
  // router.get('/zsgk/load-school-major', controller.zsgk.loadSchoolMajorAdmission);// 主页=>index
  // router.get('/wmzy/load-school', controller.wmzy.loadSchool);// 主页=>index
  // router.get('/wmzy/load-major', controller.wmzy.loadMajor);// 主页=>index
  // router.get('/wmzy/init-major-admission', controller.wmzy.initMajorAdmissionTable);// 主页=>index
  // router.get('/wmzy/load-major-admission', controller.wmzy.loadMajorAdmission);// 主页=>index
  // router.get('/initIes', controller.transform.initIes);// 主页=>index
  // router.get('/initPaperJournal', controller.transform.initPaperJournal);// 主页=>index
  // router.get('/drm', controller.drm.toExcel);// 主页=>index
  // router.get('/yzy', controller.youzy.init);// 主页=>index
  // router.get('/yzy/init-school-major-admission-table', controller.youzy.initSchoolMajorAdmissionTable);// 主页=>index
  // router.get('/yzy/load-school-major-admission', controller.youzy.startLoadSchoolMajorAdmission);// 主页=>index
  router.get('/yzy/init-school-major-admission', controller.youzy.initSchoolMajorAdmission);// 主页=>index
  // router.get('/zsgk', controller.zsgk.init);// 主页=>index
  // router.get('/zw', controller.zw.init);// 主页=>index
  // router.get('/zl', controller.zl.init);// 主页=>index
  // router.get('/zl/initLunwenHtml', controller.zl.initLunwenHtml);// 主页=>index
  // router.get('/zl/loadLunwenHtml', controller.zl.loadLunwenHtml);// 主页=>index
  // router.get('/zl/initLunwen', controller.zl.initLunwen);// 主页=>index
  // router.get('/zl/loadLunwenDetailHtml', controller.zl.loadLunwenDetailHtml);// 主页=>index
  // router.get('/zl/initLunwenDetail', controller.zl.initLunwenDetail);// 主页=>index
  // router.get('/zw/checkLunwen', controller.zw.checkLunwen);// 主页=>index
  // router.get('/zw/initLunwenHtml', controller.zw.initLunwenHtml);// 主页=>index
  // router.get('/zw/loadLunwenHtml', controller.zw.loadLunwenHtml);// 主页=>index
  // router.get('/zw/initLunwen', controller.zw.initLunwen);// 主页=>index
  // router.get('/zw/getlunwenGx', controller.zw.getlunwenGx);// 主页=>index
  // router.get('/zw/loadLunwenDetailHtml', controller.zw.loadLunwenDetailHtml);// 主页=>index
  // router.get('/zw/initLunwenDetailHtml', controller.zw.initLunwenDetailHtml);// 主页=>index
  // router.get('/zw/lunwen/:person_id/:page', controller.zw.lunwenShow);// 主页=>index
  // router.get('/jyrc', controller.jyrc.init);// 主页=>index
  // router.get('/jyrc/init/excel', controller.jyrc.initExcel);// 主页=>index
  // router.get('/read', controller.reader.init);// 主页=>index
  // router.get('/zsgk/school', controller.zsgk.loadSchool);// 主页=>index
  // router.get('/zsgk/init/school/admisson/table', controller.zsgk.initSchoolAdmissionTable);// 主页=>index
  // router.get('/zsgk/load/school/admisson/json', controller.zsgk.loadSchoolAdmission);// 主页=>index
  // router.get('/zsgk/init/school/major/admisson/table', controller.zsgk.initSchoolMajorAdmissionTable);// 主页=>index


};
