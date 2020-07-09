/* indent size: 2 */

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Model = app.model.define('school_major_admission_2', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    school_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    school_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    r_school_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    r_school_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    yuan_xiao_lei_xing_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    yuan_xiao_lei_xing: {
      type: DataTypes.STRING(12),
      allowNull: true
    },
    major_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    major_name: {
      type: DataTypes.STRING(512),
      allowNull: true
    },
    major_code: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    r_major_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    r_major_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    dual_class_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    original_major_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    batch_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    batch_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    r_batch_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    r_batch_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    subject_type: {
      type: DataTypes.STRING(16),
      allowNull: true
    },
    r_subject_type: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    subject_type_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    province_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    province_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    province_score: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    avg_score: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    max_score: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    min_score: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    min_score_rank: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    avg_score_rank: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    people_count: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    count: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    is_standard: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    tmp_major_id: {
      type: DataTypes.STRING(64),
      allowNull: true
    },
    tmp_school_id: {
      type: DataTypes.STRING(64),
      allowNull: true
    }
  }, {
    tableName: 'school_major_admission_2'
  });

  Model.associate = function() {

  }

  return Model;
};
