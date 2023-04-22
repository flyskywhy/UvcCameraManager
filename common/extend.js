module.exports = function (obj1, obj2) {
  for (var i in obj2) {
    if (obj2.hasOwnProperty(i) && !obj1.hasOwnProperty()) {
      obj1[i] = obj2[i];
    }
  }
};
