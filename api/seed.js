import db from './models/index.js';
const { User, Post, Comment, Follow } = db;
import bcrypt from 'bcryptjs';

const seedDatabase = async () => {
  try {
    console.log('Starting database sync...');
    // Use { force: true } to drop existing tables and re-seed.
    // Be careful with this in production!
    await db.sequelize.sync({ force: true });
    console.log('Database synchronized.');

    // Create Users
    console.log('Creating users...');
    const users = await User.bulkCreate([
      { username: 'admin_user', email: 'admin@example.com', password: 'password123', role: 'admin', niche: 'devops' },
      { username: 'cloud_dev', email: 'cloud@example.com', password: 'password123', role: 'contributor', niche: 'cloud' },
      { username: 'ai_enthusiast', email: 'ai@example.com', password: 'password123', role: 'contributor', niche: 'ai-ml' },
      { username: 'devops_guru', email: 'devops@example.com', password: 'password123', role: 'contributor', niche: 'devops' },
      { username: 'tech_reader', email: 'reader@example.com', password: 'password123', role: 'user', niche: 'web-dev' },
      { username: 'game_maker', email: 'game@example.com', password: 'password123', role: 'user', niche: 'game-dev' },
      { username: 'security_expert', email: 'security@example.com', password: 'password123', role: 'contributor', niche: 'cybersecurity' },
      { username: 'web3_builder', email: 'web3@example.com', password: 'password123', role: 'user', niche: 'web3' },
    ], { individualHooks: true }); // individualHooks to ensure beforeCreate hook runs for passwords
    console.log(`${users.length} users created.`);

    const [admin, cloudDev, aiGuru, devopsGuru, reader, gameMaker, securityExpert, web3Builder] = users;

    // Create Follows
    console.log('Creating follows...');
    await Follow.bulkCreate([
        { followerId: reader.id, followingId: cloudDev.id },
        { followerId: reader.id, followingId: aiGuru.id },
        { followerId: cloudDev.id, followingId: devopsGuru.id },
        { followerId: aiGuru.id, followingId: devopsGuru.id },
    ]);
    console.log('Follows created.');

    // Create Posts
    console.log('Creating posts...');
    const posts = await Post.bulkCreate([
      { title: 'Getting Started with AWS Lambda', content: 'A deep dive into serverless computing with AWS...', topic: 'Cloud', authorId: cloudDev.id, slug: 'getting-started-with-aws-lambda' },
      { title: 'The Rise of Large Language Models', content: 'Exploring the impact of LLMs like GPT-4.', topic: 'AI/ML', authorId: aiGuru.id, slug: 'the-rise-of-large-language-models' },
      { title: 'CI/CD Pipelines with Jenkins and Docker', content: 'Automating your development workflow.', topic: 'DevOps', authorId: devopsGuru.id, slug: 'cicd-pipelines-with-jenkins-and-docker' },
      { title: 'Quantum Computing Explained', content: 'What is quantum computing and how will it change the world?', topic: 'Future Tech', authorId: admin.id, slug: 'quantum-computing-explained' },
    ]);
    console.log(`${posts.length} posts created.`);
    
    const [lambdaPost, llmPost] = posts;

    // Create Comments
    console.log('Creating comments...');
    await Comment.bulkCreate([
      { content: 'Great introduction to Lambda!', postId: lambdaPost.id, authorId: reader.id },
      { content: 'I had a question about cold starts...', postId: lambdaPost.id, authorId: devopsGuru.id },
      { content: 'Fascinating read on LLMs.', postId: llmPost.id, authorId: reader.id },
      { content: 'The potential is mind-blowing.', postId: llmPost.id, authorId: cloudDev.id },
    ]);
    console.log('Comments created.');


    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Failed to seed database:', error);
  } finally {
    await db.sequelize.close();
    console.log('Database connection closed.');
  }
};

seedDatabase();