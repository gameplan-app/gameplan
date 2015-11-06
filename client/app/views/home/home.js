// A gameplan-app project
// =============================================================================

'use strict';

angular.module('gameplan.home', [])

.controller('homeCtrl', ['$scope', '$log', '$http', function($scope, $log, $http) {

  // $SCOPE VARIABLES
  $scope.map;
  $scope.userPosition;
  $scope.sitesResults;
  $scope.currentKeyword;
  $scope.clickedPosition;
  $scope.currentRankByFlag;
  $scope.checkins;

  $scope.sports = {
    'Basketball': 'Basketball Court',
    'Soccer': 'Soccer Field',
    'Tennis': 'Tennis Court',
    'Baseball': 'Baseball Field',
    'Softball': 'Softball Field',
    'Gym': 'Gym',
    'Rock-Climbing': 'Climbing Gym',
    'Golf': 'Golf Course',
    'Racquetball': 'Racquetball Court',
    'Squash': 'Squash Court'
  };

  // OTHER VARIABLES
  var defaultLocation = { // this is SF
    lat: 37.7833,
    lng: -122.4167
  };
  var userMarkerImage = '../assets/images/centerflag.png';
  var blueDotImage = '../assets/images/bluedot.png';
  var sportIcons = {
    'Basketball Court': '../assets/images/basketball.png',
    'Soccer Field': '../assets/images/soccer.png',
    'Tennis Court': '../assets/images/tennis.png',
    'Baseball Field': '../assets/images/baseball.png',
    'Softball Field': '../assets/images/softball.png',
    'Gym': '../assets/images/gym.png',
    'Climbing Gym': '../assets/images/climbing.png',
    'Golf Course': '../assets/images/golf.png',
    'Racquetball Court': '../assets/images/racketball.png',
    'Squash Court': '../assets/images/squash.png'
  };
  var markers = [];
  var infowindow;
  var geocoder;
  var userMarker;
  var searchLocation;


  // CHANGE USER'S LOCATION
  $scope.changeLocation = function(locationData) {
    geocoder = new google.maps.Geocoder(); // init Geocoder

    locationData = $('#location-search').val(); // get the auto-complete address

    geocoder.geocode( // get LatLng for given address
      {
        'address': locationData
      },
      function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          getMap(results[0].geometry.location, 14); // redraw map with new location
          drawUserMarker(results[0].geometry.location); // draw a new marker in the center of the map
          $scope.clickedPosition = results[0].geometry.location; // searches will now be around the new marker
        } else {
          alert('Location change failed because: ' + status);
        }
      });
  };

  // CREATE A PERSISTENT USER MARKER
  var drawUserMarker = function(position) {
    if (position == undefined) {
      position = $scope.map.getCenter();
    }

    userMarker = new google.maps.Marker({ // define new center marker
      position: position,
      icon: userMarkerImage
    });

    userMarker.setMap($scope.map); // set the new center marker
  };

  // DRAW A MAP WITH USER MARKER, ADD EVENT LISTENER TO REDRAW USER MARKER
  var getMap = function(latLngObj, zoomLevel) {
    $scope.map = new google.maps.Map(document.getElementById('map'), { // draw map
      center: latLngObj,
      zoom: zoomLevel,
      disableDoubleClickZoom: true
    });

    infowindow = new google.maps.InfoWindow(); // init infowindow

    $scope.map.addListener('dblclick', // double-click to set a flag
      function(event) {
        if (userMarker) {
          userMarker.setMap(null);
        }
        drawUserMarker(event.latLng);
        $scope.clickedPosition = event.latLng;
      });
  };

  // GEOLOCATE USER'S POSITION
  $scope.userfind = function() {
    getMap(defaultLocation, 12); // draw map with default location

    if (navigator.geolocation) { // attempt geolocation if user allows
      navigator.geolocation.getCurrentPosition(function(position) {
          $scope.userPosition = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };

          var blueDotMarker = new google.maps.Marker({ // create blueDot marker for user's position
            position: $scope.userPosition,
            animation: google.maps.Animation.DROP,
            icon: blueDotImage
          });
          blueDotMarker.setMap($scope.map); // set the blueDot marker

          $scope.map.setCenter($scope.userPosition); // reset map with user position and closer zoom
          $scope.map.setZoom(14);
        },
        function() { // error, but browser supports geolocation
          handleLocationError(true, infoWindow, $scope.map.getCenter());
        });
    } else { // error, browser doesn't support geolocation
      handleLocationError(false, infoWindow, $scope.map.getCenter());
    }

    $scope.$apply(); // force update the $scope

    function handleLocationError(browserHasGeolocation, infoWindow, pos) { // this is specific to geolocation
      infoWindow.setPosition(pos);
      infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
    };
  };

  // CREATE MARKERS FOR SITES
  $scope.createMarker = function(place, keyword) {
    var placeLoc = place.geometry.location;
    var placeVicinity = place.vicinity;
    var placeName = place.name;
    var placeOpenNow;
    var placeOpenNowClass;

    if (place.opening_hours && place.opening_hours.open_now) { // not all Places have opening_hours property, will error on variable assign if they don't
      placeOpenNow = 'Open to play right now!';
      placeOpenNowClass = 'open';
    } else if (place.opening_hours && !place.opening_hours.open_now) {
      placeOpenNow = 'Closed now, but check back again!';
      placeOpenNowClass = 'closed';
    } else {
      placeOpenNow = '';
      placeOpenNowClass = 'unknown';
    }

    var iconMarkerImg = sportIcons[keyword]; // see the sportIcons object at top

    var marker = new google.maps.Marker({ // draw the marker on the map
      map: $scope.map,
      position: place.geometry.location,
      animation: google.maps.Animation.DROP,
      icon: iconMarkerImg
    });

    marker.addListener('click', function() { // add event listener for each marker
      $('*[data-placeId] .sitename').css("font-weight", "normal"); // make text for list item bold
      $('*[data-placeId=' + place.place_id + '] .sitename').css("font-weight", "bold");

      infowindow.setContent('<div class="infowindow-name">' + placeName + '</div><div class="infowindow-open ' + placeOpenNowClass + '">' + placeOpenNow + '</div><div class="infowindow-vicinity">' + placeVicinity + '</div');
      infowindow.open($scope.map, this); // infowindow popup
    });

    markers.push(marker); // add each marker to markers array
  };

  // CLICK EVENT LISTENER FOR SITE LIST
  $scope.siteListClick = function($index) {
    google.maps.event.trigger(markers[$index], 'click'); // trigger click event on respective marker
  };

  // POPULATE SITE LIST FOR SELECTED SPORT
  $scope.populateList = function(keyword, sport, rankByFlag) {
    /* We killed the "rankBy / orderBy" functionality because the results didn't seem to make much sense.
    /* Google says RankBy.DISTANCE should give the closest results, but that doesn't seem to match up.
    /* To reinstate: add a way to select between DISTANCE/PROMINENCE in the UI, then use the rankByFlag
    /* to toggle, according to the code below.  */

    $scope.currentRankByFlag = rankByFlag;
    $scope.selectedSport = sport;

    if (keyword != undefined) { // if keyword is passed in, save it
      $scope.currentKeyword = keyword;
    }
    if ($scope.clickedPosition == undefined) { // if no flag set, search around center of map
      searchLocation = $scope.map.getCenter();
    } else { // otherwise search around flag
      searchLocation = $scope.clickedPosition;
    }

    var request = {
      location: searchLocation, // determine current center of map
      keyword: [keyword] // keyword to search from our search object
    };

    if (rankByFlag) {
      _.extend(request, {
        rankBy: google.maps.places.RankBy.DISTANCE
      }); // rank by Prominence is default, unless indicated by parameter
    } else {
      _.extend(request, {
        radius: '2000'
      }); // search radius in meters
    }

    _.each(markers, function(marker) {
      marker.setMap(null); // reset current markers on map
    });

    markers = []; // clear markers array
    $scope.sitesResults = []; // clear site list

    var service = new google.maps.places.PlacesService($scope.map); // init service
    service.nearbySearch(request, nearbySearchCallback); // perform the search with given parameters

    function nearbySearchCallback(results, status) { // this callback must handle the results object and the PlacesServiceStatus response
      if (status == google.maps.places.PlacesServiceStatus.OK) {
        $scope.sitesResults = results; // populate site list with results
        $scope.$apply(); // force update the $scope

        _.each(results, function(place) { // create markers for results
          $http.post('/siteinfo', place) // post site info to server
            .then(function successCallback(response) {
              place.checkins = response.data.checkins;
            }, function errorCallback(response) {
              console.error('database post error: ', error);
            });
          $scope.createMarker(place, keyword);
        });
      }
    }
  };


  // CHECKIN TO A SITE
  $scope.siteCheckin = function(site) { // triggered by click on site checkin button
    $http.post('/checkin', site) // makes a post request with the item that was clicked on
      .then(function successCallback(response) {
        site.checkins = response.data.checkins;
        site.checkedin = true;
      }, function errorCallback(response) {
        console.error('database post error: ', error);
      });
  };

  $scope.siteCheckout = function(site) { // triggered by click on site checkout button
    $http.post('/checkout', site) // makes a post request with the item that was clicked on
      .then(function successCallback(response) {
        site.checkins = response.data.checkins;
        site.checkedin = false;
      }, function errorCallback(response) {
        console.error('database post error: ', error);
      });
  };

}]);
