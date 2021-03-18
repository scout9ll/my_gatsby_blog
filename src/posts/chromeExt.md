## 如何实现一个扩展程序

### 扩展程序可以做什么

他们可以修改用户看到的 Web 内容，并与之交互或扩展和更改浏览器本身的行为。

####

### 什么是扩展程序

扩展是基于事件的程序，用于修改或增强 Chrome 浏览器的浏览体验。事件是浏览器的触发器，比如导航到新页面、删除书签或关闭选项卡。
扩展使用 background 的 service worker 中的脚本监控这些事件，然后用指定的指令做出反应。

web 开发技术:HTML、CSS 和 JavaScript。扩展的组件取决于它的功能，可能不需要每个选项。

扩展程序可接受的事件

- 扩展程序初次加载或更新
- 背景页(background page)正在监听的一个事件被发布
- 内容脚本发送信息
- 扩展程序中的其它视图页调用`runtime.getBackgroundPage`

### 五大元素

#### Background script

The background script is the extension's event handler; it contains listeners for browser events that are important to the extension. It lies dormant until an event is fired then performs the instructed logic. An effective background script is only loaded when it is needed and unloaded when it goes idle.
background script 中包含浏览器许多事件的监听器，可在其中编写各种事件的响应逻辑。

#### UI 元素

使用合适的交互元素来访问我们的扩展程序

- 上下文菜单
- 导航栏
- keyboard shortcut
- 

#### content

如果扩展程序需要与用户加载的网页交互，那么必需要使用内容脚本。内容脚本可以修改网页。

内容脚本中是一些 JS 代码，在已加载到浏览器的页面的上下文中执行，可以读取和修改浏览器访问的网页的 DOM。应该将内容脚本视为已加载网页的一部分

#### popup

#### background

#### manifest

### 核心概念

由于内容脚本在web页面的上下文中运行，而不是在扩展中运行，因此它们通常需要某种方式与扩展的其余部分进行通信
