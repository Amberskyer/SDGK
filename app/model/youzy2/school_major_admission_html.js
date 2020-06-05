/* indent size: 2 */

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Model = app.model.define('school_major_admission_html', {
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
    year: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    subject_type: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    r_subject_type: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: '-1'
    },
    total: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    html: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    html_com: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'school_major_admission_html'
  });

  Model.associate = function() {

  }

  return Model;
};
