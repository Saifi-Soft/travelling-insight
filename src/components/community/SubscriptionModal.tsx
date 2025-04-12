import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import { CreditCard, Lock, CheckCircle2 } from 'lucide-react';
import { communityPaymentApi } from '@/api/communityApiService';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

interface SubscriptionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubscribe: () => void;
}

const paymentSchema = z.object({
  cardNumber: z.string().regex(/^\d{16}$/, "Card number must be 16 digits"),
  cardName: z.string().min(3, "Name must be at least 3 characters"),
  expiryDate: z.string().regex(/^\d{2}\/\d{2}$/, "Format must be MM/YY"),
  cvv: z.string().regex(/^\d{3,4}$/, "CVV must be 3-4 digits"),
});

const SubscriptionModal = ({ open, onOpenChange, onSubscribe }: SubscriptionModalProps) => {
  const [step, setStep] = useState<'plans' | 'payment'>('plans');
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'annual'>('monthly');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const plans = {
    monthly: {
      name: 'Monthly Plan',
      price: 9.99,
      features: [
        'Access to community features',
        'Travel buddy matching',
        'Join special interest groups',
        'Participate in community events'
      ]
    },
    annual: {
      name: 'Annual Plan',
      price: 99.99,
      features: [
        'All monthly features',
        'Save 17% compared to monthly',
        'Premium badges',
        'Early access to travel events'
      ]
    }
  };

  const form = useForm<z.infer<typeof paymentSchema>>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      cardNumber: '',
      cardName: '',
      expiryDate: '',
      cvv: '',
    },
  });

  useEffect(() => {
    if (open) {
      setStep('plans');
      form.reset();
    }
  }, [open, form]);

  const formatCardNumber = (value: string) => {
    const cleanValue = value.replace(/\s/g, '');
    if (cleanValue.length > 16) return cleanValue.slice(0, 16);
    return cleanValue.replace(/(\d{4})/g, '$1 ').trim();
  };

  const formatExpiryDate = (value: string) => {
    const cleanValue = value.replace(/[^\d]/g, '');
    if (cleanValue.length > 4) return cleanValue.slice(0, 4);
    if (cleanValue.length > 2) {
      return cleanValue.slice(0, 2) + '/' + cleanValue.slice(2);
    }
    return cleanValue;
  };

  const handleSubmitPayment = async (data: z.infer<typeof paymentSchema>) => {
    setIsProcessing(true);
    
    try {
      const userId = localStorage.getItem('community_user_id');
      
      if (!userId) {
        toast.error('Please create a profile before subscribing');
        onOpenChange(false);
        setIsProcessing(false);
        return;
      }
      
      const today = new Date();
      const endDate = new Date();
      
      if (selectedPlan === 'monthly') {
        endDate.setMonth(today.getMonth() + 1);
      } else {
        endDate.setFullYear(today.getFullYear() + 1);
      }
      
      await communityPaymentApi.createSubscription(
        userId,
        selectedPlan,
        {
          paymentMethod: {
            method: 'credit_card',
            cardLastFour: data.cardNumber.slice(-4),
            expiryDate: data.expiryDate
          },
          status: 'active',
          startDate: today,
          endDate: endDate,
          amount: selectedPlan === 'monthly' ? plans.monthly.price : plans.annual.price,
          autoRenew: true
        }
      );
      
      setTimeout(() => {
        toast.success('Payment processed successfully!');
        onSubscribe();
        onOpenChange(false);
        setIsProcessing(false);
        setStep('plans');
      }, 1500);
      
    } catch (error) {
      console.error('Payment processing error:', error);
      toast.error('Payment processing failed. Please try again.');
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {step === 'plans' ? 'Join Our Travel Community' : 'Complete Your Payment'}
          </DialogTitle>
        </DialogHeader>
        
        {step === 'plans' ? (
          <>
            <div className="py-6 space-y-6">
              <p className="text-muted-foreground">
                Subscribe to unlock all community features including travel buddy matching, special interest groups, and exclusive events.
              </p>
              
              <RadioGroup value={selectedPlan} onValueChange={(value: any) => setSelectedPlan(value)} className="space-y-4">
                {Object.entries(plans).map(([key, plan]) => (
                  <div 
                    key={key}
                    className={`flex items-start space-x-3 border rounded-lg p-4 cursor-pointer ${
                      selectedPlan === key ? 'border-primary bg-primary/5' : 'border-input'
                    }`}
                    onClick={() => setSelectedPlan(key as 'monthly' | 'annual')}
                  >
                    <RadioGroupItem value={key} id={`plan-${key}`} className="mt-1" />
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <label htmlFor={`plan-${key}`} className="font-medium cursor-pointer">
                          {plan.name}
                        </label>
                        <span className="font-bold">${plan.price}</span>
                      </div>
                      <ul className="mt-2 space-y-1">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="text-sm text-muted-foreground flex items-center">
                            <CheckCircle2 className="h-3.5 w-3.5 mr-2 text-primary" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </RadioGroup>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={() => setStep('payment')}>
                Continue to Payment
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <div className="py-4 space-y-5">
              <div className="flex items-center justify-between mb-2">
                <p className="font-medium">Selected Plan:</p>
                <div className="flex items-center">
                  <span>{plans[selectedPlan].name}</span>
                  <span className="ml-2 font-bold">${plans[selectedPlan].price}</span>
                </div>
              </div>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmitPayment)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="cardNumber"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel>Card Number</FormLabel>
                        <div className="relative">
                          <FormControl>
                            <Input 
                              placeholder="0000 0000 0000 0000"
                              {...field}
                              onChange={(e) => {
                                const formatted = formatCardNumber(e.target.value.replace(/\s/g, ''));
                                field.onChange(formatted);
                              }}
                            />
                          </FormControl>
                          <CreditCard className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground" />
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="cardName" 
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel>Cardholder Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Smith" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="expiryDate"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel>Expiry Date</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="MM/YY" 
                              {...field}
                              onChange={(e) => {
                                const formatted = formatExpiryDate(e.target.value);
                                field.onChange(formatted);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="cvv"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel>CVV</FormLabel>
                          <div className="relative">
                            <FormControl>
                              <Input 
                                placeholder="123" 
                                maxLength={4} 
                                {...field}
                                onChange={(e) => {
                                  const value = e.target.value.replace(/[^\d]/g, '').slice(0, 4);
                                  field.onChange(value);
                                }}
                              />
                            </FormControl>
                            <Lock className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="pt-2">
                    <p className="text-xs text-muted-foreground flex items-center">
                      <Lock className="h-3 w-3 mr-1" />
                      Your payment information is secured with SSL encryption
                    </p>
                  </div>
                  
                  <DialogFooter className="mt-6">
                    <Button type="button" variant="outline" onClick={() => setStep('plans')} disabled={isProcessing}>
                      Back
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={isProcessing}
                      className={isProcessing ? 'opacity-80' : ''}
                    >
                      {isProcessing ? 'Processing...' : `Pay $${plans[selectedPlan].price}`}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SubscriptionModal;
