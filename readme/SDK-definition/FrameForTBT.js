

var tbt;
function MinFrame(){
	/// 在启动框架函数时创建tbt对象，将框架的引用赋给tbt对象，以使得tbt内部能调用框架接口
    tbt = new MRoute.CTBT(this, "");
}

MinFrame.prototype = {

    /**
     * 响应TBT模块的HTTP请求
     * 此接口为异步接口，调用占用实现者的线程，函数调用必须立即返回
     * @param iModelID      模块号：1 移动交通台，2 TMC，3 在线导航
     * @param iConnectID    连接ID，Frame请求到数据后用此ID将数据传给TBT
     * @param strURL        请求的URL串
     * @param strHead       HTTP头，默认为空
     * @param strData       Post方式的Data数据，默认为空
     * @param bGetMode      true为Get方式，false为post方式
     */
		NetRequestHTTP:function(
			iModelID,				
			iConnectID,				
			strURL,					
			strHead,				
			strData,				
			bGetMode	    		
			){},

    /**
     * 更新导航信息
     * @param DGNaviInfor  参见DGNaviInfor定义
     */
        UpdateNaviInfor:function(DGNaviInfo){
        },

    /**
     * 播报一个字符串
     * @param iType    语音类型：1 导航播报，2 前方路况播报
     * @param SoundStr  要播报的字符串
     */
        PlayNaviSound:function(iType, SoundStr){
        },
		
    /**
     * 停止模拟导航
     * 指引模拟导航结束后通知Frame以便更新UI界面等
     */
        EndEmulatorNavi:function(){

        },
     /**
     * 通知到达途经点或目的地
     * @param iWayID  标号从1开始，如果到达目的地iWayID为-1
     */
		ArriveWay:function(iWayID){

        },
		
    /**
     * 通知需要重新规划路径 一般应调用TBT的Reroute函数完成路径重规划
     * 当偏离原路径时触发，用户可控制重新规划的逻辑
     */
        Reroute:function(){

        },
		

	/**
     * 通知重新规划路径, 因TMC改变触发
     */
        RerouteForTMC:function(){

        },		
		
    /**
     * 通知当前路径销毁
     */
        RouteDestroy:function(){

        },
		
    /**
     * 通知当前匹配后的GPS位置点
     * @param vpLocation  当前匹配后的点，参见VPLocation结构
     */
        CarLocationChange:function(vpLocation){

        },
		

	/**
     * 通知路径计算状态
     * @param eState  参见RouteRequestState定义，异步实现
     * 	说    明：requestRouteState含义如下
     *  1	路径计算成功
     *  2	网络超时
     *  3	网络失败
     *  4	请求参数错误
     *  5	返回数据格式错误
     *  6	起点周围没有道路
     *  7	起点在步行街
     *  8	终点周围没有道路
     *  9	终点在步行街
     *  10	途经点周围没有道路
     *  11	途经点在步行街
     */
        SetRequestRouteState:function(eState){

        },
		
    /**
     * 通知动态信息改变
     * 动态更新后，需要更新光柱等
     */
        TMCUpdate:function(){

        },

    /**
     * 隐藏车道信息
     */
        HideLaneInfo:function(){
        },

    /**
     * 隐藏路口扩大图
     */
        HideCross:function(){
        },

    /**
     * 关闭情报板
     */
        HideTrafficPanel:function(){

        },
    /**
     * 显示车道信息
     * @param BackInfo  {Array} 车道背景信息
     * @param SelectInfo {Array} 车道选择信息
     */
        ShowLaneInfo:function(BackInfo, SelectInfo){
        },

    /**
     * 显示路口扩大图
     * @param width     扩大图的宽度
     * @param height    扩大图的高度
     * @param data      扩大图数据
     */
        ShowCross:function(dwCrossWidth, dwCrossHeight, data){
        },

    /**
     * 显示情报板
     * @param width     情报板宽度
     * @param height    情报板高度
     * @param data      情报板数据
     */
        ShowTrafficPanel:function(dwWidth, dwHeight, data){
        }

};