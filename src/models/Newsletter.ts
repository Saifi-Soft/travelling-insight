
import { connectToDatabase, formatMongoData } from '../api/mongodb';

export interface NewsletterSubscriber {
  id?: string;
  email: string;
  firstName?: string;
  lastName?: string;
  subscribedAt: Date | string;
  tags?: string[];
  active: boolean;
}

/**
 * Save a new newsletter subscriber to MongoDB
 */
export async function saveSubscriber(subscriber: Omit<NewsletterSubscriber, 'id' | 'subscribedAt' | 'active'>): Promise<NewsletterSubscriber> {
  try {
    const { collections } = await connectToDatabase();
    
    // Check if subscriber already exists
    const existingSubscriber = await collections.newsletter.findOne({ email: subscriber.email });
    
    if (existingSubscriber) {
      // If subscriber exists but is inactive, reactivate them
      if (!existingSubscriber.active) {
        await collections.newsletter.updateOne(
          { email: subscriber.email },
          { 
            $set: { 
              active: true,
              ...subscriber,
              subscribedAt: existingSubscriber.subscribedAt 
            } 
          }
        );
      }
      
      return formatMongoData(existingSubscriber);
    }
    
    // Create new subscriber
    const newSubscriber: NewsletterSubscriber = {
      ...subscriber,
      subscribedAt: new Date().toISOString(),
      active: true
    };
    
    const result = await collections.newsletter.insertOne(newSubscriber);
    return { 
      ...newSubscriber, 
      id: result.insertedId.toString() 
    };
  } catch (error) {
    console.error("Error saving newsletter subscriber:", error);
    throw error;
  }
}

/**
 * Get all subscribers from MongoDB
 */
export async function getAllSubscribers(): Promise<NewsletterSubscriber[]> {
  try {
    const { collections } = await connectToDatabase();
    const subscribers = await collections.newsletter.find().toArray();
    return formatMongoData(subscribers);
  } catch (error) {
    console.error("Error getting newsletter subscribers:", error);
    throw error;
  }
}

/**
 * Unsubscribe a subscriber by email
 */
export async function unsubscribeByEmail(email: string): Promise<boolean> {
  try {
    const { collections } = await connectToDatabase();
    const result = await collections.newsletter.updateOne(
      { email },
      { $set: { active: false } }
    );
    return result.matchedCount > 0;
  } catch (error) {
    console.error("Error unsubscribing newsletter subscriber:", error);
    throw error;
  }
}

/**
 * Delete a subscriber by email
 */
export async function deleteSubscriber(email: string): Promise<boolean> {
  try {
    const { collections } = await connectToDatabase();
    const result = await collections.newsletter.deleteOne({ email });
    return result.deletedCount > 0;
  } catch (error) {
    console.error("Error deleting newsletter subscriber:", error);
    throw error;
  }
}
