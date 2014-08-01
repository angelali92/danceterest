// Angular JS.
var app = angular.module('pinterestApp', ['firebase', 'ngSanitize']);
app.controller('PinCtrl', ['$scope', '$firebase', '$sce', '$firebaseSimpleLogin',
	function ($scope, $firebase, $sce, $firebaseSimpleLogin) {

	var pinsRef = new Firebase("https://angelapinterest.firebaseio.com/pins/");
	var boardRef = new Firebase("https://angelapinterest.firebaseio.com/board/");
	var accountsRef = new Firebase("https://angelapinterest.firebaseio.com/accounts/");

	$scope.sce = $sce;
	$scope.auth = $firebaseSimpleLogin(pinsRef);

	// Create blank form variables.
	$scope.newPinName = "";
	$scope.newPinType = "";
	$scope.newPinUrl = "";

	// Define pinTypes array.
	$scope.pinTypes = [];
	$scope.boards = [];

	// Define account picture.
	$scope.accountImg = "img/babysis.png";

	// Link to Firebase
	$scope.pins = $firebase(pinsRef).$asArray();
	// $scope.boards = $firebase(boardRef).$asArray();

	// pinsRef.once("value", function(allsnapshot){
	// 	var pinned = [];
	// 	allsnapshot.forEach(function(snapshot){
	// 		if(snapshot.child('pinned').val())
	// 			pinned.push(snapshot.val());
	// 	});

	// 	boardRef.set(pinned);
	// });	

	pinsRef.on("child_added", function(snapshot){
		var newType = snapshot.val().type;
		var isOld = false;
		var isPinned = snapshot.val().pinned;

		angular.forEach($scope.pinTypes, function(pinType) {
			if(newType === pinType)
				isOld = true;
		});
		if(!isOld)
			$scope.pinTypes.push(newType);

		if(isPinned)
			$scope.boards.push(snapshot.val());
	});

	pinsRef.on("child_removed", function(snapshot){
		if(snapshot.val().pinned)
		{
			for(var i = 0; i < $scope.boards.length; i++) {
				if(snapshot.val().name === $scope.boards[i].name &&
				   snapshot.val().type === $scope.boards[i].type &&
				   snapshot.val().url === $scope.boards[i].url) {
				   	alert("values are true");
					$scope.boards.splice(i,1);
				}
			}
		}
	})	

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

	$scope.removePin = function(pin) {
		if(confirm("Are you sure you want to delete this pin?")) {
			var itemRef = new Firebase("https://angelapinterest.firebaseio.com/pins/" + pin.$id);
			itemRef.remove();
		}
	}

	$scope.pinIt = function(pin, name, type, url) {
		// Add to your board.
		$scope.boards.push({ name: name,
						   type: type,
						   url: url
						});

		// Change the value for "pinned" to "true".
		var itemRef = new Firebase("https://angelapinterest.firebaseio.com/pins/" + pin.$id);
		var tempPin = $firebase(itemRef);
		tempPin.$update({pinned: true});
	}
}]);

