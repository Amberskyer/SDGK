/* indent size: 2 */

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Model = app.model.define('rate', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
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
      type: DataTypes.STRING(255),
      allowNull: true
    },
    status: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: '-1'
    }
  }, {
    tableName: 'rate'
  });

  Model.associate = function() {

  }

  return Model;
};
