// A gameplan-app project
// =============================================================================

angular.module('gameplan', [
  'ngRoute',
  'ngCookies',
  'gameplan.home',
  'gameplan.reservation'
])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.o
  $routeProvider
    .when('/home', {
      templateUrlhome/home.html',
      controller: 'homeCtrl'
    })
    .when('/reservation', {
      templateUrl: 'views/reservation/reservation.html',
      controller: ''
    })
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
