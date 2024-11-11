export default function About() {
  return (
    <div className='min-h-screen flex-col sm:flex items-center justify-center'>
      <div className='max-w-2xl mx-auto p-3 text-center'>
        <div>
          <h1 className='text-3xl font font-semibold text-center my-7'>
            About TechGist
          </h1>
          <div className='text-md text-gray-500 flex flex-col gap-6 z-10'>
            <p className="z-10">
              Welcome to TechGist! This blog was created by Inioluwa Atanda.
              as a personal project. She is passionate and enthusiastic about
              technology, coding, and everything in between.
            </p>

            <p className="z-10">
              In this blog, you wll find weekly articles and tutorials on topics
              such as web development, software engineering, and programming
              languages. Inioluwa is always learning and exploring new
              technologies, so be sure to check back often for new content!
            </p>

            <p className="z-10">
              We encourage you to leave comments on our posts and engage with
              other readers. You can like other peoples comments and reply to
              them as well. We believe that a community of learners can help
              each other grow and improve.
            </p>
          </div>
        </div>
      </div>

      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        <img src="/img/about-img.png" alt="about-image description"/>
      </div>
    </div>
  );
}
