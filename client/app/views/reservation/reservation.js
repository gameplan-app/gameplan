angular.module('gameplan.reservation', ['ui.bootstrap'])

.controller('reservationCtrl', ['$scope', '$filter', '$location', 'reservationFactory', function($scope, $filter, $location, reservationFactory) {

  $scope.today = function() {
    $scope.dt = new Date();
  };
  $scope.loadTimes = function() {
    var date = $filter('date')($scope.dt, 'MMddyyyy')
    var venue = $location.url().split("/")[2];
    reservationFactory.getTimes(date, venue, function(response){
      console.log(response);
    });
  };

  $scope.today();
  $scope.minDate = new Date();
  console.log($filter('date')($scope.dt, 'MMddyyyy'));

//needed for buttons
  $scope.checkModel = {
    '9': false,
    '10': false,
    '11': false,
    '12': false,
    '1': false,
    '2': false,
    '3': false,
    '4': false,
    '5': false
  };

  $scope.checkResults = [];

  //add available times to checkResults
  $scope.$watchCollection('checkModel', function() {
    $scope.checkResults = [];
    angular.forEach($scope.checkModel, function(value, key) {
      if (value) {
        $scope.checkResults.push(key);
      }
    });
  });

  //disable times for buttons which are taken
  $scope.takenHoursObj = {
    '9': true
  };

  $scope.takenCheck = function(takenHours) {
    //write into obj from array of hours which are taken
    _.each(takenHours, function(item) {
      $scope.takenHoursObj[item] = true;
    });

    return $scope.takenHoursObj;
  };


}])

.factory('reservationFactory', ['$http', function($http) {

  var service = {};
  service.getTimes = function(date, venue, callback) {
    $http({
      url: '/reserve',
      method: 'GET',
      // params is how you pass data on a get request with angular
      params: {
        site_name: venue,
        date: date
      }
    }).then(function successCallback(response) {
      callback(response)
    }, function errorCallback(response) {
      callback(response)
    });
  }

  // //send selected times to database
  // service.sendTimes = function(date, venue, callback) {
  //   $http({
  //     url: '/reserve',
  //     method: 'GET',
  //     // params is how you pass data on a get request with angular
  //     params: {
  //       site_name: venue,
  //       date: date
  //     }
  //   }).then(function successCallback(response) {
  //     callback(response)
  //   }, function errorCallback(response) {
  //     callback(response)
  //   });
  // }
  return service;
}])