module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'b_program_compose_mode_01',
    {
      b_program_precompose_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
      },
      punits: {
        type: DataTypes.FLOAT,
        allowNull: true,
        autoIncrement: false,
        primaryKey: false,
        defaultValue: null,
      },
    },
    {
      tableName: 'b_program_compose_mode_01',
    },
  );
};
