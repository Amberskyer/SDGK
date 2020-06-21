/* indent size: 2 */

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Model = app.kkModel.define('rate_nei_meng_gu', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
    },
    school_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    college: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    aos: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    batch: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    location: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    student_rank: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    low_rank: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    low_score: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    score: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    year: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    probability: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    status: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
  }, {
    tableName: 'rate_nei_meng_gu',
    timestamps: false,
    freezeTableName: true, // 默认false修改表名为复数，true不修改表名，与数据库表名同步
  });

  Model.associate = function() {

  };

  return Model;
};
