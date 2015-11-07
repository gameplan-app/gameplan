angular.module('gameplan.reservation', ['ui.bootstrap'])

.controller('reservationCtrl', ['$scope', '$filter', function($scope, $filter) {
  $scope.today = function() {
      $scope.dt = new Date();
    };
    $scope.printDate = function(){
      console.log($filter('date')($scope.dt, 'MMddyyyy'));
    }
    $scope.today();
    $scope.minDate = new Date();
}])

.factory('reservationFactory', ['$http', function($http){

  var service = {};
  

}])

