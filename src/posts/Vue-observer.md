---
path: "/blog/Vue-Observer"
date: "2019-07-23"
title: "Vue-observer"
tags: ["VUE", "Observer"]
---

>

## 实现一个 observer

vue 是一个 MVVM 的框架,简单的说是一个数据绑定视图的模式,Vue 的该单项绑定是通过观察者模式实现的,即函数订阅数据,当其数据改变,则所有函数触发.

>     看一看官方的原理图
>
> ![VUE](https://cn.vuejs.org/images/data.png)

### convert object

> 首先要实现 Vue 中的 Data.anyState = 'something' ==> something will change
> 必须通过设置访问属性或者代理来实现赋值的时候执行制定动作

```js
function convert(obj) {
  for (const key in obj) {
    let value = obj[key]
    Object.defineProperty(obj, key, {
      get() {
        return value
      },
      set(newValue) {
        // some function
        value = newValue
      },
    })
  }
}
```

### Dependency Collecting

> 确保每一次 state 改变,都能响应相应的所有函数,我们需要有一个容器收集并相应(observer 模式)这些依赖数据的函数(下文会简称`依赖`)

```js
 class Dep {
      constructor() {
        this.subscribers = new Set() //同一action 只会注册一次
      }
      depend() {
          this.subscribers.add(activeUpdate) //collect
        }
      }
      notify() {
        this.subscribers.forEach(subscriber => subscriber()) // react
      }

    }
```

### Dependency Tracking

> 当然,在收集这些依赖之前,我们应该先判断函数是否依赖该数据.
> 那么,update 依赖数据的依据是什么呢?让我们想想,是不是只要该函数中存在`state`,那么这个函数一定会访问到该`get`属性?所以,可以在`get`中收集它.
> 为此,我们需要一个变量去保存该 update 函数.

```js
const dep = new Dep
get() {
        dep.depend()
        return value
      },
```

> 为此,我们需要一个变量去保存该 update 函数

```js
let activeUpdate //保存正在经过get的update函数
//依赖数据的update函数
function autorun(update) {
  function wrappedUpdate() {
    activeUpdate = wrappedUpdate //闭包保存此次wrapperUpdate
    update() //闭包保存update函数,update将是render该组件
    activeUpdate = null
  }
  wrappedUpdate()
}
```

> 最后,通过 depend 将 activeUpdate 成功收集

```js
depend() {
        if (activeUpdate) {
          // register the current active update as a subscriber
          this.subscribers.add(activeUpdate)
        }
      }
```

### Vue mini Observer 的最终实现

简单实现 data==>View

```js
function isObject(obj) {
  return (
    typeof obj === "object" &&
    !Array.isArray(obj) &&
    obj !== null &&
    obj !== undefined
  )
}
function observe(obj) {
  if (!isObject(obj)) {
    throw new TypeError()
  }
  Object.keys(obj).forEach(key => {
    let internalValue = obj[key]
    let dep = new Dep() // 每个属性一个独立的观察者
    Object.defineProperty(obj, key, {
      get() {
        dep.depend()
        return internalValue
      },
      set(newValue) {
        const isChanged = internalValue !== newValue
        if (isChanged) {
          internalValue = newValue
          console.log("test")
          dep.notify()
          dep.subscriber()
        }
      },
    })
  })
}
class Dep {
  constructor() {
    this.subscribers = new Set()
  }
  depend() {
    if (activeUpdate) {
      this.subscribers.add(activeUpdate)
    }
  }
  notify() {
    this.subscribers.forEach(subscriber => subscriber())
  }
  subscriber() {
    this.subscribers.forEach(subscriber1 => console.log(subscriber1))
  }
}
const dep = new Dep()

let activeUpdate

function autorun(update) {
  function wrappedUpdate() {
    activeUpdate = wrappedUpdate
    update()
    activeUpdate = null
  }
  wrappedUpdate()
}

const state = {
  test: 0,
}

observe(state)
autorun(() => {
  console.log(state.test)
  document.body.innerText = state.test
})

state.test++

document.body.addEventListener("click", () => state.test++)
```

这里只是简单的绑定了原生 DOM 渲染,真正的 VUE 上是绑定组件的`virtual Dom`渲染函数,之后将结合响应系统，Vue 能够智能地计算出最少需要重新渲染多少组件(`更新列队`,`diff比对`)，并把 DOM 操作次数减到最少。
