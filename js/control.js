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

//存储设置的密码
var setArrStorage = [];

/** 用于设置密码时的重复确认输入密码(输入小于5位时不考虑)：
 *   初始值->0, 第一次合法设置->1->提示再次输入密码以确认，第二次合法设置并且和第一次相同->2->可以保存，第二次合法设置但和第一次设置不相同->3->清空，重设
 **/
var setPWDTimes = 0;

function Point(x, y) {
    this.x = x;
    this.y = y;
}

function initDraw() {
    ctx.strokeStyle = "#000000"; //圆圈线颜色
    ctx.lineWidth = 2;

    for (var i = 0; i < 3; i++) { //行
        for (var j = 0; j < 3; j++) { //列
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



//清空画布，恢复初始图案状态
function restoreCanvasToInit() {
    console.log("your canvas will be restored to initial state~");

    var msg = "请输入手势密码";
    $(".tip").text(msg);

    //重绘
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.fillRect(0, 0, canvasArea.width, canvasArea.height);
    ctx.closePath();
    initDraw();

}

//判断(touchX,touchY)是否在圆内，若在，则返回那个圆的圆心坐标
function isTouchInAPoint(touchX, touchY) {
    for (var i = 0; i < pointList.length; i++) {
        if (Math.pow((touchX - pointList[i].x), 2) + Math.pow((touchY - pointList[i].y), 2) < Math.pow(r, 2)) {
            return pointList[i];
        }
    }
    return 0;
}

//判断当前所触摸的圆圈是否已经存在于触摸轨迹中
function touchedBefore(point, touchList) {
    for (var i = 0; i < touchList.length; i++) {
        if ((point.x === touchList[i].x) && (point.y === touchList[i].y)) {
            return true;
        }
    }
    return false;
}

//手势的基本功能模块code backup(未区分set/verify两种工作模式之前的代码)
// $canvasArea.on("touchmove", function(e) {

//     //阻止默认事件（滑动）
//     e.preventDefault();

//     //获取触摸点到画布左边的距离(因为圆心的坐标就是相对于画布左边的)，便于判断是否在圆内以及连线
//     var touchX = e.originalEvent.targetTouches[0].pageX - $canvasArea.offset().left,
//         touchY = e.originalEvent.targetTouches[0].pageY - $canvasArea.offset().top;

//     // console.log("1.触摸点到屏幕左边的距离e.pageX: " + e.originalEvent.targetTouches[0].pageX);
//     // console.log("2.画布到屏幕左边的距离canvasArea.offset().left: " + $canvasArea.offset().left);
//     // console.log("3.触摸点到画布左边的距离= touchX(1.-2.): " + touchX);
//     // console.log("4.圆心到画布左边的距离pList[0].x： " + pointList[0].x);
//     // console.log("5.触摸点到圆心的距离touchX - pointList[0].x: " + (touchX - pointList[0].x));

//     var inWhichPoint = isTouchInAPoint(touchX, touchY);
//     if (inWhichPoint) { //如果在某个圆内
//         // console.log("in the point");
//         // console.log(inWhichPoint);

//         //把所点圆圈存入数组
//         // console.log("is this point added to touchList? " + touchList.indexOf(inWhichPoint));
//         if (touchList.length == 0) { //轨迹第一个圆
//             touchList.push(inWhichPoint);
//         } else if (!touchedBefore(inWhichPoint, touchList)) { //该圆尚不存在于该轨迹中
//             touchList.push(inWhichPoint);
//         }

//         // console.log("touchList.length: " + touchList.length);
//         // console.log(touchList);

//         //给所选圆圈填色

//         ctx.strokeStyle = "#ffa726";
//         ctx.lineWidth = 2;
//         ctx.beginPath();
//         ctx.arc(inWhichPoint.x, inWhichPoint.y, r, 0, 2 * Math.PI);
//         ctx.fillStyle = "#ffa726";
//         ctx.fill();
//         // ctx.lineTo(0,0);
//         // ctx.stroke();

//         /**	仅触摸的第一个圆圈用moveTo
//          * 	其他后续的都用lineTo
//          *	所以需要记录触摸了几个圆圈 => touchList数组
//          **/
//         var touchLen = touchList.length;
//         for (var i = 0; i < touchLen; i++) {
//             if (i == 0) {
//                 ctx.beginPath();
//                 ctx.moveTo(touchList[0].x, touchList[0].y);
//                 ctx.strokeStyle = "#d04839";

//             } else {
//                 ctx.lineTo(touchList[i].x, touchList[i].y);
//             }
//         }
//     } //end if(inWitchPoint)

//     ctx.stroke();
// }); //endof touchmove event listener

function setPWDHandler(e) {
    //阻止默认事件（滑动）
    e.preventDefault();

    //获取触摸点到画布左边的距离(因为圆心的坐标就是相对于画布左边的)，便于判断是否在圆内以及连线
    var touchX = e.originalEvent.targetTouches[0].pageX - $canvasArea.offset().left,
        touchY = e.originalEvent.targetTouches[0].pageY - $canvasArea.offset().top;

    var inWhichPoint = isTouchInAPoint(touchX, touchY);
    if (inWhichPoint) { //如果在某个圆内

        //把所点圆圈存入数组(设置密码，存入localStorage)
        if (setArrStorage.length == 0) { //轨迹第一个圆
            setArrStorage.push(inWhichPoint);
        } else if (!touchedBefore(inWhichPoint, setArrStorage)) { //该圆尚不存在于该轨迹中
            setArrStorage.push(inWhichPoint);
        }


        //给所选圆圈填色
        ctx.strokeStyle = "#ffa726";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(inWhichPoint.x, inWhichPoint.y, r, 0, 2 * Math.PI);
        ctx.fillStyle = "#ffa726";
        ctx.fill();

        /**	仅触摸的第一个圆圈用moveTo
         * 	其他后续的都用lineTo
         *	所以需要记录触摸了几个圆圈 => touchList数组
         **/
        var setArrLen = setArrStorage.length;
        for (var i = 0; i < setArrLen; i++) {
            if (i == 0) {
                ctx.beginPath();
                ctx.moveTo(setArrStorage[0].x, setArrStorage[0].y);
                ctx.strokeStyle = "#d04839";

            } else {
                ctx.lineTo(setArrStorage[i].x, setArrStorage[i].y);
            }
        }
    } //end if(inWitchPoint)

    ctx.stroke();

};

function setPWDEndHandler() {

    console.log("touchend~");

    if (setArrStorage.length < 5) {
        var msg = "密码太短，至少需要5个点";
        $(".tip").text(msg);

        //清空痕迹数组
        setArrStorage.splice(0, setArrStorage.length);
        //重绘canvas
        setTimeout(restoreCanvasToInit, 2000);


    } else if ((setArrStorage.length >= 5) && (setPWDTimes === 0)) { //第一次合法设置成功，需要重复设置密码以确认

        var msg = "请再次输入密码以确认";
        $(".tip").text(msg);

        //记录本次(第一次)设置的密码
        //localStorage只能存储字符串形式，不能直接存储数组或对象，所以要用json转化一下
        var setArrStorageJSON1 = JSON.stringify(setArrStorage);
        localStorage["setpwd1"] = setArrStorageJSON1;
        console.log("first set succeeded as below~pls set it again~");
        console.log(localStorage["setpwd1"]);

        //第一次合法设置成功
        setPWDTimes = 1;

        //清空痕迹数组
        setArrStorage.splice(0, setArrStorage.length);
        //重绘canvas
        setTimeout(restoreCanvasToInit, 2000);

    } else if ((setArrStorage.length >= 5) && (setPWDTimes === 1)) { //确认输入密码，并且两次输入密码相同后，才可以存储到localStorage

        //比较两次设置是否一致：数量，顺序
        var setArrStorageJSON2 = JSON.stringify(setArrStorage);

        if (localStorage["setpwd1"] == setArrStorageJSON2) { //成功设置，可以清除第一次设置时的存储

        	var msg = "成功设置密码";
        	$(".tip").text(msg);

            localStorage["setpwd2"] = setArrStorageJSON2;

            //清空痕迹数组
            setArrStorage.splice(0, setArrStorage.length);
            //重绘canvas
            setTimeout(restoreCanvasToInit, 2000);

            console.log("second set succeeded as below~ Read Set succeeded~~");
            console.log(localStorage["setpwd2"]);

        } else { //两次设置不相等
            var msg = "两次输入不一致，请重新输入"
            $(".tip").text(msg);

            //清除第一次设置的localStorage
            localStorage.removeItem("setpwd1");

            //清空痕迹数组
            setArrStorage.splice(0, setArrStorage.length);
            //重绘canvas
            setTimeout(restoreCanvasToInit, 2000);

            setPWDTimes = 0;

        }

    }

} //endof setPWDEndHandler


//事件代理/事件委托
$(".menu_item").on("click", "input", function() {

    var menu = $("input[name='OperationMenu']").filter(":checked").attr("value");
    console.log(menu + "clicked!");

    if (menu === "setPWD") { //设置密码
        console.log("you are setting PWD~");

        $(canvasArea).off("touchmove", verifyPWDHandler);
        $(canvasArea).off("touchend", verifyPWDEndHandler);

        $(canvasArea).on("touchmove", setPWDHandler);
        $(canvasArea).on("touchend", setPWDEndHandler);


    } else if(menu === "verifyPWD") { //验证密码
        console.log("you are vertifying PWD~");

        $(canvasArea).off("touchmove", setPWDHandler);
        $(canvasArea).off("touchend", setPWDEndHandler);

        $(canvasArea).on("touchmove", verifyPWDHandler);
        $(canvasArea).on(:"touchend", verifyPWDEndHandler);

    }
});


$(document).ready(function() {
    $("#setPWDradio").click();
});
