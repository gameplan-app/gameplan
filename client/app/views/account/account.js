angular.module('gameplan.account', [])

.controller("AccountController", ["$scope", "$location", "Account", function($scope, $location, Account) {
  $scope.loadReservations = function() {
    Account.loadReservations($scope.user.fbUserId, function (res) {
      console.log(res);
    })
  };

  $scope.loadReservations();
}])

.factory("Account", ["$http", function($http) {
  var loadReservations = function (user) {
    $http({
      url: "/account",
      method: "GET",
      params: ({
        user_fb_id: user 
      })
    })
    .then(function successCallback(resp) {
      console.log("Resp", resp);
      return resp;
    }, function errorCallback(resp) {
      console.log(resp.status, "failed to fetch user reservations");
    })};

    return {loadReservations: loadReservations};
  }
])
