
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Area, AreaChart, Bar, BarChart, 
  CartesianGrid, Cell, Line, LineChart, 
  Pie, PieChart, ResponsiveContainer,
  Tooltip, XAxis, YAxis 
} from "recharts";
import { ArrowDown, ArrowUp, Users, FileText, Heart, DollarSign } from "lucide-react";
import { AnalyticsData } from "@/types/admin";

// Mock analytics data
const analyticsData: AnalyticsData = {
  visitors: {
    total: 12458,
    change: 14.6,
    data: [
      { date: "Jan", visitors: 2200 },
      { date: "Feb", visitors: 2800 },
      { date: "Mar", visitors: 3300 },
      { date: "Apr", visitors: 3100 },
      { date: "May", visitors: 3500 },
      { date: "Jun", visitors: 3700 },
      { date: "Jul", visitors: 3600 },
      { date: "Aug", visitors: 3200 },
      { date: "Sep", visitors: 3000 },
      { date: "Oct", visitors: 3200 },
      { date: "Nov", visitors: 3400 },
      { date: "Dec", visitors: 3800 }
    ]
  },
  posts: {
    total: 152,
    published: 124,
    draft: 28
  },
  engagement: {
    likes: 8574,
    comments: 3218,
    shares: 1254,
    data: [
      { name: "Paris Travel Guide", views: 6500, engagement: 1200 },
      { name: "Japan Cherry Blossoms", views: 5200, engagement: 980 },
      { name: "Hidden Beaches", views: 4800, engagement: 860 },
      { name: "NYC Food Tour", views: 4600, engagement: 750 },
      { name: "Hiking the Alps", views: 3900, engagement: 680 }
    ]
  },
  traffic: {
    sources: [
      { name: "Search", value: 53 },
      { name: "Social", value: 28 },
      { name: "Direct", value: 12 },
      { name: "Referral", value: 7 }
    ],
    referrers: [
      { name: "Google", value: 42 },
      { name: "Instagram", value: 15 },
      { name: "Pinterest", value: 12 },
      { name: "Facebook", value: 8 },
      { name: "Twitter", value: 5 }
    ]
  },
  bookings: {
    total: 867,
    change: 24.5,
    revenue: 89520,
    data: [
      { month: "Jan", flights: 15, hotels: 12, guides: 8 },
      { month: "Feb", flights: 20, hotels: 14, guides: 9 },
      { month: "Mar", flights: 25, hotels: 16, guides: 11 },
      { month: "Apr", flights: 32, hotels: 18, guides: 12 },
      { month: "May", flights: 38, hotels: 22, guides: 15 },
      { month: "Jun", flights: 42, hotels: 26, guides: 18 },
      { month: "Jul", flights: 48, hotels: 30, guides: 20 },
      { month: "Aug", flights: 52, hotels: 34, guides: 22 },
      { month: "Sep", flights: 45, hotels: 28, guides: 19 },
      { month: "Oct", flights: 40, hotels: 25, guides: 17 },
      { month: "Nov", flights: 35, hotels: 20, guides: 14 },
      { month: "Dec", flights: 30, hotels: 18, guides: 12 }
    ]
  }
};

// Colors for charts
const colors = {
  primary: "#0ea5e9",
  secondary: "#f97316",
  tertiary: "#8b5cf6",
  success: "#10b981",
  warning: "#f59e0b",
  error: "#ef4444",
  background: "rgba(14, 165, 233, 0.2)"
};

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const AnalyticsDashboard = () => {
  const [timeframe, setTimeframe] = useState("monthly");
  
  // Main analytics data
  const { visitors, posts, engagement, traffic, bookings } = analyticsData;
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
        <Tabs defaultValue="monthly" value={timeframe} onValueChange={setTimeframe} className="w-[400px]">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="yearly">Yearly</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Visitors Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Visitors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{visitors.total.toLocaleString()}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {visitors.change > 0 ? (
                <ArrowUp className="mr-1 h-4 w-4 text-green-500" />
              ) : (
                <ArrowDown className="mr-1 h-4 w-4 text-red-500" />
              )}
              <span className={visitors.change > 0 ? 'text-green-500' : 'text-red-500'}>
                {Math.abs(visitors.change)}%
              </span>
              <span className="ml-1">from last period</span>
            </div>
          </CardContent>
        </Card>
        
        {/* Posts Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{posts.total}</div>
            <div className="text-xs text-muted-foreground">
              {posts.published} published, {posts.draft} drafts
            </div>
          </CardContent>
        </Card>
        
        {/* Engagement Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Engagement</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{engagement.likes + engagement.comments + engagement.shares}</div>
            <div className="text-xs text-muted-foreground">
              {engagement.likes} likes, {engagement.comments} comments
            </div>
          </CardContent>
        </Card>
        
        {/* Bookings Revenue Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Booking Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${bookings.revenue.toLocaleString()}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {bookings.change > 0 ? (
                <ArrowUp className="mr-1 h-4 w-4 text-green-500" />
              ) : (
                <ArrowDown className="mr-1 h-4 w-4 text-red-500" />
              )}
              <span className={bookings.change > 0 ? 'text-green-500' : 'text-red-500'}>
                {Math.abs(bookings.change)}%
              </span>
              <span className="ml-1">from last period</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* Visitors Chart */}
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Visitor Growth</CardTitle>
            <CardDescription>Visitor count over time</CardDescription>
          </CardHeader>
          <CardContent className="px-2">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={visitors.data}>
                  <defs>
                    <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={colors.primary} stopOpacity={0.8}/>
                      <stop offset="95%" stopColor={colors.primary} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip />
                  <Area type="monotone" dataKey="visitors" stroke={colors.primary} fillOpacity={1} fill="url(#colorVisitors)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Traffic Sources Chart */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Traffic Sources</CardTitle>
            <CardDescription>Where your visitors come from</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <div className="h-[300px] w-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={traffic.sources}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {traffic.sources.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* Top Content Chart */}
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Top Content</CardTitle>
            <CardDescription>Most viewed and engaging content</CardDescription>
          </CardHeader>
          <CardContent className="px-2">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={engagement.data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="views" fill={colors.primary} />
                  <Bar dataKey="engagement" fill={colors.secondary} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Bookings Chart */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Bookings</CardTitle>
            <CardDescription>Booking statistics by category</CardDescription>
          </CardHeader>
          <CardContent className="px-2">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={bookings.data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="flights" stroke={colors.primary} />
                  <Line type="monotone" dataKey="hotels" stroke={colors.secondary} />
                  <Line type="monotone" dataKey="guides" stroke={colors.tertiary} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
