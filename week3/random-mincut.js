(function() {
    'use strict';

    var input =
    `6 13 15 7
     7 6 15 20
     13 6 8 15 20
     8 13 15 20
     15 6 7 8 20`;

    var fs = require('fs');
    var cluster = require('cluster');
    var numCPUs = require('os').cpus().length;
    input = fs.readFileSync('./week3/kargerMinCut.txt').toString();
    var iterations = 200;

    console.log('Before the fork');

    if (cluster.isMaster) {
        console.log('I am the master, launching ' + numCPUs + ' workers!');
        for (var j = 0; j < numCPUs; j++) {
            cluster.fork();
        }
    } else {
        var result = [];
        for (var i = 0; i <= iterations / numCPUs; i++) {
            var edges = EdgeSet();
            initEdgeSetWithInput(edges, input);
            maxContract(edges);
            result.push(edges.size);
            console.log(Math.min(...result), result.length, result.join());
        }
        console.log('I am a worker!');
    }

    console.log('After the fork');


    function maxContract(edges) {
        while(edges.isContractible()) {
            contract(edges);
            //console.log(edges, edges.size);
        }
    }

    function EdgeSet(list) {
        var aSet = new Set(list);
        aSet.add = function(from, to) {
            var normalized = [from, to].sort(numericSort);
            if (!this.contains(normalized)) {
                Set.prototype.add.call(this, normalized);
            }
        };
        aSet.contains = function(needle) {
            return this.has(needle) || Array.from(this).some(edge => edge[0] === needle[0] && edge[1] === needle[1]);
        };
        aSet.remove = function(toRemove) {
            if (this.has(toRemove)) {
                this.delete(toRemove);
            }
            for (let edge of this) {
                if (edge[0] === toRemove[0] && edge[1] === toRemove[1]) {
                    this.delete(edge);
                }
            }
            return this;
        };
        aSet.isContractible = function() {
            var list = Array.from(this);
            return !list.every(edge => list[0][0] === edge[0] && list[0][1] === edge[1]);
        };
        aSet.deleteLoops = function() {
            Array
                .from(this)
                .filter(edge => edge[0] === edge[1])
                .forEach(edge => this.delete(edge));
        };
        return aSet;
    }

    function initEdgeSetWithInput(edges, input) {
        input
            .split('\n')
            .map(line => line.trim())
            .forEach(function(line) {
                line
                    .split('\t')
                    .map(vertex => vertex.trim())
                    .map(vertex => parseInt(vertex, 10))
                    .forEach((vertex, index, vertices) => index > 0 && edges.add(vertices[0], vertex))
            });
    }

    function pickRandomEdge(edges) {
        //return Array.from(edges)[0];
        return Array.from(edges)[Math.floor(Math.random() * edges.size)];
    }

    function contract(edges) {
        var random = pickRandomEdge(edges);
        var edgesList = Array.from(edges);
        edgesList
            .filter(edge => edge[0] === random[1])
            .forEach(function(edge) {
                edge[0] = random[0];
                Array.prototype.sort.call(edge, numericSort);
            });
        edgesList
            .filter(edge => edge[1] === random[1])
            .forEach(function(edge) {
                edge[1] = random[0];
                Array.prototype.sort.call(edge, numericSort);
            });
        edges.deleteLoops();
    }

    function numericSort(a, b) {
        return a - b;
    }
})();
