// src/pages/Home.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import CallToAction from '../components/CallToAction';
import PostCard from '../components/PostCard';
import AnimatedBackground from '../components/AnimatedBackground';
import SparklingDotsCanvas from '../components/SparklingDotsCanvas';

export default function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch('/api/post/getPosts');
      const data = await res.json();
      setPosts(data.posts);
    };
    fetchPosts();
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col items-center overflow-hidden">
      <SparklingDotsCanvas />

      <div className="relative flex flex-col sm:flex-row w-full max-w-6xl mx-auto z-10">
        <div className="relative flex-1 p-6 lg:p-28 z-20">
          <h1 className="text-3xl font-bold lg:text-6xl">Welcome to 𝕋𝕖𝕔𝕙𝔾𝕚𝕤𝕥</h1>
          <p className="text-xs sm:text-xl mt-4">
            Here you will find a variety of articles and tutorials on topics such as
            web development, software engineering, and programming languages.
          </p>
          <p className="text-xs sm:text-xl mt-2">
            Join our community of tech enthusiasts and stay updated with the latest innovations in the tech world. From insightful articles to practical coding challenges, TechGist is your go-to resource for all things tech. Let’s embark on this journey of learning and growth together!
          </p>
          <Link
            to="/search"
            className="text-xs sm:text-base text-green-500 font-bold hover:underline mt-4 inline-block"
          >
            View all posts
          </Link>
        </div>

        <div className="relative flex-1 mt-6 z-1">
          <AnimatedBackground />
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="w-full py-8 px-4 relative z-30 border-t-2 border-gray-700">
        <div className="max-w-6xl mx-auto ">
          <CallToAction />
        </div>
      </div>

      {/* Recent Posts Section */}
      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 py-7 relative z-30">
        {posts && posts.length > 0 && (
          <div className="flex flex-col gap-6">
            <h2 className="text-2xl font-semibold text-center">Recent Posts</h2>
            <div className="flex flex-wrap gap-4 justify-center">
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
            <Link
              to="/search"
              className="text-lg text-green-500 hover:underline text-center mt-4"
            >
              View all posts
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}