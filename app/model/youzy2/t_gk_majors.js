/* indent size: 2 */

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Model = app.model.define('t_gk_majors', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(128),
      allowNull: true
    },
    report_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    industry_ratio: {
      type: "DOUBLE(11,4)",
      allowNull: true
    },
    industry_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    industry_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    industry_stats_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    level: {
      type: DataTypes.STRING(12),
      allowNull: true
    },
    code: {
      type: DataTypes.STRING(64),
      allowNull: true
    },
    is_category: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    parent_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    parent_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    parent_id_top: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    parent_name_top: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    is_original: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    original_major_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    search_index: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    salary: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    salary_over_ratio: {
      type: "DOUBLE",
      allowNull: true
    },
    wen_ratio: {
      type: "DOUBLE",
      allowNull: true
    },
    li_ratio: {
      type: "DOUBLE",
      allowNull: true
    },
    male_count: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    female_count: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    keywords: {
      type: DataTypes.STRING(512),
      allowNull: true
    },
    intro: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    logo: {
      type: DataTypes.STRING(512),
      allowNull: true
    },
    image: {
      type: DataTypes.STRING(512),
      allowNull: true
    },
    un_std: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    tmp_id: {
      type: DataTypes.STRING(64),
      allowNull: true
    },
    tmp_employment: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    fav_count: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: '0'
    },
    rec_weight: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: '0'
    },
    status: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: '-1'
    }
  }, {
    tableName: 't_gk_majors'
  });

  Model.associate = function() {

  }

  return Model;
};
