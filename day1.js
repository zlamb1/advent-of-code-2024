const fs = require('fs');

function readNumber(str) {
    let numberString = '';


    let i;
    for (i = 0; i < str.length; i++) {
        const c = str.charAt(i);
        if (c < '0' || c > '9') {
            break;
        }
        numberString += str.charAt(i); 
    }
    
    return {num: Number(numberString), remainder: str.substring(i)};
}

function binarySearch(el, arr) {
    let low = 0, high = arr.length - 1;
    while (low <= high) {
        const mid = Math.floor(low + (high - low) / 2);
        const cmp = el - arr[mid];
        if (cmp > 0) {
            low = mid + 1;
        } else if (cmp < 0) {
            high = mid - 1;
        } else {
            return mid;
        }
    }

    return -(low + 1);
}

fs.readFile('day1.txt', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    
    const list1 = [], list2 = [];
    const entries = data.split('\n');
    for (const entry of entries) {
        const {num: num1, remainder} = readNumber(entry);
        list1.push(num1);
        const {num: num2} = readNumber(remainder.trim()); 
        list2.push(num2);
    }

    list1.sort();
    list2.sort();

    let sum = 0;
    for (let i = 0; i < list1.length; i++) {
        const el = list1[i];
        let index = binarySearch(el, list2), occurrences = 0;
        if (index >= 0) {
            while (index > 0 && list2[index - 1] == el) index--;
            while (list2[index++] == el && ++occurrences && index < list2.length);
        }
        list1[i] *= occurrences;
        sum += list1[i];
    }
    
    console.log(sum);
  });