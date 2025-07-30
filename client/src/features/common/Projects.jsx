import CallToAction from './CallToAction';

export default function Projects() {
  return (
    <div className='min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white py-12 sm:py-20'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='text-center'>
          <h1 className='text-4xl md:text-5xl font-extrabold tracking-tight'>
            Community Showcase
          </h1>
          <p className='mt-4 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-400'>
            Discover innovative projects built by members of the TechGist community. Get inspired, find collaborators, and see what's possible when we create together.
          </p>
        </div>

        <div className='mt-16'>
          <h2 className='text-2xl font-bold text-center mb-10'>Featured Projects</h2>
          {/* This section would be dynamically populated with projects from the community */}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {/* Placeholder Project Card */}
            <div className='bg-gray-50 dark:bg-gray-800 rounded-lg shadow-lg p-6 flex flex-col'>
              <h3 className='text-xl font-semibold mb-2'>AI-Powered Code Assistant</h3>
              <p className='text-gray-600 dark:text-gray-400 mb-4 flex-grow'>
                An intelligent tool that provides real-time code suggestions and bug fixes, built with Python and TensorFlow.
              </p>
              <div className='mt-auto'>
                <p className='text-sm text-gray-500 mb-2'>By: Jane Doe</p>
                <a href='#' className='text-indigo-500 hover:underline font-semibold'>
                  View Project
                </a>
              </div>
            </div>
            {/* Placeholder Project Card */}
            <div className='bg-gray-50 dark:bg-gray-800 rounded-lg shadow-lg p-6 flex flex-col'>
              <h3 className='text-xl font-semibold mb-2'>Serverless Data Pipeline</h3>
              <p className='text-gray-600 dark:text-gray-400 mb-4 flex-grow'>
                A scalable data processing pipeline using AWS Lambda, S3, and DynamoDB for real-time analytics.
              </p>
              <div className='mt-auto'>
                <p className='text-sm text-gray-500 mb-2'>By: John Smith</p>
                <a href='#' className='text-indigo-500 hover:underline font-semibold'>
                  View Project
                </a>
              </div>
            </div>
            {/* Placeholder Project Card */}
            <div className='bg-gray-50 dark:bg-gray-800 rounded-lg shadow-lg p-6 flex flex-col'>
              <h3 className='text-xl font-semibold mb-2'>Decentralized Social Network</h3>
              <p className='text-gray-600 dark:text-gray-400 mb-4 flex-grow'>
                A proof-of-concept social media platform built on the Ethereum blockchain with Solidity and React.
              </p>
              <div className='mt-auto'>
                <p className='text-sm text-gray-500 mb-2'>By: Alex Johnson</p>
                <a href='#' className='text-indigo-500 hover:underline font-semibold'>
                  View Project
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className='mt-20'>
          <CallToAction />
        </div>
      </div>
    </div>
  );
}