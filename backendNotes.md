## Used Routes  

| URL        | method           | backend function  |
| ------------- |-------------| -----:|
| /siteinfo    | POST | `utils.postSiteInfo` |
| /checkin    | POST    |   `utils.siteCheckin` |
| /checkout | POST     |    `utils.siteCheckout` |

## Unused Routes

| URL        | method           | backend function  |
| ------------- |-------------| -----:|
| /userinfo    | ? | no referenced function |
| /userauth    | GET    |   `passport.authenticate` |

## Potential new backend features

* modify /checkin and /checkout to add to the current user's checkins array in mongoose
* add games-history / future elements to user model
* add games-history / future elements to site model?
* add initial location to users' record in the database as preferred location in future logins?
  * allow users to modify their default location from font-end?

## ToDo

- [ ] get facebook token / key -- secure that shit
 
