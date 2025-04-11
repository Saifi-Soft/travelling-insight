
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, BarChart, LineChart, PieChart } from '@/components/ui/chart';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowUpRight, Users, FileText, CalendarClock, CreditCard } from "lucide-react";

const AnalyticsDashboard = () => {
  const [timeRange, setTimeRange] = useState('7d');
  
  // Sample data - in a real application, this would come from an API
  const visitorData = [
    { date: 'Mon', visitors: 2400 },
    { date: 'Tue', visitors: 1398 },
    { date: 'Wed', visitors: 9800 },
    { date: 'Thu', visitors: 3908 },
    { date: 'Fri', visitors: 4800 },
    { date: 'Sat', visitors: 3800 },
    { date: 'Sun', visitors: 4300 },
  ];
  
  const postEngagementData = [
    { name: 'Travel Tips', views: 4000, engagement: 2400 },
    { name: 'Destinations', views: 3000, engagement: 1398 },
    { name: 'Food', views: 2000, engagement: 9800 },
    { name: 'Culture', views: 2780, engagement: 3908 },
    { name: 'Adventure', views: 1890, engagement: 4800 },
  ];
  
  const trafficSourcesData = [
    { name: 'Direct', value: 400 },
    { name: 'Social', value: 300 },
    { name: 'Search', value: 300 },
    { name: 'Referral', value: 200 },
    { name: 'Email', value: 100 },
  ];
  
  const bookingData = [
    { month: 'Jan', flights: 4000, hotels: 2400, guides: 2400 },
    { month: 'Feb', flights: 3000, hotels: 1398, guides: 2210 },
    { month: 'Mar', flights: 2000, hotels: 9800, guides: 2290 },
    { month: 'Apr', flights: 2780, hotels: 3908, guides: 2000 },
    { month: 'May', flights: 1890, hotels: 4800, guides: 2181 },
    { month: 'Jun', flights: 2390, hotels: 3800, guides: 2500 },
    { month: 'Jul', flights: 3490, hotels: 4300, guides: 2100 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Website Analytics</h2>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="24h">Last 24 hours</SelectItem>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
            <SelectItem value="12m">Last 12 months</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Visitors
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24,531</div>
            <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Published Posts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">145</div>
            <p className="text-xs text-muted-foreground">
              +12 new posts this month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <CalendarClock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">873</div>
            <p className="text-xs text-muted-foreground">
              +8.2% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,231.89</div>
            <p className="text-xs text-muted-foreground">
              +19% from last month
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-8">
        <Card className="col-span-8 md:col-span-4">
          <CardHeader>
            <CardTitle>Visitors Over Time</CardTitle>
            <CardDescription>Daily visitor statistics for your website</CardDescription>
          </CardHeader>
          <CardContent>
            <LineChart
              data={visitorData}
              index="date"
              categories={["visitors"]}
              colors={["blue"]}
              yAxisWidth={40}
              showAnimation
              className="h-80"
            />
          </CardContent>
        </Card>
        
        <Card className="col-span-8 md:col-span-4">
          <CardHeader>
            <CardTitle>Post Engagement</CardTitle>
            <CardDescription>Views and engagement by post category</CardDescription>
          </CardHeader>
          <CardContent>
            <BarChart
              data={postEngagementData}
              index="name"
              categories={["views", "engagement"]}
              colors={["blue", "green"]}
              yAxisWidth={40}
              showAnimation
              className="h-80"
            />
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-8">
        <Card className="col-span-8 md:col-span-4 lg:col-span-3">
          <CardHeader>
            <CardTitle>Traffic Sources</CardTitle>
            <CardDescription>Where your visitors come from</CardDescription>
          </CardHeader>
          <CardContent>
            <PieChart
              data={trafficSourcesData}
              index="name"
              categories={["value"]}
              colors={["blue", "green", "yellow", "purple", "pink"]}
              showAnimation
              className="h-80"
            />
          </CardContent>
        </Card>
        
        <Card className="col-span-8 md:col-span-4 lg:col-span-5">
          <CardHeader>
            <CardTitle>Booking Analytics</CardTitle>
            <CardDescription>Monthly booking statistics by type</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="chart" className="space-y-4">
              <TabsList>
                <TabsTrigger value="chart">Area Chart</TabsTrigger>
                <TabsTrigger value="bar">Bar Chart</TabsTrigger>
              </TabsList>
              <TabsContent value="chart" className="space-y-4">
                <AreaChart
                  data={bookingData}
                  index="month"
                  categories={["flights", "hotels", "guides"]}
                  colors={["blue", "green", "yellow"]}
                  yAxisWidth={40}
                  showAnimation
                  className="h-80"
                />
              </TabsContent>
              <TabsContent value="bar" className="space-y-4">
                <BarChart
                  data={bookingData}
                  index="month"
                  categories={["flights", "hotels", "guides"]}
                  colors={["blue", "green", "yellow"]}
                  yAxisWidth={40}
                  showAnimation
                  className="h-80"
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
