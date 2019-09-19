---
path: "/blog/Promise"
date: "2019-05-12"
title: "深入Promise"
tags: ["Promise", "ES6", "原生JS"]
---

## 基本语法

```js
new Promise( function(resolve, reject) {...} /* executor */  );
```

### 参数

executor

> executor 是带有 resolve 和 reject 两个参数的函数 。Promise 构造函数执行时立即调用 executor 函数， resolve 和 reject 两个函数作为参数传递给 executor\*_（executor 函数在 Promise 构造函数返回所建 promise 实例对象前被调用)_。resolve 和 reject 函数被调用时，分别将 promise 的状态改为 fulfilled（完成）或 rejected（失败）。executor 内部通常会执行一些异步操作，一旦异步操作执行完毕(可能成功/失败)，要么调用 resolve 函数来将 promise 状态改成 fulfilled，要么调用 reject 函数将 promise 的状态改为 rejected。如果在 executor 函数中抛出一个错误，那么该 promise 状态为 rejected。executor 函数的返回值被忽略。

### 描述

`Promise`对象是一个*代理对象*,它将所代理的值设定三个状态,并绑定状态改变的回调函数(微任务异步执行).

#### 三个状态

- pending: 初始状态，既不是成功，也不是失败状态。
- fulfilled: 意味着操作成功完成。
- rejected: 意味着操作失败。

> 当其中任一种情况出现时，Promise 对象的 then 方法绑定的处理方法（handlers ）就会被调用（then 方法包含两个参数：onfulfilled 和 onrejected，它们都是 Function 类型。当 Promise 状态为 fulfilled 时，调用 then 的 onfulfilled 方法，当 Promise 状态为 rejected 时，调用 then 的 onrejected 方法， 所以在异步操作的完成和绑定处理方法之间不存在竞争）。

#### 链式调用

因为 Promise.prototype.then 和 Promise.prototype.catch 方法返回 promise 对象， 所以它们可以被链式调用。
![promise](https://mdn.mozillademos.org/files/8633/promises.png)

```js
doSomething()
  .then(result => doSomethingElse(result))
  .then(newResult => doThirdThing(newResult))
  .then(finalResult => {
    console.log(`Got the final result: ${finalResult}`)
  })
  .catch(failureCallback)
```

### 约定

不同于“老式”的传入回调，在使用 Promise 时，会有以下约定：

- 在 本轮 Javascript event loop（事件循环）运行完成 之前，回调函数是不会被调用的。
- 通过 then() 添加的回调函数总会被调用，即便它是在异步操作完成之后才被添加的函数。
- 通过多次调用 then()，可以添加多个回调函数，它们会按照插入顺序一个接一个独立执行。

## 尝试实现

### step1-创建状态,代理值以及回调函数

```js
function Promise(executor) {
  if (typeof this !== "object") {
    throw new TypeError("Promise must be constructed via new")
  }
  if (typeof executor !== "function") {
    throw new TypeError("Promise argument must be a function")
  }
  this._status = "pending"
  this._value = null
  this.onFulfilled = () => {} //成功的回调
  this.onRejected = () => {} //失败的回调

  try {
    executor(resolve, reject)
  } catch (e) {
    reject(e)
  }
}
```

### step2-使用 resolve 和 reject 执行回调

```js
function Promise(executor) {
  //~~~~~~
  function resolve(value) {
    //确保resolve和reject只执行一次
    if (this.status === PENDING) {
      this.status = FULFILLED
      this.value = value
      this.onFulfilled() //PromiseA+ 2.2.6.1
    }
  }

  function reject(reason) {
    if (this.status === PENDING) {
      this.status = REJECTED
      this.reason = reason
      this.onRejected() //PromiseA+ 2.2.6.2
    }
  }
}
```

### step3-利用 then 接受回调,并必须返回一个 promise

```js
Promise.prototype.then = function(onFulfilled, onRejected) {
  //PromiseA+ 2.2.1 / PromiseA+ 2.2.5 / PromiseA+ 2.2.7.3 / PromiseA+ 2.2.7.4
  onFulfilled = typeof onFulfilled === "function" ? onFulfilled : value => value
  onRejected =
    typeof onRejected === "function"
      ? onRejected
      : reason => {
          throw reason
        }
  let self = this //绑定为上层promise的上下文
  //PromiseA+ 2.2.7
  let promise2 = new Promise((resolve, reject) => {
    // 若status已经处于settled则直接执行回调
    if (self.status === FULFILLED) {
      //PromiseA+ 2.2.2
      //PromiseA+ 2.2.4 --- setTimeout
      setTimeout(() => {
        try {
          //PromiseA+ 2.2.7.1
          let result = onFulfilled(self.value)
          resolvePromise(promise2, result, resolve, reject) //接受
        } catch (e) {
          //PromiseA+ 2.2.7.2
          reject(e)
        }
      })
    } else if (self.status === REJECTED) {
      //PromiseA+ 2.2.3
      setTimeout(() => {
        try {
          let result = onRejected(self.reason)
          resolvePromise(promise2, result, resolve, reject)
        } catch (e) {
          reject(e)
        }
      })
    }
    //若status还处于PENDING则只用绑定回调
    else if (self.status === PENDING) {
      //回调需异步执行
      self.onFulfilled = () => {
        setTimeout(() => {
          try {
            //传递 result作为then返回的promise的代理值
            let result = onFulfilled(self.value)
            resolvePromise(promise2, result, resolve, reject)
          } catch (e) {
            reject(e)
          }
        })
      }
      self.onRejected = () => {
        setTimeout(() => {
          try {
            let result = onRejected(self.reason)
            resolvePromise(promise2, result, resolve, reject)
          } catch (e) {
            reject(e)
          }
        })
      }
    }
  })
  return promise2
}
```

### step4-判断回调本身返回的是否为 Promise

若回调本身返回 promise 则等待其 resolve,否则另起返回一个 resolve(result)的 promise2

```js
function resolvePromise(promise2, result, resolve, reject) {
  let self = this
  //PromiseA+ 2.3.1
  if (promise2 === result) {
    reject(new TypeError("Chaining cycle"))
  }
  if ((result && typeof result === "object") || typeof result === "function") {
    let used //PromiseA+2.3.3.3.3 只能调用一次
    try {
      let then = result.then
      if (typeof then === "function") {
        //PromiseA+2.3.3
        then.call(
          result,
          y => {
            //PromiseA+2.3.3.1
            if (used) return
            used = true
            resolvePromise(promise2, y, resolve, reject)
          },
          r => {
            //PromiseA+2.3.3.2
            if (used) return
            used = true
            reject(r)
          }
        )
      } else {
        //PromiseA+2.3.3.4
        if (used) return
        used = true
        resolve(x)
      }
    } catch (e) {
      //PromiseA+ 2.3.3.2
      if (used) return
      used = true
      reject(e)
    }
  } else {
    //PromiseA+ 2.3.3.4 ,当返回的为非promise时
    resolve(x)
  }
}
```
