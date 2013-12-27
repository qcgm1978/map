// +----------------------------------------------------------------------
// | MapABC WebRoute API
// +----------------------------------------------------------------------
// | Copyright (c) 2012 http://MapABC.com All rights reserved.
// +----------------------------------------------------------------------
// | Licensed AutoNavi MapABC
// +----------------------------------------------------------------------
// | Author: yhostc <yhostc@gmail.com>
// +----------------------------------------------------------------------

var Class = function() {
	//创建一个新类
    var cls = function() {
        if (arguments && arguments[0] != Class.isPrototype) {//第一个参数不为空函数时
            this["initialize"].apply(this, arguments);//构造函数
        }
    };
    var extended = {};
    var parent, initialize;
    for(var i=0, len=arguments.length; i<len; ++i) {
        if(typeof arguments[i] == "function") {
            //使第一个参数成为超类的基类
            if(i == 0 && len > 1) {
                initialize = arguments[i].prototype["initialize"];
                // 用户一个空函数替换initialize方法，因为我们不需要在此实例化。
                arguments[i].prototype["initialize"] = function() {};
                //确保新类有一个超类
                extended = new arguments[i];
                //还原原始的initialize方法
                if(initialize === undefined){
                    delete arguments[i].prototype["initialize"];
                }else{
                    arguments[i].prototype["initialize"] = initialize;
                }
            }
            //获得一个超类的原型
            parent = arguments[i].prototype;
        } else {
            //扩展原型
            parent = arguments[i];
        }
        extend(extended, parent);
    }
    cls.prototype = extended;
    return cls;
};

Class.isPrototype = function () {};
/**
 +------------------------------------------------------------------------------
 * 函数: extend
 * 复制源对象中所有所有属性到目标对象，以达到类继承的目的
 +------------------------------------------------------------------------------
 * 
 * > extend(destination, source);
 +------------------------------------------------------------------------------
 */
var extend = function(destination, source) {
    destination = destination || {};
    if(source) {
        for(var property in source) {
            var value = source[property];
            if(value !== undefined) {
                destination[property] = value;
            }
        }
        var sourceIsEvt = typeof window.Event == "function" && source instanceof window.Event;
        if(!sourceIsEvt && source.hasOwnProperty && source.hasOwnProperty('toString')) {
            destination.toString = source.toString;
        }
    }
    return destination;
};
