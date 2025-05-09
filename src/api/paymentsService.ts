
import { mongoApiService } from './mongoApiService';
import { toast } from 'sonner';

export const paymentsApi = {
  // Process a payment for subscription
  processSubscriptionPayment: async (userId: string, planType: string, paymentDetails: any) => {
    try {
      // In a real app, this would connect to a payment processor like Stripe
      console.log(`Processing ${planType} subscription payment for user ${userId}`);
      
      // For demo purposes, we'll simulate a successful payment
      const paymentResult = {
        success: true,
        paymentId: `pay_${Math.random().toString(36).substring(2, 15)}`,
        amount: planType === 'monthly' ? 9.99 : 99.99,
        currency: 'USD',
        status: 'completed',
        processingDate: new Date().toISOString()
      };
      
      // Log the payment
      await mongoApiService.insertDocument('payments', {
        userId,
        planType,
        ...paymentResult,
        ...paymentDetails
      });
      
      return paymentResult;
    } catch (error) {
      console.error('Error processing payment:', error);
      throw error;
    }
  },
  
  // Get payment history for a user
  getPaymentHistory: async (userId: string) => {
    try {
      if (!userId) return [];
      
      const payments = await mongoApiService.queryDocuments('payments', { userId });
      return payments.sort((a: any, b: any) => new Date(b.processingDate).getTime() - new Date(a.processingDate).getTime());
    } catch (error) {
      console.error(`Error fetching payment history for ${userId}:`, error);
      return [];
    }
  },
  
  // Cancel subscription
  cancelSubscription: async (userId: string) => {
    try {
      // Find the subscription
      const subscriptions = await mongoApiService.queryDocuments('subscriptions', { userId });
      
      if (subscriptions.length === 0) {
        toast.error('No active subscription found');
        return false;
      }
      
      // Update subscription status
      await mongoApiService.updateDocument('subscriptions', subscriptions[0].id, {
        status: 'cancelled',
        cancelledAt: new Date().toISOString(),
        autoRenew: false
      });
      
      toast.success('Subscription cancelled successfully');
      return true;
    } catch (error) {
      console.error(`Error cancelling subscription for ${userId}:`, error);
      toast.error('Failed to cancel subscription');
      return false;
    }
  }
};
