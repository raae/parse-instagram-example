/**
 * Module for authenicating users with Instagram
 */

var querystring = require('querystring');
var util = require('cloud/instagramOAuth.util.js');
var User = require('cloud/instagramOAuth.models.js').User;
var TokenRequest = require('cloud/instagramOAuth.models.js').TokenRequest;
var TokenStorage = require('cloud/instagramOAuth.models.js').TokenStorage;

// ClientId, clientSecret and redirectUri is set in public initialize function
var instagram = {
  authorizeEndpoint: 'https://api.instagram.com/oauth/authorize/?',
  accessTokenEndpoint: 'https://api.instagram.com/oauth/access_token',
  clientId: '',
  clientSecret: '',
  redirectUri: '',
};

var upsertInstagramUser = function(accessToken, instagramUserData) {

  return TokenStorage.firstWithInstagramId(instagramUserData.id).done(function(tokenStorage) {
    if(!tokenStorage) {
      return newInstagramUser(accessToken, instagramUserData);
    } else {
      var attrs = {
        instagramUsername:  instagramUserData.username,
        accessToken: accessToken,
      }
      return tokenStorage.updateAndSave(attrs).done(function(tokenStorage) {
        return tokenStorage.get('user').logInWithRandomPassword();
      });
    }
  });
};

var newInstagramUser = function(accessToken, instagramUserData) {

  var attrs = {
    instagramId: instagramUserData.id,
    instagramUsername:  instagramUserData.username,
    accessToken: accessToken,
  }

  return User.createAndSignUpUserWithRandomUsernameAndPassword().done(function(user) {
    attrs.user = user;
    return TokenStorage.createAndSave(attrs);
  }).done(function(tokenStorage) {
    return upsertInstagramUser(accessToken, instagramUserData);
  });
};

var generateAuthorizeRedirectUrl = function(state) {
  var redirectUrl = instagram.authorizeEndpoint
    + querystring.stringify({
        client_id: instagram.clientId,
        redirect_uri: instagram.redirectUri,
        response_type: "code",
        state: state
    });
  return Parse.Promise.as(redirectUrl);
}

var generateAccessTokenHttpRequest = function(code) {
  var request = {
    method: 'POST',
    url: instagram.accessTokenEndpoint,
    headers: {
      'Accept': 'application/json',
      'User-Agent': 'Parse.com Cloud Code'
    },
    body: querystring.stringify({
            client_id: instagram.clientId,
            client_secret: instagram.clientSecret,
            grant_type: "authorization_code",
            redirect_uri: instagram.redirectUri,
            code: code
          })
  }

  return Parse.Promise.as(request);
}

module.exports = {
  initialize: function (clientId, clientSecret, redirectUri) {
    instagram.clientId = clientId;
    instagram.clientSecret = clientSecret;
    instagram.redirectUri = redirectUri;
    return this;
  },
  keys: function() {
    return instagram;
  },
  getAuthorizeRedirectUrl: function() {
    return TokenRequest.createAndSave({}).then(function(tokenRequest) {
      return generateAuthorizeRedirectUrl(tokenRequest.id);
    });
  },
  exchangeCodeAndStateForUser: function(code, state) {

    var instagramDate = null;

    return TokenRequest.getAndDestroyForState(state).then(function() {
      // Generate http request based on code and init values
      return generateAccessTokenHttpRequest(code);
    }).done(function(httpRequest) {
      // Validate & Exchange the code parameter for an access token from Instagram
      return Parse.Cloud.httpRequest(httpRequest);
    }).done(function(access) {
      // Process the response from Instagram.
      instagramData = access.data;
      if (instagramData && instagramData.access_token && instagramData.user) {
        return upsertInstagramUser(instagramData.access_token, instagramData.user);
      } else {
        return Parse.Promise.error("Invalid access request.");
      }
    }).done(function(user) {
      // Load Parse.User with instagram user data
      user.instagramUser = instagramData.user;
      return Parse.Promise.as(user);
    });
  }
}


