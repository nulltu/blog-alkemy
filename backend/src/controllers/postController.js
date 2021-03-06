const { validationResult } = require('express-validator');
const { Post } = require('../config/db');
const boom = require('@hapi/boom')

const postController = {

  allPosts: async (req, res) => {
    try {
      const posts = await Post.findAll();
      if(posts.length < 1){
        res.json({message: "No post available"})
      }else{
        res.json(posts);
      }
    } catch (err) {
      res.send(boom.internal(err))
    }
  },

  postById: async (req, res) => {
    try {
      const postExists = await Post.findOne({
        where: { id: req.params.postId },
      });
      if (!postExists) {
        res.json({ message: 'post not found' });
      } else {
        res.json(postExists);
      }
    } catch (err) {
      res.send(boom.internal(err))
    }
  },

  createPost: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const post = await Post.create(req.body);
      res.json(post);
    } catch (err) {
      res.send(boom.badRequest(err),
      )
    }
  },

  putById: async (req, res) => {
    try {
      const postExists = await Post.findOne({
        where: { id: req.params.postId },
      });
      if (!postExists) {
        res.json({ message: 'post not found' });
      } else {
        await Post.update(req.body, {
          where: { id: req.params.postId },
        });
        res.json({ message: 'the post was updated correctly' });
      }
    } catch (err) {
      res.send(boom.badRequest(err))
    }
  },

  deleteById: async (req, res) => {
    try {
      const postExists = await Post.findOne({
        where: { id: req.params.postId },
      });
      if (!postExists) {
        res.json({ message: 'post not found' });
      } else {
        await Post.destroy({
          where: { id: req.params.postId },
        });

        res.json({ message: 'the post was deleted successfully' });
      }
    } catch (err) {
      res.send(boom.internal(err))
    }
  }

};

module.exports = postController;
