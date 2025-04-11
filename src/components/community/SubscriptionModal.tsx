
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import { CreditCard, Lock, CheckCircle2 } from 'lucide-react';
import { communityPaymentApi } from '@/api/communityApiService';

interface SubscriptionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubscribe: () => void;
}

const SubscriptionModal = ({ open, onOpenChange, onSubscribe }: SubscriptionModalProps) => {
  const [step, setStep] = useState<'plans' | 'payment'>('plans');
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'annual'>('monthly');
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    isValid: false
  });
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

  const validateCardNumber = (number: string) => {
    // Basic validation - just check if it's 16 digits
    return /^\d{16}$/.test(number.replace(/\s/g, ''));
  };

  const validateExpiryDate = (date: string) => {
    // Format should be MM/YY
    if (!/^\d{2}\/\d{2}$/.test(date)) return false;
    
    const [month, year] = date.split('/').map(Number);
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100;
    const currentMonth = currentDate.getMonth() + 1;
    
    if (month < 1 || month > 12) return false;
    if (year < currentYear) return false;
    if (year === currentYear && month < currentMonth) return false;
    
    return true;
  };

  const validateCVV = (cvv: string) => {
    return /^\d{3,4}$/.test(cvv);
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Format card number with spaces after every 4 digits
    let value = e.target.value.replace(/\s/g, '');
    if (value.length > 16) value = value.slice(0, 16);
    
    // Add spaces for readability
    const formattedValue = value.replace(/(\d{4})/g, '$1 ').trim();
    
    setPaymentDetails({
      ...paymentDetails,
      cardNumber: formattedValue,
      isValid: validateCardDetails({
        ...paymentDetails,
        cardNumber: value
      })
    });
  };

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/[^\d]/g, '');
    
    if (value.length > 4) value = value.slice(0, 4);
    if (value.length > 2) {
      value = value.slice(0, 2) + '/' + value.slice(2);
    }
    
    setPaymentDetails({
      ...paymentDetails,
      expiryDate: value,
      isValid: validateCardDetails({
        ...paymentDetails,
        expiryDate: value
      })
    });
  };

  const validateCardDetails = (details: typeof paymentDetails) => {
    return (
      validateCardNumber(details.cardNumber) &&
      details.cardName.length >= 3 &&
      validateExpiryDate(details.expiryDate) &&
      validateCVV(details.cvv)
    );
  };

  const handleSubmitPayment = async () => {
    setIsProcessing(true);
    
    try {
      // In a real implementation, this would securely process the payment
      // For demo purposes, we'll simulate a successful payment
      
      // Mock user ID for demo
      const mockUserId = 'demo-user-' + Math.random().toString(36).substring(2, 9);
      
      await communityPaymentApi.createSubscription(
        mockUserId,
        selectedPlan,
        {
          method: 'credit_card',
          cardLastFour: paymentDetails.cardNumber.slice(-4)
        }
      );
      
      // Simulate loading
      setTimeout(() => {
        toast.success('Payment processed successfully!');
        onSubscribe();
        onOpenChange(false);
        setIsProcessing(false);
        // Reset for next time
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
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <div className="relative">
                    <Input 
                      id="cardNumber" 
                      placeholder="0000 0000 0000 0000" 
                      value={paymentDetails.cardNumber}
                      onChange={handleCardNumberChange}
                    />
                    <CreditCard className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="cardName">Cardholder Name</Label>
                  <Input
                    id="cardName"
                    placeholder="John Smith"
                    value={paymentDetails.cardName}
                    onChange={(e) => setPaymentDetails({
                      ...paymentDetails,
                      cardName: e.target.value,
                      isValid: validateCardDetails({
                        ...paymentDetails,
                        cardName: e.target.value
                      })
                    })}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiryDate">Expiry Date</Label>
                    <Input
                      id="expiryDate"
                      placeholder="MM/YY"
                      value={paymentDetails.expiryDate}
                      onChange={handleExpiryDateChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cvv">CVV</Label>
                    <div className="relative">
                      <Input
                        id="cvv"
                        placeholder="123"
                        maxLength={4}
                        value={paymentDetails.cvv}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^\d]/g, '').slice(0, 4);
                          setPaymentDetails({
                            ...paymentDetails,
                            cvv: value,
                            isValid: validateCardDetails({
                              ...paymentDetails,
                              cvv: value
                            })
                          });
                        }}
                      />
                      <Lock className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="pt-2">
                <p className="text-xs text-muted-foreground flex items-center">
                  <Lock className="h-3 w-3 mr-1" />
                  Your payment information is secured with SSL encryption
                </p>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setStep('plans')} disabled={isProcessing}>
                Back
              </Button>
              <Button 
                onClick={handleSubmitPayment} 
                disabled={!paymentDetails.isValid || isProcessing}
                className={isProcessing ? 'opacity-80' : ''}
              >
                {isProcessing ? 'Processing...' : `Pay $${plans[selectedPlan].price}`}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SubscriptionModal;
