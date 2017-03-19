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
		currentUlIndex : 1,

		mouseInIOScoordinate: [0,0],
		section:selectors("section")[0],

		icons: selectors("section ul li"),
		middleIcons : selectors("section ul.middle li"),
		bottomIcons : selectors("section ul.bottom li"),
		ulMiddle: selectors("ul.middle")[0],
		ulMiddleList: selectors("section ul.middle"),
		iconsMiddle: selectors("ul.middle li"),

		topMessage:selectors('.topMessage')[0],
		bottomControl: selectors('.bottomControl')[0],

		ulBottom: selectors("ul.bottom")[0],
		iconsBottom: selectors("ul.bottom li"),

		removeIconButton: selectors('.close'),
		indicatorLights :  selectors('footer h5 span'),
		refresh : function(){
			this.icons = selectors("section ul li");
			this.removeIconButton= selectors('section ul li div');
			this.iconsMiddle= selectors("ul.middle li");
			this.iconsBottom= selectors("ul.bottom li");
			this.removeIconButton= selectors('.close');
			this.ulMiddleList= selectors("section ul.middle");
			this.middleIcons = selectors("section ul.middle li");
			this.buttonIcons = selectors("section ul.bottom li");
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
			var targetElement = event.target,
				divElement = targetElement.parentNode,
				liElement = targetElement.parentNode.parentNode,
				ulElement = targetElement.parentNode.parentNode.parentNode;
				liElement.className = "transitionZoomIn"; 
			var zoomIn = setTimeout(function(){ulElement.removeChild(liElement)	},500);
			IOS.refresh();
		});
	};
};
IOS.dragIcons = function(){
	IOS.refresh();
	if(IOS.animationFlag){		
		for(var i=0 ; i< IOS.icons.length; i++){
			var movebox = IOS.icons[i];
			drag({	
			parentNode : IOS.section,			
			moveEle: movebox,
			flag: "icons",
			mousedownFn : setLisPositionToAbsoulte,
			mousemoveFn : function(evt){create_new_ulMiddle_or_move_to_neighbour_ulMiddle(evt)},
			mouseupFn : function(evt){
				reorderLists(evt.clientX,evt.clientY,evt.target.parentNode);
				setLisPositionToNull();
				removeUlclassMiddle();
				setUlBottomliToCenter();
			}
			});
			toucDrag({	
				parentNode : IOS.section,			
				moveEle: movebox,
				flag: "icons",
				mousedownFn : setLisPositionToAbsoulte,
				mousemoveFn : function(evt){create_new_ulMiddle_or_move_to_neighbour_ulMiddle(evt)},
				mouseupFn : function(evt){
					reorderLists(evt.clientX,evt.clientY,evt.target.parentNode);
					setLisPositionToNull();
					removeUlclassMiddle();
					setUlBottomliToCenter();
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
	if(IOS.animationFlag){
		IOS.dragIcons();		
	}	
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
	//clearInterval(IOS.foo )
};
function drag(arg) {
	IOS.refresh();
	var parentNode =  arg.parentNode,
		movebox = arg.moveEle,
		flag = arg.flag,
		mousedownFn= arg.mousedownFn,
		mousemoveFn=arg.mousemoveFn,
		mouseupFn =arg.mouseupFn;
    var sectionTopY,sectionLeftX,
		evtTargetMinLeft = -movebox.offsetLeft,
		evtTargetMaxLeft =parentNode.offsetWidth -movebox.offsetWidth+parseInt(getStyle(movebox,'paddingLeft')),
		evtTargetMinTop =0,
		evtTargetMaxTop =parentNode.offsetHeight - IOS.ulBottom.offsetHeight;

	movebox.addEventListener("mousedown", mouseDown, false);
	movebox.addEventListener("mouseup", mouseUp, false);
    function mouseDown(evt) {
    	if(evt.target.className != flag) return;
    	sectionLeftX = evt.clientX-movebox.offsetLeft,
		sectionTopY = evt.clientY-movebox.offsetTop;		
		IOS.section.addEventListener("mousemove", mouseMoved, false);
		IOS.section.addEventListener("touchmove", mouseMoved, false);		
		if( mousedownFn) mousedownFn(evt);
	};
	function mouseMoved(evt) {	
		if(!IOS.animationFlag) return;
		evt.preventDefault();		
		if( movebox.parentNode == IOS.ulBottom ){
		 	sectionTopY =sectionTopY-IOS.section.offsetHeight+IOS.ulBottom.offsetHeight;
		 	firstMouseMovingAction = false;
		};
		IOS.section.appendChild(movebox);	
		movebox.style.position= "absolute";
		movebox.style.zIndex= 1;
		var	middleX= evt.clientX - sectionLeftX,
			middleY= evt.clientY - sectionTopY;				
		IOS.mouseInIOScoordinate=[middleX,middleY];
		if( middleX >=evtTargetMinLeft && middleX <= evtTargetMaxLeft){ 
			movebox.style.left =middleX+"px";
		};
		if(middleY >= evtTargetMinTop && middleY <= evtTargetMaxTop ) {			 
			movebox.style.top =middleY+"px";
		}else if ( middleY >  evtTargetMaxTop ){
			movebox.style.top =evtTargetMaxTop+"px";
		}
		if( mousemoveFn) mousemoveFn(evt);
	};
	function mouseUp(evt) {
		if(evt.target.className != flag) return;
		var clientX = parseInt(sectionLeftX -IOS.section.offsetLeft),
			clientY = parseInt(sectionTopY -IOS.section.offsetTop);	

		if( mouseupFn) mouseupFn(evt);
		IOS.section.removeEventListener("mousemove", mouseMoved, false);
	};	
};
function toucDrag(arg) {
	IOS.refresh();
	var parentNode =  arg.parentNode,
		movebox = arg.moveEle,
		flag = arg.flag,
		mousedownFn= arg.mousedownFn,
		mousemoveFn=arg.mousemoveFn,
		mouseupFn =arg.mouseupFn;
    var sectionTopY,sectionLeftX,
		evtTargetMinLeft = -movebox.offsetLeft,
		evtTargetMaxLeft =parentNode.offsetWidth -movebox.offsetWidth+parseInt(getStyle(movebox,'paddingLeft')),
		evtTargetMinTop =0,
		evtTargetMaxTop =parentNode.offsetHeight - IOS.ulBottom.offsetHeight;

	movebox.addEventListener("touchstart",mouseDown, false);
	movebox.addEventListener("touchend", mouseUp, false);

    function mouseDown(evt) {
    	var evt = evt.touches[0];
    	if(evt.target.className != flag) return;
    	sectionLeftX = evt.clientX-movebox.offsetLeft,
		sectionTopY = evt.clientY-movebox.offsetTop;
		IOS.section.addEventListener("touchmove", mouseMoved, false);		
		if( mousedownFn) mousedownFn(evt);
	};
	function mouseMoved(evt) {
		var evt = evt.touches[0];
		if(!IOS.animationFlag) return;
		evt.preventDefault();
		if( movebox.parentNode == IOS.ulBottom ){
		 	sectionTopY =sectionTopY-IOS.section.offsetHeight+IOS.ulBottom.offsetHeight;
		 	firstMouseMovingAction = false;
		};
		IOS.section.appendChild(movebox);	
		movebox.style.position= "absolute";
		movebox.style.zIndex= 1;
		var	middleX= evt.clientX - sectionLeftX,
			middleY= evt.clientY - sectionTopY;				
		IOS.mouseInIOScoordinate=[middleX,middleY];
		if( middleX >=evtTargetMinLeft && middleX <= evtTargetMaxLeft){ 
			movebox.style.left =middleX+"px";
		};
		if(middleY >= evtTargetMinTop && middleY <= evtTargetMaxTop ) {			 
			movebox.style.top =middleY+"px";
		}else if ( middleY >  evtTargetMaxTop ){
			movebox.style.top =evtTargetMaxTop+"px";
		}
		if( mousemoveFn) mousemoveFn(evt);
	};
	function mouseUp(evt) {
		if(evt.target.className != flag) return;
		var clientX = parseInt(sectionLeftX -IOS.section.offsetLeft),
			clientY = parseInt(sectionTopY -IOS.section.offsetTop);		
		if( mouseupFn) mouseupFn(evt);
		IOS.section.removeEventListener("touchmove", mouseMoved, false);
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
	IOS.refresh();
	var clientX = parseInt(clientX -IOS.section.offsetLeft),
		clientY = parseInt(clientY -IOS.section.offsetTop),
		targetNodeWidth = parseInt(IOS.icons[0].offsetWidth),
		targetNodeHeight = parseInt(IOS.icons[0].offsetHeight),
		currentUl = currentUlMiddle().element,	
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
	ele.setAttribute("style" ,"float:left;");
};
function currentUlMiddle(){
	IOS.ulMiddleList=selectors("section ul.middle");
	for (var i = IOS.ulMiddleList.length - 1; i >= 0; i--) {
		if( IOS.ulMiddleList[i].offsetLeft == 0 )
			return 	{element: IOS.ulMiddleList[i],
						index : i}
	};
	return false;
};
//slipe functions ------------------------------------------------------------------------------5
function mouseMovingDirectionFunction(arg){
	IOS.refresh();
	var direction, stepX, stepY, clientX, clientY,targetElement;
	IOS.startPoint = [0,0],
	IOS.endPoint = [0,0];
	IOS.section.addEventListener("mousedown",getStart);
	IOS.section.addEventListener("mousemove",function(evt){
		evt.preventDefault();
	});
	IOS.section.addEventListener("mouseup",orient);

	function getStart(evt){
		evt.preventDefault();
		IOS.startPoint= [evt.clientX, evt.clientY];
		clientX = IOS.startPoint[0] -IOS.section.offsetLeft;
		clientY = IOS.startPoint[1] -IOS.section.offsetTop;
	};
	
	function orient(evt){
		if (0 <= clientX <= 260 && -12<=clientY <=420) {
			IOS.endPoint= [evt.clientX, evt.clientY];
			stepX =IOS.endPoint[0]-IOS.startPoint[0];
			stepY =IOS.endPoint[1]-IOS.startPoint[1];
			if( Math.abs(stepX) > Math.abs(stepY) && Math.abs(stepX) >20 ){
				if(!IOS.animationFlag || evt.target.className != "icons"){
					if(stepX >0 && arg.slipeTorightFn){
						arg.slipeTorightFn(evt);
					}else if( stepX <0 && arg.slipeToleftFn ){
						arg.slipeToleftFn(evt);
					};
				};
			}else if( Math.abs(stepX) <= Math.abs(stepY) && Math.abs(stepY) >20 && !IOS.animationFlag ){
				if( stepY <0 && arg.slipeToupFn){
					arg.slipeToupFn(evt);
				}else if(  stepY >0 && arg.slipeTodownFn ){
					arg.slipeTodownFn(evt);
				};
			};
		};
	};	
};
function touchMovingDirectionFunction(arg){
	IOS.refresh();
	var direction, stepX, stepY, clientX, clientY,targetElement;
	IOS.startPoint = [0,0],
	IOS.endPoint = [0,0];
	IOS.section.addEventListener("touchstart",getStart);
	IOS.section.addEventListener("touchmove",function(evt){
		var evt = evt.touches[0];
		evt.preventDefault();
	});
	IOS.section.addEventListener("touchend",orient);

	function getStart(evt){
		var evt = evt.touches[0];
		evt.preventDefault();
		IOS.startPoint= [evt.clientX, evt.clientY];
		clientX = IOS.startPoint[0] -IOS.section.offsetLeft;
		clientY = IOS.startPoint[1] -IOS.section.offsetTop;
	};
	
	function orient(evt){
		var evt = evt.touches[0];
		if (0 <= clientX <= 260 && -12<=clientY <=420) {
			IOS.endPoint= [evt.clientX, evt.clientY];
			stepX =IOS.endPoint[0]-IOS.startPoint[0];
			stepY =IOS.endPoint[1]-IOS.startPoint[1];
			if( Math.abs(stepX) > Math.abs(stepY) && Math.abs(stepX) >20 ){
				if(!IOS.animationFlag || evt.target.className != "icons"){
					if(stepX >0 && arg.slipeTorightFn){
						arg.slipeTorightFn(evt);
					}else if( stepX <0 && arg.slipeToleftFn ){
						arg.slipeToleftFn(evt);
					};
				};
			}else if( Math.abs(stepX) <= Math.abs(stepY) && Math.abs(stepY) >20 && !IOS.animationFlag ){
				if( stepY <0 && arg.slipeToupFn){
					arg.slipeToupFn(evt);
				}else if(  stepY >0 && arg.slipeTodownFn ){
					arg.slipeTodownFn(evt);
				};
			};
		};
	};	
};
(function(){
	IOS.indicatorLights[1].style.color = "#fff";
	for (var i = IOS.ulMiddleList.length - 1; i >= 0; i--) {	
		IOS.ulMiddleList[i].className +=" transform ";
	};		
})();
mouseMovingDirectionFunction({
	slipeToleftFn : function(evt){
					slipeToleftFn(evt);					
					},
	slipeTorightFn :function(evt){
					slipeTorightFn();
					},
	slipeToupFn : slipeToupFn,
	slipeTodownFn : slipeTodownFn
});
touchMovingDirectionFunction({
	slipeToleftFn : function(evt){
					slipeToleftFn(evt);					
					},
	slipeTorightFn :function(evt){
					slipeTorightFn();
					},
	slipeToupFn : slipeToupFn,
	slipeTodownFn : slipeTodownFn
});
function slipeToleftFn(evt){
	if(IOS.ulMiddleList[IOS.ulMiddleList.length-1].offsetLeft <= 0 )return;
	if( 0 <(IOS.startPoint[0] -IOS.section.offsetLeft) && 
		(IOS.startPoint[0] -IOS.section.offsetLeft)<= 260 ){	
		var index = currentUlMiddle().index;
		if (index < IOS.ulMiddleList.length-1){
			IOS.ulMiddleList[index].style.left = -260+"px";
			IOS.ulMiddleList[index+1].style.left = 0+"px";
		};		
	};
	var delay = setTimeout(indicatorLight , 500);
};
function slipeTorightFn(evt){
	if(IOS.ulMiddleList[0].offsetLeft >= 0 )	return;
	if( 0 < (IOS.startPoint[0] -IOS.section.offsetLeft) &&
		(IOS.startPoint[0] -IOS.section.offsetLeft)<= 260){	
		var index = currentUlMiddle().index;
		if (index > 0 ){
		 	IOS.ulMiddleList[index-1].style.left = 0+"px";
		 	IOS.ulMiddleList[index].style.left = 260+"px";
		 };
	};
	var delay = setTimeout(indicatorLight , 500);
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
// 指示灯
function indicatorLight(){
	IOS.indicatorLights = selectors("footer h5 span");
	for (var i = IOS.indicatorLights.length - 1; i >= 0; i--) {
		if( IOS.ulMiddleList[i].offsetLeft == 0 ){
			console.log("aaa")
			IOS.indicatorLights[i].style.color = "#fff";
		}else {
			IOS.indicatorLights[i].style.color = "#777";
		}
	}
};
//IOS draging in ulMiddleList block -----------------------------------------------------------6
function create_new_ulMiddle_or_move_to_neighbour_ulMiddle(evt){	
	if (!currentUlMiddle() ) return;
	if( IOS.mouseInIOScoordinate[1] > 360) return ;
	var index1 = currentUlMiddle().index,		
		clientX = IOS.mouseInIOScoordinate[0],
		childrenNum = IOS.ulMiddleList[index1].children.length ;		
	if(clientX >= 230 ){
		if (index1 == IOS.ulMiddleList.length-1 && childrenNum){
			createUlclassMiddle(index1);
			var delay = setTimeout(slipeToleftFn, 5);
			return;
		};
		slipeToleftFn();
	};
	if(clientX <= 10 ){
		if (index1 == 0  && childrenNum){
			createUlclassMiddle(index1);
			var delay = setTimeout(slipeTorightFn, 5);
			return;
		}
		slipeTorightFn();
	};
	//currentUlMiddle().element.appendChild(evt.target.parentNode);
};
//IOS draging and creating new ulMiddleList----------------------------------------------------7
//createUlclassMiddle();
function createUlclassMiddle(value){
	var ul = document.createElement("UL");
		ul.className= "middle transform";
	if(value >0){
		ul.style.left = "260px";
		IOS.section.insertBefore(ul,IOS.ulBottom);
		IOS.indicatorLights[0].parentNode.innerHTML +="<span>o</span>";
	} ;
	if(value == 0) {
		ul.style.left = "-260px";
		IOS.indicatorLights[0].parentNode.innerHTML +="<span>o</span>";
		IOS.section.insertBefore(ul,IOS.ulMiddleList[0]);
	};
};
function removeUlclassMiddle(){
	for (var i = IOS.ulMiddleList.length - 1; i >= 0; i--) {
		if( IOS.ulMiddleList[i].children.length == 0 ){
			IOS.section.removeChild(IOS.ulMiddleList[i]);
			IOS.indicatorLights[0].parentNode.removeChild(IOS.indicatorLights[i]);
		}
	};
};
//set ulBottom's li's postion to center ------------------------------------------------------8
function setUlBottomliToCenter(){
	IOS.refresh();
	switch(IOS.iconsBottom.length ) {
		case 4 :
		IOS.ulBottom.style.paddingLeft= "10px";
		break;
		case 3 :
		IOS.ulBottom.style.paddingLeft= "40px";
		break;
		case 2 :
		IOS.ulBottom.style.paddingLeft= "70px";
		break;
		case 1 :
		IOS.ulBottom.style.paddingLeft= "100px";
		break;
		default:
		break;
	};
};
setUlBottomliToCenter();
function getStyle(element, attr) {
	var value;
	if (typeof window.getComputedStyle != 'undefined') {//W3C
		value = window.getComputedStyle(element, null)[attr];
	} else if (typeof element.currentStyle != 'undeinfed') {//IE
		value = element.currentStyle[attr];
	}
	return value;
};

})
