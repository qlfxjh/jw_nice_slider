// JavaScript Document

/* 通用横向滚动类代码 */
//使用格式例子：var slider01 = new JW_NiceSlider("slider_02",235,4000);
//参数说明:strId:wrapper div's ID;
//itemWidth, 每一屏的宽度，为int数字，也可以设为"fullScreen"表示跟屏幕一样宽。
//nTime:autoPlayer Interval Time; nTime==false， 不自动播放

function JW_NiceSlider(strId,itemWidth, nTime,_callback){
	var SLOWINOUT = [0,0.006,0.018,0.036,0.06,0.09,0.126,0.168,0.216,0.27,0.33,0.396,0.468,0.54,0.612,0.678,0.738,0.792,0.84,0.882,0.918,0.948,0.972,0.99,1];
	var nInterTime;
	nInterTime = typeof(nTime)=="undefined"?5000:nTime;
	var callback = false;
	if(typeof(_callback)!="undefined"){
		callback = _callback;
	}
	var Index=0, tmpLi, oldIndex=0;
	var Wrapper = $('#'+strId);
	var WrapperInner = Wrapper.find('>.slides_control');
	var Items = WrapperInner.children();
	var maxIndex = Items.length -1;
	var picWidth = itemWidth;
	var handleTime;
	var handleInter = null;
	var finalLeft = 0;
	var baseLeft;
	var stepMax = SLOWINOUT.length-1;
	var step = 0;
	var dir;
	var ifUnderMoving = false;
	function init(){
		//nInterTime可以为false. 为false时不定时播放
		if(nInterTime){
			Wrapper[0].onmouseover = function(){
				if(handleInter!=null){
					clearInterval(handleInter);
					handleInter = null;
				}
			}
			Wrapper[0].onmouseout = function(){
				if(handleInter!=null){
					clearInterval(handleInter);
					handleInter = null;
				}
				handleInter = setInterval(AutoRun,nInterTime);
			}
		}
		if(picWidth=="fullScreen"){
			var clientWidth = document.documentElement.clientWidth;
			picWidth = clientWidth;
			$(window).resize(_resize);
		}
		
		
		
		baseLeft = -1*picWidth;
		WrapperInner.css({width:(picWidth*3)+"px",position:"relative",left:baseLeft+"px"});
		var offsetHeight = Items[0].offsetHeight;
		WrapperInner.css("height",offsetHeight+"px");
		
		//只显示第一个，其它的先hide.
		for(var i=0; i<Items.length; i++){
			tmpLi = Items.eq(i);
			tmpLi.css({position:"absolute",top:"0px",left:picWidth+"px",zIndex:"0"});
			if(i>0){
				tmpLi.hide();
			}
		}
	}
	function _resize(){
		var clientWidth = document.documentElement.clientWidth;
		picWidth = clientWidth;
		baseLeft = -1*picWidth;
		WrapperInner.css({width:(picWidth*3)+"px",position:"relative",left:baseLeft+"px"});
		var offsetHeight = Items[Index].offsetHeight;
		WrapperInner.css("height",offsetHeight+"px");
		
		//只显示第一个，其它的先hide.
		for(var i=0; i<Items.length; i++){
			tmpLi = Items.eq(i);
			tmpLi.css({left:picWidth+"px"});
		}
	}
	
	function AutoRun(){
		go_right();
	}
	function slideTo(){
		step++;
		var dis = finalLeft - baseLeft;
		if(step<stepMax){
			WrapperInner[0].style.left = baseLeft + parseInt((finalLeft - baseLeft)*SLOWINOUT[step]) + "px";
			handleTime=setTimeout(slideTo,25);
		}
		else{
			WrapperInner[0].style.left = finalLeft + "px";

			Items.eq(oldIndex).css({left:picWidth+"px"}).hide();
			Items.eq(Index).css({left:picWidth+"px"});
			WrapperInner[0].style.left = baseLeft + "px";
			ifUnderMoving = false;
			if(callback){
				callback(Index);
			}
		}
	}
	function Shift(){
		ifUnderMoving = true;
		step = 0;
		if(dir=="left"){
			Items.eq(Index).css({left:"0px"}).show();
			finalLeft = 0;
		}else{
			Items.eq(Index).css({left:picWidth*2+"px"}).show();
			finalLeft = -1*picWidth*2;
		}
		slideTo();
	}
	function go_right(){
		if(ifUnderMoving){
			//播放器正在移动中，不能再操作。
			return;
		
		}
		oldIndex = Index;
		Index ++
		dir = "right";
		//已在最后一屏了，需要回到最左边
		if(Index>maxIndex){
			Index=0;
		}
		Shift();
	}
	this.goRight = go_right;
	function go_left(){
		if(ifUnderMoving){
			//播放器正在移动中，不能再操作。
			return;
		}
		oldIndex = Index;
		Index--;
		dir = "left";
		if(Index<0){
			Index = maxIndex
		}
		Shift();
	}
	this.goLeft = go_left;
	
	function go_to(idx){
		var _idx = idx;
		if(_idx <0){
			_idx  = 0;
		}else if(_idx > maxIndex){
			_idx = maxIndex;
		}
		
		if(_idx>Index){
			dir = "right";
		}else if(_idx<Index){
			dir = "left";
		}else{
			return;	//如果要目的index跟当前的一样的话，就无需操作了。直接返回
		}
		oldIndex = Index;
		Index = _idx;
		
		Shift();
	}
	this.goTo = go_to;
	this.getIndex = function(){
		return Index;
	}
	init();
	if(nInterTime){
		handleInter = setInterval(AutoRun,nInterTime);
	}
}


