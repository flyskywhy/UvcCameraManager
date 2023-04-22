var pattern = /(^(([0\+]\d{2,3}-)?(0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$)|(^0{0,1}1[3|4|5|6|7|8|9][0-9]{9}$)/;

module.exports = function (phone) {
  if (pattern.test(phone)) {
    return true;
  } else {
    return false;
  }
};
