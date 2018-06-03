var api = require('../../common/api.js');
var db = require('../../models/index.js');

module.exports = (router) => {

    var Admins = db.models.b_user;
    var Role = db.models.b_role;
    var Statuses = db.models.b_status;

    router.get(api.apiPath + api.accountGET.path, getAccount);

    function* getAccount() {
        var user = yield Admins.findAndCountAll({
            where: {
                status: {
                    $ne: -1
                }
            },
            include: [{
                model: Role,
                attributes: ['name'],
                through: {
                    attributes: []
                },
            }],
            attributes: {
                exclude: ['headimage', 'password', 'tdate', 'type']
            },
        });

        var nstatus = yield Statuses.findAll({
            where: {
                b_status_main_id: 1,
                language_id: 0
            },
            attributes: ['name', 'val']
        });

        var user_length = user.rows.length;
        var status_length = nstatus.length;
        for (var i = 0; i < user_length; i++) {
            user.rows[i].dataValues.index = i;
            user.rows[i].dataValues.roles = [];

            for (var j = 0; j < user.rows[i].dataValues.b_roles.length; j++) {
                user.rows[i].dataValues.roles[j] = user.rows[i].dataValues.b_roles[j].dataValues.name;
            }

            for (var k = 0; k < status_length; k++) {
                if (user.rows[i].dataValues.status === nstatus[k].val) {
                    user.rows[i].dataValues.status = nstatus[k].name;
                    k = nstatus.length;
                }
            }
        }

        this.body = user;
    }
};
