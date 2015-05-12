function f () {
	var b = "b";
	return function () {
		return b;
	}
}

var n = f();

n();

// resultado: b