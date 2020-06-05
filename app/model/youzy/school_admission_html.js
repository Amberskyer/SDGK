/* indent size: 2 */

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Model = app.youzyModel.define('school_admission_html', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    school_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    r_school_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    school_name: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    r_school_name: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    province_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    province_id_two: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    r_province_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    province_name: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    r_province_name: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    html: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  }, {
    tableName: 'school_admission_html',
    timestamps: false,
    freezeTableName: true, // 默认false修改表名为复数，true不修改表名，与数据库表名同步
  });

  Model.associate = function() {

  };

  return Model;
};
