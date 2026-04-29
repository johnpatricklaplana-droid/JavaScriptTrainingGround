const nums = ["a", "b", "a", "c", "b", "a"];

const result = nums.reduce((acc, item) => {
    if(acc.has(item)) {
        acc.set(item, acc.get(item) + 1);
    } else {
        acc.set(item, 1);
    }
    return acc;
}, new Map());

console.log(result);