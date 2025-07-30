import commentService from '../services/comment.service.js';
import AppError from '../utils/error.js';

const handleAsync = fn => (req, res, next) => {
    fn(req, res, next).catch(next);
};

export const createComment = handleAsync(async (req, res) => {
    const { content, postId } = req.body;
    if (!content || !postId) {
        throw new AppError('Please provide content and postId', 400);
    }
    const comment = await commentService.createComment({ content, postId, authorId: req.user.id });
    res.status(201).json({
        status: 'success',
        data: { comment }
    });
});

export const getCommentsForPost = handleAsync(async (req, res) => {
    const comments = await commentService.getCommentsForPost(req.params.postId);
    res.status(200).json({
        status: 'success',
        results: comments.length,
        data: { comments }
    });
});

export const updateComment = handleAsync(async (req, res) => {
    const { content } = req.body;
    if (!content) {
        throw new AppError('Please provide content', 400);
    }
    const comment = await commentService.updateComment(req.params.commentId, { content }, req.user.id, req.user.role);
    res.status(200).json({
        status: 'success',
        data: { comment }
    });
});

export const deleteComment = handleAsync(async (req, res) => {
    await commentService.deleteComment(req.params.commentId, req.user.id, req.user.role);
    res.status(204).json({
        status: 'success',
        data: null
    });
});
