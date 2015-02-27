app.filter('timeShow', function() {
	return function(n) {
		console.log(n);
		if (n.toString().search(':')>0) {
			return n;
		}
		else {
			var x=new Date(parseInt(n));
			return x.getHours() + ':' + x.getMinutes();
		}
	};
});