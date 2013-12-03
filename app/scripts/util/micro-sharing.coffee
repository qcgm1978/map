'use strict'
define(['../../flynavi/app/app_flynavi',"scripts/util/micro-share"],->
            handleMicroMesseageSharing
                contents: util_common.truncateStr(mapHandler.shareInfo.name)+'('+mapHandler.shareInfo.address+')'
                bridge: 'scripts/util/micro-message-bridge.js'
                expression: 'scripts/util/expression.js'
                img:'flynavi/resources/images/start-640-920.jpg'
)