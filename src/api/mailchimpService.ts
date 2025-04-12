
import { toast } from "@/components/ui/use-toast";

// Mailchimp API configuration
interface MailchimpConfig {
  apiKey: string;
  serverPrefix: string;
  audienceId: string;
  isConnected: boolean;
}

// Mailchimp subscriber data
export interface MailchimpSubscriber {
  email: string;
  firstName?: string;
  lastName?: string;
  tags?: string[];
}

let mailchimpConfig: MailchimpConfig = {
  apiKey: "",
  serverPrefix: "",
  audienceId: "",
  isConnected: false
};

/**
 * Update Mailchimp configuration
 */
export const updateMailchimpConfig = (config: Partial<MailchimpConfig>) => {
  mailchimpConfig = { ...mailchimpConfig, ...config };
  
  // Store in localStorage for persistence
  localStorage.setItem('mailchimpConfig', JSON.stringify(mailchimpConfig));
  
  return mailchimpConfig;
};

/**
 * Load Mailchimp configuration
 */
export const loadMailchimpConfig = (): MailchimpConfig => {
  const savedConfig = localStorage.getItem('mailchimpConfig');
  
  if (savedConfig) {
    try {
      const parsedConfig = JSON.parse(savedConfig);
      mailchimpConfig = { ...mailchimpConfig, ...parsedConfig };
    } catch (error) {
      console.error("Error parsing Mailchimp config:", error);
    }
  }
  
  return mailchimpConfig;
};

/**
 * Check Mailchimp connection status
 */
export const checkMailchimpConnection = async (): Promise<boolean> => {
  try {
    const { apiKey, serverPrefix, audienceId } = loadMailchimpConfig();
    
    if (!apiKey || !serverPrefix || !audienceId) {
      return false;
    }
    
    // This would make a real API call to Mailchimp in a production environment
    // For the demo, we'll simulate the connection
    const connectedStatus = await simulateMailchimpApiCall(
      'check-connection', 
      { apiKey, serverPrefix, audienceId }
    );
    
    mailchimpConfig.isConnected = connectedStatus.success;
    localStorage.setItem('mailchimpConfig', JSON.stringify(mailchimpConfig));
    
    return connectedStatus.success;
  } catch (error) {
    console.error("Error checking Mailchimp connection:", error);
    mailchimpConfig.isConnected = false;
    localStorage.setItem('mailchimpConfig', JSON.stringify(mailchimpConfig));
    return false;
  }
};

/**
 * Subscribe email to Mailchimp list
 */
export const subscribeToNewsletter = async (subscriber: MailchimpSubscriber): Promise<{ success: boolean; message: string }> => {
  try {
    const config = loadMailchimpConfig();
    
    if (!config.isConnected) {
      await checkMailchimpConnection();
      if (!mailchimpConfig.isConnected) {
        return { 
          success: false, 
          message: "Mailchimp is not properly configured. Please contact the administrator." 
        };
      }
    }
    
    // This would make a real API call to Mailchimp in a production environment
    // For the demo, we'll simulate the subscription
    const result = await simulateMailchimpApiCall(
      'subscribe', 
      { 
        ...subscriber,
        listId: config.audienceId 
      }
    );
    
    return result;
  } catch (error) {
    console.error("Error subscribing to newsletter:", error);
    return {
      success: false,
      message: "An error occurred while subscribing. Please try again."
    };
  }
};

/**
 * Get subscribers from Mailchimp (for admin panel)
 */
export const getSubscribers = async (): Promise<{ success: boolean; subscribers?: MailchimpSubscriber[]; error?: string }> => {
  try {
    const config = loadMailchimpConfig();
    
    if (!config.isConnected) {
      return { 
        success: false, 
        error: "Mailchimp is not connected. Please configure your Mailchimp integration." 
      };
    }
    
    // This would make a real API call to Mailchimp in a production environment
    // For the demo, we'll simulate getting subscribers
    const result = await simulateMailchimpApiCall('get-subscribers', { listId: config.audienceId });
    
    return {
      success: result.success,
      subscribers: result.data?.subscribers || [],
      error: result.error
    };
  } catch (error) {
    console.error("Error getting subscribers:", error);
    return {
      success: false,
      error: "An error occurred while fetching subscribers."
    };
  }
};

/**
 * Connect to Mailchimp (admin function)
 */
export const connectToMailchimp = async (apiKey: string, serverPrefix: string, audienceId: string): Promise<{ success: boolean; message: string }> => {
  try {
    // Update the config with new values
    updateMailchimpConfig({
      apiKey,
      serverPrefix,
      audienceId
    });
    
    // Test the connection
    const connectionResult = await checkMailchimpConnection();
    
    if (connectionResult) {
      return {
        success: true,
        message: "Successfully connected to Mailchimp!"
      };
    } else {
      return {
        success: false,
        message: "Failed to connect to Mailchimp. Please check your credentials."
      };
    }
  } catch (error) {
    console.error("Error connecting to Mailchimp:", error);
    return {
      success: false,
      message: "An error occurred while connecting to Mailchimp."
    };
  }
};

/**
 * Disconnect from Mailchimp (admin function)
 */
export const disconnectMailchimp = (): { success: boolean; message: string } => {
  try {
    updateMailchimpConfig({
      apiKey: "",
      serverPrefix: "",
      audienceId: "",
      isConnected: false
    });
    
    localStorage.removeItem('mailchimpConfig');
    
    return {
      success: true,
      message: "Successfully disconnected from Mailchimp."
    };
  } catch (error) {
    console.error("Error disconnecting from Mailchimp:", error);
    return {
      success: false,
      message: "An error occurred while disconnecting from Mailchimp."
    };
  }
};

/**
 * Simulate Mailchimp API calls for demo purposes
 * This would be replaced with actual API calls in a production environment
 */
const simulateMailchimpApiCall = async (
  action: 'subscribe' | 'check-connection' | 'get-subscribers', 
  data: any
): Promise<any> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // For demo purposes, we'll simulate different responses
  switch (action) {
    case 'subscribe':
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!data.email || !emailRegex.test(data.email)) {
        return {
          success: false,
          message: "Please provide a valid email address."
        };
      }
      
      // Simulate successful subscription with 90% success rate
      const isSuccess = Math.random() < 0.9;
      
      if (isSuccess) {
        return {
          success: true,
          message: "Thank you for subscribing to our newsletter!"
        };
      } else {
        return {
          success: false,
          message: "Something went wrong. Please try again."
        };
      }
      
    case 'check-connection':
      // Simulate API key validation
      // A real implementation would make an API call to Mailchimp
      const hasValidCredentials = 
        data.apiKey && 
        data.apiKey.includes('-') && 
        data.serverPrefix && 
        data.audienceId;
      
      return {
        success: hasValidCredentials,
        error: hasValidCredentials ? null : "Invalid API credentials"
      };
      
    case 'get-subscribers':
      // Simulate getting subscribers
      return {
        success: true,
        data: {
          subscribers: [
            { email: "john.doe@example.com", firstName: "John", lastName: "Doe", tags: ["travel"] },
            { email: "jane.smith@example.com", firstName: "Jane", lastName: "Smith", tags: ["adventure"] },
            { email: "alice.walker@example.com", firstName: "Alice", lastName: "Walker", tags: ["travel", "food"] },
            { email: "bob.jones@example.com", firstName: "Bob", lastName: "Jones", tags: ["culture"] }
          ]
        }
      };
      
    default:
      return {
        success: false,
        message: "Unknown action"
      };
  }
};
