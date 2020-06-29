/* indent size: 2 */

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Model = app.model.define('province', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    province_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    province_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    pin_yin: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    pin_yin_two: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: '-1'
    },
    province_id_two: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    r_province_id: {
      type: DataTypes.INTEGER,
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
