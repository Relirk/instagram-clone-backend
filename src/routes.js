const express = require('express');
const multer = require('multer');
const uploadConfig = require('./config/upload');
const PostController = require('./controllers/PostController');
const LikeController = require('./controllers/Likecontroller');

const routes = new express.Router();
const upload = multer(uploadConfig);

routes.get('/', (req, res) => {return res.json({name: 'instagram-clone-api', status: 'up', http: 'up', socket: 'up'})});

routes.get('/posts', PostController.index)
routes.post('/posts', upload.single('image'), PostController.store)

routes.post('/posts/:id/like', LikeController.store)

module.exports = routes;
