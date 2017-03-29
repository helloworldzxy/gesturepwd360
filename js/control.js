




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

var space = 140, //左数第一个圆的最左边到左屏幕的间隙，相邻两个圆心的距离为2*space
	r = 100; //圆圈半径

//9个圆圈的圆心坐标信息Point对象组成数组
var pointList = [];

//将触摸过的圆圈存入数组
var touchList = [];

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
			pointList.push(point);
		}
	}
}

initDraw();

// console.log(pointList);

 //判断(touchX,touchY)是否在圆内，若在，则返回那个圆的圆心坐标
function isTouchInAPoint(touchX, touchY){
	for(var i = 0; i < pointList.length; i++){
		if(Math.pow((touchX - pointList[i].x), 2) +  Math.pow((touchY - pointList[i].y), 2)  < Math.pow(r, 2)){
			return pointList[i];
		}
	}
	return 0;
}

//判断当前所触摸的圆圈是否已经存在于触摸轨迹中
function touchedBefore(point, touchList){
	for(var i = 0; i < touchList.length; i++){
		if((point.x === touchList[i].x) && (point.y === touchList[i].y)){
			return true;
		}
	}
	return false;
}


$canvasArea.on("touchmove", function(e) {

//阻止默认事件（滑动）
 e.preventDefault();

 //获取触摸点到画布左边的距离(因为圆心的坐标就是相对于画布左边的)，便于判断是否在圆内以及连线
 var touchX = e.originalEvent.targetTouches[0].pageX - $canvasArea.offset().left,
 	 touchY = e.originalEvent.targetTouches[0].pageY - $canvasArea.offset().top;

 // console.log("1.触摸点到屏幕左边的距离e.pageX: " + e.originalEvent.targetTouches[0].pageX);
 // console.log("2.画布到屏幕左边的距离canvasArea.offset().left: " + $canvasArea.offset().left);
 // console.log("3.触摸点到画布左边的距离= touchX(1.-2.): " + touchX);
 // console.log("4.圆心到画布左边的距离pList[0].x： " + pointList[0].x);
 // console.log("5.触摸点到圆心的距离touchX - pointList[0].x: " + (touchX - pointList[0].x));

 var inWhichPoint = isTouchInAPoint(touchX, touchY);
 if(inWhichPoint){//如果在某个圆内
 	// console.log("in the point");
 	// console.log(inWhichPoint);

 	//把所点圆圈存入数组
 	// console.log("is this point added to touchList? " + touchList.indexOf(inWhichPoint));
 	if(touchList.length == 0){ //轨迹第一个圆
 		touchList.push(inWhichPoint);
 	}else if(!touchedBefore(inWhichPoint, touchList)){ //该圆尚不存在于该轨迹中
 		touchList.push(inWhichPoint);
 	}

 	console.log("touchList.length: " + touchList.length);
 	console.log(touchList);

 	//给所选圆圈填色
 	ctx.strokeStyle = "#ffa726";
 	ctx.lineWidth = 2;
 	ctx.beginPath();
 	ctx.arc(inWhichPoint.x, inWhichPoint.y, r, 0, 2 * Math.PI);
 	ctx.fillStyle = "#ffa726";
 	ctx.fill();

 	//连接线段
 	//ctx.strokeStyle = "#d04839";

 	/**	仅触摸的第一个圆圈用moveTo
 	* 	其他后续的都用lineTo
 	*	所以需要记录触摸了几个圆圈
 	**/
 	// if(touchList.length > 0){
 		//ctx.moveTo(inWhichPoint.x, inWhichPoint.y);
 	// }
 	

 } //end if
 //ctx.lineTo(touchX, touchY);
 	
 //ctx.stroke();

});














 