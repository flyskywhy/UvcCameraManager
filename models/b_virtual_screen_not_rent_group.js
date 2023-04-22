module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'b_virtual_screen_not_rent_group',
    {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      b_screen_group_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        autoIncrement: false,
        primaryKey: false,
        defaultValue: 0,
      },
      b_virtual_screen_user_not_rent_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        autoIncrement: false,
        primaryKey: false,
        defaultValue: 0,
      },
    },
    {
      tableName: 'b_virtual_screen_not_rent_group',
    },
  );
};
