/* indent size: 2 */

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Model = app.model.define('province', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    status: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: '0'
    },
    r_province_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    r_province_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    tableName: 'province'
  });

  Model.associate = function() {

  }

  return Model;
};
