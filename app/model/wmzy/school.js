/* indent size: 2 */

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Model = app.wmzyModel.define('school', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    school_id: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    school_name: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: '-1',
    },
    grad_desc: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    r_school_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    r_school_name: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  }, {
    tableName: 'school',
    timestamps: false,
    freezeTableName: true, // 默认false修改表名为复数，true不修改表名，与数据库表名同步
  });

  Model.associate = function() {

  };

  return Model;
};
