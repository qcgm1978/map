// 导航段概览信息
MRoute.NaviGuideItem = Class({
    distance:0,         //当前分段路径长度, 单位：米
    driveTime:0,        //当前分段行驶时间，单位：分钟
    directionIcon:0,    //当前分段转向图标
    roadName:"",        //路径名称
    startLon:0,         //起始点经度
    startLat:0,         //起始点纬度

    "initialize":function(){
    }
});

// locationCode 信息
MRoute.LocationCodeItem = Class({

    code:0,		// 编码
    dist:0,		// 长度
    time:0,		// 时间
   "initialize":function(){
	}   
});

// 路况信息
MRoute.RoadStatus = Class({
    nSpeed : 0,		 // 速度
    eStatus : 0,     // 状态
    "initialize":function(){
    }
});

/**
	// 路况状态
    0, // 道路状态未知。
    1, // 道路通畅。
    2, // 道路缓行。
    3, // 道路阻塞严重。
*/


// 导航信息属性
MRoute.DGNaviInfor = Class({

	eNaviType:0,            // 当前导航类型，1为模拟导航，2为GPS导航
    eTurnIcon:0,            // 导航段转向图标
	curRoadName:"",         // 当前道路名称
	nextRoadName:"",        // 下条道路名称
	nSAPADist:-1,           // 距离最近服务区的距离，, 单位米，若为-1则说明距离无效，没有服务区
	nCameraDist:-1,         // 距离最近电子眼距离，, 单位米，若为-1则说明距离无效，没有电子眼
    nLimitedSpeed:0,        // 当前道路速度限制，单位公里/小时
	nRouteRemainDist:0,     // 路径剩余距离, 单位米
	nRouteRemainTime:0,     // 路径剩余时间，单位分钟
	nSegRemainDist:0,       // 当前导航段剩余距离, 单位米
	nSegRemainTime:0,       // 当前导航段剩余时间，单位分钟
	nCarDirection:0,        // 自车方向，0 - 360度
    fLongitude:0,           // 自车经度位置
    fLatitude:0,            // 自车纬度位置
	nCurSegIndex:0,         // 当前自车所在导航段编号;
    nCurLinkIndex:0,        // 当前自车所在Link编号
    nCurPtIndex:0,          // 当前自车距离最近的形状点位编号
	
	"initialize":function(){		
	}
});

/********************************************************************
	导航段转向图标定义如下：
	1			// 自车图标
	2			// 左转图标
	3			// 右转图标
	4			// 左前方图标
	5			// 右前方图标
	6			// 左后方图标
	7			// 右后方图标
	8			// 左转掉头图标
	9			// 直行图标
	10		// 到达途经点图标
	11		// 进入环岛图标
	12		// 驶出环岛图标
	13		// 到达服务区图标
	14		// 到达收费站图标
	15		// 到达目的地图标
	16		// 进入隧道图标
********************************************************************/


// 车位信息属性
MRoute.VPLocation = Class({

    dLon:0,                         //  当前自车经度
    dLat:0,                         //  当前自车纬度
    nAngle:0,                       // 当前车辆的方向
	nSpeed:0,                       // 当前自车速度
    "initialize":function(){
    }
});

/**
 * 导航点
 */
MRoute.NaviPoint = Class({	
	coorFactor : 3600 * 64,
	x:0,
	y:0,	
	"initialize":function(x,y){//设置坐标
		if(/^(-?[1-9][0-9]*|0)$/.test(x)){//整形
			this.x = x/this.coorFactor;
			this.y = y/this.coorFactor;
		}else{//浮点型
			this.x = x;
			this.y = y;
		}
	},
});
