/* indent size: 2 */

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Model = app.kkModel.define('sdgk_rate_12', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
    },
    school_id: {
      type: DataTypes.STRING(36),
      allowNull: true,
    },
    major_id: {
      type: DataTypes.STRING(36),
      allowNull: true,
    },
    batch_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    subject_type: {
      type: DataTypes.STRING(16),
      allowNull: true,
    },
    province_id: {
      type: DataTypes.INTEGER(10),
      allowNull: true,
    },
    rank_begin: {
      type: DataTypes.INTEGER(10),
      allowNull: true,
    },
    rank_end: {
      type: DataTypes.INTEGER(10),
      allowNull: true,
    },
    rank_rate: {
      type: DataTypes.INTEGER(10),
      allowNull: true,
    },
  }, {
    tableName: 'sdgk_rate_12',
    timestamps: false,
    freezeTableName: true, // 默认false修改表名为复数，true不修改表名，与数据库表名同步
  });

  Model.associate = function() {

  };

  return Model;
};
