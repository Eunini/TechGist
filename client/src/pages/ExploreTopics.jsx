
import React from 'react';

const ExploreTopics = () => {
  const topics = ['Cloud', 'AI/ML', 'DevOps', 'Future Tech'];

  return (
    <div className='container mx-auto px-4 py-8 min-h-screen'>
      <div className='text-center mb-12'>
        <h1 className='text-4xl font-bold'>Explore Topics</h1>
        <p className='text-md text-gray-500 mt-2'>
          Dive into a variety of topics and stay up-to-date with the latest
          trends in technology.
        </p>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
        {topics.map((topic) => (
          <div
            key={topic}
            className='bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center hover:shadow-xl transition-shadow duration-300 relative'
          >
            <span className='absolute top-2 right-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full'>
              Coming Soon
            </span>
            <h2 className='text-2xl font-semibold mb-4'>{topic}</h2>
            <p className='text-gray-600 dark:text-gray-400'>
              Browse articles and discussions on {topic}.
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExploreTopics;
