




//获取上下文
 var $canvasArea = $('#paint_canvas');
 //console.log($canvasArea); //正确
 
 //jquery zepto都报错 $canvasArea.getContext is not a function
 // var $ctx = $canvasArea.getContext('2d'); 
 // console.log($ctx);


 var canvasArea = document.getElementById("paint_canvas");
 //console.log(canvasArea);
 var ctx = canvasArea.getContext('2d');

//初始化：画出9个圆圈

var space = 140, //圆圈之间的间隙
	r = 100; //圆圈半径

//9个圆圈的圆心坐标信息Point对象组成数组
var pList = [];

function Point(x, y){
	this.x = x;
	this.y = y;
}

function initDraw(){
	ctx.strokeStyle = "#000000"; //圆圈线颜色
	ctx.lineWidth = 2;

	for(var i = 0; i < 3; i++){ //行
		for(var j = 0; j < 3; j++){ //列
			//圆心坐标(x,y) 
			var x = r + space / 2 + 2 * j * space,
				y = r + space / 2 + 2 * i * space;

			ctx.beginPath();
			
			//画圆
			ctx.arc(x, y, r, 0, 2 * Math.PI);
			//$ctx.strokeRect(0,0,150,100);
			ctx.stroke();

			//将该圆位置存入数组pList
			var point = new Point(x, y);
			pList.push(point);
		}
	}
}

initDraw();

console.log(pList);


function isTouchInAPoint(touchX, touchY){
	for(var i = 0; i < pList.length; i++){
		if(Math.pow((touchX - pList[i].x), 2) +  Math.pow((touchY - pList[i].y), 2)  < Math.pow(r, 2)){
			return pList[i];
		}
	}
	return 0;
}



$canvasArea.on("touchstart touchmove", function(e) {
 e.preventDefault();
 var touchX = e.originalEvent.targetTouches[0].pageX - $canvasArea.offset().left,
 	 touchY = e.originalEvent.targetTouches[0].pageY - $canvasArea.offset().top;

 console.log("1.触摸点到屏幕左边的距离e.pageX: " + e.originalEvent.targetTouches[0].pageX);
 console.log("2.画布到屏幕左边的距离canvasArea.offset().left: " + $canvasArea.offset().left);
 console.log("3.触摸点到画布左边的距离= touchX(1.-2.): " + touchX);
 console.log("4.圆心到画布左边的距离pList[0].x： " + pList[0].x);
 console.log("5.触摸点到圆心的距离touchX - pList[0].x: " + (touchX - pList[0].x));

 //判断(touchX,touchY)是否在圆内
 var inThePoint = isTouchInAPoint(touchX, touchY)
 if(inThePoint){
 	console.log("in the point");
 	console.log(inThePoint);
 	ctx.strokeStyle = "#ffa726";
 	ctx.lineWidth = 2;
 	ctx.beginPath();
 	ctx.arc(inThePoint.x, inThePoint.y, r, 0, 2 * Math.PI);
 	ctx.fillStyle = "#ffa726";
 	ctx.fill();
 }




});














 