import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Post } from '@/types/common';
import BlogHeader from '@/components/BlogHeader';
import BlogContent from '@/components/BlogContent';

// Sample blog posts with string IDs
const BLOG_POSTS: Post[] = [
  {
    id: "1",
    title: "The Hidden Beaches of Thailand You Need to Visit",
    excerpt: "Discover untouched paradises away from the tourist crowds where crystal clear waters meet pristine white sand.",
    author: {
      name: "Sarah Johnson",
      avatar: "https://i.pravatar.cc/150?img=1"
    },
    category: "Beaches",
    coverImage: "https://images.unsplash.com/photo-1519451241324-20b4ea2c4220?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    date: "May 15, 2025",
    readTime: "8 min read",
    likes: 342,
    comments: 56
  },
  {
    id: "2",
    title: "A Foodie's Guide to Authentic Italian Cuisine",
    excerpt: "Beyond pizza and pasta: regional specialties that will transform your understanding of Italian food.",
    author: {
      name: "Marco Rossi",
      avatar: "https://i.pravatar.cc/150?img=3"
    },
    category: "Food & Drink",
    coverImage: "https://images.unsplash.com/photo-1498579150354-977475b7ea0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    date: "April 28, 2025",
    readTime: "12 min read",
    likes: 215,
    comments: 42
  },
  {
    id: "3",
    title: "Exploring Japan's Ancient Temples and Modern Cities",
    excerpt: "A journey through time in the Land of the Rising Sun, where tradition and innovation coexist in harmony.",
    author: {
      name: "Emma Chen",
      avatar: "https://i.pravatar.cc/150?img=5"
    },
    category: "Culture",
    coverImage: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    date: "June 3, 2025",
    readTime: "15 min read",
    likes: 421,
    comments: 83
  },
  {
    id: "4",
    title: "Ultimate Guide to Backpacking Through Southeast Asia",
    excerpt: "Everything you need to know about planning your adventure, from budgeting to must-visit destinations.",
    author: {
      name: "Alex Morgan",
      avatar: "https://i.pravatar.cc/150?img=7"
    },
    category: "Budget",
    coverImage: "https://images.unsplash.com/photo-1512453979780-5ea266f8880c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    date: "May 22, 2025",
    readTime: "20 min read",
    likes: 287,
    comments: 49
  },
  {
    id: "5",
    title: "How to Find Authentic Experiences in Tourist Destinations",
    excerpt: "Tips and strategies for going beyond the guidebook and connecting with local cultures.",
    author: {
      name: "Priya Sharma",
      avatar: "https://i.pravatar.cc/150?img=9"
    },
    category: "Culture",
    coverImage: "https://images.unsplash.com/photo-1533105079780-92b9be482077?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80",
    date: "April 10, 2025",
    readTime: "10 min read",
    likes: 194,
    comments: 31
  },
  {
    id: "6",
    title: "The Rise of Eco-Tourism: Sustainable Travel Practices",
    excerpt: "How travelers can reduce their carbon footprint while exploring the world's natural wonders.",
    author: {
      name: "Daniel Green",
      avatar: "https://i.pravatar.cc/150?img=11"
    },
    category: "Sustainable",
    coverImage: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    date: "June 15, 2025",
    readTime: "12 min read",
    likes: 312,
    comments: 47
  }
];

// Sample categories for filtering
const CATEGORIES = [
  "All",
  "Beaches",
  "Mountains",
  "Urban",
  "Food & Drink",
  "Culture",
  "Budget",
  "Sustainable",
  "Adventure"
];

const Blog = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Filter posts based on category and search query
  const filteredPosts = BLOG_POSTS.filter(post => {
    const matchesCategory = activeCategory === "All" || post.category === activeCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <BlogHeader 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          categories={CATEGORIES}
        />
        
        <BlogContent filteredPosts={filteredPosts} />
      </main>
      
      <Footer />
    </div>
  );
};

export default Blog;
