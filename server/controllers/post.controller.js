import formidable from 'formidable';
import fs from 'fs';
import Post from '../models/post.model';
import errorHandler from '../helpers/dbErrorHandler';

const create = (req, res) => {
  const form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: 'Image could not be uploaded',
      });
    }
    const post = new Post(fields);
    post.postedBy = req.profile;
    if (files.photo) {
      post.photo.data = fs.readFileSync(files.photo.path);
      post.photo.contentType = files.photo.type;
    }
    post.save((err, result) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler.getErrorMessage(err),
        });
      }
      res.json(result);
    });
  });
};

const postByID = (req, res, next, id) => {
  Post.findById(id)
    .populate('postedBy', '_id name')
    .exec((err, post) => {
      if (err || !post) {
        return res.status('400').json({
          error: 'Post not found',
        });
      }
      req.post = post;
      next();
    });
};

const listByUser = (req, res) => {
  Post.find({ postedBy: req.profile._id })
    .populate('comments', 'text created')
    .populate('comments.postedBy', '_id name')
    .populate('postedBy', '_id name')
    .sort('-created')
    .exec((err, posts) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler.getErrorMessage(err),
        });
      }
      res.json(posts);
    });
};

const listNewsFeed = (req, res) => {
  const { following } = req.profile;
  following.push(req.profile._id);
  Post.find({ postedBy: { $in: req.profile.following } })
    .populate('comments', 'text created')
    .populate('comments.postedBy', '_id name')
    .populate('postedBy', '_id name')
    .sort('-created')
    .exec((err, posts) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler.getErrorMessage(err),
        });
      }
      res.json(posts);
    });
};

const remove = (req, res) => {
  const { post } = req;
  post.remove((err, deletedPost) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err),
      });
    }
    res.json(deletedPost);
  });
};

const photo = (req, res) => {
  res.set('Content-Type', req.post.photo.contentType);
  return res.send(req.post.photo.data);
};

const like = (req, res) => {
  Post.findByIdAndUpdate(
    req.body.postId,
    { $push: { likes: req.body.userId } },
    { new: true },
  ).exec((err, result) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err),
      });
    }
    res.json(result);
  });
};

const unlike = (req, res) => {
  Post.findByIdAndUpdate(
    req.body.postId,
    { $pull: { likes: req.body.userId } },
    { new: true },
  ).exec((err, result) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err),
      });
    }
    res.json(result);
  });
};

const comment = (req, res) => {
  const { comment } = req.body;
  comment.postedBy = req.body.userId;
  Post.findByIdAndUpdate(
    req.body.postId,
    { $push: { comments: comment } },
    { new: true },
  )
    .populate('comments.postedBy', '_id name')
    .populate('postedBy', '_id name')
    .exec((err, result) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler.getErrorMessage(err),
        });
      }
      res.json(result);
    });
};

const uncomment = (req, res) => {
  const { comment } = req.body;
  Post.findByIdAndUpdate(
    req.body.postId,
    { $pull: { comments: { _id: comment._id } } },
    { new: true },
  )
    .populate('comments.postedBy', '_id name')
    .populate('postedBy', '_id name')
    .exec((err, result) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler.getErrorMessage(err),
        });
      }
      res.json(result);
    });
};

const isPoster = (req, res, next) => {
  const isPoster = req.post
    && req.auth
    && req.post.postedBy._id == req.auth._id;
  if (!isPoster) {
    return res.status('403').json({
      error: 'User is not authorized',
    });
  }
  next();
};

export default {
  listNewsFeed,
  listByUser,
  create,
  photo,
  postByID,
  isPoster,
  remove,
  like,
  unlike,
  comment,
  uncomment,
};
