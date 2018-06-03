module.exports = function(sequelize, DataTypes) {
  return sequelize.define('b_referee', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    //被推荐人ID 被推荐人ID二选一 填写
    b_user_id: {
      comment: '被推荐人ID',
      type: DataTypes.BIGINT,
      allowNull: true,
      defaultValue: null
    },
    c_client_list_id: {
      comment: '被推荐人ID',
      type: DataTypes.BIGINT,
      allowNull: true,
      defaultValue: null
    },
    b_referee_user_id: {
      comment: '推荐人ID',
      type: DataTypes.BIGINT,
      allowNull: true,
      defaultValue: null
    },
    type: {
      //0：推荐
      //1：回扣
      //2：业务员
      comment: '推荐人类型',
      type: DataTypes.INTEGER(11),
      allowNull: true,
      defaultValue: null
    },
    explain: {
      comment: '推荐人备注',
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null
    },
    sdate: {
      comment: '推荐提成开始时间',
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null
    },
    edate: {
      comment: '推荐提成有效期限',
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null
    },
  }, {
    comment:'提成者表',
    tableName: 'b_referee'
  });
};