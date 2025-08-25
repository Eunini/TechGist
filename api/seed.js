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
  { 
    title: 'Mastering AWS Lambda: A Practical Guide to Serverless Computing', 
    content: `AWS Lambda has transformed cloud development by removing the need to manage servers. 
With Lambda, you write your code, define an event trigger, and let AWS handle provisioning, scaling, and high availability. 
This article takes a deep dive into how serverless computing works, when to use it, and how to avoid common pitfalls. 
We’ll cover everything from building your first Lambda function to integrating with services like API Gateway, S3, and DynamoDB. 
Along the way, you’ll learn best practices for monitoring, debugging, and optimizing costs, plus real-world examples 
such as running serverless APIs, processing images, and handling event-driven workflows.`,
    topic: 'Cloud',
    authorId: cloudDev.id,
    slug: 'mastering-aws-lambda-serverless-guide' 
  },

  { 
    title: 'The Rise of Large Language Models: How AI is Reshaping Our World', 
    content: `Large Language Models (LLMs) like GPT-4 have become the cornerstone of modern AI applications. 
From chatbots and code assistants to creative tools and enterprise automation, LLMs are changing how humans 
interact with technology. This post explores the evolution of LLMs, their architecture, and the data 
requirements that make them possible. We’ll also discuss the opportunities they unlock in fields like 
education, healthcare, and productivity, while examining the ethical challenges around bias, misinformation, 
and responsible AI use. If you want to understand where the future of AI is headed, this article breaks it down.`,
    topic: 'AI/ML',
    authorId: aiGuru.id,
    slug: 'the-rise-of-large-language-models' 
  },

  { 
    title: 'CI/CD Pipelines with Jenkins and Docker: Automating Your Development Workflow', 
    content: `Modern software development demands speed, consistency, and reliability—and that’s where CI/CD pipelines shine. 
By combining Jenkins with Docker, developers can automate building, testing, and deploying applications 
in a repeatable, scalable way. This guide walks through setting up a Jenkins pipeline, containerizing applications 
with Docker, and integrating automated testing into your workflow. We’ll explore pipeline-as-code concepts, 
best practices for managing environments, and how to achieve zero-downtime deployments. Whether you’re new to DevOps 
or looking to optimize your delivery process, this article shows you how to put Jenkins and Docker to work together.`,
    topic: 'DevOps',
    authorId: devopsGuru.id,
    slug: 'cicd-pipelines-with-jenkins-and-docker' 
  },

  { 
    title: 'Quantum Computing Explained: Unlocking the Future of Technology', 
    content: `Quantum computing represents a fundamental shift in how we process information. 
Unlike classical computers, which use bits, quantum machines harness qubits that can exist in multiple states simultaneously. 
This gives them the potential to solve problems in cryptography, optimization, and drug discovery that are currently impossible 
for classical systems. In this article, we’ll break down the key principles of quantum mechanics that power these machines, 
survey the current state of quantum hardware, and explore what companies like IBM, Google, and startups are building. 
We’ll also look ahead at the challenges of error correction, scalability, and what a quantum-powered world might look like 
over the next decade.`,
    topic: 'Future Tech',
    authorId: admin.id,
    slug: 'quantum-computing-explained' 
  },
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