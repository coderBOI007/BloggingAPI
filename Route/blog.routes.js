const express = require('express');
const { body } = require('express-validator');
const {
  createBlog,
  getAllBlogs,
  getBlogById,
  getUserBlogs,
  updateBlog,
  deleteBlog
} = require('./controller/blog.controller.js.js');
const { protect } = require('./Middleware/auth.middleware.js.js');
const { validate } = require('./Middleware/validation.middleware.js.js');

const router = express.Router();

// Public routes
router.get('/', getAllBlogs);
router.get('/:id', getBlogById);

// Protected routes
router.use(protect);

router.post('/', [
  body('title').notEmpty().trim().withMessage('Title is required'),
  body('body').notEmpty().withMessage('Body is required'),
  validate
], createBlog);

router.get('/user/my-blogs', getUserBlogs);
router.patch('/:id', updateBlog);
router.delete('/:id', deleteBlog);

module.exports = router;

