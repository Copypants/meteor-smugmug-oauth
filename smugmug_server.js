Smugmug = {};       // jshint ignore:line

const NAME = 'smugmug';

const URLS = {
  requestToken: 'http://secure.smugmug.com/services/oauth/1.0a/getRequestToken',
  authorize   : 'http://secure.smugmug.com/services/oauth/1.0a/authorize',
  accessToken : 'http://secure.smugmug.com/services/oauth/1.0a/getAccessToken',
  authenticate: 'http://secure.smugmug.com/services/oauth/1.0a/authorize',
};

const API_URL = 'http://api.smugmug.com/api/v2';

Smugmug.whitelistedFields = ['RefTag', 'WebUri', 'AccountStatus', 'FirstName', 'LastName', 'ImageCount', 'IsTrial', 'NickName', 'Domain', 'Name', 'Plan'];

OAuth.registerService(NAME, 1, URLS, function(oauthBinding) {

  let userInfo = getUserInfo(oauthBinding) || {};

  let serviceData = {
    accessToken      : OAuth.sealSecret(oauthBinding.accessToken),
    accessTokenSecret: OAuth.sealSecret(oauthBinding.accessTokenSecret)
  };

  return {
    serviceData: serviceData,
    options: {
      profile: _.pick(userInfo, Smugmug.whitelistedFields),
    }
  };
});

Smugmug.retrieveCredential = function(credentialToken, credentialSecret) {
  return OAuth.retrieveCredential(credentialToken, credentialSecret);
};

/**
 * Fetch the Smugmug user info
 * @param {String} accessToken Smugmug valid access token
 * @returns {Object} https://api.smugmug.com/api/v2/doc/reference/user.html
 */
function getUserInfo(oauthBinding) {
  let { data, statusCode } = oauthBinding.get(`${API_URL}!authuser?_accept=application/json`);
  if (statusCode !== 200) {
    throw new Error(`[Smugmug:getUserInfo] Invalid status code returned: ${statusCode}`);
  }

  if (!data || data.Code !== 200 || !data.Response) {
    throw new Error(`[Smugmug:getUserInfo] Invalid meta data: ${JSON.stringify(data)}`);
  }
  return data.Response.User || {};
}
