// These two lines are required to initialize Express in Cloud Code.
var express = require('express');

var instagramClientInfo = require('cloud/instagramClientInfo.js');

var instagramOAuth = require('cloud/instagramOAuth.js');
instagramOAuth.initialize(instagramClientInfo.clientId, instagramClientInfo.clientSecret, instagramClientInfo.redirectUri);

var app = express();

// Global app configuration section
app.set('views', 'cloud/views');  // Specify the folder to find templates
app.set('view engine', 'jade');    // Set the template engine
app.use(express.bodyParser());    // Middleware for reading request body

/**
 * Main route.
 *
 * When called, render the index.jade view
 */
app.get('/', function(req, res) {
  res.render('index');
});

/**
 * Login with Instagram route.
 *
 * When called, generate a request token and redirect the browser to Instagram.
 */
app.get('/authorize', function(req, res) {

  instagramOAuth.getAuthorizeRedirectUrl().then(function(url) {
    res.redirect(url);
  }, function(error) {
    // If there's an error storing the request, render the error page.
    res.render('error', { errorMessage: 'Failed to save auth request.'});
  });

});

/**
 * OAuth Callback route.
 *
 * This is intended to be accessed via redirect from Instagram. The request
 *   will be validated against a previously stored TokenRequest and against
 *   another Instagram endpoint, and if valid, a User will be created and/or
 *   updated with details from Instagram.  A page will be rendered which will
 *   'become' the user on the client-side and redirect to the /main page.
 */
app.get('/instaOAuthCallback', function(req, res) {
  var data = req.query;
  /**
   * Validate that code and state have been passed in as query parameters.
   * Render an error page if this is invalid.
   */
  if (!(data && data.code && data.state)) {
    res.render('error', { errorMessage: 'Invalid auth response received.'});
    return;
  }

  instagramOAuth.exchangeCodeAndStateForUser(data.code, data.state).done(function(user) {

    res.render('account', { sessionToken: user.getSessionToken(), instagramUser: user.instagramUser });
  }).fail(function(error) {
    /**
     * If the error is an object error (e.g. from a Parse function) convert it
     *   to a string for display to the user.
     */
    if (error && error.code && error.error) {
      error = error.code + ' ' + error.error;
    }
    res.render('error', { errorMessage: JSON.stringify(error) });
  });
});

// Attach the Express app to Cloud Code.
app.listen();
