function diffDate(diff_type, d1, d2) {
    var val = 0;
    try {
        var nstime = new Date(d1);
        var netime = new Date(d2);
        if (diff_type === 'ss') //秒
            val = parseInt((netime.getTime() - nstime.getTime()) / 1000);
        else if (diff_type === 'hh') //小时
            val = parseInt((netime.getTime() - nstime.getTime()) / (1000 * 60 * 60));
        else if (diff_type === 'dd') //天
            val = parseInt((netime.getTime() - nstime.getTime()) / (1000 * 60 * 60 * 24));
        else if (diff_type === 'mm') //月
            val = parseInt((netime.getTime() - nstime.getTime()) / (1000 * 60 * 60 * 24 * 30));
    } catch (err) {
        console.log(err);
    }
    return val;
}

module.exports = {
    diffDate,
};
