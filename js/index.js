/**
 * == QQ Logo Period Animation =========================================================================
 * Copyright (c) 2012 Tencent AlloyTeam, All rights reserved.
 * http://www.AlloyTeam.com/
 * Code licensed under the BSD License:
 * http://www.AlloyTeam.com/license.txt
 * 
 * @version 1.0
 * @author  AishenHu(<a href="mailto:hit.huzhichao@gmail.com">hit.huzhichao@gmail.com</a>)
 * @description: QQ Logo Period Animation
 * -------------------------------------------------------------- 2012.10.25 ----------------------------
 */
Jx().$package("qqlogo.util", function(J){
    var $A = J.array,
        $D = J.dom,
        $E = J.event;
    var isArray = function(obj) {
        return Object.prototype.toString.call(obj) === '[object Array]';
    }

    var animationChain = {
        cur: 0,
        animations : [],
        init: function(){
            $E.on($D.id('qq'), 'webkitAnimationEnd', function(){
                console.log('qq ', animationChain.cur);
                var ani = animationChain.animations[animationChain.cur];
                if(ani.callback){
                    ani.callback();
                }
                animationChain.cur ++;
                animationChain.next();                
            });
        },
        add : function(element, aniName, delay, callback){
            delay = delay || 0;
            var _this = this;
            var ani = {
                element: element,
                aniName: aniName,
                delay : delay,
                id: this.animations.length,
                callback: callback
            }
            this.animations.push(ani);
            return animationChain;
        },

        start: function(){
            console.log(this.animations);
            this.next(this.cur);
        },

        next: function(id){   
            var cur = this.cur;
            if(cur < this.animations.length){        
                var ani = this.animations[cur];
                if(ani.delay == 0){
                    ani.element.start(ani.aniName);
                }else{
                    setTimeout(function(){
                        ani.element.start(ani.aniName);
                    }, ani.delay);
                } 
            }
        }
    }
    animationChain.init();
    this.isArray = isArray;
    this.animationChain = animationChain;
});

Jx().$package("qqlogo.period",function(J) {
    var $D = J.dom,
    	$  = $D.mini,
        $E = J.event,
        $A = J.array,
        $U = qqlogo.util;
        isPeriod = false;

    var CONFIG = {
        
    }

    /**
     * module
     */
    var head, 
        body, 
        hand, 
        foot, 
        leftEye, 
        rightEye, 
        mouthTop,
        mouthBottom,
        lips,
        fix,
        inner,
        outter,
        leftHandTop,
        leftHandBottom,
        rightHandTop,
        rightHandBottom,
        scarf,
        scarfEnd,
        scarfShadow,
        scarfShadowRight,
        scarfEndShadow,
        leftToe,
        rightToe;

    /**
     * module container
     */
    var mouthTopContainer,
        mouthBottomContainer,
        lipsContainer,
        leftHandTopContainer,
        leftHandBottomContainer,
        rightHandTopContainer,
        rightHandBottomContainer,
        leftFootTopWrapper,
        leftFootBottomWrapper,
        rightFootTopWrapper,
        rightFootBottomWrapper;

    var Modules = {
        modules: [],
        baseLeft: 0,
        baseRight: 0,
        init : function(){

        },

        addModule:function(module){
            this.modules.push(module);
            return this;
        },

        period: function(isRemove){
            var _this = this;
            $A.forEach(this.modules, function(item){
                item.period(isRemove);
            })
        },

        getPeriodCount: function(){
            var count = 0;
            $A.forEach(this.modules, function(item){
                if(this.state == 1){
                    count ++ ;
                }
            });
            return count;
        }
    }

    function module(el ,left, top){
        this.left = left || 0;
        this.top = top || 0;
        this.el = el;
        this.state = 0;  //state 0 stands for no period

        this.updatePosition = function(left, top){
            this.el.style.left = left + 'px';
            this.el.style.top = top + 'px';
        }

        this.period = function(isRemove){
            isRemove = isRemove || false;
            _periodItem(this.el, isRemove);
            if(isRemove){
                this.state = 1;
            }
        }

        this.start = function(aniStep){
            $D.addClass(this.el, aniStep);
        }
    }

    var initPeriodStage = function(){
        _periodItem($('body'));
        _periodItem($('header'));
        _periodItem($('.copyright'));

        mouthTopContainer = $(".mouthTopContainer")[0];
        mouthBottomContainer = $(".mouthBottomContainer")[0];
        lipsContainer = $('.lipsContainer')[0];
        leftHandTopContainer = $('.leftHandTopContainer')[0];
        leftHandBottomContainer = $('.leftHandBottomContainer')[0];
        rightHandTopContainer = $('.rightHandTopContainer')[0];
        rightHandBottomContainer = $('.rightHandBottomContainer')[0];
        leftFootTopWrapper = $('.leftFootTopWrapper')[0];
        leftFootBottomWrapper = $('.leftFootBottomWrapper')[0];
        rightFootTopWrapper = $('.rightFootTopWrapper')[0];
        rightFootBottomWrapper = $('.rightFootBottomWrapper')[0];


        mouthTopContainer.style.overflow = "visible";
        mouthBottomContainer.style.overflow = "visible";
        lipsContainer.style.overflow = "visible";
        leftHandTopContainer.style.overflow = "visible";
        leftHandBottomContainer.style.overflow = "visible";
        rightHandTopContainer.style.overflow = "visible";
        rightHandBottomContainer.style.overflow = "visible";
        leftFootTopWrapper.style.overflow = "visible";
        leftFootBottomWrapper.style.overflow = "visible";
        rightFootTopWrapper.style.overflow = "visible";
        rightFootBottomWrapper.style.overflow = "visible";

        head = new module($D.id('head'));
        body = new module($D.id('body'));
        hand = new module($D.id('hand'));
        foot = new module($D.id('foot'));

        leftEye = new module($('.left.eye')[0]);
        rightEye = new module($('.right.eye')[0]);
        mouthTop = new module($('.mouthTop')[0]);
        mouthBottom = new module($('.mouthBottom')[0]);
        lips = new module($('.lips')[0]);
        lipShadowLeft = new module($('.lipShadow.left')[0]);
        lipShadowRight = new module($('.lipShadow.right')[0]);
        scarf = new module($('.scarf')[0]);
        scarfEnd = new module($('.scarfEnd')[0]);
        scarfShadow = new module($('.scarfShadow')[0]);
        scarfShadowRight = new module($('.scarfShadowRight')[0]);
        scarfEndShadow = new module($('.scarfEndShadow')[0]);
        inner = new module($('.inner')[0]);
        outter = new module($('.outter')[0]);
        leftHandTop = new module($('.leftHandTop')[0]);
        leftHandBottom = new module($('.leftHandBottom')[0]);
        rightHandTop = new module($('.rightHandTop')[0]);
        rightHandBottom = new module($('.rightHandBottom')[0]);
        leftToe = new module($('.left.toe')[0]);
        rightToe = new module($('.right.toe')[0]);

        Modules.addModule(head)
            .addModule(body)
            .addModule(hand)
            .addModule(foot)
            .addModule(leftEye)
            .addModule(rightEye)
            .addModule(mouthTop)
            .addModule(mouthBottom)
            .addModule(lips)
            .addModule(lipShadowLeft)
            .addModule(lipShadowRight)
            .addModule(scarf)
            .addModule(scarfEnd)
            .addModule(scarfShadow)
            .addModule(scarfShadowRight)
            .addModule(scarfEndShadow)
            .addModule(inner)
            .addModule(outter)
            .addModule(leftHandTop)
            .addModule(leftHandBottom)
            .addModule(rightHandTop)
            .addModule(rightHandBottom)
            .addModule(leftToe)
            .addModule(rightToe);
    }

    var endPeriodStage = function(){
    	_periodItem($('body'), true);
    	_periodItem($('header'), true);
        _periodItem($('.copyright'), true);
    }

    var _initPeriodAnimation = function(){
        Modules.period();
    }

    var _startPeriodAnimation = function(){ 
        $U.animationChain.add(head, 'animation1')
                         .add(head, 'animation2')
                         .add(leftEye, 'animation1')  
                         .add(leftEye, 'animation2')
                         .add(leftEye, 'animation3')  
                         .add(rightEye, 'animation1')
                         .add(rightEye, 'animation2')
                         .add(rightEye, 'animation3')
                         .add(mouthTop, 'animation1')
                         .add(mouthTop, 'animation2')
                         .add(mouthTop, 'animation3', 3000, function(){console.log('done')});
        ;$U.animationChain.start();
    }

    var _endPeriodAnimation = function(){
    	Modules.period(true);
    }

    function _periodItem(item, bRemove){
        bRemove = bRemove || false;
        if(!$U.isArray(item)){
            item = [item];
        }
        for( var i in item ){
            bRemove ? $D.removeClass(item[i], 'period') : $D.addClass(item[i], 'period');
        }
    }

    var onDbClick = function(e){
    	if(!isPeriod){
    		isPeriod = true;
    		initPeriodStage(); 
    		_initPeriodAnimation();   		
    	}else{
    		//isPeriod = false;
    		//endPeriodStage();
    		//_endPeriodAnimation();
            _startPeriodAnimation();
    	}
    }

    var init = function(){
    	$E.addEventListener($D.mini('body')[0], 'dblclick', onDbClick);
    	var count = 0;
    }

    $E.onDomReady(init);
});