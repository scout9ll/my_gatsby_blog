---
path: "/blog/vuePlugin"
title: "实现一个Vue插件"
date: "2019-08-30"
tags: ["VUE", "源码", "插件"]
weather: ⛅
---

## 实现一个 plugin

### plugin 的用法

先看下源码

> vue.common.dev.js 5079

```js
Vue.use = function(plugin) {
  // 判断是否已存在该plugin
  var installedPlugins = this._installedPlugins || (this._installedPlugins = [])
  if (installedPlugins.indexOf(plugin) > -1) {
    return this
  }

  // 绑定plugin的参数
  var args = toArray(arguments, 1)
  args.unshift(this) //添加Vue作为第一个参数
  if (typeof plugin.install === "function") {
    plugin.install.apply(plugin, args)
  } else if (typeof plugin === "function") {
    plugin.apply(null, args)
  }
  installedPlugins.push(plugin)
  return this
}
```

从源码可以出,plugin 用 Vue 的一个静态方法`use`调用,调用时会执行 install,install 的参数在 use 中传递  
所以应该是这样使用

```js
const testPlugin = {
  install(vue, someArgs) {
    //do something
  },
}
Vue.use(testPlugin, someArgs)
```

### plugin 的功能

看下官网使用介绍

```js
MyPlugin.install = function (Vue, options) {
  // 1. 添加全局方法或属性
  Vue.myGlobalMethod = function () {
    // 逻辑...
  }

  // 2. 添加全局资源
  Vue.directive('my-directive', {
    bind (el, binding, vnode, oldVnode) {
      // 逻辑...
    }
    ...
  })

  // 3. 注入组件选项
  Vue.mixin({
    created: function () {
      // 逻辑...
    }
    ...
  })

  // 4. 添加实例方法
  Vue.prototype.$myMethod = function (methodOptions) {
    // 逻辑...
  }
}
```

> 总结下来一般是这四个功能

#### 添加全局方法或者属性

直接给`Vue`添加静态方法,这种方法不应依赖 Vue 的构造属性(vue 实例的属性) 一般用来对整个实例本身进行操作  
如: vue-custom-element,用来将 Vue 实例绑定到 HTML 自定义组件上

```js
import DemoElement from "DemoElement.vue"

Vue.customElement("demo-basic", DemoElement)
```

#### 添加全局资源：指令/过滤器/过渡等。如 vue-touch

给 Vue 添加指令(`v-someDirecter`)等一些 Vue 自带的特性

#### 通过全局混入来添加一些组件选项。如 vue-router

通过 Plugin 添加`mixin`

`指令和混入这些东西不是可以直接添加吗,为什么要用plugin呢?`

> 因为 plugin 会缓存所用插件,可以防止二次添加

#### 添加 Vue 实例方法，通过把它们添加到 Vue.prototype 上实现

为 Vue 实例,即 Vue 组件的原型链上添加方法,这种方法可以使用实例的属性  
例如 vue-router

```js
Vue.prototype.$store = {
    state:{},
    commit:{},
    ...others
}
new Vue({
    methods(){
        showState(){
            console.log(this.$store.state)
        }
    }
})

```

### 开始简单做一个 toast 插件

toast 是每个网站都会有的需求,而且属于全局需要的东西,所以特别适合写入插件中

#### step1-确定实现方式

toast 这样的通知弹窗应该在每个实例中调用,所以应该写在原型链上

```js
toast.install = Vue => {
  Vue.prototype.$toast = showToast(options)
}
```

#### step2-创建需要的 toast 组件

```js
<template>
  <div class="toast" v-show='isShow'>
        {{text}}
  </div>
</template>

<script>
export default {
  name: 'toast',
  data() {
    return {
        text:"",
        duration:1,
        isShow:true,
    }
  },
  mounted() {
      setTimeout(() => {
          this.isShow=false
      }, this.duration);
  },

 }
</script>

<style lang='scss' scoped>
.toast{
    position:fix;
    left:50%;
    top:50%;
    background:red;
    border:20px;
}
</style>
```

#### step3-将组件注入插件中使用

```js
import toastComponent from "./toast.vue"
// extend 得到`toastComponent`的子类构造函数,通过其默认会构造该实例,若有参数则会覆盖
// VueComponent==>VueCustomerComponent
const Toast = Vue.extend(toastComponent)
const toast = {}
toast.install = Vue => {
  Vue.prototype.$toast = function(options) {
    const myToast = new Toast({
      //el,将实例挂载的对象,将会替代该元素,如果在实例化时存在这个选项，实例将立即进入编译过程，否则，需要显式调用 vm.$mount() 手动开启编译。
      el: document.createElement("div"),
      data() {
        return {
          text: options.text,
          duration: options.duration,
          isShow: true,
        }
      },
    })
    //生成的dom为myToast.$el
    document.body.appendChild(myToast.$el)
  }
}
export default toast
```

#### step4-在页面中使用该插件

```js
import toast from "./toast"

Vue.use(toast)

let example = new Vue({
  el: "body",
  mounted() {
    this.$toast({ text: "我回来啦", duration: 1000 })
  },
  beforeDestroy() {
    this.$toast({ text: "我走啦", duration: 1000 })
  },
})
```
