## new backend routes 

### requests checking for available times on a day:
sent data must include site name (or ID?) and date angular request should look something like:

```js
$http({
  url: '/reserve',
  method: 'GET',
  // params is how you pass data on a get request with angular
  params: {site_name: site_name, date: 'MMDDYYYY'}
})
```
#### todo:
- [ ] let me know how you want the response formatted -- an array of 2-hour windows? or something else? 

-----
### requests for making a reservation:

```js
$http({
  url: '/reserve',
  method: 'POST',
  // put hours in army time aka 1pm === 13 :)
  data: {site_name: sitename, username: reserving_username, date:'MMDDYYY', time:'HH'}
})
```
#### todo

- [ ] let me know if there is any other data about the reservation you might want to add to the database from the user profile
- [ ] let me know if there's anything specific you want to be included in the response
