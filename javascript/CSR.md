# CSR 最佳实践

[client-side-rendering](https://github.com/theninthsky/client-side-rendering)

## 性能

1.  减少尺寸

    - 少用依赖
    - 选择轻量级的依赖，比如用 day.js 代替 moment，用 [zustand](https://github.com/pmndrs/zustand) 代替 [redux toolkit](https://redux-toolkit.js.org/introduction/getting-started)。

2.  缓存

    利用 webpack 的 cacheGroups 设置，提取依赖，当依赖没有变更时，hash 值不变，提高缓存利用率。推荐配置如下，让每个依赖拥有单独的文件和 hash，这样单个依赖变更时不会影响其他依赖。

```json
optimization: {
  runtimeChunk: 'single',
  splitChunks: {
    chunks: 'initial',
    cacheGroups: {
      vendor: {
        test: /[\\/]node_modules[\\/]/,
        // 加这句可以避免异步 chunk 的 vendor 重复问题，比如 a 和 b 都依赖 moment，不加这句 moment 会被打两遍而不是被提取出来
        chunk: 'all',
        // 让每个依赖拥有单独的文件和 hash
        name: ({ context }) => (context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/) || [])[1]
      }
    }
  }
}
```

3. Code Splitting，通常有两种

   1. 基于路由的 Code Splitting，当用户访问页面 A 时无需加载页面 B、C、D 的脚本
   2. 大依赖 Code Splitting，让整体页面更快出来，让大依赖的部分不影响页面渲染速度。

4. 预加载异步 Chunk

   主要避免出现下图中最后一个资源文件的瀑布流现象，思路是生成和路由对应的 assets 表，然后在 HTML 最前面加入「匹配路由生成 link preload 标签」的脚本。

5. 生成静态数据。

   在 build 阶段从 CMD 或服务器上把数据拉下来，存成 json 或其他格式，用户请求时就只需从本地读取即可，访问本地或就近的 CDN 肯定比访问远程服务器更快。如果要重新生成数据，重新跑 build 或者重新执行脚本就好。

6. 预加载数据。

   这和「4」类似，4 预加载的是 JS，这里需要预加载数据。做法也和「4」类似，把数据请求和路由做关联，然后运行时「匹配路由生成针对数据请求的 link preload 标签」。

7. 预加载其他页面的数据。

   当 hover（desktop）或进入 viewport（mobile）时，做的对应 Link 的 preload as fetch。

8. 避免序列化的渲染。

   比如一个应用有 Nav 导航 + 主内容，是应该先出导航再出主内容，还是应该导航和主内容都好了之后一起出？作者觉得应该是后者，实现方法是通过调整 Suspense 元素的位置。这一点其实我是有疑问的，我觉得前一种渲染方式也挺好，避免长时间的白屏。

9. Transition 切换页面（依赖 React 18）。

   当我们切换页面时，有两个选择。1）切过去，等 loading，渲染；2）等 loading，切过去+渲染。基于 React 18 的 useTransition 可以实现后者

10. 预加载异步页面。

    把 React.lazy 封一下，在 window load 事件之后延迟自动执行。

11. Module Federation
