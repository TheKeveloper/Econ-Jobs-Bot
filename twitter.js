function tweet(tweetText) {
  const twitterKeys = {
    TWITTER_CONSUMER_KEY: getApiKey(),
    TWITTER_CONSUMER_SECRET: getApiSecretKey(),
    TWITTER_ACCESS_TOKEN: getAccessToken(),
    TWITTER_ACCESS_SECRET: getAccessTokenSecret() 
  }

  var props = PropertiesService.getScriptProperties();
  props.setProperties(twitterKeys);
  var params = new Array(0);

  let service = new Twitterlib.OAuth(props);
  let response = service.sendTweet(tweetText, params)
}






