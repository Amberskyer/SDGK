/* indent size: 2 */

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Model = app.model.define('school_major_admission_json', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true
    },
    school_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    r_school_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    province_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    r_province_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    year: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    subject_type: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    school_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    r_school_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    province_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    r_province_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    status: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    json: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    num: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    code: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    message: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    is_success: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    tableName: 'school_major_admission_json',
    timestamps: false,
    freezeTableName: true// 默认false修改表名为复数，true不修改表名，与数据库表名同步
  });

  Model.associate = function() {

  }

  return Model;
};
