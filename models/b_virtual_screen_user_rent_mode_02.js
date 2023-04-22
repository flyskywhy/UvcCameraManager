module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'b_virtual_screen_user_rent_mode_02',
    {
      b_virtual_screen_user_rent_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
      },
      mask: {
        type: DataTypes.STRING,
        allowNull: true,
        autoIncrement: false,
        primaryKey: false,
        defaultValue: null,
      },
    },
    {
      tableName: 'b_virtual_screen_user_rent_mode_02',
    },
  );
};
