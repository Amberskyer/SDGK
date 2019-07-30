'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;

  /*   (important:)   页面相关   */
  router.get('/compare/school-admission', controller.compare.schoolAdmission);// 主页=>index
  // router.get('/yzy', controller.youzy.init);// 主页=>index
  router.get('/zsgk', controller.zsgk.init);// 主页=>index
  // router.get('/zsgk/school', controller.zsgk.loadSchool);// 主页=>index
  // router.get('/zsgk/init/school/admisson/table', controller.zsgk.initSchoolAdmissionTable);// 主页=>index
  // router.get('/zsgk/load/school/admisson/json', controller.zsgk.loadSchoolAdmission);// 主页=>index
  // router.get('/zsgk/init/school/major/admisson/table', controller.zsgk.initSchoolMajorAdmissionTable);// 主页=>index



};
