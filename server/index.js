const path = require('path')
const cors = require('cors')
const axios = require('axios')
const config = require('dotenv').config()
const { server, app } = require('./server')

const TOKEN = process.env.TWITTER_BEARER_TOKEN
const PORT = process.env.PORT || 3000

const corsOptions = {
  origin: ['http://localhost:3000', 'https://monitor-elecciones.vercel.app'],
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(cors(corsOptions))

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../', 'client', 'index.html'))
})

app.get('/tweets', async (req, res) => {
  res.json(await getTweets(`${req.query.ht}`))
})

const sortTweets = (t) => {
  return t.sort(function(a,b){
    return new Date(b.created_at) - new Date(a.created_at);
  });
}

async function getTweets(ht) {
  const TwitterURL =
    `https://api.twitter.com/2/tweets/search/recent?query=${ht}`
    + '&expansions=author_id,attachments.media_keys,referenced_tweets.id,referenced_tweets.id.author_id&tweet.fields=attachments,author_id,public_metrics,created_at,id,in_reply_to_user_id,referenced_tweets,text&user.fields=id,name,profile_image_url,protected,url,username,verified&media.fields=duration_ms,height,media_key,preview_image_url,type,url,width,public_metrics'
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
    console.log(e)
  }
  return res
}

server.listen(PORT, () => console.log(`Listening on port ${PORT}`))