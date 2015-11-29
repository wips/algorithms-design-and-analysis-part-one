(function() {
    'use strict';
    var list = readInput()
        .split('\n')
        .filter(line => line !== '')
        .reduce(function(memo, line) {
            var edge = line
                .trim()
                .split(' ')
                .map(str => str.trim())
                .map(str => parseInt(str, 10));
            var from = edge[0] - 1;
            var to = edge[1] - 1;
            if (!memo[from]) {
                memo[from] = aNode(from);
            }
            if (!memo[to]) {
                memo[to] = aNode(to);
            }
            memo[from].direct.push(to);
            memo[to].reverse.push(from);
            return memo;
    }, []);

    console.log('List is ready. Size is', list.length);
    var originalList = list.map(node => node);
    console.log('original list is ready');

    var iDfs = dfsFactory(false, 1);
    list.forEach(iDfs);

    console.log('1st DFS run completed');
    list = list.sort((a, b) => b.order - a.order);

    console.log('sorting completed');

    var reverseDfs = dfsFactory(true, 2);
    var sccSize;
    var sccs = list
        .reduce(function(memo, node) {
            sccSize = 0;
            reverseDfs(node);
            memo.push({leader: node.name, size: sccSize});
            return memo;
        }, [])
        .sort((a, b) => b.size - a.size);

    var output = [];
    for (let i = 0; i < 5; i++) {
        output.push((sccs[i] || {size: 0}).size);
    }
    console.log(output.join());

    function aNode(name) {
        return {
            name,
            direct: [],
            reverse: [],
            visits: 0,
            order: -1
        };
    }
    function dfsFactory(isReverse, visitsNumber, isRecursive) {
        var order = 0;
        var field = isReverse ? 'reverse' : 'direct';
        if (!isRecursive) {
            return function iDfs(node) {
                var stack = [node];
                while (stack.length) {
                    let top = stack[stack.length - 1];
                    if (top.visits >= visitsNumber) {
                        let looser = stack.pop();
                        if (looser.order === -1) {
                            looser.order = order++;
                        }
                        continue;
                    }
                    top.visits++;
                    sccSize++;
                    top[field]
                        .filter(number => originalList[number].visits < visitsNumber)
                        .forEach(number => stack.push(originalList[number]));
                }
            };
        }
        return function dfs(node, recursionLevel) {
            if (node.visits < visitsNumber) {
                sccSize++;
                node.visits++;
                console.log(node.name);
                for (var i = 0; i < node[field].length; i++) {
                    try {
                        dfs(originalList[node[field][i]], (recursionLevel || 0) + 1);
                    } catch (e) {
                        console.log(recursionLevel);
                    }
                }
                node.order = order++;
            }
        };
    }
    function readInput() {


//        return `1 2
//2 3
//2 4
//2 5
//3 6
//4 5
//4 7
//5 2
//5 6
//5 7
//6 3
//6 8
//7 8
//7 10
//8 7
//9 7
//10 9
//10 11
//11 12
//12 10`;
//        return `1 2
//        2 1
//        1 3
//        1 5
//        3 4
//        2 4
//        5 4
//        6 5
//        6 7
//        5 7`;

        var fs = require('fs');
        //var input = fs.readFileSync('1').toString();
        var input = fs.readFileSync('./week4/SCC2.txt').toString();
        return input;
    }
})();