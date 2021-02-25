---
path: ""
date: "2019-08-12"
title: "Array.proporty.sort"
tags: ["快速排序", "插入排序"]
weather: ☁️
---

## js 中数组的 sort 的使用

接受回调函数 `compareFunction`，`compareFunction`参数为临近的两项，根据`compareFunction`执行的结果来决定两项的位置关系

```ts
function compare(a, b) {
  if (a < b) {
    // 按某种排序标准进行比较, a 小于 b
    return -1 // a会排在b的左边
  }
  if (a > b) {
    return 1 // a会排在b的右边
  }
  // a must be equal to b
  return 0 // a与b位置不换
}
```

sort 采用原地算法，直接对数组自身进行排序并返回
array.sort()

```ts
let numbers = [4, 2, 5, 1, 3]
numbers.sort((a, b) => a - b) // [1, 2, 3, 4, 5]
console.log(numbers)

// [1, 2, 3, 4, 5]
```

## sort 内部实现

如果 debug 过 sort 内部排序的细节，应该可以发现每次比较的数据项不一定都是相邻的,且它实现排序的方法是不一致的。这是因为 sort 在排序之前对数组做了一些处理，并且使用了两种排序方式。

### 排序前的处理

1.

- Let length be the value of the ”length” property of the array or object to sort.
- Let numberOfUndefineds be 0.
- For each value in the range of [0, length):
  - If value is a hole: do nothing
  - If value is undefined: increment numberOfUndefineds by 1.
  - Otherwise add value to a temporary list elements.

### 两种排序方式

参考[v8 的文档](https://v8.dev/blog/array-sort)，在 V8 v7.0 之前，sort 主要通过以 js 实现的`quickSort`及`insertedSort`来进行排序，而 V8 v7.0 之后，sort 则是使用在`Torque`实现的`timSort`来进行排序。

这里把三种排序都简单过一下

- 插入排序
  - 基本思想：左边放置排序好的数组，依次取出右边的项插入到左边。
  - 时间复杂度：n^2 (最差情况) n (最理想情况)
  - 空间复杂度：1 (与数组长度无关)

```python
def insertedSort(array):
    for i in range(len(array)):
        cur_index = i
        while array[cur_index-1] > array[cur_index] and cur_index-1 >= 0:
            array[cur_index], array[cur_index-1] = array[cur_index-1], array[cur_index]
            cur_index -= 1
    return array
```

- 快速排序
  - 基本思想：分而治之的递归，取一个作为中间值，遍历数组将较大值与较小值放置中间值的两边
  - 时间复杂度：nlog2 n
  - 空间复杂度：log2 (n+1) (最理想情况下的调用栈的深度)

```python
def insertedSort(array):
    middle_item = middle(array[0], array[len(array)//2],array[-1]) #确保以一个非最大最小的值作为中间划分值
    left_arr, right_arr = [], []
    array.remove(middle_item)
    for item in array:
        if item >= middle_item:
            right_arr.append(item)
        else:
            left_arr.append(item)
    return quick_sort(left_arr) + [mid] + quick_sort(right_arr)
```

- timSort
  timSort 是归并排序(mergeSort)的优化版，是目前效率最高的排序方式，由于实现过于复杂，这里就不写实现啦 😂

### 排序后的处理

After sorting is done, the sorted values have to be written back to the original array or object. The post-processing step consists of three phases that handle the conceptual segments:

- Write back all values from elements to the original object in the range of [0, elements.length).
- Set all values from [elements.length, elements.length + numberOfUndefineds) to undefined.
- Delete all values in the range from [elements.length + numberOfUndefineds, length).
