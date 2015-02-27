//'use strict';

app.filter('dispDateFormat', function() {
	function pad(s) { return (s < 10) ? '0' + s : s; }
	return function(givenDate, reqInfo) {
		if (reqInfo=='date') {
			givenDate=new Date(givenDate);
			var days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
			var month =["January","February","March","April","May","June","July","August","September","October","November","December"];
			return days[givenDate.getDay()]+', '+givenDate.getDate()+' '+month[givenDate.getMonth()]+', '+givenDate.getFullYear();
		}
		if (reqInfo=='time') {
			givenDate=new Date(givenDate);
			return pad(givenDate.getHours())+':'+pad(givenDate.getMinutes());
		}
	};
});