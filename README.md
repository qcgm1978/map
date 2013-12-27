# flynavi 
[![Build Status](https://secure.travis-ci.org/aponxi/flynavi.png?branch=master)](http://travis-ci.org/aponxi/flynavi)

> flynavi subproject of map development repository

## Jump to Section

* [Installation](#installation)
* [Usage](#usage)
* [Deploy Diagram](#deploy-diagram)
* [Ajax Protocal](#ajax-protocal)
* [Functionality](#functionality)
* [Document Location](#document-location)
* [Deployment](#deployment)

## Installation
[[Back To Top]](#jump-to-section)

本README文件格式为.md,需使用专门的md查看软件，也可通过chrome或canary扩展查看：[MarkView](https://chrome.google.com/webstore/detail/markview/iaddkimmopgchbbnmfmdcophmlnghkim) ，安装后需在扩展管理处允许该扩展访问本地文件。

- 北京前端开发部门的所有项目基于nodejs构建。使用grunt技术构建。
- [npm](http://nodejs.org/download/)

-   从代码库update后需安装依赖插件
```
npm install
```

- 参考：
[grunt get-started](http://gruntjs.com/getting-started)


## Usage
[[Back To Top]](#jump-to-section)

本文档包括以下内容：
    应用程序部署图：应用程序（或服务）部署服务器说明。

    协议文档：服务器交互相关数据库表和字段的意义。

    project说明文档：功能介绍、部署方式、文档位置等。

    tdd explanation

## Deploy Diagram
[[Back To Top]](#jump-to-section)

北京前端部门负责项目在测试服务器的部署，需登录测试服务器进行文件上传。以下为登录信息，谨供参考，详情联系史彦民或姜绵岳。

		* 222.44.39.44
		* port: 22
		* usename: raxtonebj
		* dir: /project/
		* pwd:RaxToneBj

  各项目与服务器文件夹对应关系(兴趣点分享页面对应本项目)
   ![relation](readme/deploy-diagram.png)

## Ajax Protocal
[[Back To Top]](#jump-to-section)

 - 客户端与服务器端交互协议参考姜绵岳发送的《飞路快导航接口协议文档》和《飞路快导航三期接口定义说明书》，
 - 《[飞路快导航接口协议文档](readme/飞路快导航接口协议文档-v2.2.1.12-201312181700.doc)》使用的内容包括：
    - 3.2.	登录接口：兴趣点分享获取预测省时，官网获取服务支持内容，帮助页面获取内容使用。
    - 3.83.线路预测：兴趣点分享获取预测省时使用。
    - 3.92根据优惠券：优惠券页面使用。
    - 3.93根据优惠券细分id获取优惠券列表：优惠券页面使用。
    - 3.99 获取帮助大分类和子分类：帮助页面使用。
    - 3.100 根据类别查询帮助：帮助页面使用。
    - 7.附录四：长链接格式：目的地分享、路径分享和优惠券页面使用。
 - 《[飞路快导航三期接口定义说明书](readme/飞路快导航三期接口定义说明书_v2.0_for_web201302211727.doc)》协议全部使用：
    -3.2.	获取最新动态接口：pc官网最新动态页面使用。
    - 3.3.	获取banner图接口：used by slides of pc and mobile portal homepage
    - 3.4.	获取下载页背景图接口: used by background-image of iphone and android downloading contents in pc portal homepage
    - 3.5.	获取最新软件版本接口: used by all the positions displaying version number in pc and mobile portal homepage
 - 相关数据库表和字段详情参考协议文档具体内容。
 - Relaxing the same-origin policy:
    - 服务代理模式: config by 王帅
    -  solution of development environment
        - Launch chrome or canary with [--disable-web-security](http://blog.sina.com.cn/s/blog_9df1c3cd01011i0p.html)

## Functionality
[[Back To Top]](#jump-to-section)

 - 本项目负责飞路快本地应用飞享兴趣点或路径后，发送短链接到目标设备，服务器端转换为长链接后在目标设备浏览器内打开。
 - 包括兴趣点展示、路径规划、路书三个页面状态，都在本页面展示：
    - [start.html](app/start.html)
 - data requesting by ajax:
    - 地图API
        - [高德地图API](http://api.amap.com/javascript/reference/map)
        - [路径规划API](readme/SDK-definition)
    - path prediction info after path planning

## Document Location
[[Back To Top]](#jump-to-section)

### Development environment architecture is generated by [Yeoman](http://yeoman.io/index.html)

 - The development code in ```map/app/```
 - The building file is ```Gruntfile.[coffee|js]``` in root dir and the building tasks in ```tasks``` folder. ```package.json``` and ```bower.json``` assist Gruntfile.[coffee|js].
 - The built code in ```dist/```
 - The ```readme``` folder contains the source of this doc. The readme.md is a description to all the project.
 - The ```jsdoc```  and ```yuidoc``` folder contains the code doc generated by ```grunt jsdoc``` or ```grunt yuidoc```
 - The ```node_modules``` folder contains package invoked by grunt.
 - ```.tmp``` folder will be generated as building that caches temporary files when converting development code to product code.
 - The ```tasks``` folder contains tasks file for building.

## Deployment
[[Back To Top]](#jump-to-section)

## All projects are built by grunt tech.

 1. via grunt
 ```
 grunt default:[test|verify|formal]:[version number]
 ```
 The first arg is the environment the project will deploy in, and the second is the version number of the current deployment.
    - arg indicates:
        - test: test server environment
        - verify: verify server environment
        - formal: formal server environment
    - the config file for building is portalPc.coffee or portalPc.js, and the latter is compiled by the former. The file
    contains all kinds of tasks for building that mainly includes 'copy', 'concat', 'cssmin', 'uglify', 'htmlmin', 'imagemin' etc.
    The building tasks are in tasks.[coffee|js] in tasks folder that contains which tasks will be executed.
    - building principle is based on [grunt](http://gruntjs.com/) tech.

 2. The product code for deployment will be generated after building which dir is portal_new/dist/, and the archive file will be generated if product built by verify or formal arg. The code in the dist dir is same to the files in relevant server.

 3. Upload the relevant folder to test server or deliver it to maintenance department to deploy on the verifying or formal server.

 4. Pls check Gruntfile.[coffee|js] or tasks.[coffee|js] if built code represent exception but development code works.



--------
<small>_This readme has been automatically generated by [readme generator](https://github.com/aponxi/grunt-readme-generator) on Wed Dec 25 2013 18:01:58 GMT+0800 (China Standard Time)._</small>