
import { useState, useEffect } from 'react';
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

// Sample blog posts with string IDs
const BLOG_POSTS = {
  "1": {
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
  },
  "2": {
    id: "2",
    title: "A Foodie's Guide to Italian Cuisine",
    excerpt: "Beyond pizza and pasta: regional specialties that will transform your understanding of Italian food.",
    author: {
      name: "Lisa Wong",
      avatar: "https://i.pravatar.cc/150?img=5"
    },
    category: "Food & Drink",
    coverImage: "https://images.unsplash.com/photo-1569562211093-4ed0d0758f12?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    date: "May 10, 2025",
    readTime: "10 min read",
    likes: 245,
    comments: 37,
    content: `
      <p class="text-lg mb-6">Italian cuisine is far more diverse and nuanced than many international diners realize. Each region of Italy boasts its own culinary traditions, ingredients, and specialties that tell the story of local history, geography, and culture.</p>
      
      <h2 class="text-2xl font-bold mt-8 mb-4">Beyond Pizza and Pasta</h2>
      
      <p class="mb-4">While pizza from Naples and pasta from all regions certainly deserve their stellar reputations, authentic Italian cuisine encompasses a vastly richer tapestry of dishes and cooking techniques.</p>
      
      <div class="my-8 rounded-lg overflow-hidden">
        <img src="https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80" alt="Italian regional specialties" class="w-full h-auto" />
        <p class="text-sm text-muted-foreground italic mt-2 text-center">A spread of regional Italian antipasti</p>
      </div>
      
      <h2 class="text-2xl font-bold mt-8 mb-4">Regional Treasures</h2>
      
      <p class="mb-4">In Sicily, the Arab influence is evident in dishes like pasta con le sarde (pasta with sardines and fennel) and the liberal use of raisins, pine nuts, and saffron. Meanwhile, in Tuscany, simplicity reigns with dishes like ribollita (bread soup) and bistecca alla fiorentina (Florentine steak).</p>
      
      <p class="mb-4">Northern regions like Lombardy and Piedmont showcase rich butter-based dishes, risottos, and polenta, while coastal regions emphasize fresh seafood preparations that often require minimal cooking to highlight the quality of the catch.</p>
      
      <div class="bg-muted p-6 rounded-lg my-8">
        <h3 class="font-bold mb-2">Culinary Tip:</h3>
        <p>When seeking authentic Italian food, look for restaurants that focus on regional specialties rather than offering a generic "Italian" menu. The more specific the regional focus, the more likely you are to experience genuine traditional flavors.</p>
      </div>
      
      <h2 class="text-2xl font-bold mt-8 mb-4">The Rule of Quality Ingredients</h2>
      
      <p class="mb-4">Italian cuisine's brilliance often stems from its emphasis on exceptional ingredients rather than complex techniques. A perfectly ripe tomato, estate-bottled olive oil, freshly foraged mushrooms, or traditionally crafted cheese can elevate even the simplest dish to extraordinary heights.</p>
      
      <p class="mb-4">This principle explains why many classic Italian recipes feature just a handful of ingredients - when each component is excellent in its own right, elaborate preparations become unnecessary.</p>
      
      <div class="my-8 rounded-lg overflow-hidden">
        <img src="https://images.unsplash.com/photo-1551183053-bf91a1d81141?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1032&q=80" alt="Italian fresh ingredients" class="w-full h-auto" />
        <p class="text-sm text-muted-foreground italic mt-2 text-center">Fresh, high-quality ingredients are fundamental to Italian cooking</p>
      </div>
      
      <h2 class="text-2xl font-bold mt-8 mb-4">Hidden Gems Worth Seeking</h2>
      
      <p class="mb-4">Beyond the familiar classics, intrepid food lovers should seek out these lesser-known Italian specialties:</p>
      
      <ul class="list-disc pl-6 mb-6 space-y-2">
        <li><strong>Culurgiones</strong> - Sardinian stuffed pasta resembling wheat ears, filled with potato, pecorino, and mint</li>
        <li><strong>Castelmagno cheese</strong> - A PDO-protected crumbly cheese from Piedmont with complex flavors</li>
        <li><strong>Porchetta</strong> - Herb-stuffed roast pork popular in central Italy</li>
        <li><strong>Seadas</strong> - Sardinian fried pastries filled with cheese and drizzled with honey</li>
        <li><strong>Bagna càuda</strong> - A warm dipping sauce from Piedmont made with anchovies, garlic, and olive oil</li>
      </ul>
      
      <p class="mb-6">By exploring beyond the usual tourist-friendly offerings, you'll discover the true depth and diversity of what might be the world's most beloved cuisine.</p>
    `,
    tags: ["Italy", "Food", "Culinary Travel", "Regional Cuisine", "Gastronomy"]
  },
  "3": {
    id: "3",
    title: "Exploring Japan's Ancient Temples",
    excerpt: "A journey through time in the Land of the Rising Sun.",
    author: {
      name: "James Wilson",
      avatar: "https://i.pravatar.cc/150?img=11"
    },
    category: "Culture",
    coverImage: "https://images.unsplash.com/photo-1551801691-f0bce83f5c16?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1171&q=80",
    date: "June 2, 2025",
    readTime: "15 min read",
    likes: 312,
    comments: 51,
    content: `
      <p class="text-lg mb-6">Japan's ancient temples stand as enduring monuments to the country's rich spiritual traditions, architectural ingenuity, and aesthetic sensibilities. From mountain monasteries shrouded in mist to serene urban sanctuaries, these sacred spaces offer visitors profound insights into Japanese culture.</p>
      
      <h2 class="text-2xl font-bold mt-8 mb-4">Kiyomizu-dera: The Temple of Pure Water</h2>
      
      <p class="mb-4">Perched on the eastern hills of Kyoto, Kiyomizu-dera offers breathtaking views over the ancient capital. Founded in 778, its massive wooden terrace juts out from the hillside, supported by hundreds of pillars. Remarkably, not a single nail was used in the entire structure.</p>
      
      <div class="my-8 rounded-lg overflow-hidden">
        <img src="https://images.unsplash.com/photo-1610568781018-fdfc0c683472?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80" alt="Kiyomizu-dera Temple" class="w-full h-auto" />
        <p class="text-sm text-muted-foreground italic mt-2 text-center">Kiyomizu-dera with its famous wooden terrace</p>
      </div>
      
      <p class="mb-4">The temple takes its name from the Otowa Waterfall, where three channels of water fall into a pond. Visitors use long-handled cups to drink from the streams, each believed to bestow a different blessing: longevity, success in education, or fortune in love.</p>
      
      <h2 class="text-2xl font-bold mt-8 mb-4">Todai-ji: House of the Great Buddha</h2>
      
      <p class="mb-4">In Nara, the ancient capital that preceded Kyoto, stands Todai-ji temple, home to the world's largest bronze Buddha statue. At 15 meters tall, the Daibutsu sits in serene contemplation within the Daibutsuden (Great Buddha Hall), itself the largest wooden building in the world.</p>
      
      <p class="mb-4">Completed in 752, the temple complex served as the head of all provincial Buddhist temples in Japan. The present structure, though rebuilt in 1709, is still only two-thirds the size of the original.</p>
      
      <div class="bg-muted p-6 rounded-lg my-8">
        <h3 class="font-bold mb-2">Visitor's Tip:</h3>
        <p>Don't miss the wooden pillar in Todai-ji with a hole carved through its base. According to tradition, those who can squeeze through this opening will attain enlightenment in their next life.</p>
      </div>
      
      <h2 class="text-2xl font-bold mt-8 mb-4">Koyasan: Mountain of Zen</h2>
      
      <p class="mb-4">Mount Koya, known as Koyasan, is the spiritual heart of Shingon Buddhism. This sacred mountain hosts over 100 temples, many offering overnight stays (shukubo) where visitors can participate in morning prayers and meditative practices.</p>
      
      <p class="mb-4">The centerpiece is Okunoin, Japan's largest cemetery, where over 200,000 tombstones line the path to the mausoleum of Kobo Daishi, the founder of Shingon Buddhism. Walking among ancient cedar trees, with moss-covered stones and eternal lamps, creates an atmosphere of profound serenity.</p>
      
      <div class="my-8 rounded-lg overflow-hidden">
        <img src="https://images.unsplash.com/photo-1606822350112-b9e3caea2461?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80" alt="Koyasan temple" class="w-full h-auto" />
        <p class="text-sm text-muted-foreground italic mt-2 text-center">The mystical atmosphere of Koyasan</p>
      </div>
      
      <h2 class="text-2xl font-bold mt-8 mb-4">Etiquette When Visiting Japanese Temples</h2>
      
      <p class="mb-4">Visiting these sacred sites requires awareness of proper etiquette:</p>
      
      <ul class="list-disc pl-6 mb-6 space-y-2">
        <li>Remove shoes when entering buildings, placing them neatly at the entrance</li>
        <li>Speak in hushed tones and avoid loud conversations</li>
        <li>Ask permission before taking photographs, especially of monks or rituals</li>
        <li>Follow directional signs when walking around sacred objects (usually clockwise)</li>
        <li>Dress modestly, covering shoulders and knees</li>
      </ul>
      
      <p class="mb-6">Japan's ancient temples offer more than just architectural splendor—they provide windows into living traditions that have endured for centuries. By approaching these sacred spaces with respect and mindfulness, visitors can experience the profound sense of peace and timelessness that makes them such enduring treasures.</p>
    `,
    tags: ["Japan", "Temples", "Buddhism", "Cultural Heritage", "Spiritual Travel"]
  },
  "4": {
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
    comments: 29,
    content: `
      <p class="text-lg mb-6">Thailand's climate varies significantly throughout the year and across different regions. Understanding these seasonal patterns is crucial for planning the perfect Thai vacation that aligns with your preferences and activities.</p>
      
      <h2 class="text-2xl font-bold mt-8 mb-4">Cool Season (November to February)</h2>
      
      <p class="mb-4">The cool season is widely considered the best time to visit Thailand, with comfortable temperatures, minimal rainfall, and clear skies. In Bangkok and central Thailand, temperatures typically range from 18°C to 32°C (64°F to 90°F), while northern regions like Chiang Mai can be quite cool in the evenings, occasionally dropping to 15°C (59°F).</p>
      
      <div class="my-8 rounded-lg overflow-hidden">
        <img src="https://images.unsplash.com/photo-1528181304800-259b08848526?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80" alt="Thailand cool season" class="w-full h-auto" />
        <p class="text-sm text-muted-foreground italic mt-2 text-center">Clear skies and optimal conditions during Thailand's cool season</p>
      </div>
      
      <p class="mb-4">This season offers ideal conditions for temple hopping in Bangkok, trekking in the northern mountains, and exploring the bustling night markets without breaking a sweat. The Andaman Sea (Phuket, Krabi, Phi Phi) is at its best with calm waters perfect for swimming and snorkeling.</p>
      
      <h2 class="text-2xl font-bold mt-8 mb-4">Hot Season (March to June)</h2>
      
      <p class="mb-4">As the name suggests, temperatures soar during this period, regularly exceeding 35°C (95°F) in much of the country, with high humidity adding to the discomfort. April is typically the hottest month, coinciding with Songkran (Thai New Year) when nationwide water fights provide welcome relief from the heat.</p>
      
      <p class="mb-4">While intense, this period offers some advantages: lower accommodation prices, fewer tourists, and perfectly ripe tropical fruits like mangosteen, rambutan, and the notorious durian.</p>
      
      <div class="bg-muted p-6 rounded-lg my-8">
        <h3 class="font-bold mb-2">Traveler's Tip:</h3>
        <p>If visiting during the hot season, plan outdoor activities for early morning or late afternoon, and ensure your accommodation has reliable air conditioning. Consider spending time in the mountainous north or coastal areas where sea breezes provide some relief.</p>
      </div>
      
      <h2 class="text-2xl font-bold mt-8 mb-4">Rainy Season (July to October)</h2>
      
      <p class="mb-4">The southwest monsoon brings heavy rainfall to most of Thailand during these months. Contrary to popular belief, it doesn't rain continuously - typically, there are intense downpours lasting an hour or two, often in the afternoon, followed by sunshine.</p>
      
      <p class="mb-4">This season transforms Thailand's landscapes to lush, vibrant green, with waterfalls reaching their most spectacular flow. Rice fields become emerald expanses as farmers take advantage of the abundant water for planting.</p>
      
      <div class="my-8 rounded-lg overflow-hidden">
        <img src="https://images.unsplash.com/photo-1504681869696-d977211a5f4c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1036&q=80" alt="Thailand rainy season" class="w-full h-auto" />
        <p class="text-sm text-muted-foreground italic mt-2 text-center">Lush landscapes during the rainy season</p>
      </div>
      
      <h2 class="text-2xl font-bold mt-8 mb-4">Regional Variations</h2>
      
      <p class="mb-4">Thailand's weather patterns aren't uniform across the country:</p>
      
      <ul class="list-disc pl-6 mb-6 space-y-2">
        <li><strong>Gulf Coast (Koh Samui, Koh Phangan, Koh Tao)</strong>: These islands have their rainy season from October to December, making them good alternatives during the southwestern monsoon.</li>
        <li><strong>Northern Thailand</strong>: The cool season is pronounced here, with chilly mornings sometimes requiring a light jacket.</li>
        <li><strong>Andaman Coast</strong>: Some smaller islands close entirely during the monsoon season (May to October) when rough seas make boat transportation dangerous.</li>
        <li><strong>Bangkok and Central Thailand</strong>: Prone to occasional flooding during peak rainy season, particularly in September and October.</li>
      </ul>
      
      <p class="mb-6">By aligning your travel plans with Thailand's seasonal rhythms, you can maximize enjoyment while minimizing discomfort. Whether you prefer the perfect weather of the cool season, the vibrant festivities of the hot season, or the lush landscapes and lower prices of the rainy season, Thailand offers year-round appeal with the right preparation.</p>
    `,
    tags: ["Thailand", "Travel Planning", "Monsoon Season", "Weather", "Travel Tips"]
  }
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
  const [post, setPost] = useState<any>(null);
  const { toast } = useToast();
  
  // Fetch the post data based on the ID parameter
  useEffect(() => {
    console.log("Blog post ID from URL:", id);
    
    if (id && BLOG_POSTS[id as keyof typeof BLOG_POSTS]) {
      setPost(BLOG_POSTS[id as keyof typeof BLOG_POSTS]);
    } else {
      // Default to first post if ID not found
      console.log("Post not found, using default");
      setPost(BLOG_POSTS["1"]);
    }
  }, [id]);
  
  const handleShare = (platform: string) => {
    toast({
      title: `Shared on ${platform}`,
      description: "The post link has been copied for sharing",
    });
  };

  // Show loading state while post is being fetched
  if (!post) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <p>Loading post...</p>
        </div>
      </div>
    );
  }

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
                  {post.tags.map((tag: string) => (
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
