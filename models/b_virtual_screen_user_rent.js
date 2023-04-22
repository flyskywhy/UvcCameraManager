module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'b_virtual_screen_user_rent',
    {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      b_virtual_screen_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        autoIncrement: false,
        primaryKey: false,
        defaultValue: 0,
      },
      b_user_id: {
        //???
        type: DataTypes.BIGINT,
        allowNull: true,
        autoIncrement: false,
        primaryKey: false,
        defaultValue: null,
      },
      status: {
        type: DataTypes.INTEGER(11),
        allowNull: true,
        autoIncrement: false,
        primaryKey: false,
        defaultValue: null,
      },
      published: {
        type: DataTypes.INTEGER(11),
        allowNull: true,
        autoIncrement: false,
        primaryKey: false,
        defaultValue: 0,
      },
      start_datetime: {
        type: DataTypes.DATE,
        allowNull: true,
        autoIncrement: false,
        primaryKey: false,
        defaultValue: null,
      },
      end_datetime: {
        type: DataTypes.DATE,
        allowNull: true,
        autoIncrement: false,
        primaryKey: false,
        defaultValue: null,
      },
      type: {
        type: DataTypes.INTEGER(11),
        allowNull: true,
        autoIncrement: false,
        primaryKey: false,
        defaultValue: null,
      },
      // punits: {
      //   type: DataTypes.FLOAT,
      //   allowNull: true,
      //   autoIncrement: false,
      //   primaryKey: false,
      //   defaultValue: null
      // },
      // max_punits: {
      //   type: DataTypes.FLOAT,
      //   allowNull: true,
      //   autoIncrement: false,
      //   primaryKey: false,
      //   defaultValue: null
      // },
      // flag: { //目前没有使用
      //   type: DataTypes.INTEGER(11),
      //   allowNull: true,
      //   autoIncrement: false,
      //   primaryKey: false,
      //   defaultValue: 0
      // }
    },
    {
      tableName: 'b_virtual_screen_user_rent',
    },
  );
};
