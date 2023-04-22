module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'b_playlist_programs',
    {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      b_program_publish_compose_id: {
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
    },
    {
      tableName: 'b_playlist_programs',
    },
  );
};
