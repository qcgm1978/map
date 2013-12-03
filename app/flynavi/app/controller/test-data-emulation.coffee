'use strict'
#    if address is an invalid value, change it a valid value by replacing subversion folder name 'flynavi'
emulateData = (url,verifyFunc)->
	if not verifyFunc(url)
		info = '?name=%E8%A5%BF%E5%9B%9B%E7%8E%AF%E4%B8%AD%E8%B7%AF%E8%BE%85%E8%B7%AF&source=2&lng=116.309272&lat=39.979194&address=%E7%94%98%E8%82%83%E7%9C%81%E5%BC%A0%E6%8E%96%E5%B8%82%E8%8B%8F%E5%8D%97%E8%A3%95%E5%9B%BA%E6%97%8F%E8%87%AA%E6%B2%BB%E5%8E%BF'
#		the data whose position outside China
		# info = '?name=%E8%A5%BF%E5%9B%9B%E7%8E%AF%E4%B8%AD%E8%B7%AF%E8%BE%85%E8%B7%AF&lng=103.7571334838867&lat=61.98898696899414&address=%E7%94%98%E8%82%83%E7%9C%81%E5%BC%A0%E6%8E%96%E5%B8%82%E8%8B%8F%E5%8D%97%E8%A3%95%E5%9B%BA%E6%97%8F%E8%87%AA%E6%B2%BB%E5%8E%BF';
		url=url.replace(/navi\.htm.*/, "start.html" + info);
	url
exports = this
exports.emulateData = emulateData