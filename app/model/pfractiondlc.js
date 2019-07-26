/* indent size: 2 */

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Model = app.model.define('pfractiondlc', {
    isDLC: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    schoolId: {
      type: DataTypes.INTEGER(11),
      allowNull: false
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
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true
    },
    isHave: {
      type: DataTypes.INTEGER(11).UNSIGNED.ZEROFILL,
      allowNull: true
    },
    isCheck: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    htmlData: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'pfractiondlc'
  });

  Model.associate = function() {

  }

  return Model;
};
