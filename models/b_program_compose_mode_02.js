module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'b_program_compose_mode_02',
    {
      b_program_precompose_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
      },
      starttime: {
        type: DataTypes.STRING,
        allowNull: true,
        autoIncrement: false,
        primaryKey: false,
        defaultValue: null,
      },
      endtime: {
        type: DataTypes.STRING,
        allowNull: true,
        autoIncrement: false,
        primaryKey: false,
        defaultValue: null,
      },
    },
    {
      tableName: 'b_program_compose_mode_02',
    },
  );
};
