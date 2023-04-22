var db = require('../models/index.js');

module.exports = {
  getByName: function* (stateName, stateDesc) {
    var StatusMain = db.models.b_status_main;
    var Statuses = db.models.b_status;
    var state_value;

    var devState = yield Statuses.findOne({
      attributes: ['val'],
      where: {
        name: stateDesc,
      },
      include: [
        {
          model: StatusMain,
          where: {
            name: stateName,
          },
          attributes: [],
        },
      ],
    });

    if (devState) {
      state_value = devState.getDataValue('val');
    }
    // console.log('>>> Get state:' + state_value);

    return state_value;
  },
};
