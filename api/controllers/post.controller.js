import postService from '../services/post.service.js';
import AppError from '../utils/error.js';

const handleAsync = (fn) => (req, res, next) => fn(req, res, next).catch(next);

export const create = handleAsync(async (req, res) => {
  const { title, content, image, category, topic } = req.body;
  if (!title || !content) {
    throw new AppError('Please provide all required fields', 400);
  }
  const post = await postService.createPost({
    title,
    content,
    image,
    category,
    topic,
    authorId: req.user.id,
  });
  res.status(201).json({ status: 'success', data: { post } });
});

export const getposts = handleAsync(async (req, res) => {
  const { limit = 20, startIndex = 0, order = 'desc', searchTerm, topic } = req.query;
  // Basic filtering using service
  const posts = await postService.getAllPosts({ search: searchTerm, topic });
  // Stats
  const totalPosts = posts.length;
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
  const lastMonthPosts = posts.filter(p => new Date(p.createdAt) >= oneMonthAgo).length;
  // Pagination (simple slice)
  const sorted = posts.sort((a,b)=> order === 'asc' ? new Date(a.updatedAt) - new Date(b.updatedAt) : new Date(b.updatedAt) - new Date(a.updatedAt));
  const paged = sorted.slice(Number(startIndex), Number(startIndex) + Number(limit));
  res.status(200).json({ posts: paged, totalPosts, lastMonthPosts });
});

export const deletepost = handleAsync(async (req, res) => {
  const { postId, userId } = req.params;
  if (req.user.id !== userId && req.user.role !== 'admin') {
    throw new AppError('You are not allowed to delete this post', 403);
  }
  await postService.deletePost(postId, req.user.id, req.user.role);
  res.status(200).json({ message: 'The post has been deleted' });
});

export const updatepost = handleAsync(async (req, res) => {
  const { postId, userId } = req.params;
  if (req.user.id !== userId && req.user.role !== 'admin') {
    throw new AppError('You are not allowed to update this post', 403);
  }
  const updated = await postService.updatePost(postId, req.body, req.user.id, req.user.role);
  res.status(200).json({ status: 'success', data: { post: updated } });
});