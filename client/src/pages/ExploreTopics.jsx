
import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '../components/UI/ToastProvider';

const ExploreTopics = () => {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const toast = useToast();

  const fallbackTopics = [
    { topic: 'Cloud', count: 0 },
    { topic: 'AI/ML', count: 0 },
    { topic: 'DevOps', count: 0 },
    { topic: 'Future Tech', count: 0 }
  ];

  const fetchTopics = useCallback(async () => {
    // Prevent re-entry if already loading
    if (loading) return;
    try {
      setError(false);
      setLoading(true);
      const res = await fetch('/api/post/topics');
      let data = null;
      try { data = await res.json(); } catch { data = {}; }
      if (res.ok && data.topics) {
        setTopics(data.topics);
        if (!data.topics.length) {
          toast.push('No topics yet. Be the first to create one!', 'info');
        }
      } else {
        throw new Error((data && data.message) || 'Failed to load topics');
      }
    } catch (err) {
      setError(true);
      setTopics([]);
      // Only show one error toast per failure session
      toast.push(err.message || 'Could not load topics', 'error');
    } finally {
      setLoading(false);
    }
  }, [toast, loading]);

  useEffect(() => {
    // initial load only
    fetchTopics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showFallback = error && !loading;

  if (loading) {
    return (
      <div className='container mx-auto px-4 py-16 min-h-screen'>
        <h1 className='text-3xl font-bold mb-8 text-center'>Explore Topics</h1>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className='animate-pulse bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md h-40'>
              <div className='h-6 bg-gray-300 dark:bg-gray-600 rounded w-1/2 mb-4'></div>
              <div className='h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2'></div>
              <div className='h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3'></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Dedicated empty state (successful fetch, zero topics)
  if (!loading && !error && topics.length === 0) {
    return (
      <div className='container mx-auto px-4 py-20 min-h-screen flex flex-col items-center text-center'>
        <h1 className='text-4xl font-bold mb-4'>Explore Topics</h1>
        <p className='text-md text-gray-500 mb-8 max-w-xl'>
          No topics yet. Be the first to spark a conversation in future tech careers—AI/ML, Cloud, DevOps, Cybersecurity, and emerging roles.
        </p>
        <div className='px-6 py-4 rounded-lg border border-dashed border-teal-400 dark:border-teal-600 bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm'>
          <p className='text-lg font-semibold text-teal-600 dark:text-teal-400'>No topics</p>
          <p className='text-sm mt-2 text-gray-500 dark:text-gray-400'>Create a post to automatically seed the first topic.</p>
          <Link
            to='/create-post'
            className='inline-block mt-4 px-5 py-2 rounded bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium transition-colors'
          >
            Create Post
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className='container mx-auto px-4 py-8 min-h-screen'>
      <div className='text-center mb-12'>
        <h1 className='text-4xl font-bold'>Explore Topics</h1>
        <p className='text-md text-gray-500 mt-2'>
          Dive into a variety of topics and stay up-to-date with the latest trends in technology.
        </p>
        {showFallback && (
          <div className='mt-4 inline-flex flex-col items-center gap-3'>
            <p className='text-sm text-red-500 font-medium'>We couldn't load live topics. Showing defaults.</p>
            <button
              onClick={fetchTopics}
              className='px-4 py-2 text-sm rounded bg-teal-600 text-white hover:bg-teal-700 focus:ring-2 focus:ring-teal-400 focus:outline-none'
            >
              Retry
            </button>
          </div>
        )}
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
        {(showFallback ? fallbackTopics : topics).map(({ topic, count }) => (
          <Link
            to={`/search?topic=${encodeURIComponent(topic)}`}
            key={topic}
            className='bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center hover:shadow-xl transition-shadow duration-300 relative group'
          >
            <h2 className='text-2xl font-semibold mb-1 group-hover:text-teal-600 transition-colors'>{topic}</h2>
            <p className='text-xs uppercase tracking-wide text-teal-500 font-medium mb-3'>{count} {count === 1 ? 'Article' : 'Articles'}</p>
            <p className='text-gray-600 dark:text-gray-400'>Browse articles and discussions on {topic}.</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ExploreTopics;
