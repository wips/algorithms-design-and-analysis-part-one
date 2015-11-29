var MySet = function(){};
var YourSet = function () {};
YourSet.prototype.del = function() {};


MySet.prototype = Object.create(YourSet.prototype);
MySet.prototype.constructor = MySet;

MySet.prototype.add = function(a) {
    YourSet.prototype.del.call(this, a);
};



var aset = new MySet();
console.log(aset instanceof YourSet);
aset.add(1);