(function(exports){
    'use strict';
    var UrlParse = require('url').parse;
    var QueryString = require('querystring');
    var PinkiePromise = require('pinkie-promise');
    var got = require('got');
    var crypto = require('crypto');
    var methods = require('./methods.json');

    function Trakt(settings) {
      if (!settings)
        throw new Error('No settings provided');

      if (!settings.client_id || !settings.client_secret)
        throw new Error('Missing client credentials');

      var endpoint = UrlParse(settings.endpoint || '');
      this._settings = {
        client_id: settings.client_id,
        client_secret: settings.client_secret,
        redirect_uri: settings.redirect_uri || 'urn:ietf:wg:oauth:2.0:oob',
        api_protocol: endpoint.protocol || 'https:',
        api_host: endpoint.host || 'api-v2launch.trakt.tv',
        user_agent: settings.user_agent || 'https://github.com/PatrickE94/traktapi2'
      };
      this._token = {};

      this._construct();
      return this;
    }

    var prot = Trakt.prototype;

    prot.authUrl = function() {
      this._authState = crypto.randomBytes(6).toString('hex');
      return 'https://trakt.tv/oauth/authorize?response_type=code&client_id='
        + this._settings.client_id
        + '&redirect_uri=' + this._settings.redirect_uri
        + '&state=' + this._authState;
    };

    /**
     * Authorize received Code or PIN.
     */
    prot.authorizeCode = function authorizeCode(code, state) {
      if (state && state != this._authState)
        throw new Error('Invalid CSRF (State)');

      return this._authRequest({
        code: code.trim(),
        grant_type: 'authorization_code'
      });
    };

    /**
     * Request new refresh token.
     */
    prot.refreshToken = function() {
      if (!this._token.refresh_token)
        throw new Error('Missing refresh token');

      return this._authRequest({
        refresh_token: this._token.refresh_token,
        grant_type: 'refresh_token'
      });
    };

    /**
     * Restore serialized access token.
     */
    prot.setAccessToken = function(token) {
      if (token.access_token === undefined
         || token.expires === undefined
         || token.refresh_token === undefined)
         throw new Error('Bad access token');

      this._token = token;
      return this;
    };

    /**
     * Get serialized access token for persistance.
     */
    prot.serializeToken = function() {
      return this._token;
    };

    /**
     * Returns true if token needs to be refreshed.
     */
    prot.isTokenExpired = function() {
      return Date.now() > this._token.expires;
    };

    // ---------------------------------------------------------------------- //
    // Internal methods
    // ---------------------------------------------------------------------- //

    /**
     * Quick parsing for responses as defined by Trakt.
     */
    prot._respCodeToStr = function(code) {
      switch(code) {
        case 400: return 'Bad request';
        case 401: return 'Unauthorized';
        case 403: return 'Forbidden';
        case 404: return 'No record found';
        case 405: return 'Method not found';
        case 409: return 'Resource already created';

        case 422: return 'Validation errors';
        case 429: return 'Rate limit exceeded';
        case 500: return 'Server error';
        case 503: return 'Server overloaded';

        case 520:
        case 521:
        case 522: return 'Cloudflare error';
      }
      return 'Unknown server response';
    }

    /**
     * Actually checks response for errors which can be normalized and enhanced.
     */
    prot._handleResponse = function(resolve, reject, error, body, response) {
      var statusCode = response.statusCode;
      /* Valid response? */
      if (!error && statusCode >= 200 && statusCode <= 299) {
        if (response.headers['X-Pagination-Page-Count']) {
          body.pagination = {
            'page': response.headers['X-Pagination-Page'],
            'limit': response.headers['X-Pagination-Limit'],
            'page-count': response.headers['X-Pagination-Page-Count'],
            'item-count': response.headers['X-Pagination-Item-Count']
          }
        }

        return resolve(body);
      }

      /* Parse into pretty error object and reject */
      body = body || {};
      return reject({
        error: body.error || statusCode,
        error_description: body.error_description || this._respCodeToStr(statusCode),
        original_error: error,
        response: response
      });
    };

    /**
     * Actual execution of a method with given parameters.
     */
    prot._call = function(method, params) {
      params = params || {};

      var moptions = method.options || {};
      var mbody = method.body || [];
      var moptional = method.optional || [];

      if (moptions.auth == "required" && !this._token.access_token)
        throw new Error('Auth required');

      return new PinkiePromise(function(resolve, reject) {
        var options = {
          'method': method.method,
          'protocol': this._settings.api_protocol,
          'hostname': this._settings.api_host,
          'headers': {
            'Content-Type': 'application/json',
            'User-Agent': this._settings.user_agent,
            'trakt-api-version': '2',
            'trakt-api-key': this._settings.client_id
          },
          'json': true,
          'timeout': 30000,
        };

        if (moptions.auth && this._token.access_token) {
          options.headers.Authorization = 'Bearer ' + this._token.access_token;
        }

        // /part
        options.path = method.path.replace(/\/\:([^\/]+)/gi, function(match, arg) {
          if (!params[arg] && optional.indexOf(arg) == -1)
            return reject('Missing parameter \'' + arg + '\'');

          if (!params[arg]) return '';
          return '/' + params[arg];
        });

        // ?part
        var query = {};

        // Pagination
        if (!moptions.pagination && ('page' in params || 'limit' in params))
          return reject(method.path + ' does not support pagination');
        if ('page' in params) query.page = params.page;
        if ('limit' in params) query.limit = params.limit;

        // Extended, always available
        if ('extended' in params) query.extended = params.extended;

        // Other query params
        for(var i in method.query) {
          var arg = method.query[i];
          if (arg in params) {
            query[arg] = params[arg];
          } else if (optional.indexOf(arg) == -1) {
            return reject('Missing required parameter \'' + arg + '\'');
          }
        }

        // Apply ?part to path
        options.path += '?' + QueryString.stringify(query);

        // Body part
        var body = {};
        for(var i in mbody) {
          if (!mbody[i] in params && optional.indexOf(mbody[i]) == -1)
            return reject('Missing required parameter \'' + mbody[i] + '\'');

          body[mbody[i]] = params[mbody[i]];
        }
        options.body = JSON.stringify(body);

        // Do request
        got(options, this._handleResponse.bind(this, resolve, reject));
      }.bind(this));
    };

    /**
     * Specifically handles oauth requests.
     */
    prot._authRequest = function(body) {
      return this.oauth.token({
        'code': body.code,
        'grant_type': body.grant_type,
        'client_id': this._settings.client_id,
        'client_secret': this._settings.client_secret,
        'redirect_uri': this._settings.redirect_uri
      }).then(function(token) {
        console.log(token);
        this._token = {
          refresh_token: token.refresh_token,
          access_token: token.access_token,
          expires: (token.created_at + token.expires_in) * 1000 /* Epoch in ms */
        };
        return this.serializeToken();
      }.bind(this));
    };

    /**
     * Creates methods for all requests
     */
    prot._construct = function() {
      for(var path in methods) {
        var pathParts = path.split('/');
        var name = pathParts.pop(); // key for function

        var currObj = this;
        for(var p = 1; p < pathParts.length; ++p) {
          // Recursively walk down tree until last part is hit
          // create missing {} if needed (acts like mkdir -p)
          currObj = currObj[pathParts[p]] || (currObj[pathParts[p]] = {});
        }

        currObj[name] = this._call.bind(this, methods[path]);
      }
    };

    module.exports = Trakt;
    return;

}());
