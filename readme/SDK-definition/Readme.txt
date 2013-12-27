Class.js  				定义js中类对象的组织形式，tbt会实现为class形式。
struct.js 				定义接口使用的数据结构和枚举变量
TBT.js					定义TBT类提供的外部接口
FrameForTBT.js     		定义框架接口，为TBT类触发的事件提供响应，如更新界面等

1.0版 TBT JS SDK 含有 46个接口函数，有8个未获完全支持，这些函数是：
	//尚未添加实时tmc， trafficradio的支持
    OpenTMC:function(){ },
    CloseTMC:function(){},
    OpenTrafficRadio:function(){ },
	CloseTrafficRadio:function(){},
	PlayTrafficRadioManual:function(){},
	GetRoadStatus:function(wLocationCode){},
	CreateTMCBar:function(iBufWidth, iBufHeight, eDirection, iStart, iLength){},
	
	//函数可用，但目前不支持多起点，仅支持途径点
	RequestRouteHaveStart:function(eCalcType, startArr, endArr){}
	
没有区分详细和简单播报，调用如下函数并不会得到不同的播报结果。
	SetNaviType:function(iNaviType){}

还缺乏 路口放大图，交通信息板的相应支持。

