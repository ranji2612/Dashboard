app.controller('indexCtrl', function($scope, $http) {
	$scope.startFunc = function() {
		$http.get('/api/tasks')
			.success(function(data) {
				$scope.tasks = data;
				console.log(data);
			})
			.error(function(err){
				console.log(err);
			});
	};
	$scope.startFunc();
	
});