$(
function(){
	function selectors(nodeName){
		return document.querySelectorAll(nodeName);
	};

	selectors("nav span.center")[0].innerText= (new Date()).toString().substring(16,21);
	var CLOCK = setInterval(function(){
			selectors("nav span.center")[0].innerText= (new Date()).toString().substring(16,21);
		},1000);

	var IOS={
		flag: false,		
		section:selectors("section")[0],
		icons: selectors("section ul li"),
		ulMiddle: selectors("ul.middle")[0],
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

	IOS.showHidenElements = function(){
		for(var i=0 ; i< this.icons.length; i++){
			this.icons[i].addEventListener("mousedown",function(evt){
				var x =setTimeout(show,2000);
				this.addEventListener("mouseup",function(){ clearTimeout(x)});
				this.addEventListener("mouseout",function(){ clearTimeout(x)});
			});
		}
	}
	IOS.hideShowElements =function(){			
		selectors("button")[0].addEventListener('mousedown',hide);
	}
	IOS.removeIcon = function(){		
		for (var j = 0; j<IOS.removeIconButton.length; j++) {
			IOS.removeIconButton[j].addEventListener('mousedown',function(event){
				event.stopPropagation();
				event.target.parentNode.parentNode.parentNode.removeChild(event.target.parentNode.parentNode);
				IOS.refresh();
			});
		}
	}
	IOS.dragIcons = function(){
		if(IOS.flag){
			for(var i=0 ; i< this.icons.length; i++){
				var movebox = this.icons[i];
				drag({
						parentNode:IOS.ulMiddle,
						moveEle: movebox,
						flag: "icons",
						mousedownFn : setLisPositionToAbsoulte,
						mouseupFn : function(evt){
							reorderLists(evt.clientX,evt.clientY,evt.target.parentNode,parentNode);
							setLisPositionToNull();
						}
					});
				drag({
						parentNode:IOS.ulBottom,
						moveEle: movebox,
						flag: "icons",
						mousedownFn : setLisPositionToAbsoulte,
						mouseupFn : function(evt){
							reorderLists(evt.clientX,evt.clientY,evt.target.parentNode,parentNode);
							setLisPositionToNull();
						}
					});
			}
		}
	}

	IOS.showHidenElements();
	IOS.hideShowElements();
	IOS.removeIcon();

function show(){
	IOS.flag= true;
	IOS.dragIcons();
	for (var j = 0; j<IOS.removeIconButton.length; j++) {
		var animation= "animated "+" shake"+randomNumber(2)
		+" roateOrigin"+randomNumber(3);
		IOS.removeIconButton[j].style.display="block";
		IOS.icons[j].className= animation;
	}
}
function hide(){
	IOS.flag= false;
	for (var j = 0; j<IOS.removeIconButton.length; j++) {
			IOS.removeIconButton[j].style.display="none";
			IOS.icons[j].className="";
		}
	IOS.topMessage.className="topMessage";
	IOS.bottomControl.className="bottomControl";		
}
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
		if(!IOS.flag) return;
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
		if ( middleY >= evtTargetMinTop && middleY <= evtTargetMaxTop && parentNode == IOS.ulMiddle ) {
			movebox.style.top =middleY+"px";
		}else if(middleY <= -evtTargetMinTop && middleY >= -evtTargetMaxTop && parentNode == IOS.ulBottom){
			movebox.style.top =middleY+"px";
		};
		if( mousemoveFn) mousemoveFn(evt);
	};
	function mouseUp(evt) {
		if(evt.target.className != flag) return;
		parentNode.removeEventListener("mousemove", mouseMoved, false);		
		if( mouseupFn) mouseupFn(evt);
	};
};

function reorderLists(clientX,clientY,targetNode,parentNode){
	//console.log("reorder run");
	IOS.refresh();
	var clientX =  parseInt(clientX -IOS.section.offsetLeft),
		clientY = parseInt(clientY -IOS.section.offsetTop),
		targetNodeWidth = parseInt(IOS.icons[0].offsetWidth),
		targetNodeHeight = parseInt(IOS.icons[0].offsetHeight);

	for(var i=0; i< 4; i++){
		for(var j=0; j<7 ;j++){
			if( clientX >= targetNodeWidth*(i-0.5) && clientX < targetNodeWidth*(i+0.5) || clientX >210 ){
				if( targetNodeHeight*j <=clientY && targetNodeHeight*(j+1) >clientY){
					var evtTargetHoverIndex= j*4 + i ;
					if(clientX >210) {
						i =4;
						evtTargetHoverIndex = evtTargetHoverIndex +i;
					};
					//console.log("i="+i+" ,j="+j+" ,evtTargetHoverIndex ="+evtTargetHoverIndex );

					if( clientY>=0 && clientY<360 && IOS.iconsMiddle.length < 24){
						if(evtTargetHoverIndex > IOS.iconsMiddle.length-1 && evtTargetHoverIndex == 24){
							IOS.ulMiddle.appendChild(targetNode);
						}else{
							IOS.ulMiddle.insertBefore(targetNode,IOS.iconsMiddle[evtTargetHoverIndex]);
						}							
					};
					if( clientY >=360  && IOS.iconsBottom.length < 4 ){
						if(i > IOS.iconsBottom.length-1 ){
							IOS.ulBottom.appendChild(targetNode);
						}else{
							IOS.ulBottom.insertBefore(targetNode,IOS.iconsBottom[i]);
						}
					}
					styleEqualNull(targetNode);					
					return;
				};
			};
		};
	};
};
//以鼠标的位置定图片的顺序
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
function nodeAIsDescendantsOfNodeB(nodeA,nodeB){
	while(nodeA.parentNode){
		if(nodeA.parentNode == nodeB)
			return true;
		nodeA=nodeA.parentNode;
	}
	return false;
};
function randomNumber(maxNum){
	return Math.floor(Math.random()*maxNum+1);
};

//mouseMovingDirectionFunction()
function mouseMovingDirectionFunction(   ){
	var direction, stepX, stepY,
		startPoint = [0,0],
		endPoint = [0,0];
	document.addEventListener("mousedown",getStart);
	document.addEventListener("mousemove",function(evt){
		evt.preventDefault();
	})
	document.addEventListener("mouseup",orient);
	
	//console.log(direction)

	function getStart(evt){
		startPoint= [evt.clientX, evt.clientY];
	};
	function orient(evt){
		endPoint= [evt.clientX, evt.clientY];
		stepX = endPoint[0]-startPoint[0];
		stepY = endPoint[1]-startPoint[1];
		if( Math.abs(stepX) > Math.abs(stepY) && Math.abs(stepX) >20){
			if(stepX >0){
				direction = "right";
			}else{
				direction = "left";
			};
		}else if( Math.abs(stepX) <= Math.abs(stepY) &&  Math.abs(stepY) >20 ){
			if(stepY >0){
				IOS.topMessage.className="trasform showTopMessage";
			}else{
				IOS.bottomControl.className="trasform showBottomControl";
			};
		};
		//document.removeEventListener("mousedown",getStart);
		//document.removeEventListener("mouseup",orient);
	};
}



createUlclassMiddle();
function createUlclassMiddle(){
	var ul = document.createElement("UL");
		ul.className= "middle";
		ul.style.left = "260px";
	IOS.section.appendChild(ul);

};








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