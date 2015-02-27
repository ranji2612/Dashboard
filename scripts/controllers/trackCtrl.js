app.controller( 'trackCtrl', function ($scope, FlightTrack, FlightRateChange) {
	$scope.formData={};
	//Functions
	$scope.swapLoc = function() {
		// Swaping the From and To comboboxes
		t = $('#fromLoc').val();
		console.log($('#toLoc').val());
		if ($('#toLoc').val() !== null)
			$('#fromLoc').val($('#toLoc').val());
		else {
			$('#fromLoc').data('combobox').clearTarget();
			$('#fromLoc').data('combobox').clearElement();
		}
		$('#fromLoc').data('combobox').refresh();
		if (t !== null)
			$('#toLoc').val(t);
		else {
			$('#toLoc').data('combobox').clearTarget();
			$('#toLoc').data('combobox').clearElement();
		}
		$('#toLoc').data('combobox').refresh();
	};
	


	$(".pickadate").datepicker({
		multidate: true,
		todayBtn: "linked",
		todayHighlight: true,
		clearBtn: true});
	$('.combobox').combobox();
	
	//List of Form Errors
	$scope.formErrors = [];
	//Boolean Variable regarding forms validity
	$scope.isFormValid = true;
	//Generalised Function to add error and message
	$scope.addError = function(msg) {
		$scope.isFormValid = false;
		$scope.formErrors.push(msg);
	};
	//Function to check Validity of the Form
	$scope.checkFormValidity = function () {
		//Basic
		$scope.formData.fromLoc = $('#fromLoc').val();
		$scope.formData.toLoc = $('#toLoc').val();
		//Resetting
		$scope.formErrors = [];
		if (($scope.formData.fromLoc === null)||($scope.formData.toLoc === null)) 
			$scope.addError("Invalid From or To Location!");
		else if ($scope.formData.fromLoc == $scope.formData.toLoc)
			$scope.addError("From and To Locations are same");
		if (((typeof $scope.formData.thRate != "undefined")&&($scope.formData.thRate !== ""))&&(isNaN($scope.formData.thRate)))
			$scope.addError("Invalid input in 'Threshold Amount'!");
		//Hiding in case of no errors
		if ($scope.formErrors.length === 0 )
			$scope.isFormValid = true;
	};
	
	//Track Action
	$scope.trackAction = function () {
		//Form Validity Check
		$scope.checkFormValidity();
		//Date Conversion
		$scope.convertDateDataType();
		console.log($scope.formData);
		
		FlightTrack.post($scope.formData)
			.success( function(data, res) {
				// Filtering based on threshold Rate
				// Can be put on server side also
				if ((typeof $scope.formData.thRate != "undefined")&&($scope.formData.thRate!=="")) {
					l = data.length;
					$scope.results=[];
					for(i=0;i<l;i++) {
						if (data[i].rec[data[i].cc].amt < $scope.formData.thRate)
							$scope.results.push(data[i]);
					}
				}
				else 
					$scope.results=data;
				console.log($scope.results);
			});
	};
	
	//Changing the type from date to string
	//P.S could be changed in Future .. Currently DB has String dates
	$scope.convertDateDataType = function() {
		var dates = $('.pickadate').datepicker('getDates');
		function pad(s) { return (s < 10) ? '0' + s : s; }
		var i=0;
		$scope.formData.dateList=[];
		for(i=0;i<dates.length;i++)
		{
			$scope.formData.dateList.push( pad(dates[i].getDate())+'/'+pad(dates[i].getMonth()+1)+'/'+dates[i].getFullYear() );
		}
		//Incase no date selected - default 3 month Graph
	};
	
	// Result Row Controls
	$scope.currentSelection=-1;
	$scope.rowSelect = function(rowNum) {
		if ($scope.currentSelection != rowNum) {
			//Resetting selected tab to 1st tab, else the previous selection persists and results in error
			$scope.currentTabSelection = 0;
		}
		$scope.currentSelection=rowNum;
		
	};
	
	$scope.isSelected = function(rowNum) {
		if ($scope.currentSelection==rowNum)
			return true;
		return false;
	};
	
	$scope.hideRowDetails = function() {
		$scope.currentSelection=-1;
	};
	
	// Internal Row tab selection
	$scope.currentTabSelection = 0;
	$scope.rowTabSelect = function(rowNum) {
		$scope.currentTabSelection=rowNum;
	};
	
	$scope.isRowTabSelected = function(rowNum) {
		if ($scope.currentTabSelection==rowNum)
			return 'active';
		return '';
	};
	
	// Past Flight Rate record for the date selected by the user
	$scope.priceChangeCurve = function(date) {
		console.log('Requesting Graph .. on ..',date);
		FlightRateChange.post({date:date})
		.success(function(data) {
			console.log(data);
			drawChart(data);
		})
		.error(function(err) {
			console.log(err);
		});
	};
      


google.load('visualization', '1', {packages: ['corechart']});
function drawChart(priceData) {
	//Google Graph
	
	  
      var data = new google.visualization.DataTable();
	//Graph Columns with data types
      data.addColumn('date', 'Time');
      data.addColumn('number', 'Cheapest Rate');
	  //converting it for Graph
	  graphData=[];
	  for(i=0;i<priceData.length;i++) {
		  y=Math.round(priceData[i].rec[priceData[i].cc].amt);
		  //Getting date from YYYYMMDDHHHMMMSSS format Eg. 2014111601H31M17S
		  x=new Date(priceData[i].drt.slice(0,4)+'-'+priceData[i].drt.slice(4,6)+'-'+priceData[i].drt.slice(6,8)+'T'+priceData[i].drt.slice(8,10)+':'+priceData[i].drt.slice(11,13)+':'+priceData[i].drt.slice(14,16)+'+05:30');
		  graphData.push([x,y]);
	  }
	  data.addRows(graphData);
      var options = {
        width: 1000,
        height: 363,
        hAxis: {
          title: 'Time'
        },
        vAxis: {
          title: 'Cheapest Rate on '+priceData[0].date+' over the time'
        }
      };

      var chart = new google.visualization.LineChart(
        document.getElementById('ex0'));

      chart.draw(data, options);

    }
});