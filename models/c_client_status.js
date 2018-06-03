module.exports = function(sequelize, DataTypes) {
  return sequelize.define('c_client_status', {
    c_client_list_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      autoIncrement: false,
      primaryKey: true
    },
    status: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      autoIncrement: false,
      primaryKey: false,
      defaultValue: null
    },
    b_program_list_id: {
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
    }
  }, {
    tableName: 'c_client_status'
  });
};