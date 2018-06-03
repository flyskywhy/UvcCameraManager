var fs = require('fs');
var path = require('path');
var crypto = require('crypto');
var utilFEBE = require('./utilFEBE');
var Reg = {};

Reg.ip = (function() {
    var ipReg = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/;
    return (str) => {
        return ipReg.test(str);
    };
}());

var md5 = (str, encoding) => {
    encoding = encoding || 'base64';
    var md5 = crypto.createHash('md5');
    md5.update(str);
    return md5.digest(encoding);
};

var randomNum = (length) => {
    return Math.random().toString(10).substring(2, 2 + length);
};

var intToFixString = (str, length) => {
    str = str.toString();
    var len = length - str.length;
    for (var i = 0; i < len; i++) {
        str = '0' + str;
    }
    return str;
};

var find = (arr, fnOrVal, key) => {
    for (var i = 0, len = arr.length; i < len; i++) {
        if (typeof fnOrVal === 'function' && fnOrVal(arr[i], i, arr)) {
            return {
                key: i,
                value: arr[i]
            };
        } else {
            var ele = typeof key === 'undefined' ? arr[i] : arr[i][key];
            if (ele == fnOrVal) {
                return {
                    key: i,
                    value: arr[i]
                };
            }
        }
    }
};
var priceChg = (pr, old_stime, old_etime, new_stime, new_etime) => {
    var val = 1;

    //console.log(ostime);
    //console.log(parseInt(ostime.getTime()));
    console.log('pr:' + pr + '_oldstime:' + old_stime + '_oldetime' + old_etime + '_newstime:' + new_stime + '_newetime:' + new_etime);
    try {
        var nstime = new Date(new_stime);
        var netime = new Date(new_etime);
        if ((old_etime.getTime() - old_stime.getTime()) / (1000 * 60 * 60 * 24) > 0) {
            val = pr * parseInt((netime.getTime() - nstime.getTime()) / (1000 * 60 * 60 * 24)) / parseInt((old_etime.getTime() - old_stime.getTime()) / (1000 * 60 * 60 * 24));
        }
    } catch (err) {
        console.log(err);
    }
    console.log(val);
    return val;
};

var diffDate = utilFEBE.diffDate;

var mask2hourAM = (mask) => {
    var hour = "AM:";
    for (var i = 0; i < 12; i++) {
        if (((mask >> i) & 0x000001) === 1) {
            hour += " " + (i < 10 ? '0' : '') + i;
        } else {
            hour += " " + "xx";
        }
    }
    return hour;
};

var mask2hourPM = (mask) => {
    var hour = "PM:";
    for (var i = 12; i < 24; i++) {
        if (((mask >> i) & 0x000001) === 1) {
            hour += " " + i;
        } else {
            hour += " " + "xx";
        }
    }
    return hour;
};

function mkdirsSync(dirpath) {
    if (!fs.existsSync(dirpath)) {
        var pathtmp;
        dirpath.split(path.sep).forEach(function(dirname) {
            dirname = path.sep + dirname;
            if (pathtmp) {
                pathtmp = path.join(pathtmp, dirname);
            } else {
                pathtmp = dirname;
            }
            if (!fs.existsSync(pathtmp)) {
                if (!fs.mkdirSync(pathtmp)) {
                    return false;
                }
            }
        });
    }
    return true;
}

function dateIso8601(date) {
    var curtime = JSON.stringify(date);
    var timestamp = curtime.substr(curtime.indexOf('"') + 1, (curtime.length - 2));
    return timestamp;
}

function isEmptyObj(obj) {
    for (var name in obj) {
        return false;
    }
    return true;
}

/*
 * 获取当前月总共天数
 */
function getCurMonthDays() {
    var curtime = new Date();
    var curMonth = curtime.getMonth();
    curtime.setMonth(curMonth + 1);
    curtime.setDate(0);
    return curtime.getDate();
}

module.exports = {
    Reg,
    md5,
    randomNum,
    intToFixString,
    find,
    priceChg,
    diffDate,
    mask2hourAM,
    mask2hourPM,
    mkdirsSync,
    dateIso8601,
    isEmptyObj,
    getCurMonthDays
};
