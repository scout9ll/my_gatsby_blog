---
path: ""
date: "2020-10-04"
title: ""
tags: []
weather: ⛅
---

# 事件循环规范

## 定义

为了协调事件、用户交互、脚本、渲染、网络等等任务，用户代理（处理环境）必须使用事件循环模型来处理。每个代理都有一个*唯一*关联的事件循环

同源窗口代理的事件循环被叫做`窗口事件循环`，专门的 worker、共享 worker 及 service worker 被叫做`worker事件循环`，worklet 代理的事件循环则叫`worklet 事件循环`。

> 每一个事件循环不一定都需要对应的线程。例如多个窗口事件循环可以被一个线程协同调度。
>
> 然而，对于\[\[CanBlock\]\]被设置为`ture`的 wokrer 代理，JavaScript 规范 对它们提出了有关进度的要求，这就等于要求他们得要专门的线程

一个事件循环至少有一个任务队列。_注意：任务队列只是一组任务_

> 任务队列是一个集，不是队列，因为事件循环处理模型的第一步是在队列中去抓取一个`可运行的任务`，而不是出列第一个任务。  

> 微任务队列不是一个任务队列

任务封装了负责以下工作的算法：
>任务类型

- 事件  
    在特定的EventTarget对象上分派Event对象通常是由专门的任务完成的

- 解析  
    HTML parser 标识一个或多个字节，然后处理任意结果的标识符，这是一个典型的任务

- 回调  
    调用回调通常是由专用任务完成的。

- 使用资源  
    当一个算法获取一个资源，如果获取发生在非阻塞时，之后资源一旦有效，任务就会处理资源

- 对DOM操作做出反应  
    DOM操作会触发一些元素的事件。例如当一个元素被插入到文档中时

一般一个任务有以下结构：

- 步骤  

- 来源  

- 文档  

- 脚本执行环境的设置  

当他们的文档为空或完全活跃（加载完毕）时则称该task为可执行的

根据其源字段，每个任务被定义为来自特定的任务源。对于每个事件循环，每个任务源必须与特定的任务队列相关联。

本质上，标准中使用任务源来分离逻辑上不同的任务类型，用户代理可能希望区分这些任务。 用户代理使用任务队列在给定的事件循环中合并任务源

>例如，用户代理可能具有一个用于鼠标和按键事件的任务队列（与用户交互任务源相关联），而另一个则与所有其他任务源相关联。 然后，使用在事件循环处理模型的初始步骤中授予的自由度，它可以使键盘和鼠标事件在其他任务上有四分之三的时间优先于其他任务，从而使界面具有响应能力，但不会使其他任务队列饿死。 请注意，在此设置中，处理模型仍会强制用户代理永远不会处理任何任务源中的事件。

Each event loop has a currently running task, which is either a task or null. Initially, this is null. It is used to handle reentrancy.
每个事件循环有一个当前运行的任务，可以是空。初始话时，它是空的，被用来处理再入

Each event loop has a microtask queue, which is a queue of microtasks, initially empty. A microtask is a colloquial way of referring to a task that was created via the queue a microtask algorithm.
每个事件循环有一个宏任务队列，用来存入一组宏任务，初始话事为空。一个宏任务是指通过宏任务算法创建的任务

Each event loop has a performing a microtask checkpoint boolean, which is initially false. It is used to prevent reentrant invocation of the perform a microtask checkpoint algorithm.
每个事件循环都有一个执行微任务检查点的布尔值，它用于防止执行微任务检查点算法的可重入调用。

