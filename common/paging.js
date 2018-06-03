var log = require('../instances/log.js');

module.exports = function () {

    var pagination = {};
    var limit = 0;
    var offset = 0;

    try {
        if (this.query.perpage) {
            limit = parseInt(this.query.perpage);
        }

        if (this.query.page) {
            var p = parseInt(this.query.page);
            offset = (p - 1) * limit;

        }
    } catch (e) {
        log.warn("failed parsing pagination info:", e);
        this.throw("pagination required", 400);
    }

    if (limit <= 0) {
        log.warn("invalid perpage");
        this.throw("invalid perpage", 400);
    }

    log.debug("paging limit:", limit, "offset:", offset);
    pagination.limit = limit;
    pagination.offset = offset;

    return pagination;
};
