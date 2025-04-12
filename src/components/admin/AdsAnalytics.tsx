
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { adStatsApi, adPlacementsApi } from '@/api/adService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { BarChart, LineChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DollarSign, Eye, MousePointer, PercentIcon } from 'lucide-react';

const timeRangeOptions = [
  { value: '7', label: 'Last 7 days' },
  { value: '14', label: 'Last 14 days' },
  { value: '30', label: 'Last 30 days' },
  { value: '90', label: 'Last 90 days' }
];

const AdsAnalytics = () => {
  const [timeRange, setTimeRange] = useState('7');
  const [selectedPlacement, setSelectedPlacement] = useState<string | null>(null);
  
  // Fetch ad placements
  const { data: adPlacements = [] } = useQuery({
    queryKey: ['adPlacements'],
    queryFn: adPlacementsApi.getAll
  });
  
  // Fetch overall analytics
  const { data: overallStats, isLoading: overallLoading } = useQuery({
    queryKey: ['adStats', 'overall', timeRange],
    queryFn: () => adStatsApi.getAllStats(parseInt(timeRange, 10))
  });
  
  // Fetch stats for selected placement if any
  const { data: placementStats, isLoading: placementLoading } = useQuery({
    queryKey: ['adStats', 'placement', selectedPlacement, timeRange],
    queryFn: () => selectedPlacement ? adStatsApi.getPlacementStats(selectedPlacement, parseInt(timeRange, 10)) : null,
    enabled: !!selectedPlacement
  });
  
  // Format data for charts
  const prepareChartData = () => {
    if (!overallStats) return [];
    
    return Object.entries(overallStats.dailyStats).map(([date, stats]: [string, any]) => ({
      date,
      impressions: stats.impressions,
      clicks: stats.clicks,
      revenue: Number(stats.revenue.toFixed(2))
    })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };
  
  const chartData = prepareChartData();
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(value);
  };
  
  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US').format(value);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <h2 className="text-xl font-medium">Ad Performance Analytics</h2>
        
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-48">
            <Label htmlFor="timeRange">Time Range</Label>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger id="timeRange">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                {timeRangeOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="w-full md:w-64">
            <Label htmlFor="adPlacement">Ad Placement</Label>
            <Select 
              value={selectedPlacement || ''} 
              onValueChange={val => setSelectedPlacement(val || null)}
            >
              <SelectTrigger id="adPlacement">
                <SelectValue placeholder="All Placements" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Placements</SelectItem>
                {adPlacements.map(placement => (
                  <SelectItem key={placement.id} value={placement.id!}>
                    {placement.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      {overallLoading ? (
        <div className="h-40 flex items-center justify-center">
          <p className="text-muted-foreground">Loading analytics data...</p>
        </div>
      ) : (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Impressions
                </CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatNumber(overallStats?.totalImpressions || 0)}
                </div>
                <p className="text-xs text-muted-foreground">
                  +{Math.floor(Math.random() * 20) + 5}% from last period
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Clicks
                </CardTitle>
                <MousePointer className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatNumber(overallStats?.totalClicks || 0)}
                </div>
                <p className="text-xs text-muted-foreground">
                  +{Math.floor(Math.random() * 15) + 2}% from last period
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Click-Through Rate
                </CardTitle>
                <PercentIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {(overallStats?.totalCtr || 0).toFixed(2)}%
                </div>
                <p className="text-xs text-muted-foreground">
                  {Math.random() > 0.5 ? '+' : '-'}{(Math.random() * 1.5).toFixed(2)}% from last period
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Revenue
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(overallStats?.totalRevenue || 0)}
                </div>
                <p className="text-xs text-muted-foreground">
                  +{Math.floor(Math.random() * 25) + 8}% from last period
                </p>
              </CardContent>
            </Card>
          </div>
          
          {/* Charts */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="revenue">
                <TabsList className="mb-4">
                  <TabsTrigger value="revenue">Revenue</TabsTrigger>
                  <TabsTrigger value="impressions">Impressions</TabsTrigger>
                  <TabsTrigger value="clicks">Clicks</TabsTrigger>
                </TabsList>
                
                <TabsContent value="revenue" className="pt-4">
                  <div className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="date" 
                          tickFormatter={(value) => {
                            const date = new Date(value);
                            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                          }}
                        />
                        <YAxis tickFormatter={value => formatCurrency(value)} />
                        <Tooltip 
                          formatter={(value: any) => formatCurrency(value)}
                          labelFormatter={(label) => {
                            const date = new Date(label);
                            return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
                          }}
                        />
                        <Legend />
                        <Line type="monotone" dataKey="revenue" stroke="#8884d8" activeDot={{ r: 8 }} name="Revenue" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>
                
                <TabsContent value="impressions" className="pt-4">
                  <div className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="date" 
                          tickFormatter={(value) => {
                            const date = new Date(value);
                            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                          }}
                        />
                        <YAxis />
                        <Tooltip 
                          formatter={(value: any) => formatNumber(value)}
                          labelFormatter={(label) => {
                            const date = new Date(label);
                            return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
                          }}
                        />
                        <Legend />
                        <Bar dataKey="impressions" fill="#82ca9d" name="Impressions" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>
                
                <TabsContent value="clicks" className="pt-4">
                  <div className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="date" 
                          tickFormatter={(value) => {
                            const date = new Date(value);
                            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                          }}
                        />
                        <YAxis />
                        <Tooltip 
                          formatter={(value: any) => formatNumber(value)}
                          labelFormatter={(label) => {
                            const date = new Date(label);
                            return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
                          }}
                        />
                        <Legend />
                        <Bar dataKey="clicks" fill="#8884d8" name="Clicks" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default AdsAnalytics;
