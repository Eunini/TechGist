import { DataTypes } from 'sequelize';

/**
 * Initial schema migration replacing sync({ alter: true }).
 */
export async function up({ context: queryInterface }) {
  await queryInterface.createTable('Users', {
    id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
    username: { type: DataTypes.STRING, allowNull: false, unique: true },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    profilePicture: { type: DataTypes.STRING, allowNull: false, defaultValue: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png' },
    bio: { type: DataTypes.TEXT },
    role: { type: DataTypes.STRING, allowNull: false, defaultValue: 'user' },
    provider: { type: DataTypes.STRING, allowNull: false, defaultValue: 'local' },
    createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  });

  await queryInterface.createTable('Posts', {
    id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
    authorId: { type: DataTypes.UUID, allowNull: false },
    content: { type: DataTypes.TEXT, allowNull: false },
    title: { type: DataTypes.STRING, allowNull: false, unique: true },
    image: { type: DataTypes.STRING, allowNull: false, defaultValue: 'https://www.hostinger.com/tutorials/wp-content/uploads/sites/2/2021/09/how-to-write-a-blog-post.png' },
    category: { type: DataTypes.STRING, allowNull: false, defaultValue: 'uncategorized' },
    topic: { type: DataTypes.STRING },
    slug: { type: DataTypes.STRING, allowNull: false, unique: true },
    createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  });
  await queryInterface.addIndex('Posts', ['authorId']);

  await queryInterface.createTable('Comments', {
    id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
    content: { type: DataTypes.TEXT, allowNull: false },
    likes: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    authorId: { type: DataTypes.UUID },
    postId: { type: DataTypes.UUID },
    createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  });
  await queryInterface.addIndex('Comments', ['postId']);
  await queryInterface.addIndex('Comments', ['authorId']);

  await queryInterface.createTable('Follows', {
    followerId: { type: DataTypes.UUID, allowNull: false },
    followingId: { type: DataTypes.UUID, allowNull: false },
    createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  });
  await queryInterface.addIndex('Follows', ['followerId']);
  await queryInterface.addIndex('Follows', ['followingId']);
  await queryInterface.addConstraint('Follows', { fields: ['followerId','followingId'], type: 'primary key', name: 'follows_pkey' });
}

export async function down({ context: queryInterface }) {
  await queryInterface.dropTable('Follows');
  await queryInterface.dropTable('Comments');
  await queryInterface.dropTable('Posts');
  await queryInterface.dropTable('Users');
}
