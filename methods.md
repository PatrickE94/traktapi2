# Methods map

Required parameters are starred

| Codepath                     | Method | Trakt URL                                                  | Parameters                                                                         |  Auth  |
| :--------------------------- | ----: | :--------------------------------------------------------- | :--------------------------------------------------------------------------------- | :-----: |
| oauth.authorize              |   GET | /oauth/authorize                                           | response_type\*, client_id\*, redirect_uri\*, state                                |        |
| oauth.token                  |  POST | /oauth/token                                               | code\*, client_id\*, client_secret\*, redirect_uri\*, grant_type\*, refresh_token\* |        |
| oauth.revoke                 |  POST | /oauth/revoke                                              | access_token\*                                                                     |        |
| oauth.device.code            |  POST | /oauth/device/code                                         | client_id\*                                                                        |        |
| oauth.device.token           |  POST | /oauth/device/token                                        | code\*, client_id\*, client_secret\*                                               |        |
| calendars.my.shows           |   GET | /calendars/my/shows/:start_date/:days                      | start_date, days                                                                   | required |
| calendars.my.shows.new       |   GET | /calendars/my/shows/new/:start_date/:days                  | start_date, days                                                                   | required |
| calendars.my.shows.premieres |   GET | /calendars/my/shows/premieres/:start_date/:days            | start_date, days                                                                   | required |
| calendars.my.movies          |   GET | /calendars/my/movies/:start_date/:days                     | start_date, days                                                                   | required |
| calendars.all.shows          |   GET | /calendars/all/shows/:start_date/:days                     | start_date, days                                                                   |        |
| calendars.all.shows.new      |   GET | /calendars/all/shows/new/:start_date/:days                 | start_date, days                                                                   |        |
| calendars.all.shows.premieres |   GET | /calendars/all/shows/premieres/:start_date/:days           | start_date, days                                                                   |        |
| calendars.all.movies         |   GET | /calendars/all/movies/:start_date/:days                    | start_date, days                                                                   |        |
| checkin.add                  |  POST | /checkin                                                   | movie, episode, show, sharing, message, venue_id, venue_name, app_version, app_date | required |
| checkin.remove               | DELETE | /checkin                                                   |                                                                                    | required |
| comments.add                 |  POST | /comments                                                  | movie, show, season, episode, list, comment\*, spoiler, sharing                    | required |
| comments.get                 |   GET | /comments/:id                                              | id\*                                                                               |        |
| comments.update              |   PUT | /comments/:id                                              | comment, spoiler, id\*                                                             | required |
| comments.remove              | DELETE | /comments/:id                                              | id\*                                                                               | required |
| comments.replies.get         |   GET | /comments/:id/replies                                      | id\*, limit, page                                                                  |        |
| comments.replies.add         |  POST | /comments/:id/replies                                      | comment\*, spoiler, id\*                                                           | required |
| comments.like.add            |  POST | /comments/:id/like                                         | id\*                                                                               | required |
| comments.like.remove         | DELETE | /comments/:id/like                                         | id\*                                                                               | required |
| genres                       |   GET | /genres/:type                                              | type\*                                                                             |        |
| movies.trending              |   GET | /movies/trending                                           | limit, page                                                                        |        |
| movies.popular               |   GET | /movies/popular                                            | limit, page                                                                        |        |
| movies.played                |   GET | /movies/played/:period                                     | period, limit, page                                                                |        |
| movies.watched               |   GET | /movies/watched/:period                                    | period, limit, page                                                                |        |
| movies.collected             |   GET | /movies/collected/:period                                  | period, limit, page                                                                |        |
| movies.anticipated           |   GET | /movies/anticipated                                        | limit, page                                                                        |        |
| movies.boxoffice             |   GET | /movies/boxoffice                                          |                                                                                    |        |
| movies.updates               |   GET | /movies/updates/:start_date                                | start_date, limit, page                                                            |        |
| movies.summary               |   GET | /movies/:id                                                | id\*                                                                               |        |
| movies.aliases               |   GET | /movies/:id/aliases                                        | id\*                                                                               |        |
| movies.releases              |   GET | /movies/:id/releases/:country                              | id\*, country                                                                      |        |
| movies.translations          |   GET | /movies/:id/translations/:language                         | id\*, language                                                                     |        |
| movies.comments              |   GET | /movies/:id/comments/:sort                                 | id\*, sort, limit, page                                                            |        |
| movies.people                |   GET | /movies/:id/people                                         | id\*                                                                               |        |
| movies.ratings               |   GET | /movies/:id/ratings                                        | id\*                                                                               |        |
| movies.related               |   GET | /movies/:id/related                                        | id\*, limit, page                                                                  |        |
| movies.stats                 |   GET | /movies/:id/stats                                          | id\*                                                                               |        |
| movies.watching              |   GET | /movies/:id/watching                                       | id\*                                                                               |        |
| people.summary               |   GET | /people/:id                                                | id\*                                                                               |        |
| people.movies                |   GET | /people/:id/movies                                         | id\*                                                                               |        |
| people.shows                 |   GET | /people/:id/shows                                          | id\*                                                                               |        |
| recommendations.movies       |   GET | /recommendations/movies                                    |                                                                                    | required |
| recommendations.movies.hide  | DELETE | /recommendations/movies/:id                                | id\*                                                                               | required |
| recommendations.shows        |   GET | /recommendations/shows                                     |                                                                                    | required |
| recommendations.shows.hide   | DELETE | /recommendations/shows/:id                                 | id\*                                                                               | required |
| scrobble.start               |  POST | /scrobble/start                                            | movie, episode, show, progress\*, app_version, app_date                            | required |
| scrobble.pause               |  POST | /scrobble/pause                                            | movie, episode, show, progress\*, app_version, app_date                            | required |
| scrobble.stop                |  POST | /scrobble/stop                                             | movie, episode, show, progress\*, app_version, app_date                            | required |
| search                       |   GET | /search                                                    | query\*, type, year, id_type\*, id\*, limit, page                                  |        |
| shows.trending               |   GET | /shows/trending                                            | limit, page                                                                        |        |
| shows.popular                |   GET | /shows/popular                                             | limit, page                                                                        |        |
| shows.played                 |   GET | /shows/played/:period                                      | period, limit, page                                                                |        |
| shows.watched                |   GET | /shows/watched/:period                                     | period, limit, page                                                                |        |
| shows.collected              |   GET | /shows/collected/:period                                   | period, limit, page                                                                |        |
| shows.anticipated            |   GET | /shows/anticipated                                         | limit, page                                                                        |        |
| shows.updates                |   GET | /shows/updates/:start_date                                 | start_date, limit, page                                                            |        |
| shows.summary                |   GET | /shows/:id                                                 | id\*                                                                               |        |
| shows.aliases                |   GET | /shows/:id/aliases                                         | id\*                                                                               |        |
| shows.translations           |   GET | /shows/:id/translations/:language                          | id\*, language                                                                     |        |
| shows.comments               |   GET | /shows/:id/comments/:sort                                  | id\*, sort, limit, page                                                            |        |
| shows.progress.collection    |   GET | /shows/:id/progress/collection                             | hidden, specials, id\*                                                             | required |
| shows.progress.watched       |   GET | /shows/:id/progress/watched                                | hidden, specials, id\*                                                             | required |
| shows.people                 |   GET | /shows/:id/people                                          | id\*                                                                               |        |
| shows.ratings                |   GET | /shows/:id/ratings                                         | id\*                                                                               |        |
| shows.related                |   GET | /shows/:id/related                                         | id\*, limit, page                                                                  |        |
| shows.stats                  |   GET | /shows/:id/stats                                           | id\*                                                                               |        |
| shows.watching               |   GET | /shows/:id/watching                                        | id\*                                                                               |        |
| shows.seasons                |   GET | /shows/:id/seasons                                         | id\*                                                                               |        |
| season.summary               |   GET | /shows/:id/seasons/:season                                 | id\*, season\*                                                                     |        |
| season.comments              |   GET | /shows/:id/seasons/:season/comments/:sort                  | id\*, season\*, sort, limit, page                                                  |        |
| season.ratings               |   GET | /shows/:id/seasons/:season/ratings                         | id\*, season\*                                                                     |        |
| season.stats                 |   GET | /shows/:id/seasons/:season/stats                           | id\*, season\*                                                                     |        |
| season.watching              |   GET | /shows/:id/seasons/:season/watching                        | id\*, season\*                                                                     |        |
| episode.summary              |   GET | /shows/:id/seasons/:season/episodes/:episode               | id\*, season\*, episode\*                                                          |        |
| episode.comments             |   GET | /shows/:id/seasons/:season/episodes/:episode/comments/:sort | id\*, season\*, episode\*, sort, limit, page                                       |        |
| episode.ratings              |   GET | /shows/:id/seasons/:season/episodes/:episode/ratings       | id\*, season\*, episode\*                                                          |        |
| episode.stats                |   GET | /shows/:id/seasons/:season/episodes/:episode/stats         | id\*, season\*, episode\*                                                          |        |
| episode.watching             |   GET | /shows/:id/seasons/:season/episodes/:episode/watching      | id\*, season\*, episode\*                                                          |        |
| sync.last_activities         |   GET | /sync/last_activities                                      |                                                                                    | required |
| sync.playback.get            |   GET | /sync/playback/:type                                       | type                                                                               | required |
| sync.playback.remove         | DELETE | /sync/playback/:id                                         | id\*                                                                               | required |
| sync.collection.get          |   GET | /sync/collection/:type                                     | type\*                                                                             | required |
| sync.collection.add          |  POST | /sync/collection                                           | movies, shows, episodes                                                            | required |
| sync.collection.remove       |  POST | /sync/collection/remove                                    | movies, shows, episodes                                                            | required |
| sync.watched                 |   GET | /sync/watched/:type                                        | type\*                                                                             | required |
| sync.history.get             |   GET | /sync/history/:type/:id                                    | type, id, limit, page                                                              | required |
| sync.history.add             |  POST | /sync/history                                              | movies, shows, episodes                                                            | required |
| sync.history.remove          |  POST | /sync/history/remove                                       | movies, shows, episodes, ids                                                       | required |
| sync.ratings.get             |   GET | /sync/ratings/:type/:rating                                | type, rating                                                                       | required |
| sync.ratings.add             |  POST | /sync/ratings                                              | movies, shows, episodes                                                            | required |
| sync.ratings.remove          |  POST | /sync/ratings/remove                                       | movies, shows, episodes                                                            | required |
| sync.watchlist.get           |   GET | /sync/watchlist/:type                                      | type                                                                               | required |
| sync.watchlist.add           |  POST | /sync/watchlist                                            | movies, shows, episodes                                                            | required |
| sync.watchlist.remove        |  POST | /sync/watchlist/remove                                     | movies, shows, episodes                                                            | required |
| users.settings               |   GET | /users/settings                                            |                                                                                    | required |
| users.requests.get           |   GET | /users/requests                                            |                                                                                    | required |
| users.requests.add           |  POST | /users/requests/:id                                        | id\*                                                                               | required |
| users.requests.remove        | DELETE | /users/requests/:id                                        | id\*                                                                               | required |
| users.hidden                 |   GET | /users/hidden/:section                                     | type, section\*, limit, page                                                       | required |
| users.likes                  |   GET | /users/likes/:type                                         | type, limit, page                                                                  | required |
| users                        |   GET | /users/:username                                           | username\*                                                                         | optional |
| users.collection             |   GET | /users/:username/collection/:type                          | username\*, type\*                                                                 | optional |
| users.comments               |   GET | /users/:username/comments/:comment_type/:type              | username\*, comment_type, type, limit, page                                        | optional |
| users.lists.get              |   GET | /users/:username/lists                                     | username\*                                                                         | optional |
| users.lists.add              |  POST | /users/:username/lists                                     | name\*, description, privacy, display_numbers, allow_comments, username\*          | required |
| users.list.get               |   GET | /users/:username/lists/:id                                 | username\*, id\*                                                                   | optional |
| users.list.update            |   PUT | /users/:username/lists/:id                                 | name, description, privacy, display_numbers, allow_comments, username\*, id\*      | required |
| users.list.remove            | DELETE | /users/:username/lists/:id                                 | username\*, id\*                                                                   | required |
| users.list.like.add          |  POST | /users/:username/lists/:id/like                            | username\*, id\*                                                                   | required |
| users.list.like.remove       | DELETE | /users/:username/lists/:id/like                            | username\*, id\*                                                                   | required |
| users.list.items.get         |   GET | /users/:username/lists/:id/items/:type                     | username\*, id\*, type                                                             | optional |
| users.list.items.add         |  POST | /users/:username/lists/:id/items/:type                     | movies\*, shows\*, people\*, username\*, id\*, type                                | required |
| users.list.items.remove      |  POST | /users/:username/lists/:id/items/remove                    | movies\*, shows\*, people\*, username\*, id\*                                      | required |
| users.lists.comments         |   GET | /users/:username/lists/:id/comments/:sort                  | username\*, id\*, sort, limit, page                                                |        |
| users.follow.add             |  POST | /users/:username/follow                                    | username\*                                                                         | required |
| users.follow.remove          | DELETE | /users/:username/follow                                    | username\*                                                                         | required |
| users.followers              |   GET | /users/:username/followers                                 | username\*                                                                         | optional |
| users.following              |   GET | /users/:username/following                                 | username\*                                                                         | optional |
| users.friends                |   GET | /users/:username/friends                                   | username\*                                                                         | optional |
| users.history                |   GET | /users/:username/history/:type/:id                         | username\*, type, id, limit, page                                                  | optional |
| users.ratings                |   GET | /users/:username/ratings/:type/:rating                     | username\*, type, rating                                                           | optional |
| users.watchlist              |   GET | /users/:username/watchlist/:type                           | username\*, type                                                                   | optional |
| users.watching               |   GET | /users/:username/watching                                  | username\*                                                                         | optional |
| users.watched                |   GET | /users/:username/watched/:type                             | username\*, type\*                                                                 | optional |
| users.stats                  |   GET | /users/:username/stats                                     | username\*                                                                         | optional |
