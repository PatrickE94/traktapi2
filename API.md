# Trakt

Initializer for a new Trakt connection instance.

Settings and their default values:

```(javascript)
{
	client_id: 'REQUIRED',
	client_secret: 'REQUIRED'
	redirect_uri: 'urn:ietf:wg:oauth:2.0:oob',
	api_protocol: 'https:',
	api_host: 'api-v2launch.trakt.tv',
	user_agent: 'https://github.com/PatrickE94/traktapi2'
}
```

**Parameters**

-   `settings` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** Settings needed initial settings for Trakt API.

Returns **Trakt** A new Trakt API instance ready for usage.

## authorizeCode

Authorize received Code or PIN (soon deprecated).

**Parameters**

-   `code`  
-   `state`  

## authorizeDevice

Authorize a new device using the new Device Auth method.

**Parameters**

-   `function`  displayCodeCallback callback with code to
                                         display to the user.
-   `displayCodeCallback`  

Returns **** Promise                      A promise with the auth result.

## authUrl

Generate an authentication url for PIN and OAuth auth.

Returns **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** URL to give user to receive PIN code.

## isTokenExpired

Returns true if token needs to be refreshed.

Returns **bool** True if the current access token is expired and needs to
               be refreshed.

## refreshToken

Request new refresh token.

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** TODO:

## serializeToken

Get serialized access token for persistance.

Returns **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** Token in a serialized format, good for storage.

## setAccessToken

Restore serialized access token.

**Parameters**

-   `token` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** Token as serialized by `serializeToken`

Returns **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** Returns itself (this) for chaining.

# TraktDeviceAuthPoller

Private class which checks the result of a device authentication request.

Example Usage:

```(javascript)
var trakt = new Trakt({...});
new TraktDeviceAuthPoller(trakt, {
     device_code: '...',
     interval: 5,
     expires_in: 600,
     ...
}).catch(function(error) {
     console.log(error);
}).then(function(result) {
     if (result) {
         console.log('Yay! We are authorized!');
     } else {
         console.log('User denied our authentication request :(');
     }
});
```

**Parameters**

-   `instance` **Trakt** The Trakt Instance to use when polling.
-   `body` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** The body received when requesting a code from the API.

Returns **[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)** Result of the authorization as a promise.

## doPoll

Actual polling function.
This triggers a get token request to the Trakt API and
handles any result, or passes any error to the errorhandler.

## handleError

Handles any HTTP Error from trakt when requesting auth result.

**Parameters**

-   `err` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** Error object from Trakt API.

## onError

Serves error and exits cleanly.

**Parameters**

-   `err` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** Error object to fail promise with.

## onResult

Serves result and exits cleanly.

**Parameters**

-   `result` **bool** Boolean result of authentication.

## onTimeout

Triggers a timeout failure and exits cleanly through promise.

## startPoll

(Re)Sets polling interval and initiates it.

**Parameters**

-   `interval` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** Polling interval in milliseconds.
