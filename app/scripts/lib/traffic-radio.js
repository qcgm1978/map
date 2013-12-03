/**
 * Created with JetBrains WebStorm.
 * User: qcgm1978
 * Date: 7/24/13
 * Time: 3:45 PM
 * Use:
 */
MRoute.TrafficRadio = Class({

    m_pstFrame:null,
    naviPath:null,

    m_bIsLoginSuccess:false, // 是否登录成功
    m_bJustReqSuccess:false, // 刚请求成功了态势数据
    m_ePicState:0, // 是否在显示情报板

    m_nPID:0, // 终端打包PCD或fcd数据时使用该ID，使用此ID作为PCD或fcd的上传ID
    m_strPID:"00000000",
    m_bisForce:false, //是否强制请求路况信息
    m_pPFcdBuf:null, //请求路况信息的PCD或FCD数据
    m_pResultBuf:null,

    timer:null,

    m_arrDescription:[],

    m_strAddress:"",
    m_strPinCode:"", // 后台形成的临时PIN码，终端每次请求都必须带此PIN码回来
    m_pstrUsercode:"",
    m_pstrUserbatch:"",
    m_strUserID:"", // 唯一用户标识(DeviceID/SimID/UUID)
    m_strTimeStamp:"", // 结果时机戳
    m_strDescription:"",

    TIME_INTERVAL:300000, // 5分钟timer
    TMC_ROUTE_RANGE:10000, // 经路查找形状点的距离范围
    MIN_DIS_TO_DEST:1000, // 能播报态势的最小距目的地范围(小于此范围不播报态势)
    DIFF_DIS_BETWEEN_POINT:500, // 两次态势播报的最小距离差值

    MAX_DESCRIPTION_NUM:5,


    "initialize":function (pstFrame, strUserCode, strBatch, strDeviceId) {
        this.m_pstFrame = pstFrame;
        this.m_strAddress = "http://211.151.71.28:8888/RouteStatusService/Handle.do?";
        //this.m_strAddress = "http://trafficapp.autonavi.com:8888/RouteStatusService/Handle.do?";
        this.m_pstrUsercode = strUserCode;
        this.m_pstrUserbatch = strBatch;
        this.m_strUserID = strDeviceId;

        this.start();
    },


    /**
     * 设置关联路径，
     * @param path
     */
    SetNaviRoute:function (path) {
        this.naviPath = path;
    },

    /**
     * 请求前方路况播报
     * @param pcdData
     * @param ptList        [I]前方路径的经纬度序列
     * @param bUpload
     * @param bHand
     * @constructor
     */
    RequestTraffic:function (pcdData, ptList, bUpload, bHand) {
        if (!this.m_bIsLoginSuccess) {
            return false;
        }

        if (pcdData == null || pcdData.length == 0) {
            if (this.m_pPFcdBuf == null || this.m_pPFcdBuf.length == 0) {
                return false;
            }
            pcdData = this.m_pPFcdBuf;
        }

        return this.requestTmcStateData(pcdData, ptList, bUpload, bHand);
    },


    /**
     * 设置网络请求状态
     */
//    SetNetRequestState:function (iConnectID, eNetState) {
//
//    },


    /**
     * 解析数据
     * @param iConnectID
     * @param data
     */
    receiveNetData:function (iConnectID, data) {
        if (data == null || data.length == 0) {
            return;
        }

        // 若是压缩数据，先解压，反之直接赋值
        // js版假定已完成解压
        this.m_pResultBuf = "" + data;

        var bRet = false,
            CnID = MRoute.ConnectId;

        switch (iConnectID) {
            case CnID.CONNECTID_TRAFFIC: // 解析前方态势数据
                bRet = this.parseReqDataResult(this.m_pResultBuf);
                if (bRet && this.m_arrDescription.length > 0) {
                    this.playTmcState(this.m_arrDescription);
                }
                break;
            case CnID.CONNECTID_LOGON: // 解析登录结果
                bRet = this.parseLogonResult(this.m_pResultBuf);
                break;
            case CnID.CONNECTID_LOGOFF: // 解析注销结果
                bRet = this.parseLogoffResult(this.m_pResultBuf);
                break;
            case CnID.CONNECTID_PIC:  // 解析概要图数据
                //bRet = this.parseBoardPicResult(this.m_pResultBuf);
                break;
            case CnID.CONNECTID_ROUTE:
                bRet = this.parseRouteTrafficResult(this.m_pResultBuf);
                break;
            default:
                break;
        }
    },

    /**
     * 更新PCD或FCD数据
     * @param data
     * @param result
     */
    UpdatePF:function (data, result) {
        if (data == null || data.length == 0) {
            return;
        }
        this.m_pPFcdBuf = data;
        this.m_bisForce = !!((result == MRoute.ProbeResult.ProbeResult_Turning));

        //通知请求前方路况
        this.m_pstFrame.NoticeRequestTrafficInfo();
    },

    /**
     * 设置请求参数
     * @param x
     * @param y
     * @param iSegNo
     * @param iStartSegLen
     */
    SetTmcReqParam:function (x, y, iSegNo, iStartSegLen) {
        if (this.naviPath == null) {
            return "";
        }

        var dist = 0,
            sList = "",
            segNum = this.naviPath.getSegmentCount();
        for (var i = iSegNo; i < segNum; i++) {
            var curSeg = this.naviPath.getSegmentByID(i);
            if (curSeg != null) {
                var tmcRecords = curSeg.getTmcInfo();
                if (tmcRecords == null || tmcRecords.length == 0) {
                    continue;
                }
                for (var j = 0; j < tmcRecords.length; j++) {
                    dist += tmcRecords[j].getLength();
                    if (i == iSegNo && dist < iStartSegLen) {
                        continue;
                    }
                    var code = tmcRecords[j].getLCode();
                    if (sList.length > 0) {
                        sList += ",";
                    }
                    sList += code.toString();
                    if (dist > 50000) {
                        break;
                    }
                }
            }
            if (dist > 50000) {
                break;
            }
        }

        if (sList.length == 0) {
            return false;
        }

        var size = 180;
        // 写入xml头, type=80表示请求内容中屏蔽items和evaluation元素
        var sParam = "<\?xml version=\"1.0\" encoding=\"gbk\"\?><request>";

        // 写入当前位置x，y
        sParam += "<frontQuery x=\"" + x + "\" y=\"" + y + "\" type=\"80\" descSize =\"" + size + "\"><list>";

        // 写入xml尾
        sParam += sList;
        sParam += "</list></frontQuery></request>";

        return sParam;
    },


    //请求整条路径的态势数据
//    RequestRouteTraffic:function (iGPSGeoX, iGPSGeoY, iSegNo, iStartSegLen) {
//
//    },

    loginFailedCount:0,

    ThreadProc:function () {
        this.m_pstFrame.NoticeRequestTrafficInfo();
    },

    start:function () {
        if (this.timer != null) {
            this.stop();
        }

        var self = this;
        this.timer = window.setInterval(function () {
            self.ThreadProc();
        }, 60000); //1000*60*2

    },

    stop:function () {
        if (this.timer) {
            window.clearInterval(this.timer);
            this.timer = null;
        }
    },

    Login:function () {
        if (this.m_bIsLoginSuccess) {
            return;
        }

        var strBuf = this.m_strAddress + "cmdtype=logon&usercode=" + this.m_pstrUsercode;
        strBuf += "&userbatch=";
        strBuf += this.m_pstrUserbatch;
        strBuf += "&deviceid=";
        strBuf += this.m_strUserID;

        this.m_pstFrame.NetRequestHTTP(MRoute.ConnectId.CONNECTID_LOGON, strBuf, null, null, false);
    },

    Logout:function () {
        if (!this.m_bIsLoginSuccess) {
            return true;
        }

        var strBuf = this.m_strAddress + "cmdtype=logout&pincode=" + this.m_strPinCode;

        this.m_pstFrame.NetRequestHTTP(MRoute.ConnectId.CONNECTID_LOGOFF, strBuf, null, null, false);
        return true;
    },

    //判断是否符合请求态势时机，请求态势播报数据
    requestTmcStateData:function (pPcdBuf, ptList, bUpload, bHand) {

        if (pPcdBuf == null || pPcdBuf.length == 0) {
            return false;
        }

        var strBuf,
            bForce = false,
            bReqPic = false,
            bShowPic = this.m_pstFrame.GetShowTrafficPic();
        if (!this.m_pstFrame.GetPlayTrafficVoice() && !bShowPic) {
            bForce = true;
        }

        if (bShowPic
            && this.m_ePicState != MRoute.PicState.Traffic_Pic_Show
            && this.m_ePicState != MRoute.PicState.Traffic_Pic_Change) {
            bReqPic = true;
        }

        strBuf = this.m_strAddress + "cmdtype=trafficinfo&pincode=" + this.m_strPinCode;
        strBuf += "&datatype=1";
        strBuf += "&gpsdata=";

        var strBin = pPcdBuf.substring(0, 3) + this.m_strPID + pPcdBuf.substring(11);
        strBuf += MRoute.Base64.encode(strBin);

//        var  strBase64 = MRoute.Base64.encode(strBin);
//        //urlEncode need supply
//        strBuf += strBase64;

        // 未经压缩
        strBuf += "&compress=0";

        // 预测点列表
        var bHavePt = ptList != null && ptList.length > 0 && (ptList.length % 2 == 0);
        if (bHavePt) {
            strBuf += "&frontcoords=";
            for (var i = 0; i < ptList.length; i++) {
                if (i > 0) {
                    strBuf += ",";
                }
                strBuf += ptList[i].toString();
            }
        }

        // 合成请求标志
        var dwFlag = 0;
        if (bForce || bUpload) {
            dwFlag |= MRoute.RadioFlag.FLAG_FORCE_UPLOAD;
        }
        if (bReqPic) {
            dwFlag |= MRoute.RadioFlag.FLAG_REGION_BOARD;
        }
        if (this.m_bisForce || bHand) {
            dwFlag |= MRoute.RadioFlag.FLAG_NO_FILTER;
        }
        if (bHavePt) {
            dwFlag |= MRoute.RadioFlag.FLAG_ASSIST_ROAD;
        }

        dwFlag |= MRoute.RadioFlag.FLAG_INCIDENT;
        dwFlag |= MRoute.RadioFlag.FLAG_DESCRIPTION;

        strBuf += "&flag=" + dwFlag;

        this.m_pstFrame.NetRequestHTTP(MRoute.ConnectId.CONNECTID_TRAFFIC, strBuf, null, null, false);
        return true;
    },

    //播报当前路况
    playTmcState:function (arrStr) {
        if (!arrStr || arrStr.length == 0) {
            return false;
        }
        if (this.m_pstFrame.GetPlayTrafficVoice()) {
            for (var i = 0; i < arrStr.length; i++) {
                this.m_pstFrame.PlayNaviSound(arrStr[i]);
            }
        }
        this.m_arrDescription = [];
        return true;
    },

    _getText_:function (node) {
        return node.childNodes[0].nodeValue;
    },

    _parseState_:function (root) {
        var status = -1,
            node;
        node = root.firstChild;
        if (node && node.nodeName == "status") {
            status = Number(this._getText_(node));
        }
        else {
            return null;
        }

        node = node.nextSibling;
        if (node && node.nodeName == "timestamp") {
            this.m_strTimeStamp = this._getText_(node);
        }
        else {
            return null;
        }

        if (status != 0) {
            if (status == 2) {
                this.m_bIsLoginSuccess = false;
            }
            return null;
        }

        return node;
    },

    _getRoot_:function (buf) {
        var parser = new DOMParser(),
            xmlDom = parser.parseFromString(buf, "text/xml");

        if (!xmlDom || !xmlDom.documentElement) {
            return null;
        }

        var root = xmlDom.documentElement;
        if (!root.nodeName || root.nodeName != "response") {
            return null;
        }

        return root;
    },


    //解析登录返回的结果
    parseLogonResult:function (buf) {

        var root = this._getRoot_(buf);
        if (!root) {
            return false;
        }

        // 属性验证
        if (root.getAttribute("type") != "logon") {
            return false;
        }

        var node = this._parseState_(root);
        if (!node) {
            return false;
        }

        node = node.nextSibling;
        if (node && node.nodeName == "pincode") {
            this.m_strPinCode = this._getText_(node);
        }
        else {
            return false;
        }

        // not used
        node = node.nextSibling;
        if (node && node.nodeName == "pid") {
            var str = this._getText_(node);
            if (str.length > 9) {
                var strLow = str.slice(str.length - 9),
                    strMid,
                    strHigh,
                    id = Number(strLow);
                if (str.length > 18) {
                    strMid = str.slice(str.length - 18, str.length - 9);
                    strHigh = str.slice(0, str.length - 18);
                    id += Number(strMid) * Math.pow(10, 9) + Number(strHigh) * Math.pow(10, 18);
                }
                else {
                    strHigh = str.slice(0, str.length - 9);
                    id += Number(strHigh) * Math.pow(10, 9);
                }
                this.m_nPID = id;

            }
            else {
                this.m_nPID = Number(str);
            }
        }
        else {
            return false;
        }

        this.m_bIsLoginSuccess = true;
        return true;
    },


    //解析注销返回的结果
    parseLogoffResult:function (buf) {

        var root = this._getRoot_(buf);
        if (!root) {
            return false;
        }

        // 属性验证
        if (root.getAttribute("type") != "logout") {
            return false;
        }

        if (!this._parseState_(root)) {
            return false;
        }

        this.m_bIsLoginSuccess = false;
        return true;
    },

    //解析数据请求的结果
    parseReqDataResult:function (buf) {
        var root = this._getRoot_(buf);
        if (!root) {
            return false;
        }

        // 属性验证
        if (root.getAttribute("type") != "trafficinfo") {
            return false;
        }

        var node = this._parseState_(root);
        if (!node) {
            return false;
        }

        node = node.nextSibling;
        if (node && node.nodeName == "front") {
            for (var child = node.firstChild; child != null; child = child.nextSibling) {
                if (this.m_arrDescription.length < this.MAX_DESCRIPTION_NUM) {
                    var str = this._getText_(child);
                    if (str && str.length > 0) {
                        this.m_arrDescription.push(str);
                        if (!this.m_bJustReqSuccess) {
                            this.m_bJustReqSuccess = true;
                        }
                    }

                }
            }
        }
        else {
            return false;
        }

        if (this.m_pstFrame.GetShowTrafficPic()) {
            node = node.nextSibling;
            if (node && node.nodeName == "url") {
                var strBuf = this.m_strAddress + "cmdtype=boardpic&pincode=" + this.m_strPinCode;
                strBuf += "&picid=" + this._getText_(node);
                strBuf += "&size=480x320" + "&whscale=true";
                this.m_pstFrame.NetRequestHTTP(MRoute.ConnectId.CONNECTID_PIC,
                    strBuf, null, null, false);
            }
        }
        return true;
    },

    //解析概要图数据的结果
//    parseBoardPicResult:function (buf) {
//    },



    /**
     * 解析数据
     * @param data
     */
    ParserTmc:function (data) {
        var nCode = 0,
            nStart = -1,
            nEnd = -1,
            info = "";
        if (data != null && data.length > 0) {
            nStart = data.indexOf("<description>");
            nEnd = data.indexOf("</description>");
            if (nStart != -1 && nEnd > nStart) {
                nCode = 1;
                info = data.substring(nStart + 13, nEnd);
            }
            else {
                nStart = data.indexOf("<error>");
                nEnd = data.indexOf("</error>");
                if (nStart != -1 && nEnd > nStart) {
                    nCode = 2;
                    info = data.substring(nStart + 7, nEnd);
                }
            }
        }

        return [nCode, info];
    },

    //解析请求路径的前方态势数据的结果,暂时没有用到
    parseRouteTrafficResult:function (buf) {
        console.log("parse 前方态势数据"+buf);
        var res = this.ParserTmc(buf),
            code = res[0],
            str = res[1];
        if (code != 1) {
            return false;
        }
        this.m_pstFrame.PlayNaviSound(2, str);

    }

});