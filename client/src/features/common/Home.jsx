import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'flowbite-react';
import { HiOutlineArrowRight, HiOutlineCode, HiOutlineUsers, HiOutlineTrendingUp } from 'react-icons/hi';
import PostCard from '../posts/PostCard';
import ProfessionalAnimatedBackground from '../../components/ProfessionalAnimatedBackground';

export default function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch('/api/post/getposts?limit=3');
        const data = await res.json();
        if (res.ok) {
          setPosts(data.posts);
        }
      } catch (error) {
        console.error('Failed to fetch posts:', error);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div className='min-h-screen flex flex-col dark:bg-gray-900 text-white'>
      {/* Hero Section */}
      <div className='relative flex flex-col items-center justify-center text-center px-4 py-24 sm:py-32 lg:py-40'>
        <ProfessionalAnimatedBackground />
        <div className='relative z-10'>
          <h1 className='text-4xl md:text-6xl font-extrabold mb-4 tracking-tight'>
            Build Your Future in Tech, Today.
          </h1>
          <p className='text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-8'>
            Join a community of forward-thinking developers, engineers, and innovators. Learn, connect, and grow with us as we explore the frontiers of technology.
          </p>
          <Link to='/about'>
            <Button size='xl' className='w-full sm:w-auto'>
              Learn More About Our Mission
              <HiOutlineArrowRight className='ml-2 h-5 w-5' />
            </Button>
          </Link>
        </div>
      </div>

      {/* Why Join Us Section */}
      <div className='py-16 sm:py-24 bg-white dark:bg-gray-800'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <h2 className='text-3xl font-bold text-center text-gray-900 dark:text-white mb-12'>
            Why Join TechGist?
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-12 text-center'>
            <div className='flex flex-col items-center'>
              <div className='flex items-center justify-center h-16 w-16 rounded-full bg-indigo-500 text-white mb-4'>
                <HiOutlineCode className='h-8 w-8' />
              </div>
              <h3 className='text-xl font-semibold text-gray-900 dark:text-white mb-2'>Learn & Grow</h3>
              <p className='text-gray-600 dark:text-gray-400'>
                Access high-quality articles, tutorials, and discussions on cutting-edge technologies to accelerate your learning.
              </p>
            </div>
            <div className='flex flex-col items-center'>
              <div className='flex items-center justify-center h-16 w-16 rounded-full bg-indigo-500 text-white mb-4'>
                <HiOutlineUsers className='h-8 w-8' />
              </div>
              <h3 className='text-xl font-semibold text-gray-900 dark:text-white mb-2'>Connect with Peers</h3>
              <p className='text-gray-600 dark:text-gray-400'>
                Network with a vibrant community of students, professionals, and experts. Share ideas, collaborate on projects, and find mentors.
              </p>
            </div>
            <div className='flex flex-col items-center'>
              <div className='flex items-center justify-center h-16 w-16 rounded-full bg-indigo-500 text-white mb-4'>
                <HiOutlineTrendingUp className='h-8 w-8' />
              </div>
              <h3 className='text-xl font-semibold text-gray-900 dark:text-white mb-2'>Stay Ahead</h3>
              <p className='text-gray-600 dark:text-gray-400'>
                Keep up with the fast-paced world of tech. Our content is curated to ensure you're always informed about the latest trends and innovations.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Posts Section */}
      <div className='py-16 sm:py-24 bg-gray-900'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          {posts && posts.length > 0 && (
            <div>
              <h2 className='text-3xl font-bold text-center text-white mb-12'>
                Explore Our Latest Articles
              </h2>
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'>
                {posts.map((post) => (
                  <PostCard key={post._id} post={post} />
                ))}
              </div>
              <div className='text-center mt-12'>
                <Link to='/search'>
                  <Button size='lg' outline>
                    View All Articles
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
