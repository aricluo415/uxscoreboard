#!/usr/bin/env node
const fs = require('fs')
const path = require('path')

const express = require('express')
const https = require('https')
const compression = require('compression')
const cors = require('cors')
const responseTime = require('response-time')
const axios = require('axios')
const parseString = require('xml2js').parseString

require('dotenv').config()

const API_HOST = process.env.API_HOST || 'local.api.uxscoreboard'
const API_PORT = process.env.API_PORT || 9999

const app = express()

app.use(compression())
app.use(cors())
app.use(responseTime())

app.use(express.static('./dist'))

const parseDate = dt => {
  const yyyy = dt.slice(0, 4)
  const mm = dt.slice(4, 6)
  const dd = dt.slice(6, dt.length)
  return { yyyy, mm, dd }
}

app.get('/api/mlb/scores/:dt', (req, res) => {
  const { yyyy, mm, dd } = parseDate(req.params.dt)
  const url = `https://statsapi.mlb.com/api/v1/schedule?sportId=1&date=${mm}/${dd}/${yyyy}&sortBy=gameDate&hydrate=linescore(runners),flags,team,review`
  return axios
    .get(url)
    .then(scores => res.send(scores.data))
    .catch(error => res.send(error.status))
})

app.get('/api/nba/scores/:dt', (req, res) => {
  const { dt } = req.params
  const url = `http://data.nba.com/data/5s/json/cms/noseason/scoreboard/${dt}/games.json`
  const url2 = `http://data.nba.net/data/10s/prod/v2/${dt}/scoreboard.json`
  return axios
    .all([axios.get(url), axios.get(url2)])
    .then(
      axios.spread((games, standings) => {
        const scores = {}
        scores.year =
          games.data.sports_content.sports_meta.season_meta.season_year
        scores.games = games.data.sports_content.games.game.reduce(
          (arr, el, i) => {
            arr.push(Object.assign({}, el, standings.data.games[i]))
            return arr
          },
          []
        )
        res.send(scores)
      })
    )
    .catch(error => res.send(error.status))
})

app.get('/api/nba/scores/:dt/details/:id', (req, res) => {
  const { dt, id } = req.params
  const url = `http://data.nba.com/data/10s/json/cms/noseason/game/${dt}/${id}/boxscore.json`
  return axios
    .get(url)
    .then(scores => res.send(scores.data))
    .catch(error => res.send(error.status))
})

app.get('/api/nfl/scores/week/:week', (req, res) => {
  const { week } = req.params
  const url = `https://www.nfl.com/ajax/scorestrip?season=2017&seasonType=REG&week=${week}`
  return axios
    .get(url)
    .then(scores => {
      parseString(scores.data, (err, result) => {
        const scores = {}
        scores.year = result.ss.gms[0].$.y
        scores.games = result.ss.gms[0].g.reduce((arr, el, i) => {
          arr.push(el.$)
          return arr
        }, [])
        res.send(scores)
      })
    })
    .catch(error => res.send(error.status))
})

app.get('*', (req, res) => {
  res.sendFile(path.resolve('./dist/index.html'))
})

const localApp = https.createServer(
  {
    key: fs.readFileSync(`./.ssl/${API_HOST}.key`),
    cert: fs.readFileSync(`./.ssl/${API_HOST}.cert`),
    requestCert: false,
    rejectUnauthorized: false
  },
  app
)

const server = process.env.NODE_ENV === 'development' ? localApp : app
server.listen(API_PORT, () => {
  /* eslint-disable */
  console.log(`server listening on port ${API_PORT}`)
})
