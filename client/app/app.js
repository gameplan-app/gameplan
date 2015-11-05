// A gameplan-app project
// =============================================================================

angular.module('myApp', [
  'ngRoute',
  'ngCookies',
  'myApp.home'
])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider
    .otherwise({
      redirectTo: '/home'
    });
}])

.controller('mainController', ['$scope', '$cookies', function($scope, $cookies) {

  // COOKIES
  $scope.fbCookie = false;
  var fbCookie = $cookies.get('facebook'); // get cookie from FB

  if (fbCookie) {
    fbCookie = fbCookie.split('j:');
    fbCookie = JSON.parse(fbCookie[1]); // parse the cookie

    var user = {
      'fbUserId': fbCookie.fbId,
      'fbUserName': fbCookie.fbUserName,
      'fbPicture': fbCookie.fbPicture
    }
    $scope.user = user;
    $scope.fbCookie = true;
  }

}]);
