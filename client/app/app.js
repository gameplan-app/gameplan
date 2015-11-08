// A gameplan-app project
// =============================================================================

angular.module('gameplan', [
  'ngRoute',
  'ngCookies',
  'gameplan.home',
  'gameplan.reservation'
])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider
    .when('/home', {
      templateUrl: 'views/home/home.html',
      controller: 'homeCtrl'
    })
    .when('/reservation/:place_id', {
      templateUrl: 'views/reservation/reservation.html',
      controller: 'reservationCtrl'
    })
    .when('/account/:user_id', {
      templateUrl: 'views/account/account.html',
      controller: 'AccountController'
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
    };
    $scope.user = user;
    $scope.fbCookie = true;
  }

}]);
