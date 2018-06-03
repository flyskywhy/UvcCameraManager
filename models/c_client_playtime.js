module.exports = function(sequelize, DataTypes) {
  return sequelize.define('c_client_playtime', {
    c_client_list_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      autoIncrement: false,
      primaryKey: true
    },
    begintime: {
      type: DataTypes.DATE,
      allowNull: false,
      autoIncrement: false,
      primaryKey: false
    },
    endtime: {
      type: DataTypes.DATE,
      allowNull: false,
      autoIncrement: false,
      primaryKey: false
    }
  }, {
    tableName: 'c_client_playtime'
  });
};