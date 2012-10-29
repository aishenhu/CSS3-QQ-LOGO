/**
 * css3效果的模块化
 * 以类似于jQuery插件的方式进行使用
 *
 * 文件依赖：
 * css-----------CSS3Module.css
 * js------------jquery.latest.min.js
 *         |
 *         ------jquery.tmpl.min.js
 *         |
 *         ------CSS3Module.js 
 *
 * @author aishenhu
 * @date 2012.09.28
 */

;
(function($){
	/**
	 * CSS3效果组件的HTML代码模板，定义HTML结构，添加相应的class, id
	 * 为了防止冲突，类名均以'ismart-'作为前缀
	 * @type {Object}
	 */
	var CSS3Template = {
		flipTemplate: '<div class="ismart-flipcontainer">\
					   		<div class="ismart-flipfront">\
					   		</div>\
					   		<div class="ismart-flipbackface">\
					   		</div>\
					   </div>'
	}

	/**
	 * 对元素的一个属性进行前缀赋值
	 * @param  {jQ dom节点} element jQuery选择结果
	 * @param  {[type]} prop    [description]
	 * @param  {[type]} value   [description]
	 * @return {[type]}         [description]
	 */
	function prefixedPropertySign(element, prop, value){
		var pref = ['', '-webkit-', '-moz-', '-o-', '-ms-'];
		for(var p in pref){
			element.css(pref[p] + prop, value);
		}
	}

	/**
	 * CSS3D双面切换组件
	 * 动画切换的方法:为.ismart-flipcontainer切换类flipped，
	 * 添加flipped类，即运行显示backface，反之显示front，可以直接
	 * 对元素的类进行操作。也可使用使用提供的flipGo，flipBack，flipToggle方法
	 * @type {Object}
	 *
	 * !!!初始化函数名不能使用init与jQuery本身冲突
	 * 在页面中结合jQuery使用方法:
	 * @example
	 * 	      $(document).ready(function(){
	 *			$('.container').flip({
	 *				flipfront: $('#flipfront'),
	 *				flipbackface: '<div id = "flipbackface">\
	 *									<img src="backface.png"/>\
	 *							   </div>',
	 *				duration: .5,
	 *				timefunction:'linear',
	 *				perspective:'800px',
	 *				perspectiveOrigin:'50% 50%',
	 *				flipGoEnd: function(event){
	 *					console.log(this, 'Now, it\'s backface.');
	 *				},
	 *				flipBackEnd: function(event){
	 *					console.log(this, 'Now, we are back!');
	 *				}
	 *			}).click(function(){
	 *				$(this).flipToggle();
	 *			});
	 *		});
	 */
	var FlipContainer = {
		_dom:'',
		_init: function(opt){
			$.template("flipTemplate", CSS3Template.flipTemplate);
			var flipdom = $.tmpl("flipTemplate");
			var container = $(FlipContainer._dom);
			container.append(flipdom);
			var width = opt.width || container.width();
			var height = opt.height || container.height();

			var flipcontainer = container.find('.ismart-flipcontainer');
			var flipfront = container.find('.ismart-flipfront');
			var flipbackface = container.find('.ismart-flipbackface');

			/**
			 * 分别对front容器和backface容器中注入内容，若opt中没有指定
			 * 则使用默认文本
			 * ！！！容器中的原有内容将被清空
			 * @return {[type]} [description]
			 */
			var flipfrontContent = (function(){
				flipfront.empty().append(opt.flipfront);
				return opt.flipfront;
			})() || (function(){
				flipfront.empty().append('<p>Hello, world!</p>');
			})();
			var flipbackfaceContent = (function(){
				flipbackface.empty().append(opt.flipbackface);
				return opt.flipbackface;
			})() || (function(){
				flipbackface.empty().append('<p>I\'m the backface, :)</p>');
			})();

			/**
			 * 分别自定义的时间间隔，时间函数，透视perspective, perspectiveOrigin(-_-||)
			 * 
			 */
			if(opt.duration){
				prefixedPropertySign(flipcontainer.find('.ismart-flipfront,.ismart-flipbackface'),
					'transition-duration', opt.duration+'s');
			}

			/**
			 * 动画的时间函数
			 * linear|ease|ease-in|ease-out|ease-in-out|cubic-bezier(n,n,n,n);
			 */
			if(opt.timefunction){
				prefixedPropertySign(flipcontainer.find('.ismart-flipfront,.ismart-flipbackface'),
					'transition-timing-function', opt.timefunction);
			}

			if(opt.perspective){
				prefixedPropertySign(flipcontainer, 'perspective', opt.perspective);
			}

			/**
			 * perspective-origin: x-axis y-axis;
			 * --------------------------------------------------
			 *	Defining where the view is placed at the x-axis
			 *	Possible values:
			 *	left
			 *	center
			 *	right
			 *	length
			 *	%
			 *	Default value: 50%
			 *	---------------------------------------------------
			 *	Defining where the view is placed at the y-axis
			 *	Possible values:
			 *	top
			 *	center
			 *	bottom
			 *	length
			 *	%
			 *	Default value: 50%
			 *	-----------------------------------------------------
			 */
			if(opt.perspectiveOrigin){
				prefixedPropertySign(flipcontainer, 'perspective-origin', opt.perspectiveOrigin);
			}

			/**
			 * 绑定翻转结束事件的处理函数，回调函数中的this将被设置成动画的’触发元素‘
			 * 每次移除或者添加flipped都将会触发transition，结束之后将会产生transitionend事件
			 * 应用到FlipContainer组件中，需要做一次事件的过滤，在该情景下，每两次事件只能相应
			 * 一次，（事件被中断的情况除外）
			 */
			if(opt.flipGoEnd){
				FlipContainer.setFlipGoEnd.call(flipcontainer, opt.flipGoEnd);
			}

			if(opt.flipBackEnd){
				FlipContainer.setFlipBackEnd.call(flipcontainer, opt.flipBackEnd);
			}

			/**
			 * border设置
			 */
			if(opt.border){
				flipfront.css('border', opt.border);
				flipbackface.css('border', opt.border);
			}

			if(opt['box-shadow']){
				flipfront.css('box-shadow', opt['box-shadow']);
				flipbackface.css('box-shadow', opt['box-shadow']);
			}

			/**
			 * 设定绕x或者y轴旋转
			 * dir: x (y)
			 */
			if(opt.dir){
				var dir = 'flip' + opt.dir.toUpperCase();
				flipcontainer.addClass(dir);
			}
		},
		/**
		 * Make a container flip
		 * @param  {object} opt 自定义配置参数
		 * @return {object}     返回当前对象，保持jQuery的链式调用结构
		 */
		flip: function(opt){
			FlipContainer._dom = this;
			opt = opt || {};
			FlipContainer._init(opt);
			return this;
		},
		/**
		 * 动画控制函数:显示backface
		 */
		flipGo: function(){
			$(this).find('.ismart-flipcontainer').addClass('flipped');
			return this;
		},
		/**
		 * 动画控制函数:显示front
		 */
		flipBack: function(){
			$(this).find('.ismart-flipcontainer').removeClass('flipped');
			return this;
		},
		/**
		 * 动画控制函数:切换front和backface的显示
		 */
		flipToggle: function(){
			$(this).find('.ismart-flipcontainer').toggleClass('flipped');
			return this;			
		},

		/**
		 * 设置front面的内容
		 */
		setFlipfront: function(front){
			$(this).find('.ismart-flipfront').empty().append(front);
			return this;
		},

		/**
		 * 设置backface面的内容
		 */
		setFlipbackface: function(backface){
			$(this).find('.ismart-flipbackface').empty().append(backface);
			return this;
		},

		/**
		 * 绑定动画结束事件
		 * @param {Function} callback 回调函数，回调函数中的this对象为.ismart-flipfront
		 */
		setFlipGoEnd: function(callback){
			var goEnd = function(event) {
				if($(this).parent().hasClass('flipped')){
					callback.call(this, event);
				}
			}
			/**
			 * 绑定transitionend事件
			 * @todo 将事件绑定交由adapter完成
			 */
			$(this).find('.ismart-flipfront').bind('webkitTransitionEnd', goEnd)
											 .bind('mozTransitionEnd',goEnd)
											 .bind('oTransitionEnd',goEnd)
											 .bind('msTransitionEnd',goEnd)
											 .bind('transitionend',goEnd);
			return this;
		},
		/**
		 * 绑定动画结束事件
		 * @param {Function} callback 回调函数，回调函数中的this对象为.ismart-flipbackface
		 */
		setFlipBackEnd: function(callback){
			var goBack = function(event){
				if(!$(this).parent().hasClass('flipped')){
					callback.call(this, event);
				}
			}
			$(this).find('.ismart-flipbackface').bind('webkitTransitionEnd', goBack)
												.bind('mozTransitionEnd', goBack)
												.bind('oTransitionEnd', goBack)
												.bind('msTransitionEnd', goBack)
												.bind('transitionend', goBack);
			return this;
		},

		getFlipState: function(){
			return $(this).find('.ismart-flipcontainer').hasClass('flipped');
		}
	}
	$.fn.extend(FlipContainer);
})(window.jQuery);