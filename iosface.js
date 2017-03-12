$(
function(){
	function selectors(nodeName){
		if( nodeName.indexOf("#") == 0) {
			return document.querySelector(nodeName);
		}else{
			return document.querySelectorAll(nodeName);
		}
	};

	selectors("nav span.center")[0].innerText= (new Date()).toString().substring(16,21);
	var CLOCK = setInterval(function(){
			selectors("nav span.center")[0].innerText= (new Date()).toString().substring(16,21);
		},1000);
//IOS Object ------------------------------------------------------------------------------------1
	var IOS={
		activingFlag : false,
		animationFlag: false,	
		messageBoxflag : false,
		bottomBoxflag : false,

		section:selectors("section")[0],

		icons: selectors("section ul li"),

		ulMiddle: selectors("ul.middle")[0],
		ulMiddleList: selectors("section ul.middle"),
		iconsMiddle: selectors("ul.middle li"),

		topMessage:selectors('.topMessage')[0],
		bottomControl: selectors('.bottomControl')[0],

		ulBottom: selectors("ul.bottom")[0],
		iconsBottom: selectors("ul.bottom li"),

		removeIconButton: selectors('.close'),
		refresh : function(){
			this.icons = selectors("section ul li");
			this.removeIconButton= selectors('section ul li div');
			this.iconsMiddle= selectors("ul.middle li");
			this.iconsBottom= selectors("ul.bottom li");
			this.removeIconButton= selectors('.close');
		}
	};
//IOS functions ---------------------------------------------------------------------------------2
IOS.showHidenElements = function(){
	for(var i=0 ; i< this.icons.length; i++){
		this.icons[i].addEventListener("mousedown",function(evt){
			var x =setTimeout(show,2000);
			this.addEventListener("mouseup",function(){ clearTimeout(x)});
			this.addEventListener("mouseout",function(){ clearTimeout(x)});
		});
	};
};
IOS.hideShowElements =function(){			
	selectors("button")[0].addEventListener('mousedown',hide);
};
IOS.removeIcon = function(){
	for (var j = 0; j<IOS.removeIconButton.length; j++) {
		IOS.removeIconButton[j].addEventListener('mousedown',function(event){
			event.stopPropagation();
			event.target.parentNode.parentNode.parentNode.removeChild(event.target.parentNode.parentNode);
			IOS.refresh();
		});
	};
};
IOS.dragIcons = function(){
	if(IOS.animationFlag){		
	for(var i=0 ; i< IOS.icons.length; i++){
		var movebox = IOS.icons[i];
		for (var k = IOS.ulMiddleList.length - 1; k >= 0; k--) {
			(function(i){
				drag({
					parentNode:IOS.ulMiddleList[k],
					moveEle: i,
					flag: "icons",
					mousedownFn : setLisPositionToAbsoulte,
					mouseupFn : function(evt){
						reorderLists(evt.clientX,evt.clientY,evt.target.parentNode);
						setLisPositionToNull();
					}
			})})(movebox);
		};
		drag({
			parentNode:IOS.ulBottom,
			moveEle: movebox,
			flag: "icons",
			mousedownFn : setLisPositionToAbsoulte,
			mouseupFn : function(evt){
				reorderLists(evt.clientX,evt.clientY,evt.target.parentNode);
				setLisPositionToNull();
				}
			});
		};
	};
};

IOS.showHidenElements();
IOS.hideShowElements();
IOS.removeIcon();
//IOS basical function tools --------------------------------------------------------------------3
function show(){
	IOS.animationFlag= true;
	IOS.dragIcons();
	for (var j = 0; j<IOS.icons.length; j++) {
		var animation= "animated "+" shake"+randomNumber(2)
		+" roateOrigin"+randomNumber(3);
		IOS.icons[j].className= animation;
		if(IOS.removeIconButton[j]){
			IOS.removeIconButton[j].style.display="block";		
		};
	};
};
function hide(){
	IOS.animationFlag= false;
	IOS.messageBoxflag = false;
	IOS.bottomBoxflag = false;
	for (var j = 0; j<IOS.icons.length; j++) {			
			IOS.icons[j].className="";
			if(IOS.removeIconButton[j]){
			IOS.removeIconButton[j].style.display="none";
			};
		};	
	IOS.topMessage.className = "topMessage transform";	
	IOS.bottomControl.className="bottomControl transform";
	//IOS.ulMiddle.className ="middle";
};
function drag(arg) {
	var parentNode= arg.parentNode ,
		movebox = arg.moveEle,
		flag = arg.flag,
		mousedownFn= arg.mousedownFn,
		mousemoveFn=arg.mousemoveFn,
		mouseupFn =arg.mouseupFn;
    var leftX=0, topY=0;

	movebox.addEventListener("mousedown", mouseDown, false);
	movebox.addEventListener("mouseup", mouseUp, false);
    function mouseDown(evt) {
    	if(evt.target.className != flag) return;
    	leftX= evt.clientX- movebox.offsetLeft, 
		topY=evt.clientY-movebox.offsetTop;
		parentNode.addEventListener("mousemove", mouseMoved, false);		
		if( mousedownFn) mousedownFn(evt);
	}
	function mouseMoved(evt) {
		evt.preventDefault();
		if(!IOS.animationFlag) return;
		movebox.style.position= "absolute";
		movebox.style.zIndex= 1;

		var	middleX= evt.clientX - leftX,
			middleY= evt.clientY - topY,
			evtTargetMinLeft = parentNode.offsetLeft -evt.target.offsetLeft,
			evtTargetMaxLeft = parentNode.offsetWidth -evt.target.offsetWidth-evt.target.offsetLeft,
			evtTargetMinTop = 0-evt.target.offsetTop,
			evtTargetMaxTop = IOS.section.offsetHeight - movebox.offsetHeight;

		if( middleX >= evtTargetMinLeft && middleX <= evtTargetMaxLeft){
			movebox.style.left =middleX+"px";
		};
		if ( middleY >= evtTargetMinTop && middleY <= evtTargetMaxTop  ) {
			movebox.style.top =middleY+"px";
		}else if(middleY <= -evtTargetMinTop && middleY >= -evtTargetMaxTop && parentNode == IOS.ulBottom){
			movebox.style.top =middleY+"px";
		};
		if( mousemoveFn) mousemoveFn(evt);
	};
	function mouseUp(evt) {
		if(evt.target.className != flag) return;
		var clientX = parseInt(clientX -IOS.section.offsetLeft),
			clientY = parseInt(clientY -IOS.section.offsetTop);
		
		if( mouseupFn) mouseupFn(evt);
		parentNode.removeEventListener("mousemove", mouseMoved, false);
	};
};
function randomNumber(maxNum){
	return Math.floor(Math.random()*maxNum+1);
};
function nodeAIsDescendantsOfNodeB(nodeA,nodeB){
	while(nodeA.parentNode){
		if(nodeA.parentNode == nodeB)
			return true;
		nodeA=nodeA.parentNode;
	}
	return false;
};
//以鼠标的位置定图片的顺序 ----------------------------------------------------------------------4
function reorderLists(clientX,clientY,targetNode){
	//console.log("reorder run");
	IOS.refresh();
	var clientX = parseInt(clientX -IOS.section.offsetLeft),
		clientY = parseInt(clientY -IOS.section.offsetTop),
		targetNodeWidth = parseInt(IOS.icons[0].offsetWidth),
		targetNodeHeight = parseInt(IOS.icons[0].offsetHeight),

		currentUl = currentUlMiddle(),	
		currentUlLi= currentUl.querySelectorAll("li");
	for(var i=0; i< 4; i++){
		for(var j=0; j<7 ;j++){
			if( clientX >= targetNodeWidth*(i-0.5) && clientX < targetNodeWidth*(i+0.5) || clientX >210 ){
				if( targetNodeHeight*j <=clientY && targetNodeHeight*(j+1) >clientY ){
					var evtTargetHoverIndex= j*4 + i ;
					if(clientX >210) {
						i =4;
						evtTargetHoverIndex = evtTargetHoverIndex +i;
					};
					//console.log("i="+i+" ,j="+j+" ,evtTargetHoverIndex ="+evtTargetHoverIndex );
					if( clientY>=0 && clientY<360 && currentUlLi.length < 24  ){
						if(evtTargetHoverIndex > currentUlLi.length-1 && evtTargetHoverIndex == 24){
							currentUl.appendChild(targetNode);
						}else{
							currentUl.insertBefore(targetNode,currentUlLi[evtTargetHoverIndex]);
						};							
					};
					if( clientY >=360  && IOS.iconsBottom.length < 4 ){
						if(i > IOS.iconsBottom.length-1 ){
							IOS.ulBottom.appendChild(targetNode);
						}else{
							IOS.ulBottom.insertBefore(targetNode,IOS.iconsBottom[i]);
						};
					}
					styleEqualNull(targetNode);	
					return;
				};
			};
		};
	};
};
function setLisPositionToAbsoulte(){
	var liCoordinates = [];
	for(var i=0 ; i<IOS.icons.length; i++){
		liCoordinates[i] = [IOS.icons[i].offsetLeft+"px",IOS.icons[i].offsetTop+"px"];
	}
	for(var j=0 ; j<IOS.icons.length; j++){
		IOS.icons[j].style.position="absolute";
		IOS.icons[j].style.left = liCoordinates[j][0];
		IOS.icons[j].style.top = liCoordinates[j][1];
	}
};
function setLisPositionToNull(){
	for(var j=0 ; j<IOS.icons.length; j++){
		styleEqualNull(IOS.icons[j]);
	}
};
function styleEqualNull(ele){
	ele.style = " ";
};
function currentUlMiddle(){
	for (var i = IOS.ulMiddleList.length - 1; i >= 0; i--) {
		if( IOS.ulMiddleList[i].offsetLeft == 0 )
			return IOS.ulMiddleList[i];
	}
};
//slipe functions ------------------------------------------------------------------------------5
function mouseMovingDirectionFunction(arg){
	IOS.refresh();
	var direction, stepX, stepY, clientX, clientY;
	IOS.startPoint = [0,0],
	IOS.endPoint = [0,0];
	document.addEventListener("mousedown",getStart);
	document.addEventListener("mousemove",function(evt){
		evt.preventDefault();
	})
	document.addEventListener("mouseup",orient);
	
	function getStart(evt){
		if( IOS.animationFlag ) return;
		IOS.startPoint= [evt.clientX, evt.clientY];
		clientX = IOS.startPoint[0] -IOS.section.offsetLeft;
		clientY = IOS.startPoint[1] -IOS.section.offsetTop;
	};
	function orient(evt){
		if( IOS.animationFlag ) return;
		if (0 <= clientX <= 260 && -12<=clientY <=420) {
			IOS.endPoint= [evt.clientX, evt.clientY];
			stepX =IOS.endPoint[0]-IOS.startPoint[0];
			stepY =IOS.endPoint[1]-IOS.startPoint[1];
			if( Math.abs(stepX) > Math.abs(stepY) && Math.abs(stepX) >20){
				if(stepX >0 && arg.slipeTorightFn){
					arg.slipeTorightFn(evt);
				}else if( stepX <0 && arg.slipeToleftFn ){
					arg.slipeToleftFn(evt);
				};
			}else if( Math.abs(stepX) <= Math.abs(stepY) && Math.abs(stepY) >20 ){
				if( stepY <0 && arg.slipeToupFn){
					arg.slipeToupFn(evt);
				}else if(  stepY >0 && arg.slipeTodownFn ){
					arg.slipeTodownFn(evt);
				};
			};
		};
	};
}
mouseMovingDirectionFunction({
	slipeToleftFn : slipeToleftFn,
	slipeTorightFn : slipeTorightFn,
	slipeToupFn : slipeToupFn,
	slipeTodownFn : slipeTodownFn
});
function slipeToleftFn(evt){
	if(IOS.ulMiddleList[IOS.ulMiddleList.length-1].offsetLeft <= 0 )return;
	if( 0 <(IOS.startPoint[0] -IOS.section.offsetLeft) && 
		(IOS.startPoint[0] -IOS.section.offsetLeft)<= 260 ){
		for (var i = IOS.ulMiddleList.length - 1; i >= 0; i--) {
			var ulMiddleLeft = parseInt( getStyle(IOS.ulMiddleList[i], "left") );
			if(IOS.ulMiddleList[i].className.indexOf("transform") == -1)				
				IOS.ulMiddleList[i].className +=" transform ";
			IOS.ulMiddleList[i].style.left = ulMiddleLeft-260+"px";
		};
	};
};
function slipeTorightFn(evt){
	if(IOS.ulMiddleList[0].offsetLeft >= 0 )	return;	
	if( 0 < (IOS.startPoint[0] -IOS.section.offsetLeft) &&
		(IOS.startPoint[0] -IOS.section.offsetLeft)<= 260){	
		for (var i = IOS.ulMiddleList.length - 1; i >= 0; i--) {				
		var ulMiddleLeft = parseInt( getStyle(IOS.ulMiddleList[i], "left") );
		if(IOS.ulMiddleList[i].className.indexOf("transform") == -1)
			IOS.ulMiddleList[i].className +=" transform ";
		IOS.ulMiddleList[i].style.left = ulMiddleLeft+260+"px";
		};		
	};
};
function slipeToupFn(evt){
	if( IOS.messageBoxflag ){
		IOS.topMessage.className = "topMessage transform";
		IOS.messageBoxflag = false; 
		return;
	};
	if( 400 < (IOS.startPoint[1] -IOS.section.offsetTop) &&
		(IOS.startPoint[1] -IOS.section.offsetTop)<= 420){
		IOS.bottomControl.className="transform showBottomControl";
		IOS.bottomBoxflag = true;			
	};
};
function slipeTodownFn(evt){
	if( IOS.bottomBoxflag ){
		IOS.bottomControl.className="bottomControl transform";
		IOS.bottomBoxflag = false;
		return;
	};
	if( -12 <(IOS.startPoint[1] -IOS.section.offsetTop) && 
		(IOS.startPoint[1] -IOS.section.offsetTop)<= 0 ){
		IOS.topMessage.className="transform showTopMessage";
		IOS.messageBoxflag = true;
	};
};
//IOS draging in ulMiddleList block -----------------------------------------------------------6
//IOS draging and creating new ulMiddleList----------------------------------------------------7



//createUlclassMiddle();
function createUlclassMiddle(){
	var ul = document.createElement("UL");
		ul.className= "middle";
		ul.style.left = "260px";
	IOS.section.appendChild(ul);
};
//createUlclassMiddleInnerHTML()
function createUlclassMiddleInnerHTML(){
	var newUlMiddle='<ul class="middle"> <ul>';
	IOS.section.innerHTML += newUlMiddle;
}







function getStyle(element, attr) {
	var value;
	if (typeof window.getComputedStyle != 'undefined') {//W3C
		value = window.getComputedStyle(element, null)[attr];
	} else if (typeof element.currentStyle != 'undeinfed') {//IE
		value = element.currentStyle[attr];
	}
	return value;
}

})