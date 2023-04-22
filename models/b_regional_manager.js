module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'b_regional_manager',
    {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      b_user_id: {
        comment: 'USER ID',
        type: DataTypes.BIGINT,
        allowNull: true,
        defaultValue: null,
      },
      type: {
        //预留
        comment: '区域代理类型',
        type: DataTypes.INTEGER(11),
        allowNull: true,
        defaultValue: null,
      },
      province: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
      },
      city: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
      },
      district: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
      },
      agreement: {
        comment: '区域代理合同',
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
      },
      explain: {
        comment: '区域代理备注',
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
      },
      sdate: {
        comment: '提成开始时间',
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null,
      },
      edate: {
        comment: '提成有效期限',
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null,
      },
    },
    {
      comment: '区域代理表',
      tableName: 'b_regional_manager',
    },
  );
};
