app.factory( 'FlightTrack', function($http) {
	return {
		post : function (postData) {
			return $http.post('/api/flightTrack', postData);
		}
	};
});