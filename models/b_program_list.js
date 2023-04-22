module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'b_program_list',
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
        // unique: 'name_composit_index'
      },
      explain: {
        type: DataTypes.TEXT,
        allowNull: true,
        autoIncrement: false,
        primaryKey: false,
        defaultValue: null,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: true,
        autoIncrement: false,
        primaryKey: false,
        defaultValue: null,
      },
      duration: {
        type: DataTypes.DECIMAL(10, 1),
        allowNull: false,
        autoIncrement: false,
        primaryKey: false,
        defaultValue: 0,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        autoIncrement: false,
        primaryKey: false,
        defaultValue: '',
        // unique: 'name_composit_index'
      },
      status: {
        type: DataTypes.BIGINT,
        allowNull: true,
        autoIncrement: false,
        primaryKey: false,
        defaultValue: null,
        // unique: 'name_composit_index'
      },
      match_method: {
        type: DataTypes.INTEGER(11),
        allowNull: true,
        autoIncrement: false,
        primaryKey: false,
        defaultValue: 1,
      },
      rdate: {
        type: DataTypes.DATE,
        allowNull: true,
        autoIncrement: false,
        primaryKey: false,
        defaultValue: null,
      },
    },
    {
      tableName: 'b_program_list',
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
    },
  );
};
