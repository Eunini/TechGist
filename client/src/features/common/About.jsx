export default function About() {
  return (
    <div className='min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white py-12 sm:py-20'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='text-center'>
          <h1 className='text-4xl md:text-5xl font-extrabold tracking-tight'>
            Our Mission
          </h1>
          <p className='mt-4 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-400'>
            To build a global community that empowers the next generation of tech leaders, creators, and innovators.
          </p>
        </div>

        <div className='mt-20'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-16 items-center'>
            <div className='space-y-6 text-lg text-gray-700 dark:text-gray-300'>
              <h2 className='text-3xl font-bold'>Who We Are</h2>
              <p>
                TechGist is more than just a blog; it's a dynamic, community-driven platform for anyone passionate about technology. We were founded on the principle that knowledge should be shared and that the best way to learn is by doing and collaborating.
              </p>
              <p>
                Our community is made up of students, self-taught developers, seasoned professionals, and everyone in between. We believe that a diverse and inclusive environment is the key to fostering innovation and growth.
              </p>
            </div>
            <div>
              <img
                src='https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1632&q=80'
                alt='Our Community'
                className='rounded-lg shadow-2xl'
              />
            </div>
          </div>
        </div>

        <div className='mt-20'>
          <h2 className='text-3xl font-bold text-center mb-12'>What We Value</h2>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-10 text-center'>
            <div className='p-6 border border-gray-200 dark:border-gray-700 rounded-lg'>
              <h3 className='text-xl font-semibold mb-2'>Collaboration</h3>
              <p className='text-gray-600 dark:text-gray-400'>
                We believe in the power of collective intelligence. We encourage our members to work together, share their knowledge, and help each other succeed.
              </p>
            </div>
            <div className='p-6 border border-gray-200 dark:border-gray-700 rounded-lg'>
              <h3 className='text-xl font-semibold mb-2'>Innovation</h3>
              <p className='text-gray-600 dark:text-gray-400'>
                Technology is always evolving, and so are we. We are committed to exploring new ideas, embracing change, and pushing the boundaries of what's possible.
              </p>
            </div>
            <div className='p-6 border border-gray-200 dark:border-gray-700 rounded-lg'>
              <h3 className='text-xl font-semibold mb-2'>Inclusivity</h3>
              <p className='text-gray-600 dark:text-gray-400'>
                We are dedicated to creating a welcoming and supportive environment for everyone, regardless of their background or experience level.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}