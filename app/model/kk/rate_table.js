/* indent size: 2 */

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Model = app.kkModel.define('rate_table', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
    },
    r_school_id: {
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
    batch_two: {
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
    low_rank: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    low_rank_two: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    low_score: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    low_score_two: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    rate: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    rate_two: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: '-1',
    },
    init_status: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: '-1',
    },
    html: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    r_batch_id: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    r_batch_id_two: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    r_subject_type: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    r_province_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
  }, {
    tableName: 'rate_table',
    timestamps: false,
    freezeTableName: true, // 默认false修改表名为复数，true不修改表名，与数据库表名同步
  });

  Model.associate = function() {

  };

  return Model;
};
