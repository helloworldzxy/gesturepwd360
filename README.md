# gesturepwd360
a UI component for 360 Front-End Star Plan

### 演示: https://helloworldzxy.github.io/gesturepwd360/

### 进度、遇到的困难及解决办法
#### 3.27  实现除paint_canvas外的页面基本布局，了解zepto.js 
#### 3.28  完成手势解锁的初始界面绘制，实现触摸的目标圆圈并填充目标圆圈颜色的功能。

1. 问题描述：无法正常识别触摸的目标圆圈

    思路：获取触摸点到canvas左边界的距离，依次与9个圆心到canvas左边距的距离进行比较，若在圆内，则再次绘制该圆，并填充颜色。

    以x方向为例：注意触摸点到屏幕左边界的距离pageX, canvas画布到屏幕左边界的距离offset().left。

    打印和比较各个中间值，发现触摸点在画布的左右边界时，pageX变化范围比canvas宽度大得多(本应等于canvas宽度)，怀疑是canvas画布内的宽高与pageX计算方式不一致，或是canvas画布的宽高比例问题。于是调整canvas的width和height(行内，一般都写在canvas标签中)，并取消在css文件中设置该画布的宽高，只设置margin值，就解决了。

2. 问题描述：zepto/jquery选择的canvas元素，不能获取其getContext("2d")
函数，只能用document.getElementById()获取canvas元素才能使用，而绑定touchstart touchmove事件则需要jquery这样的库来实现比较方便。

    暂时还没解决。

#### 3.29 实现保存触摸轨迹数组，并能边填色边连线。实现了重复确认设置密码功能。

1. 问题描述：随触摸点连接线段的绘制。

    无法实现跨圆连续：每次进入一个圆都要重新开始，因为填充颜色完毕时，当前ctx的line是停留在顺时针90度的位置。
    
    如果手动跟随touchX和touchY画lineTo，则圆圈外部的线会跟随手势的曲线轨迹。为了实现直接按照两个圆心连接轨迹，应该每次进入一个新的圆圈时，轨迹数组更新，填充颜色，遍历轨迹数组绘制连线段，不跟随touchX,touchY。


2. 问题描述：即使在同一个圆内移动触发touchmove，还是会不停加入到轨迹数组中。

    该数组保存的是Point对象，每次touchmove事件被触发时，都会判断一次inWhichPoint,而这个函数会返回所在的Point（每次进入这个圆都会新产生一个Point对象返回），假如这个圆已经在轨迹中出现过，则这个新产生Point对象和已加入数组的那个Point对象虽然key-value对完全相同，但是它们不是同一个对象，所以不能用indexOf()来判断数组中是否已存在该Point对象。=>改写判断方法。

3. 问题描述：将设置的密码存入localStorage中，原本存储触摸点用的是touchList数组，但是localStorage只能存储字符串。

    将存储数组转化成JSON再存。

    [使用sessionStorage、localStorage存储数组与对象](https://my.oschina.net/crazymus/blog/371757)

4. 问题描述：如何清空画布，重绘

    ```javascript
    //下面前三个都不管用，方法四可以。

    //方法一：
    ctx.save(); 
    ctx.restore();

    //方法二：
    var imageData = ctx.getImageData(x , y, ctx.width, ctx,height);
    ctx.putImage(imageData, x, y);
    //方法二报错为：control.js:59 Uncaught TypeError: Failed to execute 'getImageData' on 'CanvasRenderingContext2D': The provided double value is non-finite.

    [stackoverflow相关解答](http://stackoverflow.com/questions/26688168/uncaught-securityerror-failed-to-execute-getimagedata-on-canvasrenderingcont)

    //方法三：直接重新绘制，调用initDraw(),仍无变化

    //方法四：重新绘制，但是在调用initDraw()之前，重新设置ctx笔触属性
    ctx.fillStyle = "#ffffff";  
    ctx.beginPath();  
    ctx.fillRect(0, 0, canvasArea.width, canvasArea.height);  
    ctx.closePath();  
    initDraw();
    ```

    随之而来的问题：重绘成功后，再画的连线会留下上一次线段的痕迹。=> 重绘时应清空setArrStorage数组(因为是全局的)。

#### 3.30 实现验证密码功能；整体功能完善（逻辑，布局）。

1. 问题：设置密码时，前两次设置成功后，第三次输入应视作重新设置新密码来处理，而不是提示再次确认输入。=> 设置密码成功的处理逻辑中重置`setPWDTimes = 0;`回到初始状态即可。

2. 最上面的信号栏不需要自己实现。移动端经验不足。

3. 问题：只触摸不滑动的时候应该也点亮按钮。=> touchmove绑定事件的地方加上touchstart一起绑定。

4. 问题：setPWD的touchstart，如果在圆圈按钮外部点击，应该不触发任何操作。=> 设置全局变量clickedInPoint，初始化为false。只有单击在圆内(也即inWhichPoint有返回值时)才赋值true，在setPWDEndHandler和vertifyPWDEndHandler内部都检测该值后再操作。

5. 发布时应注释掉所有的console.log以提高性能。

6. 注意在PC端设置的字体在移动端显示效果可能会不一样。如Cursive。

#### 后期计划

因为赶进度主要为了跑通逻辑，还有很多地方需要完善。

- 这次我直接用的熟悉的jQuery，因为是面向移动端，应尝试用zepto.js重构，后者更轻量级。
- 代码优化。
- 界面布局响应式设计。
- 没有封装成组件形式。组件可对外提供参数设置，用户直接调用封装好的组件即可使用定制颜色的手势解锁功能。



