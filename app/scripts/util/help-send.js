(function() {
  'use strict';
  var img, isIOS, obj, src;

  isIOS = function() {
    var exrep, _ref;
    exrep = /mac/i;
    return (_ref = exrep.test(navigator.userAgent)) != null ? _ref : {
      "true": false
    };
  };

  if (isIOS()) {
    obj = {
      Chinese: '苹果',
      Eng: 'iphone'
    };
  } else {
    obj = {
      Chinese: '安卓',
      Eng: 'android'
    };
  }

  src = "images/" + obj.Eng + ".jpg";

  document.getElementById('phone-type').innerText = obj.Chinese;

  img = document.createElement('img');

  img.setAttribute('src', src);

  document.body.appendChild(img);

}).call(this);
