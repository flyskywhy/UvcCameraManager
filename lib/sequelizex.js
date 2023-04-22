var Sequelize = require('sequelize');

var DataTypes = Sequelize;

var String = (num, allowNull) => {
  if (!num) {
    num = 2048;
  }
  if (!allowNull) {
    allowNull = false;
  }
  return {
    type: DataTypes.STRING(num),
    allowNull,
  };
};

var Double = (defaultValue) => {
  if (typeof defaultValue === 'undefined') {
    defaultValue = 0;
  }
  return {
    type: DataTypes.DOUBLE,
    defaultValue,
  };
};

var Int = (defaultValue) => {
  if (typeof defaultValue === 'undefined') {
    defaultValue = 0;
  }
  return {
    type: DataTypes.INTEGER,
    defaultValue,
  };
};

var Phone = (allowNull) => {
  if (typeof allowNull === 'undefined') {
    allowNull = false;
  }
  return {
    type: DataTypes.STRING(11),
    allowNull,
    validate: {
      is: /^\d{11}$/,
    },
  };
};

var Url = (allowNull) => {
  if (typeof allowNull === 'undefined') {
    allowNull = false;
  }
  return {
    type: DataTypes.STRING,
    allowNull: allowNull,
    vialidate: {
      isUrl: true,
    },
  };
};

var Date = () => {
  return {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW,
  };
};

var Bool = () => {
  return {
    type: Sequelize.BOOLEAN,
  };
};

var Text = () => {
  return {
    type: Sequelize.TEXT,
  };
};

var Float = () => {
  return {
    type: Sequelize.FLOAT,
  };
};
var Money = () => {
  return {
    type: Sequelize.DECIMAL(14, 4),
  };
};
var Bit = () => {
  return {
    type: Sequelize.INTEGER,
  };
};
var val = (data) => {
  return data.map(function (item) {
    return item.dataValues;
  });
};
var Bigint = (data) => {
  return {
    type: Sequelize.BIGINT,
  };
};
module.exports = {
  DataTypes: {
    String,
    Phone,
    Int,
    Url,
    Date,
    Double,
    Bool,
    Text,
    Float,
    Money,
    Bit,
    Bigint,
  },
  Func: {
    //findById
    val,
  },
};
