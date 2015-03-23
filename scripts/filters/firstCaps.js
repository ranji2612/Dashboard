app.filter('firstCaps', function() {
	return function(n) {
		return n[0].toUpperCase()+n.slice(1);
	};
});