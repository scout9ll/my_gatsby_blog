# king back to fed

## 底层抽象

### 渲染引擎

#### 几个规则

- dom如何结合css生成一个 rendertree
- rendertree 如何计算为被GPU识别的图形对象


### 首页优化

#### 资源压缩

#### 服务端渲染

#### 缓存

#### cdn

#### 异步加载

### 防抖

#### 主要思路

- 两个参数：函数、防抖间隔
- 一直清除间隔中的定时器，未被清除说明可以执行

```js
function debounce(func,wait){
    timeout = null
    return function (){
        const deal = ()=>{
            func.call(this,...arguments)
        }
         if(timeout) clearTimeout(timeout)
        timeout = setTimeout(deal,wait)
    }
}

```

#### 节流主要思路

- 第一次执行完wait时间后可执行
```js
function debounce(func,wait){
    timeout = true
    return function (){
        const deal = ()=>{
            func.call(this,...arguments)
        }
        if(timeout){
            timeout = false
            settimeout(){
                timeout = true
            ,wait}
            deal()
        }
    }
}
```