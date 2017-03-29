# gesturepwd360
a UI component for 360 Front-End Star Plan

### 进度、遇到的困难及解决办法
#### 3.27  2h     实现除paint_canvas外的页面基本布局，了解zepto.js 
#### 3.28  3.5h   完成手势解锁的初始界面绘制，实现触摸的目标圆圈并填充目标圆圈颜色的功能。
1. 问题描述：无法正常识别触摸的目标圆圈

    思路：获取触摸点到canvas左边界的距离，依次与9个圆心到canvas左边距的距离进行比较，若在圆内，则再次绘制该圆，并填充颜色。

    以x方向为例：注意触摸点到屏幕左边界的距离pageX, canvas画布到屏幕左边界的距离offset().left。

    打印和比较各个中间值，发现触摸点在画布的左右边界时，pageX变化范围比canvas宽度大得多(本应等于canvas宽度)，怀疑是canvas画布内的宽高与pageX计算方式不一致，或是canvas画布的宽高比例问题。于是调整canvas的width和height(行内，一般都写在canvas标签中)，并取消在css文件中设置该画布的宽高，只设置margin值，就解决了。

2. 问题描述：zepto/jquery选择的canvas元素，不能获取其getContext("2d")
函数，只能用document.getElementById()获取canvas元素才能使用，而绑定touchstart touchmove事件则需要jquery这样的库来实现比较方便。

    暂时还没解决。

#### 3.29 实现保存触摸轨迹数组，并能边填色边连线。

1. 问题描述：随触摸点连接线段的绘制。

    无法实现跨圆连续：每次进入一个圆都要重新开始，因为填充颜色完毕时，当前ctx的line是停留在顺时针90度的位置。
    
    如果手动跟随touchX和touchY画lineTo，则圆圈外部的线会跟随手势的曲线轨迹。为了实现直接按照两个圆心连接轨迹，应该每次进入一个新的圆圈时，轨迹数组更新，填充颜色，遍历轨迹数组绘制连线段，不跟随touchX,touchY。


2. 问题描述：即使在同一个圆内移动触发touchmove，还是会不停加入到轨迹数组中。

    该数组保存的是Point对象，每次touchmove事件被触发时，都会判断一次inWhichPoint,而这个函数会返回所在的Point（每次进入这个圆都会新产生一个Point对象返回），假如这个圆已经在轨迹中出现过，则这个新产生Point对象和已加入数组的那个Point对象虽然key-value对完全相同，但是它们不是同一个对象，所以不能用indexOf()来判断数组中是否已存在该Point对象。=>改写判断方法。






