import db from '../models/index.js';
import { fn, col, Op } from 'sequelize';
const { Post } = db;

async function isDbUp() {
  try {
    await db.sequelize.authenticate({ logging: false });
    return true;
  } catch {
    return false;
  }
}

export const getTopics = async (_req, res, next) => {
  try {
    if (!(await isDbUp())) {
      return res.status(503).json({ topics: [], message: 'Database unavailable' });
    }
    const rows = await Post.findAll({
      attributes: [
        'topic',
        [fn('COUNT', col('topic')), 'count']
      ],
      where: {
        topic: {
          [Op.not]: null,
          [Op.ne]: ''
        }
      },
      group: ['topic'],
      order: [[fn('COUNT', col('topic')), 'DESC']],
      raw: true,
    });
    res.json({ topics: rows });
  } catch (e) {
    console.error('getTopics error:', e);
    // Graceful fallback instead of generic 500 body stream errors
    res.status(500).json({ topics: [], message: 'Failed to load topics' });
  }
};
