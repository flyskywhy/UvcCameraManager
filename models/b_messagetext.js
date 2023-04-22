module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'b_messagetext',
    {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      b_user_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        autoIncrement: false,
        primaryKey: false,
        defaultValue: 0,
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: true,
        autoIncrement: false,
        primaryKey: false,
        defaultValue: null,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: true,
        autoIncrement: false,
        primaryKey: false,
        defaultValue: null,
      },
      type: {
        type: DataTypes.BIGINT,
        allowNull: true,
        autoIncrement: false,
        primaryKey: false,
        defaultValue: null,
      },
      postdate: {
        type: DataTypes.DATE,
        allowNull: true,
        autoIncrement: false,
        primaryKey: false,
        defaultValue: null,
      },
      issms: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        autoIncrement: false,
        primaryKey: false,
        defaultValue: null,
      },
      isemail: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        autoIncrement: false,
        primaryKey: false,
        defaultValue: null,
      },
    },
    {
      tableName: 'b_messagetext',
    },
  );
};
