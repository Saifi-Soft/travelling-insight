
import React, { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  FolderOpen, 
  MessageSquare, 
  Users, 
  Settings, 
  LogOut 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

interface AdminLayoutProps {
  children: ReactNode;
  activeItem?: string;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, activeItem = 'dashboard' }) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Navigation items for the sidebar
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
    { id: 'posts', label: 'Posts', icon: FileText, path: '/admin/posts' },
    { id: 'categories', label: 'Categories', icon: FolderOpen, path: '/admin/categories' },
    { id: 'comments', label: 'Comments', icon: MessageSquare, path: '/admin/comments' },
    { id: 'community', label: 'Community', icon: Users, path: '/admin/community' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/admin/settings' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
    navigate('/admin-login');
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 h-screen fixed">
        <div className="p-6">
          <div className="text-blue-600 font-bold text-xl mb-6">
            Travelling Insight<br />Admin
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => (
              <Button
                key={item.id}
                variant={activeItem === item.id ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start text-left font-normal h-12 mb-1",
                  activeItem === item.id ? "bg-blue-600 text-white hover:bg-blue-700" : "hover:bg-slate-100 text-slate-700"
                )}
                onClick={() => navigate(item.path)}
              >
                <item.icon className={cn(
                  "mr-3 h-5 w-5",
                  activeItem === item.id ? "text-white" : "text-slate-500"
                )} />
                {item.label}
              </Button>
            ))}
          </nav>
        </div>

        {/* Logout button at the bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-left font-normal text-red-500 hover:bg-red-50 hover:text-red-600"
            onClick={handleLogout}
          >
            <LogOut className="mr-3 h-5 w-5" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="ml-64 w-full flex-1 p-8">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
