require('dotenv').config({ silent: true });

const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const http = require('http');
const moment = require('moment-timezone');
moment.tz.setDefault('UTC');
const serialize = require('serialize-javascript');

app.use('/public', express.static(path.join(__dirname, 'public')));

let events = [
  {description: 'Initial 1', date: moment()},
  {description: 'Initial 2', date: moment().add(1, 'days')},
  {description: 'Initial 3', date: moment().add(-1, 'days')}
]; 
// let events = [
//   {
//     "description": "Event 1",
//     "date": "2018-02-03T00:00:00.000Z"
//   },
//   {
//     "description": "Event 2",
//     "date": "2018-02-04T00:00:00.000Z"
//   } 
// ];

app.get('/', (req, res) => {
  let template = fs.readFileSync(path.resolve('./index.html'), 'utf-8');
  let contentMarker = '<!--APP-->';
  res.send(template.replace(contentMarker, 
    `<script>var __INITIAL_STATE__ = ${serialize(events)}</script>`
  ));
});


app.use(require('body-parser').json());
app.post('/add_event', (req, res) => {
  events.push(req.body);
  res.sendStatus(200);
});

const server = http.createServer(app);

if (process.env.NODE_ENV === 'development') {
  const reload = require('reload');
  const reloadServer = reload(server, app);
  require('./webpack-dev-middleware').init(app);
}

server.listen(process.env.PORT, function () {
  console.log(`Example app listening on port ${process.env.PORT}!`);
  if (process.env.NODE_ENV === 'development') {
    require("open")(`http://localhost:${process.env.PORT}`);
  }
});
