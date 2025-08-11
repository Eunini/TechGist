import { Link } from 'react-router-dom';

export default function PostCard({ post }) {
  return (
    <div className='group relative w-full border border-gray-200 dark:border-gray-700 hover:shadow-lg h-[400px] overflow-hidden rounded-lg sm:w-[430px] transition-all'>
      <Link to={`/post/${post.slug}`}>
        <img
          src={post.image}
          alt='post cover'
          loading='lazy'
          className='h-[260px] w-full object-cover group-hover:scale-105 transition-transform duration-300'
        />
      </Link>
      <div className='p-4 flex flex-col gap-2'>
        <p className='text-xl font-bold line-clamp-2'>{post.title}</p>
        <span className='text-sm text-gray-500'>{post.topic}</span>
        <Link
          to={`/post/${post.slug}`}
          className='absolute bottom-4 right-4 border border-teal-500 text-teal-500 hover:bg-teal-500 hover:text-white transition-all duration-300 text-center py-2 px-4 rounded-md'
        >
          Read article
        </Link>
      </div>
    </div>
  );
}
