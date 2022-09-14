# 响应式设计的步骤

1. 设置 meta 标签

大多数移动浏览器将 HTML 页面放大为宽的视图（viewport）以符合屏幕分辨率。
可以使用视图的 meta 标签来进行重置，告诉浏览器，使用设备的宽度作为视图宽度并禁止初始的缩放。

```html
<meta
  name="viewport"
  content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
/>
```

2. 通过媒体查询设置样式

告诉浏览器如何为指定视图宽度渲染页面，兼容 iPad 和 iPhone 的视图可进行如下设置

```css
@media only screen and (max-width: 980px) {
  /* css style */
}
/** iPad **/
@media only screen and (min-width: 768px) and (max-width: 1024px) {
}
/** iPhone **/
@media only screen and (min-width: 320px) and (max-width: 767px) {
}
```

3. 宽度需要使用百分比

4. 处理图片缩放

尝试给图片指定的最大宽度为百分比。假如图片超过了，就缩小。假如图片小了，就原尺寸输出。

```css
img {
  width: auto;
  max-width: 100%;
}
```

用`::before` 和`::after` 伪元素 + `content 属性`来动态显示一些内容或者做其它很酷的事情，
在 CSS3 中，任何元素都可以使用 content 属性了。

这个方法就是结合 css3 的 attr 属性和 HTML 自定义属性的功能

```html
<img
  src="image.jpg"
  data-src-600px="image-600px.jpg"
  data-src-800px="image-800px.jpg"
  alt=""
/>
```

```css
@media (min-device-width: 600px) {
  img[data-src-600px] {
    content: attr(data-src-600px, url);
  }
}

@media (min-device-width: 800px) {
  img[data-src-800px] {
    content: attr(data-src-800px, url);
  }
}
```

[应运而生的 web 页面响应布局](https://www.zhangxinxu.com/wordpress/2011/09/%e9%a1%b5%e9%9d%a2%e5%93%8d%e5%ba%94%e5%b8%83%e5%b1%80/)

[css-responsive-layout](https://www.zhangxinxu.com/study/201109/css-responsive-layout.html)
