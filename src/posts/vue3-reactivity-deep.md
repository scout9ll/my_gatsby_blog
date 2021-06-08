### vue 怎么找到正在运行的代码

```js
// Maintain a stack of running effects
const runningEffects = []

const createEffect = fn => {
  // Wrap the passed fn in an effect function
  //  closure fn
  const effect = () => {
    runningEffects.push(effect)  
    fn()
    runningEffects.pop()
  }

  // Automatically run the effect immediately
  effect()
}
```

通过`effect`包裹来标记代码

### 如何跟踪变化

```js
const dinner = {
  meal: "tacos",
}

const handler = {
  get(target, property, receiver) {
    track(target, property)
    return Reflect.get(...arguments)
  },
  set(target, property, value, receiver) {
    trigger(target, property)
    return Reflect.set(...arguments)
  },
}

const proxy = new Proxy(dinner, handler)
console.log(proxy.meal)

const targetMap = new WeakMap()

function track(target, property) {
  let depsMap = targetMap.get(target)
  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()))
  }
  let dep = depsMap.get(key)
  if (!dep) {
    depsMap.set(key, (dep = new Set()))
  }
  dep.add(...runningEffects)
}

function trigger(target, property) {
  let depsMap = targetMap.get(target)
  let dep = depsMap.get(key)
  const run = effect => {
    if (effect.options.onTrigger) {
      effect.options.onTrigger({
        effect,
        target,
        key,
        type,
        newValue,
        oldValue,
        oldTarget,
      })  
    }
    if (effect.options.scheduler) {
      effect.options.scheduler(effect)
    } else {
      effect()
    }
  }
  dep.forEach(run)
}
```
