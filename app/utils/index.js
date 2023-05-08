import {Linking, Platform, Dimensions} from 'react-native';

//iPhoneX
const X_WIDTH = 375;
const X_HEIGHT = 812;

//iPhoneXR
const XR_WIDTH = 414;
const XR_HEIGHT = 896;

//screen
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

//判断是否是iPhoneX
export function isIphoneX() {
  return (
    Platform.OS === 'ios' &&
    ((SCREEN_HEIGHT === X_HEIGHT && SCREEN_WIDTH === X_WIDTH) ||
      (SCREEN_HEIGHT === X_WIDTH && SCREEN_WIDTH === X_HEIGHT))
  );
}

//判断是否是iPhoneXR
export function isIphoneXR() {
  return (
    Platform.OS === 'ios' &&
    ((SCREEN_HEIGHT === XR_HEIGHT && SCREEN_WIDTH === XR_WIDTH) ||
      (SCREEN_HEIGHT === XR_WIDTH && SCREEN_WIDTH === XR_HEIGHT))
  );
}

const colors = [
  '#E74C3C',
  '#C0392B',
  '#1ABC9C',
  '#16A085',
  '#2ECC71',
  '#27AE60',
  '#3498DB',
  '#2980B9',
  '#9B59B6',
  '#8E44AD',
  '#34495E',
  '#2C3E50',
  '#E67E22',
  '#D35400',
  '#7F8C8D',
];

const imageTypedata = [
  {
    type: 'contain',
    text: '比例拉伸',
  },
  {
    type: 'cover',
    text: '截取',
  },
  {
    type: 'stretch',
    text: '拉伸',
  },
  {
    type: 'center',
    text: '原图',
  },
];

const EARTH_RADIUS = 6378137.0; //单位M
const PI = Math.PI;

function getRandomNum(Min, Max) {
  var Range = Max - Min;
  var Rand = Math.random();
  return Min + Math.round(Rand * Range);
}

export function parseImgUrl(url) {
  if (/^\/\/.*/.test(url)) {
    url = 'http:' + url;
  }
  return url;
}

export function genColor() {
  return colors[getRandomNum(0, colors.length - 1)];
}

export function link(url) {
  Linking.canOpenURL(url)
    .then((supported) => {
      if (supported) {
        return Linking.openURL(url);
      }
    })
    .catch((err) => {
      console.error('An error occurred', err);
    });
}

//去左右空格;
export function trim(s) {
  return s.replace(/(^\s*)|(\s*$)/g, '');
}

//检测电话号码格式是否正确;
export function checkPhone(phone) {
  let regMobile = /^0?1[0-9][0-9]\d{8}$/;
  return regMobile.test(phone);
}

//截取字符串，包括对于中文字符的处理，以及末尾是否加上省略号;
export function subString(str, len, hasDot) {
  if (!str) {
    return '';
  }
  let newLength = 0;
  let newStr = '';
  let chineseRegex = /[^\x00-\xff]/g;
  let singleChar = '';
  let strLength = str.replace(chineseRegex, '**').length;
  for (let i = 0; i < strLength; i++) {
    singleChar = str.charAt(i).toString();
    if (singleChar.match(chineseRegex) !== null) {
      newLength += 2;
    } else {
      newLength++;
    }
    if (newLength > len) {
      break;
    }
    newStr += singleChar;
  }
  if (hasDot && strLength > len) {
    newStr += '...';
  }
  return newStr;
}

//判断所有字符都是中文
export function checkAllChinese(str) {
  var isAllChinese = true;
  for (var i = 0; i < str.length; i++) {
    if (str.charCodeAt(i) > 255) {
    } else {
      isAllChinese = false;
      break;
    }
  }
  return isAllChinese;
}

//保留小数点后几位
export function fomatFloat(src, pos) {
  return Math.round(src * Math.pow(10, pos)) / Math.pow(10, pos);
}

export function isImage(filepath) {
  let index = filepath.indexOf('pic');
  let vidIndex = filepath.indexOf('vid');
  if (index !== -1) {
    return true;
  } else if (vidIndex === -1) {
    return true;
  } else {
    return false;
  }
}

export function getFlatternDistance(lat1, lng1, lat2, lng2) {
  var f = getRad((lat1 + lat2) / 2);
  var g = getRad((lat1 - lat2) / 2);
  var l = getRad((lng1 - lng2) / 2);
  var sg = Math.sin(g);
  var sl = Math.sin(l);
  var sf = Math.sin(f);
  var s, c, w, r, d, h1, h2;
  var a = EARTH_RADIUS;
  var fl = 1 / 298.257;
  sg = sg * sg;
  sl = sl * sl;
  sf = sf * sf;
  s = sg * (1 - sl) + (1 - sf) * sl;
  c = (1 - sg) * (1 - sl) + sf * sl;
  w = Math.atan(Math.sqrt(s / c));
  r = Math.sqrt(s * c) / w;
  d = 2 * w * a;
  h1 = (3 * r - 1) / 2 / c;
  h2 = (3 * r + 1) / 2 / s;
  return d * (1 + fl * (h1 * sf * (1 - sg) - h2 * (1 - sf) * sg));
}

function getRad(d) {
  return (d * PI) / 180.0;
}

//判断是不是数字
export function isNum(data) {
  var numData = Number(data);
  if (!isNaN(numData)) {
    return true;
  }
  return false;
}

//判断一个数是不是正整数
export function isPositiveIntegerNum(s) {
  var re = /^[0-9]*[1-9][0-9]*$/;
  return re.test(s);
}

//判断是不是正数
export function isPositiveNum(numString) {
  var numData = Number(numString);
  return numData > 0;
}

export function isEmojiCharacter(substring) {
  for (var i = 0; i < substring.length; i++) {
    var hs = substring.charCodeAt(i);
    if (0xd800 <= hs && hs <= 0xdbff) {
      if (substring.length > 1) {
        var ls = substring.charCodeAt(i + 1);
        var uc = (hs - 0xd800) * 0x400 + (ls - 0xdc00) + 0x10000;
        if (0x1d000 <= uc && uc <= 0x1f77f) {
          return true;
        }
      }
    } else if (substring.length > 1) {
      var ls = substring.charCodeAt(i + 1);
      if (ls === 0x20e3) {
        return true;
      }
    } else {
      if (0x2100 <= hs && hs <= 0x27ff) {
        return true;
      } else if (0x2b05 <= hs && hs <= 0x2b07) {
        return true;
      } else if (0x2934 <= hs && hs <= 0x2935) {
        return true;
      } else if (0x3297 <= hs && hs <= 0x3299) {
        return true;
      } else if (
        hs == 0xa9 ||
        hs == 0xae ||
        hs == 0x303d ||
        hs == 0x3030 ||
        hs == 0x2b55 ||
        hs == 0x2b1c ||
        hs == 0x2b1b ||
        hs == 0x2b50
      ) {
        return true;
      }
    }
  }
}

export function isJson(str) {
  if (typeof str === 'string') {
    try {
      let obj = JSON.parse(str);
      if (str.indexOf('{') > -1) {
        return true;
      } else {
        return false;
      }
    } catch (e) {
      return false;
    }
  }
  return false;
}

export function isPicture(url) {
  var strFilter = '.jpeg|.gif|.jpg|.png|.bmp|.pic|';
  if (url.indexOf('.') > -1) {
    var p = url.lastIndexOf('.');
    var strPostfix = url.substring(p, url.length) + '|';
    strPostfix = strPostfix.toLowerCase();
    if (strFilter.indexOf(strPostfix) > -1) {
      return true;
    }
  }
  return false;
}

export function getImageMode(text) {
  let type = '';
  for (let row of imageTypedata) {
    if (row.text === text) {
      type = row.type;
      break;
    }
  }
  if (type === '') {
    return imageTypedata[0].type;
  }
  return type;
}

export function randomWord(randomFlag, min, max) {
  var str = '',
    range = min,
    arr = [
      '0',
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      'a',
      'b',
      'c',
      'd',
      'e',
      'f',
      'g',
      'h',
      'i',
      'j',
      'k',
      'l',
      'm',
      'n',
      'o',
      'p',
      'q',
      'r',
      's',
      't',
      'u',
      'v',
      'w',
      'x',
      'y',
      'z',
      'A',
      'B',
      'C',
      'D',
      'E',
      'F',
      'G',
      'H',
      'I',
      'J',
      'K',
      'L',
      'M',
      'N',
      'O',
      'P',
      'Q',
      'R',
      'S',
      'T',
      'U',
      'V',
      'W',
      'X',
      'Y',
      'Z',
    ];

  if (randomFlag) {
    range = Math.round(Math.random() * (max - min)) + min;
  }
  let pos;
  for (var i = 0; i < range; i++) {
    pos = Math.round(Math.random() * (arr.length - 1));
    str += arr[pos];
  }
  return str;
}

export function randomFrom(lowerValue, upperValue) {
  return Math.floor(Math.random() * (upperValue - lowerValue + 1) + lowerValue);
}

export function removeZoreAtTheEnd(str) {
  if (!str) {
    return str;
  }
  let i = 0;
  for (; i < str.length; i++) {
    if (str.charAt(str.length - i - 1) === '0') {
    } else {
      break;
    }
  }
  if (str.charAt(str.length - i - 1) === '.') {
    return str.substring(0, str.length - i - 1);
  } else {
    return str.substring(0, str.length - i);
  }
}
