/* indent size: 2 */

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Model = app.kkModel.define('t_gk_score_ranges', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true
    },
    year: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    province_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    subject_type: {
      type: DataTypes.STRING(16),
      allowNull: true
    },
    score_start: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    score_end: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    count: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    student_rank: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    }
  }, {
    tableName: 't_gk_score_ranges',
    timestamps: false,
    freezeTableName: true, // 默认false修改表名为复数，true不修改表名，与数据库表名同步
  });

  Model.associate = function() {

  }

  return Model;
};
