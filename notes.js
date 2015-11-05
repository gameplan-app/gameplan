// Unbalanced ()) Greenfield Project
// =============================================================================

// THIS FILE IS FOR NOTES, PSEUDOCODE, OR NON-FUNCTIONAL STUBS TO BE IMPLEMENTED LATER



// CHECK-INS

  // STRATEGY
// when we fetch sites from the Google Places API, we can get a unique place_id for each Place
  // we then store (findOrCreate) this place_id in our Sites db
    // each site record will have a counter that tracks check-ins
  // when the user makes a check-in event, we increment the check-in counter for that site
    // maybe reset that counter every day? every few hours? (Foursquare uses 3 hours) provide a 'lifespan' for that check-in somehow? (cron? something else?)
      // we could also kill the timed checkout if the user checks into another location before the time is up


  // CODE SNIPPETS

// put this block in the init function that first creates the map
{
  var request = {
      location: /* user's location as a google.maps.LatLngBounds object */,
      radius: '200',  // search radius in meters
      keyword: ['basketball court'],   // we need a way to insert user's selected sport(s) here
      openNow: true,  // will only return Places that are currently open, remove if not desired ('false' has no effect)
      rankBy: google.maps.places.RankBy.PROMINENCE or google.maps.places.RankBy.DISTANCE  // prominence is default
  };

  service = new google.maps.places.PlacesService(map);
  service.nearbySearch(request, callback);
}

function callback(results, status) {  // this callback must handle the results object and the PlacesServiceStatus response
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    // our callback can do whatever we want with the results object
  }
}

// nearbySearch() will return an array of up to 20 PlaceResult objects
  //  each object has (among other things): {
  //     geometry: {
  //       location: lat and lng,
  //       viewport: preferred viewport for the places
  //     },
  //     name: place's name,
  //     opening_hours: the open_now boolean,
  //     place_id: the unique place id we can use for our Sites db,
  //     rating: the place's rating, from 0.0 - 5.0,
  //     vicinity: simplified address
  //    }

  // if we want more info about a given site, we can use .getDetails():

service = new google.maps.places.PlacesService(map);
service.getDetails(request, callback);

  // the request must contain the site's { placeId: place_id }
  // the callback must handle the place and the status
      // place will be the PlaceResult object
      // status will be PlacesServiceStatus, we want 'OK'
function callback(place, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    // our callback
  }
}
    //  the PlaceResult object will contain (among other things):
        // {
        //   opening_hours: more details than just 'open_now', including the periods array of daily hours,
        //   photos: an array of up to 10 PlacePhoto objects of the site,
        //   reviews: an array of up to 5 reviews
        // }


