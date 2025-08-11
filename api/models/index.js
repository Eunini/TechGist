import sequelize from '../config/database.js';
import User from './user.model.js';
import Post from './post.model.js';
import Comment from './comment.model.js';

// User-Post association
User.hasMany(Post, { foreignKey: 'authorId', as: 'posts' });
Post.belongsTo(User, { foreignKey: 'authorId', as: 'author' });

// User-Comment association
User.hasMany(Comment, { foreignKey: 'authorId', as: 'comments' });
Comment.belongsTo(User, { foreignKey: 'authorId', as: 'author' });

// Post-Comment association
Post.hasMany(Comment, { foreignKey: 'postId', as: 'comments' });
Comment.belongsTo(Post, { foreignKey: 'postId', as: 'post' });

// User-Follower association (self-referencing many-to-many)
const Follow = sequelize.define('Follow', {}, { timestamps: false });
User.belongsToMany(User, { as: 'Followers', through: Follow, foreignKey: 'followingId' });
User.belongsToMany(User, { as: 'Following', through: Follow, foreignKey: 'followerId' });


const db = {
  sequelize,
  User,
  Post,
  Comment,
  Follow,
};

db.sync = async () => {
  console.warn('[db.sync] Deprecated. Use migrations instead: npm run migrate');
};

export default db;