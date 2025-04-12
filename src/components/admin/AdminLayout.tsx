
import React, { ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Bell, 
  LayoutDashboard, 
  FileText, 
  FolderOpen, 
  Settings, 
  LogOut,
  MessageSquare,
  Users,
  BarChart
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface AdminLayoutProps {
  children: ReactNode;
  activeItem?: 'dashboard' | 'posts' | 'categories' | 'comments' | 'community' | 'settings' | 'ads';
}

const AdminLayout = ({ children, activeItem = 'dashboard' }: AdminLayoutProps) => {
  const navigate = useNavigate();

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="h-5 w-5" />,
      path: '/admin/dashboard'
    },
    {
      id: 'posts',
      label: 'Posts',
      icon: <FileText className="h-5 w-5" />,
      path: '/admin/posts'
    },
    {
      id: 'categories',
      label: 'Categories',
      icon: <FolderOpen className="h-5 w-5" />,
      path: '/admin/categories'
    },
    {
      id: 'comments',
      label: 'Comments',
      icon: <MessageSquare className="h-5 w-5" />,
      path: '/admin/comments'
    },
    {
      id: 'community',
      label: 'Community',
      icon: <Users className="h-5 w-5" />,
      path: '/admin/community'
    },
    {
      id: 'ads',
      label: 'Ads',
      icon: <BarChart className="h-5 w-5" />,
      path: '/admin/ads'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings className="h-5 w-5" />,
      path: '/admin/settings'
    }
  ];

  const handleLogout = () => {
    // For now, just redirect to login
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <Link to="/" className="flex items-center">
            <span className="text-xl font-bold text-primary">Nomad Panel</span>
          </Link>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.id}
              to={item.path}
              className={cn(
                "flex items-center space-x-3 px-3 py-2 rounded-md text-sm transition-colors",
                activeItem === item.id
                  ? "bg-primary text-white"
                  : "text-gray-700 hover:bg-gray-100"
              )}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 px-3 py-2 w-full rounded-md text-sm text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 py-4 px-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">Admin Panel</h1>
          
          <div className="flex items-center space-x-4">
            <button className="relative rounded-full bg-gray-100 p-1">
              <Bell className="h-6 w-6 text-gray-600" />
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
            </button>
            
            <div className="flex items-center space-x-2">
              <Avatar>
                <AvatarImage src="https://ui-avatars.com/api/?name=Admin+User" />
                <AvatarFallback>AU</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">Admin User</p>
              </div>
            </div>
          </div>
        </header>
        
        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
