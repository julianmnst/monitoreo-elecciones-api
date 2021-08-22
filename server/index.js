const cors = require('cors')
const config = require('dotenv').config()
const { server, app } = require('./server')
const { getTweets } = require('./tweetHandler')
const PORT = process.env.PORT || 3000

const corsOptions = {
  origin: ['http://localhost:3000', 'https://monitor-elecciones.vercel.app'],
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(cors(corsOptions))

app.get('/tweets', async (req, res) => {
  var tweets = []

  try {
    const queryHashtag = req.query.ht
    tweets = await getTweets()
  }
  catch(e) {
    console.error(e)
    tweets = {
      error: true,
      message: "No se pudieron traer los tweets"
    }
  }

  res.json(tweets)
})

server.listen(PORT, () => console.log(`Listening on port ${PORT}`))