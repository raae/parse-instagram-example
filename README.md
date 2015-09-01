# Parse Instagram Example
So far this example shows how to use Instagram for login with a parse app.

The login code is based on Parse.com's [Adding Third-Party Authentication to your Web App](https://github.com/ParsePlatform/CloudCodeOAuthGitHubTutorial)-tutorial.

# Getting started
* Create a new parse app
  * Go to https://www.parse.com/apps/new.
* Turn on hosting
  * Navigate to settings and then hosting under the app on parse.com.
  * Turn on hosting and add a parseApp Name.
* Create a client with Instagram
  * Go to https://instagram.com/developer/clients/manage/
  * Redirect uri should be `http://<your-parseAapp-name>.parseapp.com/instaOAuthCallback`
* Clone this repository
  
  ```
    git clone git@github.com:raae/parse-instagram-example.git
  ```
* Move into repository and create .parse.local and cloud/instagramClienInfo.js

  ```
    cd parse-instagram-example
    touch .parse.local
    touch cloud/instagramClienInfo.js
  ```
* Add content to .parse.local and cloud/instagramClienInfo.js
  * See below for example content.

## Example .parse.local file
```
{
  "applications": {
    "_default": {
      "link": "parse-instagram-example"
    },
    "parse-instagram-example": {
      "applicationId": "<your-parse-app-id>"
    }
  }
}
```

## Example instagramClientInfo.js
```
module.exports = {
  clientId: "<your-instagram-client-id>",
  clientSecret: "<your-instagram-client-secret>",
  redirectUri: "http://<your-parseApp-name>.parseapp.com/instaOAuthCallback"
};

```

# Questions
Look through the [issues](https://github.com/raae/parse-instagram-example/issues) or [open a new issue](https://github.com/raae/parse-instagram-example/issues/new).
