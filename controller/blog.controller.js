const Blog = require('../models/Blog.model');

exports.createBlog = async (req, res, next) => {
  try {
    const { title, description, body, tags } = req.body;

    const blog = await Blog.create({
      title,
      description,
      body,
      tags,
      author: req.user.id
    });

    res.status(201).json({
      success: true,
      message: 'Blog created successfully',
      data: blog
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Blog title already exists'
      });
    }
    next(error);
  }
};

exports.getAllBlogs = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const query = { state: 'published' };

    // Search functionality
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      query.$or = [
        { title: searchRegex },
        { tags: searchRegex }
      ];
    }

    if (req.query.author) {
      query.author = req.query.author;
    }

    // Sorting
    let sortOption = { createdAt: -1 };
    if (req.query.order_by) {
      const validSortFields = ['read_count', 'reading_time', 'createdAt'];
      if (validSortFields.includes(req.query.order_by)) {
        sortOption = { [req.query.order_by]: -1 };
      }
    }

    const blogs = await Blog.find(query)
      .populate('author', 'first_name last_name email')
      .sort(sortOption)
      .limit(limit)
      .skip(skip);

    const total = await Blog.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        blogs,
        pagination: {
          total,
          page,
          pages: Math.ceil(total / limit),
          limit
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getBlogById = async (req, res, next) => {
  try {
    const blog = await Blog.findOneAndUpdate(
      { _id: req.params.id, state: 'published' },
      { $inc: { read_count: 1 } },
      { new: true }
    ).populate('author', 'first_name last_name email');

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    res.status(200).json({
      success: true,
      data: blog
    });
  } catch (error) {
    next(error);
  }
};

exports.getUserBlogs = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const query = { author: req.user.id };

    if (req.query.state) {
      query.state = req.query.state;
    }

    const blogs = await Blog.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    const total = await Blog.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        blogs,
        pagination: {
          total,
          page,
          pages: Math.ceil(total / limit),
          limit
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.updateBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findOne({ _id: req.params.id, author: req.user.id });

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found or unauthorized'
      });
    }

    const allowedUpdates = ['title', 'description', 'body', 'tags', 'state'];
    const updates = Object.keys(req.body);

    updates.forEach(update => {
      if (allowedUpdates.includes(update)) {
        blog[update] = req.body[update];
      }
    });

    await blog.save();

    res.status(200).json({
      success: true,
      message: 'Blog updated successfully',
      data: blog
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Blog title already exists'
      });
    }
    next(error);
  }
};

exports.deleteBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findOneAndDelete({
      _id: req.params.id,
      author: req.user.id
    });

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found or unauthorized'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Blog deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
