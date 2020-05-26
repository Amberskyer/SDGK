/* indent size: 2 */

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Model = app.model.define('major', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true
    },
    major_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    major_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    tableName: 'major',
    timestamps: false,
    freezeTableName: true, // 默认false修改表名为复数，true不修改表名，与数据库表名同步
  });

  Model.associate = function() {

  }

  return Model;
};
