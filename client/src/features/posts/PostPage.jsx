import { Button, Spinner } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import CallToAction from '../common/CallToAction';
import CommentSection from '../comments/CommentSection';
import { Helmet } from 'react-helmet-async';
import PostCard from './PostCard';

export default function PostPage() {
  const { postSlug } = useParams();
  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState(null);
  const [recentPosts, setRecentPosts] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        // Fetch posts by slug via search param
        const res = await fetch(`/api/post/getposts?search=${postSlug}`);
        const data = await res.json();
        if (!res.ok) {
          setLoading(false);
          return;
        }
        if (res.ok) {
          const match = (data.posts || []).find(p => p.slug === postSlug || p.id === postSlug);
          setPost(match);
          setLoading(false);
        }
      } catch (error) {
        setLoading(false);
      }
    };
    fetchPost();
  }, [postSlug]);

  useEffect(() => {
    try {
      const fetchRecentPosts = async () => {
        const res = await fetch(`/api/post/getposts?limit=3`);
        const data = await res.json();
        if (res.ok) {
          setRecentPosts(data.posts);
        }
      };
      fetchRecentPosts();
    } catch (error) {
      console.log(error.message);
    }
  }, []);

  if (loading)
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <Spinner size='xl' />
      </div>
    );
  return (
    <main className='p-3 flex flex-col max-w-6xl mx-auto min-h-screen'>
        <Helmet>
          <title>{post.title} | TechGist</title>
          <meta name='description' content={(post.content || '').replace(/<[^>]*>/g, '').slice(0,160)} />
          <meta property='og:title' content={post.title} />
          <meta property='og:description' content={(post.content || '').replace(/<[^>]*>/g, '').slice(0,160)} />
          {post.image && <meta property='og:image' content={post.image} />}
        </Helmet>
      <h1 className='text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl'>
        {post && post.title}
      </h1>
      <Link
        to={`/search?topic=${post && post.topic}`}
        className='self-center mt-5'
      >
        <Button color='gray' pill size='xs'>
          {post && post.topic}
        </Button>
      </Link>
      <img
        src={post && post.image}
        alt={post && post.title}
        loading='lazy'
        className='mt-10 p-3 max-h-[600px] w-full object-cover'
      />
      <div className='flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-xs'>
        <span>{post && new Date(post.createdAt).toLocaleDateString()}</span>
        <span className='italic'>
          {post && (post.content.length / 1000).toFixed(0)} mins read
        </span>
      </div>
      <div
        className='p-3 max-w-2xl mx-auto w-full post-content'
        dangerouslySetInnerHTML={{ __html: post && post.content }}
      ></div>
      <div className='max-w-4xl mx-auto w-full'>
        <CallToAction />
      </div>
      <CommentSection postId={post && post.id} />

      <div className='flex flex-col justify-center items-center mb-5'>
        <h1 className='text-xl mt-5'>Recent articles</h1>
        <div className='flex flex-wrap gap-5 mt-5 justify-center'>
          {recentPosts &&
            recentPosts.map((post) => <PostCard key={post.id} post={post} />)}
        </div>
      </div>
    </main>
  );
}
