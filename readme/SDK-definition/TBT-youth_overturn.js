MRoute.CTBT = Class({

    /**
     * 初始化, 必先于其他接口函数调用
     * @param FrameForTBT   由用户实现的外部支持类的引用
     * @param strWorkPath   工作路径，TBT的一些配置文件等资料，以及输出信息将输出到此路径下
     * @param usrCode       用户码，从高德申请的到
     * @param usrBatch      用户码，从高德申请的到
     * @param deviceId      每个设备号必须唯一，可以是SIM卡号，也可以是设备唯一ID
     */
    "initialize":function(FrameForTBT, strWorkPath, usrCode, usrBatch, deviceId){},

    /**
     * 不再使用TBT时用来释放它管理的内部资源
     * 调用后不可调用其他接口
     */
    Destroy:function(){},

    /**
     * 调用此接口告知TBT当前的车辆位置
	 * 注意自车位置并不一定是算路起点
     * @param stLocation 车位所在经纬度，参见NavPoint定义
     */
    SetCarLocation:function(stLocation){},

    /**
     * 负责接收解析各连接所请求到的数据
	 * @param modelID   模块编号
     * @param connectID  连接编号
     * @param postStream 数据流
     */
    ReceiveNetData:function(modelID, connectID, postStream){},

    /**
     * 接口函数，通知网络请求成功或失败
     * @param connectID 连接号，区分不同连接
     * @param eNetState 请求状态,参见MRoute.NetRequestState定义
     *		1	请求成功
     *		2	请求失败
     *		3	请求超时
     *		4	用户手动结束请求
     */
    SetNetRequestState:function(connectID, eNetState) { },

    /**
     * 设置模拟导航的速度
     * 在系统初始化时，以及模拟导航速度变化时调用此接口
     * @param iEmulatorSpeed 所设置的车速，单位公里/小时
     */
    SetEmulatorSpeed:function(iEmulatorSpeed){},

    /**
     * 设置是否播报电子眼
     * 在系统初始化时，以及电子眼播报设置变化时调用此接口，默认播报电子眼
     * @param iIsEleyePrompt 0 为不播报，1为播报
     */
    SetEleyePrompt:function(iIsEleyePrompt){},

    /**
     * 设置导航的播报类型
     * 在系统初始化时，以及播报类型设置变化时调用此接口，默认详细播报
     * @param iNaviType 播报类型，1 简单播报，2 详细播报
     */
    SetNaviType:function(iNaviType){},

    /**
     * 设置TTS播报每个字需要的时间
     * 为了获得更好的播报效果，在导航前调用此接口来设置最准确的值
     * @param useTime 播报每个字需要的时间，单位为毫秒
     */
    SetPlayOneWordUseTime:function(useTime){},

    /**
     * 开始模拟导航
     * @return {Boolean} 请求是否成功
     */
    StartEmulatorNavi:function(){},

    /**
     * 开始GPS导航
     * @return {Boolean} 请求是否成功
     */
    StartGPSNavi:function(){},

    /**
     * 停止模拟导航
     * 路径信息仍然存在，可以再次导航
     */
    StopEmulatorNavi:function(){},

    /**
     * 暂停导航
     */
    PauseNavi:function(){},

    /**
     * 恢复导航
     */
    ResumeNavi:function(){},

    /**
     * 停止导航，不论是GPS还是Emulator导航
     * 路径被销毁，下次导航需要重新请求路径
     */
    StopGpsNavi:function(){},

    /**
     * 接收外部gps信息
     * @param longitude 经度, 单位度
     * @param latitude  纬度, 单位度
     * @param speed     速度，单位公里/小时？
     * @param direction 方向，单位度，以正北为基准，顺时针增加
     * @param year      年
     * @param month     月
     * @param day       日
     * @param hour      时
     * @param minute    分
     * @param second    秒
     */
    SetGPSInfo:function(longitude, latitude, speed, direction, year, month, day, hour, minute, second){},

    /**
     * 请求路径
     * TBTFrame要将请求结果状态通过SetRequestRouteState通知TBT
     * @param eCalcType 路径类型，参见MRoute.CalcType
     *	0	最优路径
     *	1	快速路优先
     *	2	距离优先
     *	3	普通路优先
     *	4	考虑实时路况的路线
     *	5	多路径（一条考虑实时交通路况路线，一条最优路线（未考虑实时交通））
     * @param destList  []途径点及终点数组，含各点经纬度信息，参见NaviPoint
     * @return {Boolean}
     */
    RequestRoute:function(eCalcType, destList){},

    /**
     * 响应外部调用，执行路径重算
     */
    Reroute:function(){},

    /**
     * 手动播报当前导航信息
     * 会视当前路况播报，不一定是前一条播报信息的重复
     * @return {Boolean} 
     */
    PlayNaviManual:function(){},


    /**
     * 选择路径
     * @param iRouteType 路径类型 
	 *	0	最优路径
     *	1	快速路优先
     *	2	距离优先
     *	3	普通路优先
     *	4	考虑实时路况的路线 
     * @return {Number} 0-4 被选中道路的路径类型
	 *						若没有指定类型，则选中首条路径，并返回其类型
     *                  -1 没有任何道路可选
     */
    SelectRoute:function(iRouteType){},

    /**
     * 获得行程Guide列表
     * @return {Array} GuideItem数组,参见NaviGuideItem定义
     */
    GetNaviGuideList:function(){},

    /**
     * 获得当前路径的导航段个数
     * 只有在收到SetRequestRouteState发送的接收成功消息后可使用
     * @return {Number} 有路径返回当前导航路径的导航段个数，否则返回0
     */
    GetSegmentNum:function(){},

    /**
     * 获得当前路径的长度，单位米
     * @return {Number}
     */
    GetRouteLength:function(){},

    /**
     * 获得当前路径的旅行时长，单位分钟，向上取整
     * @return {Number}
     */
    GetRouteTime:function(){ },

    /**
     * 获得一个导航段中Link的数量
     * @param iSegIndex 导航段编号，编号从0开始
     * @return {Number}
     */
    GetLinkNum:function(iSegIndex){},

    /**
     * 获得一个导航段的旅行时间,单位分钟，向上取整
     * @param iSegIndex 导航段编号，编号从0开始
     * @return {Number}
     */
    GetSegTime:function(iSegIndex){},

    /**
     * 获得一个导航段的长度,单位：米，向上取整
     * @param iSegIndex 导航段编号
     * @return {Number}
     */
    GetSegLength:function(iSegIndex){},

    /**
     * 获得一个导航段的收费长度,单位：米
     * @param iSegIndex 导航段编号
     * @return {Number}
     */
    GetSegChargeLength:function(iSegIndex){ },

    /**
     * 获得一个导航段的LocationCode的数目 
     * @param iSegIndex 导航段编号
     * @return {Number}
     */
    GetSegLocationCodeNum:function(iSegIndex){},

    /**
     * 获得一个LocationCodeItem 
     * @param iSegIndex 导航段编号
     * @param iLocIndex  code编号
     * @return {MRoute.LocationCodeItem} 参见LocationCodeItem定义
     */
    GetSegLocationCode:function(iSegIndex, iLocIndex){},

    /**
     * 获得一个导航段的形状坐标点列表
     * 当前iSegIndex小于总导航个数时返回形状点数组，否则返回空列表
     * @param iSegIndex 要获取信息的导航段编号，编号从0开始
     * @return {Array}坐标信息列表 ，按经度，纬度，经度，纬度顺序排列
     */
    GetSegCoor:function(iSegIndex){ },

    /**
     * 获得一个Link的形状坐标点列表
     * 输入参数正确返回列表，否则返回空列表
     * @param iSegIndex 要获取信息的导航段编号，编号从0开始
     * @param iLinkIndex 要获取信息的Link段编号，编号从0开始
     * @return {Array}坐标信息列表，按经度，纬度，经度，纬度顺序排列
     */
    GetLinkCoor:function(iSegIndex, iLinkIndex){},

    /**
     * 获得一个Link的道路名称
     * @param iSegIndex  要获取信息的导航段编号，编号从0开始
     * @param iLinkIndex 要获取信息的Link段编号，编号从0开始
     * @return {string}
     */
    GetLinkRoadName:function(iSegIndex, iLinkIndex){},

    /**
     * 获得一个Link的长度, 单位：米，向上取整
     * @param iSegIndex 要获取信息的导航段编号，编号从0开始
     * @param iLinkIndex 要获取信息的Link段编号，编号从0开始
     * @return {Number}
     */
    GetLinkLength:function(iSegIndex, iLinkIndex){},

    /**
     * 获得一个Link的旅行时长，单位：分钟，向上取整
     * @param iSegIndex 要获取信息的导航段编号，编号从0开始
     * @param iLinkIndex 要获取信息的Link段编号，编号从0开始
     * @return {Number}
     */
    GetLinkTime:function(iSegIndex, iLinkIndex){},

    /**
     * 获得一个Link的FormWay
     * @param iSegIndex 要获取信息的导航段编号，编号从0开始
     * @param iLinkIndex 要获取信息的Link段编号，编号从0开始
     * @return {Number} 枚举变量，参见MRoute.Formway
	 	说    明：FormWay定义如下
		1	// 主路
		2	// 路口内部道路
		3	// JCT道路
		4	// 环岛
		5	// 服务区
		6	// 匝道
		7	// 辅路
		8	// 匝道与JCT
		9	// 出口
		10	// 入口
		11	// A类右转专用道
		12	// B类右转专用道
		13	// A类左转专用道
		14	// B类左转专用道
		15	// 普通道路
		16	// 左右转专用道
		56	// 服务区与匝道
		53	// 服务区与JCT
		58	// 服务区与匝道以及JCT
     */
    GetLinkFormWay:function(iSegIndex, iLinkIndex){},

    /**
     * 获得一个Link的RoadClass
     * @param iSegIndex 要获取信息的导航段编号，编号从0开始
     * @param iLinkIndex 要获取信息的Link段编号，编号从0开始
     * @return {Number} 枚举变量，参见MRoute.RoadClass
	 	说    明：RoadClass定义如下
		0	高速公路
		1	国道
		2	省道
		3	县道
		4	乡公路
		5	县乡村内部道路
		6	主要大街、城市快速道
		7	主要道路
		8	次要道路
		9	普通道路
		10	非导航道路
     */
    GetLinkRoadClass:function(iSegIndex, iLinkIndex){},

    /**
     * 获得一个Link的LinkType
     * @param iSegIndex 要获取信息的导航段编号，编号从0开始
     * @param iLinkIndex 要获取信息的Link段编号，编号从0开始
     * @return {Number} 枚举变量，参见MRoute.LinkType
		说    明：LinkType定义如下
	 	0	普通道路
		1	航道
		2	隧道
		3	桥梁
     */
    GetLinkLinkType:function(iSegIndex, iLinkIndex){},

    /**
     * 获得一个LocationCode的状态 
	 * 在开启TMC功能并且动态有更新后可以查询
     * @param wLocationCode 路段对应的编码号
     * @return {Number} 查询到的道路状态
	 * 0,		// 道路状态未知
	 * 1,		// 道路通畅
	 * 2,		// 道路缓行
	 * 3,		// 道路阻塞严重	 
     */
    GetRoadStatus:function(wLocationCode){},
	
	/**
     * 接口函数，带起点的路径请求  未完成（目前仅支持单个起点）
     * @param eCalcType  算路类型，参见MRoute.CalcType
     * @param startArr  []起点数组，含各点经纬度信息，参见NaviPoint
     * @param endArr  []途径点及终点数组，含各点经纬度信息，参见NaviPoint
     * @return {Boolean}
     */
	RequestRouteHaveStart:function(eCalcType, startArr, endArr){},
	
    /**
     * 打开动态交通信息 
     * 系统初始化完默认动态交通信息是打开的
     */
    OpenTMC:function(){ },

    /**
     * 关闭动态交通信息 
     * 关闭动态交通信息后CreateTMCBar与GetRoadStatus将不能使用
     */
    CloseTMC:function(){},
	
	/**
     * 创建一个光柱  
     * 当前路径有动态信息则返回分段路况信息，一个数组指示分段路长，一个数组指示分段路况
     * @param iStart
     * @param iLength
	 * @return {Array,Array}
     */
    CreateTMCBar:function(iStart, iLength){},
	
	/**
     * 手动播报移动交通台信息 未完成（空）（缺TrafficRadio）
     * @return {Boolean}
     */
    PlayTrafficRadioManual:function(){},

    /**
     * 打开移动交通台功能, 系统初始化完默认路况是打开的 未完成（缺TrafficRadio）
     */
    OpenTrafficRadio:function(){ },

    /**
     * 关闭移动交通台功能 未完成（缺TrafficRadio）
     */
    CloseTrafficRadio:function(){}

});
