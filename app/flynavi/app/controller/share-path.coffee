'use strict'
# handle path sharing
define [],->
	if $.isEmptyObject mapHandler.curInfo or $.isEmptyObject mapHandler.shareInfo or mapHandler.shareInfo.source isnt 2
	    return
	$('#icon_request_path').trigger 'touchstart'
