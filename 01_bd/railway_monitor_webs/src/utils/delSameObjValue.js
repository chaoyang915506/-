// delSameObjValue 数组对象相同值相加去重
// arr 需要处理的数组
// keyName 用于判断相同的键名
// keyValue 用于计算的键值
// 
export function delSameValue(arr, keyName, keyValue) {
let baseArr = [],
newArr = [];
for (let key in arr) {
if (baseArr.includes(arr[key][keyName])) {
  newArr[baseArr.indexOf(arr[key][keyName])][keyValue] +=
    arr[key][keyValue];
} else {
  baseArr.push(arr[key][keyName]);
  newArr.push(arr[key]);
}
}
return newArr;
}