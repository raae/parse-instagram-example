# parse-instagram-login-example
Parse Instagram Login Example

# Getting started
* Create parse app
* Turn on hosting
* Create a client with Instagram
  * Redirect uri should be `http://<your parse app name>.parseapp.com/instaOAuthCallback`
* Clone repo
* Add your .parse.local file
* Add a file name instagramClienInfo.js
* Deploy to Parse

## Example instagramClientInfo.js
```
module.exports = {
  clientId: "<your instagram client id>",
  clientSecret: "<your instagram client secret>",
  redirectUri: "http://<your parse app name>.parseapp.com/instaOAuthCallback"
};
```

# Questions
Look through the issues or open a new issue.
