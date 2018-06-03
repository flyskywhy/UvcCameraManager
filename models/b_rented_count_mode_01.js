module.exports = function(sequelize, DataTypes) {
  return sequelize.define('b_rented_count_mode_01', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    b_virtual_screen_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      autoIncrement: false,
      primaryKey: false,
      defaultValue: null
    },
    start_datetime: {
      type: DataTypes.DATE,
      allowNull: true,
      autoIncrement: false,
      primaryKey: false,
      defaultValue: null
    },
    end_datetime: {
      type: DataTypes.DATE,
      allowNull: true,
      autoIncrement: false,
      primaryKey: false,
      defaultValue: null
    },
    start_time: {
      type: DataTypes.TIME,
      allowNull: true,
      autoIncrement: false,
      primaryKey: false,
      defaultValue: null
    },
    end_time: {
      type: DataTypes.TIME,
      allowNull: true,
      autoIncrement: false,
      primaryKey: false,
      defaultValue: null
    },
    punits: {
      type: DataTypes.FLOAT,
      allowNull: true,
      autoIncrement: false,
      primaryKey: false,
      defaultValue: null
    },
    type: {
      type: DataTypes.INTEGER(11),
      comment: '租用类型',
      allowNull: true,
      autoIncrement: false,
      primaryKey: false,
      defaultValue: null
    },
    status: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      autoIncrement: false,
      primaryKey: false,
      defaultValue: null
    },
  }, {
    tableName: 'b_rented_count_mode_01',
    indexes: [{
      fields: ['start_datetime'],
    }, {
      fields: ['end_datetime'],
    }],
  });
};
