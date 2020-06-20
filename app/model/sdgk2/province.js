/* indent size: 2 */

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Model = app.model.define('province', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    code: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    parent_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    level: {
      type: "DOUBLE",
      allowNull: true
    },
    sort: {
      type: "DOUBLE",
      allowNull: true
    },
    pingyin: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    short_py: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    lat: {
      type: "DOUBLE",
      allowNull: true
    },
    lng: {
      type: "DOUBLE",
      allowNull: true
    },
    image: {
      type: DataTypes.STRING(512),
      allowNull: true
    }
  }, {
    tableName: 'province'
  });

  Model.associate = function() {

  }

  return Model;
};
