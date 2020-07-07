/* indent size: 2 */

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Model = app.model.define('t_gk_schools', {
    id: {
      type: DataTypes.INTEGER(4),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    xue_xiao_ming_cheng: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
  }, {
    tableName: 't_gk_schools'
  });

  Model.associate = function() {

  }

  return Model;
};
