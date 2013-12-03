'use strict'
define(['fastdom','jquerymx'] ,(fastdom)->
  $.Model('MapRouteView',
  {
    defaults: {
      tmcIndexRate: 3.6,
      widthLightBar: 0.95,
      tmcContainer: $('#route_tmc'),
      normalContainer: $('#route_normal'),
      tmcTrafficIndex: $('#tmc_traffic_index'),
      tmcDistance: $('#tmc_distance'),
      tmcTimeEle: $('#tmc_time'),
      normalTrafficIndex: $('#normal_traffic_index'),
      normalDistance: $('#normal_distance'),
      normalTimeEle: $('#normal_time'),
      trafficIndice:
        green: 'images/green.png',
        yellow: 'images/yellow.png',
        red: 'images/red.png'
      }
  }
  {
    init:  (config) ->
      if (typeof config is 'undefined') then       return
      this.normalRouteLength = config.normalRouteLength;
      this.normalTime = config.normalTime;
      this.tmcRouteLength = config.tmcRouteLength;
      this.tmcTime = if config.tmcTime < config.normalTime then config.tmcTime else config.normalTime
      this.arrTmcTraffic = config.arrTmcTraffic;
      this.arrNormalTraffic = config.arrNormalTraffic
      this.arrTrafficCol = config.arrTrafficCol
  #          todo to modularize or expend the model
    drawLight: (arrTraffic, container, length) =>
      if (container.find('p').length != 0) then container.find('p').remove()
      totalLength = container.width() - 2
      $p = $('<p/>')
      .css({
          'max-width': totalLength
        })
      .addClass('light_bar full_light_bar')
      $.each(arrTraffic[0],  (i, n)->
        len = Math.round(n / length * totalLength)
        color = this.arrTrafficCol[arrTraffic[1][i]]
        $('<blockquote/>')
        .css({
            width: len,
            backgroundColor: color
          })
        .addClass('light_bar_seg')
        .appendTo($p)
      )
      $p.appendTo(container)
    displayData: ->
      this.setUi();
      this.displayTmcData();
      this.displayNormalData();
    setUi: ->
      $path_info = $('#path_info')
      scaleBtn=fastdom.read(->
	      fastdom.write( ->
	            top1=$path_info.position().top - 57
	            top2=$path_info.position().top - 94
	            $('#zoom_out').css('top',top1);
	            $('#zoom_in').css('top',top2);
	            fastdom.clear(scaleBtn)

	        )

      )
      tmcBtn=fastdom.write(->
        $('#tmc_btn').hide();
        $('#navi').hide()
        $path_info.css({'visibility': 'visible'})
        fastdom.clear(tmcBtn)
       )


    getTrafficIndiceBg: (trafficInd) ->
          'url(' + this.trafficIndice[this.getTrafficIndiceCol(trafficInd)] + ')'
    displayTmcData:  (lenTime)->
      fastdom.write(=>
        this.tmcDistance.text(util_common.unit_conversion(this.tmcRouteLength)+'千米');
        this.tmcTimeEle.text(util_common.formatMinute(this.tmcTime));
        trafficInd = this.getTrafficInd(this.getSpeed(this.tmcRouteLength, this.tmcTime));
        this.tmcTrafficIndex
        .text(trafficInd)
        .css('background-image', this.getTrafficIndiceBg(trafficInd));
        if (this.normalTime - this.tmcTime > 0)
          $('#save_time').html("<blockquote class='save_time_txt'>省时<blockquote id='save_time_number'>" + (this.normalTime - this.tmcTime) + "</blockquote>分钟</blockquote>");
        else
          $('#save_time').html("飞路快推荐路线");
      )
    displayNormalData:->
      fastdom.write(=>
        this.normalDistance.text(util_common.unit_conversion(this.normalRouteLength)+'千米');
        this.normalTimeEle.text(util_common.formatMinute(this.normalTime));
        trafficInd = this.getTrafficInd(this.getSpeed(this.normalRouteLength, this.normalTime));
        this.normalTrafficIndex
        .text(trafficInd)
        .css('background-image', this.getTrafficIndiceBg(trafficInd));
      )
    getSpeed:  (length, time) ->
      length / (time * 60) * this.tmcIndexRate;
    getTrafficInd:  (speed) ->
        if (speed > 0 && speed <= 10)
        then 1;
        else if (speed > 10 && speed <= 15)
          2;
        else if (speed > 15 && speed <= 20)
          3;
        else if (speed > 20 && speed <= 25)
          4;
        else if (speed > 25 && speed <= 30)
          5;
        else if (speed > 30 && speed <= 40)
          6;
        else if (speed > 40 && speed <= 50)
          7;
        else if (speed > 50 && speed <= 60)
          8;
        else if (speed > 60 && speed <= 80)
          9;
        else if (speed > 80)
          10;

      #     匹配交通颜色

      getTrafficIndiceCol:  (index)->
        if (index > 0 && index <= 3)
          'red'
        else if (index > 3 && index <= 6)
          'yellow';
        else if (index > 6 && index <= 10)
          'green'
        else
          0
  }
  )
)
