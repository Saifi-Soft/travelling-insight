
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertCircle, ExternalLink, Copy, Info } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const AdsPaymentSetup = () => {
  const [accountStatus, setAccountStatus] = useState<'unverified' | 'pending' | 'verified'>('pending');
  const [adSenseId, setAdSenseId] = useState('pub-1234567890123456');
  const [bankAccount, setBankAccount] = useState({
    accountName: 'John Smith',
    accountNumber: '•••• •••• •••• 1234',
    bankName: 'Example Bank',
    routingNumber: '•••• ••••',
    currency: 'USD'
  });
  
  const [nextPaymentAmount, setNextPaymentAmount] = useState(247.89);
  const [nextPaymentDate, setNextPaymentDate] = useState('May 21, 2025');
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied to clipboard',
      description: 'The AdSense ID has been copied to your clipboard.',
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-medium">AdSense Account Setup</h2>
        <p className="text-muted-foreground mt-1">
          Manage your AdSense account and payment settings
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Account Status Card */}
        <Card>
          <CardHeader>
            <CardTitle>Account Status</CardTitle>
            <CardDescription>Your Google AdSense account verification status</CardDescription>
          </CardHeader>
          <CardContent>
            {accountStatus === 'verified' ? (
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <AlertDescription className="text-green-700">
                  Your AdSense account is verified and active
                </AlertDescription>
              </Alert>
            ) : accountStatus === 'pending' ? (
              <Alert className="bg-yellow-50 border-yellow-200">
                <Info className="h-4 w-4 text-yellow-500" />
                <AlertDescription className="text-yellow-700">
                  Your AdSense account verification is pending. This may take up to 1-2 weeks.
                </AlertDescription>
              </Alert>
            ) : (
              <Alert className="bg-red-50 border-red-200">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <AlertDescription className="text-red-700">
                  Your AdSense account is not verified. Please complete the verification process.
                </AlertDescription>
              </Alert>
            )}
            
            <div className="mt-6 space-y-3">
              <div className="flex flex-col space-y-1">
                <Label className="text-xs text-gray-500">AdSense Publisher ID</Label>
                <div className="flex items-center gap-2">
                  <Input
                    value={adSenseId}
                    onChange={(e) => setAdSenseId(e.target.value)}
                    className="font-mono"
                  />
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => copyToClipboard(adSenseId)}
                    title="Copy AdSense ID"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="pt-2">
                <Button variant="outline" className="w-full">
                  <ExternalLink className="mr-2 h-4 w-4" /> 
                  Go to AdSense Dashboard
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Payment Information */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Information</CardTitle>
            <CardDescription>Your linked bank account for AdSense payments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm font-medium">Next Payment</p>
                  <p className="text-2xl font-bold text-green-600">${nextPaymentAmount.toFixed(2)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">Payment Date</p>
                  <p className="text-base">{nextPaymentDate}</p>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-4 mt-4">
                <h4 className="font-medium mb-2">Bank Account Information</h4>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <p className="text-muted-foreground">Name</p>
                    <p className="font-medium">{bankAccount.accountName}</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-muted-foreground">Account Number</p>
                    <p className="font-medium">{bankAccount.accountNumber}</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-muted-foreground">Bank</p>
                    <p className="font-medium">{bankAccount.bankName}</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-muted-foreground">Routing Number</p>
                    <p className="font-medium">{bankAccount.routingNumber}</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-muted-foreground">Currency</p>
                    <p className="font-medium">{bankAccount.currency}</p>
                  </div>
                </div>
              </div>
              
              <div className="pt-2">
                <Button variant="outline" className="w-full">
                  Update Bank Details
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Payment History */}
      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
          <CardDescription>Your recent AdSense payments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reference</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">April 12, 2025</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">$215.43</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Paid
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">ADSE-4532-789</td>
                </tr>
                <tr>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">March 14, 2025</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">$189.27</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Paid
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">ADSE-4231-567</td>
                </tr>
                <tr>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">February 12, 2025</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">$172.90</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Paid
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">ADSE-3974-345</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      
      {/* Additional Resources */}
      <Card>
        <CardHeader>
          <CardTitle>AdSense Resources</CardTitle>
          <CardDescription>Helpful links and resources for optimizing your ad performance</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            <li>
              <a href="#" className="flex items-center text-primary hover:underline">
                <ExternalLink className="h-4 w-4 mr-2" /> AdSense Policy Center
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center text-primary hover:underline">
                <ExternalLink className="h-4 w-4 mr-2" /> Ad Placement Best Practices
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center text-primary hover:underline">
                <ExternalLink className="h-4 w-4 mr-2" /> Optimize Your Ad Revenue
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center text-primary hover:underline">
                <ExternalLink className="h-4 w-4 mr-2" /> AdSense Help Center
              </a>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdsPaymentSetup;
