angular.module('gameplan.reservation', ['ui.bootstrap'])

.controller('reservationCtrl', ['$scope', '$filter', '$location', 'reservationFactory', function($scope, $filter, $location, reservationFactory) {

  $scope.today = function() {
    $scope.dt = new Date();
    $scope.loadTimes();
  };
  $scope.loadTimes = function() {
    var date = $filter('date')($scope.dt, 'MMddyyyy')
    var venue = $location.url().split("/")[2];
    reservationFactory.getTimes(date, venue, function(response) {
      takenCheck(response.data.free_hours);
    });
  };

  $scope.today();
  $scope.minDate = new Date();

  //needed for buttons
  $scope.hours = [
    '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21'
  ];
  $scope.checkModel = {
    '9': false,
    '10': false,
    '11': false,
    '12': false,
    '13': false,
    '14': false,
    '15': false,
    '16': false,
    '17': false,
    '18': false,
    '19': false,
    '20': false,
    '21': false
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
  $scope.takenHoursObj = {};

  var takenCheck = function(takenHours) {
    //write into obj from array of hours which are taken
    _.each(takenHours, function(item) {
      $scope.takenHoursObj[item] = true;
    });
    return $scope.takenHoursObj;
  };

  $scope.submitReservation = function() {
    var date = $filter('date')($scope.dt, 'MMddyyyy')
    var venue = $location.url().split("/")[2];
    reservationFactory.sendTimes(date, venue, $scope.checkResults, function(response) {
      console.log("successfuly reserved venue");
    });
  }


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
      console.log("failed getting hours from server");
    });
  }

  //send selected times to database
  service.sendTimes = function(date, venue, time, callback) {
    $http({
      url: '/reserve',
      method: 'POST',
      // params is how you pass data on a get request with angular
      params: {
        site_name: venue,
        date: date,
        time: time
      }
    }).then(function successCallback(response) {
      callback(response)
    }, function errorCallback(response) {
      console.log("failed submitting reservation");
    });
  }
  return service;
}])
