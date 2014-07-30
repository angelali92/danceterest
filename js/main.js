// Angular JS.
var app = angular.module('pinterestApp', ['firebase', 'ngSanitize']);
app.controller('PinCtrl', ['$scope', '$firebase', '$sce', '$firebaseSimpleLogin',
	function ($scope, $firebase, $sce, $firebaseSimpleLogin) {

	var pinsRef = new Firebase("https://angelapinterest.firebaseio.com/");
	$scope.sce = $sce;
	$scope.auth = $firebaseSimpleLogin(pinsRef);

	// Create blank form variables.
	$scope.newPinName = "";
	$scope.newPinType = "";
	$scope.newPinUrl = "";

	// Define pinTypes array.
	$scope.pinTypes = ["Ballet"];

	// Define pins variable. Array of Objects.
	$scope.pins = $firebase(pinsRef);

	$scope.loginWithFacebook = function() {
		$scope.auth.$login("facebook").then(function(user) {
			console.log("Logged in as: " + user.uid);
		}, function(error) {
			console.error("Login failed: " + error);
		});
	}

	$scope.addNewItem = function() {
		// Check to see if any of the form is blank
		if($scope.newPinName != "" &&
		   $scope.newPinType != "" &&
		   $scope.newPinUrl != "") {
				//add the new pin to the pins array in our model
				$scope.pins.$add({ name: $scope.newPinName,
								   type: $scope.newPinType,
								   url: $scope.newPinUrl,
								   pinned: false});
				//reset the new pin variables
				$scope.newPinName = "";
				$scope.newPinType = "";
				$scope.newPinUrl = "";
		}	
		//else, the form is blank alert the user
		else {
			alert("Please fill in all fields.");
		}

		$scope.myVisible0 = !$scope.myVisible0;
	};
}]);

