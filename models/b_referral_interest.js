module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'b_referral_interest',
    {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      b_referee_id: {
        //b_referee_id 与b_regional_manager_id 二选一填写
        type: DataTypes.BIGINT,
        allowNull: true,
        defaultValue: null,
      },
      b_regional_manager_id: {
        type: DataTypes.BIGINT,
        allowNull: true,
        defaultValue: null,
      },
      type: {
        type: DataTypes.INTEGER(11),
        allowNull: true,
        defaultValue: null,
      },
      per: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: null,
      },
      fixed_amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: null,
      },
      explain: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
      },
      status: {
        //1是有效，0是无效
        type: DataTypes.INTEGER(11),
        allowNull: true,
        defaultValue: null,
      },
      rdate: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null,
      },
    },
    {
      comment: '提成者分配表',
      tableName: 'b_referral_interest',
    },
  );
};
