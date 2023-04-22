module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'b_rent_setting',
    {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      b_virtual_screen_id: {
        type: DataTypes.BIGINT,
        allowNull: true,
        autoIncrement: false,
        primaryKey: false,
        defaultValue: null,
      },
      circle_type: {
        type: DataTypes.INTEGER(11),
        comment: '循环类型',
        allowNull: true,
        autoIncrement: false,
        primaryKey: false,
        defaultValue: null,
      },
      start_time: {
        type: DataTypes.TIME,
        allowNull: true,
        autoIncrement: false,
        primaryKey: false,
        defaultValue: null,
      },
      end_time: {
        type: DataTypes.TIME,
        allowNull: true,
        autoIncrement: false,
        primaryKey: false,
        defaultValue: null,
      },
      val: {
        type: DataTypes.INTEGER(11),
        allowNull: true,
        autoIncrement: false,
        primaryKey: false,
        defaultValue: null,
      },
      punits: {
        //自用 b_virtual_screem_user_rent_mode_01自用去掉
        type: DataTypes.FLOAT,
        allowNull: true,
        autoIncrement: false,
        primaryKey: false,
        defaultValue: null,
      },
      rentable_punits: {
        //可租
        type: DataTypes.FLOAT,
        allowNull: true,
        autoIncrement: false,
        primaryKey: false,
        defaultValue: null,
      },
      max_punits: {
        //从可租表移到这里, b_virtual_screem_user_rent_mode_01记录租赁当时的值
        type: DataTypes.FLOAT,
        allowNull: true,
        autoIncrement: false,
        primaryKey: false,
        defaultValue: null,
      },
      price: {
        //从可租表移到这里
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        autoIncrement: false,
        primaryKey: false,
        defaultValue: null,
      },
      owner_price: {
        //屏主定价
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
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
      rdate: {
        type: DataTypes.DATE,
        allowNull: true,
        autoIncrement: false,
        primaryKey: false,
        defaultValue: null,
      },
      status: {
        type: DataTypes.INTEGER(11),
        allowNull: true,
        autoIncrement: false,
        primaryKey: false,
        defaultValue: null,
      },
    },
    {
      tableName: 'b_rent_setting',
      indexes: [
        {
          fields: ['start_time'],
        },
        {
          fields: ['end_time'],
        },
      ],
    },
  );
};
