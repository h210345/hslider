(function($) {
	$.fn.hcjSlider = function(opts) {
		var elem = $(this), //传入的选择器
			li = elem.children(), //图片集合
			len = li.length; //图片长度
		// 不够效果的图片数 停止
		if (len <= 1 || this.length == 0) {
			return;
		}
		//默认参数
		var defaults = {
			tabNav: true, //有没有tab控制按钮 默认有
			pageNav: true, //有没有页码控制按钮 默认有
			tabNavPosition: 'middle', //tab控制按钮位置 默认中
			tabnavCur: 'current', //tab控制按钮当前样式
			tabNavChildStyle: 'span', //tab控制按钮公共样式
			effect: 'scroll', //动画的效果 默认滚动
			tabNavMr: 6, //默认是6
			prev: 'prev',
			next: 'next',
			direction: 'left',//方向
			firstScreenShowNum: 1, ////tab控制按钮右外边距 默认是1
			firstScreenShowMr: 0 //如果首屏显示个数大于1  给每个图片大的右边距 默认0
		};
		var options = $.extend(defaults, opts);
		// 如果每屏显示数大于等于总的长度
		if(options.firstScreenShowNum>=len){
			return;
		}
		var c = 0, //索引
			timer, //定时器
			lenW = li.eq(0).width(), //单个图片的宽度
			lenH = li.eq(0).height(), //单个图片的高度
			pos = elem.position(), //图片容器的定位位置
			controltabbox, //tab控制按钮box
			controltabnav, //tab控制按钮box中需要追加的元素
			next, //下一页
			prev, //上一页
			controltabboxChild; //tab控制按钮box集合
		//事件相关处理程序对象
		var eventFun = $.fn.hcjSlider.eventFun = {
			//下一页无缝滚动处理程序
			pagenClickwf: function() {
				if (eventFun._booleanAnimate()) {
					elem.animate({
						left: eventFun.returnWfRange(1)
					}, options.speed, function() {
						elem.css({
							left: 0
						});
						eventFun._replaceFirst(0);
					});
					if (c == len) {
						c = 0;
					}
				}
			},
			//上一页无缝滚动处理程序
			pagepClickwf: function() {
				if (eventFun._booleanAnimate()) {
					eventFun._replaceFirst(len);
					elem.css({
						left: eventFun.returnWfRange(1)
					});
					elem.animate({
						left: 0
					}, options.speed);
					if (c == 0) {
						c = len;
					}
					c--;
				}
			},
			//上一页无缝滚动处理程序 方向上
			pagepClickwfUp: function() {
				if (eventFun._booleanAnimate()) {
					eventFun._replaceFirst(len);
					elem.css({
						top: eventFun.returnWfRange(1)
					});
					elem.animate({
						top: 0
					}, options.speed);
					if (c == 0) {
						c = len;
					}
					c--;
				}
			},
			//下一页无缝滚动处理程序 方向上
			pagenClickwfUp: function() {
				if (eventFun._booleanAnimate()) {
					elem.animate({
						top: eventFun.returnWfRange(1)
					}, options.speed, function() {
						elem.css({
							top: 0
						});
						eventFun._replaceFirst(0);
					});
					if (c == len) {
						c = 0;
					}
				}
			},
			//返回无缝滚动的距离
			returnWfRange: function(m) {
				var ncRange;
				if (options.direction == 'up') {
					ncRange = pos.top - ((setStyle.elemParentH + options.firstScreenShowMr) * m);
				} else {
					ncRange = pos.left - ((setStyle.elemParentW + options.firstScreenShowMr) * m);
				}
				return ncRange;
			},
			//下一页谈入处理程序
			pagenClickEfade: function() {
				c++;
				if (c == len) {
					c = 0;
				}
				eventFun.eqClass(c, controltabboxChild);
				elem.children().eq(c).fadeIn(300).siblings().fadeOut(100);
			},
			//上一页谈入处理程序
			pagepClickEfade: function() {
				if (c == 0) {
					c = len;
				}
				c--;
				eventFun.eqClass(c, controltabboxChild);
				elem.children().eq(c).fadeIn(300).siblings().fadeOut(100);

			},
			//下一页滚到头再返回处理程序
			pagenClickScroll: function() {
				if (eventFun._booleanAnimate()) {
					c++;
					if (c == len) {
						c = 0;
					}
					eventFun.eqClass(c, controltabboxChild);
					elem.stop(true, true).animate({
						left: eventFun.returnWfRange(c)
					}, options.speed);
				}
			},
			//上一页滚到头再返回处理程序
			pagepClickScroll: function() {
				if (eventFun._booleanAnimate()) {
					if (c == 0) {
						c = len;
					}
					c--;
					eventFun.eqClass(c, controltabboxChild);
					elem.stop(true, true).animate({
						left: eventFun.returnWfRange(c)
					});
				}
			},
			//上一页无缝滚动;首位前面添加一个末尾的图片;末尾添加一个首位的图片 视差来实现无缝
			lookPagepClickScroll: function() {
				if (eventFun._booleanAnimate()) {
					if (c == 0) {
						c = len;
						elem.css({
							left: (c + 1) * pos.left
						});
					}
					c--;
					eventFun.eqClass(c, controltabboxChild);
					elem.stop(true, true).animate({
						left: eventFun.returnWfRange(c)
					}, options.speed);
				}
			},
			//下一页无缝滚动;首位前面添加一个末尾的图片;末尾添加一个首位的图片 视差来实现无缝
			lookPagenClickScroll: function() {
				if (eventFun._booleanAnimate()) {
					c++;
					if (c == len) {
						c = 0;
						elem.css({
							left: c * pos.left
						});
					}
					eventFun.eqClass(c, controltabboxChild);
					elem.stop(true, true).animate({
						left: eventFun.returnWfRange(c)
					}, options.speed);
				}

			},
			//上一页 向上无缝滚动;首位前面添加一个末尾的图片;末尾添加一个首位的图片 视差来实现无缝
			lookPagepClickScrollUp: function() {
				if (eventFun._booleanAnimate()) {
					if (c == 0) {
						c = len;
						elem.css({
							top: (c + 1) * pos.top
						});
					}
					c--;
					elem.stop(true, true).animate({
						top: eventFun.returnWfRange(c)
					}, options.speed);
				}
			},
			//下一页 向上无缝滚动;首位前面添加一个末尾的图片;末尾添加一个首位的图片 视差来实现无缝
			lookPagenClickScrollUp: function() {
				if (eventFun._booleanAnimate()) {
					c++;
					if (c == len) {
						c = 0;
						elem.css({
							top: c * pos.top
						});
					}
					elem.stop(true, true).animate({
						top: eventFun.returnWfRange(c)
					}, options.speed);
				}

			},
			//图片容器上一级父及的处理程序
			elemhover: function(event) {
				next.show(); //进入显示页码控制按钮
				prev.show();
				if (event.type == 'mouseenter') {
					eventFun._clearTimer(); //进入清楚定时器
				}
				if (event.type == 'mouseleave') {
					next.hide(); //离开隐藏页码控制按钮
					prev.hide();
					eventFun.setTimer(effects[options.effect]); //离开设置定时器
				}
			},
			//控制按钮切换图片
			timerOut: null,
			tabnavhover: function(event) {
				var index = $(this).index();
				c = index;
				if (event.type == 'mouseenter') {
					eventFun._clearTimer();
					if (options.effect == 'scroll' || options.effect == 'lookScroll') {
						eventFun.timerOut = setTimeout(function() {
							elem.stop(true, true).animate({
								left: pos.left + c * -setStyle.elemParentW
							}, options.speed);
							eventFun.eqClass(c, controltabboxChild);
						}, 200);
					}
					if (options.effect == 'efade') {
						eventFun.timerOut = setTimeout(function() {
							eventFun.eqClass(index, controltabboxChild);
							elem.children().stop(true, true).eq(index).fadeIn(400).siblings().fadeOut(400);
						}, 200);
					}
				}
				if (event.type == 'mouseleave') {
					clearTimeout(eventFun.timerOut);
				}
			},
			//控制按钮设置当前样式
			eqClass: function(num, obj) {
				obj.eq(num).addClass(options.tabnavCur).siblings().removeClass(options.tabnavCur);
			},
			//设置定时器
			setTimer: function(fun) {
				timer = setInterval(fun, len * options.speed);
			},
			//清楚定时器
			_clearTimer: function() {
				clearInterval(timer);
			},
			//判断是否处于动画
			_booleanAnimate: function() {
				if (!elem.is(":animated")) {
					return true;
				}
			},
			//图片首尾调换
			_replaceFirst: function(length) {
				var elemChild = elem.find('li');
				if (length == 0) { //此时首做尾
					if (options.firstScreenShowNum > 1) {
						elem.find('li:lt(' + options.firstScreenShowNum + ')').remove().appendTo(elem);
					} else {
						elemChild.eq(length).remove().appendTo(elem);
					}
				}
				if (length == len) { //此时尾做首
					console.log(len);
					if (options.firstScreenShowNum > 1) {
						var gtLen = (len - options.firstScreenShowNum) - 1;
						elem.find('li:gt(' + gtLen + ')').remove().prependTo(elem);
					} else {
						elemChild.last().remove().prependTo(elem);
					}
				}
			}
		};
		var setStyle = $.fn.hcjSlider.setStyle = {};
		setStyle.elemW = 0, setStyle.elemH = 0, setStyle.elemParentW = 0, setStyle.elemParentH; //给setStyle 添加四个公用属性 容器的宽度和容器父级的宽度
		//efade 效果需设置的样式
		setStyle.setFadeCss = function() {
			elem.height(lenH).parent().height(lenH);
			li.css({
				position: 'absolute',
				float: 'none',
				display: 'none'
			}).eq(0).show();
		};
		//不同效果 需设置图片容器宽度
		setStyle.setElemCss = function() {
			//每屏图片个数会影响其父级及父级的父级的宽度
			setStyle.elemParentW = (options.firstScreenShowNum * lenW) + ((options.firstScreenShowNum - 1) * options.firstScreenShowMr);
			setStyle.elemW = (len * lenW) + (len * options.firstScreenShowMr);
			setStyle.elemParentH = (options.firstScreenShowNum * lenH) + ((options.firstScreenShowNum - 1) * options.firstScreenShowMr);
			setStyle.elemH = (len * lenH) + (len * options.firstScreenShowMr);
			if (options.effect == 'lookScroll') { //重置len 因为这个效果是前后都多添了options.firstScreenShowNum个元素
				len = (len - (options.firstScreenShowNum * 2)) / options.firstScreenShowNum;
			}
			if (options.direction == 'up') {
				elem.css({
					height: setStyle.elemH,
					width: lenW
				});
				li.css({
					'margin-bottom': options.firstScreenShowMr,
					'float': 'none'
				});
				elem.parent().css({
					height: setStyle.elemParentH,
					width: lenW
				});
			} else {
				elem.css({
					width: setStyle.elemW
				});
				li.css({
					'margin-right': options.firstScreenShowMr
				});
				elem.parent().css({
					width:setStyle.elemParentW>=$(window).width()?'100%':setStyle.elemParentW,//解决下一页按钮超出屏幕
					height: lenH
				});
			}
		};
		//创建追加控制按钮元素
		function controlElem() {
			//tab控制按钮
			if (options.tabNav) {
				controltabbox = $('<ul></ul>'); //tab控制按钮盒子
				controltabnav = "<li></li>"; //tab控制按钮盒子内部元素
				controltabbox.appendTo(elem.parent()); //tab控制按钮追加到文档
				for (var i = 0; i < len; i++) {
					controltabbox.append(controltabnav); //tab控制按钮box追加elem
				}
				controltabboxChild = controltabbox.children(); //tab控制按钮集合
				controltabboxChild.addClass(options.tabNavChildStyle); //给所有tab增加共有样式
				controltabboxChild.eq(0).addClass(options.tabnavCur); //第一个增加当前样式
				controltabboxChild.css({
					'margin-right': options.tabNavMr
				});
				controltabboxChild.bind('mouseenter mouseleave', eventFun.tabnavhover);
				controltabbox.css({ //设置控制按钮box的width;因为定位之后他宽度会随着定位的父级
					width: (options.tabNavMr + controltabboxChild.eq(0).width()) * len
				})

				//设置tab控制按钮的样式
				var middleLeft;
				var windowW = $('body').width();
				if (lenW >= windowW) { //如果是全屏显示图片
					middleLeft = windowW;
				} else {
					middleLeft = setStyle.elemParentW;
				}
				// tab按钮 不同位置不同样式
				switch (options.tabNavPosition) {
					case 'middle':
						controltabbox.css({
							bottom: 10,
							position: 'absolute',
							left: middleLeft / 2,
							'margin-left': -(controltabbox.width() - options.tabNavMr) / 2
						});
						break;
					case 'right':
						controltabbox.css({
							right: 30,
							bottom: 10,
							position: 'absolute'
						});
						break;
					case 'rightMiddle':
						controltabboxChild.css({
							'float': 'none',
							'margin-right': 0,
							'margin-bottom': options.tabNavMr
						});
						controltabbox.css({
							width: controltabboxChild.eq(0).width(),
							right: 15,
							position: 'absolute',
							top: lenH / 2,
							'margin-top': -(controltabbox.height() - options.tabNavMr) / 2
						});
						break;
				}

			}
			//页码控制按钮
			if (options.pageNav) {
				next = $('<div>></div>'); //上一页盒子
				prev = $('<div><</div>'); //下一页盒子
				next.addClass(options.next).appendTo(elem.parent()).hide(); //上一页盒子增加样式
				prev.addClass(options.prev).appendTo(elem.parent()).hide(); //下一页盒子增加样式
				var handlerN, handlerP;
				if (options.effect == 'efade') {
					next.bind('click', eventFun.pagenClickEfade); //上一个委派单击
					prev.bind('click', eventFun.pagepClickEfade); //下一个委派单击
				}
				if (options.effect == 'wfScroll') {
					if (options.direction == 'up') {
						handlerP = eventFun.pagepClickwfUp;
						handlerN = eventFun.pagenClickwfUp;
					} else {
						handlerP = eventFun.pagepClickwf;
						handlerN = eventFun.pagenClickwf;
					}

				}
				if (options.effect == 'lookScroll') {
					if (options.direction == 'up') {
						handlerP = eventFun.lookPagepClickScrollUp;
						handlerN = eventFun.lookPagenClickScrollUp;
					} else {
						handlerP = eventFun.lookPagepClickScroll;
						handlerN = eventFun.lookPagenClickScroll;
					}

				}
				if (options.effect == 'scroll') {
					handlerP = eventFun.pagepClickScroll;
					handlerN = eventFun.pagenClickScroll;
				}
				next.bind('click', handlerN); //上一个委派单击
				prev.bind('click', handlerP); //下一个委派单击
			}
		}
		// 效果对象
		var effects = $.fn.hcjSlider.effects = {
			// 无缝首位互换位置
			wfScroll: function() {
				if (options.direction == 'up') {
					elem.animate({
						top: eventFun.returnWfRange(1) //这种效果只需要传个1 就行 因为不需要跟着索引递增
					}, options.speed, function() {
						elem.css({
							top: 0
						});
						eventFun._replaceFirst(0);
					});
				} else {
					elem.animate({
						left: eventFun.returnWfRange(1) //这种效果只需要传个1 就行 因为不需要跟着索引递增
					}, options.speed, function() {
						elem.css({
							left: 0
						});
						eventFun._replaceFirst(0);
					});
				}
			},
			// 来回滚
			scroll: function() {
				c++;
				if (c == len) {
					c = 0;
				}
				elem.animate({
					left: eventFun.returnWfRange(c)
				}, options.speed);
				eventFun.eqClass(c, controltabboxChild);
			},
			// 无缝滚动;首位前面添加一个末尾的图片;末尾添加一个首位的图片 视差来实现无缝 原理：到末尾left设置0  倒序就是left 
			lookScroll: function() {
				c++;
				if (c == len) {
					c = 0;
					if (options.direction == 'up') {
						elem.css({
							top: 0
						});
					} else {
						elem.css({
							left: 0
						});
					}
				}
				if (options.direction == 'up') {
					elem.animate({
						top: eventFun.returnWfRange(c)
					}, options.speed);
				} else {
					elem.animate({
						left: eventFun.returnWfRange(c)
					}, options.speed);
					if (options.tabNav) {
						eventFun.eqClass(c, controltabboxChild);
					}
				}
			},
			// 淡入
			efade: function() {
				c++;
				if (c == len) {
					c = 0;
				}
				if (options.tabNav) {
					eventFun.eqClass(c, controltabboxChild);
				}
				elem.children().eq(c).fadeIn(300).siblings().fadeOut(100);
			},
			marquee:function(){
				options.firstScreenShowNum=1;//首位替换替换一个
				if(options.direction=='up'){
					elem.animate({
						top:-lo
					},lo*options.speed,'linear',function(){
						elem.css({top:0});
						eventFun._replaceFirst(0)
					})
				}else{
					elem.animate({
						left:-lo
					},lo*options.speed,'linear',function(){
						elem.css({left:0});
						eventFun._replaceFirst(0)
					})
				}
				
			}
		};
		//判断效果是什么然后设置其样式
		if (options.effect) {
			setStyle.setElemCss();
			if (options.effect == 'efade') {
				setStyle.setFadeCss();
			}
			if (options.tabNav || options.pageNav) { //按钮控制显示判断
				controlElem();
			}
			if(options.effect!='marquee'){
				eventFun.setTimer(effects[options.effect]);
				// 总容器委派事件
				elem.parent().bind('mouseenter mouseleave', eventFun.elemhover); //给图片容器的上一级父级 委派事件 进入:动画停止;离开恢复动画;
			}else{
				var lo;
				if(options.direction=='up'){
					lo=lenH+options.firstScreenShowMr;
				}else{
					lo=lenW+options.firstScreenShowMr;
				}
				setInterval(effects[options.effect],lo*options.speed);
			}
			
		}
	};
})(jQuery);