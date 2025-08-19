import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'flowbite-react';
import { useSelector } from 'react-redux';
import { HiOutlineArrowRight, HiOutlineCode, HiOutlineUsers, HiOutlineTrendingUp } from 'react-icons/hi';
import PostCard from '../posts/PostCard';
import SkeletonPostCard from '../../components/UI/SkeletonPostCard';
import AnimatedBackground from '../../components/AnimatedBackground';
import CommunityCTA from '../../components/UI/CommunityCTA';
import Reveal from '../../components/UI/Reveal';
import '../../components/AnimatedBackground.css';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { theme } = useSelector((state) => state.theme);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/post/getposts?limit=6');
        const ct = res.headers.get('content-type') || '';
        let data = null;
        if (ct.includes('application/json')) {
          data = await res.json();
        } else {
          const text = await res.text();
          console.warn('Non-JSON response for posts:', text.slice(0,120));
        }
        if (res.ok && data) {
          setPosts(data.posts || []);
        } else if (!res.ok) {
          console.error('Posts fetch failed', data?.message || res.status);
        }
      } catch (error) {
        console.error('Failed to fetch posts:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div className='min-h-screen flex flex-col'>
      {/* Hero Section */}
      <div className='relative flex flex-col items-center justify-center text-center px-4 py-24 sm:py-32 lg:py-40 overflow-hidden bg-white dark:bg-transparent'>
        {theme === 'dark' && <AnimatedBackground />}
        <div className='relative z-10'>
          <Reveal>
            <h1 className='text-4xl md:text-6xl font-extrabold mb-4 tracking-tight text-gray-900 dark:text-white text-shadow-lg'>
              Build Your Future in Tech, Today.
            </h1>
          </Reveal>
          <Reveal delay={120}>
            <p className='text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8'>
              Join a community of forward-thinking developers, engineers, and innovators. Learn, connect, and grow with us as we explore the frontiers of technology.
            </p>
          </Reveal>
          <Reveal delay={240}>
            <Link to='/about'>
              <Button size='xl' className='w-full sm:w-auto bg-teal-500 hover:bg-teal-600 border-none text-white'>
                Learn More About Our Mission
                <HiOutlineArrowRight className='ml-2 h-5 w-5' />
              </Button>
            </Link>
          </Reveal>
        </div>
      </div>

      {/* Why Join Us Section */}
      <div className='py-16 sm:py-24 bg-gray-50 dark:bg-gray-800'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <Reveal>
            <h2 className='text-3xl font-bold text-center text-gray-900 dark:text-white mb-12'>
              Why Join TechGist?
            </h2>
          </Reveal>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-12 text-center'>
            {[
              {
                icon: <HiOutlineCode className='h-8 w-8' />,
                title: 'Learn & Grow',
                body: 'Access high-quality articles, tutorials, and discussions on cutting-edge technologies to accelerate your learning.'
              },
              {
                icon: <HiOutlineUsers className='h-8 w-8' />,
                title: 'Connect with Peers',
                body: 'Network with a vibrant community of students, professionals, and experts. Share ideas, collaborate on projects, and find mentors.'
              },
              {
                icon: <HiOutlineTrendingUp className='h-8 w-8' />,
                title: 'Stay Ahead',
                body: "Keep up with the fast-paced world of tech. Our content is curated to ensure you're always informed about the latest trends and innovations."
              }
            ].map((item, i) => (
              <Reveal key={item.title} delay={i * 120} className='flex flex-col items-center'>
                <div className='flex items-center justify-center h-16 w-16 rounded-full bg-teal-500 text-white mb-4'>
                  {item.icon}
                </div>
                <h3 className='text-xl font-semibold text-gray-900 dark:text-white mb-2'>{item.title}</h3>
                <p className='text-gray-600 dark:text-gray-400'>{item.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Posts Section */}
      <div className='py-16 sm:py-24 bg-white dark:bg-gray-900'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <Reveal>
            <h2 className='text-3xl font-bold text-center text-gray-900 dark:text-white mb-12'>
              Explore Our Latest Articles
            </h2>
          </Reveal>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 justify-items-center'>
            {loading && Array.from({ length: 6 }).map((_, i) => <SkeletonPostCard key={i} />)}
            {!loading && posts && posts.length > 0 ? (
              posts.map((post, i) => (
                <Reveal key={post._id || post.id} delay={i * 100}>
                  <PostCard post={post} />
                </Reveal>
              ))
            ) : (
              !loading && <p className='text-center col-span-full'>No posts found. Why not create the first one?</p>
            )}
          </div>
          {!loading && posts && posts.length > 0 && (
            <Reveal delay={Math.min(posts.length * 100, 800)}>
              <div className='text-center mt-12'>
                <Link to='/search'>
                  <Button size='lg' outline className='border-teal-500 text-teal-500 hover:bg-teal-500 hover:text-white'>
                    View All Articles
                  </Button>
                </Link>
              </div>
            </Reveal>
          )}
        </div>
      </div>

  <Reveal><CommunityCTA /></Reveal>
    </div>
  );
}
