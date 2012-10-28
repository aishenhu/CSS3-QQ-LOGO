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
            $A.forEach(this.animations, function(item){
                item.element.el.style.webkitTransition = 'none';
            });
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
        },
        reset : function(){
            this.animations = [];
            this.cur = 0;
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
        $U = qqlogo.util,
        isPeriod = false;

    var PeriodInfo = {
        init : function(){
            this.el = $('.periodInfo')[0];
        },

        show : function(text){
            text = text || 'QQ Logo Period'
            this.changeText(text);
            $D.addClass(this.el, 'period');
        }, 

        hide : function(){
            $D.removeClass(this.el, 'period');
        },

        changeText: function(text){
            this.el.innerHTML = text;
        }
    }

    var Hello = {
        init: function(){
            this.el = $('.hello')[0];
            $E.on(this.el, 'click', this.onClick);
        },

        show: function(text){
            var text = text || "Hello, World! I'm from TAT!";
            this.changeText(text);
            $D.addClass(this.el, 'period');
        },

        changeText: function(text){
            this.el.innerHTML = text;
        }, 

        hide : function(){
            $D.removeClass(this.el, 'period');
        },

        onClick: function(event){
            window.location.reload();
        }
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
        rightToe,
        leftFootTop,
        leftFootBottom,
        rightFootTop,
        rightFootBottom,

        mLeftHandTopContainer,
        mLeftHandBottomContainer,
        mRightHandTopContainer,
        mRightHandBottomContainer;

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
        }, 

        reset : function(){
            this.modules = [];
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
        leftFootTop = new module($('.leftFootTop')[0]);
        leftFootBottom = new module($('.leftFootBottom')[0]);
        rightFootTop = new module($('.rightFootTop')[0]);
        rightFootBottom = new module($('.rightFootBottom')[0]);

        mLeftHandTopContainer = new module(leftHandTopContainer);
        mLeftHandBottomContainer = new module(leftHandBottomContainer);
        mRightHandTopContainer = new module(rightHandTopContainer);
        mRightHandBottomContainer = new module(rightHandBottomContainer);

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
            .addModule(rightToe)
            .addModule(leftFootTop)
            .addModule(leftFootBottom)
            .addModule(rightFootTop)
            .addModule(rightFootBottom);

        Modules.addModule(mLeftHandBottomContainer)
               .addModule(mLeftHandTopContainer)
               .addModule(mRightHandTopContainer)
               .addModule(mRightHandBottomContainer);
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
        PeriodInfo.changeText('Let\'s Go');
        /**
         * Head part animation
         */
        $U.animationChain.add(head, 'animation1')
                         .add(head, 'animation2',0,function(){PeriodInfo.changeText('Eye Begin')})
                         .add(leftEye, 'animation1')  
                         .add(leftEye, 'animation2')
                         .add(leftEye, 'animation3')  
                         .add(rightEye, 'animation1')
                         .add(rightEye, 'animation2')
                         .add(rightEye, 'animation3',0, function(){PeriodInfo.changeText('Mouth Begin')})
                         .add(mouthTop, 'animation1')
                         .add(mouthTop, 'animation2')
                         .add(mouthTop, 'animation3', 500)
                         .add(mouthBottom, 'animation1')
                         .add(mouthBottom, 'animation2')
                         .add(mouthBottom, 'animation3',500, function(){
                            mouthBottomContainer.style.overflow = 'hidden';
                            mouthTopContainer.style.overflow = 'hidden';
                            PeriodInfo.changeText('Lips Begin');
                         })
                         .add(lips, 'animation1')
                         .add(lips, 'animation2')
                         .add(lips, 'animation3', 300, function(){
                            PeriodInfo.changeText('Lips fix');
                         })
                         .add(lipShadowLeft, 'animation1')
                         .add(lipShadowLeft, 'animation2', 100)
                         .add(lipShadowLeft, 'animation3')
                         .add(lipShadowRight, 'animation1', 100, function(){
                            PeriodInfo.changeText('Head Complete! Go Body');
                         });

        /**
         * body part animation
         */
        $U.animationChain.add(body, 'animation1')
                         .add(scarf, 'animation1', 0, function(){
                            PeriodInfo.changeText('building...');
                         })
                         .add(outter, 'animation1')
                         .add(inner, 'animation1')
                         .add(scarfEnd, 'animation1')
                         .add(scarfEnd, 'animation2')
                         .add(scarf, 'animation2')
                         .add(outter, 'animation2')
                         .add(inner, 'animation2')
                         .add(scarfEnd, 'animation3')
                         .add(body, 'animation2',0,function(){
                            PeriodInfo.changeText('Body Complete! Go Hand');
                         });


        // /**
        //  * hand part animation
        //  */
        $U.animationChain.add(hand, 'animation1',0, function(){PeriodInfo.changeText('Hand')})
                        .add(leftHandTop, 'animation1')
                        .add(leftHandBottom, 'animation1')
                        .add(mLeftHandTopContainer, 'animation1')
                        .add(mLeftHandBottomContainer, 'animation1', 0, function(){
                            leftHandTopContainer.style.overflow = "hidden";
                            leftHandBottomContainer.style.overflow = "hidden";
                        })
                        .add(leftHandTop,'animation2', 500)
                        .add(leftHandBottom, 'animation2')
                        .add(rightHandTop, 'animation1')
                        .add(rightHandBottom, 'animation1')
                        .add(mRightHandTopContainer, 'animation1')
                        .add(mRightHandBottomContainer, 'animation1', 100, function(){
                            rightHandTopContainer.style.overflow = "hidden";
                            rightHandBottomContainer.style.overflow = "hidden";
                        })
                        .add(rightHandTop,'animation2', 500)
                        .add(rightHandBottom, 'animation2')
                        .add(hand, 'animation2',500,function(){
                            PeriodInfo.changeText('Hand Complete! Go Foot')
                        });

        /**
         * foot part animation
         */
        $U.animationChain.add(foot, 'animation1', 500, function(){
                                PeriodInfo.changeText('Four Sub Modules of foot');
                            })
                         .add(leftFootTop, 'animation1')
                         .add(leftFootBottom, 'animation1')
                         .add(rightFootBottom, 'animation1')
                         .add(rightFootTop, 'animation1',200, function(){
                            PeriodInfo.changeText('Combine');
                         })
                         .add(leftFootTop, 'animation2')
                         .add(leftFootBottom, 'animation2')
                         .add(rightFootTop, 'animation2',0, function(){
                            PeriodInfo.changeText('Will Cut by Container')
                         })
                         .add(rightFootBottom, 'animation2',0, function(){
                            leftFootTopWrapper.style.overflow = "hidden";
                            leftFootBottomWrapper.style.overflow = "hidden";
                            rightFootTopWrapper.style.overflow = "hidden";
                            rightFootBottomWrapper.style.overflow = "hidden";
                         })
                         .add(foot, 'animation2', 500, function(){
                            PeriodInfo.changeText('Foot Done. Go Shadow Fix')
                            //PeriodInfo.changeText('Mission Complete!')
                         });

        /**
         * shadow fix animation
         */
        $U.animationChain.add(scarfShadow, 'animation1', 200, function(){
                                PeriodInfo.changeText('Shadow Fix');
                            })
                         .add(scarfShadowRight, 'animation1')
                         .add(scarfEndShadow, 'animation1')
                         .add(leftToe,'animation1')
                         .add(rightToe, 'animation1', 0,function(){
                            PeriodInfo.changeText('Mission Complete!');
                            Hello.show();
                            setTimeout(function(){
                                PeriodInfo.hide();
                            }, 500);
                         });

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
    		isPeriod = false;
            PeriodInfo.show();    //
            setTimeout(function(){_startPeriodAnimation();},2000);
    	}
    }

    var init = function(){
    	$E.addEventListener($D.mini('#qq')[0], 'dblclick', onDbClick);
        $E.on($('.new')[0], 'click', function(){
            if(introduce.isShow){
                introduce.hide();
            }else{
                introduce.show();
            }
        });
        PeriodInfo.init();
        Hello.init();
        introduce.init();
    	var count = 0;
    }

    var introduce = {
        init : function(){

        },
        show: function(){
            this.isShow = true;
            $D.id('qq').style.marginLeft = '-420px';
            $('.introduce')[0].style.left = '0px';
        },
        hide: function(){
            this.isShow = false;
            $D.id('qq').style.marginLeft = '0px';
            $('.introduce')[0].style.left = '420px';
        }
    }

    this.introduce = introduce;

    this.init = init;

    $E.onDomReady(init);
});