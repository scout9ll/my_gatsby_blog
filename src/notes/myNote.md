---
path: "/note"
date: "2019-05-20"
title: "note"
---

## week 1

### 行内元素

- 不会独占一行，一行可以存在多个行内元素
- 行高是行内元素的容器，决定其占位是否。
- 存在基线，每个元素都在其基线上，一行中每个元素基线的位置默认为行高最高的元素(即基准元素，也等于行框)的基线。vertical-align 用来设置垂直位置，middle 为行内所有中线对齐。
- 行内块元素也遵循基线对齐，行内块元素的基线为元素里面最后一行的基线。若里面没有元素则为其底线。

### float 问题

- float 会脱离所在父元素内的文档流(故不会离开父元素，也不会被父元素计算空间)
- float 漂浮后变为没有基线的行内块元素
- float 元素遇到同类 float 的元素或者定位元素时会停止漂浮（position）
- 父元素可以通过设置 overflow 为 hidden 强制计算 float 元素空间来防止塌陷，也可通过其最后子元素 clear 属性保留高度。

## week 2

### height-top

- offsetTop 为元素 top 距离祖先元素的距离，若计算绝对到顶端的距离可以使用 scollY+obj.getBoundingClientRect.Y(元素到窗口的高度)
- offsetHeight 为元素高度包括 padding 和 border，也可直接用 height,scrollHeight 若子元素大于父元素则为子元素的高度
- innerHeight 为 窗口的高度
- window 事件 :page 鼠标到页面顶的坐标,包括卷入的高度,client 不包括

### 关键渲染路径

- style>layout>paint>composite
- 应用中的元素样式>这些元素生成形状和位置——布局>每个元素填充像素>绘制这些图层
- 故应该尽量用 transform 这样的不改变布局的属性；

### =100%?/

- 最上级的 100%为是视窗大小的 100%
- 绝对定位的 100%包括 padding 大小，其他则只包括内容。（起始位置都从父元素的 content 左上角开始;若 top:0,则从 border 开始,不包括 border 大小)

### 从头开始 debounce

```js
function debounce(func, wait = 20, immediate = true) {
  var timeout
  return function() {
    var context = this,
      args = arguments
    var later = function() {
      timeout = null //非立刻执行时,通过回调timeout来判断是否渡过wait
      if (!immediate) func.apply(context, args)
    }
    var callNow = immediate && !timeout
    clearTimeout(timeout) //防抖重点,节流则不需要
    timeout = setTimeout(later, wait)
    if (callNow) func.apply(context, args)
  }
}
window.addEventListener("scroll", debounce(func))
```

- Q1：元素事件处理器所绑定的 handle 到底是什么？  
  A：handle = debounce(func),每次事件触发将执行的是 debounce 的 return ，即 function。

- Q2：如何每次都能取到 timeout?  
  A: 通过闭包，每次调用 function 时，遇到 timeout 标识符若本函数内词法环境中没有，将根据该函数的[[environment]](函数自身注册时的词法环境)中寻找(作用域链)，词法环境在函数创建时生成。 debounce 作为声明，在全局中处理代码之前就应经解析创建注册。
  ps:js 中所有的标识符寻找都通过作用域链，即取决于变量函数写在哪个作用域内。如下：

  ```javascript
  var a = function() {
    console.log(time)
  }

  function debounce1() {
    var time = 1
    a() //not defined
    return function() {
      time = time + 1
      console.log(time) //2
      a() //not defined
    }
  }
  debounce1()()
  ```

- Q3: timeout=seTtimeout() ，赋的是什么值？  
  A: 赋值的是计时器`ID`，存在于浏览器中的全局变量， 每执行一次`setTimeout`都会+1，代表该计时器的序号。`clearTimeout`将取消计时器，包括其中的回调函数，但不会回收其`ID`。

- Q4: 为什么要赋值 this？  
  A:因为 setTimeout 为全局函数，是浏览器所处理，无论在哪里执行 this 都是全局。

- Q5: immediate 是什么？  
  A:immediate 用来决定是否立即执行，即决定事件通过回调来执行还是通过判断 timeout 来立即执行。当 immediate 为 true 则是判断 timeout,故第一下就能立即执行，当为 false 时需成功完成等待事件才能回调。

### 两种数据类型

- 基本数据类型

  - 包括，string,null,undefine,boolean,number,
  - 存储内容，变量名与数据本身
  - 存储位置，栈内存

- 引用数据类型

  - 包括，function,array,object
  - 存储内容：变量名与属性的指针(地址)
  - 属性指针在栈内存，指针指向的内容在堆内存

- PS: 栈与堆

> 栈内存，有序存储，容量小但分配效率高，易于回收是一种向低地址扩展的数据结构，并且是连续的存储空间，所以栈顶和栈的最大容量是固定的  
> ![栈与堆](https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=3785498651,2265829815&fm=26&gp=0.jpg)  
> ![栈与堆](https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=6185001,4201650577&fm=26&gp=0.jpg)  
> 堆，是一种向高地址扩展的数据结构，并且是不连续的，因为系统采用的是链表的方式存放空闲存储块，当然是不连续的，链表的遍历方向是由低向高的，所以堆能够申请的空间的大小其实等同于整个系统的虚拟内存，只要还有内存空间，那么堆就能够不受限制的申请空间，这种方式比较灵活，申请空间也较大。

### js 的隐式转换

- 一元运算符 通过+、-字符串将转化为数字类型

```js
var sNum = "20"
alert(typeof sNum) //输出 "string"
var iNum = -sNum
alert(iNum) //输出 "-20"
alert(typeof iNum) //输出 "number"
```

- 加法计算
  若存在字符串将默认将其他元素转换为字符串进行拼接

```js
var result = 5 + 5 //两个数字
alert(result) //输出 "10"
var result2 = 5 + "5" //一个数字和一个字符串
alert(result) //输出 "55"
```

- 正则
  默认将内容转换为字符串

```js
let reg = new Reg("^[0-9a-z]+$", "gi") //
reg.test(undefined) //返回true
```

## week 3

### Iterables 和 array-like

两种对象类型

#### 分辨特征

- array-like 有 length 属性
- Iterables 有[Symbol.iterator]方法

#### Iterables

Iterables 意为可迭代的对象,当用`forEach`,`for of`时,会调用其[Symbol.iterator]方法,生成 iterator,然后依次调用`iterator.next()`完成迭代

> `for of`内部实现

```js
let str = "Hello"

// 和下面代码完成的功能一致
// for (let char of str) alert(char);

let iterator = str[Symbol.iterator]()

while (true) {
  let result = iterator.next()
  if (result.done) break
  alert(result.value) // 一个一个输出字符
}
```

> 让一个对象变成 iterable

```js
let normalObj = { a: 2, b: 3 }

normalObj[Symbol.iterator] = function() {
  let arr = Object.keys(this)
  let i = -1
  return {
    next: () => {
      i++
      return this[arr[i]]
        ? { done: false, value: this[arr[i]] }
        : { done: true }
    },
  }
}

for (const value of normalObj) {
  console.log(value)
} // 2 3
```

### array map set

- array

  - 基本数组类型，创建方式 2 种：`[]`和`new Array()`,故将继承数组类的属性与方法
  - 常用方法：  
    `.forEach(callback)`遍历回调;  
    `.every(ninja => "name" in ninja)`遍历所有判断是否都有"name"接受回调 Boolean 值，若全部为`ture`则返回`ture`;  
    `.some(ninja => "name" in ninja)`,遍历直至一个`ture`就返回;  
    `ninjas.find(ninja => ninja.weapon === "wakizashi"）`使用 find 方法查找满足回调函数中指定条件的第 1 个元素，否则为 undefined  
    `.indexOf(value)`和`.findIndex(ninja =>ninja =="yoshi")`都返回满足的元素的索引;  
    `.sort(num1,num2 => num1>num2?return 1;return -1)`,通过回调比较相邻两个数对其排序,若为 1 则交换位置.  
    `filter(ninja => callback)`,返回 callback 为真的数组

- map

  - 字典数组类型,创建方式:`new Map([a,...])`
  - 特点:纯粹的字典映射,不继承普通对象的方法,比如`constructor`,同样也去除了`key`必须是字符串的限制  
    　 map 是键值对的集合，key 可以是任意类型的值，甚至可以是对象
  - 常用方法:example:`const ninjaIslandMap = new Map();ninga1={name:"yoshi",}`.
    `ninjaIslandMap.map.set(ninja1, { homeIsland: "Honshu"})`,则设置了 ninja1 和`{ homeIsland: "Honshu"}`的映射,`ninjaIslandMap.map.get(ninja1).homeIsland =='honshu'`  
    `for of`对其中每个元素进行遍历,返回每个元素本身,包括 key 和 value.`for in`则只返回 key  
    `.has(key)`通过对 key 进行 hash 运算后散射得到其 index 值,故能直接通过 key 进行哈希散射后匹配`map[hash(key)]`,所以时间复杂度为 O(1),可利用其进行判断去重.

- set
  - 唯一数组类型,创建方式:`new Set([a,...])`
  - 特点:成员的值唯一,构建时和 map 一样通过 hash 运算散射索引.

## week 4

### 正则

- 创建方式`reg =/\d+/gi` 或者`reg = new Reg('\d+ ')`

在 JavaScript 中，有 5 个修饰符：

> i 使用此修饰符后，搜索时不区分大小写: A 和 a 没有区别。  
> g 使用此修饰符后，搜索时会查找所有的匹配项，而不只是第一个（在下一章会讲到）。  
> m 多行模式,每行进行匹配,^\$匹配每行,可用\n 替代,但是最后一行不能匹配,。  
> u 开启完整的 unicode 支持。该修饰符能够修正对于代理对的处理。  
> y 粘滞模式，通过 reg.lastIndex=6,可以从 str[6]开始匹配

- 常用使用方法：

  - `str.search(reg)`返回匹配的索引,没有则返回-1
  - `str.match(reg)`没有 g 修饰符时，结果是一个数组，里面有该第一个匹配项和额外的属性：index – 匹配项在字符串中所处在的位置，
    input – 原始字符串。；有 g 修饰符时，就会返回由所有匹配项组成的数组。在数组中没有`额外的属性`，而且`圆括号`也不会创建任何元素。
  - `str.replace(reg,function||str)`,返回替换后的 NEWstr,但不改变自生 str(与 python 不同)
  - `str.test(reg)`用于检测是否存在可以匹配的 str，返回 boolean 值

- 字符集合: -`\d`（“d” 来源于 “digit”）一个数字：0 到 9 的一个字符。;`\D` 一个非数字
  - `\s`（“s” 来源于 “space”）一个空格符：包括空格，制表符和换行符。;`\S` 一个非空格符
  - `\w`（“w” 来源于 “word”）一个单字字符：英语字母表中的一个字母
    或者一个数字或一个下划线。非英语字母（像西里尔字母或者印地语）不包含在 `\w`里面。
    ;\W 一个非数字字母和\_
  - `.`可以匹配换行符外的任意字
  - _如果我们想要检索一个像反斜杠或者一个点这样有特殊意义的字符，那么我们需要使用一个反斜杠 \. 进行转义。_
    特殊字符的列表：`[ \ ^ $ . | ? * + ( )。`,js 中的`' "`不包括.
- 范围:
  - [][0-9a-z]
- 量词:
  - 数量 {n}:确切的位数：{5};某个范围的位数：{3,5}
  - 缩写+代表“一个或多个”，相当于 {1,}。  
    ? 代表“零个或一个”，相当于 {0,1}。  
    \* ：代表着“零个或多个”，相当于 {0,}
- 捕获组:

  - 正则模式的一部分可以用括号括起来 (...)，由此构成一个『捕获组』。正则引擎可以记录捕获组
  - eg:  
    `不带g时`

  ```js
  let str = "<h1>Hello, world!</h1>"
  let reg = /<(.*?)>/

  alert(str.match(reg)) // Array: ["<h1>", "h1"]
  ```

  `带g时`

  ```js
  let str = "<h1>Hello, world!</h1>"

  // 两组匹配：起始标签 <h1>和闭合标签</h1>

  let reg = /<(.*?)>/g

  let match

  while ((match = reg.exec(str))) {
    // 第一次显示匹配：<h1>,h1
    // 之后显示匹配：</h1>,/h1
    alert(match)
  }
  //如此我们便得到了 <(.*?)> 的两个匹配项，他们中的每一个都包括完整的匹配和对应的捕获组。
  ```

  - 捕获可嵌套:从括号开始从左到右依次编号,
    返回数组的索引从为 0 的整个匹配项开始,无论捕获存不存在都会返回值(`value||undefined`),
    通常使用 result.shift() 去头后提取所有匹配项
  - 可用`?:`来排除组
  - `$n`可用作替换文本表示捕获组,`\n`用作模式表达式中,表示匹配与该组相同的内容(:?不记录)

- 选择（OR）|
  - `|`可以用来进行多个模式的匹配,通过 g 能够返回所有满足其一的内容,可用()来规定|范围
- 开始符 ^ 和结束符 \$
  - ^\$为所匹配字符串的开头和结尾,与 Y 标识符相似
  - 我们可以同时使用这两个符号，来检查字符串是不是*完全匹配正则表达式*。这经常用于信息校验.
  - ^\$可以匹配 ""
- 前瞻断言与后瞻断言

  - .match 只返回断言的内容

  | 模式   | 类型         | 匹配                 |
  | ------ | ------------ | -------------------- |
  | x(?=y) | 前瞻肯定断言 | x ，仅当后面跟着 y   |
  | x(?!y) | 前瞻否定断言 | x ，仅当后面不跟 y   |
  | (?=y)x | 后瞻肯定断言 | x ，仅当前面跟着 y   |
  | (?!y)x | 后瞻肯定断言 | x ，仅当前面不跟着 y |

### getElementBy..()和 querySelector()

- 主要区别:get 是获取 node 的指针(node 变,则随其改变),query 深克隆获取具体 node.

## week 5

### event.target 和 event.currentTarget

- 主要区别:event.target 是触发事件开始的元素,event.currentTarge 是*当前触发事件执行*的元素(被监听该事件的元素
  )

### ES6 destruction

- 解构的意义: 更快的将变量赋值为对象中的属性.
- 主要方法:

```js
 let obj={
   time:60,
   mode:"custom",
   text:"hello"
 }
 let {time} = obj  ||  let {time:localTime} =  obj
 console.log(time||localTime) //60
```

### class 中静态 static

- static 的意义:用来处理不需要访问实例属性的专属方法,例如 Array.spice ,Promise.race
- static 的原生写法: `Array.slice = (array,start,end)=>array[start,end]`

## week6

### 偏函数(partial function)&&纯函数(Pure Functions)

#### 偏函数

- 偏函数的意义:将多参数的函数固定几个参数后变为少参数函数,例如 send(from,to) =>> toSend(to)

- 两种途径:

  - `bind`

  ```js
  function partial(func, ...argsBound) {
    return function(...args) {
      // (*)
      return func.call(this, ...argsBound, ...args)
    }
  }
  ```

  - `currying`

  ```js
  function curry(func) {
    return function curried(...args) {
      if (args.length >= func.length) {
        return func.apply(this, args)
      } else {
        return function(...args2) {
          return curried.apply(this, args.concat(args2))
        }
      }
    }
  }
  ```

#### 纯函数

- 纯函数定义
  函数类的变量都在函数作用域内,不依赖外部变量,保证函数在任何环境同一输出

- 纯函数意义
  - 容易可测试(testable)
  - 因为相同的输入必定是相同的输出，因此结果可以缓(cacheable)
  - 自我记录(Self documenting),因为需要的变量都是参数，参数命名良好的
  - 情况下即便很久以后再去看这个函数依旧可以很容易知道这个函数需要哪些参数
  - 因为不用担心有副作用(side-effects),因此可以更好地工作

### react 子向父跨组件通信的几种方法

- 通过在父子间中创建函数(绑定对象后)传递给子组件,则子组件变化运行函数后则父子间变化.
- 通过 context (redux)等全局变量
- 利用 pub/sub 模式,例如创建使用 Node.js EventEmitter 进行发射,接受,子组件发射(emit),父子间接受(onEmit)

### react CSS 的几种写法

- 直接写在 CSS 上 `Import css`文件
- 写在 JS 文件中,`const headingStyle={fontSize:"60px"}`
- 使用 css.module(higher "react-scripts" 2.0),`import style from ".module.css" style={style.class}` 与普通 CSS 全局变量不同,存在本地文件作用域

## week7

### 事件循环和消息列队

- 采纳 JSC 引擎的术语，我们把宿主（浏览器、Node 环境）发起的任务称为宏任务（如 SetTimeout,requestAnimationFrame(requestAnimationFrame 的步伐跟着系统的刷新步伐走。它能保证回调函数在屏幕每一次的刷新间隔中只被执行一次，这样就不会引起丢帧现象，也不会导致动画出现卡顿的问题。  
  把 JavaScript 引擎发起的任务称为微观任务（如 Promise）。

```js
console.log("1")
setTimeout(() => console.log("2"), 1)
Promise.resolve().then(() => console.log("3"))
console.log("4")
// 1 4 解析执行主线程JS 属于第一个事件循环(宏任务),同步任务执行完
// 3  进入微任务队列,在下个宏任务(2)执行前执行
// 2 执行最后一个宏任务
```

### this

- 存储在对象中函数称之为『方法』。
- 对象执行方法进行『操作』，比如 `object.doSomething()`。
- 方法可以将该对象引用为 `this`。

`this` 的值是在运行时求值的。

- 函数声明使用的 `this` 只有等到调用时才会有值。
- 函数可以在对象之间进行共用。
- 当函数使用『方法』语法 `object.method()` 调用时，调用过程中的 `this` 总是指向 `object`。
  - 这个 '.' 点返回的*不是一个函数*，而是一种特殊的引用类型的值。

> 引用类型是一种『规范中有的类型』。我们不能明确地指定它，但是可以在语言内部使用。
> 引用类型的值是三点的结合 (base, name, strict)，如下：  
> base 是对象。  
> name 是属性。  
> 当 use strict 生效，strict 为真。

请注意箭头函数有些特别：它们没有 `this`。在箭头函数内部访问的都是来自外部的 `this` 值。

## week 8

### null 和 undefined

- 用 typeof 和 instanceof 测试一下区别

```js
typeof null //"object"
typeof undefined //"undefined"
null instanceof Object //false
null instanceof null //true
null == undefined // true
null === undefined //false
```

> typeof(null)中表示是对象,但在 instance 中却又是 null,而在 ES6 标准中明确表示 null 是一个基本类型,那么 null 到底是什么呢

- null 属于历史遗留问题
  现在比较普遍的认知是，typeof null 返回“object”是一个历史错误（JS 的发明者 Brendan Eich 自己也是这样说的），只是因为要保持语言的兼容性而维持至今。从 ES5 制定开始就有动议将 typeof null 改为返回“null”（如启动 node 加上“--harmony_typeof”参数，即是如此），但是当前 ES6 标准草案仍然维持了原样。

- null 和 undefined 的使用
  - null 是一个存在的`空`,当需要指定变量为`空`时,可以使用 null 表明此变量是有一个指向的,但指向一个`空`;
  - 而 undefined 是指一个还没有确定指向目标的变量,将来可以任何值,但现在没有指向

### outline

#### 是什么

元素 border 外的充填内容

### package.json 和 package-lock.json

#### 区别

- package.json 是 install XX 的直接依赖,并随着 install 的改变,版本前有`^`号表示可以用之后的最新版本
- package-lock.json 是 package.json 生成时候自动生成,包含 install 时的具体版本号,及其所有间接依赖,当之后 install 时,直接依赖会更新,但间接依赖不更新

#### 用法

- 若 package.json 发生更新后,`npm install`将根据`package.json` install(注意，`npm ci` 在安装前会自动清除现存的 `node_modules`，所以 npm ci 天然规避了增量安装可能带来的不一致性等问题)
- 若希望使用最初的锁定版本,则使用 `npm ci`下载`package-lock.json`中的依赖

## week 9

### 微服务和 serverless 和 docker

#### 微服务

服务端设计思想,后端应用组件化,API 分离,去中心化,每个 API 独立部署

> ![micrpService](https://ss0.baidu.com/6ONWsjip0QIZ8tyhnq/it/u=2766950049,2173529202&fm=173&app=25&f=JPEG?w=640&h=375&s=4586FD1203067CEA104990C00200D0B3)

#### serverless

服务端部署架构,将后端部署在云服务提供商提供的自动化的弹性服务器上,让开发者专注于逻辑层

#### docker

一个开源的应用容器引擎，可以将应用打包在一个一个可移植的镜像中，然后发布到 Linux 或 window 上，容器之间相互隔离，采用 c/s 构架进行操作管理

#### 联系

可用微服务思想,将服务组件(不同的 API)部署再不同的云上（或将不同组件放置在不同的 docker 中）,从而能够快速更迭,

### vue 和 react "异步"更新的差异

> 这里假设都已满足异步的条件

#### 对象上

vue 在执行 update 时开始异步,则不能同步取到 dom  
react 在更改 state 时开始异步,则不能同步取到 state

#### 方法上

vue 合并 watcher,react 合并 state

#### 相同点

都采用列队(批量更新)策略

### 什么是 base64

#### 定义

一个编码规则,用来将传输中不可见的二进制的文件转化为 64 个可见字符.

#### 用途

- 将二进制图片转换为 base64 文件传输

#### 方法

在浏览器中用`window.btoa`encode,`window.atob`decode

### axios 中的坑

#### authorization

axios.`get/post...`中设置 authorization 没用,需要用`axios({ method:"", url:"", data:"", headers:"" , })`

### dom 有很多节点

#### 常用节点

- elementNode
- textNode
- attributeNode

#### 其他节点

- CDATA 节点 Node.CDATA_SECTION_NODE(4)
- 实体引用名称节点 　 Node.ENTRY_REFERENCE_NODE(5)
- 实体名称节点 　　 Node.ENTITY_NODE(6)
- 处理指令节点 　　 Node.PROCESSING_INSTRUCTION_NODE(7)
- 注释节点 　 Node.COMMENT_NODE(8)
- 文档节点 　 Node.DOCUMENT_NODE(9)
- 文档类型节点 　　 Node.DOCUMENT_TYPE_NODE(10)
- 文档片段节点 　　 Node.DOCUMENT_FRAGMENT_NODE(11)
- DTD 声明节点 Node.NOTATION_NODE(12)

### babel

#### 机制

- parse to AST
- transform
- generater

## week10

### preload 和 prefetch

#### preload

- 定义
  优先预加载，优先级高，可以在 render DOM tree 时候异步加载，但不会执行导致 render 阻塞

- 用法  
  `<link rel="preload" href="..." as="..." onload="preloadFinished()">`
  可定义回调函数

#### prefetch

- 预获取，将在页面加载完成后提前加载，作为下一页的部分

### lazy-load

### SEO 策略

#### title

#### keywords

#### description

### 汇编语言 (assembly language)

#### 简单定义

机器码的标识符，可利用汇编编译器直接编译为机器码

#### 特点

- 高效，编译更直接，代码直接操作硬件
- 逻辑简单，不易编写复杂应用
- 不易维护

### intersectionObserver

#### 定义

提供了一种异步观察目标元素与其祖先元素或顶级文档视窗(viewport)交叉状态的方法。可代替监听 scroll 事件中不停获取 getBoundingClientRect()，从而优化性能

#### 使用方法

```js
var options = {
  root: document.querySelector("#scrollArea"), //设置需监听的相对元素，默认为视窗
  rootMargin: "0px", //距离补偿
  threshold: 1.0, //监听元素出现在ROOT中的比例，1.0则是全出
}
//callback 当出现时候的回调函数
var observer = new IntersectionObserver(callback, options)
var target = document.querySelector("#listItem")
observer.observe(target) //开始监听#listItem元素
```

- `.observe(element)`

```js
var target = document.querySelector("#listItem")
observer.observe(target) //开始监听#listItem元素
```

- `.unobserve(element)`
  停止监听 element
- `.disconnect()`
  停止对象监听工作

### Immutable.js

### vue 收集哪些依赖

相应数据只收集渲染函数和监听属性,

#### render function

```js
components.forEach(component => autoRun(component.render))
```

#### watch

```js
Object.defineProperty(this, watchedData, {
  set() {
    watchedData()
  },
})
```

#### computed

```js
let computedData //用来缓存合成属性,render时直接读取
computedDatas.forEach(computedData => autoRun(computedData()))
```

### component 和 pureComponent

#### 主要区别

- component 每次 setState 都会重新 update(render)

- pureComponent 每次 setState 后会`shouldeComponentUpdate`

```js
if (this._compositeType === CompositeTypes.PureClass) {
  shouldUpdate =
    !shallowEqual(prevProps, nextProps) || !shallowEqual(inst.state, nextState)
}
```

> 因此,使用 pureComponent 可以一定程度上减少不必要的渲染

#### pureComponent 浅比较原理

```js
// 用原型链的方法
const hasOwn = Object.prototype.hasOwnProperty

// 这个函数实际上是Object.is()的polyfill
//+0 === -0 // true，但我们期待它返回false
//NaN === NaN // false，我们期待它返回true
function is(x, y) {
  // SameValue algorithm
  if (x === y) {
    // 处理为+0 != -0的情况
    return x !== 0 || 1 / x === 1 / y
  } else {
    // 处理 NaN === NaN的情况
    return x !== x && y !== y
  }
}

export default function shallowEqual(objA, objB) {
  // 首先对基本数据类型的比较
  if (is(objA, objB)) return true
  // 由于Obejct.is()可以对基本数据类型做一个精确的比较， 所以如果不等
  // 只有一种情况是误判的，那就是object,所以在判断两个对象都不是object
  // 之后，就可以返回false了
  if (
    typeof objA !== "object" ||
    objA === null ||
    typeof objB !== "object" ||
    objB === null
  ) {
    return false
  }

  // 过滤掉基本数据类型之后，就是对对象的比较了
  // 首先拿出key值，对key的长度进行对比

  const keysA = Object.keys(objA)
  const keysB = Object.keys(objB)

  // 长度不等直接返回false
  if (keysA.length !== keysB.length) return false
  // key相等的情况下，在去循环比较
  for (let i = 0; i < keysA.length; i++) {
    // key值相等的时候
    // 借用原型链上真正的 hasOwnProperty 方法，判断ObjB里面是否有A的key的key值
    // 属性的顺序不影响结果也就是{name:'daisy', age:'24'} 跟{age:'24'，name:'daisy' }是一样的
    // 最后，对对象的value进行一个基本数据类型的比较，返回结果
    if (!hasOwn.call(objB, keysA[i]) || !is(objA[keysA[i]], objB[keysA[i]])) {
      return false
    }
  }

  return true
}
```

> 由上面的分析可以看到，当对比的类型为 Object 的时候并且 key 的长度相等的时候，浅比较也仅仅是用 Object.is()对 Object 的 value 做了一个基本数据类型的比较，所以如果 key 里面是对象的话，有可能出现比较不符合预期的情况，所以浅比较是不适用于嵌套类型的比较的。  
> 例如,`shallowEqual({a:{b:2}},{a:{b:2}}) == false`

#### 浅比较的补充-Immutable.js

> 由于深浅比较不能判断相同的引用类型数据的变化,例如  
> `const { data } = this.state;data.push(news) setState({data})`
> 则不能发现改变,可以利用`Immutable.js`这个库解决此问题

- 什么是 Immutable.js  
  Facebook 在 2014 年出的持久性数据结构的库，持久性指的是数据一旦创建，就不能再被更改，任何修改或添加删除操作都会返回一个新的 Immutable 对象。可以让我们更容易的去处理缓存、回退、数据变化检测等问题，简化开发。并且提供了大量的类似原生 JS 的方法，还有`Lazy Operation`的特性，完全的函数式编程。

### webpack

#### webpack 简单理解

将所有依赖一起打包的工具

#### 打包过程

### 扩展运算符(...)

#### 定义

用来取出变量中的所有可遍历属性,属于对属性的一次浅拷贝

> `...[a,b,c]===> a b c`

#### 常用方法

- 函数参数的解构

```js
function foo(a, ...b) {
  //此时相当于 let [a,...b]=agruments
  // ...b ==> argruments[1] argruments[2]  argruments[3] ~~~
  console.log(b)
}
foo(1, 2, 3, 4) // [2,3,4]
```

> ps `...`只能用在最后一位

- 将 Iteratable(可迭代对象) 的类型转为数组

```js
const nodeList = document.querySelectorAll("div")

const array = [...nodeList]
```