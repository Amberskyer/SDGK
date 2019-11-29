'use strict';

// had enabled by egg
// exports.static = true;

/*   (info:)    引用egg-sequelize 插件   */
exports.nunjucks = {
  enable: true,
  package: 'egg-view-nunjucks',
};

/*   (info:)    引用egg-sequelize 插件   */
exports.sequelize = {
  enable: false,
  package: 'egg-sequelize',
};

/*   (info:)    mysql   */
exports.mysql = {
  enable: true,
  package: 'egg-mysql',
};

/*   (info:)    参数校验   */
exports.validate = {
  enable: true,
  package: 'egg-validate',
};
