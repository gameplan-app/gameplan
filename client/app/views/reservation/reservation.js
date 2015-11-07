angular.module('gameplan.reservation', ['ui.bootstrap'])

.controller('reservationCtrl', ['$scope', '$filter', 'reservationFactory', function($scope, $filter, reservationFactory) {

  $scope.today = function() {
      $scope.dt = new Date();
    };
  $scope.loadTimes = function(){
    var date = $filter('date')($scope.dt, 'MMddyyyy')
    reservationFactory.getTimes(date, null, function(response){
      console.log(response);
    })
  }

  $scope.today();
  $scope.minDate = new Date();
  console.log($filter('date')($scope.dt, 'MMddyyyy'));
}])

.factory('reservationFactory', ['$http', function($http){

  var service = {};
  service.getTimes = function(date, venue, callback){
    $http({
      url: '/reserve',
      method: 'GET',
      // params is how you pass data on a get request with angular
      params: {site_name: venue, date: date}
    }).then(function successCallback(response){
      callback(response)
    }, function errorCallback(response) {
      callback(response)
    });
  }
  return service;
}])

