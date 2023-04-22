module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'b_screen_group',
    {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      status: {
        type: DataTypes.INTEGER(11),
        allowNull: true,
        autoIncrement: false,
        primaryKey: false,
        defaultValue: null,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: true,
        autoIncrement: false,
        primaryKey: false,
        defaultValue: null,
      },
      explain: {
        type: DataTypes.STRING,
        allowNull: true,
        autoIncrement: false,
        primaryKey: false,
        defaultValue: null,
      },
      b_user_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        autoIncrement: false,
        primaryKey: false,
        defaultValue: 0,
      },
    },
    {
      tableName: 'b_screen_group',
    },
  );
};
