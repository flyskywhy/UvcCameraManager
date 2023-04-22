module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'c_client_playlist',
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
      b_program_list_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        autoIncrement: false,
        primaryKey: false,
        defaultValue: 0,
      },
      times: {
        type: DataTypes.INTEGER(11),
        allowNull: true,
        autoIncrement: false,
        primaryKey: false,
        defaultValue: null,
      },
      playtime: {
        type: DataTypes.INTEGER(11),
        allowNull: true,
        autoIncrement: false,
        primaryKey: false,
        defaultValue: null,
      },
      start_play_date: {
        type: DataTypes.DATE,
        allowNull: true,
        autoIncrement: false,
        primaryKey: false,
        defaultValue: null,
      },
      end_play_date: {
        type: DataTypes.DATE,
        allowNull: true,
        autoIncrement: false,
        primaryKey: false,
        defaultValue: null,
      },
    },
    {
      tableName: 'c_client_playlist',
    },
  );
};
