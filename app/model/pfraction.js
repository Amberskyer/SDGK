/* indent size: 2 */

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Model = app.model.define('pfraction', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    schoolName: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    schoolId: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    provName: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    provId: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    typeId: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    year: {
      type: DataTypes.INTEGER(255),
      allowNull: false
    },
    isHave: {
      type: DataTypes.INTEGER(255),
      allowNull: false
    },
    htmlData: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    isChecked: {
      type: DataTypes.INTEGER(255),
      allowNull: true
    }
  }, {
    tableName: 'pfraction'
  });

  Model.associate = function() {

  }

  return Model;
};
