import db from '../models/index.js';
const { Comment, Post, User } = db;
import AppError from '../utils/error.js';

class CommentService {
  async createComment(commentData) {
    const post = await Post.findByPk(commentData.postId);
    if (!post) {
      throw new AppError('Post not found.', 404);
    }
    const comment = await Comment.create(commentData);
    return comment;
  }

  async getCommentsForPost(postId) {
    const comments = await Comment.findAll({ 
        where: { postId },
        include: [{ model: User, as: 'author', attributes: ['id', 'username', 'profilePicture'] }],
        order: [['createdAt', 'DESC']]
    });
    return comments;
  }

  async updateComment(commentId, updateData, userId) {
    const comment = await Comment.findByPk(commentId);
    if (!comment) {
      throw new AppError('Comment not found.', 404);
    }
    if (comment.authorId !== userId) {
        throw new AppError('You are not authorized to update this comment.', 403);
    }
    await comment.update(updateData);
    return comment;
  }

  async deleteComment(commentId, userId) {
    const comment = await Comment.findByPk(commentId);
    if (!comment) {
      throw new AppError('Comment not found.', 404);
    }
    if (comment.authorId !== userId) {
        throw new AppError('You are not authorized to delete this comment.', 403);
    }
    await comment.destroy();
    return { message: 'Comment deleted successfully.' };
  }
}

export default new CommentService();