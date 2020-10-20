const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());

app.use(bodyParser.json());

const posts = {};

app.get('/posts', (req, res) => {
  return res.send(posts);
});
app.post('/events', (req, res) => {
  const event = req.body;
  console.log('event:', event.type);
  res.send({});
});
app.post('/posts', async (req, res) => {
  const { title } = req.body;
  const id = randomBytes(4).toString('hex');
  posts[id] = { id, title };
  await axios.post('http://event-bus-srv:4005/events', {
    type: 'PostCreated',
    data: {
      id,
      title,
    },
  });
  res.status(201).send(posts[id]);
});

app.listen(4000, () => {
  console.log("v super!!!!")
  console.log('post server is running on 4000');
});
