import { toast } from 'sonner';

// MongoDB connection class with mock implementation for browser
class MongoDbService {
  private isConnected = false;
  private connectionPromise: Promise<any> | null = null;

  // Connect to MongoDB or initialize mock DB
  async connect() {
    // If already connected or in process of connecting, return existing promise
    if (this.isConnected) {
      return true;
    }

    if (this.connectionPromise) {
      return this.connectionPromise;
    }

    // Get MongoDB URI from environment variables
    const uri = import.meta.env.VITE_MONGODB_URI || 'mongodb+srv://saifibadshah10:2Fjs34snjd56p9@travellinginsight.3fl6dwk.mongodb.net/';

    try {
      console.log('[MongoDB] Initializing service...');
      
      this.connectionPromise = new Promise(async (resolve, reject) => {
        try {
          // For browser environment, use a mock implementation
          console.log('[MongoDB] Browser environment detected, using mock implementation');
          
          // Initialize mock DB if needed
          if (!(window as any).mockDb) {
            (window as any).mockDb = {};
          }
          
          this.isConnected = true;
          
          // Seed data after connection
          await this.seedData();
          
          toast.success('Connected to database', {
            description: 'Using mock database in browser environment',
            duration: 3000,
          });

          resolve(true);
        } catch (error) {
          console.error('[MongoDB] Error connecting:', error);
          this.isConnected = false;
          toast.error('Failed to connect to database. Some features may not work correctly.');
          reject(error);
        }
      });

      return this.connectionPromise;
    } catch (error) {
      console.error('[MongoDB] Connection error:', error);
      this.isConnected = false;
      throw error;
    }
  }

  // Seed all required data
  async seedData() {
    try {
      console.log('[MongoDB] Checking if data needs to be seeded...');
      
      // Seed categories if needed
      await this.seedCategories();
      
      // Seed topics if needed
      await this.seedTopics();
      
      // Seed posts if needed
      await this.seedPosts();
      
      // Seed community posts if needed
      await this.seedCommunityPosts();
      
      // Seed community users if needed
      await this.seedCommunityUsers();
      
      // Seed community events if needed
      await this.seedCommunityEvents();
      
      // Seed travel groups if needed
      await this.seedTravelGroups();
      
      // Seed comments if needed
      await this.seedComments();
      
      console.log('[MongoDB] Data seeding completed');
    } catch (error) {
      console.error('[MongoDB] Error seeding data:', error);
    }
  }

  // Seed categories collection
  async seedCategories() {
    const categories = await this.find('categories');
    
    if (categories.length === 0) {
      console.log('[MongoDB] Seeding categories...');
      
      const categoryData = [
        { 
          name: 'Adventure', 
          slug: 'adventure', 
          icon: '🧗', 
          count: 12, 
          image: 'https://images.unsplash.com/photo-1527004013197-933c4bb611b3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1080&q=80' 
        },
        { 
          name: 'City Life', 
          slug: 'city-life', 
          icon: '🏙️', 
          count: 8, 
          image: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1080&q=80' 
        },
        { 
          name: 'Beach', 
          slug: 'beach', 
          icon: '🏖️', 
          count: 15, 
          image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1080&q=80' 
        },
        { 
          name: 'Food', 
          slug: 'food', 
          icon: '🍕', 
          count: 10, 
          image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1080&q=80' 
        },
        { 
          name: 'Culture', 
          slug: 'culture', 
          icon: '🏛️', 
          count: 7, 
          image: 'https://images.unsplash.com/photo-1566552881560-0be862a7c445?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1080&q=80' 
        }
      ];
      
      for (const category of categoryData) {
        await this.insertOne('categories', category);
      }
      console.log('[MongoDB] Categories seeded successfully');
    }
  }

  // Seed topics collection
  async seedTopics() {
    const topics = await this.find('topics');
    
    if (topics.length === 0) {
      console.log('[MongoDB] Seeding topics...');
      
      const topicData = [
        { name: 'Backpacking', slug: 'backpacking', count: 5 },
        { name: 'Food Tourism', slug: 'food-tourism', count: 7 },
        { name: 'Budget Travel', slug: 'budget-travel', count: 9 },
        { name: 'Luxury Travel', slug: 'luxury-travel', count: 4 },
        { name: 'Solo Travel', slug: 'solo-travel', count: 12 },
        { name: 'Family Vacation', slug: 'family-vacation', count: 8 },
        { name: 'Road Trip', slug: 'road-trip', count: 6 },
        { name: 'Hiking', slug: 'hiking', count: 11 },
        { name: 'Photography', slug: 'photography', count: 15 }
      ];
      
      for (const topic of topicData) {
        await this.insertOne('topics', topic);
      }
      console.log('[MongoDB] Topics seeded successfully');
    }
  }

  // Seed posts collection
  async seedPosts() {
    const posts = await this.find('posts');
    
    if (posts.length === 0) {
      console.log('[MongoDB] Seeding posts...');
      
      const postData = [
        {
          title: 'Exploring the Hidden Gems of Bali',
          slug: 'exploring-hidden-gems-bali',
          excerpt: 'Discover the lesser-known attractions of this Indonesian paradise beyond the tourist hotspots.',
          author: {
            name: 'Sarah Johnson',
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80',
            bio: 'Travel blogger and photographer with a passion for Southeast Asia.',
            social: {
              twitter: '@sarahj_travels',
              instagram: '@sarahjohnsontravels'
            }
          },
          category: 'Adventure',
          coverImage: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1080&q=80',
          date: new Date().toISOString(),
          readTime: '8 min read',
          likes: 124,
          comments: 18,
          content: 'Bali, often referred to as the Island of the Gods, has captivated travelers for decades with its stunning landscapes, rich cultural heritage, and spiritual ambiance. While popular destinations like Kuta, Seminyak, and Ubud attract hordes of tourists year-round, the island harbors numerous hidden treasures waiting to be discovered by the more adventurous traveler.\n\nNorth of the island, far from the bustling tourist centers, lies the peaceful coastal town of Amed. Known for its black sand beaches and exceptional snorkeling and diving opportunities, Amed offers a glimpse into traditional Balinese fishing village life. The Japanese shipwreck just offshore provides a fascinating diving site teeming with marine life.\n\nIn the central highlands, the village of Sidemen remains one of Bali\'s best-kept secrets. Nestled among terraced rice fields with views of Mount Agung, Sidemen offers a serene escape and a chance to experience rural Balinese life. Here, you can observe traditional weaving techniques, participate in cooking classes using local ingredients, or simply wander through the lush landscapes.\n\nFor those seeking spiritual experiences off the beaten path, the temple of Lempuyang, known as the "Gateway to Heaven," offers a less crowded alternative to popular temples. The journey requires climbing 1,700 steps, but the reward—a stunning view through the split gate framing Mount Agung—is well worth the effort.\n\nOn the western coast, the protected marine area of Menjangan Island offers some of the best coral reefs in Bali. Part of West Bali National Park, this uninhabited island is accessible only by boat and provides pristine diving conditions away from the crowds.\n\nAs we venture beyond the familiar, we discover that Bali\'s true essence lies not just in its famous beaches and temples, but in its hidden corners where tradition, nature, and spirituality converge to create experiences that remain etched in memory long after the journey ends.',
          topics: ['Backpacking', 'Solo Travel', 'Photography']
        },
        {
          title: 'A Culinary Journey Through Italy\'s Lesser-Known Regions',
          slug: 'culinary-journey-italy',
          excerpt: 'Explore the authentic flavors of Italy\'s overlooked culinary regions, where tradition and innovation create unforgettable dining experiences.',
          author: {
            name: 'Marco Rossi',
            avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80',
            bio: 'Italian chef and food writer exploring cultural connections through cuisine.',
            social: {
              twitter: '@marco_tastes',
              instagram: '@marco_culinary_journeys'
            }
          },
          category: 'Food',
          coverImage: 'https://images.unsplash.com/photo-1498579150354-977475b7ea0b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1080&q=80',
          date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          readTime: '10 min read',
          likes: 87,
          comments: 23,
          content: 'Italy\'s gastronomic reputation extends far beyond pizza and pasta. While regions like Tuscany and Sicily often steal the spotlight, the country\'s lesser-known regions offer culinary treasures that deserve equal recognition on the world stage.\n\nTucked away in Italy\'s northeast, Friuli-Venezia Giulia blends Italian, Austrian, and Slavic influences to create a uniquely diverse food culture. The region\'s prosciutto di San Daniele rivals the more famous Parma ham, offering a slightly sweeter flavor due to the local microclimate. Paired with indigenous white wines like Friulano or Ribolla Gialla, it creates an unforgettable tasting experience.\n\nMoving south to Abruzzo, we find a rugged region where mountain traditions meet coastal cuisine. The signature dish, arrosticini—thin skewers of mutton grilled over open flames—reflects the region\'s pastoral heritage. On the coast, brodetto, a rich fish stew varying from town to town, showcases the Adriatic\'s bounty. Montepulciano d\'Abruzzo wines, robust and earthy, perfectly complement these bold flavors.\n\nIn the southern region of Basilicata, poverty historically drove culinary innovation. The renowned peperone crusco—sweet peppers dried and then quickly fried to create a crisp, smoky garnish—adds distinctive flavor to many dishes. The region\'s bread-making tradition, particularly in the town of Matera, produces exceptional loaves using ancient grain varieties and traditional wood-fired ovens.\n\nThe island of Sardinia offers perhaps Italy\'s most distinct regional cuisine. Influenced by its isolation and history, Sardinian food features unique items like pane carasau (a crisp flatbread), bottarga (mullet roe), and su porcheddu (spit-roasted suckling pig). The island\'s shepherding tradition gives rise to exceptional cheeses, including the infamous casu marzu.\n\nThese culinary landscapes remain authentic precisely because they have escaped mass tourism. In these regions, cooking isn\'t a performance but a daily practice connecting people to their land and history. For travelers willing to venture beyond familiar Italian destinations, these gastronomic experiences offer not just memorable meals but windows into cultural identities preserved through generations.',
          topics: ['Food Tourism', 'Culture', 'Photography']
        },
        {
          title: 'Urban Exploration: Discovering Street Art in Mexico City',
          slug: 'street-art-mexico-city',
          excerpt: 'A visual journey through the vibrant murals and graffiti that tell the story of Mexico\'s largest metropolis.',
          author: {
            name: 'Elena Vega',
            avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80',
            bio: 'Visual artist and urban culture researcher based in CDMX.',
            social: {
              twitter: '@elena_urban_art',
              instagram: '@elena.vega.art'
            }
          },
          category: 'City Life',
          coverImage: 'https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1080&q=80',
          date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
          readTime: '7 min read',
          likes: 156,
          comments: 32,
          content: 'Mexico City\'s walls speak volumes about its history, politics, and creative spirit. From the revolutionary murals of Diego Rivera to contemporary street art collectives, the city serves as a vast canvas where artistic expression and social commentary converge.\n\nThe tradition of public art in Mexico has deep historical roots, beginning with the muralist movement of the 1920s. Following the Mexican Revolution, artists like Rivera, Siqueiros, and Orozco created monumental works that celebrated Mexican identity and addressed social injustice. Today, this legacy continues through a vibrant street art scene that transforms the urban landscape.\n\nIn the Roma and Condesa neighborhoods, trendy districts known for their art galleries and cafes, walls adorned with whimsical characters and abstract designs create an open-air gallery experience. Local artists like Lesuperdemon and Smithe have developed distinctive styles that have gained international recognition, their works appearing alongside pieces by visiting artists from around the world.\n\nMore politically charged works can be found in neighborhoods like Tepito and sections of the Centro Histórico, where artists address issues of corruption, violence, and economic inequality. Collective projects often emerge in response to specific events, such as the 2014 disappearance of 43 students from Ayotzinapa, which prompted numerous murals demanding justice and remembrance.\n\nThe government\'s stance toward street art remains complex and inconsistent. While some murals receive official support and protection, others exist in a legal gray area or are created clandestinely. Organizations like Street Art Chilango work to document these ephemeral works and offer tours that provide context about the artists and their messages.\n\nFor visitors seeking to explore Mexico City\'s street art, guided tours offer valuable insights, but independent wandering often yields the most rewarding discoveries. The ever-changing nature of the scene means that new works continuously appear while others fade or are painted over—a visual reflection of the dynamic, evolving city itself.',
          topics: ['Photography', 'Culture', 'Budget Travel']
        }
      ];
      
      for (const post of postData) {
        await this.insertOne('posts', post);
      }
      console.log('[MongoDB] Posts seeded successfully');
    }
  }

  // Seed community posts
  async seedCommunityPosts() {
    const communityPosts = await this.find('communityPosts');
    
    if (communityPosts.length === 0) {
      console.log('[MongoDB] Seeding community posts...');
      
      const postsData = [
        {
          userId: 'user123',
          userName: 'Alex Johnson',
          userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80',
          content: 'Just arrived in Bali! The beaches here are amazing and the local cuisine is incredible. Anyone have recommendations for hidden gems to explore?',
          images: [
            'https://images.unsplash.com/photo-1537996194471-e657df975ab4?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1080&q=80',
            'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1080&q=80'
          ],
          location: 'Bali, Indonesia',
          tags: ['beach', 'food', 'travel'],
          createdAt: new Date().toISOString(),
          likes: 42,
          comments: 8,
          likedBy: ['user456', 'user789']
        },
        {
          userId: 'user456',
          userName: 'Jamie Smith',
          userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80',
          content: 'Hiking in the Swiss Alps was the highlight of my European adventure! The views were absolutely breathtaking, and the mountain air was so refreshing. Would highly recommend to anyone visiting Switzerland.',
          images: [
            'https://images.unsplash.com/photo-1527004013197-933c4bb611b3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1080&q=80',
            'https://images.unsplash.com/photo-1531123414780-f74242c2b052?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1080&q=80'
          ],
          location: 'Swiss Alps, Switzerland',
          tags: ['hiking', 'mountains', 'nature'],
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          likes: 87,
          comments: 12,
          likedBy: ['user123', 'user789', 'user101']
        },
        {
          userId: 'user789',
          userName: 'Taylor Jordan',
          userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80',
          content: 'Spent the weekend exploring the street markets in Bangkok. The food was incredible, especially the mango sticky rice! The city has such vibrant energy.',
          images: [
            'https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1080&q=80'
          ],
          location: 'Bangkok, Thailand',
          tags: ['food', 'market', 'citylife'],
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          likes: 65,
          comments: 9,
          likedBy: ['user456', 'user101']
        }
      ];
      
      for (const post of postsData) {
        await this.insertOne('communityPosts', post);
      }
      console.log('[MongoDB] Community posts seeded successfully');
    }
  }

  // Seed community users
  async seedCommunityUsers() {
    const communityUsers = await this.find('communityUsers');
    
    if (communityUsers.length === 0) {
      console.log('[MongoDB] Seeding community users...');
      
      const usersData = [
        {
          username: 'alexjohnson',
          email: 'alex@example.com',
          name: 'Alex Johnson',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80',
          bio: 'Travel enthusiast always looking for the next adventure.',
          joinDate: new Date(Date.now() - 100 * 24 * 60 * 60 * 1000).toISOString(),
          lastActive: new Date().toISOString(),
          status: 'active',
          experienceLevel: 'Experienced',
          travelStyles: ['Adventure', 'Budget', 'Solo'],
          visitedCountries: [
            { name: 'Thailand', year: 2022 },
            { name: 'Japan', year: 2021 },
            { name: 'Italy', year: 2019 }
          ],
          wishlistDestinations: ['Peru', 'New Zealand', 'Morocco'],
          interests: ['Hiking', 'Photography', 'Local Cuisine'],
          badges: [
            {
              name: 'Globetrotter',
              description: 'Visited more than 10 countries',
              dateEarned: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
              icon: '🌏'
            }
          ],
          reputation: 120,
          socialProfiles: {
            instagram: '@alex.travels',
            twitter: '@alexj_travels'
          },
          notificationPreferences: {
            contentWarnings: true,
            messages: true,
            connections: true
          },
          location: 'San Francisco, CA',
          connections: ['user456', 'user789'],
          trips: [
            {
              destination: 'Bali',
              startDate: '2023-05-15',
              endDate: '2023-05-30',
              status: 'completed'
            }
          ]
        },
        {
          username: 'jamiesmith',
          email: 'jamie@example.com',
          name: 'Jamie Smith',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80',
          bio: 'Mountain lover and outdoor enthusiast.',
          joinDate: new Date(Date.now() - 85 * 24 * 60 * 60 * 1000).toISOString(),
          lastActive: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'active',
          experienceLevel: 'Regular',
          travelStyles: ['Adventure', 'Luxury', 'Cultural'],
          visitedCountries: [
            { name: 'Switzerland', year: 2023 },
            { name: 'Canada', year: 2022 },
            { name: 'Norway', year: 2020 }
          ],
          wishlistDestinations: ['Patagonia', 'Iceland', 'New Zealand'],
          interests: ['Hiking', 'Skiing', 'Photography'],
          badges: [
            {
              name: 'Mountain Climber',
              description: 'Visited 5 major mountain ranges',
              dateEarned: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
              icon: '⛰️'
            }
          ],
          reputation: 85,
          socialProfiles: {
            instagram: '@jamie.outdoors'
          },
          notificationPreferences: {
            contentWarnings: true,
            messages: true,
            connections: true
          },
          location: 'Denver, CO',
          connections: ['user123'],
          trips: [
            {
              destination: 'Swiss Alps',
              startDate: '2023-07-10',
              endDate: '2023-07-25',
              status: 'completed'
            }
          ]
        },
        {
          username: 'taylorjordan',
          email: 'taylor@example.com',
          name: 'Taylor Jordan',
          avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80',
          bio: 'Food and culture enthusiast exploring the world one meal at a time.',
          joinDate: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
          lastActive: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'active',
          experienceLevel: 'Globetrotter',
          travelStyles: ['Foodie', 'Cultural', 'City'],
          visitedCountries: [
            { name: 'Thailand', year: 2023 },
            { name: 'Vietnam', year: 2022 },
            { name: 'Japan', year: 2021 },
            { name: 'Italy', year: 2020 },
            { name: 'France', year: 2019 }
          ],
          wishlistDestinations: ['Mexico', 'Spain', 'Lebanon'],
          interests: ['Cooking Classes', 'Food Markets', 'Street Food'],
          badges: [
            {
              name: 'Food Connoisseur',
              description: 'Participated in 10+ food tours',
              dateEarned: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
              icon: '🍽️'
            }
          ],
          reputation: 110,
          socialProfiles: {
            instagram: '@taylor.tasty.travels',
            twitter: '@taylor_foodie'
          },
          notificationPreferences: {
            contentWarnings: true,
            messages: false,
            connections: true
          },
          location: 'Chicago, IL',
          connections: ['user123', 'user456'],
          trips: [
            {
              destination: 'Bangkok',
              startDate: '2023-08-05',
              endDate: '2023-08-15',
              status: 'completed'
            }
          ]
        }
      ];
      
      for (const user of usersData) {
        await this.insertOne('communityUsers', user);
      }
      console.log('[MongoDB] Community users seeded successfully');
    }
  }

  // Seed community events
  async seedCommunityEvents() {
    const events = await this.find('communityEvents');
    
    if (events.length === 0) {
      console.log('[MongoDB] Seeding community events...');
      
      const eventsData = [
        {
          title: 'Annual Backpackers Meetup',
          description: 'Join fellow backpackers for our annual gathering to share stories, tips, and make plans for future adventures.',
          type: 'Meetup',
          host: 'user123',
          date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
          location: {
            type: 'physical',
            details: 'Central Park, New York City'
          },
          image: 'https://images.unsplash.com/photo-1527004013197-933c4bb611b3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1080&q=80',
          capacity: 50,
          attendees: ['user456', 'user789'],
          status: 'upcoming',
          category: 'Networking',
          tags: ['backpacking', 'adventure', 'networking'],
          createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          title: 'Virtual Travel Photography Workshop',
          description: 'Learn travel photography techniques from professional photographers in this interactive online workshop.',
          type: 'Workshop',
          host: 'user789',
          date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          location: {
            type: 'online',
            details: 'Zoom Meeting (link will be sent upon registration)'
          },
          image: 'https://images.unsplash.com/photo-1554048612-b6a482bc67e5?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1080&q=80',
          capacity: 100,
          attendees: ['user123', 'user456'],
          status: 'upcoming',
          category: 'Educational',
          tags: ['photography', 'workshop', 'virtual'],
          createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          title: 'Southeast Asia Travel Planning Session',
          description: 'Group session for travelers planning trips to Southeast Asia in the coming year. Share itineraries and connect with other travelers.',
          type: 'Planning',
          host: 'user456',
          date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
          location: {
            type: 'online',
            details: 'Google Meet (link will be shared with participants)'
          },
          image: 'https://images.unsplash.com/photo-1528181304800-259b08848526?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1080&q=80',
          capacity: 25,
          attendees: ['user123'],
          status: 'upcoming',
          category: 'Planning',
          tags: ['southeast asia', 'planning', 'group travel'],
          createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
        }
      ];
      
      for (const event of eventsData) {
        await this.insertOne('communityEvents', event);
      }
      console.log('[MongoDB] Community events seeded successfully');
    }
  }

  // Seed travel groups
  async seedTravelGroups() {
    const groups = await this.find('travelGroups');
    
    if (groups.length === 0) {
      console.log('[MongoDB] Seeding travel groups...');
      
      const groupsData = [
        {
          name: 'Southeast Asia Explorers',
          slug: 'southeast-asia-explorers',
          description: 'A group for travelers interested in exploring Southeast Asian countries, sharing tips, and possibly meeting up in the region.',
          category: 'Regional',
          creator: 'user123',
          image: 'https://images.unsplash.com/photo-1528181304800-259b08848526?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1080&q=80',
          members: ['user123', 'user456', 'user789'],
          topics: ['Southeast Asia', 'Backpacking', 'Budget Travel'],
          dateCreated: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'active',
          featuredStatus: true,
          memberCount: 3
        },
        {
          name: 'Solo Female Travelers',
          slug: 'solo-female-travelers',
          description: 'A supportive community for women who travel solo. Share experiences, safety tips, and connect with other solo female travelers worldwide.',
          category: 'Special Interest',
          creator: 'user789',
          image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1080&q=80',
          members: ['user789'],
          topics: ['Solo Travel', 'Women Travelers', 'Safety'],
          dateCreated: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'active',
          featuredStatus: true,
          memberCount: 1
        },
        {
          name: 'Adventure Photographers',
          slug: 'adventure-photographers',
          description: 'For travelers who love capturing their adventures through photography. Share techniques, equipment recommendations, and stunning photos from around the world.',
          category: 'Special Interest',
          creator: 'user456',
          image: 'https://images.unsplash.com/photo-1554048612-b6a482bc67e5?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1080&q=80',
          members: ['user456', 'user123'],
          topics: ['Photography', 'Adventure', 'Landscapes'],
          dateCreated: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'active',
          featuredStatus: false,
          memberCount: 2
        }
      ];
      
      for (const group of groupsData) {
        await this.insertOne('travelGroups', group);
      }
      console.log('[MongoDB] Travel groups seeded successfully');
    }
  }

  // Seed comments
  async seedComments() {
    const comments = await this.find('comments');
    
    if (comments.length === 0) {
      console.log('[MongoDB] Seeding comments...');
      
      // Get the first post to link comments
      const posts = await this.find('posts');
      const communityPosts = await this.find('communityPosts');
      
      if (posts.length > 0 && communityPosts.length > 0) {
        const firstPostId = posts[0]._id?.toString();
        const firstCommunityPostId = communityPosts[0]._id?.toString();
        
        const commentsData = [
          {
            postId: firstPostId,
            author: {
              name: 'Jamie Smith',
              avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80',
              bio: 'Travel enthusiast'
            },
            content: 'This is such a great guide to Bali! I visited last year and definitely agree about Amed being a hidden gem. The snorkeling there was incredible.',
            date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            likes: 8
          },
          {
            postId: firstPostId,
            author: {
              name: 'Taylor Jordan',
              avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80',
              bio: 'Food and culture enthusiast'
            },
            content: 'Thank you for sharing these off-the-beaten-path recommendations! I\'m planning a trip to Bali next month and will definitely check out Sidemen.',
            date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            likes: 5
          },
          // Community post comments
          {
            postId: firstCommunityPostId,
            userId: 'user456',
            userName: 'Jamie Smith',
            userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80',
            content: 'Bali is amazing! Make sure to visit the Tegallalang Rice Terraces and Uluwatu Temple. The sunset views are incredible!',
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            likes: 3
          },
          {
            postId: firstCommunityPostId,
            userId: 'user789',
            userName: 'Taylor Jordan',
            userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80',
            content: 'Have you tried the local seafood? The grilled fish in Jimbaran Bay is absolutely delicious!',
            createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            likes: 2
          }
        ];
        
        for (const comment of commentsData) {
          await this.insertOne('comments', comment);
        }
        console.log('[MongoDB] Comments seeded successfully');
      } else {
        console.log('[MongoDB] Skipping comments seeding - no posts available to link to');
      }
    }
  }

  async disconnect() {
    if (this.client) {
      await this.client.close();
      this.client = null;
      this.db = null;
      this.isConnected = false;
      this.connectionPromise = null;
      console.log('[MongoDB] Disconnected from MongoDB');
    }
  }

  async getCollection(collectionName: string) {
    if (!this.isConnected) {
      await this.connect();
    }

    // Handle both real MongoDB and mock implementation
    if (typeof window === 'undefined' && this.db) {
      return this.db.collection(collectionName);
    } else {
      // Mock collection for browser
      if (!(window as any).mockDb[collectionName]) {
        (window as any).mockDb[collectionName] = [];
      }
      return {
        findOne: async (filter: any) => this.mockFindOne(collectionName, filter),
        find: () => ({ toArray: async () => this.mockFind(collectionName, {}) }),
        insertOne: async (doc: any) => this.mockInsertOne(collectionName, doc),
        updateOne: async (filter: any, update: any) => this.mockUpdateOne(collectionName, filter, update),
        deleteOne: async (filter: any) => this.mockDeleteOne(collectionName, filter),
        countDocuments: async () => (window as any).mockDb[collectionName].length,
      };
    }
  }
  
  // Mock implementations for browser environment
  private async mockFindOne(collectionName: string, filter: any) {
    try {
      const docs = (window as any).mockDb[collectionName] || [];
      return docs.find((doc: any) => {
        return Object.keys(filter).every(key => {
          if (key === '_id') {
            return doc._id?.toString() === filter[key]?.toString();
          }
          return doc[key] === filter[key];
        });
      });
    } catch (error) {
      console.error(`[MockDB] findOne error for ${collectionName}:`, error);
      return null;
    }
  }
  
  private async mockFind(collectionName: string, filter: any = {}) {
    try {
      const docs = (window as any).mockDb[collectionName] || [];
      if (Object.keys(filter).length === 0) {
        return [...docs]; // Return a copy to prevent mutations
      }
      
      return docs.filter((doc: any) => {
        return Object.keys(filter).every(key => {
          if (key === '_id') {
            return doc._id?.toString() === filter[key]?.toString();
          }
          return doc[key] === filter[key];
        });
      });
    } catch (error) {
      console.error(`[MockDB] find error for ${collectionName}:`, error);
      return [];
    }
  }
  
  private async mockInsertOne(collectionName: string, document: any) {
    try {
      const _id = this.generateId();
      const newDoc = { ...document, _id, id: _id };
      (window as any).mockDb[collectionName].push(newDoc);
      
      return newDoc;
    } catch (error) {
      console.error(`[MockDB] insertOne error for ${collectionName}:`, error);
      throw error;
    }
  }
  
  private async mockUpdateOne(collectionName: string, filter: any, update: any) {
    try {
      let modifiedCount = 0;
      (window as any).mockDb[collectionName] = (window as any).mockDb[collectionName].map((doc: any) => {
        const isMatch = Object.keys(filter).every(key => {
          if (key === '_id') {
            return doc._id?.toString() === filter[key]?.toString();
          }
          return doc[key] === filter[key];
        });
        
        if (isMatch) {
          modifiedCount++;
          const updateData = update.$set || update;
          return { ...doc, ...updateData };
        }
        
        return doc;
      });
      
      return { modifiedCount };
    } catch (error) {
      console.error(`[MockDB] updateOne error for ${collectionName}:`, error);
      throw error;
    }
  }
  
  private async mockDeleteOne(collectionName: string, filter: any) {
    try {
      const initialLength = (window as any).mockDb[collectionName].length;
      (window as any).mockDb[collectionName] = (window as any).mockDb[collectionName].filter((doc: any) => {
        return !Object.keys(filter).every(key => {
          if (key === '_id') {
            return doc._id?.toString() === filter[key]?.toString();
          }
          return doc[key] === filter[key];
        });
      });
      
      const deletedCount = initialLength - (window as any).mockDb[collectionName].length;
      return { deletedCount };
    } catch (error) {
      console.error(`[MockDB] deleteOne error for ${collectionName}:`, error);
      throw error;
    }
  }

  // Helper to generate a simple unique ID
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
  }

  // Utility to create an ObjectId-like object
  toObjectId(id: string) {
    return id; // In our mock environment, we'll just use the string ID directly
  }
}

// Create a singleton instance
export const mongoDbService = new MongoDbService();
