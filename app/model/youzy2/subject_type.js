/* indent size: 2 */

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Model = app.model.define('subject_type', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    subject_type: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    r_subject_type: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    tableName: 'subject_type'
  });

  Model.associate = function() {

  }

  return Model;
};
