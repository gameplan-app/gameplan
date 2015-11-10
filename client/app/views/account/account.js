angular.module('gameplan.account', [])

.controller("AccountController", ["$scope", "$location", "Account", function($scope, $location, Account) {
  $scope.reservations = [];
  $scope.loadReservations = function() {
    Account.loadReservations($scope.user.fbUserId, function(res) {
      res.forEach(function(r){
        str = moment(r.date).format("DDMMYYYY") + r.time;
        r.date = moment(str, "DDMMYYYYHH").calendar();
        r.names = [];
        r.usersInvited.forEach(function (user){
          r.names.push(user.name);
        })
        r.names = r.names.join(", ");
        $scope.reservations.push(r);
        
      })
    })
  };

  $scope.loadReservations();
}])

.factory("Account", ["$http", function($http) {
  var loadReservations = function(user, callback) {
    $http({
        url: "/account",
        method: "GET",
        params: ({
          user_fb_id: user
        })
      })
      .then(function successCallback(resp) {
        callback(resp.data);
      }, function errorCallback(resp) {
        console.log(resp.status, "failed to fetch user reservations");
      })
  };

  return {
    loadReservations: loadReservations
  };
}])
