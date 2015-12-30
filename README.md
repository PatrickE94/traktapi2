# TraktApi2
A promise style Trakt.tv API wrapper for Node.js.

## Example usage

### Initialize
```
var Trakt = require('traktapi2');
var trakt = new Trakt({
  client_id: '',
  client_secret: '',
  redirect_uri: null // Defaults to urn:ietf:wg:oauth:2.0:oob,
  user_agent: 'TraktClientNr1', // Defaults to url for this repository
  endpoint: 'http://staging.api.trakt.tv' // Defaults to https://api-v2launch.trakt.tv
});
```

### Generate Auth URL
```
var url = trakt.authUrl();
```

### Verify code/PIN (and optionally state) from returned auth
```
trakt
  .authorizeCode("code/PIN", "csrf token (state)")
  .catch(function(err) {
    /* Detailed error with reason of failure. */
  })
  .then(function() {
    /* API can now be used with authorized requests */
  });
```

### Check if token needs to be refreshed
```
var update = trakt.isTokenExpired() ? 'yes' : 'no';
```

### Refresh token
```
trakt
  .refreshToken()
  .catch(function(err) {
    /* Detailed error with reason of failure. */
  })
  .then(function() {
    /* API now has an updated access token */
  });
```

### Storing token over sessions
```
var tokenObj = trakt.serializeToken(); // get token
/* Do storage and reloading etc here */
trakt.setAccessToken(tokenObj); // restore token
```

### Actual API requests

To see a list of methods and code path to each Trakt endpoint check out the
[method map](methods.md).

The parameter extended is available everywhere. But really only useful
where media objects are returned.

```
trakt
  .calendars.all.shows({
    start_date: "today",
    days: "7",
    extended: "images"
  })
  .catch(function(err) {
    /*
     * Return error is either a string with a simple message, or an
     * object with details as provided by error source.
     * These objects usually looks like this:
     * {
     *   error: // Either a string with a trakt error, or the status code returned.
     *   error_description // A string describing the error
     *   original_error // Original error item from source
     *   response // response object provided by got
     * }
     */
  })
  .then(function(shows) {
    /*
     * shows now contain body response from API (actual show data).
     * If API endpoint supports pagination, an additional pagination object
     * is added to the object.
     * pagination: {
     *   page: 0, // Current page
     *   limit: 10, // Current limit (items per page)
     *   page-count: 100, // Amount of pages with the current settings
     *   item-count: 1000, // Amount of actual items.
     * }
     */
  });
```

## Contributing
Feel free to do pull requests, forks or anything really. If you find an error
and don't want to fix it yourself, place an issue and I will look into it!

## LICENSE

The MIT License (MIT)

Copyright (c) 2015 Patrick Engström

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
