import url  from 'url';
import path from 'path';
Smugmug = {};       // jshint ignore:line

const NAME = 'smugmug';

// Request Smugmug credentials for the user
// @param options {optional}  XXX support options.requestPermissions
// @param credentialRequestCompleteCallback {Function} Callback function to call on
//   completion. Takes one argument, credentialToken on success, or Error on
//   error.
Smugmug.requestCredential = function (options, credentialRequestCompleteCallback) {
  // support both (options, callback) and (callback).
  if (!credentialRequestCompleteCallback && typeof options === 'function') {
    credentialRequestCompleteCallback = options;
    options = {};
  }
  var config = ServiceConfiguration.configurations.findOne({ service: NAME });
  if (!config) {
    return credentialRequestCompleteCallback && credentialRequestCompleteCallback(new ServiceConfiguration.ConfigError('Service not configured'));
  }

  var credentialToken = Random.secret();
  // We need to keep credentialToken across the next two 'steps' so we're adding
  // a credentialToken parameter to the url and the callback url that we'll be returned
  // to by oauth provider

  let loginStyle = OAuth._loginStyle(NAME, config, options);

  // url to app, enters "step 1" as described in packages/accounts-oauth1-helper/oauth1_server.js
  let { protocol, slashes, hostname } = url.parse(Meteor.absoluteUrl());
  let state     = OAuth._stateParam(loginStyle, credentialToken, options && options.redirectUrl),
      loginPath = path.join('_oauth', NAME),
      loginUrl  = url.format({
        protocol,
        slashes,
        hostname,
        pathname: loginPath,
        query: {
          requestTokenAndRedirect: true,
          state
        }
      });
  
  OAuth.launchLogin({
    loginService: NAME,
    loginStyle,
    loginUrl,
    credentialRequestCompleteCallback,
    credentialToken
  });
};
