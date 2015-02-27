app.factory( 'FlightRateChange', function($http) {
	return {
		post : function (postData) {
			return $http.post('/api/flightTrack/rateChange', postData);
		}
	};
});