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

/**
 * 工具类
 * @return
 */
Jx().$package("qqlogo.util", function(J){
    var $A = J.array,
        $D = J.dom,
        $E = J.event;

    var isArray = function(obj) {
        return Object.prototype.toString.call(obj) === '[object Array]';
    }

    /**
     * 动画管理，串行执行一个序列的动画，支持时间延迟
     * 和自定义的回调函数
     * @type {Object}
     */
    var animationChain = {
        cur: 0,
        animations : [],
        /**
         * 使用'#qq' div进行webkitAnimationEnd事件统一监听处理
         */
        init: function(){
            var handler = function(){
                console.log('qq ', animationChain.cur);
                var ani = animationChain.animations[animationChain.cur];
                if(ani.callback){
                    ani.callback();
                }
                animationChain.cur ++;
                animationChain.next();                
            }
            $E.on($D.id('qq'), 'webkitAnimationEnd', handler);
            $E.on($D.id('qq'), 'mozAnimationEnd', handler);
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
            return animationChain;  //返回animationChain方便链式添加处理
        },

        /**
         * 执行动画序列
         * 先移除动画列表中每个元素的transition，transition和animation共同
         * 作用时，有时会有bug
         */
        start: function(){
            console.log(this.animations);
            $A.forEach(this.animations, function(item){
                item.element.el.style.webkitTransition = 'none';
                item.element.el.style.mozTransition = 'none';
            });
            this.next(this.cur);
        },

        /**
         * 执行下一个元素预定义的动画
         * 对延迟进行处理
         */
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

        /**
         * 重置动画列表数据
         */
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

    /**
     * 分解动画过程中的字幕提示
     * @type {Object}
     */
    var PeriodInfo = {
        init : function(){
            this.el = $('.periodInfo')[0];

            /**
             * 使用FlipContainer(@CSS3Module)处理信息提示
             */
            var _this = this;
            (function($){
                $('.periodInfo .container').flip({
                    flipfront: $('.front.flipInfo'),
                    flipbackface: $('.back.flipInfo'),
                    duration: .5,
                    timefunction:'linear',
                    perspective:'800px',
                    perspectiveOrigin:'50% 50%',
                    border: 'none',
                    'box-shadow': 'none',
                    dir: 'x',
                    flipGoEnd: function(event){
                        console.log(this, 'Now, it\'s backface.');
                    },
                    flipBackEnd: function(event){
                        console.log(this, 'Now, we are back!');
                    }
                });
            })(jQuery);
        },

        show : function(text){
            text = text || 'Preparing'
            this.changeText(text);
            $D.addClass(this.el, 'period');
        }, 

        hide : function(){
            $D.removeClass(this.el, 'period');
        },

        changeText: function(text){
            (function($){
                var front = $('.front.flipInfo');
                var back = $('.back.flipInfo');
                var flip = $('.container'); 
                if(flip.getFlipState() == true){
                    front.html(text);
                }else{
                    back.html(text);
                }
                flip.flipToggle();
            })(jQuery);
        }
    }

    /**
     * 结束语
     */
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
     * qq logo 的各个组成模块(module)
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
     * 用于定位和元素切割
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

    /**
     * 对module进行统一的管理
     * @type {Object}
     */
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

        /**
         * 动画模式切换
         * @param  {Boolean} isRemove true表示进入动画模式，false表示退出
         * @return 
         */
        period: function(isRemove){
            var _this = this;
            $A.forEach(this.modules, function(item){
                item.period(isRemove);
            })
        },

        /**
         * 获取已经进入到动画模式的module的个数
         * @return {[number]}
         */
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

    /**
     * 通过module统一动画过程
     * @param  {dom element} el   相关联的dom元素
     * @param  {number} left position left
     * @param  {number} top  position top
     * @return 
     */
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

    /**
     * 初始化Stage
     * 1、背景标题切换
     * 2、父层容器初始化，设置overflow为visible
     * 3、初始化module和Modules
     * @return {[type]} [description]
     */
    var initPeriodStage = function(){
        PeriodInfo.show('双击开始动画, :)')
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

    /**
     * 开始重组的动画
     * 依次添加module的自定义动画，自定义动画的细节
     * 定义在qq-logo-css3-period.css文件中
     */
    var _startPeriodAnimation = function(){ 
        this.isPeriodAnimationPlay = true;
        PeriodInfo.changeText('Let\'s Go');
        /**
         * Head part animation
         */
        $U.animationChain.add(head, 'animation1')
                         .add(head, 'animation2',0,function(){PeriodInfo.changeText('Eye Begin, Step 1');})
                         .add(leftEye, 'animation1',0,function(){PeriodInfo.changeText('Step 2')})  
                         .add(leftEye, 'animation2',0,function(){PeriodInfo.changeText('Step 3')})
                         .add(leftEye, 'animation3',0,function(){PeriodInfo.changeText('Step 4')})  
                         .add(rightEye, 'animation1',0,function(){PeriodInfo.changeText('Step 5')})
                         .add(rightEye, 'animation2',0,function(){PeriodInfo.changeText('Step 6')})
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
                            PeriodInfo.changeText('Building...');
                         })
                         .add(outter, 'animation1')
                         .add(inner, 'animation1')
                         .add(scarfEnd, 'animation1')
                         .add(scarfEnd, 'animation2')
                         .add(scarf, 'animation2',0, function(){
                            PeriodInfo.changeText('Paint the body')
                         })
                         .add(outter, 'animation2')
                         .add(inner, 'animation2')
                         .add(scarfEnd, 'animation3')
                         .add(body, 'animation2',0,function(){
                            PeriodInfo.changeText('Body Complete! Go Hand');
                         });


        /**
         * hand part animation
         */
        $U.animationChain.add(hand, 'animation1',0, function(){PeriodInfo.changeText('Hand')})
                        .add(leftHandTop, 'animation1')
                        .add(leftHandBottom, 'animation1')
                        .add(mLeftHandTopContainer, 'animation1')
                        .add(mLeftHandBottomContainer, 'animation1', 0, function(){
                            leftHandTopContainer.style.overflow = "hidden";
                            leftHandBottomContainer.style.overflow = "hidden";

                        })
                        .add(leftHandTop,'animation2', 500)
                        .add(leftHandBottom, 'animation2', 0, function(){
                            PeriodInfo.changeText('Left hand done');
                        })
                        .add(rightHandTop, 'animation1')
                        .add(rightHandBottom, 'animation1')
                        .add(mRightHandTopContainer, 'animation1')
                        .add(mRightHandBottomContainer, 'animation1', 100, function(){
                            rightHandTopContainer.style.overflow = "hidden";
                            rightHandBottomContainer.style.overflow = "hidden";
                        })
                        .add(rightHandTop,'animation2', 500)
                        .add(rightHandBottom, 'animation2', 0,function(){
                            PeriodInfo.changeText('Right Hand Done. Rush to body.');
                        })
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
                            PeriodInfo.changeText('Cut by Container')
                         })
                         .add(rightFootBottom, 'animation2',200, function(){
                            leftFootTopWrapper.style.overflow = "hidden";
                            leftFootBottomWrapper.style.overflow = "hidden";
                            rightFootTopWrapper.style.overflow = "hidden";
                            rightFootBottomWrapper.style.overflow = "hidden";
                            PeriodInfo.changeText('WoW, New shoes, ^_^');
                         })
                         .add(foot, 'animation2', 500, function(){
                            PeriodInfo.changeText('Foot Done. Go Shadow Fix')
                            //PeriodInfo.changeText('Mission Complete!')
                         });

        /**
         * shadow fix animation
         */
        $U.animationChain.add(scarfShadow, 'animation1', 200, function(){
                                PeriodInfo.changeText('Shadow Fix Working');
                            })
                         .add(scarfShadowRight, 'animation1')
                         .add(scarfEndShadow, 'animation1')
                         .add(leftToe,'animation1')
                         .add(rightToe, 'animation1', 0,function(){
                            PeriodInfo.changeText('Mission Complete!');
                            Hello.show();
                            Eye.blink();
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
            if(qqlogo.period.isPeriodAnimationPlay){
                return;
            }
    		isPeriod = false;
            PeriodInfo.show();
            setTimeout(function(){_startPeriodAnimation();},1000);
    	}
    }

    var init = function(){
    	$E.addEventListener($D.mini('body')[0], 'dblclick', onDbClick);
        
        PeriodInfo.init();
        Hello.init();
        introduce.init();
        New.init();
        Eye.init();
    	var count = 0;
    }

    /**
     * 新标签，切换更新介绍。使用本地存储，记录是否已经查看
     * @type {Object}
     */
    var New = {
        init: function(){
                this.el = $('.new')[0];
                $E.on(this.el, 'click', function(){
                    if(introduce.isShow()){
                        introduce.hide();
                    }else{
                        introduce.show();                        
                    }
                    New.addRecord();
                });
                if(!this.isRecord()){
                    setTimeout(function(){introduce.show();}, 500);
                }
        },
        addRecord: function(){
            J.localStorage.setItem('new', '1');
        },
        isRecord: function(){
            if(J.localStorage.getItem('new') && J.localStorage.getItem('new') == 1){
                return true;
            }
            return false;
        }
    }

    /**
     * 新版本的更新介绍
     * @type {Object}
     */
    var introduce = {
        init : function(){
            this.el = $('.introduce')[0];
        },
        show: function(){
            $D.addClass(this.el, 'show');
        },
        hide: function(){
            $D.removeClass(this.el, 'show');
        },
        isShow: function(){
            return $D.hasClass(this.el, 'show');
        }
    }

    var Eye = {
        init: function(){
            this.eyelipLeftTop = $('.eyelipLeftTop')[0];
            this.eyelipLeftBottom = $('.eyelipLeftBottom')[0];
            this.eyelipRightTop = $('.eyelipRightTop')[0];
            this.eyelipRightBottom = $('.eyelipRightBottom')[0];
            this.innerLeftEye = $('.innerLeftEye')[0];
            this.modules = [];
            this.modules.push(this.eyelipLeftTop);
            this.modules.push(this.eyelipLeftBottom);
            this.modules.push(this.eyelipRightTop);
            this.modules.push(this.eyelipRightBottom);
            this.modules.push(this.innerLeftEye);
        },

        blink: function(){
            $A.forEach(this.modules, function(item){
                $D.addClass(item, 'blink');
            });
        },

        removeBlink: function(){
            $A.forEach(this.modules, function(item){
                $D.removeClass(item, 'blink');
            });
        }
    }

    /**
     * 开场动画
     */
    

    this.introduce = introduce;

    this.init = init;

    $E.onDomReady(init);
});