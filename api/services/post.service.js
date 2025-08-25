import db from '../models/index.js';
const { Post, User, Comment } = db;
import AppError from '../utils/error.js';
import { Op } from 'sequelize';

class PostService {
  async createPost(postData) {
    // Simple slug generation
    const slug = postData.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
    const existingPost = await Post.findOne({ where: { slug } });
    if (existingPost) {
      postData.slug = `${slug}-${Date.now()}`;
    } else {
      postData.slug = slug;
    }
    const post = await Post.create(postData);
    return post;
  }

  async getPost(postId) {
    const post = await Post.findByPk(postId, {
      include: [
        { model: User, as: 'author', attributes: ['id', 'username', 'profilePicture'] },
        { 
          model: Comment, as: 'comments',
          include: [{ model: User, as: 'author', attributes: ['id', 'username', 'profilePicture'] }]
        }
      ]
    });
    if (!post) {
      throw new AppError('Post not found.', 404);
    }
    return post;
  }

  async getAllPosts(queryParams) {
    const { topic, search, postId } = queryParams;
    const where = {};
    if (topic) {
      where.topic = topic;
    }
    if (postId) {
      where.id = postId;
    }
    if (search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { content: { [Op.iLike]: `%${search}%` } },
        { slug: { [Op.iLike]: `%${search}%` } },
      ];
    }
    const posts = await Post.findAll({ 
        where,
        include: [{ model: User, as: 'author', attributes: ['id', 'username'], required: false }],
        order: [['createdAt', 'DESC']]
    });
    return posts;
  }

  async updatePost(postId, updateData, userId) {
    const post = await Post.findByPk(postId);
    if (!post) {
      throw new AppError('Post not found.', 404);
    }
    if (post.authorId !== userId) {
        throw new AppError('You are not authorized to update this post.', 403);
    }
    if (updateData.title) {
        updateData.slug = updateData.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
    }
    await post.update(updateData);
    return post;
  }

  async deletePost(postId, userId) {
    const post = await Post.findByPk(postId);
    if (!post) {
      throw new AppError('Post not found.', 404);
    }
    if (post.authorId !== userId) {
        throw new AppError('You are not authorized to delete this post.', 403);
    }
    await post.destroy();
    return { message: 'Post deleted successfully.' };
  }
}

export default new PostService();