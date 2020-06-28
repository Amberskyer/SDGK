/* indent size: 2 */

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Model = app.model.define('rate_yun_nan', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true
    },
    school_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    college: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    aos: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    batch: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    location: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    student_rank: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    score: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    year: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    probability: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    low_rank: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    low_score: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    status: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: '-1'
    },
    rate: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    tableName: 'rate_yun_nan'
  });

  Model.associate = function() {

  }

  return Model;
};
