module.exports = function(sequelize, DataTypes) {
  return sequelize.define('b_resource', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    path: {
      type: DataTypes.STRING(256),
      allowNull: false,
      autoIncrement: false,
      primaryKey: false,
    },
    offset: {
      type: DataTypes.BIGINT,
      allowNull: false,
      autoIncrement: false,
      primaryKey: false,
      defaultValue: 0
    },
    tdate: {
      type: DataTypes.DATE,
      allowNull: true,
      autoIncrement: false,
      primaryKey: false,
      defaultValue: null
    },
    type: {
      type: DataTypes.STRING(64),
      allowNull: true,
      autoIncrement: false,
      primaryKey: false,
      defaultValue: null
    },
    thumbnailPath: {
      type: DataTypes.STRING(256),
      allowNull: true,
      autoIncrement: false,
      primaryKey: false,
      defaultValue: null
    },
    md5: {
      type: DataTypes.STRING(64),
      allowNull: false,
      autoIncrement: false,
      primaryKey: false,
      unique: true
    },
    status: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      autoIncrement: false,
      primaryKey: false,
      defaultValue: 0
    },
  }, {
    tableName: 'b_resource'
  });
};
