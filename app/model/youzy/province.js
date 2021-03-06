/* indent size: 2 */

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Model = app.youzyModel.define('province', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    province_id_two: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    province_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: '-1'
    },
    r_province_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    r_province_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    province_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    tableName: 'province',
    timestamps: false,
    freezeTableName: true, // 默认false修改表名为复数，true不修改表名，与数据库表名同步
  });

  Model.associate = function() {

  }

  return Model;
};
