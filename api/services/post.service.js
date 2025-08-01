import db from '../models/index.js';
const { Post, User, Comment } = db;
import AppError from '../utils/error.js';
import { Op } from 'sequelize';

class PostService {
  async createPost(postData) {
    // Simple slug generation
    const slug = postData.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
    const post = await Post.create({ ...postData, slug });
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
    const { topic, search } = queryParams;
    const where = {};
    if (topic) {
      where.topic = topic;
    }
    if (search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { content: { [Op.iLike]: `%${search}%` } },
      ];
    }
    const posts = await Post.findAll({ 
        where,
        include: [{ model: User, as: 'author', attributes: ['id', 'username'] }],
        order: [['createdAt', 'DESC']]
    });
    return posts;
  }

  async updatePost(postId, updateData, userId, userRole) {
    const post = await Post.findByPk(postId);
    if (!post) {
      throw new AppError('Post not found.', 404);
    }
    if (post.authorId !== userId && userRole !== 'admin') {
        throw new AppError('You are not authorized to update this post.', 403);
    }
    if (updateData.title) {
        updateData.slug = updateData.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
    }
    await post.update(updateData);
    return post;
  }

  async deletePost(postId, userId, userRole) {
    const post = await Post.findByPk(postId);
    if (!post) {
      throw new AppError('Post not found.', 404);
    }
    if (post.authorId !== userId && userRole !== 'admin') {
        throw new AppError('You are not authorized to delete this post.', 403);
    }
    await post.destroy();
    return { message: 'Post deleted successfully.' };
  }
}

export default new PostService();