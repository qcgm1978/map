(function() {
  'use strict';
  var exports, handleMicroMesseageSharing;

  if ((typeof $ !== "undefined" && $ !== null) === false) {
    return;
  }

  handleMicroMesseageSharing = function(config) {
    return (function() {
      var onBridgeReady;
      onBridgeReady = function() {
        var desc, imgUrl, link, title, _ref;
        imgUrl = config.img;
        link = location.href;
        title = (_ref = config.title) != null ? _ref : document.title;
        desc = config.contents;
        desc = desc || link;
        if ("1" === "0") {
          WeixinJSBridge.call("hideOptionMenu");
        }
        return WeixinJSBridge.on("menu:share:appmessage", function(argv) {
          return WeixinJSBridge.invoke("sendAppMessage", {
            img_url: imgUrl,
            link: link,
            desc: desc,
            title: title
          });
        });
      };
      if (document.addEventListener) {
        return document.addEventListener("WeixinJSBridgeReady", onBridgeReady, false);
      } else if (document.attachEvent) {
        document.attachEvent("WeixinJSBridgeReady", onBridgeReady);
        return document.attachEvent("onWeixinJSBridgeReady", onBridgeReady);
      }
    })();
  };

  exports = this;

  exports.handleMicroMesseageSharing = handleMicroMesseageSharing;

}).call(this);
