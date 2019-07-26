/* indent size: 2 */

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Model = app.model.define('school', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    school_id: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    status: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      defaultValue: '0'
    },
    r_school_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    r_school_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    tableName: 'school'
  });

  Model.associate = function() {

  }

  return Model;
};
