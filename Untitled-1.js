const list = [12, 354, 32, 32, 11, 11]

function sortFuc(list) {
    if (list.length <= 1) return list
    const midIndex = Math.floor(list.length / 2)
    const midItem = list[midIndex]
    const leftArary = [], rightArray = []
    for (let index = 0; index < list.length; index++) {
        if (index == midIndex) continue
        const currentItem = list[index]
        if (currentItem > midItem) {
            rightArray.push(currentItem)
        } else {
            leftArary.push(currentItem)
        }
    }
    return [...sortFuc(leftArary), midItem, ...sortFuc(rightArray)]
}

console.log(sortFuc(list))

const listB = [12, 32, 11]

function checkInculde(listA, listB) {
    let indexB = 0
    for (let index = 0; index < listA.length; index++) {
        if (listA[index] == listB[indexB]) indexB++
    }
    return indexB == listB.length
}
console.log(checkInculde(list, listB))

function checkBlock(str) {
    if (str.length == 0) return true
    const blocKList = ["[]", "{}", "()"]
    const noBlock = blocKList.every((block) => {
        const oldStr = str
        str = str.replaceAll(block, '')
        return oldStr == str
    })
    if (noBlock) return false
    return checkBlock(str)
}

console.log(checkBlock("({}[]{)}{}"))
