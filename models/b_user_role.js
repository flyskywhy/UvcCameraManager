module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'b_user_role',
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
      b_role_id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        autoIncrement: false,
        primaryKey: false,
        defaultValue: 0,
      },
    },
    {
      tableName: 'b_user_role',
    },
  );
};
