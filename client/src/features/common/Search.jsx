import { Button, Select, TextInput, Spinner } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PostCard from '../posts/PostCard';

const topics = ['Cloud', 'AI/ML', 'DevOps', 'Future Tech', 'Cybersecurity', 'Web3', 'Game Dev'];

export default function Search() {
  const [sidebarData, setSidebarData] = useState({
    searchTerm: '',
    sort: 'desc',
    topic: '',
  });
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    const sortFromUrl = urlParams.get('sort');
    const topicFromUrl = urlParams.get('topic');
    if (searchTermFromUrl || sortFromUrl || topicFromUrl) {
      setSidebarData({
        searchTerm: searchTermFromUrl || '',
        sort: sortFromUrl || 'desc',
        topic: topicFromUrl || '',
      });
    }

    const fetchPosts = async () => {
      setLoading(true);
      const searchQuery = urlParams.toString();
      try {
        const res = await fetch(`/api/post/getposts?${searchQuery}`);
        if (res.ok) {
          const data = await res.json();
          setPosts(data.posts);
          setShowMore(data.posts.length === 8);
        }
      } catch (error) {
        console.error('Failed to fetch posts:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [location.search]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setSidebarData(prev => ({ ...prev, [id]: value }));
  };

  const handleTopicChange = (topic) => {
    setSidebarData(prev => ({ ...prev, topic: prev.topic === topic ? '' : topic }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set('searchTerm', sidebarData.searchTerm);
    urlParams.set('sort', sidebarData.sort);
    if (sidebarData.topic) {
      urlParams.set('topic', sidebarData.topic);
    }
    navigate(`/search?${urlParams.toString()}`);
  };

  const handleShowMore = async () => {
    const startIndex = posts.length;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('startIndex', startIndex);
    try {
      const res = await fetch(`/api/post/getposts?${urlParams.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setPosts(prev => [...prev, ...data.posts]);
        setShowMore(data.posts.length === 8);
      }
    } catch (error) {
      console.error('Failed to fetch more posts:', error);
    }
  };

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200'>
      {/* Hero Section */}
      <div className='bg-white dark:bg-gray-800 py-16 px-4 text-center shadow-md'>
        <h1 className='text-4xl font-bold text-gray-900 dark:text-white mb-2'>Find Your Tech Gist</h1>
        <p className='text-lg text-gray-600 dark:text-gray-400 mb-8'>
          Explore articles on cutting-edge technologies and join the conversation.
        </p>
        <form onSubmit={handleSubmit} className='max-w-2xl mx-auto'>
          <div className='relative'>
            <TextInput
              id='searchTerm'
              type='text'
              placeholder='Search for articles, topics, or keywords...'
              className='w-full'
              value={sidebarData.searchTerm}
              onChange={handleChange}
            />
            <Button type='submit' className='absolute right-2 top-1/2 -translate-y-1/2' size='sm' gradientDuoTone='greenToBlue'>
              Search
            </Button>
          </div>
        </form>
      </div>

      {/* Filters and Results */}
      <div className='container mx-auto p-4 md:p-7'>
        <div className='mb-8'>
          <h2 className='text-xl font-semibold mb-4 text-center'>Filter by Topic</h2>
          <div className='flex flex-wrap justify-center gap-2'>
            {topics.map(topic => (
              <Button
                key={topic}
                onClick={() => handleTopicChange(topic)}
                color={sidebarData.topic === topic ? 'dark' : 'light'}
                pill
              >
                {topic}
              </Button>
            ))}
          </div>
        </div>

        <div className='w-full'>
          <div className='flex justify-between items-center mb-6 pb-2 border-b border-gray-300 dark:border-gray-700'>
            <h2 className='text-2xl font-semibold'>
              {loading ? 'Searching...' : 'Search Results'}
            </h2>
            <div className='flex items-center gap-2'>
              <label className='font-semibold text-sm'>Sort by:</label>
              <Select onChange={handleChange} value={sidebarData.sort} id='sort' size='sm'>
                <option value='desc'>Latest</option>
                <option value='asc'>Oldest</option>
              </Select>
            </div>
          </div>
          
          {loading ? (
            <div className='flex justify-center items-center h-64'>
              <Spinner size='xl' />
            </div>
          ) : (
            <>
              {posts.length === 0 ? (
                <p className='text-xl text-center text-gray-500 py-10'>No articles found. Try a different search.</p>
              ) : (
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
                  {posts.map((post) => <PostCard key={post.id} post={post} />)}
                </div>
              )}
              {showMore && (
                <div className='text-center mt-8'>
                  <Button onClick={handleShowMore} gradientDuoTone='greenToBlue' outline>
                    Show More
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
