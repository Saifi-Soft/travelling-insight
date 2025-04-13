import { Post, Category, Topic } from '@/types/common';

// Sample data for the blog
export const MOCK_POSTS: Post[] = [
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
    comments: 56,
    topics: ["Thailand", "Beaches", "Travel Tips"]
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
    comments: 42,
    topics: ["Food", "Italy", "Cuisine"]
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
    comments: 83,
    topics: ["Japan", "Culture", "Architecture"]
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
    comments: 49,
    topics: ["Backpacking", "Budget Travel", "Southeast Asia"]
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
    comments: 31,
    topics: ["Travel Tips", "Cultural Immersion", "Local Experiences"]
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
    comments: 47,
    topics: ["Eco-Tourism", "Sustainable Travel", "Environment"]
  }
];

export const MOCK_CATEGORIES: Category[] = [
  { id: "1", name: "Beaches", slug: "beaches", icon: "🏖️", count: 12, image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1173&q=80" },
  { id: "2", name: "Mountains", slug: "mountains", icon: "🏔️", count: 8, image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80" },
  { id: "3", name: "Urban", slug: "urban", icon: "🏙️", count: 15, image: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1244&q=80" },
  { id: "4", name: "Food & Drink", slug: "food-drink", icon: "🍽️", count: 20, image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80" },
  { id: "5", name: "Culture", slug: "culture", icon: "🏛️", count: 13, image: "https://images.unsplash.com/photo-1551009175-15bdf9dcb580?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80" },
  { id: "6", name: "Budget", slug: "budget", icon: "💰", count: 7, image: "https://images.unsplash.com/photo-1589310243389-96a5483213a8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80" },
  { id: "7", name: "Sustainable", slug: "sustainable", icon: "♻️", count: 9, image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80" },
  { id: "8", name: "Adventure", slug: "adventure", icon: "🧗", count: 18, image: "https://images.unsplash.com/photo-1502680390469-be75c86b636f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80" }
];

export const MOCK_TOPICS: Topic[] = [
  { id: "1", name: "Backpacking", slug: "backpacking", count: 24 },
  { id: "2", name: "Road Trips", slug: "road-trips", count: 19 },
  { id: "3", name: "Solo Travel", slug: "solo-travel", count: 15 },
  { id: "4", name: "Family Vacation", slug: "family-vacation", count: 12 },
  { id: "5", name: "Photography", slug: "photography", count: 28 },
  { id: "6", name: "Digital Nomad", slug: "digital-nomad", count: 13 },
  { id: "7", name: "Luxury Travel", slug: "luxury-travel", count: 9 },
  { id: "8", name: "Budget Travel", slug: "budget-travel", count: 17 },
  { id: "9", name: "Thailand", slug: "thailand", count: 11 },
  { id: "10", name: "Italy", slug: "italy", count: 14 },
  { id: "11", name: "Japan", slug: "japan", count: 16 },
  { id: "12", name: "Southeast Asia", slug: "southeast-asia", count: 22 }
];
