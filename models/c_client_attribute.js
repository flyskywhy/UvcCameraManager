module.exports = function(sequelize, DataTypes) {
  return sequelize.define('c_client_attribute', {
    c_client_list_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      autoIncrement: false,
      primaryKey: true
    },
    fpga_id: {
      type: DataTypes.STRING(64),
      allowNull: true,
      autoIncrement: false,
      primaryKey: false,
      defaultValue: null,
      unique:true
    },
    b_phone_list_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
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
    password: {
      type: DataTypes.STRING(64),
      allowNull: true,
      autoIncrement: false,
      primaryKey: false,
      defaultValue: null
    },
    vers: {
      type: DataTypes.STRING,
      allowNull: true,
      autoIncrement: false,
      primaryKey: false,
      defaultValue: null
    },
    memory: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      autoIncrement: false,
      primaryKey: false,
      defaultValue: 0
    },
    model: {
      type: DataTypes.STRING,
      allowNull: true,
      autoIncrement: false,
      primaryKey: false,
      defaultValue: null
    },
    b_screen_classify_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      autoIncrement: false,
      primaryKey: false,
      defaultValue: 0
    },
    b_distribution_benefit_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      autoIncrement: false,
      primaryKey: false,
      defaultValue: 0
    },
    communication_mode: {
      type: DataTypes.STRING(32),
      allowNull: true,
      autoIncrement: false,
      primaryKey: false,
      defaultValue: null
    },
    device_type: {
      type: DataTypes.STRING(32),
      allowNull: true,
      autoIncrement: false,
      primaryKey: false,
      defaultValue: null
    },
    videoUrls: {
      type: DataTypes.TEXT,
      allowNull: true,
      autoIncrement: false,
      primaryKey: false,
      defaultValue: null
    },
  }, {
    tableName: 'c_client_attribute'
  });
};