var fs = require('fs');
var inversions = 0;


fs.readFile('IntegerArray.txt', {flag: 'r'}, function(err, data) {
    if (err) throw err;
    var list = data.toString().split('\n').map(function(integer) {
        return parseInt(integer, 10);
    });
    //list = [ 4, 80, 70, 23, 9, 60, 68, 27, 66, 78, 12, 40, 52, 53, 44, 8, 49, 28, 18, 46, 21, 39, 51, 7, 87, 99, 69, 62, 84, 6, 79, 67, 14, 98, 83, 0, 96, 5, 82, 10, 26, 48, 3, 2, 15, 92, 11, 55, 63, 97, 43, 45, 81, 42, 95, 20, 25, 74, 24, 72, 91, 35, 86, 19, 75, 58, 71, 47, 76, 59, 64, 93, 17, 50, 56, 94, 90, 89, 32, 37, 34, 65, 1, 73, 41, 36, 57, 77, 30, 22, 13, 29, 38, 16, 88, 61, 31, 85, 33, 54];
    //list = [9, 12, 3, 1, 6, 8, 2, 5, 14, 13, 11, 7, 10, 4, 0];
    //list = [1,3,7,5,2,4,6];
    //list = [18, 22, 4, 29, 15, 21, 13, 24, 20, 10, 11, 26, 27, 16, 12, 8, 25, 14, 6, 17, 30, 9, 28, 5, 2, 1, 23, 7, 19, 3];
    //list = [1, 3, 4, 2];
    //list = [1,6,3,2,4,5];

    //console.log(list);
    var start = new Date().getMilliseconds();
    console.log('bf:', bruteForce(list));
    var end = new Date().getMilliseconds();
    mergeSort(list);
    var e2 = new Date().getMilliseconds();

    console.log(end - start, e2 - end, inversions);

});

function bruteForce(list) {
    var inv = 0;
    for (var i = 0; i < list.length; i++) {
        for (var j = i + 1; j < list.length; j++) {
            if (list[i] > list[j]) {
                inv++;
            }
        }
    }
    return inv;
}

function mergeSort(list) {
    if (list.length === 0 || list.length === 1) {
        return list;
    }
    var midIdx = middleIdx(0, list.length - 1);     // 1
    s(list, 0, midIdx);                             // [2, 3, 1], 0, 1
    s(list, midIdx + 1, list.length - 1);           // [2, 3, 1], 2, 2
    m(list, 0, midIdx, list.length - 1);        // [], 0, 2, 2

    function s(list, from, to) {
        if (from >= to) {
            return;
        }
        var middle = middleIdx(from, to);
        s(list, from, middle);
        s(list, middle + 1, to);
        m(list, from, middle, to);
    }

    function m(list, start, mid, end) {            // [2, 3, 1], 0, 1, 2
        var temp = new Array(end - start + 1);     // 2 - 0 + 1 = 3
        for (var i = 0; i < temp.length; i++) {    //
            temp[i] = list[start + i];
        }
        cp(list, start, temp, mid - start);        // [], 0, t[2,3,1], 1
    }

    function cp(list, start, helper, helperMid) {   // [2,3,1], 0, [2,3,1], 1
        var left = 0;
        var right = helperMid + 1;                              // 2
        var listIdx = start;                                    // 0
        while (left <= helperMid && right < helper.length) {    //
            if (helper[left] < helper[right]) {
                list[listIdx] = helper[left];
                left++;
            } else {
                list[listIdx] = helper[right];                  // [1,2,3]
                var discovered = helperMid - left + 1;
                //if (helper[right] <= helper[left]) {
                //    console.log('n: ', helper[left], helper[right], left, right, helper);
                //}
                //console.log('n: ', helperMid, left, discovered);
                inversions += discovered;
                right++;
            }
            listIdx++;
        }
        while (left <= helperMid) {
            list[listIdx] = helper[left];
            listIdx++;
            //console.log('a: ', helper[helperMid], helper[left], left, helperMid, helper);
            //console.log('a: ', helper[left], helper[right], left, right, helper);
            //inversions += helperMid - left;
            left++;
        }
    }

    function middleIdx(from, to) {
        return from + Math.floor((to - from) / 2);
    }
}
