var fs = require('fs');
var data = fs.readFileSync('./week2/integerArray.txt');
list = data.toString().split('\n').map(function(item) {
    return parseInt(item);
});

var comparisons = [];
quickSort(list);
console.log(comparisons.reduce(function(acc, i) {return acc + i}, 0)/*, list*/);


function quickSort(list) {
    if (list.length === 0 || list.length === 1) {
        return list;
    }
    subSort(0, list.length - 1);

    function subSort(startIdx, endIdx) {
        if (startIdx >= endIdx || endIdx >= list.length) {
            return;
        }
        comparisons.push(endIdx - startIdx);
        //var pointIdx = partition(startIdx, endIdx);      // 0, 3, 6 - 0, 1, 2 - 0, 0, 0
        var pointIdx = timPartition(startIdx, endIdx);
        subSort(startIdx, pointIdx - 1);                 // 0, 2              - 2, 2, 2
        subSort(pointIdx + 1, endIdx);                   // 4, 6    = 4, 5, 6
    }

    function timPartition(startIdx, endIdx) {
        //console.log('[' + list.slice(startIdx, endIdx + 1).toString() + ']');
        var pivot;
        pivot = list[startIdx]; // first
        //pivot = list[endIdx]; swap(startIdx, endIdx); // last

        //var midIdx = startIdx + Math.floor((endIdx - startIdx) / 2);
        //var median = [list[midIdx], list[endIdx], list[startIdx]].sort(function(a, b) {
        //    return a - b;
        //})[1];
        //if (endIdx - startIdx < 2) {
        //    //median = Math.min(list[endIdx], list[startIdx]);
        //    median = list[startIdx];
        //}
        //var pivIdx = list.indexOf(median);
        //pivot = list[pivIdx];
        //swap(startIdx, pivIdx);

        var i = startIdx + 1;
        for (var j = startIdx + 1; j <= endIdx; j++) {
            if (pivot > list[j]) {
                swap(j, i);
                i++;
            }
        }
        swap(i - 1, startIdx);
        return i - 1;
    }

    function partition(startIdx, endIdx) {
        var pivotIdx = ptIdx(startIdx, endIdx);
        var pivot = list[pivotIdx];                             // 3
                                                                // [11, 8, 3, 42, 6]
        swap(startIdx, pivotIdx);                               // [3, 8, 11, 42, 6]
        var greaterIdx = -1;                                    //
        for (var i = startIdx + 1; i <= endIdx; i++) {          // i: 1
            if (list[i] < pivot && greaterIdx >= 0) {           // 8 < 3 && -1 >= 0
                swap(greaterIdx, i);                      //
                greaterIdx++;                                   //
            } else if (greaterIdx < 0 && list[i] > pivot) {     // -1 < 0 && 8 > 3
                greaterIdx = i;                                 // 1
            }
        }
        if (greaterIdx < 0) {
            swap(startIdx, endIdx);
            return endIdx;
        } else if (list[startIdx] > list[greaterIdx - 1]) {
            swap(startIdx, greaterIdx - 1);                     // [3, 8, 11, 42, 6]
            return greaterIdx - 1;
        } else {
            return startIdx;
        }
    }

    function swap(idxA, idxB) {
        var tmp = list[idxA];
        list[idxA] = list[idxB];
        list[idxB] = tmp;
    }

    function ptIdx(startIdx, endIdx) {
        return startIdx;
        return startIdx + Math.floor((endIdx - startIdx) / 2);
    }

}
