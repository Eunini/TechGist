import { Button } from 'flowbite-react';
import { Link } from 'react-router-dom';

export default function CallToAction() {
  return (
    <div className='flex flex-col sm:flex-row p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md items-center'>
      <div className='flex-1 flex flex-col justify-center text-center sm:text-left'>
        <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>
          Ready to Start Your Journey?
        </h2>
        <p className='text-gray-600 dark:text-gray-400 my-3'>
          Create an account to join discussions, publish your own articles, and connect with the best minds in tech.
        </p>
        <Link to='/sign-up'>
          <Button
            className='w-full sm:w-auto'
          >
            Join the Community
          </Button>
        </Link>
      </div>
      <div className='p-7 flex-1 hidden sm:block'>
        <img 
          src='https://images.unsplash.com/photo-1521737711867-e3b97375f902?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80' 
          alt='Community collaboration'
          className='rounded-lg'
        />
      </div>
    </div>
  );
}