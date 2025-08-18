export default function SkeletonPostCard() {
  return (
    <div className='relative w-full max-w-sm h-[400px] rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden animate-pulse bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 mx-auto'>
      <div className='h-[260px] w-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 animate-shimmer bg-[length:400%_100%]' />
      <div className='p-4 space-y-3'>
        <div className='h-5 w-3/4 rounded bg-gray-300 dark:bg-gray-600'></div>
        <div className='h-4 w-1/2 rounded bg-gray-300 dark:bg-gray-600'></div>
        <div className='absolute bottom-4 right-4 h-9 w-28 rounded-md bg-gray-300 dark:bg-gray-600'></div>
      </div>
    </div>
  );
}
