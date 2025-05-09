
import { toast } from 'sonner';
import { mongoApiService } from '@/api/mongoApiService';

interface User {
  id: string;
  name?: string;
  email: string;
  role?: string;
}

export interface SessionData {
  user?: User;
  isAuthenticated: boolean;
}

class AuthService {
  /**
   * Validates a user session from localStorage
   */
  async validateSession(): Promise<SessionData> {
    try {
      const userId = localStorage.getItem('userId');
      const userEmail = localStorage.getItem('userEmail');
      
      if (!userId || !userEmail) {
        return { isAuthenticated: false };
      }
      
      // Check if user exists in the database
      const user = await mongoApiService.queryDocuments('users', { email: userEmail });
      
      if (user && user.length > 0) {
        return {
          user: {
            id: user[0].id || user[0]._id,
            name: localStorage.getItem('userName') || user[0].name,
            email: userEmail,
            role: localStorage.getItem('userRole') || user[0].role
          },
          isAuthenticated: true
        };
      }
      
      // Clear invalid session data
      this.clearSession();
      return { isAuthenticated: false };
    } catch (error) {
      console.error('Error validating session:', error);
      return { isAuthenticated: false };
    }
  }

  /**
   * Authenticates a user with email and password
   */
  async login(email: string, password: string): Promise<{ success: boolean; user?: User }> {
    try {
      // Check if user exists
      const users = await mongoApiService.queryDocuments('users', { email });
      
      if (users.length === 0) {
        // Create a new demo user if not found
        const newUserId = await this.createDemoUser(email, password);
        return {
          success: true,
          user: {
            id: newUserId,
            name: 'Demo User',
            email,
            role: 'user'
          }
        };
      }
      
      const user = users[0];
      
      // In a real app, this would be a proper password hash comparison
      if (user.password === password) {
        // Store user data in localStorage
        this.setSessionData(user.id || user._id, user.name || 'User', email, user.role || 'user');
        
        return {
          success: true,
          user: {
            id: user.id || user._id,
            name: user.name || 'User',
            email,
            role: user.role || 'user'
          }
        };
      }
      
      return { success: false };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false };
    }
  }

  /**
   * Creates a demo user for testing purposes
   */
  private async createDemoUser(email: string, password: string): Promise<string> {
    try {
      const newUser = await mongoApiService.insertDocument('users', {
        name: 'Demo User',
        email,
        password, // In production, this should be hashed
        role: 'user',
        isSubscribed: true, // Make demo user subscribed by default
        createdAt: new Date(),
      });
      
      const userId = newUser.id || newUser._id;
      
      // Set session data
      this.setSessionData(userId, 'Demo User', email, 'user');
      
      // Create a demo subscription
      await mongoApiService.insertDocument('subscriptions', {
        userId,
        planType: 'monthly',
        status: 'active',
        paymentMethod: {
          method: 'credit_card',
          cardLastFour: '4242',
          expiryDate: '12/25'
        },
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        amount: 9.99,
        autoRenew: true,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      return userId;
    } catch (error) {
      console.error('Error creating demo user:', error);
      throw error;
    }
  }

  /**
   * Sets session data in localStorage
   */
  private setSessionData(userId: string, name: string, email: string, role: string) {
    localStorage.setItem('userId', userId);
    localStorage.setItem('userName', name);
    localStorage.setItem('userEmail', email);
    localStorage.setItem('userRole', role);
    localStorage.setItem('community_user_id', userId);
  }

  /**
   * Clears all session data from localStorage
   */
  clearSession() {
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    localStorage.removeItem('community_user_id');
  }

  /**
   * Logs out the current user
   */
  logout() {
    this.clearSession();
  }
}

export const authService = new AuthService();
