const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const axios = require('axios');

app.use(bodyParser.json());

app.use(cors());

const posts = {};

const handleEvents = (type, data) => {
  if (type === 'PostCreated') {
    const { id, title } = data;
    posts[data.id] = {
      id,
      title,
      comments: [],
    };
  }
  if (type === 'CommentCreated') {
    const { id, content, postId, status } = data;
    posts[postId].comments.push({
      id,
      content,
      status,
    });
  }
  if (type === 'CommentUpdated') {
    const { id, content, postId, status } = data;

    const post = posts[postId];
    const comment = post.comments.find((cmt) => cmt.id === id);
    comment.status = status;
    comment.content = content;
  }
};

app.post('/events', (req, res) => {
  const { type, data } = req.body;
  handleEvents(type, data);
  res.send({});
});

app.get('/posts', (req, res) => {
  res.send(posts);
});
app.listen(4002, async () => {
  console.log('query server is running on port 4002');
  const res = await axios.get('http://localhost:4005/events');
  for (let event of res.data) {
    console.log('processing event:', event);
    handleEvents(event.type, event.data);
  }
});
