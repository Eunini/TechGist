import { Link } from 'react-router-dom';

export default function PostCard({ post }) {
  return (
    <div className='group relative w-full max-w-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg h-[400px] overflow-hidden rounded-lg transition-all duration-300 mx-auto'>
      <Link to={`/post/${post.slug}`}>
        <img
          src={post.image}
          alt='post cover'
          loading='lazy'
          className='h-[260px] w-full object-cover group-hover:scale-105 transition-transform duration-300'
        />
      </Link>
      <div className='p-4 flex flex-col gap-2 h-[140px]'>
        <p className='text-xl font-bold line-clamp-2 mb-2'>{post.title}</p>
        <span className='text-sm text-gray-500 mb-4'>{post.topic}</span>
        <Link
          to={`/post/${post.slug}`}
          className='absolute bottom-4 right-4 border border-emerald-500 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all duration-300 text-center py-2 px-4 rounded-md text-sm font-medium'
        >
          Read article
        </Link>
      </div>
    </div>
  );
}
