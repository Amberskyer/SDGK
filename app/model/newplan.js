/* indent size: 2 */

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Model = app.model.define('newplan', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    schoolId: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    schoolName: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    provId: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    provName: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    isHave: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    htmlData: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    isChecked: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    }
  }, {
    tableName: 'newplan'
  });

  Model.associate = function() {

  }

  return Model;
};
