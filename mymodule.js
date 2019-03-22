console.log("test");
var sayHello = function() {
	console.log("Hello");
}

var sayGoodBye = function(){
	console.log("GoodBye");
}

exports.sayHello = sayHello;
exports.sayGoodBye = sayGoodBye;