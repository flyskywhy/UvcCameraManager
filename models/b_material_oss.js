module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'b_material_oss',
    {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      b_user_id: {
        type: DataTypes.BIGINT,
        allowNull: true,
        autoIncrement: false,
        primaryKey: false,
        defaultValue: 0,
      },
      filename: {
        //oss key
        type: DataTypes.STRING(255),
        allowNull: false,
        autoIncrement: false,
        primaryKey: false,
        unique: true,
      },
      etag: {
        //可能和md5雷同
        type: DataTypes.STRING(80),
        allowNull: false,
        autoIncrement: false,
        primaryKey: false,
      },
      md5: {
        type: DataTypes.STRING(64),
        allowNull: false,
        autoIncrement: false,
        primaryKey: false,
      },
      md5_type: {
        //0：全部; 1:前1K做md5
        type: DataTypes.INTEGER(8),
        allowNull: true,
        autoIncrement: false,
        primaryKey: false,
        defaultValue: 0,
      },
      last_modified: {
        //最后修改时间
        type: DataTypes.DATE,
        allowNull: false,
        autoIncrement: false,
        primaryKey: false,
      },
      status: {
        //1：有效 0：无效
        type: DataTypes.INTEGER(8),
        allowNull: true,
        autoIncrement: false,
        primaryKey: false,
        defaultValue: 0,
      },
      type: {
        //0:用户数据 1：转码后数据
        type: DataTypes.INTEGER(8),
        allowNull: true,
        autoIncrement: false,
        primaryKey: false,
        defaultValue: 0,
      },
    },
    {
      tableName: 'b_material_oss',
    },
  );
};
