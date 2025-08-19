import { Button, Spinner } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import CallToAction from '../common/CallToAction';
import CommentSection from '../comments/CommentSection';
import PostCard from './PostCard';
import InitialAvatar from '../../components/UI/InitialAvatar';

export default function PostPage() {
  const { postSlug } = useParams();
  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState(null);
  const [author, setAuthor] = useState(null);
  const [recentPosts, setRecentPosts] = useState(null);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/post/getposts?search=${postSlug}`);
        const data = await res.json();
        if (res.ok) {
          const match = (data.posts || []).find(p => p.slug === postSlug || p.id === postSlug);
          setPost(match);
          if (match && match.author) {
            // Assuming author object is nested; if not, adjust accordingly
            setAuthor(match.author);
          }
        }
      } catch (error) {
        console.error('Failed to fetch post:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [postSlug]);

  useEffect(() => {
    const fetchRecentPosts = async () => {
      try {
        const res = await fetch(`/api/post/getposts?limit=3`);
        if (res.ok) {
          const data = await res.json();
          setRecentPosts(data.posts);
        }
      } catch (error) {
        console.error('Failed to fetch recent posts:', error);
      }
    };
    fetchRecentPosts();
  }, []);

  if (loading || !post) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <Spinner size='xl' />
      </div>
    );
  }

  return (
    <main className='bg-white dark:bg-gray-900'>
      <Helmet>
        <title>{post.title} | TechGist</title>
        <meta name='description' content={(post.content || '').replace(/<[^>]*>/g, '').slice(0, 160)} />
        <meta property='og:title' content={post.title} />
        <meta property='og:description' content={(post.content || '').replace(/<[^>]*>/g, '').slice(0, 160)} />
        {post.image && <meta property='og:image' content={post.image} />}
      </Helmet>

      <article className='max-w-4xl mx-auto p-4 sm:p-6 lg:p-8'>
        {/* Post Header */}
        <header className='mb-8 text-center'>
          <Link to={`/search?topic=${post.topic}`} className='inline-block mb-4'>
            <Button color='gray' pill size='xs'>{post.topic}</Button>
          </Link>
          <h1 className='text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight'>
            {post.title}
          </h1>
          <p className='mt-4 text-lg text-gray-500 dark:text-gray-400'>
            A deep dive into the world of modern technology.
          </p>
        </header>

        {/* Author Info */}
        {author && (
          <div className='flex items-center justify-center my-6'>
            <InitialAvatar name={author.username} src={author.profilePicture} size={40} />
            <div className='ml-4 text-left'>
              <p className='text-sm font-medium text-gray-900 dark:text-white'>{author.username}</p>
              <p className='text-xs text-gray-500 dark:text-gray-400'>
                <span>{new Date(post.createdAt).toLocaleDateString()}</span> &middot; 
                <span> {Math.ceil(post.content.length / 1000)} min read</span>
              </p>
            </div>
          </div>
        )}

        {/* Post Image */}
        <img
          src={post.image}
          alt={post.title}
          loading='lazy'
          className='w-full h-auto max-h-[500px] object-cover rounded-lg shadow-lg mb-8'
        />

        {/* Post Content */}
        <div
          className='prose prose-lg dark:prose-invert max-w-full mx-auto'
          dangerouslySetInnerHTML={{ __html: post.content }}
        ></div>

        {/* CTA and Comments */}
        <div className='mt-12'>
          {!currentUser && <CallToAction />}
          <CommentSection postId={post.id} />
        </div>
      </article>

      {/* Recent Articles */}
      <aside className='py-12 bg-gray-50 dark:bg-gray-800'>
        <div className='max-w-6xl mx-auto px-4'>
          <h2 className='text-2xl font-bold text-center mb-8'>Recent Articles</h2>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
            {recentPosts && recentPosts.map((p) => <PostCard key={p.id} post={p} />)}
          </div>
        </div>
      </aside>
    </main>
  );
}
