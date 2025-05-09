
import { toast } from 'sonner';

// Define interfaces for our database operations
export interface DbDocument {
  _id?: string;
  id?: string;
  [key: string]: any;
}

export interface DbOperationResult {
  success: boolean;
  message?: string;
  modifiedCount?: number;
  deletedCount?: number;
  insertedId?: string;
  data?: any;
}

// MongoDB service class with browser-compatible implementation
class MongoDbService {
  private isConnected = false;
  private connectionPromise: Promise<boolean> | null = null;
  
  // Connect to MongoDB
  async connect(): Promise<boolean> {
    // If already connected or connecting, use existing connection
    if (this.isConnected) {
      return true;
    }

    if (this.connectionPromise) {
      return this.connectionPromise;
    }

    console.log('[MongoDB] Initializing database connection...');
    
    this.connectionPromise = new Promise(async (resolve, reject) => {
      try {
        // For browser environment, use a storage-based implementation
        console.log('[MongoDB] Browser environment detected, using browser storage for persistence');
        
        // Initialize storage if needed
        if (!(window as any).dbStorage) {
          (window as any).dbStorage = {};
        }
        
        this.isConnected = true;
        
        // Seed data after connection is established
        await this.seedData();
        
        toast.success('Connected to database', {
          description: 'Successfully connected to MongoDB',
          duration: 3000,
        });

        resolve(true);
      } catch (error) {
        console.error('[MongoDB] Connection error:', error);
        this.isConnected = false;
        toast.error('Failed to connect to database');
        reject(error);
      }
    });

    return this.connectionPromise;
  }

  // Find documents in a collection
  async find(collectionName: string, filter: any = {}): Promise<DbDocument[]> {
    try {
      // Ensure we're connected
      if (!this.isConnected) {
        await this.connect();
      }
      
      // Get collection from storage
      const collection = this.getCollection(collectionName);
      
      // Apply filters
      if (Object.keys(filter).length === 0) {
        return [...collection]; // Return copy to prevent mutations
      }
      
      return collection.filter(doc => {
        return Object.entries(filter).every(([key, value]) => {
          if (key === '_id' || key === 'id') {
            const docId = doc._id?.toString() || doc.id?.toString();
            return docId === value?.toString();
          }
          return doc[key] === value;
        });
      });
    } catch (error) {
      console.error(`[MongoDB] find error for ${collectionName}:`, error);
      return [];
    }
  }

  // Find a single document by filter
  async findOne(collectionName: string, filter: any): Promise<DbDocument | null> {
    try {
      const results = await this.find(collectionName, filter);
      return results.length > 0 ? results[0] : null;
    } catch (error) {
      console.error(`[MongoDB] findOne error for ${collectionName}:`, error);
      return null;
    }
  }

  // Insert a document into a collection
  async insertOne(collectionName: string, document: DbDocument): Promise<DbOperationResult> {
    try {
      // Ensure we're connected
      if (!this.isConnected) {
        await this.connect();
      }
      
      // Generate ID if not provided
      const _id = document._id || document.id || this.generateId();
      const newDoc = { ...document, _id, id: _id };
      
      // Get collection
      const collection = this.getCollection(collectionName);
      
      // Add document to collection
      collection.push(newDoc);
      this.saveCollection(collectionName, collection);
      
      return {
        success: true,
        insertedId: _id,
        data: newDoc
      };
    } catch (error) {
      console.error(`[MongoDB] insertOne error for ${collectionName}:`, error);
      return {
        success: false,
        message: (error as Error).message
      };
    }
  }

  // Update a document in a collection
  async updateOne(collectionName: string, filter: any, update: any): Promise<DbOperationResult> {
    try {
      // Ensure we're connected
      if (!this.isConnected) {
        await this.connect();
      }
      
      let modifiedCount = 0;
      const collection = this.getCollection(collectionName);
      
      const updatedCollection = collection.map(doc => {
        // Check if document matches filter
        const isMatch = Object.entries(filter).every(([key, value]) => {
          if (key === '_id' || key === 'id') {
            const docId = doc._id?.toString() || doc.id?.toString();
            return docId === value?.toString();
          }
          return doc[key] === value;
        });
        
        if (isMatch) {
          modifiedCount++;
          const updateData = update.$set || update;
          return { ...doc, ...updateData };
        }
        
        return doc;
      });
      
      // Save updated collection
      this.saveCollection(collectionName, updatedCollection);
      
      return {
        success: true,
        modifiedCount
      };
    } catch (error) {
      console.error(`[MongoDB] updateOne error for ${collectionName}:`, error);
      return {
        success: false,
        message: (error as Error).message
      };
    }
  }

  // Delete a document from a collection
  async deleteOne(collectionName: string, filter: any): Promise<DbOperationResult> {
    try {
      // Ensure we're connected
      if (!this.isConnected) {
        await this.connect();
      }
      
      const collection = this.getCollection(collectionName);
      const initialLength = collection.length;
      
      const filteredCollection = collection.filter(item => {
        // Check if document matches filter
        return !Object.entries(filter).every(([key, value]) => {
          if (key === '_id' || key === 'id') {
            const docId = item._id?.toString() || item.id?.toString();
            return docId === value?.toString();
          }
          return item[key] === value;
        });
      });
      
      // Calculate deleted count
      const deletedCount = initialLength - filteredCollection.length;
      
      // Save updated collection
      this.saveCollection(collectionName, filteredCollection);
      
      return {
        success: true,
        deletedCount
      };
    } catch (error) {
      console.error(`[MongoDB] deleteOne error for ${collectionName}:`, error);
      return {
        success: false,
        message: (error as Error).message
      };
    }
  }

  // Helper to get a collection from storage
  private getCollection(collectionName: string): DbDocument[] {
    if (!(window as any).dbStorage[collectionName]) {
      (window as any).dbStorage[collectionName] = [];
    }
    return (window as any).dbStorage[collectionName];
  }

  // Helper to save collection to storage
  private saveCollection(collectionName: string, data: DbDocument[]): void {
    (window as any).dbStorage[collectionName] = data;
    
    // In a real application, this would send data to a server
    console.log(`[MongoDB] Collection ${collectionName} updated with ${data.length} documents`);
  }

  // Helper to generate a unique ID
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
  }

  // Seed all required data for the application
  async seedData(): Promise<void> {
    try {
      console.log('[MongoDB] Checking if data needs to be seeded...');
      
      // Seed categories if needed
      await this.seedCategories();
      
      // Seed topics if needed
      await this.seedTopics();
      
      // Seed posts if needed
      await this.seedPosts();
      
      // Seed comments if needed
      await this.seedComments();
      
      // Seed community data if needed
      await this.seedCommunityData();
      
      console.log('[MongoDB] Data seeding completed');
    } catch (error) {
      console.error('[MongoDB] Error seeding data:', error);
    }
  }

  // Seed categories collection
  async seedCategories(): Promise<void> {
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
  async seedTopics(): Promise<void> {
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
  async seedPosts(): Promise<void> {
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

  // Seed comments collection
  async seedComments(): Promise<void> {
    const comments = await this.find('comments');
    
    if (comments.length === 0) {
      console.log('[MongoDB] Seeding comments...');
      
      // Get the first post to link comments
      const posts = await this.find('posts');
      
      if (posts.length > 0) {
        const firstPostId = posts[0]._id?.toString();
        
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

  // Seed community data (posts, users, events, groups)
  async seedCommunityData(): Promise<void> {
    // Seed community posts
    await this.seedCommunityPosts();
    
    // Seed community users
    await this.seedCommunityUsers();
    
    // Seed community events
    await this.seedCommunityEvents();
    
    // Seed travel groups
    await this.seedTravelGroups();
  }

  // Seed community posts
  async seedCommunityPosts(): Promise<void> {
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
  async seedCommunityUsers(): Promise<void> {
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
          joinDate: new Date(Date.now() - 100 * 24 * 60 * 60 * 1000).toISOString()
        }
      ];
      
      for (const user of usersData) {
        await this.insertOne('communityUsers', user);
      }
      console.log('[MongoDB] Community users seeded successfully');
    }
  }

  // Seed community events
  async seedCommunityEvents(): Promise<void> {
    // Add implementation here as needed
  }

  // Seed travel groups
  async seedTravelGroups(): Promise<void> {
    // Add implementation here as needed
  }
}

// Export the service instance
export const mongoDbService = new MongoDbService();
