module.exports = function(sequelize, DataTypes) {
  return sequelize.define('c_client_merge_config', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    c_client_list_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      autoIncrement: false,
      primaryKey: false
    },
    background_image_url: {
      type: DataTypes.STRING,
      allowNull: true,
      autoIncrement: false,
      primaryKey: false,
      defaultValue: null,
    },
    coordinate: {
      type: DataTypes.STRING,
      allowNull: true,
      autoIncrement: false,
      primaryKey: false,
      defaultValue: null
    },
    last_modified_date: {
      type: DataTypes.DATE,
      allowNull: true,
      autoIncrement: false,
      primaryKey: false,
      defaultValue: null
    },
    status: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      autoIncrement: false,
      primaryKey: false
    },
    start_time: {
      type: DataTypes.TIME,
      allowNull: false,
      autoIncrement: false,
      primaryKey: false
    }
  }, {
    tableName: 'c_client_merge_config'
  });
};