require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const bodyParser = require('body-parser')
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;
const API_DATA_URL = 'https://project-fakeserver.pranayuma92.repl.co';
const randomId = Math.floor(1000 + Math.random() * 9000);
const exp = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});


// url shortener api
app.post('/api/shorturl', async function (req, res) {
  const { url } = req.body;
  const isValidUrl = exp.test(url);

  if(!isValidUrl) {
    res.send({ error: 'invalid url' });
    return;
  }

  const data = {
    id: randomId,
    original_url: url,
    short_url: randomId
  }

  const result = await axios.post(`${API_DATA_URL}/urldata`, data);

  const { original_url, short_url } = result.data;

  res.send({ original_url, short_url });
});

app.get('/api/shorturl/:id', async function (req, res) {
  const { id } = req.params;
  const result = await axios.get(`${API_DATA_URL}/urldata/${id}`);

  res.redirect(result.data.original_url);
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
