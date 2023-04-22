module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'b_rent_count_mode_01',
    {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      status: {
        type: DataTypes.INTEGER(11),
        allowNull: true,
        autoIncrement: false,
        primaryKey: false,
        defaultValue: null,
      },
      b_virtual_screen_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        autoIncrement: false,
        primaryKey: false,
        defaultValue: 0,
      },
      start_datetime: {
        type: DataTypes.DATE,
        allowNull: true,
        autoIncrement: false,
        primaryKey: false,
        defaultValue: null,
      },
      end_datetime: {
        type: DataTypes.DATE,
        allowNull: true,
        autoIncrement: false,
        primaryKey: false,
        defaultValue: null,
      },
      punits: {
        type: DataTypes.FLOAT,
        allowNull: true,
        autoIncrement: false,
        primaryKey: false,
        defaultValue: null,
      },
      type: {
        type: DataTypes.INTEGER(11),
        comment: '租用类型',
        allowNull: true,
        autoIncrement: false,
        primaryKey: false,
        defaultValue: null,
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        autoIncrement: false,
        primaryKey: false,
        defaultValue: null,
      },
      max_punits: {
        type: DataTypes.FLOAT,
        allowNull: true,
        autoIncrement: false,
        primaryKey: false,
        defaultValue: null,
      },
    },
    {
      tableName: 'b_rent_count_mode_01',
      indexes: [
        {
          fields: ['start_datetime'],
        },
        {
          fields: ['end_datetime'],
        },
      ],
    },
  );
};
