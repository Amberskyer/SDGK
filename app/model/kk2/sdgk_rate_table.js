/* indent size: 2 */

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Model = app.model.define('sdgk_rate_table', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    school_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    school_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    province_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    province_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    subject_type: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    status: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: '-1'
    },
    count: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    count_two: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    }
  }, {
    tableName: 'sdgk_rate_table'
  });

  Model.associate = function() {

  }

  return Model;
};
