module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'b_virtual_screen_group',
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
        unique: 'group_composit_index',
      },
      b_virtual_screen_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        autoIncrement: false,
        primaryKey: false,
        defaultValue: 0,
        unique: 'group_composit_index',
      },
    },
    {
      tableName: 'b_virtual_screen_group',
    },
  );
};
