var app = angular.module('mainApp', ['ngRoute']);
  

app.config(function ($routeProvider, $locationProvider) {
    $routeProvider
	.otherwise({
		  redirectTo	: '/'
	});
	// use the HTML5 History API
	$locationProvider.html5Mode(true);
});


app.controller('homeCtrl', function ($scope,$http,$location,$route) {
	//Gen stuff
	$scope.IP = '10.10.3.37';
	
	//---------------------------------- START OF VOICE ------------------------------
	// For speech recognition
	$scope.micStatus = "mdi-av-mic-none";
	$scope.micHide = false;
	
	if (!('webkitSpeechRecognition' in window)) {
		$scope.micHide = true;
	  //upgrade();
	} else {
		var recognition = new webkitSpeechRecognition();
		recognition.continuous = true;
		recognition.interimResults = false;
		recognition.lang = 'en-US';
		recognition.onstart = function() { console.log('Voice Recognition Started'); };
		recognition.onresult = function(event) { 
		  console.log('Voice Recognition Result',event); 
		};
		recognition.onerror = function(event) { 
			$scope.micStatus = "mdi-av-mic-none";
			console.log('Error : ',event); 
		};
		recognition.onend = function() { 
	  		console.log('Voice recognition ended');
			$scope.$apply(function(){
				$scope.micStatus = "mdi-av-mic-none";
			});
			
		};
	}
	
	$scope.startVoiceSearch = function() {
		$scope.micStatus = "mdi-action-settings-voice";
		//recognition.end();
		recognition.start();
	};
	//---------------------------------- END OF VOICE ------------------------------
	
	
	//Form data to get query data
	$scope.message = 'Sorry.. Please recheck your sentence..';
    $scope.formData={};
	$scope.editTask = {};
	$scope.showTask = false;
    $scope.formData.query="";
	$scope.queryObjects={};
	//For menu
	$scope.gotoHome =function() {
		$scope.menuButtonClick(0);
		$location.path('/home');
	};
	$scope.menuBarButton=['menuSelected','',''];
	$scope.menuButtonClick = function(a) {
		
		$scope.menuBarButton=["","",""];
		$scope.menuBarButton[a]="menuSelected";
	};
	
	$scope.createNewTaskPopup = function() {
		
		$("#newTaskModal").modal({
								keyboard: false
		});
	};
	//------------------------------------------TASKS CRUD ---------------------------------
	$scope.getTasks = function(taskId) {
		$http.get('/api/tasks/'+taskId)
			.success(function(data) {
				console.log('task is eiether ',taskId);
				$scope.formData.query="";
				if (taskId==='') {
					//For all task
					$scope.showTask = false;
					$scope.showTaskList = true;
					$scope.taskList = data;
					$scope.edittable = false;
				} else {
					//If single tasks
					$scope.showTask = true;
					$scope.showTaskList = false;
					$scope.editTask = data;
					$scope.editTask.tn = capsFirst($scope.editTask.tn);
					$scope.editTask.td = capsFirst($scope.editTask.td);
					$scope.edittable = false;
					
				} 
			})
			.error(function(err){
				console.log(err);
			});
	};
	
	// Function to add a new task
	$scope.addNewTask = function() {
		$('#newTaskModal').modal('toggle');
		$http.post('/api/tasks', {tn:$scope.taskName.toLowerCase(),td:$scope.taskDesc.toLowerCase(),st:0})
		.success(function(data) {
				console.log('Task added ',data);
				$scope.getTasks($scope.taskName.toLowerCase());
				$scope.formData.query="";
			$scope.taskName = '';
			$scope.taskDesc = '';
		})
		.error(function(data) {
			console.log('Error: ' + data);
		});
		$route.reload();
	};
	
	$scope.updateTask = function() {
		//$('#newTaskModal').modal('hide');
		$http.post('/api/tasks', {tn:$scope.taskName,td:$scope.taskDesc,st:0})
		.success(function(data) {
				
			$scope.getTasks($scope.taskName);
					
		})
		.error(function(data) {
			console.log('Error: ' + data);
		});
		$route.reload();
	};
	//Delete task
	$scope.deleteTask = function(taskName) {
		$http.delete('/api/tasks/'+taskName)
			.success(function(data) {

				$scope.getTasks('');
				console.log('Deleted the task ',data);
				//$('#editTaskModal').modal('toggle');
			})
			.error(function(err){
				console.log(err);
			});
	};
	
	$scope.hideTaskDisplay = function() {
		$scope.showTask=false;
		$scope.formData.query="";
	};
	// 
	//------------------------------------------ SEARCH -------------------------------------
	
	$scope.capsFirst = function(n) {
		return n[0].toUpperCase()+n.slice(1);
	};
	//Function which performs search action
	$scope.searchAction = function() {
		console.log($scope.formData.query);
		console.log($scope.formData);
		$scope.formData.query = $scope.formData.query.toLocaleLowerCase();
		//Calling the InfoET API 
		$.ajax({
			url : "http://"+$scope.IP+":8080/extractInfo",
			type: "POST",
			data : {'inputData' : $scope.formData.query, 'dataType' : 'search'},
			success: function(data, textStatus, jqXHR)
			{
				console.log(data);
				$scope.$apply(function(){
					$scope.queryObjects = (data);
					//Do the corresponding action
					//$scope.reactToQuery(data);
					
					console.log('Reacted');
					console.log(data);
					//identify the objects
					var objExists = function(a,b) {
						if (a[b]===undefined) return false;
						return true;
					};

					//Objects in hierachial order
					O = [["task"],["name","description"]];
					var lastObj;
					for (var i in O) {
						for(var j in O[i]) {
							x = objExists(data, O[i][j]);
							//console.log(x,O[i][j]);
							if(x===false) {
								break; }
							lastObj = [O[i][j],i,j];
							console.log(lastObj);
						}
					}
					if(data[lastObj[0]] == lastObj[0]) {
						data[lastObj[0]] = '';
					}
					console.log('Action is', data.action);
					console.log('Actionable item is ',lastObj);
					console.log('Value of Actionable item is ', data[lastObj[0]]);
					//Identify the impact to the object
					action = data.action;	
					//Do the change
					flag=0;
					if(action=="create") {
						if(objExists(data,'task')){
							if (lastObj[0]=='task' && data.task!=='') {
								
								$scope.taskName = (data.task[0]).toUpperCase()+data.task.slice(1);
							} else {
								if(objExists(data,'name')) {
									$scope.taskName = (data.name[0]).toUpperCase()+data.name.slice(1);
								} else if (objExists(data,'description')) {
									$scope.taskDesc = data.description;
								}
							}
							$('#newTaskModal').modal('toggle');
							
						} else { flag=1;}

					} else if (action=="edit") {
						if (objExists(data,'task')) {
							$http.get('/api/tasks/'+data.task)
							.success(function(data1) {
								$scope.editTask = data1;
								$scope.showTask = true;
								$scope.showTaskList = false;
								$scope.edittable = true;
								console.log('Reached data for edit',data1);
								//$('#editTaskModal').modal('toggle');
								if (lastObj[0]=='task' && data.task!=='') { }
								else {
									if(objExists(data,'name')) {
										$scope.editTask.tn = data.name;
									} else if (objExists(data,'description')) {
										$scope.editTask.td = data.description;
									}
								}
							})
							.error(function(err){
								console.log(err);
							});
						}
					} else if (action=="read") {
						if (objExists(data,'task')) {
							console.log(data.task);
								$scope.getTasks(data.task);
						}

					} else if (action=="delete") {
						if (objExists(data,'task')) {
							console.log(data.task);
							if (data.task !== '') {
								$scope.taskName = data.task;
								$('#deleteModal').modal('toggle');
								//$scope.deleteTask(data.task);
							}
							else {
								console.log('Please specify the task name');
								$scope.message = 'Please specify the task name';
								flag = 1;
							}
							
						}
					} else {
						//Show the sorry pop-up
						flag=1;
					}
					if (flag==1) {
						$('#failModal').modal('toggle');
					} else {
						$scope.formData.query="";
					}
					
					
					
					
				});
			},
			error: function (jqXHR, textStatus, errorThrown)
			{
				console.log('Err : ',errorThrown);
			}
		});
		
	};
	
	
			   
});

