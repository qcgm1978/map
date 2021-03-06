// Generated by CoffeeScript 1.6.3
(function() {
  'use strict';
  define(['../../flynavi/app/app_flynavi', "scripts/util/micro-share"], function() {
    return handleMicroMesseageSharing({
      contents: util_common.truncateStr(mapHandler.shareInfo.name) + '(' + mapHandler.shareInfo.address + ')',
      bridge: 'scripts/util/micro-message-bridge.js',
      expression: 'scripts/util/expression.js',
      img: 'flynavi/resources/images/start-640-920.jpg'
    });
  });

}).call(this);

/*
//@ sourceMappingURL=micro-sharing.map
*/
