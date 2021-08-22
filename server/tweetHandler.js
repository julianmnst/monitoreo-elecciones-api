const axios = require('axios')

const TOKEN = process.env.TWITTER_BEARER_TOKEN

const twAPI = 'https://api.twitter.com/2/tweets/search/recent'
const twQUERY = q => `query=${q} -is:retweet&expansions=author_id,attachments.media_keys,referenced_tweets.id,referenced_tweets.id.author_id&tweet.fields=attachments,author_id,public_metrics,created_at,id,in_reply_to_user_id,referenced_tweets,text&user.fields=id,name,profile_image_url,protected,url,username,verified&media.fields=duration_ms,height,media_key,preview_image_url,type,url,width,public_metrics`

const sortTweets = (t) => {
    return t.sort(function(a,b){
      return new Date(b.created_at) - new Date(a.created_at);
    });
  }

  async function getTweets(ht) {
    const TwitterURL =
      `${twAPI}?${twQUERY(ht)}`
    let res = []
    try {
      const response = await axios(
        TwitterURL,
        {
          headers: {
          Authorization: `Bearer ${TOKEN}`
          }
        }
      );

      const tweets = await response;
      if (tweets.data) {
        let sortedTweets = sortTweets(tweets.data.data)
        res = { ...tweets.data, data: sortedTweets }
      }
    }
    catch(e) {
      console.error(e)
    }
    return res
  }

  module.exports = {
      getTweets
  }