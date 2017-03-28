# gesturepwd360
a UI component for 360 Front-End Star Plan

### 进度、遇到的困难及解决办法
#### 3.28  2h     实现除paint_canvas外的页面基本布局，了解zepto.js 
#### 3.29  3.5h   完成手势解锁的初始界面绘制，实现触摸的目标圆圈并填充目标圆圈颜色的功能。
1. 问题描述：无法正常识别触摸的目标圆圈

    思路：获取触摸点到canvas左边界的距离，依次与9个圆心到canvas左边距的距离进行比较，若在圆内，则再次绘制该圆，并填充颜色。

    以x方向为例：注意触摸点到屏幕左边界的距离pageX, canvas画布到屏幕左边界的距离offset().left。

    打印和比较各个中间值，发现触摸点在画布的左右边界时，pageX变化范围比canvas宽度大得多(本应等于canvas宽度)，怀疑是canvas画布内的宽高与pageX计算方式不一致，或是canvas画布的宽高比例问题。于是调整canvas的width和height(行内，一般都写在canvas标签中)，并取消在css文件中设置该画布的宽高，只设置margin值，就解决了。

2. 问题描述：zepto/jquery选择的canvas元素，不能获取其getContext("2d")
函数，只能用document.getElementById()获取canvas元素才能使用，而绑定touchstart touchmove事件则需要jquery这样的库来实现比较方便。

    暂时还没解决。

