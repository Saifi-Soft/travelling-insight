
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BlogPost from './BlogPost';

const Post = () => {
  const { slug } = useParams<{ slug: string }>();
  
  useEffect(() => {
    // Log the post slug for debugging
    console.log('Viewing post with slug:', slug);
    
    // Scroll to top when post loads
    window.scrollTo(0, 0);
  }, [slug]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <BlogPost />
      </main>
      
      <Footer />
    </div>
  );
};

export default Post;
