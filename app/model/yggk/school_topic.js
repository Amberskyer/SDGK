/* indent size: 2 */

module.exports = app => {
  const DataTypes = app.Sequelize;

  const Model = app.yggkModel.define('school_topic', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    school_name: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    url: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    html: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: '-1',
    },
    r_school_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    r_school_name: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    topic_url: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    topic_html: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    author: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    topic_content: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  }, {
    tableName: 'school_topic',
    timestamps: false,
    freezeTableName: true, // 默认false修改表名为复数，true不修改表名，与数据库表名同步
  });

  Model.associate = function() {

  };

  return Model;
};
