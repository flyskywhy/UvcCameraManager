module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'b_screen_led',
    {
      id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: true,
        autoIncrement: false,
        primaryKey: false,
        defaultValue: null,
      },
      b_module_list_id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        autoIncrement: false,
        primaryKey: false,
        defaultValue: 0,
        unique: 'compositeIndex',
      },
      width: {
        type: DataTypes.INTEGER(11),
        allowNull: true,
        autoIncrement: false,
        primaryKey: false,
        defaultValue: null,
        unique: 'compositeIndex',
      },
      height: {
        type: DataTypes.INTEGER(11),
        allowNull: true,
        autoIncrement: false,
        primaryKey: false,
        defaultValue: null,
        unique: 'compositeIndex',
      },
      explain: {
        type: DataTypes.STRING,
        allowNull: true,
        autoIncrement: false,
        primaryKey: false,
        defaultValue: null,
      },
    },
    {
      tableName: 'b_screen_led',
    },
  );
};
