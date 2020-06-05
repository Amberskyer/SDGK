/* indent size: 2 */

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Model = app.cSchoolMajorAdmissionModel.define('youzy_school_major_admission', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    school_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    r_school_id: {
      type: DataTypes.INTEGER,
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
    province_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    r_province_id: {
      type: DataTypes.INTEGER,
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
    profession_code: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    profession_name: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    r_major_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    r_major_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    year: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    batch: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    r_batch_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    batch_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    r_batch_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    subject_type: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    min_score_rank: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    max_score_rank: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    min_score: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    max_score: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    avg_score: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    chooseLevel: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    countOfZJZY: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    lineDiff: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    count: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    major_code: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    tableName: 'youzy_school_major_admission',
    timestamps: false,
    freezeTableName: true, // 默认false修改表名为复数，true不修改表名，与数据库表名同步
  });

  Model.associate = function() {

  }

  return Model;
};
