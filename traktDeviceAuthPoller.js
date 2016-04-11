(function(){
  'use strict';
  var PinkiePromise = require('pinkie-promise');

  /**
   * Private class which checks the result of a device authentication request.
   *
   * Example Usage:
   * ```(javascript)
   * var trakt = new Trakt({...});
   * new TraktDeviceAuthPoller(trakt, {
   *      device_code: '...',
   *      interval: 5,
   *      expires_in: 600,
   *      ...
   * }).catch(function(error) {
   *      console.log(error);
   * }).then(function(result) {
   *      if (result) {
   *          console.log('Yay! We are authorized!');
   *      } else {
   *          console.log('User denied our authentication request :(');
   *      }
   * });
   * ```
   *
   * @namespace TraktDeviceAuthPoller
   * @param  {Trakt} instance The Trakt Instance to use when polling.
   * @param  {Object} body    The body received when requesting a code from the API.
   * @return {Promise}        Result of the authorization as a promise.
   */
  function TraktDeviceAuthPoller(instance, body) {
    return new PinkiePromise(function(resolve, reject) {
      this.trakt = instance;
      this.resolve = resolve;
      this.reject = reject;
      this.device_code = body.device_code;
      this.startPoll(body.interval * 1000);
      this.timeout = setTimeout(this.onTimeout.bind(this), body.expires_in * 1000);
    }.bind(this));
  };

  /**
   * @private
   * @memberof TraktDeviceAuthPoller
   */
  var prot = TraktDeviceAuthPoller.prototype;

  /**
   * Triggers a timeout failure and exits cleanly through promise.
   *
   * @memberof TraktDeviceAuthPoller
   */
  prot.onTimeout = function() {
    this.Fail({
      error: -1,
      error_description: "Authorization timed out",
      original_error: null,
      response: null
    });
  };

  /**
   * (Re)Sets polling interval and initiates it.
   *
   * @memberof TraktDeviceAuthPoller
   * @param  {number} interval Polling interval in milliseconds.
   */
  prot.startPoll = function(interval) {
    this.intervalMs = interval;
    if (this.interval) clearInterval(this.interval);
    this.interval = setInterval(this.doPoll.bind(this), this.intervalMs);
  };

  /**
   * Handles any HTTP Error from trakt when requesting auth result.
   *
   * @memberof TraktDeviceAuthPoller
   * @param  {Object} err Error object from Trakt API.
   */
  prot.handleError = function(err) {
    switch(err.error) {
      case 400: return; // Pending
      case 409: return; // Already Approved code

      case 429: // Polling to fast
        this.startPoll(this.intervalMs * 0.75); // Slow down 25%
        break;

      case 404: // Invalid device_code
        this.Fail({
          error: 'Invalid device code',
          error_description: 'Received device code was not valid!',
          original_error: err,
          response: err.response
        });
        break;
      case 410: // Expired
        this.onTimeout();
        break;
      case 418: // Denied
        this.onResult(false);
        break;
      default: {
        this.Fail({
          error: err.statusCode,
          error_description: err.statusMessage,
          original_error: err,
          response: err.response
        });
      } break;
    }
  };

  /**
   * Actual polling function.
   * This triggers a get token request to the Trakt API and
   * handles any result, or passes any error to the errorhandler.
   *
   * @memberof TraktDeviceAuthPoller
   */
  prot.doPoll = function() {
    this.trakt.oauth.device.token({
      client_id: this.trakt._settings.client_id,
      client_secret: this.trakt._settings.client_secret,
      code: this.device_code
    })
    .catch(this.handleError.bind(this))
    .then(function(token) {
      this.trakt.setAccessToken({
        refresh_token: token.refresh_token,
        access_token: token.access_token,
        expires: Date.now() + (token.expires_in * 1000)
      });
      this.onResult(true);
    }.bind(this));
  };

  /**
   * Serves result and exits cleanly.
   *
   * @memberof TraktDeviceAuthPoller
   * @param  {bool} result Boolean result of authentication.
   */
  prot.onResult = function(result) {
    this.resolve(result);
    clearInterval(this.interval);
    clearTimeout(this.timeout);
  }

  /**
   * Serves error and exits cleanly.
   *
   * @memberof TraktDeviceAuthPoller
   * @param  {Object} err Error object to fail promise with.
   */
  prot.onError = function(err) {
    this.reject(err);
    clearInterval(this.interval);
    clearTimeout(this.timeout);
  };

  module.exports = TraktDeviceAuthPoller;
  return;

})();
