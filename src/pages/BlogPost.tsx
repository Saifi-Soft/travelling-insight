import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useToast } from '@/hooks/use-toast';
import PostCard from '@/components/PostCard';
import { Post } from '@/types/common';
import PostHeader from '@/components/blog/PostHeader';
import PostAuthor from '@/components/blog/PostAuthor';
import PostActions from '@/components/blog/PostActions';
import PostComments from '@/components/blog/PostComments';
import PostSidebar from '@/components/blog/PostSidebar';
import { Badge } from '@/components/ui/badge';

// Sample blog post with string ID
const POST: Post & { 
  content: string;
  tags: string[];
} = {
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
  content: `
    <p class="text-lg mb-6">Thailand has long been celebrated for its stunning coastlines, but beyond the famous beaches of Phuket and Koh Samui lie hidden gems waiting to be discovered by the intrepid traveler.</p>
    
    <h2 class="text-2xl font-bold mt-8 mb-4">Koh Kradan: The Untouched Paradise</h2>
    
    <p class="mb-4">Located in the Trang Province, Koh Kradan offers one of the most pristine beach experiences in Thailand. With limited development and a focus on preserving its natural beauty, this island paradise features powder-soft white sand and crystal clear turquoise waters that are perfect for snorkeling.</p>
    
    <div class="my-8 rounded-lg overflow-hidden">
      <img src="https://images.unsplash.com/photo-1552463966-d4baed774936?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80" alt="Koh Kradan Beach" class="w-full h-auto" />
      <p class="text-sm text-muted-foreground italic mt-2 text-center">The pristine shores of Koh Kradan</p>
    </div>
    
    <p class="mb-4">What makes Koh Kradan special is its relative isolation. With only a handful of resorts and no roads, the island maintains a peaceful atmosphere that's increasingly rare in Thailand's popular tourist destinations.</p>
    
    <h2 class="text-2xl font-bold mt-8 mb-4">Railay Beach: Hidden in Plain Sight</h2>
    
    <p class="mb-4">While not exactly unknown, Railay Beach remains cut off from the mainland by imposing limestone cliffs, making it accessible only by boat. This geographical isolation has preserved its tranquility despite its growing popularity among rock climbers and beach enthusiasts.</p>
    
    <p class="mb-4">The beach is divided into several sections, with East Railay serving as the arrival point and West Railay offering the pristine white sand beaches that have made this area famous. Between them, you'll find walking paths that wind through lush jungle and past small caves.</p>
    
    <div class="bg-muted p-6 rounded-lg my-8">
      <h3 class="font-bold mb-2">Travel Tip:</h3>
      <p>Visit during the shoulder seasons (May-June or September-October) to enjoy these beaches with fewer crowds while still experiencing good weather conditions.</p>
    </div>
    
    <h2 class="text-2xl font-bold mt-8 mb-4">Koh Kood: Thailand's Last Unspoiled Island</h2>
    
    <p class="mb-4">Located near the Cambodian border, Koh Kood (also spelled Koh Kut) remains one of Thailand's least developed large islands. Despite its size as the country's fourth-largest island, it has maintained its pristine condition with lush jungles, waterfalls, and beaches that rival the Maldives.</p>
    
    <p class="mb-4">Klong Chao Beach is perhaps the most stunning stretch of sand on the island, with its clear waters and palm-fringed coastline. But venture further to beaches like Ao Phrao or Ao Jak for even more seclusion and natural beauty.</p>
    
    <div class="my-8 rounded-lg overflow-hidden">
      <img src="https://images.unsplash.com/photo-1537956965359-7573183d1f57?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1168&q=80" alt="Koh Kood Beach" class="w-full h-auto" />
      <p class="text-sm text-muted-foreground italic mt-2 text-center">The crystal clear waters of Koh Kood</p>
    </div>
    
    <h2 class="text-2xl font-bold mt-8 mb-4">How to Reach These Hidden Paradises</h2>
    
    <p class="mb-4">While getting to these secluded beaches requires more effort than the well-trodden paths to Phuket or Koh Samui, the reward is well worth it.</p>
    
    <ul class="list-disc pl-6 mb-6 space-y-2">
      <li><strong>Koh Kradan:</strong> Take a flight to Trang, then a minivan to the pier, followed by a boat to the island.</li>
      <li><strong>Railay Beach:</strong> Fly to Krabi, then take a songthaew (shared taxi) to Ao Nang, and finally a longtail boat to Railay.</li>
      <li><strong>Koh Kood:</strong> Fly to Trat, then take a speedboat or ferry from Laem Sok pier.</li>
    </ul>
    
    <p class="mb-4">The extra effort to reach these hidden beaches means fewer crowds and a more authentic experience of Thailand's natural beauty.</p>
    
    <h2 class="text-2xl font-bold mt-8 mb-4">Preserving These Natural Treasures</h2>
    
    <p class="mb-4">As these hidden beaches gain more attention, it's crucial for visitors to practice responsible tourism. This includes avoiding single-use plastics, respecting marine life while snorkeling, and supporting eco-friendly accommodations that prioritize sustainability.</p>
    
    <p class="mb-6">By treading lightly, we can ensure these beach paradises remain unspoiled for generations to come, allowing future travelers to experience the same awe and wonder that these hidden Thai beaches inspire today.</p>
  `,
  tags: ["Thailand", "Beaches", "Island Life", "Off The Beaten Path", "Eco Tourism"]
};

// Sample related posts with string IDs
const RELATED_POSTS: Post[] = [
  {
    id: "2",
    title: "A Foodie's Guide to Authentic Thai Street Food",
    excerpt: "Navigate the vibrant street food scene of Thailand with these expert tips and must-try dishes.",
    author: {
      name: "Lisa Wong",
      avatar: "https://i.pravatar.cc/150?img=5"
    },
    category: "Food & Drink",
    coverImage: "https://images.unsplash.com/photo-1569562211093-4ed0d0758f12?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    date: "May 10, 2025",
    readTime: "10 min read",
    likes: 245,
    comments: 37
  },
  {
    id: "3",
    title: "Island Hopping in the Andaman Sea: A Complete Guide",
    excerpt: "Plan the perfect itinerary to explore Thailand's stunning islands and hidden coves in the Andaman Sea.",
    author: {
      name: "James Wilson",
      avatar: "https://i.pravatar.cc/150?img=11"
    },
    category: "Adventure",
    coverImage: "https://images.unsplash.com/photo-1551801691-f0bce83f5c16?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1171&q=80",
    date: "June 2, 2025",
    readTime: "15 min read",
    likes: 312,
    comments: 51
  },
  {
    id: "4",
    title: "The Best Time to Visit Thailand: Season by Season",
    excerpt: "Maximize your Thai adventure by understanding the nuances of Thailand's climate throughout the year.",
    author: {
      name: "Maya Patel",
      avatar: "https://i.pravatar.cc/150?img=9"
    },
    category: "Travel Tips",
    coverImage: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1139&q=80",
    date: "April 20, 2025",
    readTime: "12 min read",
    likes: 187,
    comments: 29
  }
];

// Sample comments
const SAMPLE_COMMENTS = [
  {
    id: 1,
    author: {
      name: "Alex Morgan",
      avatar: "https://i.pravatar.cc/150?img=11"
    },
    content: "This article is incredible! I visited Koh Kood last year and it was exactly as you described - a true paradise. Can't wait to check out Koh Kradan next time.",
    date: "May 16, 2025",
    likes: 12
  },
  {
    id: 2,
    author: {
      name: "Priya Sharma",
      avatar: "https://i.pravatar.cc/150?img=23"
    },
    content: "Thank you for highlighting the importance of sustainable tourism. These beaches are treasures that we need to protect. I would also recommend bringing reef-safe sunscreen when visiting!",
    date: "May 17, 2025",
    likes: 8
  }
];

const POPULAR_TAGS = [
  "Thailand", "Beach", "Island Life", "Travel Tips", 
  "Adventure", "Budget Travel", "Asia", "Snorkeling", 
  "Hidden Gems", "Sustainable Travel", "Backpacking"
];

const BlogPost = () => {
  const { id } = useParams();
  const [comments, setComments] = useState(SAMPLE_COMMENTS);
  const [post] = useState(POST);
  const { toast } = useToast();
  
  const handleShare = (platform: string) => {
    toast({
      title: `Shared on ${platform}`,
      description: "The post link has been copied for sharing",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Cover Image with Title */}
        <PostHeader post={post} commentCount={comments.length} />
        
        {/* Content */}
        <div className="container-custom py-12">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Main Content */}
            <div className="lg:w-2/3">
              {/* Author */}
              <PostAuthor author={post.author} />
              
              {/* Post Content */}
              <article className="prose prose-lg max-w-none">
                <div dangerouslySetInnerHTML={{ __html: post.content }} />
              </article>
              
              {/* Tags */}
              <div className="mt-12">
                <h3 className="text-sm font-medium text-muted-foreground mb-3">
                  TAGGED IN
                </h3>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <Link key={tag} to={`/tags/${tag.toLowerCase().replace(/\s+/g, '-')}`}>
                      <Badge variant="outline" className="text-sm py-1 px-3">
                        {tag}
                      </Badge>
                    </Link>
                  ))}
                </div>
              </div>
              
              {/* Action Bar */}
              <PostActions 
                initialLikes={post.likes} 
                commentCount={comments.length}
                onShareClick={handleShare}
              />
              
              {/* Comments Section */}
              <PostComments comments={comments} setComments={setComments} />
            </div>
            
            {/* Sidebar */}
            <PostSidebar 
              author={post.author}
              relatedPosts={RELATED_POSTS}
              popularTags={POPULAR_TAGS}
            />
          </div>
        </div>
        
        {/* More Articles */}
        <div className="bg-muted/30 py-16">
          <div className="container-custom">
            <h2 className="text-2xl font-bold mb-8">More Articles You Might Like</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {RELATED_POSTS.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default BlogPost;