module.exports = function(sequelize, DataTypes) {
  return sequelize.define('b_virtual_screen_user_rent_mode_01', {
    b_virtual_screen_user_rent_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      autoIncrement: false,
      primaryKey: true
    },
    punits: {
      type: DataTypes.FLOAT,
      allowNull: true,
      autoIncrement: false,
      primaryKey: false,
      defaultValue: null
    }
  }, {
    tableName: 'b_virtual_screen_user_rent_mode_01'
  });
};