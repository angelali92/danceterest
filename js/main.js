// Angular JS.
var app = angular.module('pinterestApp', ['firebase', 'ngSanitize']);
app.controller('PinCtrl', ['$scope', '$firebase', '$sce', '$firebaseSimpleLogin',
	function ($scope, $firebase, $sce, $firebaseSimpleLogin) {

	var pinsRef = new Firebase("https://angelapinterest.firebaseio.com/pins/");
	var accountsRef = new Firebase("https://angelapinterest.firebaseio.com/accounts/");

	$scope.sce = $sce;
	$scope.auth = $firebaseSimpleLogin(pinsRef);

	// Create blank variables.
	$scope.searchText = "";
	$scope.newPinName = "";
	$scope.newPinType = "";
	$scope.newPinUrl = "";
	$scope.currentCategory = "";
	$scope.zoomPic = "";

	// Create show booleans.
	$scope.isPins = true;
	$scope.isCat = false;
	$scope.isBoard = false;

	// Define pinTypes array.
	$scope.pinTypes = [];

	// Define account picture.
	$scope.accountImg = "img/babysis.png";

	// Link to Firebase
	$scope.pins = $firebase(pinsRef).$asArray();

	pinsRef.on("child_added", function(snapshot){
		var newType = snapshot.val().type;
		var isOld = false;

		angular.forEach($scope.pinTypes, function(pinType) {
			if(newType === pinType)
				isOld = true;
		});
		if(!isOld)
			$scope.pinTypes.push(newType);
	});

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

	$scope.setZoomPic = function(url) {
		// alert("img: " + url);
		$scope.zoomPic = url;
	};

	$scope.removePin = function(pin) {
		if(confirm("Are you sure you want to delete this pin?")) {
			var itemRef = new Firebase("https://angelapinterest.firebaseio.com/pins/" + pin.$id);
			itemRef.remove();
		}
	};

	$scope.pinIt = function(pin) {
		// Change the value for "pinned" to "true".
		var itemRef = new Firebase("https://angelapinterest.firebaseio.com/pins/" + pin.$id);
		var tempPin = $firebase(itemRef);
		tempPin.$update({pinned: true});
	};

	$scope.removeFavPin = function(pin) {
		// Change the value for "pinned" to "true".
		var itemRef = new Firebase("https://angelapinterest.firebaseio.com/pins/" + pin.$id);
		var tempPin = $firebase(itemRef);
		tempPin.$update({pinned: false});
	};

	$scope.showBoard = function() {
		$scope.isBoard = true;
		$scope.isPins = false;
		$scope.isCat = false;

		window.setTimeout(function() {
			document.getElementById("favBoard").className = "columns";
		},1000);

		document.getElementById("favBoard").className = "columns animated bounceInDown";
	};

	$scope.showCat = function(cat) {
		$scope.currentCategory = cat;

		$scope.isCat = true;
		$scope.isPins = false;
		$scope.isBoard = false;
		
		window.setTimeout(function() {
			document.getElementById("catBoard").className = "columns";
		},1000);

		document.getElementById("catBoard").className = "columns animated bounceInDown";		
	}

	$scope.showPins = function() {
		$scope.isPins = true;
		$scope.isBoard = false;
		$scope.isCat = false;
		
		window.setTimeout(function() {
			document.getElementById("pinBoard").className = "columns";
		},1000);

		document.getElementById("pinBoard").className = "columns animated bounceInDown";	
	};

	$scope.getBoard = function() {
		return $scope.isBoard;
	};

	$scope.getPins = function() {
		return $scope.isPins;
	};


}]);

