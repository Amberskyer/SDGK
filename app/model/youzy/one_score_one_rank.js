/* indent size: 2 */

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Model = app.youzyModel.define('one_score_one_rank', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    province_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    r_province_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    province_name: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    r_province_name: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    subject_type: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    r_subject_type: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    year: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    start: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    end: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    count: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    rank: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: '-1',
    },
  }, {
    tableName: 'one_score_one_rank',
    timestamps: false,
    freezeTableName: true, // 默认false修改表名为复数，true不修改表名，与数据库表名同步
  });

  Model.associate = function() {

  };

  return Model;
};
