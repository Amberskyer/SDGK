/* indent size: 2 */

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Model = app.model.define('batch', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true
    },
    batch_name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    status: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: '0'
    },
    r_batch_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    r_batch_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    tableName: 'batch'
  });

  Model.associate = function() {

  }

  return Model;
};
