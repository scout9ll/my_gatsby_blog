---
path: "/blog/setState"
title: "setState那些事"
date: "2019-07-15"
tags: ["react", "state"]
---

关于 setState

> 经常用 react 都知道 setState 后并不会立刻取到 state,难道 setState 是个异步事件吗?其实并不然,今天来看看 setState 到底是如何执行的.

## setState 的策略

setState 作为 react 更新 UI 的触发器,如果每次 setState 都执行渲染,当应用的数据量到达一定程度后,那么用户一次操作的渲染次数将是灾难级的,对性能的消耗也是巨大的,因此 setState 必然不可能是每次都会立即渲染的,来看看源码是如何来抉择何时渲染的,这里我只列出执行 setState 的核心代码,主要理解其思想

### 当执行 setState 时,会将 state push 入更新列队

```js
ReactComponent.prototype.setState = function(partialState, callback) {
  invariant(
    typeof partialState === "object" ||
      typeof partialState === "function" ||
      partialState == null,
    "setState(...): takes an object of state variables to update or a " +
      "function which returns an object of state variables."
  )
  this.updater.enqueueSetState(this, partialState)
  if (callback) {
    this.updater.enqueueCallback(this, callback, "setState")
  }
}
```

### setState 将进行判断是否渲染 UI

```js
//enqueueSetState 中
function requestWork(root, expirationTime) {
  addRootToSchedule(root, expirationTime)

  if (isRendering) {
    // Prevent reentrancy. Remaining work will be scheduled at the end of
    // the currently rendering batch.
    return
  }

  if (isBatchingUpdates) {
    // Flush work at the end of the batch.
    if (isUnbatchingUpdates) {
      // ...unless we're inside unbatchedUpdates, in which case we should
      // flush it now.
      nextFlushedRoot = root
      nextFlushedExpirationTime = Sync
      performWorkOnRoot(root, Sync, false)
    }
    return
  }

  // TODO: Get rid of Sync and use current time?
  if (expirationTime === Sync) {
    performSyncWork()
  } else {
    scheduleCallbackWithExpiration(expirationTime)
  }
}
```

因此可以看出在执行更新 state 渲染 UI 前是有 3 个`if`判断:`isRendering`,`isBatchingUpdates`,`expirationTime === Sync`;

- 当 `isRendering` 时,直接 return,不会渲染,那么什么时候属于`isRendering`呢,答案是在钩子函数中,如`componentDidMount`等
- 当`isBatchingUpdates`时,会判断后 return,`isBatchingUpdates`是在合成事件中.

## 总结

- setState 造成不能同步的情况,是应为 setState 的批量更新的策略导致不是每一次都能完成更改 state,这并不是真正的异步.
- 若想同步取到,需要脱离`isRendering`,`isBatching`,即在合成事件和钩子函数之外执行,当然也可以写入`setState({state},callback)`的 callBack 中
