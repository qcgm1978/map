(function() {
  'use strict';
  var _wxao;

  _wxao = window._wxao || {};

  _wxao.appid = "wx1bc509d4d039b25a";

  _wxao.version = "1.0.0";

  _wxao.begin = +new Date();

  (function() {
    var s, version, wxa, _onBridgeReady;
    _onBridgeReady = function() {
      return _wxao.jsbReady = true;
    };
    if (document.addEventListener) {
      document.addEventListener("WeixinJSBridgeReady", _onBridgeReady, false);
    } else if (document.attachEvent) {
      document.attachEvent("WeixinJSBridgeReady", _onBridgeReady);
      document.attachEvent("onWeixinJSBridgeReady", _onBridgeReady);
    }
    wxa = document.createElement("script");
    wxa.type = "text/javascript";
    wxa.async = true;
    version = _wxao.version || "1.0";
    wxa.src = ("https:" === document.location.protocol ? "https://" : "http://") + "res.wx.qq.com/mmbizwap/zh_CN/htmledition/js/wxa/wxa-" + version + ".js";
    s = document.getElementsByTagName("script")[0];
    return s.parentNode.insertBefore(wxa, s);
  })();

}).call(this);
