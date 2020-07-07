/* indent size: 2 */

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Model = app.model.define('tb_gk_rank_rates_20', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    school_id: {
      type: DataTypes.STRING(36),
      allowNull: true
    },
    major_id: {
      type: DataTypes.STRING(36),
      allowNull: true
    },
    batch_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    subject_type: {
      type: DataTypes.STRING(16),
      allowNull: true
    },
    province_id: {
      type: DataTypes.INTEGER(10),
      allowNull: true
    },
    rank_begin: {
      type: DataTypes.INTEGER(10),
      allowNull: true
    },
    rank_end: {
      type: DataTypes.INTEGER(10),
      allowNull: true
    },
    rank_rate: {
      type: DataTypes.INTEGER(10),
      allowNull: true
    }
  }, {
    tableName: 'tb_gk_rank_rates_20'
  });

  Model.associate = function() {

  }

  return Model;
};
