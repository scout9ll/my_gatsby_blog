---
path: "/note"
date: "2019-05-20"
title: "note"
lastTime: "2021-11-20"
words: "116694"
---

## week 1

### js 与 python

#### 类型区别

- js: number,Boolean,null,undefined,NaN,Object,Symbol
- python:
  - 不可变:Number（int、float、bool、complex（复数））String（字符串）Tuple（元组,有序）
  - 可变: List（列表,有序）Set（集合,无序）Dictionary（字典,无序）

#### 可变参数

类似于 JS 函数中自动识别传入参数的个数，Python 也提供了定义可变参数，即在可变参数的名字前面带上个 \* 号。

```python
def fn(*args):

    print args

fn()  # ()

fn('a') # ('a',)

fn('a', 'b') # ('a', 'b')
```

#### 匿名函数

- python 中只能有一行表达式,直接 return

```python
sum = lambda arg1, arg2: arg1 + arg2
# 调用sum函数
print ("相加后的值为 : ", sum( 10, 20 ))
# 相加后的值为 :  30
```

#### 装饰器

decorator 装饰器

ES6 的语法中的 decorator 正是借鉴了 Python 的 decorator。decorator 本质上就是 一个高阶函数，它接收一个函数作为参数，然后返回一个新函数

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

### 页面中的三种布局

文档中所有的元素都会按照一定的规则排列，排列规则是由该元素所在的格式化上下文（formatting context）决定的。

> `position`为`absolute`或`fixed`的元素会脱离任何布局。

#### 流式布局(文档流)

BFC 和 ILFC 采用流式布局

在对布局进行任何更改之前，在页面上显示"块"和"内联"元素的方式。

在文档流中，内联元素按内联方向显示，即词语在依据文件写作模式的句子中表示的方向。块元素则一个接一个地显示，就像该文档的写作模式中的段落一样。 因此在英语中，内联元素从左边开始一个接一个地显示，块元素从顶部开始向下显示并移动页面

> `html`属于快格式化上下文（block formatting context）,所以页面的元素默认都是流式布局的。

#### 灵活布局

FFC 采用灵活布局（`display`为`flex`会创建 FFC）

> FFC 下的 flex-items 默认为 BFC

#### 栅格布局

GFC 采用灵活布局（`display`为`GRID`会创建 GFC）

## week 2

### clientX、clientY

点击位置距离当前 body 可视区域的 x，y 坐标

### pageX、pageY

对于整个页面来说，包括了被卷去的 body 部分的长度

### screenX、screenY

点击位置距离当前电脑屏幕的 x，y 坐标

### offsetX、offsetY

相对于带有定位的父盒子的 x，y 坐标

### x、y

和 screenX、screenY 一样

### height-top

- offsetTop 为元素 top 距离祖先元素的距离，若计算绝对到顶端的距离可以使用 scollY+obj.getBoundingClientRect.Y(元素到窗口的高度)
- offsetHeight 为元素高度包括 padding 和 border，也可直接用 height,scrollHeight 若子元素大于父元素则为子元素的高度
- innerHeight 为 窗口的高度
- window 事件 :page 鼠标到页面顶的坐标,包括卷入的高度,client 不包括 border

### 关键渲染路径

#### 基本渲染前流程

html=>dom------|  
css=>cssom-----| =>download+resolve=>renderTree=>begin render=>style  
js------------ |

> - cssom,css 对象模型
> - js 的 load 会阻塞页面第一次渲染,这是浏览器策略(chrome),在第一次会加载完 js 再渲染防止重复渲染.因此若页面存在 js 时,由于需要顺序等待加载 js 的缘故,在阻塞渲染的 js 中的对样式的 transition 在进入页面时将看不见
> - renderTree 是渲染树,不包括 DOM 中的 display 为 none 的对象

#### dom 的构建会被阻塞

当解析 html 时，若遇到 css 和 js 的内容或者链接，浏览器会停止 dom 的构建,它必须先停止解析 HTML 并执行该脚本，然后才能继续解析。对于外部脚本，系统还会强制解析器等待相应资源下载完毕（这可能会产生一次或多次网络往返过程并导致网页的首次呈现时间延迟)

> 因此加快首屏的渲染，就是让首屏资源下载解析的时间越短，一般从两个维度出发:
> 更快和减少
>
> - 加快资源下载解析速度：
>   - 使用内联 css,js
>   - 服务端渲染
>   - cdn
>   - 缓存:http 缓存、数据预请求，数据缓存
>   - 资源压缩
> - 减少资源：
>   - 通过`async`、`defer`、`preload`、`prefetch`等异步加载资源非首屏的所需的资源
>   - 通过 js 控制延迟加载非首屏的所需的资源

#### 渲染(render)路径

style>layout>paint>composite
应用中的元素样式>这些元素生成形状和位置——布局>每个元素填充像素>绘制这些图层

#### 重绘(repainting)和重排(reflow)

- Reflow（回流/重排）：当它发现了某个部分发生了变化影响了布局，渲染树需要重新计算。
- Repaint（重绘）：改变了某个元素的背景颜色，文字颜色等，不影响元素周围或内部布局的属性，将只会引起浏览器的 repaint，根据元素的新属性重新绘制，使元素呈现新的外观。重绘不会带来重新布局，并不一定伴随重排；
  Reflow 要比 Repaint 更花费时间，也就更影响性能。所以在写代码的时候，要尽量避免过多的 Reflow。

> 故应该尽量用 transform 这样的不改变布局的属性,既不会 repaint 也不会 reflow；且由于每个图层独立渲染，我们可以尽可能的多图层，避免一个地方样式改动牵动全局渲染
> 何时重排，如何减少重排，看看[https://developers.google.com/spe...](https://developers.google.com/speed/docs/insights/browser-reflow)

#### 渲染在什么时候执行

当宏任务执行之前,或者说一个 eventloop 的最后(marco 和 mircao 之后)

> 浏览器的 html，css，js 加载都属于宏任务
> 例如:

```js
function heavy() {
  document.body.style.background = "red"
  //do some such heavy things,it cost 2s to deal
}
heavy() // the body can't render until 2s later
```

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
  A: 通过闭包，每次调用 function 时，遇到 timeout 标识符若本函数内词法环境中没有，将根据该函数的[[environment]]\(函数自身注册时的词法环境\)中寻找(作用域链)，词法环境在函数创建时生成。 debounce 作为声明，在全局中处理代码之前就应经解析创建注册。
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

  - 包括，string(utf-16),null,undefine,boolean,number(8 字节),
  - 存储内容，变量名与数据本身
  - 存储位置，栈内存

- 引用数据类型

  - 包括，function,array,object
  - 存储内容：变量名与属性的指针(地址)
  - 属性指针在栈内存，指针指向的内容在堆内存

- PS: 栈与堆

> 栈内存，有序存储，容量小但分配效率高，易于回收是一种向低地址扩展的数据结构，并且是连续的存储空间，所以栈顶和栈的最大容量是*固定*的  
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

Iterables 意为可迭代的对象,当用`for of`时,会调用其[Symbol.iterator]方法(也可直接称作生成器`generator`),生成 iterator,然后依次调用`iterator.next()`完成迭代

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
    `filter(ninja => callback)`,返回 callback 为真的数组,  
    `reduce(function(total, currentValue, currentIndex, arr), initialValue)`,累加器,回调的返回值最为 total 依次累加.(_数组中正在处理的当前元素的索引。 如果提供了initialValue，则起始索引号为0，否则从索引1起始。_)

- map

  - 字典数组类型,创建方式:`new Map([a,...])`
  - 特点:纯粹的字典映射,不继承普通对象的方法,比如`constructor`,同样也去除了`key`必须是字符串的限制  
    　 map 是键值对的集合，key 可以是任意类型的值，甚至可以是对象
  - 常用方法:example:`const ninjaIslandMap = new Map();ninga1={name:"yoshi",}`.
    `ninjaIslandMap.set(ninja1, { homeIsland: "Honshu"})`,则设置了 ninja1 和`{ homeIsland: "Honshu"}`的映射,`ninjaIslandMap.get(ninja1).homeIsland =='honshu'`  
    `for of`对其中每个元素进行遍历,返回每个元素本身,包括 key 和 value.`for in`则只返回 key  
    `.has(key)`通过对 key 进行 hash 运算后散射得到其 index 值,故能直接通过 key 进行哈希散射后匹配`map[hash(key)]`,所以时间复杂度为 O(1),可利用其进行判断去重.

- set
  - 唯一数组类型,创建方式:`new Set([a,...])`
  - 特点:成员的值唯一,内部为二叉树.

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

  - `str.search(reg)`返回匹配的索引,没有则返回-1.(`^`只会返回 0 或 -1)
  - `str.match(reg)`没有 g 修饰符时，结果是一个数组，里面有该第一个匹配项和捕获的内容及额外的属性：index – 匹配项在字符串中所处在的位置，
    input – 原始字符串。；有 g 修饰符时，就会返回由所有匹配项组成的数组。在数组中没有`额外的属性`，而且`圆括号`也不会创建任何元素。
  - `str.replace(reg,function||str)`,返回替换后的 NEWstr,但不改变自生 str(与 python 不同)
  - `reg.test(str)`用于检测是否存在可以匹配的 str，返回 boolean 值,一般用`^`和`$`来检测整个字符串

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
  - `+`代表“一个或多个”，相当于 {1,}。
  - `?` 代表“零个或一个”，相当于 {0,1}。
  - `*` ：代表着“零个或多个”，相当于 {0,}
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

#### 总结

有 6 种主要的方法，可以在 DOM 中进行搜素：

<table>
<thead>
<tr>
<td>Method</td>
<td>Searches by...</td>
<td>Can call on an element?</td>
<td>Live?</td>
</tr>
</thead>
<tbody>
<tr>
<td><code>getElementById</code></td>
<td><code>id</code></td>
<td>-</td>
<td>-</td>
</tr>
<tr>
<td><code>getElementsByName</code></td>
<td><code>name</code></td>
<td>-</td>
<td>✔</td>
</tr>
<tr>
<td><code>getElementsByTagName</code></td>
<td>tag or <code>'*'</code></td>
<td>✔</td>
<td>✔</td>
</tr>
<tr>
<td><code>getElementsByClassName</code></td>
<td>class</td>
<td>✔</td>
<td>✔</td>
</tr>
<tr>
<td><code>querySelector</code></td>
<td>CSS-selector</td>
<td>✔</td>
<td>-</td>
</tr>
<tr>
<td><code>querySelectorAll</code></td>
<td>CSS-selector</td>
<td>✔</td>
<td>-</td>
</tr>
</tbody>
</table>

请注意，只有在文档 `document.getElementById(...)` 的上下文中才能调用 `getElementById` 和 `getElementsByName`。但元素中 `elem.getElementById(...)` 会报错。

也可以在元素上调用其他方法，例如 `elem.querySelectorAll(...)` 将会在 `elem`（在 DOM 子树中）内部进行搜素。

除此以外：

- `elem.matches(css)` 用于检查 `elem` 与给定的 CSS 选择器是否匹配。
- `elem.closest(css)` 用于查找与给定 CSS 选择器相匹配的最近的祖先。`elem` 本身也会被检查。

最后我们在提一种检查父子关系的方法：

- 如果 `elemB` 在 `elemA`（`elemA` 的后代）中或者当 `elemA==elemB` 时 `elemA.contains(elemB)` 将返回 true。

### readystate 和 status

两个不过程的状态码

#### readystate 为 XML httpRequest 请求过程的不同阶段

- 1=>请求尚未初始化, 已经创建 XMLHttpRequest 对象
- 2=>服务器链接已经建立, 已经调用了 XMLHttpRequest 对象的 open 方法，并且 XMLHttpRequest 对象已经准备好将一个请求发送到服务器端
- 3=>请求已经发送, 已经通过 send 方法把一个请求发送到服务器端，但是还没有收到一个响应
- 4=>请求处理中, 已经接收到 HTTP 响应头部信息，但是消息体部分还没有
- 5=>完全接收到请求完成, 且响应已经就绪

#### status 为请求在服务端响应的结果

- 1XX 服务器收到请求，需要继续处理。例如 101 状态码，表示服务器将通知客户端使用更高版本的 HTTP 协议。
- 2XX 请求成功。例如 200 状态码，表示请求所希望的响应头或数据体将随此响应返回。
- 3XX 重定向。例如 302 状态码，表示临时重定向，请求将包含一个新的 URL 地址，客户端将对新的地址进行 GET 请求。
- 4XX 客户端错误。例如 404 状态码，表示客户端请求的资源不存在。
- 5XX 服务器错误。例如 500 状态码，表示服务器遇到了一个未曾预料的情况，导致了它无法完成响应，一般来说，这个问题会在程序代码出错时出现。

## week 5

### event.target 和 event.currentTarget

- 主要区别:event.target 是触发事件开始的元素,event.currentTarget 是*当前触发事件执行*的元素(被监听该事件的元素
  )

### 事件捕获的应用场景

<!-- todo -->

事件捕获是在事件冒泡之前。

### attribute 和 property

#### attribute 是 HTML 节点底层天生的特性

#### property 是节点映射为 DOM 后为其创建的属性

attribute 会映射在 DOM 的 property 中，其以`NamedNodeMap`的形式存储 key 为`attributes`的 property 里  
一个元素节点会由多个属性节点(`attributeNode`)组成，它们都属于`Attr`类

一些 attribute 同时也会直接映射在 property 根部，例如`value`

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

## week 6

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

> side-effects,是指函数做了和本身运算返回值无关的事，比如：修改了全局变量、修改了传入的参数、甚至是 console.log()，所以 ajax 操作，修改 window，dom 都是算作副作用

### react 和 vue 子向父跨组件通信的几种方法

#### react

- 通过在父子间中创建函数(绑定对象后)传递给子组件,则子组件变化运行函数后则父子间变化.
- 通过 context (redux)等全局变量
- 利用 pub/sub 模式,例如创建使用 Node.js EventEmitter 的模式 进行发射、接受。子组件发射(emit),父子间接受(onEmit)

#### vue

- this.\$emit
- Vue.bus
- this.\$parent
- context(vuex)

### react CSS 的几种写法

- 直接写在 CSS 上 `Import css`文件
- 写在 JS 文件中,`const headingStyle={fontSize:"60px"}`
- 使用 css.module(higher "react-scripts" 2.0),`import style from ".module.css" style={style.class}` 与普通 CSS 全局变量不同,存在本地文件作用域

## week 7

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
// 渲染线程进行渲染，渲染结束进行下一轮循环
// 2 执行第二轮的第一个宏任务
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

请注意箭头函数有些特别：它们没有 `this`。  
箭头函数的`this`在创建时确定,由于创建时的环境属于其函数本身外部,也可说=>在箭头函数内部访问`this`的都是来自外部的 `this` 值,_?_

### Vue 中的核心类: Watcher

如果你是一个 Vue API 调用员，你一定会好奇为什么 Vue 的每一个组件实例上都会存在多种 watcher 属性，并且它里面还会有一个其属性中装满`watcher`的`dep`  
那么 watcher 的作用是什么呢？

> 这里为了更直观的表述，我将所有`依赖`函数都称作`mutation`函数，表示是用户主动编写期待带来`视图变化`的函数

#### watcher 是装载 mutation 函数的容器

Watcher 将接受`mutation`作为参数，将`mutation`函数保存在实例中

#### watcher 将管理 mutation 函数的使用

`watcher`为了保证`mutation`能够即时有效的利用，设置了很多参数

```ts
interface WatcherProperty{
  vm: Component;
  expression: string;
  cb: Function;
  id: number;
  deep: boolean;
  user: boolean;
  lazy: boolean;
  sync: boolean;
  dirty: boolean;
  active: boolean;
  deps: Array<Dep>;
  newDeps: Array<Dep>;
  depIds: SimpleSet;
  newDepIds: SimpleSet;
  before: ?Function;
  getter: Function;
  value: any;
}
```

根据`mutation`函数的不同来源，它们会被分别封装到使用上有些区别 watcher

- Render 函数，其`mutation`就是组件的渲染函数

- computed 属性, 其会创建 lazy update 的 watcher ，挂载在 vm 上的`_computedWatchers`属性里

```ts
  update () {
    /* istanbul ignore else */
    if (this.lazy) { // computedWatchers专属
      this.dirty = true //   computed属性的get访问属性会判断dirty来是否调用
    } else if (this.sync) {
      this.run() //立即触发mutation
    } else {
      queueWatcher(this) //队列批处理mutation
    }
  }
```

- watch 属性

> 三种 watcher 直接调用的顺序为 `watch` => `render` => `computed` 。但是`watch`和`render`会被`queueWatcher`,其会`nextTick`调用 `run`。所以最终的`mutation`函数调用顺序为`computed`=>`watch` => `render`

每个拿到`mutation`的`watcher`都会给自己添加一个标记，

#### watcher 被收集在每个响应式属性的 Dep 中

> 这里只专注于 watcher,不涉及 Dep 在 Data 中收集的细节

每个响应式属性都有一个`Dep`实例，dep 用来收集存放(`depend`)和通知(`notify`)依赖其属性的`watcher`

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
Object.prototype.toString.call(undefined) //"[object Undefined]"
Object.prototype.toString.call(null) //"[object null]"
```

> typeof(null)中表示是对象,但在 instance 中却又是 null,而在 ES6 标准中明确表示 null 是一个基本类型,那么 null 到底是什么呢

- null 属于历史遗留问题
  现在比较普遍的认知是，typeof null 返回“object”是一个历史错误（JS 的发明者 Brendan Eich 自己也是这样说的,null 的类型机器码全为 0,而对象的前三位也为 0,typeof 则是判断类型机器码的前三位），只是因为要保持语言的兼容性而维持至今。从 ES5 制定开始就有动议将 typeof null 改为返回“null”（如启动 node 加上“--harmony_typeof”参数，即是如此），但是当前 ES6 标准草案仍然维持了原样。

- null 和 undefined 的使用
  - null 是一个存在的`空`,当需要指定变量为`空`时,可以使用 null 表明此变量是有一个指向的,但指向一个`空`;
  - 而 undefined 是指一个还没有确定指向目标的变量,将来可以任何值,但现在没有指向

### outline

#### 是什么

元素 border 外的充填内容

### package.json 和 package-lock.json

#### 区别

- package.json 是 install XX 的直接依赖,并随着 install 的改变,版本前有`^`号表示可以用之后的最新版本

- package-lock.json 是 package.json 生成时候自动生成,包含 install 时的具体版本号,及其所有间接依赖

> 任何更新 node_modules 和/或 package.json 依赖项的命令都会自动同步现有的锁文件。 这包括 npm install，npm rm，npm update 等。为防止发生此更新，您可以使用--no-save 选项完全禁止保存，或者使用--no-shrinkwrap 允许 package.json 在更新时 保持 package-lock.json 或 npm-shrinkwrap.json 不变,当之后 update 包时,直接依赖会更新,但间接依赖不更新

#### 用法

- 若 package.json 发生更新后,`npm install`将根据`package.json` 安装 .`npm install`的默认顺序是 npm-shrinkwrap.json > package-lock.json > package.json
- 若希望直接使用最初的锁定版本,则使用 `npm ci`下载`package-lock.json`中的依赖(注意，`npm ci` 在安装前会自动清除现存的 `node_modules`，所以 npm ci 天然规避了增量安装可能带来的不一致性等问题)

## week 9

### 微服务和 serverless 和 docker

#### 微服务

一种设计思想,将一个大项目分解成一个个独立的小项目，使其可以分而治之，避免牵一发而动全身，能够以最小的成本管理、开发、部署。该思想在前后端都有所应用。

后端应用组件化,API 分离,去中心化,每个 API *独立部署*

前端模块、页面组件化,

> ![microService](https://ss0.baidu.com/6ONWsjip0QIZ8tyhnq/it/u=2766950049,2173529202&fm=173&app=25&f=JPEG?w=640&h=375&s=4586FD1203067CEA104990C00200D0B3)

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

- 将二进制图片转换为 文件传输
  base64

#### 方法

- 在浏览器中用`window.btoa`encode,`window.atob`decode
- 在 canvas 中`ctx.toDataURL(mimeType,quality:0~1,'compressRatio'):base64`

### axios 中的坑

#### authorization

axios.`get/post...`中设置 authorization 没用,需要用`axios({ method:"", url:"", data:"", headers:"" , })`

#### interceptor,在 transformData,transformHeader 之前

所以如果在 headers 中设置`content-type`,在 interceptor 中还是`content-type`,之后才会`transformHeaders`成`Content-Type`

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
  1. 词法分析
  2. 语法分析
- transform
- generater

## week 10

### preload 和 prefetch

_!!!wrong_
明白预加载和预获取需要首先清楚浏览器使用资源的流程  
其流程基本可以分为两个部分 Network Transmisson(资源的网络传输) | Resource Processing (资源处理、加工、执行)

> 例如 js 文件，首先网络下载后，处理的过程包括编译和执行  
> 图片文件，网络下载后，处理的过程包括解码和绘制

![webGL](../images/resource-load.jpg)

_right_
`preload`和`prefetch`都不会自动执行，`preload`只是会提前针对`as`解析,在下次使用时直接从内存中调用执行。`prefetch`不会提前解析，在下次使用时从`prefetch`缓存中 load 数据再执行。  
[https://w3c.github.io/preload](https://w3c.github.io/preload/#early-fetch-and-application-defined-executio)

#### preload

- 定义
  优先预加载，_优先级高_，可以在 render tree 时候异步下载(transmission)，但不会执行导致 render 阻塞，在 render 完后执行可以执行`onload`方法

- 用法  
  `<link rel="preload" href="..." as="..." type="..." onload="preloadFinished()">`
  可定义回调函数
  > `as`可以为`script`、`image`、`style`、`audio`、`font`、etc.

#### prefetch

- 预获取，_优先级低_,将在页面加载完成后提前下载

- 用法与 preload 基本一致

#### 应用

在 VUE SSR 生成的页面中，首页的资源均使用 preload，而路由对应的资源，则使用 prefetch

#### 扩展

给 script 标签设置`defer`和`async`也能延迟 load,两者都能异步 load(在解析 css,html 文件时下载，不阻塞 dom 的构建)

- `async`*该 JS 文件*load 完后*立即*执行该文件，`DCL(DomContentLoaded)`不涉及该文件的执行
- `defer`*页面解析 parsing*完后才执行该文件，但在`DCL`之前需执行(详见[whatwg](https://html.spec.whatwg.org/#the-end))

> `async`标签表示该资源不涉及页面的初次渲染，不依赖前置脚本，所以可以异步下载并且直接执行，`defer`表示资源需要延迟执行，作为页面渲染前需要执行的脚本

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

> 机器码和字节码  
> 字节码通常在解释性语言中，字节码通过特定的解释器直接转为机器码运行在电脑中，例如js语言在V8下先编译为特定字节码再解释运行。

### intersectionObserver

#### 定义

提供了一种异步观察目标元素与其祖先元素或顶级文档视窗(viewport)交叉状态的方法。可代替监听 scroll 事件中不停获取 getBoundingClientRect()，从而优化性能

#### 使用方法

```js
var options = {
  root: document.querySelector("#scrollArea"), //设置需监听的相对元素，默认为视窗
  rootMargin: "0px", //距离补偿
  threshold: 1.0, //监听元素出现在ROOT中的比例，1.0则是全出,可以为数组`[0,0.5,1]`,每到一个阈值都会执行一次回调
}
//callback 当出现时候的回调函数
var observer = new IntersectionObserver(callback, options)
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

#### 实现图片懒加载

```html
<img data-lazy="1.png" />
<img data-lazy="2.png" />
<img data-lazy="3.png" />
```

```js
const imgs = document.qureySelectorAll("[data-lazy]")
const obImg = target => {
  const ob = new IntersectionObserver(([entry, ...entrys]) => {
    if (entry.isIntersecting) {
      entry.target.src = entry.target.dataset.lazy
      ob.disconnect()
    }
  })
  ob.observe(target)
}

imgs.forEach(obImg)
```

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

#### webpack 作用

将所有依赖一起打包的工具.

> 任何时候，一个文件依赖于另一个文件，webpack 就把此视为文件之间有 依赖关系。这使得 webpack 可以接收非代码资源(non-code asset)（例如 images 或 web fonts），并且可以把它们作为 _依赖_ 提供给你的应用程序。
> webpack 从命令行或配置文件中定义的一个模块列表开始，处理你的应用程序。 从这些 入口起点 开始，webpack 递归地构建一个依赖图，这个依赖图包含着应用程序所需的每个模块，然后将所有这些模块打包为少量的 bundle - 通常只有一个 - 可由浏览器加载。

#### webpack 简单理解

目的：实现模块化开发  
实现结果：函数实现模块，装配进 modules 数组，组织代码编译。  
实现方式：Tapable 钩子的订阅发布  
使用 Tapable new 出 webpack 构建周期中各个阶段的钩子对象，每个钩子会在对应的阶段发布其订阅的函数

> webpack 整体是一个插件架构，所有的功能都以插件的方式集成在构建流程中，通过发布订阅事件来触发各个插件执行。webpack 核心使用 Tapable 来实现插件(plugins)的 binding 和 applying.

```js
this.hooks = {
  buildModule: new SyncHook(),
  rebuildModule: new SyncHook(),
  finishModule: new SyncHook(),
  compilation: new SyncHook(),
}

//SingleEntryPlugin函数订阅compilation,tap第一个参数作为订阅者名字，第二个参数为订阅响应
this.hooks.compilation.tap("SingleEntryPlugin", option => {})

//发布compilation钩子
this.hooks.compilation.call(option)
```

#### webpack 中的模块

webpack 可识别以下的模块化形式

- An ES2015 import statement
- A CommonJS require() statement
- An AMD define and require statement
- An @import statement inside of a css/sass/less file.
- An image url in a stylesheet url(...) or HTML <img src=...> file

#### 主要流程

- compiler 初始化: run=>compile() 创建 compilation

- 执行 compilation

  1. loaders
  2. hashed
  3. parser
  4. 存在依赖则处理该依赖=>1，否则 seal：成功收集一个完整的 chunck 依赖树
  5. 将对象数据根据依赖关系拼接字符串为一个 source

- 将存在的 chunck source emit 为 bundle 文件

- compiler done

#### loader 和 plugin

##### loader

webpack 本身只处理 js 文件中的依赖关系(`import /export`),对其他内容或不同文件可通过 loader 进行编译
Loaders 是用来告诉 webpack 如何转化处理某一类型的文件，并且引入到打包出的文件中

> 常用 loader:`file-loader(deal png)`,`css-loader(deal style)`,`babel(deal es6)`

loader 基本用法

```ts
function syncLoader(source: string, map) {
  const options = require("loader-utils").getOptions(this)
  const newSource = soureDealer(source)
  return newSource
}

function asyncLoader(source) {
  var callback = this.async()
  var headerPath = path.resolve("header.js")

  this.addDependency(headerPath)

  fs.readFile(headerPath, "utf-8", function(err, header) {
    if (err) return callback(err)
    callback(null, header + "\n" + source)
  })
}
```

##### plugin

webpack 插件是一个具有 `apply` 属性的 `JavaScript` 对象。`apply` 属性会被 `webpack compiler` 调用，并且 `compiler` 对象可在整个编译生命周期访问。
这个 apply 方法在安装插件时，会被 webpack compiler 调用一次。apply 方法可以接收一个 webpack compiler 对象的引用，从而可以在回调函数中访问到 compiler 对象。一个简单的插件结构如下：

> compiler 和 compilation
>
> - compiler 是 webpack 根据 config 生成的构建实例，可以控制与监控整个构建流程（根据其 hook 存在 run,make,emit,done 等过程）。
> - compilation 是 compiler 构建中的编译时实例，主要涉及具体对模块的编译流程（包括 loader,sealed,optimized,chunked,hashed,restored）
>   compiler.hooks.compilation

plugin 基本用法

```js
class HelloCompilationPlugin {
  apply(compiler) {
    // Tap into compilation hook which gives compilation as argument to the callback function
    compiler.hooks.compilation.tap("HelloCompilationPlugin", compilation => {
      // Now we can tap into various hooks available through compilation
      compilation.hooks.optimize.tap("HelloCompilationPlugin", () => {
        console.log("Assets are being optimized.")
      })
    })
  }
}

class HelloAsyncPlugin {
  apply(compiler) {
    compiler.hooks.emit.tapAsync(
      "HelloAsyncPlugin",
      (compilation, callback) => {
        // Do something async...
        setTimeout(function() {
          console.log("Done with async work...")
          callback()
        }, 1000)
      }
    )
  }
}
```

> - 常用 plugin:`CommonsChunkPlugin (extract common module in different bundle)`,`HtmlWebpackPlugin(简单创建 HTML 文件，用于服务器访问)`,`UglifyJsPlugin(compress js file)`

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

## week 11

### webGL

#### 什么是 webGL

![webGL](../images/webGL.png)

WebGL（全写 Web Graphics Library）是一种 3D 绘图协议，这种绘图技术标准允许把 JavaScript 和 OpenGL ES 2.0 结合在一起，通过增加 OpenGL ES 2.0 的一个 JavaScript 绑定，WebGL 可以为 HTML5 Canvas 提供硬件 3D 加速渲染，这样 Web 开发人员就可以借助系统显卡来在浏览器里更流畅地展示 3D 场景和模型了，还能创建复杂的导航和数据视觉化。

#### 为什么需要 OpenGL

![webGL](../images/webGL2.png)
webGL 的优势就是可以利用 GPU 处理图像,GPU 可以多核并行处理将大大优于 CPU 处理图像,而 OpenGL 则是显卡的底层驱动接口,webGL 通过结合 OpenGL 从而实现最好的图形处理途径,以至于能够在浏览器中创造精致的动画.

JavaScript-> Canvas -> WebGL -> OpenGL ->.... -> 显卡

### redis

#### redis 是什么

Redis 是一个使用 ANSI C 语言编写、支持网络、可基于内存亦可持久化的日志型、高性能的 key-value 数据库

#### redis 的作用

- 存储数据在缓存在内存中，可以加快数据的提取发送，在部分场合可以对关系数据库起到很好的补充作用

- redis 会周期性的把更新的数据写入磁盘或者把修改操作写入追加的记录文件，并且在此基础上实现了 master-slave(主从)同步。

#### redis 应用场景

- 缓存中间件

用做服务器缓存，耗时操作得到数据后存入 redis，此后的请求都可以直接从 redis 取数据

```js
const heavyCompute= ()=>{
//...
}

function (req,res){
  try{
    const reply = redis.get('key')
    if(reply){
      res.send(reply)
    }else{
      const newReply = heavyCompute()
      redis.set('key',newReply)
      res.send(newReply)
    }
  }
}
```

### AI 为什么用 python

python 作为一个运行效率在所有语言中倒数的语言为什么成为了 AI 这种主要是计算数据的任务的主流语言?

> 人工智能的核心算法是完全依赖于 C/C++的，而且 Python 历史上也一直都是科学计算和数据分析的重要工具。Python 虽然是脚本语言，但是因为容易学，迅速成为科学家的工具（MATLAB 等也能搞科学计算，但是软件要钱，且很贵），从而积累了大量的工具库、架构，人工智能涉及大量的数据计算，用 Python 是很自然的，简单高效。

#### 易学

对于编程只是副业的 AI 科学家们来说，没那么多时间去学习和使用 C++，还是把大量时间用来研究研究算法比较实在。

#### 调用的数据处理的接口(库)是 C++

Python 虽然慢但是它只是调用 AI 接口，真正的计算全是 C/C++写好的数据底层，用 Python 只是写相应的逻辑，几行代码就出来了。换成 C++的话，不仅代码量太大，而且开发效率太低，不是说用 C++写不了上层逻辑，，而是换来总体速度提升 1%，得不偿失。

#### 生态丰富

Python 在拥有简洁的语法和丰富的生态环境从而提高开发速度的同时，对 C 的支持也很好，python 结合了语言的优点，又通过对 C 的高度兼容弥补了速度慢的缺点，自然受到数据科学研究者与机器学习程序员的青睐。

### svg

#### svg 是什么

svg 是属于 XML 的可扩展的矢量图形(scalable vector graphic),本质上是属于一种 XML 语法,故可以被浏览器识别

#### svg 主要属性

- fill
- stroke
- path
- stroke-miterlimit
- stroke-dasharry

#### svg 主要功能

- animateTransfrom
  > SVG 专属动画

```html
<path fill="red" d="...">
  <animateTransform
    id="foo"
    attributeName="transform"
    attributeType="XML"
    type="translate"
    dur="1s"
    begin="1"
    value="0,15;0,-15;0,15"
    repeatCount="indefinite"
  />
</path>
```

- filter
  > svg 专属滤镜

```HTML
<html>
  <title>SVG Filter</title>
  <body>
    <h1>Sample SVG Filter</h1>

    <svg width="800" height="800">
      <defs>
        <filter id="filter1" x="0" y="0">
          <feGaussianBlur in="SourceGraphic" stdDeviation="8" />
        </filter>

        <filter id="filter2" x="0" y="0" width="200%" height="200%">
          <feOffset result="offOut" in="SourceAlpha" dx="20" dy="20" />
          <feGaussianBlur result="blurOut" in="offOut" stdDeviation="10" />
          <feBlend in="SourceGraphic" in2="blurOut" mode="normal" />
        </filter>
      </defs>

      <g>
        <text x="30" y="50">
          Using Filters (Blur Effect):{" "}
        </text>
        <rect
          x="100"
          y="100"
          width="90"
          height="90"
          stroke="green"
          stroke-width="3"
          fill="green"
          filter="url(#filter1)"
        />
      </g>
    </svg>
  </body>
</html>
```

### cookie 和 token

#### cookie

http 协议中`浏览器中的一种存储类型,是服务器或脚本可以维护客户工作站上信息的一种方式

- 大小  
  一个浏览器能创建的 Cookie 数量最多为 300 个，并且每个不能超过 4KB，每个 Web 站点能设置的 Cookie 总数不能超过 20 个
- 属性
  每个 cookie 除了最基本的`Name`,`Value`之外，还有一些控制属性。
  ![cookie-properties](../images/cookie-properties.png)
- 存储位置  
  Cookie 是个存储在浏览器目录的*文本文件*，当浏览器运行时，存储在 RAM 中。一旦你从该网站或网络服务器退出，Cookie 也可存储在计算机的硬驱上。当访客结束其浏览器对话时，即终止的所有 Cookie。
- 存储时间  
  由服务器设置的时间决定(`max-age`||`Expire`),也可自行删除
- 使用注意
  Cookie 必须在 HTML 文件的内容输出之前设置

  > setCookie(someCookie);send(html)

#### token

token 一般指 http 协议中请求头中`authorization`中设置的一个`key-Value`

#### 相同点

- 维持客户-服务器
- 都在请求头中发送

#### 区别

- 发送方式
  cookie *自动*对相同域名发送
  token 需要手动发送(只有在异步脚本请求中)

  > 因此类似表达对安全要求高的提交用 token  
  > 例如一个购买请求`www.buybuybuy.com/buy?game1=1`,若用 cookie 验证,极易遭遇`CSRF`（Cross-site request forgery,跨站请求伪造）,他人发来一个这样的地址(一个伪装极好的 url 链接),若不小心点击则会中招

- 设置方式
  cookie 由服务端 `Set-Cookie header`后自动存储

```python
Set-Cookie: name = VALUE;
expires = DATE;
path = PATH;
domain = DOMAIN_NAME; #设置发送域名,在请求时会首先搜索
```

token 需从服务端获得后再在前端设置存储(`localStorage.set`)

- 清除方式
  cookie 时间到期后自动清除,也可手动在浏览器上清除
  token 在 localStorage 中需要手动清除

- 性能消耗
  cookie 每次自动发送,并且可能携带大量数据在对网络请求上是不小的消耗,

### Design Psychology

#### affordance

能唤醒人们无意识的行为进行交互

#### empathy map

同理心图 ,用户图谱

#### ·holding

### dota2 webapi

`myKey`=`5000557018&key=0D6563D96A865670FBA3171ADC40DDB0`

#### api example

> <https://api.steampowered.com/IDOTA2Match_570/GetMatchDetails/V001/?match_id=5000557018&key=0D6563D96A865670FBA3171ADC40DDB0>

### encodeURIComponent 和 encodeURI

由于 URI 对一些字符不能正确传递，需要将其编码为可传递的数字字母及%

#### 区别

encodeURI：只会处理空格 /s
encodeURIComponent: 处理所有非数字字母 \[^a-z0-9\]

### 订阅发布 和 观察者

#### 最主要区别

观察者的 `notify` 一般被设置为条件触发到所有监听者
订阅发布的 `dispatch` 为主动触发到特定监听者,中间存在`filter`

```js
notify(value)
dispatch('type',value)
```

### rust

新的系统编程语言,属于偏底层的编译语言

#### attribute

no garbage and runtime,通过内置丰富的类型和严格的编译检查实现内存的安全和高性能的表现

### \_\_proto\_\_ 和 prototype

#### _proto_

`_proto_`是任何引用类型的*访问*属性

该属性有一个属性`constructor`,和其他属性 -`constructor`为其构造函数, sonObj instanceof fatherFunction 就是通过判断 sonObj 中`_proto_`链中的`construtor`是否存在一个为 fatherFunction.
-`

#### prototype

`prototype`是构造函数的属性,为创建实例的`_proto_`,默认构造函数的`prototype`存在`construtor`为自身,

#### 联系

- 函数是 JS 中一等公民,函数衍生对象(Object 类型),函数是最高级的对象(拥有对象的所有属性)

- Object 类型指引用类型中的对象类型,其属性是引用类型中最基础的,都存在的
- 所有的引用类型都有`_proto_`,故他们都有对象的所有属性,全部是从最顶点的一个`Function`创建

```js
fooObj.__proto__ = Foo.prototype
```

```js
;(Function.__proto__.constructor === Object.__proto__.constructor) === Function
```

- 所有的`_proto_`的顶点都是 Object.prototype.\_\_proto\_\_

```js
Object.prototype.constructor === Object
;(Function.__proto__.__proto__.__proto__ === Object.prototype.__proto__) ===
  null
```

#### 模拟 class 的继承

```js
function Person() {}
Person.prototype.dance = function() {}
function Ninja() {}
Ninja.prototype = new Person()
Object.defineProperty(Ninja.prototype, "constructor", {
  enumerable: false,
  value: Ninja,
  writable: true,
})

Ninja {}
__proto__: Person
  constructor: ƒ Ninja()
  __proto__: Object
```

### 词法环境和函数上下文

#### 词法环境

> _Js 执行流程_

1. 扫描=>注册当前词法环境的函数声明=>注册变量声明

> 词法环境有三种：1.全局环境 2.函数作用域 3.块级作用域
> ![register-step](../images/register-step-1.png)

```js
let b = 2
function foo() {
  var a = b
}
// create window environment
// bind foo = function in window
//foo[[envrionment]]==window
// register b in window
// begin execute
// b= 2
// foo()
foo()
//create foo function enviroment
// register args
// regist a  in functionFoo
// begin execute
// engine will find b from foo environment in advance,then to find b in foo[[environment]] if b not in foo
```

2. 顺序调用
   执行中遇到标识符（变量）=> 在当前作用域中注册的标识符中寻找 => (if not)在当前作用域标识符所注册的环境中寻找

#### 函数上下文

当调用函数时，除了显式提供的参数外，this 参数也会默认地传递
给函数。this 参数是面向对象 JavaScript 编程的一个重要组成部分，代表
函数调用相关联的对象。因此，通常称之为函数上下文。

#### 执行上下文

代码执行的调用栈，是 JavaScript 内部的概念
JavaScript 代码有两种类型：一种是全局代
码，在所有函数外部定义；一种是函数代码，位于函数内部。JavaScript
引擎执行代码时，每一条语句都处于特定的执行上下文中。

## week 12

### WAN/LAN

#### WAN

- 即 Wide Area Network,广域网,是网络运行商分配的网络.
  针对分配的 IP 是否固定又分为:  
  `固定IP`:一般是办理商业宽带时运营商才会分配,一个不变的公共网络上的 IP 地址  
  `动态IP`:一般普通的家庭宽带都是分配的动态 IP,由于公网 IP 数量有限,IP 每次接通后都是动态随机分配的

- 连接方式
  通过路由器 wan 口连接

#### LAN

- 即 Local Area Network,局域网,是本地分配的网络.
  LAN IP 由于不接入公共网络,故也称`虚拟IP`, 为防止与 WAN IP 冲突,一般规定使用

```NGINX
    A级：10.0.0.0 - 10.255.255.255 　

    B级：172.16.0.0 - 172.31.255.255 　

    C级：192.168.0.0 - 192.168.255.255 　
```

- 连接方式  
  通过路由器和交换机的 LAN 接口,

### git

#### 配置用户名

- git config --global user.name "zs" 注意: 最好和远程 github 的用户名相同
- git config --global user.email "自已的邮箱地址" 也应该相同
- 注意: 控制面板\用户帐户和家庭安全\凭据管理器

#### 初始化仓库

- git init

### 命令

#### 常用命令

- git status 查看工作区状态
- git add . 把工作区所有内容存入暂存区
- git checkout xx 把暂存区内容还原到工作区
  - 慎用 暂存区的内容会覆盖工作区内容
- git commit -m'xxx' 添加文件到存储区
  - 为了方便以后查看代码或者回滚代码,-m 的描述信息不能随便填
  - 注意: -m'xxx'不能忘掉,否则会进入 git 的 vim 编辑器
  - 退出：esc => :wq
- git log 查看历史版本
- git reflog 查看所有操作记录，包括 Reset 操作
- git reset --hard '哈希' 时光机,回到某一次记录
  - hard：清空工作区（working tree）
  - mixed(default) : 回到工作区
  - soft:回到暂存区（index）

> ![git-reset_mode](../images/git-reset_mode.jpg)

#### 分支系统

- git branch dev(分支名字自己定义)
- git branch 查看分支
  - 默认主分支为 master 分支
  - 在哪个分支上,显示当前分支的代码
- git checkout dev(需要切换到的分支名称) 切换分支
- git merge xx(把分支 xx 合并到当前分支) 合并分支(子分支还存在)
- git branch -d dev 删除分支
- git checkout -b `dev` ，创建 dev 分支并切换到 dev
- 创建本地 localDev 并关联到 Origin 仓库的 remoteDev 分支

#### 精细操作

- git stash 将 stage 和
- git cherry-pick \[commitid\] 可提取其它分支的 commit 合并到当前分支
- git rebase \[branch\] 将最近一次提交变基到最新的分支 HEAD 上

#### github

- git remote add origin git@github.com:yourRerepo.git 建立仓库的关联
  - https 形式地址,一般需要用户名密码 `https://github.com/yourRerepo.git`
  - ssh 形式地址
  - git remote remove origin 删除远程的源
- git remote -v 查看仓库
- git push -u origin master 把本地存储代码 push 到远程仓库(的 master 主分支)
- git push(之后的推送直接 push)
- git clone xx clone 某个仓库到本地,保持仓库的远程连接
- git pull 拉取远程代码,一般在冲突的时候使用

#### 配置 ssh

> github 可以通过 https/ssh 的两种形式和本地仓库建立连接. https 的形式需要每次输入用户名和密码. 推荐使用 ssh 形式,而且要会配置.

- ssh-keygen -t rsa -C "nevermoxxxx@xxx.com" 下一步即可
- 在本地 C:\Users\Administrator\.ssh 生成的 3 个文件
- 在远程 github=> setting=> ssh 配置 添加 本地 id_rsa.pub 的内容 即可

### ssh

Secure Shell ,和 HTTP 的 SSL 一样都是在应用层基础上的安全协议.

#### 两种级别的安全验证

- 基于口令的安全验证

- 基于密匙的安全验证
  - 对称加密 :  
    使用同一个密钥 继续加密和解密
  - 非对称加密 :  
    利用 [RSA 加密](https://blog.csdn.net/tabactivity/article/details/49685319)算法分为 2 个钥匙,公钥和私钥
    公钥和私钥是成对的，它们互相解密。公钥加密，私钥解密。私钥数字签名，公钥验证。

### ssr

### sass 进阶

#### mixin

利用 mixin(混合),可以提取公共部分,example :

> 表示值(sass 用 6 种值类型)的变量用\$,属性的比那里用#{}

```scss
@mixin footer-icon($icon) {
  .footer-icon.icon-#{$icon} {
    background-image: url("../assets/imgs/icons/icon-#{$icon}.png");
    &.router-link-active {
      background-image: url("../assets/imgs/icons/icon-#{$icon}-active.png");
    }
  }
}

@include footer-icon("home");
@include footer-icon("movie");
```

#### @for 和@each

利用@for 遍历,批量生成 style,example:

```scss
$icons: ("home", "movie", "ticket", "cinema");
@for $i from 1 through length($icons) {
  $icon: nth($icons, $i); // nth($icons,$i) == icons[i] in python
  .footer-icon.icon-#{$icon} {
    background-image: url("../assets/imgs/icons/icon-#{$icon}.png");
    &.router-link-active {
      background-image: url("../assets/imgs/icons/icon-#{$icon}-active.png");
    }
  }
}

//or @each

@each $icon in $icons {
  .footer-icon.icon-#{$icon} {
    background-image: url("../assets/imgs/icons/icon-#{$icon}.png");
    &.router-link-active {
      background-image: url("../assets/imgs/icons/icon-#{$icon}-active.png");
    }
  }
}
```

### 简单的 3D-nav 切换

#### 3 个层级,从上至下

- nav
- content
- content-mask,用来制作景深

#### 设置 perspective

需要 3d 变化的父盒子要设置 perspective,该盒子要设置`transform-style:3d`

#### 延迟 transition

通过在 transition 上设置不同的时间制造效果
`transition:opacity 0.6s ,transfrom .2s(delay) .6s`

#### 动态切换

切换时,同时出现 content-mask,和 transform3d content 的大小

## week 13

### typescript base concepts

每一个类型声明都会至少创建`namespace`、`type`和`value`中的一个实体。这些实体将作用于 ts

- namespace, 命名空间,用来声明一个模块,决定被 ts 识别类型的作用域
- type, 决定类型的具体信息,创建一个类型实体
- value，有意义的值，将会编译在 js 中执行

| Declaration Type | Namespace | Type  | Value |
| ---------------- | :-------: | :---: | :---: |
| Namespace        |     √     |       |   √   |
| Class            |           |   √   |   √   |
| Enum             |           |   √   |   √   |
| Interface        |           |   √   |       |
| Type Alias       |           |   √   |       |
| Function         |           |       |   √   |
| Variable         |           |       |   √   |

> 可以发现，Interface 和 Type Alias 都是创建一个类型实体，那么它们直接的区别是什么呢。  
> Interface 是独立创建了一个对象类型接口，可以参与其他类型的创建（通过`extends` 和 `implement`）。而 Type Alias 则是根据已有的类型中获取成一个类型并命名（通过`&`和`type of`及基本变量）

### typescript 特殊类型

#### Emun

Emun 是枚举类型,被 TS 编译成对象,起属性包括枚举的所有 KEY 和 VALUE,从而可以互相映射

#### any

规定为任何类型,让其跳过类型检查

#### never

规定为不属于任何类型,通常表现为抛出异常或无法执行到终止点（例如无线循环）;

```ts
function error(message: string): never {
  throw new Error(message)
}
```

#### readonly

规定属性只读

#### turple

规定 item 类型的数组

```ts
```

#### 泛型

表示多个类型

- `<T>`,类型变量 T

```ts
// <T>表示一个类型变量,参数和输出类型都是T,所以应输出相同的变量
funciton identity<T>(arg:T):T{
  return  arg
}

//
funciton identityArr<T>(arg:T[]):T[]{
  return  arg
}
```

- 泛型约束

> `<T extends K>`
> 使用`extends`来约束泛型`T`，泛型`T`必须是由`K`继承而来

```ts
interface Lengthwise {
  length: number
}
function loggingIdentity<T extends Lengthwise>(arg: T): T {
  console.log(arg.length)
  return arg
}

function getObjectProprety<T, K extends keyof T>(obj: T, key: K) {
  return obj[key]
}
```

```ts
class Animal
```

#### 高级类型

- 交叉类型
  `T&U`,两种类型之和
- 联合类型
  `string|number`,两种类型之一
- 类型保护
  通过一些语法,让 TS 获取其类型:  
  类型谓词:`isFish(pet:Fish|Bird):pet is Fish`
  类型语法:`typeof x`,`x instanceof X`

#### 类型推断

TS 内部会由一系列推断方式自动对类型有可能的推断,生成候选类型

- 上下文推断

#### class 中的 private 和 protect

private:声明为私有属性,外面都不可用;
protect:外面都不可用,但可在子元素中 super;

### typescript 特殊语法

#### 接口

是一个类型的对象,将类型进行封装复用,和`class`一样

```ts
interface GenericIdentityFn<T> {
  (arg: T): T
}
```

#### class 中

在 class 中,类型的声明为实例中的属性(构造器中)

### Vue 函数组件

#### 原理

当使用无状态的组件时,可以不需要生成实例,直接调用渲染函数,

#### 两种写法

```js
//Vue的函数组件(无状态),本质和react毫无区别

const exampleCp = new Vue({
  functional: true,
  props: ["tags"],
  render(h) {
    return h(
      "div",
      this.tags.map((e, i) => h(e, i))
    )
  },
})

const exampleFn = (h, data) =>
  h(
    "div",
    data.props.tags.map((e, i) => h(e, i))
  )
```

#### 在 jsx 中

`<>`会被转换成`h`函数,即 createVirtulElement,返回虚拟 DOM.  
之后的流程是:  
`createElement(diff(render()))`

```jsx
const exampleFn = (h, data) => (
  <div>
    {data.props.tags.map((e, i) => (
      <e>i</e>
    ))}
  </div>
)
```

## week 14

### HTTP 报文

HTTP 报文是 HTTP 协议的内容展示

#### 组成

HTTP 请求报文由 3 部分组成（请求行+请求头+请求体）：

### git fetch 和 git pull

两者都是从远程仓库拉取,那么有什么区别呢

#### fetch

从远程拉至本地`remote`分支,但不执行混合`merge`,即本地 origin 仓库中依旧是 fetch 前的内容

#### pull

从远程拉至本地`remote`分支,并执行混合`merge`,本地 origin 仓库为混合后的内容

#### 关系

可以认为 fetch&&merge == pull

### for in 和 Object.keys

#### 相同点

都是遍历对象的*可枚举*属性

> Object.getOwnPropertyNames() 会把 enumerable: false 的属性名也加进来。  
> Reflect.ownKeys() 在此基础上还会加上 Symbol 类型的键

#### 不同点

`for in` 可以遍历到对象原型的属性(可用`hasOwnProperty(key)`判断);
`Object.keys`只能遍历对象自身的属性

### tec-interview-tips

#### first job is import ,keeping angle in the way

#### be humor

#### take more time in talk about detail of my project

#### dont't take large time in one problem

#### writing project more uniqio in resume

#### focus more on analysis problem then write code

### vue 的大坑

#### 组件属性不能用大写,需要在前面加`-`

#### 响应数据的 set 属性存在缓存,来判断是否变化,不是只要赋值就 notify

#### Object 的判断很奇怪,PUSH.slice 操作可以被判断为改变,但是更改其属性却无效

这是由于 VUE 会把 Object 中的属性也设为响应式数据,但是它是独立于其 Object 的,故他的改变只会触发他的 dep,当不会触发它的 Object 的 dep

_那么,Vue 是如何判断 PUSH 等操作的呢?_ 看看源码

```js
/*
 * not type checking this file because flow doesn't play well with
 * dynamically accessing methods on Array prototype
 */

var arrayProto = Array.prototype
var arrayMethods = Object.create(arrayProto)

var methodsToPatch = [
  "push",
  "pop",
  "shift",
  "unshift",
  "splice",
  "sort",
  "reverse",
]

/**
 * Intercept mutating methods and emit events
 */
methodsToPatch.forEach(function(method) {
  // cache original method
  var original = arrayProto[method]
  def(arrayMethods, method, function mutator() {
    var args = [],
      len = arguments.length
    while (len--) args[len] = arguments[len]

    var result = original.apply(this, args)
    var ob = this.__ob__
    var inserted
    switch (
      method // 对插入的数据进行响应式化
    ) {
      case "push":
      case "unshift":
        inserted = args
        break
      case "splice":
        inserted = args.slice(2)
        break
    }
    if (inserted) {
      ob.observeArray(inserted)
    }
    // notify change
    ob.dep.notify()
    return result
  })
})

/*  */
```

原来,vue 对数组的一些方法进行了重写,对插入的数据进行响应式化，并对这些方面都会执行 dep.notify,触发 watcher

### linux 命令

#### 命令格式

`command` `-options` `parameter`

- `command`:命令名,`ls`
- `options`:可选,命令的一些选项设置,`rm -r aaa` 删除文件夹,多个 option 可以一起使用 `ls -lha`
- `parameter`:命令的参数

#### 常用命令

> 显示`command`的使用说明

- `command --help`
- `man command`
- `b`回退,`f`,`space`前进,`q`退出
- `tab`自动补全,双击显示可选 ���

> tee
> 读取标准输入的数据,并将其内容输出成文件

> curl
> 在 Linux 中 curl 是一个利用 URL 规则在命令行下工作的文件传输工具，可以说是一款很强大的 http 命令行工具。它支持文件的上传和下载，是综合传输工具，但按传统，习惯称 url 为下载工具

#### 通配符

> example, 123.txt 321.txt 1223.txt,

- `*`,匹配任意数量的字符 ,`rm 1*3`=>123.txt,12223,txt
- `?`,匹配 0,1 个字符,`rm 1?3`=>123.txt

#### 管道符 |

可以把一个命令的标准输出传送到另一个命令的标准输入中

> ls | less
> 则是将 ls 的结果 less 处理（分页）

### element-ui

#### dialog

el-dialog 初始化时,其 body 并没有挂载,在第一次 Display true 的时候才会挂载

### prettier 和 eslint

#### prettier

强大的代码格式化插件,可以识别几乎所有语言,进行格式化,通过配置,用于保证代码*风格*的一致性

#### eslint

js 语言的代码检测插件,可以检测出代码中出现的语法问题,同时也存在格式化功能

#### 如何共用

由于两者都存在格式化的功能,所以同时使用时候可能出现冲突,可以用`eslint-plugin-prettier`等插件配置在 eslint 上,先执行 Prettier 然后再自动使用 eslint --fix 将与 ESLint 规则冲突的代码修正成 ESLint 想要的结果。这样其实引入 Prettier 不会影响你原有的设置。

### 为什么限制跨域

#### 跨域的范畴

前端(在浏览器)对非自己服务器的网站进行 AJAX 请求时,会被浏览器的`serverworker`判定为跨域,阻拦这次请求

#### 限制的意义

- 保证本网站的 cookie 不被其他域名的服务器获取
- 保证其他网站的资源不被轻易获取,若无跨域,可以拿到其他网站很多的数据(当然这可以在服务端用反向代理轻易拿到)
- (保证其他网站的用户安全,若无跨越,那么在拿到其他网站数据的同时,还会获得请求和响应的所有数据,其中就包括了可能带有个人信息的`cookie`(这些在服务端反向代理也也拿不到,因为`cookie`在浏览器内发送))

## week 15

### BEM

#### BEM 是什么

BEM ==`block` `element` `modified` ,
是 css 的一种以`block_element--modified`的方式命名的命名规范

#### BEM 的主要法则

- 一个单独的组件为一个块
- 每个块内的元素都是同一个块前缀
- 只能存在一个 element
- 多词名称用`-`连接

#### BEM 样例

```HTML
<figure class="banner-photo">
  <img class="banner-photo__img photo__img--framed" src="me.jpg" />
  <figcaption class="photo__caption photo__caption--large-black">
    Look at me!
  </figcaption>
</figure>
```

### iPhoneX 的适配

#### 为什么需要适配

iphonex 存在刘海和底部胡须,若不处理则会影响页面展示

#### 如何适配

通过 Apple 提供的`safe-area-inset-*`属性,使用 constant( ) 和 env( ) 获取
例如:

> PS:必须指定 viweport-fit 后才能使用这两个函数  
> `<meta name="viewport" content="viewport-fit=cover">`

- 整体处理

```css
body {
  padding-top: env(safe-area-inset-top);
  padding-right: env(safe-area-inset-right);
  padding-bottom: 50px; /* 兼容不支持 env( ) 的设备  */
  padding-bottom: calc(
    env(safe-area-inset-bottom) + 50px
  ); /* 在 iphone x + 中本句才会生效 */
  padding-left: env(safe-area-inset-left);
}
```

- 顶部按钮处理

```css
.btn-container {
  box-sizing: content-size;
  height: 50px;
  padding-bottom: env(safe-area-inset-bottom);
  background: #fff;
}
.btn {
  height: 50px;
  background: #111111;
}
```

### NGINX 常用规则

#### try_files

```NGINX
location / {
    try_files $uri $uri/ /index.html?$args;
}

找指定路径下文件，如果不存在，则转给哪个文件执行
try_files
语法: try_files file1 [file2 ... filen] fallback
默认值: 无
作用域: location
```

#### Nginx location 的匹配规则

- ~ 波浪线表示执行一个正则匹配，区分大小写
- ~\_ 表示执行一 ��� 正则匹配，不区分大小写
- ^~ ^~表示普通字符匹配，如果该选项匹配，只匹配该选项，不匹配别的选项，一般用来匹配目录
- = 进行普通字符精确匹配
- @ #"@" 定义一个命名的 location，使用在内部定向时，例如 error_page, try_files

#### location 匹配优先级

- = 精确匹配会第一个被处理。如果发现精确匹配，nginx 停止搜索其他匹配。
- 普通字符匹配，正则表达式规则和长的块规则将被优先和查询匹配，也就是说如果该项匹配还需去看有没有正则表达式匹配和更长的匹配。
- ^~ 则只匹配该规则，nginx 停止搜索其他匹配，否则 nginx 会继续处理其他 location 指令。
- 最后匹配理带有"~"和"~\_"的指令，如果找到相应的匹配，则 nginx 停止搜索其他匹配；当没有正则表达式或者没有正则表达式被匹配的情况下，那么匹配程度最高的逐字匹配指令会被使用。
  示例

```conf
location = / {

# 只匹配"/".

[ configuration A ]
}
location / {

# 匹配任何请求，因为所有请求都是以"/"开始

# 但是更长字符匹配或者正则表达式匹配会优先匹配

[ configuration B ]
}
location ^~ /images/ {

# 匹配任何以 /images/ 开始的请求，并停止匹配 其它 location

[ configuration C ]
}
location ~\* \.(gif|jpg|jpeg)\$ {

# 匹配以 gif, jpg, or jpeg 结尾的请求.

# 但是所有 /images/ 目录的请求将由 [Configuration C]处理.

[ configuration D ]
}
URL 重写
仅是 URL 重写，不需要用 location 匹配，直接在 server 里写 rewrite 即可。
```

### hybrid 和 native

用 js 写 APP 是两种模式

#### hybrid

用 html + css 绘制页面，运行原理是打包工具创建一个只有一个或多个 Activity 的安卓应用，这个 Activity 上就只有一个 WebView 来显示页面。就相当于那个 app 实质上只是个浏览器，只能看你写的页面的浏览器；

#### native

类似 RN,WEEX 是一个 js 运行时环境,是一个 ios(jscore)或者 Android(v8)的原生应用, 这种用 jsx + 类 css 描述界面，界面上的控件元素是通过你前面的 描述 来要求原生层创建对应样式的原生控件。

> 例如在 weex 中用 jsFile 来控制页面的逻辑

### js 与 native 如何通讯

主要使用native端的WebViewClient，WebChromeClient

#### native 到 js

native层可以直接通过 webview.loadUrl 或 webview.evaluateJavaScript 方法将js代码注入到html
> html 即指 webview 这样的 jsruntime

#### js 到 native

- 直接注入，addJavaScriptInterface

- URL拦截

- JS方法拦截
  
### Mysql 级联查询

级联表如何一次查询所有关联数据,例如一个 user_id,必然关联很多表

> 查询流程: 合并表所需表=>查询关键字(user_id),  
> 根据合并方式的不通分为以下三种

#### 交集查询

重新生成满足`ON`条件的表,并 where 查询

```sql
SELECT column_name(s)
FROM table_name1
INNER JOIN table_name2
ON table_name1.id=table_name2.user_id

where table_name1.id=1
```

#### 左补集查询

在 table_name1 的基础上添加符合条件的 table_name2 的表单数据,并 where 查询

```sql
SELECT column_name(s)
FROM table_name1
LEFT JOIN table_name2
ON table_name1.id=table_name2.user_id

where table_name1.id=1
```

#### 右补集查询

在 table_name3 的基础上添加符合条件的 table_name2 的表单数据,再添加符合条件 table_name1 的数据,并 where 查询

```sql
SELECT *
FROM table_name1 t1
RIGHT JOIN table_name2 t2 ON t2.user_id = t1.id
RIGHT JOIN table_name3 t3 ON t3.user_id= t2.user_id
WHERE t1.user_id = 1
```

### 检测手机端

#### userAgent

```js
function detectmob() {
  if (
    navigator.userAgent.match(/Android/i) ||
    navigator.userAgent.match(/webOS/i) ||
    navigator.userAgent.match(/iPhone/i) ||
    navigator.userAgent.match(/iPad/i) ||
    navigator.userAgent.match(/iPod/i) ||
    navigator.userAgent.match(/BlackBerry/i) ||
    navigator.userAgent.match(/Windows Phone/i)
  ) {
    return true
  } else {
    return false
  }
}
```

#### pixel

```js
function detectmob() {
  if (window.innerWidth <= 800 && window.innerHeight <= 600) {
    return true
  } else {
    return false
  }
}
```

### window.orientation

```js
var isMobile = window.orientation > -1
```

### vue 的路由懒加载

两个步骤：splitChunks + vue 工厂函数

#### splitChunks

splitChunks 有两个功能

- 去重复组件
- 通过`import()`标识符能够让其被 splitChunks 分割为组件,并编译为一个 promise 函数

#### vue

当 vue 触发到该组件后会执行其异步函数,*类似*于:

```js
new axios.get("/async-component").then(asyncComponet => {
  this.routerComponent = asyncComponet //得到组件后缓存
  this.render()
})
```

## week 16

### webpack-loader 执行顺序

loader 由后向前执行(栈式)

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          "style-loader", // json => stylesheet
          "css-loader", //css content=> CommonJS module
          "sass-loader", //sass =>css
        ],
      },
    ],
  },
}
```

### @装饰器

#### 具体作用

```ts
type descriptor = {
  value: any
  enumerable: boolean
  configurable: boolean
  writable: boolean
}
function readonly(target: object, name: string, descriptor: descriptor) {
  desciptor.writable = false
  return desciptor
}
//在装饰类方法的时候，第一个参数表示类的原型(prototype), 第二个参数表示方法名, 第三个参数表示被装饰参数的属性
class Example {
  @readonly
  id: 123
}
```

### 浏览器中的进程和线程

> [参考文章](https://www.cnblogs.com/cangqinglang/p/8963557.html)

#### 浏览器的进程

- browser 进程,浏览器的*主进程*（负责协调、主控），只有一个。作用有:
  - 负责浏览器界面显示，与用户交互。如前进，后退等
  - 负责各个页面的管理，创建和销毁其他进程
  - 将 Renderer 进程得到的内存中的 Bitmap，绘制到用户界面上(所以不同 tab 只有一个会被绘制,其他会暂停绘制)
  - 网络资源的管理，下载等
- 渲染进程,_子进程_,每个 tab 单独的进程,主要作用为:
  - 页面渲染，脚本执行，事件处理等
- 第三方插件进程：每种类型的插件对应一个进程，仅当使用该插件时才创建
- GPU 进程：最多一个，用于 3D 绘制等

#### 浏览器的线程

渲染进程中有多个线程：

- js 线程,处理 js(_scripting_)
- GUI 渲染线程,解析 HTML(_loading_) ,构建 dom 和 css 树(_rendering_),绘制渲染树(_painting_)
  > *rendering*与*painting* 不一定连续进行（应用：提前获取 height）
  - 解析代码：HTML 代码解析为 DOM，CSS 代码解析为 CSSOM（CSS Object Model）
  - 对象合成：将 DOM 和 CSSOM 合成一棵渲染树（render tree）
  - 布局：计算出渲染树的布局（layout）
  - 绘制：将渲染树绘制到屏幕 （painting）

> js 线程 和 GUI 线程虽然可以独立运行，但为了保证性能浪费，它们之间相互阻塞，所以过多的`layout`修改（重排）会大量的调用渲染线程计算渲染树，阻塞主线程执行

- 事件触发线程,事件队列,处理*事件循环*
- 定时器线程,处理定时
- 请求线程,处理异步请求
  - 其中为了防止二次回流,CSS 和初次未设置异步的 JS 文件会阻塞 dom 加载

### 前端工具链

- JS 开发环境: 有 V8、Node 甚至是 Deno 等；
- JS 前端框架: 有 Angular、React、Vue、React Native、jQuery 等；
- JS 后端框架: 有 Nest、Express、Koa 等；
- JS 脚手架: 有 Vue CLI、Angular CLI、Create React App、Yeoman 等；
- JS 转译工具: 有 Babel 等；
- JS 测试工具: 围绕单元测试、集成测试，有 Mocha、Jasmine、Jest、Karma 等；
- JS 调试工具: 有 Chrome DevTools/Firebug/Webkit inspector 等各大主流浏览器、VS Code/WebStorm 等各大编辑器/IDE 等；
- JS 格式规范工具: 有 JSLint、JSHint、ESLint、TSLint 等；
- JS 接口联调工具: 有 Axios、Fetch 等；
- JS 包管理器: 有 NPM、Yarn、Bower、PNPM 等；
- JS 模块加载器: 有 RequireJS、SystemJS、StealJS、ES Module Loader 等；
- JS 任务管理工具: Grunt、Gulp、Webpack 监听文件变化，自动执行任务；
- JS 静态化支持: 有 TypeScript、CoffeeScript、Flow、LiveScript 等；
- JS 代码后处理工具: 围绕混淆器、缩小器、优化器诸多领域有各种各样的 loader 等；
- JS 打包工具: Webpack、Rollup、Parcel、Browserify 等；
- JS 模板引擎: 有 handlebarsjs、etpl、templatejs 甚至各大前端框架内置的模板语法等；
- JS 非 Web 框架: 在物联网、区块链、大数据等领域均有相关库支持，本文不涉及。
- JS 进程管理: 有 Forever、PM2、StrongLoop Process Manager 等；

## week 17

### process

`process`为 node 中的进程变量，是全局变量，可直接使用

#### process.env

是进程中的环境变量对象

- 在一般命令行声明
  > 表示`process.env.NODE_ENV=production`

```bash
NODE_ENV=production node build.js #linux
set NODE_ENV=production node build.js #windows
cross-env NODE_ENV=production node build.js #adapt all apply by `cross-env`
```

- 在 npm 中声明时
  > 表示`process.env.npm_config_project=testProject`

```bash
npm run serve --project=testProject
```

- 在`.env.[mode].local`文件中
  _local 表示被 git 忽略且出现在 .gitignore 中_
  > 表示当 mode 为 mode 时，设置文件下的环境变量

```bash
# .env.dev
# key=value
FOO=bar
VUE_APP_SECRET=secret # process.env.VUE_APP_SECRET = secret
```

```bash
vue-cli-service  serve --mode dev
```

> 可通过 webpack.DefinePlugin 在客户端侧代码中使用环境变量
> 例如在 vue-cli 中，集成的 webpack.DefinePlugin 在构建过程中，process.env.VUE*APP_SECRET 将会被相应的值所取代。在 VUE_APP_SECRET=secret 的情况下，它会被替换为 "secret"  
>*在 cli 中还包括 NODE*ENV 和 BASE_URL 这两个可以被编译在客户端的环境变量*

#### process.argv

表示启动 node 进程时在命令行中的参数数组

- 第一个参数为`process.execPath`路径，启动的 node 路径，一般为/usr/local/bin/node，该参数也为 process.argv0
- 第二个参数为 JavaScript 文件的路径
  > example

```js
// process-args.js
// 打印 process.argv。
process.argv.forEach((val, index) => {
  console.log(`${index}: ${val}`)
})
```

> cmd 命令

```cmd
node process-args.js one two=three four
```

> 输出如下

```cmd
0: /usr/local/bin/node
1: /Users/mjr/work/node/process-args.js
2: one
3: two=three
4: four
```

#### process.cwd()

表示 node 进程的工作路径，不包含执行文件，即执行文件的工作路径

### webpack devServer

#### after

after 接受一个以 express 实例(app)的参数的函数，在 proxy 后调用，通常用来做测试服务器

### python_class

```python
class Person:
    world = earth
    def __init__(self,lastname,firstname):
      self.lastname =lastname
      self.firstname=firstname

    def fullName(self):
      return '{} {}'.format(self.firstname,self.lastname)

    @classmethods
    def get_person(cls,nameString):
      first,last = nameString.split(',')
      return cls(last,first)

person1 = Person('scout')
person2 = Person('scout')

```

#### self

self 为实例对象,故 Person.fullName(person1)==person1.fullName()

#### class variable

world 为类变量,当访问实例中不存在则会找到该类中的变量

```python
Person.world== person1.world
person1.world = mars # person2.world ==earth
Person.world = mars # person2.world ==mars
```

#### classmethods staticmethods

- classmethods:接受 class 自身为参数的方法
- staticmethods:默认没有参数

### andriod 开发环境

#### jdk

#### andriod studio

## week 18

### \_\_dirname 和 ./

#### \_\_dirname

`__dirname`是被执行文件的绝对路径

#### ./

`./`是工作路径，即执行命令时(工作路径)的相对路径。

> 例如在`D:/a`下执行`D:/a/b/c.js`,此时`./`表示`D:/a`

_特殊情况_：`require('./)`表示该文件的相对路径

### node-stream

#### stream 是什么

stream 是 node 中的流类型，stream 来源于操作系统，操作系统在一些 IO 操作时为避免一次性处理大量数据导致*内存*的不足的问题而采用的流式处理模式，将数据在管道中处理并像水流一样流向目标。

![node-stream](https://user-gold-cdn.xitu.io/2019/7/10/16bdc4cdc5cdccc4?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

#### node 中的 stream 类型

- Readable Stream 可读数据流
- Writeable Stream 可写数据流
- Duplex Stream 双向数据流，可以同时读和写
- Transform Stream 转换数据流，可读可写，同时可以转换（处理）数据(不常用)

#### stream 用法

stream 使用的两个关键对象，source 对象和 destination 对象

案例参考：<https://juejin.im/post/5d25ce36f265da1ba84ab97a#heading-3>

> 大文件读写

```js
const fs = require("fs")
const path = require("path")

// 两个文件名
const fileName1 = path.resolve(__dirname, "data.txt")
const fileName2 = path.resolve(__dirname, "data-bak.txt")
// 读取文件的 stream 对象
const readStream = fs.createReadStream(fileName1) //source 对象
// 写入文件的 stream 对象
const writeStream = fs.createWriteStream(fileName2) // destination 对象
// 通过 pipe执行拷贝，数据流转
readStream.pipe(writeStream)
// 数据读取完成监听，即拷贝完成
readStream.on("end", function() {
  console.log("拷贝完成")
})
```

> 高频度网络请求

```js
/*
 * 微信生成二维码接口
 * params src 微信url / 其他图片请求链接
 * params localFilePath: 本地路径
 * params data: 微信请求参数
 * */
const downloadFile = async (src, localFilePath, data) => {
  try {
    const ws = fs.createWriteStream(localFilePath)
    return new Promise((resolve, reject) => {
      ws.on("finish", () => {
        resolve(localFilePath)
      })
      if (data) {
        request({
          method: "POST",
          uri: src,
          json: true,
          body: data,
        }).pipe(ws)
      } else {
        request(src).pipe(ws)
      }
    })
  } catch (e) {
    logger.error("wxdownloadFile error: ", e)
    throw e
  }
}
```

### 在 vscode 中写 python

#### 开启虚拟环境

安装`pipenv`虚拟环境

> pip install pipenv
> pipenv shell

#### 选择解释器

成功创建完虚拟环境后需要在 vscode 中指定改环境解释器

> cmd+shift+p; > python select interpreter

#### 在虚拟环境下安装依赖

> pipenv install \*\*

## week 19

### CallExpression||MemberExpression

> 词法分析
func() is a CallExpression
thing.func is a MemberExpression
thing is the object of the MemberExpression
func is the property of the MemberExpression
thing.func() is a MemberExpression within a CallExpression
thing.func is the callee of the CallExpression

### how to make a eslint plugin

the best way to create it is using cli to generator
`npm install -g yo generator-eslint`

#### create eslint plugin project module

`yo eslint:plugin`

#### create eslint rule file

`yo eslint:rule`

#### write rule file

rule example

```js
// lib/rules/ruleName
module.exports = {
  meta: {
    docs: {
      description: "setTimeout 第二个参数禁止是数字",
    },
    fixable: null, // 修复函数
  },
  // rule 核心
  create: function(context) {
    // 公共变量和函数应该在此定义
    return {
      // 返回事件钩子,一个对象key为触发钩子的语法类型,value为钩子的检测函数
      CallExpression: node => {
        if (node.callee.name !== "setTimeout") return // 不是定时器即过滤
        const timeNode = node.arguments && node.arguments[1] // 获取第二个参数
        if (!timeNode) return // 没有第二个参数
        // 检测报错第二个参数是数字 报错
        if (timeNode.type === "Literal" && typeof timeNode.value === "number") {
          context.report({
            node,
            message: "setTimeout第二个参数禁止是数字",
          })
        }
      },
    }
  },
}
```

> 语法类型，AST 对 js 代码类型的分类，包括 Program,\*Declaration,\*Expression,Identifier(变量名),\*Statement

#### plugin publish

> npm login ; npm publish

#### use plugin in project

> npm i eslint-plugin-yourPluginName

- method-1
  need write all of rules you want to add

```js
// .eslintrc.js
module.exports = {
  plugins: ["pluginName"],
  rules: {
    "pluginName/settimeout-no-number": "error",
  },
}
```

can straightly extend after config rule file

- method-2

```js
// lib/rules/index.js

var requireIndex = require("requireindex")
const output = {
  rules: requireIndex(__dirname + "/rules"), // 导出所有规则
  configs: {
    // 导出自定义规则 在项目中直接引用
    koroRule: {
      plugins: ["korolint"], // 引入插件
      rules: {
        // 开启规则
        "korolint/settimeout-no-number": "error",
      },
    },
  },
}
module.exports = output
```

#### add fix/format in plugin

```js
context.report({
  node,
  message: "setTimeout第二个参数禁止是数字",
  fix(fixer) {
    const numberValue = timeNode.value
    const statementString = `const countNumber1 = ${numberValue}\n`
    return [
      // 修改数字为变量 变量名故意写错 为了让用户去修改它
      fixer.replaceTextRange(node.arguments[1].range, "countNumber2"),
      // 在setTimeout之前增加一行声明变量的代码 用户自行修改变量名
      fixer.insertTextBeforeRange(node.range, statementString),
    ]
  },
})
```

### Differences between ESLint in different places

#### in npm module

it is a major engine of code checking

#### in vscode

it is a plugin to notify error in coding,given cmd tools and display of problems

#### in webpack

it is a loader to check code in compiling

### node 中的 sync 和 nonSync

#### io 计算默认为 async

当函数名中不写 sync 时，默认为异步操作

```js
fs.readdir(path, (err, files) => console.log(`async callBack`)) //异步操作需要写回调
console.log("done")

//output: done , async callBack
```

#### 后缀加 Sync 转为同步

```js
const files = fs.readdirSync(path) //同步操作不需要写回调
console.log(files)
console.log("done")

//output: files , done
```

### Etag 和 Last-Modified

#### 相同点

都是属于协商缓存的验证器,都属于后端生成，需要请求服务端判断。

> 协商缓存请求经过服务端判断，若满足缓存条件返回`304`；  
> 强缓存则是不发送请求直接采用本地的 cache，响应码为`200(from disk cache || from memory cache)`,强缓存通过设置两种 HTTP Header 实现：`Expires`（HTTP/1，无法确定客户端的时间是否与服务端的时间同步） 和 `Cache-Control`(HTTP/1.1)。

#### 不同点

> ETag: W/"<etag_value>" // 'W/'(大小写敏感) 表示使用弱验证器。
> ETag: "<etag_value>"

Etag is an identifier for a specific version of a resource , 资源的版本标识符，通常是返回内容的散列
请求时通过 `if-match||if-none-match`来判断，服务器仅在请求的资源满足此首部列出的 ETag 值时才会返回资源。而对于 PUT 或其他非安全方法来说，只有在满足条件的情况下才可以将资源上传。

- `if-match`
  通常用来防止`空中碰撞`，若 put 时的请求 Etag 和服务端的 Etag 一致则 put 成功，否则返回 412

- `if-none-match`
  通常用来缓存资源,当 get 时的 Etag 和服务端的 Etag 不一致则会重新返回，否则 304  
  也可通过`if-none-match:*`来防止多次 put

> Last-Modified: <day-name>, <day> <month> <year> <hour>:<minute>:<second> GMT

Last-Modified is the date and time at which the origin server believes the resource was last modified,资源上次修改的时间
请求时通过`If-Modified-Since`来判断

\*_Last-Modified 是以时间来判断，但是其能精确到 second,所以当版本的变化小于 second 时则无法成功判断，所以这时可以使用 Etag_

### commonJs 模块和 ES6 模块

> 这里的 commonJs 指 node 中的模块使用方式，ES6 指浏览器中的最新的模块使用方式

#### 加载原理

- CommonJS 模块是运行时加载,在没有被执行完之前，它的结构（API）是不可知的 — 即使在它被执行完以后，它的结构也可以随时被其他代码修改
- ES6 模块会根据 import 被编译成接口接入入口文件，只是一个“符号连接”，解析的时候不会执行

#### 输出差异

- CommonJS 模块输出的是一个值的拷贝(类似 return 后的结果)。只能同步加载
- ES6 模块输出的是值的引用,原始值变了，import 加载的值也会跟着变。可异步加载

### d.ts

d 就是 declare,是类型声明文件，通过该文件赋予*编辑器*类型提示与检查的能力

### UMD 模块( (Universal Module Definition))

UMD 模块是指那些既可以作为模块使用（通过导入）又可以作为全局（在没有模块加载器的环境里）使用的模块。

#### 兼容使用

模块导入

```js
const moment = require("moment")
```

全局使用(直接在浏览器环境下)

```html
<script  src="./moment">
const date = moment()
```

### 实现原理

```js
(function (root, factory) {
    if (typeof define === "function" && define.amd) { //
        define(["libName"], factory); // AMD , always in some older browser code
    } else if (typeof module === "object" && module.exports) {
        module.exports = factory(); // CommonJS,always for Node.js
    } else { // root context,always window
        root.libName = factory();
    }
}(this, function (b) {
```

> 如今，作为一个完备的库，除上面的几种模块外，一般还需要支持 ESM（ECMA Script Modules，ES6）模块的导入，通常单独用`*.esm.js`文件提供支持（以 export default \* 导出）

### 处理器架构

## week 20

### js 中数字类型

#### 整型

- 组成，2 段
  - sign: 符号位，占 1 位；
  - fraction: 有效数字位。占 31 位
    共 32 位，最左位为符号，表达式为(-1)^32bin\*(31~1)bin

#### 浮点型

- 组成，3 段
  - sign: 符号位，占 1 位；
  - exponent: 指数位，占 11 位；
  - fraction: 有效数字位，占 52 位。
    共 64 位，最左位为符号，

## week 21

### 多客户的版本管理

目的：抛砖引玉，解决复杂的交付问题

初步想法：每个客户建立一个专门发版的分支 Pro:每个用户都能独立的管理 tran:当用户量增大后会加大重复性的工作量

- _发版/交付 完成的钩子_

#### 配置解耦

将功能逻辑和不同的客户配置分离

- 配置同一存入云端管理
- 为方便开发与避免云端配置失效的情况，每次打包时(可选)同步一次云端文件至本地
- 客户配置被分离后就可以将其单独做一个客户配置的管理来更好的追踪每个客户的版本信息

#### 发版统计

创建易于重现和可跟踪的环境

- 统计发版的功能信息(业务代码)与客户信息(用户配置)

## week 22

### package 中的~与^

#### npm 包一个版本存在三位

例如，'example':'1.2.3'。 1 是大版本号，2 是次要版本号，3 是小版本号

#### ~

'example':'~1.2.3'
~表示指下载最新的小版本，即 1.2 不变

#### ^

'example':'^1.2.3'
^表示指下载最新的次要版本，即 1 不变

### 用 graphQL 获取客户部署数据

#### _todo_

### 第三方授权流程

#### 产品申请第三方授权

将自己产品的 url 或 appId 注册在第三方

#### 用户点击授权链接获取 token

用户请求由第三方规定的申请接口，用户成功登录第三方并确定授权后，返回 token

> `token`一般附在确定授权后的重定向的`url`的 param 上

#### 后台根据 token 获取用户信息

用于安全因素，根据 token 获取用户信息的接口不允许跨域，需要返回给后端去调用获取

#### 后台存储用户信息

一般第三方返回的信息存在唯一 id，后台可根据此 id 作为主键建立表保证用户信息持久化

### RN

#### emulator

> android
> ADV

> ios

#### v-dom tag(components)

all in react-native

> view
> similar to div

> text
> for font

#### css

> flexbox
> default col direction

> styleSheet
> create css object

- no unit

#### spec components

> TouchableOpacity
> opacity wrapper

## week 23

### monogdb 迁移

#### 连接远端

#### dump 数据至指定数据

> mongodump --host="mongodb0.example.com" --port=27017 --out=/opt/backup/mongodump-2020-02-3 [additional options]

或

> mongodump --uri="mongodb+srv://name:password@music-6epxh.mongodb.net/db?retryWrites=true&w=majority" --port=27017 --out=/opt/backup/mongodump-2020-02-3 [additional options]

可将数据转成 2 进制文件

#### restore dump 文件

> mongorestore [options][\<directory>/\<bson file>]

恢复指定文件夹下的 dump 二进制文件至数据库，其操作会自动创建 database 和 collection

### schema 和 model

#### schema

schema(`ˈskiːmə`)是 database 关系的模式，主要表示*关系*

#### model

在 mongo 中表示一个 collection 的模型，其定义由其 schema 关系确定

### file-loader 和 url-loader 和 image-loader

#### 作用

- file-loader，将项目中定义加载的文件通过 webpack 编译打包，并返回一个编码后的公共的 url 路径。

- url-loader，将小图片编码为 base64，返回 base64 码，减少网络请求，优化 performance。

- image-webpack-loader,压缩图片

#### 联合使用

```js

// webpack.config.js
...
 module: {
        rules: [
          ...
         {
            test: /\.(png|jpe?g|gif|svg)$/i,
            exclude: /node_modules/,
            use: [{
                loader: 'url-loader',
                options: {
                    limit: 10240, // 是否编码图片的阈值
                    fallback: {  // 大于阈值的回调
                      loader: 'file-loader',
                      options: {
                        name: '[name].[hash:8].[ext]', // 文件名字，可以加入path
                        publicPath:String //部署路径,最终与name合并成导出的路径（代码中引用路径），为空则是全局的publicPath值
                        outputPath:String  //文件存储的路径，为空则是全局的outputPath的值
                        useRelativePath:Boolean //   outputPath是否为相对于static(静态文件夹，可能为assets)的路径
                      }
                    }
                }
            }, {
                loader: 'image-webpack-loader',//新增image-webpack-loader
                options: {
                    mozjpeg: {//设置对jpg格式的图片压缩的程度设置
                        progressive: true,
                        quality: 65
                    },
                }
            }]
          }
        ]
    }

...

```

> 由于 loader 为注册后栈式调用，所以先经过 image-webpack-loader 压缩图片后，再由 url-loader 处理，若图片大于 limit 则由 file-loader`emitfile`并返回引用路径

### todo 3.20

- 实现一个 webpack 插件，tinyIMG

- 实现一个 eslint 插件,除去 console.log

- 实践 FaaS

### node 的事件循环与异步 IO

> 参考：[https://nodejs.org/zh-cn/docs/guides/event-loop-timers-and-nexttick/](https://nodejs.org/zh-cn/docs/guides/event-loop-timers-and-nexttick/)

#### node 真的是单线程吗

可以说是，但也不是。node 被称为单线程，是因为以`v8`引擎的`js`为主线程（main thread）调度所有运行，但是其真正运行`I/O`时会调用由`c++`执行的线程池，该线程池默认设置 4 个线程

> 线程由物理 cpu 核心决定，但是一个 cpu 核心可以通过抢占式多任务模式(preemptive multitasking,暂停一个，开启另一个)同时分配几个线程

- processes 和 threads

| processes                   | threads            |
| --------------------------- | ------------------ |
| 顶级执行容器                | 运行在一个进程     |
| 通过 ipc 相互通信，存在限制 | 容易通信，共享变量 |
| 分割内存空间                | 分享同一个内存     |

- 架构

#### node event loop

> 事件循环是 Node.js 处理非阻塞 I/O 操作的机制——尽管 JavaScript 是单线程处理的——当有可能的时候，它们会把操作转移到系统内核中去。  
> 既然目前大多数内核都是多线程的，它们可在后台处理多种操作。当其中的一个操作完成的时候，内核通知 Node.js 将适合的回调函数添加到*轮询队列*中等待时机执行。

node 内核每次进行一次以下的阶段循环：

- 定时器：本阶段执行已经被 setTimeout() 和 setInterval() 的调度回调函数。
- 待定回调：执行延迟到下一个循环迭代的 I/O 回调。
- idle, prepare：仅系统内部使用。
- 轮询（等待I/O）：检索新的 I/O 事件;执行与 I/O 相关的回调（几乎所有情况下，除了关闭的回调函数，那些由计时器和 setImmediate() 调度的之外），其余情况 node 将在适当的时候在此阻塞。
  > 轮询的时间由最近的`timer`决定，例如有一个`setTimeout(fn,1000)`，那么轮询阶段持续的时间至少有 1000ms
- 检测：setImmediate() 回调函数在这里执行。  
  _使用 setImmediate() 相对于 setTimeout() 的主要优势是，如果 setImmediate()是在 `I/O` 周期内被调度的，那它将会在其中任何的定时器之前执行，跟这里存在多少个定时器无关_
- 关闭的回调函数：一些关闭的回调函数，如：socket.on('close', ...)。  
  ~~_其余的 close 回调由`process.nextTick()`执行，`process.nextTick`在脚本运行完毕,事件循环开始前执行。因此`process.nextTick()`快于`setImmediate()`的执行_~~

> `process.nextTick`也经常在 node 事件循环中提到，但它实际上并不属于事件循环的任一阶段，它会在所处的任一阶段结束后立即执行，所以比`I/O`事件中的`setImmediate`还要先执行。

## week 24

### 点聚合

### node 多进程

<https://www.jb51.net/article/148997.html>

### 函数式、响应式和面对对象

> 都是为了更好的代码编写与维护而慢慢形成的成熟的编程思想，当然也有专门以这种思想设计出来的语言

#### 函数式

强调使用函数来解决问题，函数与数据分开

##### 特点

- 声明式(declarative)。抽象模式，封装动作
- 纯函数(Pure Functions)
- 数据不可变(immutability)。不改变数据，而是产生新的数据

### 响应式

一般在函数式的基础上，以数据驱动(数据流)动作(函数)

### 面对对象

根据应用的功能主观将数据和动作封装在一起，一个有状态有属性的类

#### 特点

- 对象唯一性，每个由类生成的实例都有唯一的标识
- 抽象性，抽象性是指将具有一致的数据结构（属性）和动作（操作）的对象抽象成类。一个类就是这样一种抽象，它反映了与应用有关的重要性质
  > 需要实例化
- 继承性，类之间的属性与动作可以继承
- 多态性，类的多样性
  > 同一方法名不同的实现

### js 中的逗号运算符

#### 逗号不做运算符的两种情况

- 函数参数
- 声明变量

#### 作用与特性

逗号运算符的作用是将若干表达式连接起来。它的优先级别在所有运算符中是最低的，结合方向是"自左至右"的，返回最后一个表达式的结果

- 自左至右

```js
let a, b

a = ((b = 5), 5 * 2) //x3的值为整个逗号表达式的值， z3的值为5
console.log(a) //10
console.log(b) //5
```

- `=`优先级别最低

```js
var a = 20;
var b = ++a,10;
alert(b);
```

> _报错_,因为先执行了变量声明，逗号运算符不能用作变量声明

```js
var a = 20
var b = (++a, 10)
alert(b)
```

> 返回 10，使用括号,令其优先执行

## week 25

### 当 webpack 加载到含有变量的引用

```js
const directoryName = require("./directoryName") // {a:'a',b:'b',c:'c'}
const img = require(`/static/${directoryName.a}/nonexistent.png`)
```

与

```js
const img = require(`/static/a/nonexistent.png`)
```

#### 为什么第一个不会报错，第二个能报错

看看打包后的代码

第一个

```js
(function(module, exports, __webpack_require__) {

"use strict";


var img = !(function webpackMissingModule() { var e = new Error("Cannot find module \"../../assets\""); e.code = 'MODULE_NOT_FOUND'; throw e; }());

module.exports = {
  img: img
};

/***/ }),
```

第二个直接打包错误，当然没有代码 😅

再看看存在变量且资源存在时

```js
(function(module, exports, __webpack_require__) {

var map = {
 "./a/existent.png": 432,
 "./b/existent.png": 433,
};
function webpackContext(req) {
 return __webpack_require__(webpackContextResolve(req));
};
function webpackContextResolve(req) {
 var id = map[req];
 if(!(id + 1)) // check for number or string
  throw new Error("Cannot find module '" + req + "'.");
 return id;
};
webpackContext.keys = function webpackContextKeys() {
 return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = 418;

/***/ }),
/* 419 */,
/* 420 */,
/* 421 */,
/* 422 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var img = __webpack_require__(418)("./" + process.config.npm_config_env + "/img/existent.png");

/***/ }),
```

#### 模块引用策略

根据上面打包完的结果总结一下模块处理引用策略

- 不存在变量  
  不做处理，资源不存在则 exit,存在则被 loader 处理(loader 处理前该代码可能会被 plugin 编译)

- 存在变量

  - 存在满足的文件  
    匹配所有满足`./.*/img/existent.png`的文件，生成一个返回包含文件 map 的`webpackContext`的对象的`module`  
    其 map 中的 module 会被 loader 处理后分别存储并生成 moduleId，通过`__webpack_require__(418)('./a/existent.png')`动态引用

  - 若没有满足的文件
    其引用返回 webpackMissingModule 函数

> 若变量为node中的变量时会直接取值，如`process.env.NODE_ENV`

### ArrayBuffer 和 TypedArray 和 DataView 和 Blob

#### ArrayBuffer

字节数组  
ArrayBuffer 是存储二级制数据的 byte array,一个 byte 为一个 item，无法直接读写

> 来表示通用的、固定长度的原始二进制数据缓冲区 ---MDN

```js
// 创建一个8字节的ArrayBuffer,buf是其array头指针
const buf = new ArrayBuffer(8)
```

#### TypedArray

类型数组对象
TypedArray 类型数组固定长度缓冲区类型,是 ArrayBuffer`特殊格式化`后的的一个类数组视图（view），可以用其特定的格式读写缓冲区内容,每一项都是相同的大小和类型

```js
const typedArray = new Int16Array(typedArray||buffer||length||object,byteOffset?, length?)

// 创建一个16/8 * 8 字节的typedArray1
const typedArray1 = new Int16Array(8)

// 创建一个16/8 * 8 字节的,长度为4的typedArray2
const typedArray2 = new Int32Array(typedArray1)

//以32bit integer的格式插入42到typedArray2的第二项
typedArray2[1] = 42;

```

#### DataView

DataView 视图是一个可以从 二进制 ArrayBuffer 对象中读写多种数值类型的底层接口， 默认为大端序,可自定义字节序

> 关于字节序  
> 字节序是多字节数据其每个字节存入内存顺序，分为小端字节序（从低位开始存）与大端字节序（从高位开始存）  
> 不同的硬件、机器和环境读取，目前大多数系统都是小端的，所以选择小端字节序这是合情合理的。 当数据采用系统消耗型的格式时，我们能够获得最佳性能，因为我们的数据不需要在可以处理之前进行转换（例如通过 GPU、通过 WebGL 处理）  
> DataView 大端序的默认值正是因为大端序常用于网络传输（有时称为“网络端序”）。 如果数据被流化，则可以仅通过在下一个存储器位置处添加输入数据来组合数据。例如一个 12 和 34，小端序流化时需 `_ 1` => `2 1` =>`2 1 _ 3`不能直接顺序组合

#### Blob

Blob 对象表示一个不可变、原始数据的 MIME 类型文件对象,可由 ArrayBuffer, ArrayBufferView, Blob, DOMString 等对象创建而成

```js
new Blob(array:ArrayBuffer|| ArrayBufferView||Blob|| DOMString,options?:{type:String})

var debug = {hello: "world"};
//  序列化创建一个json类型文件
var blob = new Blob([JSON.stringify(debug, null, 2)], {type : 'application/json'}); 

```

#### 总结

- ArrayBuffer 用于保存、创建给定数量的原始二进制数据的数据结构，需要 TypedArray 和 DataView 提供视图读写

- TypedArray 使用系统的端序，提供一种方法来组合二进制数据以便在同一系统上使用，
  例如 Canvas2D ImageData 或 WebGL。

- DataView 可自定义字节序，默认为大端序，在用于序列化和反序列化二进制数据以用于传输

## week 26

### 删除 git 大文件记录

git 会存储所有的文件提交修改记录，无论是添加还是删除，其一直存在引用，该文件就会永久存储，这样就会导致废弃的大文件将永远占据仓库的大量存储空间，影响仓库的下载。  
可以根据 git 命令找出大文件，然后删除所有该文件的记录，最后强制推至远端

#### 获取大文件排序

```bash
git rev-list --all | xargs -rL1 git ls-tree -r --long | sort -uk3 | sort -rnk4 | head -10
```

#### 重写 git 中所有存在该大文件的提交记录

丢弃大文件的引用，令其被垃圾回收

```bash
git filter-branch --force --index-filter 'git rm -rf --cached --ignore-unmatch target_file' --prune-empty --tag-name-filter cat -- --all
```

#### 改动强推至远端仓库

```bash
git push -f --all
```

### dpr

`dpr`全称`device pixel ratio`,设备像素比。  
设备像素比 = 物理像素 / 逻辑像素(px) (1次单位)

#### 物理像素

`physical pixel`  
一个物理像素是显示器(手机屏幕)上最小的物理显示单元（像素颗粒），在`操作系统`的调度下，每一个设备像素都有自己的颜色值和亮度值。

如：iPhone6 上就有 750\*1334 个物理像素颗粒。

#### 逻辑像素

也叫设备独立像素(`density-independent pixel`)  
可以认为是计算机坐标系统中得一个点，这个点代表一个可以由`程序`使用的虚拟像素(比如: css 像素)

> 调节设备的分辨率其实就是改变其设备独立像素，例如把 4K（3840x2160）的物理像素改变其分辨率为 1K（1920x1080），其`dpr`将变为 2，每 1px \* 1px 的背后则是 4 个物理像素的绘制

#### dpr 意味着什么

越高的 dpr,代表在显示相同尺寸的逻辑像素时，能够有更多的像素颗粒来呈现出更细腻的视觉效果。

> 当然前提是该位图自身提供了足够的清晰度，因此为了让高 dpr 的设备享受到高清的图片且不让低 dpr 设备产生格外的流量负荷，通常会根据不同的 dpr 令其下载不同的清晰度的图片

### Object.prototype.toString.call() 与 instanceof

两种都是用来检测类型的方法，但他们的应用范围、精确度不一样

#### Object.prototype.toString

在原型上直接挂载的方法,返回`[object Type]`,`Type`为其构造函数的名称。  
应用范围最广、最精确,故判断类型时应首选该方法

#### instanceof

a instanceof A,判断 A 的`prototype`是否在 a 的`_proto_`上  
依赖于双方的`prototype`和`_proto_`,故在不同的`globals`（例如在 iframe 中）创建的实例不能被共用`instanceof`，且只能判断引用类型。

> 因为`globals`导致`instanceof`不能判断`iframe`上的`Array`问题，于是有了 Array.isArray 的方法，其不被`globals`影响

## week 27

### todo

<!-- - perf the effect of note modal -->

- 多线程安全

### vuex 与 redux 存在的意义

两者都是中心化状态管理的方案，其中两个关键词就是 _中心化_ 和 _状态_

#### 状态管理

在 react 和 vue 这种 MVVM 框架中，数据驱动着整个应用，因此要管理好应用的状态就是需要管理其数据，vuex 和 redux 将关键性的状态数据集中定义管理

#### 中心化

- redux
  dispatch(action) => reducer(type)

- vuex
  dispatch(action) => commit(mutation)

本质都是通过订阅发布的方式，对数据的*操作进行封装*，并使其*统一*流向一个 reducer，达到中心化管理的目的

### vuex 的实现

#### 响应式 store 数据

通过`defineReaction`使 store 数据响应化，使其可以收集依赖，数据变化时 update 依赖

#### 保证单项数据流

通过`isMutation`限制非 commit 的数据变化

### The key of git flow

! _a great strategy of git workflow_

- A develop branch is created from master
- A release branch is created from develop
- Feature branches are created from develop
- When a feature is complete it is merged into the develop branch
- When the release branch is done it is merged into develop and master
- If an issue in master is detected a hotfix branch is created from master
- Once the hotfix is complete it is merged to both develop and master

### 数据库聚合操作

聚合操作是指在表(或 collection)内直接对数据进行某种规则的整合与输出,这些操作通常会用到很多 stage 与 operator。

> 聚合操作通常有很多 stage，其中存在规定的执行顺序

```sql
(8) SELECT (9)DISTINCT<Select_list>
(1) FROM <left_table> (3) <join_type>JOIN<right_table>
(2) ON<join_condition>
(4) WHERE<where_condition>
(5) GROUP BY<group_by_list>
(6) WITH {CUBE|ROLLUP}
(7) HAVING<having_condtion>
(10) ORDER BY<order_by_list>
(11) LIMIT<limit_number>
```

#### 基本用法

累加 orders 表中所有条目的 price 并作为 total 字段返回

- sql

```sql
SELECT SUM(price) AS total
FROM orders
```

- mongo

```js
db.orders.aggregate([
  {
    $group: {
      _id: null,
      total: { $sum: "$price" },
    },
  },
])
```

以 orders 表中的 cust_id 字段分类，分别累加 price 并作为 total 字段，最后根据其 total 排序后返回

- sql

```sql
SELECT cust_id,
       SUM(price) AS total
FROM orders
GROUP BY cust_id
ORDER BY total
```

- mongo

```js
db.orders.aggregate([
  {
    $group: {
      _id: null,
      total: { $sum: "$price" },
    },
  },
])
```

以 orders 表中的 cust_id 字段分类，分别累加 price 并作为 total 字段，最后根据其 total 排序后返回

- sql

```sql
SELECT cust_id,
       SUM(price) AS total
FROM orders
GROUP BY cust_id
ORDER BY total
```

- mongo

```js
db.orders.aggregate([
  {
    $group: {
      _id: "$cust_id",
      total: { $sum: "$price" },
    },
  },
  {
    sort: {
      total: 1,
    },
  },
])
```

取 publish_snapshot 表中 env 为`prod`的数据，并以 projectName 字段分类，最后取各类的后三条

- mongo

```js
db.publish_snapshot.aggregate([
  { $match: { env: "prod" } },
  { $group: { _id: "$projectName", logs: { $push: "$$ROOT" } } },
  { $project: { _id: 1, log: { $slice: ["$logs", -3] } } },
])
```

### 事件驱动和消息驱动

todo

## week 28

### CORS

CORS （Cross-Origin Resource Sharing，跨域资源共享）是一个系统，它由一系列传输的 HTTP 头组成，这些 HTTP 头决定浏览器是否阻止前端 JavaScript 代码获取跨域请求的响应。

同源安全策略 默认阻止“跨域”获取资源。但是 CORS 给了 web 服务器这样的权限，即服务器可以选择，允许跨域请求访问到它们的资源。

#### 脚本内的请求才会有同源限制

XHR,fetch

#### 服务端设置是否允许跨域

服务端需要设置响应头来告知浏览器自己的跨域规则

- `Access-Control-Allow-Origin`  
  允许请求的来源域名

- `Access-Control-Expose-Headers`
- `Access-Control-Max-Age`
- `Access-Control-Allow-Credentials`  
  是否允许`Credentials`,`Credentials`可以是 cookies, authorization headers 或 TLS client certificates。需要和 XMLHttpRequest.withCredentials 或 Fetch API 中的 Request() 构造器中的 credentials 选项结合使用

- `Access-Control-Allow-Methods`  
  允许请求的方法，`GET`,`PUT`等

- `Access-Control-Allow-Headers`  
  允许请求头的字段，`content-type`,`authorization`等

#### 浏览器做最终限制

浏览器根据返回的响应头中的`Access-Control-Allow-Origin`,`Access-Control-Allow-Methods`等字段是否匹配请求来决定获取资源

- 简单请求
  `GET`，`POST`,`HEAD`等直接请求后根据响应头判断。（注：当`content-type`为`application/json`时，浏览器会把它当作复杂请求）

  > 这种情况无论是否满足跨域服务端都会返回应返回的数据

- 复杂请求
  `PUT`,`PATCH`,`DELETE`等会对服务器数据造成更改的，会首先发送一个预发请求，若预发的响应头满足此次请求，则再发送。
  > 这种情况不满足跨域则服务端没有响应数据，因为根据`OPTIONS`的响应拦截了改请求。

### timing breakdown of a request

![requestTiming](../images/request_timing.png)

浏览器发出请求到完成可以被分解成几个阶段

#### Queueing

浏览器首先对请求进行列队处理

- There are higher priority requests.
- There are already six TCP connections open for this origin, which is the - limit. Applies to HTTP/1.0 and HTTP/1.1 only.

> HTTP1.0/1.1 只能同时开启 6 个 TCP 连接，故同时大于 6 个请求就需要列队，其中 1.0 每次请求都要重新建立 TCP 连接，1.1 通过`Keep live`可以保持 TCP 连接一直开启，直到用户主动关闭，当然在同一个 TCP 连接中也需要列队，并且请求的返回也要按此列队顺序返回。在 HTTP2.0 中则可以多路复用，同一个域名下，开启一个 TCP 的 connection，每个请求以 stream 的方式传输，每个 stream 有唯一标识，connection 一旦建立，后续的请求都可以复用这个 connection 并且可以同时发送，server 端可以根据 stream 的唯一标识来相应对应的请求。

- The browser is briefly allocating space in the disk cache

#### stalled

请求等待队列

#### Proxy negotiation

调用代理 _(if necessary)_

#### DNS Lookup

浏览器去 DNS 服务器解析到域名 ip 地址

#### Request sent

发送请求

#### ServieWorker Preparation

浏览器启动`servie Worker`_(if necessary)_

#### Request to ServieWorker

请求发送到`servie Worker`_(if necessary)_

#### Waiting(TTFB)

等待接受到服务器返回的第一个字节的时间(Time To First Byte),包括传输和服务器处理的时间

#### Content Download

下载返回的数据

## week 29

### 关于 JWT

`jwt` json web token. 一个已 json 对象形式独立且紧凑的在双方安全传输信息的方式的开放标准 (RFC 7519)

#### JWT 可以被用于信息加密吗

不行。JWT 虽然涉及到算法加密，但这个算法只单独生成 Signature，jwt 的`payload`部分只用了 base64 编码压缩,Signature 的作用只是为了通过能否正确的解密来保证数据的完整性。所以就像 jwt 定义一样，只保证信息安全可靠不被更改，其中不宜传输隐私信息。

```js
HMACSHA256(base64UrlEncode(header) + "." + base64UrlEncode(payload), secret)
```

> 可以使用`secret`（使用 HMAC 算法）或使用 RSA 或 ECDSA 的公用/专用密钥对对 JWT 进行签名
> HMAC（Hash message authentication codes）的签名是通过把返回的`header`与`payload`用同一`secret`生成 hash 值，再与返回的`signature`对比，来验证数据是否被修改。  
> RSA 或 ECDSA 的签名则是通过公钥解密来验证来源

#### JWT 最佳实践是怎样

- 鉴权
  服务端返回 JWT 作为用户登录的凭证
- 信息交换
  用户端

### requestAnimationFrame 是最极致的节流

requestAnimationFrame 在每一次设备渲染前(一般为 60hz)才执行，保证更改 DOM 的脚本每一次执行都能在界面生效，也避免了不能生效(执行*渲染*)脚本的执行（若两次执行间隔小于设备的渲染极限则后一次将不会生效）

#### example

```js
let last_known_scroll_position = 0
let ticking = false

function doSomething(scroll_pos) {
  // 根据滚动位置做的事
}

window.addEventListener("scroll", function(e) {
  last_known_scroll_position = window.scrollY

  if (!ticking) {
    window.requestAnimationFrame(function() {
      doSomething(last_known_scroll_position)
      ticking = false
    })

    ticking = true
  }
})
```

> BTW resize 和 scroll 事件其实自带节流，因为它只在 Event Loop 的渲染阶段（[该阶段涉及对是否绘制的判断)](https://html.spec.whatwg.org/multipage/webappapis.html#update-the-rendering)去派发事件到 EventTarget 上。

### 抽离与冗余

将复用的代码进行抽离毫无疑问是个优秀的习惯，这样可以移除重复的代码，减少了代码的体积，美化了代码结构。所以我们需要任何时候都要对重复的逻辑、代码、资源进行抽离吗？先看看我们做抽离的代价是什么

#### 抽离的代价

- 花时间思考归纳出恰好能复用的逻辑

- 分散复用的代码、资源。通常会把多文件复用的代码分配到一个新建的文件中，可能导致多一个网络请求

- 为了保证提取的代码被高效利用，之后的写代码的逻辑将被抽离的逻辑限制

#### 合理的冗余

我们在决定抽离与冗余需要做出一些权衡，必要时候合理的冗余

- 若抽离的代码复用率低，且影响了代码可读性，不应抽离

- 若抽取的代码涉及到其他逻辑的依赖，并因此在进行复用时影响原本的思路，不应抽离

- 若增加的请求耗时大于减少的体积所加载的时间，不应抽离

### 在绘制之前拿到节点的 Layout

js 脚本执行中若调用了读写 dom 的接口，可能会触发渲染引擎计算当前 dom 的 layout,所以可以在页面渲染（指包括绘制的完整流程）之前获取到最新的 dom 的 layout 信息

## week 30

### 小程序发版记录方案

#### 打包记录 log

每一次打包都记录其 log 至小程序的 console 中

#### 上传记录 log

每次上传需将 console 中的 log 记录到版本备注中

#### 后台发版后触发上传

利用扩展程序在发版成功后触发上传 log 的请求

### sha-1 与 hash

#### hash

hash 是散列的英文，hash 在编程中指的就是一种将数据打散揉碎重新排列的思想，一般会生成为一个不可逆较小的数据。

hash 算法在应用上一般会有以下特点：

- 正像快速：原始数据可以快速计算出哈希值
- 逆向困难：通过哈希值基本不可能推导出原始数据
- 输入敏感：原始数据只要有一点变动，得到的哈希值差别很大
- 冲突避免：很难找到不同的原始数据得到相同的哈希值

哈希算法主要用来保障数据真实性(即完整性)，即发信人将原始消息和哈希值一起发送，收信人通过相同的哈希函数来校验原始数据是否真实

#### sha-1

sha-1 是 hash 算法中的一种实现，git 的 hash 就是使用这种算法。

> 除此之外，还有 MD5、SHA1、HMAC 散列算法

### 后端分层

todo

### reflect and annotation

#### reflect

反射，动态实例化

```java

Class cls = Class.forName(classStr);
```

#### reflect in js

解放Object的一些对自身进行操作的方法，直接使用Reflect来专门在js运行时操作对象

### IOC

#### what is IOC

IOC 是一种设计思想,将服务的依赖的控制权放在外部

#### why use IOC

依赖与服务解耦，依赖可以灵活注入（DP）

#### how it work

实现一个 IOC，需要几个关键的东西

- 服务自身
- 准备好的依赖。其实例会被注入到服务中
- 存储依赖的容器。确保存储的依赖都是可以被注入到服务中

<!-- TODO TS实现DEMO -->

## week 31

### SQL vs NoSQL

#### Differences

- scheam
- relation
- scaling

#### relate

You can use both within the org. There are times when you normalize data and denormalize data. Simple example is the user address at the time of shipment. Sure you keep the current and historical address, but when transaction happens you may benefit from denormalization of the full address instead of doing the joins. Data is duplicated but it may be more efficient if it is referenced many times in reports or in olap or data marts and you need point in time data.  
Another best of both worlds is for logging or batches from external sources where it is acceptable to be in a temporary denormalized state during periods of high activity to later run through a process that will insert, update, delete data. So for example in a bulk tranfser you validate the data with your business rules and if valid assign an Id and basic data or summary data then offload the remaining to a noSQL DB to be normalized then inserted at a later time so your Normalized OLTP/server app doesn't get a performance hit when it writes a few hundred thousand records of a single transaction that locks all related normalized tables on a insert/update lock. Let's not forget that this also ties up the database log as well as any related indexes if any that are in the tables that may get hit. After the records get normalized into sql the nosql data can be archived, kept, moved or deleted after the OLTP and/or replication and data recovery databases have the normalized data or it could be used for related activities like elasticsearch, audits or in cases.

### WeakMap and WeakSet

#### why do we need weak

because of the values of Map and Set store in a array,reference type value can not be garbage collected immediately,it will lead to memory leak.

#### Garbage Collection in javascript

在 V8 中，每次 GC 时，是根据 root 对象 (浏览器环境下的 window，Node.js 环境下的 global ) 依次梳理对象的引用，如果能从 root 的引用链到达访问，V8 就会将其标记为可到达对象，反之为不可到达对象。被标记为不可到达对象（即无引用的对象）后就会被 V8 回收

> 只要堆内存的地址存在引用，无论引用在堆内存还是栈内存都不会被垃圾回收

```js
let john = { name: "John" }

// 该对象能被访问，john 是它的引用

// 覆盖引用
john = null

// 该对象将会被从内存中清除
```

```js
let john = { name: "John" } // ==> john'value is a RAM_LOCATION

let array = [john] // ==> {0:RAM_LOCATION}

john = null // 覆盖引用

// john 被存储在数组里, 所以它不会被垃圾回收机制回收
// 我们可以通过 array[0] 来获取它
```

> 常导致内存泄漏的情况：
>
> - root 上挂载过多对象。直接在全局声明的对象，不会被 GC，导致内存泄漏
> - 闭包过多。闭包会引用到父级函数中的变量，如果闭包未释放，就会导致内存泄漏

#### how does weakMap work

1. key only be object
2. key cannot be enumerated

> weakMap doesn't use two arrays to store key and value , it set key as a property likes a object,so when key is deleted,the value is no longer referenced

## week 32

### typescript 中的 class

typescript 中的 class 是 es6 中的 class 的超集，基于 typescript 新增了一些特性,我们声明的一个 ts class，会创建一个实例类型(`type`)和一个构造函数(`value`)

> ts class 创建的类型是实例的类型，若想使用其构造函数的类型，可用`typeof`
>
> ```ts
> let GreeterOne: typeof Greeter = Greeter
> let greeter: Greeter = new GreeterOne()
> ```

```ts
class Greeter {
  greeting: string
  private name: string
  protected age: number
  readonly id: number
  constructor(message: string) {
    this.greeting = message
  }
  greet() {
    return "Hello, " + this.greeting
  }
}
const greeter = new Greeter()
greeter.name // error
greeter.age //error
greeter.id = 911 // error
```

#### 属性需要类型声明

#### 默认属性、方法和构造器为 public

#### 存在私有与受保护修饰符

被`private`和`protected`修饰的属性、方法无法被外部直接访问。

> 它们的区别是被继承的`protected`属性的实例可以访问，且构造函数也可以被标记成 protected，故构造器被 protect 的类自身不能实例化，但是继承它的类可以实例化 。
> 其实 private 只是提供 ts 编译时的检测，但实际上在 js 中还是可以访问。但如果用`#someProperty`，就能实现真正的私有，其原理是通过独立创建了一个`weakMap`来保存

#### readonly 修饰符

被 `readonly`修饰的，只读不能赋值

#### 参数属性

参数属性可以通过一个访问限定符(`public`,`protected`,`private`,`readonly`)方便地让我们在构造器的形参上初始化属性

#### 存储器

只带有 get 不带有 set 的存取器自动被推断为 readonly

#### 抽象类

抽象类可以作为某种类的基类，其定义这种类的所有方法，通过`abstract`修饰符可以不用编写具体实现，但需要在继承的类中实现，且继承其的类不能使用未在抽象类中的方法

```ts
abstract class Memory {
  private longTermMemory: string
  constructor(public shortTermMemory: string) {}
  abstract encode(): string // 抽象方法必须有 abstract 关键字 ，且必须在派生类中实现
  store(someShortTermMemory): void {
    this.longtermMemory += someShortTermMemory
    // ...storing encoded memory data
  }
  retrieve(): string {
    // ...retrieving  memory from long-term memory
  }
}

class CleverMemory extends Memory {
  constructor(shortTermMemory) {
    super(shortTermMemory) // 在派生类的构造函数中必须调用 super()
  }
  encode(): string {
    // encoding memory meta data with quickly strategy
  }
  anotherEncode(): string {
    // encoding memory meta data with another way
  }
}

const memory = new Memory() // error , 抽象类不能直接创建实例
const cleverMemory = new cleverMemory()
cleverMemory.encode() // right
cleverMemory.retrieve() // right
cleverMemory.anotherEncode() // ☹ 方法在声明的抽象类中不存在
```

### ts 中 decorator

decorator 提供了对 class 自身及其成员（属性、方法）的注解（`annotate`）和修改（`modify`)

#### 使用写法

在被装饰的对象上面使用`@` + 装饰器函数

```ts
@decorator
someClassMethod
```

> 若想动态使用装饰器函数，可以创建装饰器工程函数

```ts
function decoratorFactory(someparams){
  return decorator(){
    //  dynamiclly use decorator by import custom params from decoratorFactory
  }
}

@decoratorFactory(`someparams`)
someClassMethod
```

#### 装饰机制

会在 runtime 时通过`_decorate`执行装饰器函数，对被装饰的对象进行注解和改造

> 内部实现

```js
let Greeter = /** @class */ (() => {
  let Greeter = class Greeter {
    constructor(message) {
      this.greeting = message
    }
    greet() {
      return "Hello, " + this.greeting
    }
  }
  Greeter = __decorate([decorator], target, key, desc)
  return Greeter
})()

var __decorate =
  (this && this.__decorate) ||
  function(decorators, target, key, desc) {
    var c = arguments.length,
      r =
        c < 3
          ? target
          : desc === null
          ? (desc = Object.getOwnPropertyDescriptor(target, key))
          : desc,
      d
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
      r = Reflect.decorate(decorators, target, key, desc)
    else
      for (var i = decorators.length - 1; i >= 0; i--)
        if ((d = decorators[i]))
          r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r
    return c > 3 && r && Object.defineProperty(target, key, r), r
  }
```

#### 五种装饰器

ts 根据被装饰的对象不同，其装饰器接受的目标参数不同

##### 类装饰器

目标参数为 `constructor`,若装饰器有返回，则会将返回值作为该类

```ts
classDecorator(constructor){
  constructor.staticMethod = ()=>{
    // add a static method
  }
}

__decorate([
      classDecorator
    ],classSelfConstructor);
```

##### 方法装饰器

目标参数为

- `target`,被装饰的方法为静态方法`target`为`constructor`，否则为`prototype`
- `key`,被装饰的方法名
- `Property Descriptor`,`key`的属性描述，若装饰器有返回，则会将返回值作为`descriptor`

> ```ts
> interface PropertyDescriptor {
>   getter: Function //get 语法为属性绑定一个函数,每当查询该属性时便调用对应的函数,查询的结构为该函数的返回值
>   setter: Function //如果试着改变一个属性的值，那么对应的 setter 函数将被执行
>   value: any //描述指定属性的值 , 可以是任何有效的 Javascript 值(函数 , 对象 , 字符串 ...).
>   configurable: boolean //当且仅当该属性的 configurable 为 true 时，该属性 描述符 才能够被改变, 同时该属性也能从对应的对象>上被删除.
>   enumerable: boolean //描述指定的属性是否是 可枚举 的.
>   writable: boolean //当且仅当该属性的 writable 为 true 时, value 才能被赋值运算符改变
> }
> ```

```ts
methodDecorator(target,key,descriptor){
  descriptor.enumerable = false
}

__decorate([
      methodDecorator
    ],target,key,descriptor);
```

##### 访问器装饰器

和方法装饰器一毛一样 😶

##### 属性装饰器

目标参数为

- `target`,被装饰的方法为静态属性`target`为`constructor`，否则为`prototype`
- `key`,被装饰的属性名

> 在实例未被实例化之前，我们无法获得实例属性的 descriptor

```ts
propertyDecorator(target,key){
  target.normalMethod = ()=>{
    // add a normal method
  }
  target[key] = "this is prototype's property"
}

__decorate([
      propertyDecorator
    ],target,key);
```

##### 参数装饰器

目标参数为

- `target`,被装饰的方法为静态方法`target`为`constructor`，否则为`prototype`
- `key`,被装饰的属性名
- `index`, 参数的 index

### ts 中的 Reflect Metadata

#### what's Metadata

Metadata is data which can describe other data,In other words, it is "data about data.",Many distinct types of metadata exist, including descriptive metadata, structural metadata, administrative metadata, reference metadata and statistical metadata.

#### why Metadata

Metadata allows users to access resources allowing resources to be found by relevant criteria, identifying resources, bringing similar resources together, distinguishing dissimilar resources, and giving location information.

#### metadata in typescript

to use metadata , we need the package named `Reflect-Metadata`, the module provides the ability to add additional metadata to a class and their membesr,it also provides a reflective API to retrieve metadata.

#### basic usage

- define metadata on class and thier members

```ts
function defineMetadata(
  metadataKey: any,
  metadataValue: any,
  target: Object, // the target where you defined
  propertyKey?: string | symbol // depending on whether it is static or not
): void
```

- get metadata

```ts
function getMetadata(
  metadataKey: any,
  target: Object,
  propertyKey?: string | symbol
): any
```

#### Emit Decorator Metadata

Enables experimental support for emitting type metadata for decorators which works with the module reflect-metadata.

```js
// 通过开启Emit Decorator Metadata，被编译后会为被装饰的内容添加metadata,其中包括其类型信息,这些元数据可在js运行时在getMetadata中得到
__decorate(
  [
    LogMethod,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0),
  ],
  Demo.prototype,
  "foo",
  null
)
```

> TypeScript strives to only include features which are confirmed to be added into the JavaScript language.  
> There have been cases where a feature is compelling enough to be an exception to that rule, and these live as experimental compiler flags. It is possible that a version of these features may be different when/if they are added to the JavaScript language, and thus are considered risky.

## week 33

### 换行 与 回车

换行和回车傻傻分不清楚,难道不是一个作用吗。直到看到它们的符号才发现不是一个东西。  
换行是`\n`,回车是`\r`

#### 换行

换行(`line feed`),在打字机时代指的是打字头向下移一行,符号为`\n`

#### 回车

回车(`carriage return`),在打字机时代指的是打字头移到最左端,符号为`\r`

#### 换行+回车=换行符

根据换行与回车含义，可以知道换行符就是键盘上的`enter`键

#### 不同系统换行符不同

- Unix => `\r`
- Windows=> `\n\r`
- Mac OS => `\n`

### Vue Class Component

#### what is it

提供了用 class 形式写 vue 组件的能力

#### why should we use it in vue-typescript

class 写法能更好的被 typescript 类型检查,结合各种 decorator 可以非常直观且简洁的编写 vue 组件

> 通常使用`vue-property-decorator`里面封装好的 decorator

#### how does it work

通过装饰器

> main source code

```ts
export function componentFactory(Component, options = {}) {
  options.name = options.name || Component._componentTag || Component.name
  // prototype props.
  const proto = Component.prototype
  Object.getOwnPropertyNames(proto).forEach(function(key) {
    if (key === "constructor") {
      return
    }
    // hooks
    if ($internalHooks.indexOf(key) > -1) {
      options[key] = proto[key]
      return
    }
    const descriptor = Object.getOwnPropertyDescriptor(proto, key)
    if (descriptor.value !== void 0) {
      // methods
      if (typeof descriptor.value === "function") {
        ;(options.methods || (options.methods = {}))[key] = descriptor.value
      } else {
        // typescript decorated data
        ;(options.mixins || (options.mixins = [])).push({
          data() {
            return { [key]: descriptor.value }
          },
        })
      }
    } else if (descriptor.get || descriptor.set) {
      // computed properties
      ;(options.computed || (options.computed = {}))[key] = {
        get: descriptor.get,
        set: descriptor.set,
      }
    }
  })
  ;(options.mixins || (options.mixins = [])).push({
    data() {
      return collectDataFromConstructor(this, Component)
    },
  })
  // decorate options
  const decorators = Component.__decorators__
  if (decorators) {
    decorators.forEach(fn => fn(options))
    delete Component.__decorators__
  }
  // find super
  const superProto = Object.getPrototypeOf(Component.prototype)
  const Super = superProto instanceof Vue ? superProto.constructor : Vue
  const Extended = Super.extend(options)
  forwardStaticMembers(Extended, Component, Super)
  if (reflectionIsSupported()) {
    copyReflectionMetadata(Extended, Component)
  }
  //If the class decorator returns a value, it will replace the class declaration with the provided constructor function.
  return Extended
}
```

## week 34

### ts 中的 namespace 和 module

无论是`namespace`还是`module`,都是用来防止变量、类型混乱来更好的组织代码

#### namespace

命名空间是位于全局命名空间下的一个普通的带有名字的 JavaScript 对象，创建后可以作为全局类型使用  
通过引用标签`/// <reference path='*.ts'>` 来让编译器识别其关联

#### module

像命名空间一样，模块可以包含代码和声明。 不同的是模块可以通过`import`声明导入的依赖

#### `declare namespace` 与 `declare module`

通过 declare 关键字，来告诉 TypeScript，你正在试图表述一个其他地方已经*存在的代码*（如：写在 JavaScript、CoffeeScript 或者是像浏览器和 Node.js 运行环境里的代码）  
`declare namespace` 与 `declare module` 都可以为外部的库提供一个类型。

```ts
declare module "*.vue" {
  import Vue from "vue"

  export default Vue
}
```

```ts
declare global {
  namespace JSX {
    // tslint:disable no-empty-interface
    interface Element extends VNode {}
    // tslint:disable no-empty-interface
    interface ElementClass extends Vue {}
    interface IntrinsicElements {
      [elem: string]: any
    }
  }
}
```

### ?? 和 ||

`??`又称空位合并符 是 ES2020 的新特性，如下面代码，似乎与`||`相似，那么它们有什么异同点呢

```js
let valueA
let valueB = 1
valueA ?? valueB == valueA || valueB
```

#### 都是非 A 则 B

#### 运算优先级都比较低

参照[运算优先级表](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Operator_Precedence#Table)，
`||`的优先级为 6，`??`的优先级为 5。都仅仅高于`?`(三元运算符)和`=`(赋值运算符)

#### ??只排除 undefined 与 null

```js
x = a ?? b
// 等同于
x = a !== null && a !== undefined ? a : b
```

```js
let a = 0
a || 10 //  10
a ?? 10 // 0
```

所以在`0`也是有意义的值的情况下，我们就可以直接使用`??`

## week 35

### SVG 中的 viewBox

#### what is viewBox

it specify a rectangle in svg coordinate, which will be mapped to the bounds of the svg element viewport

#### why do we need viewBox

svg can scale infinitely by use Vector coordinate system, hence we should decide how much we scale that can fit the size of svg element.
the way to scale graphics in given size svg element is specify its viewport region,it is what viewBox does

#### how do we use it

The value of the viewBox attribute is a list of four numbers: min-x, min-y, width and height.

```html
<svg width="200" height="100" viewBox="0 0 100 100"></svg>
```

it means we cut off the size of 100\*100(`100 100`) vector graphics from the top left corner(`0 0`) in svg coordinate ,and scale it fill to svg element container which is 200 pixels(`width="200"`) width and 100 pixels height(`height="100"`)

## week 36

### Golang

#### 谷歌为什么创造了 GO

- python easy to use,but slow
- java has increasingly complex type system
- c/c++ has complex type system and low compile speed

#### Go 的特点

- 强静态类型
- 良好的生态
- 关键特性
  - simplicity
  - fast compile times
  - Garbage collected
  - built-in concurrency
  - compile to standalone binaries

#### Go 基本类型

- 数值类型

```go
int  int8  int16  int32  int64
uint uint8 uint16 uint32 uint64 uintptr

byte // uint8 的别名

rune // int32 的别名
    // 表示一个 Unicode 码点

float32 float64

complex64 complex128
```

- 布尔类型

```go
bool
```

- 字符串类型

```go
string
```

#### 流程控制语句

- Go 的流程控制语句包括 `for`、`if`、`else`、`switch` 和 `defer`。
- Go 的控制语句后面一般都可以有声明表达式，且此表达式不需要` (``) `,但后面`{}`是必须的
- Go 控制语句后面的声明表达式的变量属于局部变量，只可以在控制流程中使用

##### 循环

Go 只有`for`循环,用法与 js 一致

基本的 for 循环由三部分组成，它们用分号隔开：

初始化语句：在第一次迭代前执行 _可选_
条件表达式：在每次迭代前求值 _可选_
后置语句：在每次迭代的结尾执行 _可选_
初始化语句通常为一句短变量声明，该变量声明仅在 for 语句的作用域中可见。

一旦条件表达式的布尔值为 false，循环迭代就会终止。

```go
package main

import "fmt"

func main() {
 sum := 0
 for i := 0; i < 10; i++ {
 sum += i
 }
 fmt.Println(sum)
}
```

- 不写初始话语句和后置语句，`for`就成了`while`。

- 不写循环条件，就是无限循环

#### 指针

Go 和 C 一样，可以直接拿到值的变量指针(存储值的地址)

类型 \*T 是指向 T 类型值的指针。其零值为 nil

```go
var p *int //表示P是整数的指针类型

```

& 操作符会生成一个指向其操作数的指针。

```go
i := 42
p = &i
```

- 操作符表示指针指向的底层值。

```go
fmt.Println(*p) // 通过指针 p 读取 i
*p = 21         // 通过指针 p 设置 i
```

上面通过操作`i`的指针间接改变了 i 的数值，这也就是通常所说的“间接引用”或“重定向”。

#### 复合数据类型

##### 结构体

##### 数组

`[n]T`
数组长度固定

> 数组是值语义。一个数组变量表示整个数组，它不是指向第一个元素的指针（不像 C 语言的数组）

##### 切片

`[]T`  
切片是在在数组之上的抽象数据类型,切片为数组元素提供动态大小的、灵活的视角

```go
array := [3]int{1,2,4}
slice := array[0 : 3] // slice的取值前闭后开 [1,2]
```

- 切片只存储底层数组的引用  
  切片并不存储任何数据，它只是描述了底层数组中的一段。(_与 python 和 js 中复制值独立存储的切片不同_)
  更改切片的元素会修改其底层数组中对应的元素。
  与它共享底层数组的切片都会观测到这些修改。

- 切片拥有 长度 和 容量  
  切片的长度就是它所包含的元素个数。

  切片的容量是从它的第一个元素开始数，到其底层数组元素末尾的个数。

  切片 s 的长度和容量可通过表达式 len(s) 和 cap(s) 来获取。
  _长度不能超过容量,先有容量才有长度_

- 切片的零值是`nil`

  ```go
  var s []int // []
  if s == nil {
  fmt.Println("nil!")
    }
  ```

  > `nil`可以说是 JS 中的`undefined`，表示无值，还没有赋值

- `make`生成切片  
  make 函数会分配一个元素为零值的数组并返回一个引用了它的切片：

  ```go
  func make(s []T,len int,cap int) []T
  a := make([]int, 5, 6)  // len(a)=5 cap(a)=6
  ```

- 向切片追加元素

```go
func append(s []T, vs ...T) []T
```

`append` 的第一个参数 `s` 是一个元素类型为 `T` 的切片，其余类型为 `T` 的值将会追加到该切片的末尾。

`append` 的结果是一个包含原切片所有元素加上新添加元素的切片。

> 当 s 的底层数组太小，不足以容纳所有给定的值时，它就会分配一个更大的数组。返回的切片会指向这个新分配的数组。

- 循环切片

> 数组也可以这样循环

```go
type Dom struct {
  tag string
  class string
}
var nodes = []Dom{{"body","app"},{"div","banner"} }

func main() {
  for _, v := range nodes {
    fmt.Printf(v.tag,v.class)
  }
}

```

##### 映射

映射是一个存储键值对的无序集合。

> 映射是在底层数据结构之上封装的数据结构，本身只存储引用，因此在函数间传递映射并不会制造出该映射的一个副本

- 创建

```go
//用make声明映射，key为string value为int
dict := make(map[string]int)

//用对象字面量创建映射，key为字符串切片，value为int

dict := map[[]string]int{}

```

##### 闭包

same with javascript

```go
// fibonacci
func getFibonacci(i int) int {
  if i == 1 {
    return 0
  }
  if i == 2 {
    return 1
  }
  return getFibonacci(i-1) + getFibonacci(i-2)
}

// 返回一个“返回int的函数”

func fibonacci() func() int {

  i := 0
  // 函数里面似乎不能声明命名函数？
  return func() int {
    i++
    return getFibonacci(i)
  }
}

func main() {
  f := fibonacci()
  for i := 0; i < 10; i++ {
    fmt.Println(f())
  }
}
```

#### 方法

- 方法就是一类带特殊的 接收者 参数的函数

```go
type MyFloat float64

func (f MyFloat) Abs() float64 {
  if f < 0 {
    return float64(-f)
  }
  return float64(f)
}
```

- 接收者可以是类也可以是类指针

> 不能直接把内建类作为接收者

指针接收者的方法可以修改接收者指向的值

若使用值接收者，那么方法会对原始值的副本进行操作

若方法节接收者为指针，则 Go 会将该方法的调用默认转为指针的调用

> 与 JavaScript 不同的是，Go 的对象是直接存储的值，Go 只有 slices, maps 和 channels 直接存储的是地址。

```go
func (v *Vertex) Scale(f float64) {
  v.X = v.X * f
  v.Y = v.Y * f
}

v := Vertex{3, 4}

v.Scale(5) // 实际执行(&v).Scale(5)

```

若方法节接收者为值，则 Go 会将该方法的调用默认转为值的调用

```go
p :=&Vertex{3, 4}
func AbsFunc(v Vertex) float64 {
  return math.Sqrt(v.X*v.X + v.Y*v.Y)
}

p.Scale(5) // 实际执行(*v).Scale(5)

```

> 一般都使用指针接收者，原因有二：
> 首先，方法能够修改其接收者指向的值。  
> 其次，这样可以避免在每次调用方法时复制该值。若值的类型为大型结构体时，这样做会更加高效。

#### 接口(interface)

接口是定义的一组待实现的行为的类型，这些被定义的行为不由接口直接实现，而是通过方法由用户定义的类型实现。接口让 GO 实现多态

## week 37

### How to compare MVVM framework

#### code

react：  
jsx

vue:  
template(_regular_,jsx available)

#### compile

react：  
compile jsx to js

vue:  
compile template to js,involving optimize  
step:

online compile : compiling in runtime on browser

1. parse() HTML==>AST

2.

offline : compiling with webpack in building

#### runtime

react：  
coroutine fiber（链表）
> fiber 的目的为解决 vdom 递归创建与 diff 导致的js阻塞渲染。基本原理是利用链表与 RequestIdleCallback 实现更新过程可控（可拆分、挂起、恢复、中止）  
> [可参考文章](https://juejin.cn/post/6984949525928476703)

vue:

### 缓存过程及设置策略

#### Service Worker 独立线程优先调度请求

Service Worker 旨在实现浏览器*离线本地应用*，通过在*前端*自行注册、监听，可以让我们自由控制缓存哪些文件、如何匹配缓存、如何读取缓存，并且缓存是持续性的。

该线程优先于浏览器其它的所有缓存应用方式

#### `cache-control`决定浏览器请求的缓存规则

在 Service Worker 之后，若该请求在本地存在缓存，则读取其*缓存标识*，将其补充在请求头中（是**补充**，不是覆盖）；若第一次请求，则保存响应以及缓存标识。

浏览器首先会根据其缓存标识中的`cache-control`来执行缓存，请求/响应链中的所有缓存机制都必须遵循`cache-control`的指令.(具体规则见[https://developers.goo...](https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/http-caching#cache-control))

> 若标识中没有`cache-control`，会根据浏览器自身的规则默认给其设置一个`max-age`的时间

根据`cache-control`的规则，我们应该以下面的策略设置`cache-control`
![http-cache-decision-tre](../images/http-cache-decision-tree.png)

`cache-control`不为`no-cache`或`no-store`时，浏览器会根据`max-age`走强缓存

#### `ETag`和`Last-Modified`验证缓存的响应

若`cache-control`不为`no-store`时，浏览器会根据`ETag`或`Last-Modified`发送请求，向服务器验证是否需要重新下载响应

> `ETag`和`Last-Modified`可以同时使用，如果服务端对两者的验证结果不一致，例如通过一个条件判断资源发生了更改，而另一个判定资源没有发生更改，则不允许返回 304 状态。但话说回来，是否返回还是通过服务端编写的实际代码决定的。所以仍然有操纵的空间

#### 根据资源需求合理配置缓存

不存在什么最佳缓存策略。根据通信模式、提供的数据类型以及应用特定的数据更新要求，为每个资源定义和配置合适的设置，以及整体的“缓存层次结构”。

在制定缓存策略时，牢记下面这些技巧和方法：

- _使用一致的网址_：如果您在不同的网址上提供相同的内容，将会多次提取和存储这些内容。 提示：请注意，网址区分大小写。
- _确保服务器提供验证令牌 (ETag)_：有了验证令牌，当服务器上的资源未发生变化时，就不需要传送相同的字节。
- _确定中间缓存可以缓存哪些资源_：对所有用户的响应完全相同的资源非常适合由 CDN 以及其他中间缓存（代理服务器中的缓存）进行缓存。
- _为每个资源确定最佳缓存周期_：不同的资源可能有不同的更新要求。 为每个资源审核并确定合适的 max-age。
- _确定最适合您的网站的缓存层次结构_：您可以通过为 HTML 文档组合使用包含内容指纹的资源网址和短时间或 no-cache 周期，来控制客户端获取更新的速度。
- _最大限度减少搅动_：某些资源的更新比其他资源频繁。 如果资源的特定部分（例如 JavaScript 函数或 CSS 样式集）会经常更新，可以考虑将其代码作为单独的文件提供。 这样一来，每次提取更新时，其余内容（例如变化不是很频繁的内容库代码）可以从缓存提取，从而最大限度减少下载的内容大小。

通过组合使用 ETag、Cache-Control 和唯一网址来实现一举多得：较长的过期时间、控制可以缓存响应的位置以及随需更新。

<!-- todo  vue的是默认深度遍历来响应化data吗 -->

### vue 是默认深度遍历

```js
//core/observer/index.js
export function defineReactive (
  obj: Object,
  key: string,
  val: any,
  customSetter?: ?Function,
  shallow?: boolean //shallow 判断是否深度遍历
) {
  const dep = new Dep()

  const property = Object.getOwnPropertyDescriptor(obj, key)
  if (property && property.configurable === false) {
    return
  }

  // cater for pre-defined getter/setters
  const getter = property && property.get
  const setter = property && property.set
  if ((!getter || setter) && arguments.length === 2) {
    val = obj[key]
  }
  // 深度递归响应化对象
  let childOb = !shallow && observe(val)
```

## week 38

<!-- TODO -->

### canvas 热区

### vue-router 中的几个核心思想

-_install_

```js
Vue.mixin({
  beforeCreate: function beforeCreate() {
    if (isDef(this.$options.router)) {
      //routerView 根节点
      this._routerRoot = this
      this._router = this.$options.router //将全局VueRouter实例挂载
      this._router.init(this) //将_route绑定history change
      Vue.util.defineReactive(this, "_route", this._router.history.current) //将_route设为响应式
    } else {
      this._routerRoot = (this.$parent && this.$parent._routerRoot) || this // 每个实例都获取到根routerRoot实例
    }
    registerInstance(this, this)
  },
  destroyed: function destroyed() {
    registerInstance(this)
  },
})

Object.defineProperty(Vue.prototype, "$router", {
  get: function get() {
    return this._routerRoot._router
  },
})

Object.defineProperty(Vue.prototype, "$route", {
  get: function get() {
    return this._routerRoot._route
  },
})

Vue.component("RouterView", View)
Vue.component("RouterLink", Link)
```

-_example_

```js
Vue.use(Router)

const router = new Router({
  mode: "hash",
  base: process.env.BASE_URL,
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap,
})

new Vue({
  router,
  store,
  created() {
    bootstrap()
  },
  render: h => h(App),
}).$mount("#app")
```

#### 把全局 router 绑定在每个实例中

每个实例都能通过\_routerRoot 访问`router`与`route`

#### 将 url 的变化绑定实例的 route,并将 route 设为响应式

```js
history.listen(function(route) {
  this$1.apps.forEach(function(app) {
    app._route = route
  })
})
```

### 前端攻击的主要方式

#### XXS(Cross-Site Scripting)

主要是通过主动对页面注入脚本来实现攻击

#### CSRF(Cross—Site Request Forgery)

主要是通过诱导用户点击后端的某个接口来实现攻击

### react 中的可变对象与不可变对象

可变对象指在创建后的内容可以进行修改，不可变对象则不可修改。react 遵循每个元素都是不可变的原则，保证每次的试图更新都是全新的一帧，所以在`state`和`prop`的设计上都是不可变的。

> 在 hook 中每一次渲染都有它自己的 Props and State
> 在 js 中除引用类型外的数据类型都是不可变的

#### mutable

- component

  - this

- hooks
  - useRef
  - useReducer

#### immutable

- component

  - props
  - state

- hooks
  - useState

> both these immutables are shallow,it means that preProps.prop != props.prop ,but maybe preProps.prop.arrayData == props.prop.arrayData

### some differences between express and koa

这里根据`express`和`koa`的执行流程这一维度，针对各个环节来看看它们之间的区别

先放关键的源码

```js
// 收集中间件的实现
proto.use = function use(fn) {
  var offset = 0
  var path = "/"

  // default path to '/'
  // disambiguate router.use([fn])
  if (typeof fn !== "function") {
    var arg = fn

    while (Array.isArray(arg) && arg.length !== 0) {
      arg = arg[0]
    }

    // first arg is the path
    if (typeof arg !== "function") {
      offset = 1
      path = fn
    }
  }

  var callbacks = flatten(slice.call(arguments, offset))

  for (var i = 0; i < callbacks.length; i++) {
    var fn = callbacks[i]

    // add the middleware
    var layer = new Layer(
      path,
      {
        sensitive: this.caseSensitive,
        strict: false,
        end: false,
      },
      fn
    )

    layer.route = undefined

    this.stack.push(layer)
  }

  return this
}

// 请求的handler实现
proto.handle = function handle(req, res, out) {
  var self = this
  var idx = 0

  // middleware and routes
  var stack = self.stack

  next()

  // next 是同步函数
  function next(err) {
    // find next matching layer
    var layer
    var match
    var route
    //....
    while (match !== true && idx < stack.length) {
      layer = stack[idx++] //通过闭包维持stack的唯一引用
      match = matchLayer(layer, path)
      route = layer.route
      var method = req.method
      var has_method = route._handles_method(method)

      // build up automatic options response
      if (!has_method && method === "OPTIONS") {
        appendMethods(options, route._options())
      }

      // don't even bother matching route
      if (!has_method && method !== "HEAD") {
        match = false
        continue
      }
    }

    // no match
    if (match !== true) {
      return done(layerError)
    }

    // store route for dispatch on change
    if (route) {
      req.route = route
    }

    // Capture one-time layer values
    req.params = self.mergeParams
      ? mergeParams(layer.params, parentParams)
      : layer.params
    var layerPath = layer.path

    // this should be done for the layer
    self.process_params(layer, paramcalled, req, res, function(err) {
      if (err) {
        return next(layerError || err)
      }

      if (route) {
        return layer.handle_request(req, res, next)
      }

      trim_prefix(layer, layerError, layerPath, path)
    })
  }

  function trim_prefix(layer, layerError, layerPath, path) {
    // ....
    if (layerError) {
      layer.handle_error(layerError, req, res, next)
    } else {
      layer.handle_request(req, res, next)
    }
  }
}

// handle_request实现
Layer.prototype.handle_request = function handle(req, res, next) {
  var fn = this.handle

  if (fn.length > 3) {
    // not a standard request handler
    return next()
  }

  try {
    fn(req, res, next) // callback
  } catch (err) {
    next(err)
  }
}
```

#### collect middleware

_express_  
`express`通过`use`和`route`收集所有的`middleware`,`middleware`都会被封装成`layer`存入 router 实例的`stack`中

#### handle request

_express_  
`express`通过`handle`闭包`stack`,递归执行`next`:升序遍历`stack`中的`layer`，若路由匹配(`layer.match`)则`handle_request`。

#### dispatch response

_express_  
`express`通过`res.send`等在中间件中调用后*立即*返回`response`至客户端

_koa_  
`koa`会在执行完所有中间件后拿到`ctx`，分析`ctx`中的内容分发响应

### BFF

Back-end For Front-end 服务于前端的后端，`Graphql`可以被认为是其的一种实现

<!-- TODO -->

<!-- service worker -->

## week 39

### 小程序跨端实现

对于微信小程序这样不开放不开源的端，我们可以先把用 React/vue 代码分析成一颗抽象语法树，根据这颗树生成小程序支持的模板代码，再做一个小程序运行时框架处理事件和生命周期与小程序框架兼容，然后把业务代码跑在运行时框架就完成了小程序端的适配。

### 浏览器性能指标

根据浏览器开始访问一个 url 到页面完全渲染经历的所有阶段，我们可以取其中几个关键的阶段作为需要关注的指标，这些阶段的数据都可以通过浏览器提供的`perfermance`接口拿到。

通过观察各个指标的数据，我们可以针对性的做一些优化。

#### Redirect

网页重定向的耗时

#### AppCache

检查本地缓存的耗时

#### DNS lookup

DNS 查询的耗时

#### TCP connect

TCP 连接的耗时

#### Waiting(TTFB)

从客户端发起请求到接收到响应的时间 / [Time to First Byte (TTFB)](https://web.dev/time-to-first-byte/)，

#### Content Download

下载服务端返回数据的时间

#### DOMContentLoaded(DCL)

HTML parsing 完成、dom 及`will-excute-script`加载完成的时间，此时页面完成一个交互（可交互状态？好像不是有专门的[TTI](https://web.dev/tti/)指标）

#### Loaded

页面所有`subsource`（图片，异步脚本等）加载完毕，页面处于`complete`状态。

> _以上都是涉及资源加载的指标，除此之外页面的绘制及交互也是特别关键的指标，我们可以参考[web-vitals](https://github.com/GoogleChrome/web-vitals)判断的指标_

#### Cumulative Layout Shift (CLS)

累积的 layout 位移（CLS）是衡量用户视觉稳定性的一项重要的以用户为中心的度量标准，因为它有助于量化用户经历意外的 Layout 移位的频率-较低的 CLS 有助于确保页面令人愉悦。

#### First Input Delay (FID)

首次输入延迟（FID）是衡量用户负载响应能力的一项重要的以用户为中心的度量标准，因为它可以量化用户在尝试与无响应的页面进行交互时的体验，低的 FID 有助于确保页面可用。

#### First Contentful Paint (FCP)

First Contentful Paint（FCP）是一项重要的以用户为中心的指标，用于衡量感知的加载速度，因为它标记了页面加载时间轴中用户可以在屏幕上看到的任何内容的第一点–快速的 FCP 可以帮助用户确定是否有东西 发生。  
FCP 度量标准衡量从页面开始加载到屏幕上呈现页面内容的任何部分的时间。 对于此度量标准，“内容”是指文本，图像（包括背景图像），<svg>元素或非白色<canvas>元素。

#### Largest Contentful Paint (LCP)

最大内容绘制（LCP）是衡量用户感知加载速度的重要，以用户为中心的度量标准，因为它标记了页面主要内容可能已加载时页面加载时间线中的时间点-快速的 LCP 有助于使用户确信页面`useful` .

### Serverless + 前端部署

<!-- todo -->

#### why do we need serverless in deployment of Frontend

<!-- - stable environment can ensure a constant output -->

- flexble

-

#### How do we implement a serverless deployment

### TS 高级类型

#### Exclude

```ts
Exclude<T,U> // 返回
```

#### Extract

```ts
Extract<T,U> // 返回
```

#### Pick

#### ConstructorParameters

## week 40

### what async do

#### main steps

- generate a iterator
- promise the yielded result

#### simple implementation

```ts
async function someAsync() {
  const vA = await takeTimeFunc()
  const vB = await takeTimeFunc()
  return vA + vB
}
```

- generate a iterator

```ts
function* someAsyncGenerator() {
  const vA = yield takeTimeFunc()
  const vB = yield takeTimeFunc()
  return vA + vB
}

const asyncIterator = someAsyncGenerator()

someAsync = new Promise(resolve => {
  function handle(yieldedResult) {
    const { value, done } = yieldedResult
    if (done) {
      return resolve(value)
    }
    if (value instanceof Promise) {
      value.then(res => {
        handle(asyncIterator.next(res))
      })
    } else {
      handle(asyncIterator.next())
    }
  }
  try {
    handle(asyncIterator.next())
  } catch (e) {
    asyncIterator.throw(e)
  }
})
```

## week 41

### diff algorithms in mvvm

#### purples

用移动、替代、新建这些方式以最小代价更新节点

#### keywords

- **VDOM**
  `vdom`是被 diff 的对象，它的数据结构是根据真实 DOM 的构成设计出来的，而从可以来表示一个 DOM，通过操作`vdom`来模拟出变化后的视图。
  `vdom`的一般结构

```ts
interface VirturlElement {
  // Redefine type here using our internal ComponentType type
  type: string | ComponentType<P>
  props: P & { children: ComponentChildren }
  ref?: Ref<any> | null
  _children: Array<VNode<any>> | null
  _parent: VNode | null
  _depth: number | null
  /**
   * The [first (for Fragments)] DOM child of a VNode
   */
  _dom: PreactElement | null
  /**
   * The last dom child of a Fragment, or components that return a Fragment
   */
  _nextDom: PreactElement | null
  _component: Component | null
  _hydrating: boolean | null
  constructor: undefined
  _original: number
}
```

- **广度优先**
广度优秀遍历也称为层序遍历

- **patch**
  <!-- todo -->
#### diff in snabbdom

1. 比较头节点
   1. 相同（key and tag）=> 2
   2. 不同直接创建 createEle(vdom)
2. 比较子节点
   1. 完全相同 =>end
   2. text => replace
   3. 都是数组 => 3
3. 子节点数组之间比较
   1. 剔除为 null 的头尾节点
   2. 头头 or 尾尾相同 继续
   3. 头尾相同，dom 头尾交换
   4. 新老是否存在相同 key，存在则=>2,然后插入改 key 的老节点的 dom
   5. 3.1~3.4 遍历完所有节点后，新头尾指针剩下的节点在 dom 上新增，老头尾指针在 dom 上删除

#### diff in inferno

> inferno 中的 vdom 增加了 flags 与 childFlags,使其能对 vdom 进行更快分类操作

diff 中的主要差异在于存在 key 的 childrens 之间的比较
通过遍历新旧 vdom，获得旧节点在新节点列表中的各个位置的数组，通过将该数组进行最大升序计算，从而归化出对 dom 最小的移动方案

### hook 中的异步

hook和setState一样都是合并更新，批处理后执行render，导致无法直接拿到`state`，但其实际没有异步调用

### vue 中的异步

vue中的Data是同步赋值的，但是其render是*异步*之后批处理执行render，其是真正的在异步调用中执行

### 按需加载

#### 包构建时

在组件库构建时，除了构建完整的组件库包以外，还把每个组件单独构建了一个包，这样就可以独立引用每一个组件了。

```js
const cptConf = require("../src/config.json")
const entry = {}

cptConf.packages.map(item => {
  entry[cptName] = `./src/packages/${item.name.toLowerCase()}/index.js`
})

module.exports = {
  entry,
}
```

#### 编译导入语句

```ts
import { Button, Switch } from "@nutui/nutui"
```

通过 plugin 编译为特定的组件路径

```ts
import Button from "@nutui/nutui/dist/packages/button/button.js"
import Switch from "@nutui/nutui/dist/packages/switch/switch.js"

import "@nutui/nutui/dist/packages/button/button.css"
import "@nutui/nutui/dist/packages/switch/switch.css"
```

### 数据库事务

数据库事务( transaction)是访问并可能操作各种数据项的一个数据库*操作序列*，这些操作要么全部执行,要么全部不执行，是一个不可分割的工作单位。事务由事务开始与事务结束之间执行的全部数据库操作组成。

#### 事务四大特性(ACID)

- 原子性（Atomicity)  
  原子性是指事务包含的所有操作要么全部成功，要么全部失败回滚。
  > nnodb 通过 undo log 和 redo log 来实现。事务中，每当执行一条 SQL 语句对数据产生了影响，就会记录下来与之相反的操作到 undo log(撤销日志）中，例如，更新会记录之前的状态，删除会形成 insert，添加会形成 delete，一旦事务被回滚，则执行 undo log 中记录的操作，来完成恢复到之前的状态。这里是个 逻辑恢复哦！同时，每当执行一条事务中的 SQL，会将操作记录到 redo log 中，此时事务一旦被提交，就将该 redolog 中的操作，持久化到磁盘上，数据就持久的记录下来了（ACID 的 D）
- 一致性（Consistency）  
  一致性是指事务必须使数据库从一个一致性状态变换到另一个一致性状态，也就是说一个事务执行之前和执行之后都必须处于一致性状态.  
  拿转账来说，假设用户 A 和用户 B 两者的钱加起来一共是 5000，那么不管 A 和 B 之间如何转账，转几次账，事务结束后两个用户的钱相加起来应该还得是 5000，这就是事务的一致性。

- 隔离性（Isolation）  
  隔离性是当多个用户并发访问数据库时，比如操作同一张表时，数据库为每一个用户开启的事务，不能被其他事务的操作所干扰，多个并发事务之间要相互隔离。  
  即要达到这么一种效果：对于任意两个并发的事务 T1 和 T2，在事务 T1 看来，T2 要么在 T1 开始之前就已经结束，要么在 T1 结束之后才开始，这样每个事务都感觉不到有其他事务在并发地执行。

关于事务的隔离性数
据库提供了多种隔离级别，稍后会介绍到。

- 持久性（Durability）  
  持久性是指一个事务一旦被提交了，那么对数据库中的数据的改变就是永久性的，即便是在数据库系统遇到故障的情况下也不会丢失提交事务的操作。

### 小程序的双线程模型

微信小程序团队自称其小程序是双线程模型，分别是逻辑层与渲染层，这个`双线程`让人感到迷惑，web 同样也有`UI绘制`和`js执行`两个线程呀，那么小程序的`双线程`到底特殊在哪呢，结合他们自己给的文档，我们来看看。

#### 是什么

> 分别是逻辑层与渲染层。逻辑层是单独的线程去执行 JavaScript，在这个环境下执行的都是有关小程序业务逻辑的代码。而界面渲染相关的任务全都在 WebView 线程里执行，通过逻辑层代码去控制渲染哪些界面，那么这一层当然就是所谓的渲染层。

原来小程序所谓的双线程是指在 webview**进程**之外加入另一个 js 执行线程,然后就有了 2 个 js 线程？？？只能这样理解了

#### 为什么

> 我们在对小程序的架构设计时的要求只有一个，就是要快，包括要渲染快、加载快等。当用户点开某个小程序时，我们期望体验到的是只有很短暂的加载界面，在一个过渡动画之后可以马上看到小程序的主界面。

出于这样一个目的，小程序必须得采用原生渲染的方式。

> 由于小程序的宿主是微信，所以我们不太可能用纯客户端原生技术来编写小程序 。如果这么做，那小程序代码需要与微信代码一起编包，跟随微信发版本，这种方式跟开发节奏必然都是不对的。因此，我们需要像 Web 技术那样，有一份随时可更新的资源包放在云端，通过下载到本地，动态执行后即可渲染出界面。

所以又需要文件动态加载

> 但是，如果我们用纯 Web 技术来渲染小程序，在一些有复杂交互的页面上可能会面临一些性能问题，这是因为在 Web 技术中，UI 渲染跟 JavaScript 的脚本执行都在一个单线程中执行，这就容易导致一些逻辑任务抢占 UI 渲染的资源。

纯 web 和纯原生都无法满足，那就相互结合一下(hybrid)  
BTW，微信这似乎写错了,`UI 渲染跟 JavaScript 的脚本执行都在一个单线程中执行`，它们也是独立的线程，只不过在 web 策略中相互阻塞

> 最终，我们选择类似于微信 JSSDK 这样的 Hybrid 技术，即界面主要由成熟的 Web 技术渲染，辅之以大量的接口提供丰富的客户端原生能力。同时，每个小程序页面都是用不同的 WebView 去渲染，这样可以提供更好的交互体验，更贴近原生体验，也避免了单个 WebView 的任务过于繁重。此外，界面渲染这一块我们定义了一套内置组件以统一体验，并且提供一些基础和通用的能力，进一步降低开发者的学习门槛。值得一提的是，内置组件有一部分较复杂组件是用客户端原生渲染的，以提供更好的性能。

all of all，微信想通过一个独立的 JS 执行线程，保证视图的渲染和业务逻辑的计算同时进行，从而提高渲染与加载的速度。

> 得益于客户端系统有 JavaScript 的解释引擎（在 iOS 下是用内置的 JavaScriptCore 框架，在安卓则是用腾讯 x5 内核提供的 JsCore 环境），我们可以创建一个单独的线程去执行 JavaScript

#### 怎样实现

#### 带来的问题

## week 42

### Go 中的特殊语法之 defer

```go
func main() {
 defer fmt.Println("world")
 fmt.Println("hello")
}

// hello ; world
```

#### 作用

`defer`语法会将一个函数压入一个栈列表内，这个栈列表中的函数会在其外部函数返回后依次出栈执行。  
`defer`通常对用来清除动作的简单函数使用

```go
func CopyFile(dstName, srcName string) (written int64, err error) {
    src, err := os.Open(srcName)
    if err != nil {
        return
    }
    defer src.Close()

    dst, err := os.Create(dstName)
    if err != nil {
        return
    }
    defer dst.Close()

    return io.Copy(dst, src)
}
```

#### 规则

延迟语句的行为是直接且可预测的

- 延迟函数的**参数**在 defer 声明时就会被求值

```go
func a() {
    i := 0
    defer fmt.Println(i)
    i++
    return
}
// => 0
```

- 延迟函数执行的顺序是先进后出的

```go
func b() {
    for i := 0; i < 4; i++ {
        defer fmt.Print(i)
    }
}
// => 3;2;1;0
```

- 延迟函数可以读写外部函数所命名返回的值

```go
func c() (i int) {
    defer func() { i++ }()
    return 1
}

func main() {
  fmt.Print(c())
}
// => 2
```

### https 中的混合加密

https 协议在传输中其实用到了两种加解密方式，针对传输数据使用的是对称加密，而对于这个对称加密所用的`KEY`则是用非对称加密。

#### 非对称加密对数据传输加密的 KEY

HTTPS 的传输会先进行`SSL通信`，客户端向服务端第一次`SSL通信`后会返回一个证书，证书中包含证书公钥、CA 机构的数字签名、域名信息，然后通过本地存储的（系统和浏览器中）对应 CA 证书提供的公钥对签名进行验证通过之后，SSL 第一次握手结束，客户端以 Client Key Exchange 报文作为回应。报文中包含通信加密中使用的一种被称为 Pre-mastersecret 的随机密码串，即用来对之后的传输数据进行加密的`KEY`。该报文用公开密钥进行非对称加密。

> 此处认证机构的证书必须安全地转交给客户端。使用通信方式时，如何安全转交是一件很困难的事，因此，多数浏览器开发商发布版本时，会事先在内部植入常用认证机构的证书。

#### 对称加密数据报文

服务端接收到被公钥非对称加密后的`Pre-mastersecret`后，会用服务端本地的私钥解密获得，此后服务端和客户端都会用此来进行加密传输数据

#### 证书伪造

证书伪造，攻击者为了获得 HTTPS 传输的明文数据，需要先将自己接入到客户端和目标网站之间；在传输过程中伪造服务器的证书，将服务器的公钥替换成自己的公钥，这样，中间人就可以用自己的私钥去解密`Pre-mastersecret`，从而窃取客户端和服务端的通信数据；

但是对于客户端来说，如果中间人伪造了证书，在校验证书过程中会提示证书错误，由用户选择继续操作还是返回，由于大多数用户的安全意识不强，会选择继续操作，此时，中间人就可以获取浏览器和服务器之间的通信数据。

## week 43

### Go 的 routine

Go 作为 web 开发的当红炸子鸡，对网络请求的高并发肯定是天然支持的。

Go 语言里的并发指的是能让某个函数独立于其他函数运行的能力。当一个函数创建为 goroutine 时，Go 会将其视为一个独立的工作单元。

这个单元会被调度到可用的`逻辑处理器`上执行。Go 语言运行时的`调度器`是一个复杂的软件，能管理被创建的所有 goroutine 并为其分配执行时间。这个`调度器`在操作系统之上，将操作系统的线程与语言运行时的逻辑处理器绑定，并在逻辑处理器上运 goroutine。`调度器`在任何给定的时间，都会全面控制哪个 goroutine 要在哪个逻辑处理器上运行。

> 操作系统的线程：一个线程是一个执行空间，这个空间会被操作系统调度来运行
> 函数中所写的代码。每个进程至少包含一个线程，每个进程的初始线程被称作主线程。因为执行
> 这个线程的空间是应用程序的本身的空间，所以当主线程终止时，应用程序也会终止。操作系统
> 将线程调度到某个处理器上运行，这个处理器并不一定是进程所在的处理器。不同操作系统使用
> 的线程调度算法一般都不一样，但是这种不同会被操作系统屏蔽，并不会展示给程序员。

#### 并发与并行

并行是让不同的代码片段同时在不同的物理处理器上执行。并行的关键是同时做很多事情

而并发是指同时*管理*很多事情，这些事情可能只做了一半就被暂停去做别的事情了。

> 这种“使用较少的资源做更多的事情”的哲学，也是指导 Go 语言设计的哲学

#### 调度器

go 用来调度`goroutine`到逻辑处理器的级制。

#### 逻辑处理器

逻辑处理器会绑定到唯一的操作系统线程，用来执行处理`goroutine`

#### 共享资源锁

并发函数很容易造成对公共变量的竞争使用问题，因此 go 提供了对共享资源加锁的机制来防止这一情况。  
实现该机制的方式有`atomic`和`sync`。

- 原子函数，原子函数能够以很底层的加锁机制来同步访问整型变量和指针。

```go
    atomic.AddInt64(&counter, 1)
    // 当前 goroutine 从线程退出，并放回到队列
    runtime.Gosched()
```

- 互斥锁，互斥锁用于在代码上创建一个临界区，保证同一时间只有一个 goroutine 可以
  执行这个临界区代码。

```go
  var mutex sync.Mutex
  for count := 0; count < 2; count++ {
    // 同一时刻只允许一个 goroutine 进入
    // 这个临界区
    mutex.Lock()
    {
      // 捕获 counter 的值
      value := counter
      // 当前 goroutine 从线程退出，并放回到队列
      runtime.Gosched()
      // 增加本地 value 变量的值
      value++
      // 将该值保存回 counter
      counter = value
    }
    mutex.Unlock()
    // 释放锁，允许其他正在等待的 goroutine
    // 进入临界区
  }
```

#### 通道

对于共享资源，除了通过原子操作和锁之外，还一种更加利于开发并发的机制————通道，使用通道可以很方便的同步`goroutine`之间的数据。

- 无缓冲通道

```go
noBufChannel := make(chan string)
var ball string
noBufChannel <- "ping-pong"
ball, ok := <- noBufChannel
```

- 有缓存通道

```go
const (
  numberGoroutines = 4  // 要使用的 goroutine 的数量tf
  taskLoad         = 10 // 要处理的工作的数量
)
tasks := make(chan string, taskLoad)
```

## week 44

### js 中的 Reflect

Reflect 是 js 内置的全局对象，可以用来操作 js 的对象。

#### 特点

`Reflect`和`Math`一样，没有构造函数，只有静态方法。  
其提供的静态方法和`Proxy`的`handler`一模一样

#### 功能

可以*间接*操作对象，基本满足对象自身所需要的功能

#### 有点不同

没错，只有一点点细节不同，[看看细节](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Reflect/Comparing_Reflect_and_Object_methods)

## week 45

### API Gateway

API Gateway 即我们在架构图中常看到的 API 网关，它通常是一个客服端访问后端服务需要经过的关口。

#### 能够做什么

- 安全
- 限流
- 缓存
- 熔断
- 重试
- 负载
- 反向路由
- 认证、鉴权
- 日志收集和监控

#### 使用场景

- Open API

- 多端适配

- 微服务化

#### 市面上成熟的 API 网关

- apigee

- Kong

- APISIX

## week46

### 关于border-radius

css上频繁使用的属性，用来设置边框圆角

#### 它是简写

border-radius 包含  border-top-left-radius、border-top-right-radius、border-bottom-right-radius，和 border-bottom-left-radius。

#### 可以有两个值

一个值代表一个圆的半径，两个值代表一个椭圆的两个轴

```css
border-radius:10px/20px;
```

#### 可以是百分比

百分比的长度根据元素自身长宽的大小，单独用一个值是百分比时也表示一个椭圆。

```css
width:60px;

height:100px;
/* border-radius:6px/10px */
border-radius:10%; 
```

### 响应式设计模型

这里用四层维度来表示web响应式涉及到的内容

#### user preferrence

用户偏好，例如黑暗模式，静态模式，色盲模式这些可以直接设置在操作系统上的用户偏好

```css
@media (prefers-color-scheme:dark)
```

#### ViewPort&Form factors

屏幕视口和外形规格，例如苹果的刘海屏，三星的折叠瓶

```css
@media (spanning: single-fold-vertical) {
  --sidebar-width: env(fold-left);
}
```

#### Marco layout

页面的布局，例如不同屏幕大小下的页面的整体布局轮廓。

```css
@media
```

#### Container style

容器(页面内的元素、组件)在其不同的大小下的样式。

```css
@contaniner
```

### 匿名用户的标识

#### 什么是匿名用户

在客户端未登录的情况下使用，并能够被持久化记录的用户叫做匿名用户。

#### 匿名用户的场景

希望用户能够无障碍的使用产品的主要功能

#### 匿名用户如何生成

- 设备指纹  
  根据设备的硬件信息（主板UUID、CPU ID、BIOS序列号、MachineGUID）来标识一个设备的唯一用户

- 初次随机生成
  利用客户端的本次存储手段，在用户初次使用时直接生成一个标识存储在本地，用以之后的持久化记录

> 设备指纹是为了一个设备唯一用户，不过指纹也有错误、被盗用的可能。直接随机生成的方法则非常简单，不过一旦用户清楚本地数据该用户标识就会被清除。可根据自己的意图选择合适的标识方式。

### 语义化与搜索引擎 itemtype

## week 47

### 批处理的几种方式

#### 事务

在 react、mobx 中对特定方法通过标记实现事务，一事务完成后同一执行一次

```js
function runTransaction(fn) {
  isTransaction++
  fn()
  isTransaction--
  dealTranscation()
}
function dealTranscation(fn) {
  if (!isTransaction) {
    runCb()
  } else {
    cbList.push(fn)
  }
}
```

#### 异步

在 vue 中没有对特定的方法启用事务的形式，所有的 update 在异步之后归并处理

```js
function update() {
  if (!cbList.length) {
    nextTick(batchUpdate)
  } else {
    cbList.push()
  }
}
```
