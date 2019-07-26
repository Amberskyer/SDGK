/* indent size: 2 */

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Model = app.model.define('newplandata', {
    id: {
      type: DataTypes.INTEGER(11),
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
    typeId: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    year: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    code: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    majorName: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    bat: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    max: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    avr: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    min: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    minLevel: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    count: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    dataFromId: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    dataCount: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    }
  }, {
    tableName: 'newplandata'
  });

  Model.associate = function() {

  }

  return Model;
};
