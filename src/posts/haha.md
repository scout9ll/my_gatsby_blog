---
path: "/blog/first-post"
date: "2019-05-04"
title: "test"
tags: ["测试"]
weather: ☁️
---

![dd](../images/gatsby-icon.png)

## 聊聊几种异步请求

### AJAX

几年前最流行的异步请求,最开始的异步的 JavaScript 与 XML 技术.

- 特点
  - 基于原生浏览器原生 XHR 接口开发
  - 依赖 JQuery
  - 自动序列化 json 对象
  - 支持请求／响应拦截器
  - 本身是针对 MVC 的编程,不符合现在前端 MVVM 的浪潮
- 简单实现

  ```js
  function ajax({ method, url, data, fn }) {
    xhr = new XMLHttpRequest()
    xhr.setRequestHeader(data.header)
    xhr.open(method, url)
    method.toLowerCase() == "get" ? xhr.send(null) : xhr.send(format(data.body)) //format 根据content-type执行,包括序列化,格式化
    xhr.onreadStateChange = () => {
      xhr.readyState == 4 &&
        xhr.status == 200 &&
        fn(JSON.parse(xhr.responseText))
    }
  }
  ```

### axios

由于 Vue 流行起来的请求库,在 ajax 基础上更完善的封装.

- 特点
  - 浏览器端同样采用 XHR 接口
  - 可运行在 node 环境中,其采用 http 接口 😍
  - 同样支持拦截器
  - 结合了 es6 的 promise,回调更加优雅.😍

### fetch

浏览器最新提供的原生请求接口,更加灵活,更多功能.

- 特点

  - 最新原生接口,结合了 promise
  - 提供更多配置属性,例如`body`,`header`,`credentials`,etc
  - 提供更多功能,例如`res.blob()`,`res.arraybuffer()`,`res.json()`_(都返回的是 promise 对象)_
  - 因为原生,很多配置需要手动配置.例如对 res 照单全收,包括错误的 status,需要直接处理;必须手动设置 credentials，Fetch 默认不带 cookie。

- 实例

  ```js
  fetch("steve911.com", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: {"name":"steve",
  })
    .then(function(res) {
      if (res.ok) {
        // To do with res
      } else if (res.status == 401) {
        // To do with res
      } else if (res.status == 404) {
        //
      } else if (res.status == 500) {
        //
      }
    })
    .catch(function(e) {
      // Handling errors
    })
  ```

### 总结

在 ajax 和 axios 中,两者都是基于 xhr,但是 axios 更加完善,并且不依赖 jQuery,可以说全方位领先,故当需要选择请求库时 axios 是不二之选;  
在 xhr 和 fetch 中,fetch 则更加灵活更加全面,但是需要浏览器支持 ES6,故当不需要考虑兼容性时则可优先考虑 fetch

#### 参考

> https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API  
> https://www.kancloud.cn/yunye/axios/234845  
> https://api.jquery.com/category/ajax/
