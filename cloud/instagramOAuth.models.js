var util = require('cloud/instagramOAuth.util.js');

/**
 * In the Data Browser, set the Class Permissions for these two classes to
 *   disallow public access for Get/Find/Create/Update/Delete operations.
 *   Only the master key should be able to query or write to these classes.
 */

var TokenRequest = Parse.Object.extend("TokenRequest", {
  // instance methods
  initialize: function (attrs, options) {
    this.setACL(restrictedAcl);
  }
}, {
  // class methods
  createAndSave: function(attrs) {
    var tokenRequest = new TokenRequest();
    return tokenRequest.save(attrs, {useMasterKey: true});
  },
  query: function() {
    var query = new Parse.Query(TokenRequest);
    query.ascending('createdAt');
    return query;
  },
  getAndDestroyForState: function(state) {
    return TokenRequest.query().get(state, {useMasterKey: true}).then(function(tokenRequest) {
      return tokenRequest.destroy({useMasterKey: true});
    });
  }
});

var TokenStorage = Parse.Object.extend("TokenStorage", {
  // instance methods
  initialize: function (attrs, options) {
    this.setACL(restrictedAcl);
  },
  updateAndSave: function(attrs) {
    return this.save(attrs, {useMasterKey: true});
  }
}, {
  // class methods
  createAndSave: function(attrs) {
    var tokenStorage = new TokenStorage();
    return tokenStorage.updateAndSave(attrs);
  },
  query: function() {
    var query = new Parse.Query(TokenStorage);
    query.ascending('createdAt');
    query.include('user');
    return query;
  },
  firstWithInstagramId: function(instagramId) {
    var query = TokenStorage.query();
    query.equalTo('instagramId', instagramId);
    return query.first({useMasterKey: true});
  }
});

var User = Parse.Object.extend("User", {
  // instance methods
  initialize: function (attrs, options) {
    this.setACL(restrictedAcl);
  },
  logInWithRandomPassword: function() {
    var self = this;
    var password = util.generateRandomString();
    this.setPassword(password);
    return this.save(null, { useMasterKey: true }).done(function(user) {
      return Parse.User.logIn(user.get('username'), password);
    });
  }
}, {
  // class methods
  createAndSignUpUserWithRandomUsernameAndPassword: function() {
    var user = new User();
    user.set("username", util.generateRandomString());
    user.set("password", util.generateRandomString());
    return user.signUp();
  }
});

// Create a Parse ACL which prohibits public access.  This will be used to protects these classes.
var restrictedAcl = new Parse.ACL();
restrictedAcl.setPublicReadAccess(false);
restrictedAcl.setPublicWriteAccess(false);

module.exports = {
  User: User,
  TokenRequest: TokenRequest,
  TokenStorage: TokenStorage
};
