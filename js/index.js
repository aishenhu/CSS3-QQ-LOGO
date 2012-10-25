/**
 * == QQ Logo Period Animation =========================================================================
 * Copyright (c) 2012 Tencent AlloyTeam, All rights reserved.
 * http://www.AlloyTeam.com/
 * Code licensed under the BSD License:
 * http://www.AlloyTeam.com/license.txt
 * 
 * @version 2.0
 * @author  AishenHu(<a href="mailto:hit.huzhichao@gmail.com">hit.huzhichao@gmail.com</a>)
 * @description QQ Logo Period Animation
 * -------------------------------------------------------------- 2012.10.25 ----------------------------
 */

Jx().$package("qqlogo.period",function(J) {
    var $D = J.dom,
    	$  = $D.mini,
        $E = J.event,
        isPeriod = false;

    var initPeriodStage = function(){
    	$D.addClass($('body')[0], 'period');
    	$D.addClass($('header')[0], 'period');
    }

    var endPeriodStage = function(){
    	$D.removeClass($('body')[0], 'period');
    	$D.removeClass($('header')[0], 'period');
    }

    var _startPeriodAnimation = function(){
    	$D.addClass($D.id('head'), 'period');
    }

    var _endPeriodAnimation = function(){
    	$D.removeClass($D.id('head'), 'period');
    }

    var onDbClick = function(e){
    	if(!isPeriod){
    		isPeriod = true;
    		initPeriodStage(); 
    		_startPeriodAnimation();   		
    	}else{
    		isPeriod = false;
    		endPeriodStage();
    		_endPeriodAnimation();
    	}
    }

    var init = function(){
    	$E.addEventListener($D.mini('body')[0], 'dblclick', onDbClick);
    	var count = 0;
    	$E.on($D.id('head'), 'webkitTransitionEnd', function(){

    	});
    }

    $E.onDomReady(init);
});