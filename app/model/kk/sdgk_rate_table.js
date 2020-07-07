/* indent size: 2 */

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Model = app.kkModel.define('sdgk_rate_table', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    school_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    school_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    province_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    province_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    subject_type: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    status: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    count: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    tableName: 'sdgk_rate_table',
    timestamps: false,
    freezeTableName: true, // 默认false修改表名为复数，true不修改表名，与数据库表名同步
  });

  Model.associate = function() {

  }

  return Model;
};
