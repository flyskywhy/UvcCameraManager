module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'b_screen_share',
    {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      c_client_list_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        autoIncrement: false,
        primaryKey: false,
        defaultValue: 0,
      },
      is_share: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        autoIncrement: false,
        primaryKey: false,
        defaultValue: null,
      },
      split_number: {
        type: DataTypes.INTEGER(11),
        allowNull: true,
        autoIncrement: false,
        primaryKey: false,
        defaultValue: null,
      },
      share_per: {
        type: DataTypes.FLOAT,
        allowNull: true,
        autoIncrement: false,
        primaryKey: false,
        defaultValue: null,
      },
    },
    {
      tableName: 'b_screen_share',
    },
  );
};
