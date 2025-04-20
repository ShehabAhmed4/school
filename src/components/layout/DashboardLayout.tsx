import React, { ReactNode, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Home, 
  Users, 
  Calendar,

  FileText, 
  BarChart2, 
  Settings, 
  ChevronRight, 
  ChevronLeft
} from 'lucide-react';
import Navbar from '../common/Navbar';
import { useAuth } from '../../contexts/AuthContext';

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, title }) => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  if (!currentUser) {
    navigate('/login');
    return null;
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const getNavItems = () => {
    switch (currentUser.role) {
      case 'student':
        return [
          { name: 'Dashboard', icon: <Home size={20} />, href: '/student/dashboard' },
          { name: 'Attendance', icon: <Calendar size={20} />, href: '/student/attendance' },
          { name: 'Reports', icon: <FileText size={20} />, href: '/student/reports' },
          { name: 'Profile', icon: <Settings size={20} />, href: '/profile' },
        ];
      case 'teacher':
        return [
          { name: 'Dashboard', icon: <Home size={20} />, href: '/teacher/dashboard' },
          { name: 'Mark Attendance', icon: <Calendar size={20} />, href: '/teacher/attendance' },
          { name: 'Classes', icon: <Users size={20} />, href: '/teacher/classes' },
          { name: 'Reports', icon: <FileText size={20} />, href: '/teacher/reports' },
          { name: 'Profile', icon: <Settings size={20} />, href: '/profile' },
        ];
      case 'admin':
        return [
          { name: 'Dashboard', icon: <Home size={20} />, href: '/admin/dashboard' },
          { name: 'Users', icon: <Users size={20} />, href: '/admin/users' },
          { name: 'Classes', icon: <Calendar size={20} />, href: '/admin/classes' },
          { name: 'Reports', icon: <BarChart2 size={20} />, href: '/admin/reports' },
          { name: 'Settings', icon: <Settings size={20} />, href: '/admin/settings' },
          { name: 'Profile', icon: <Settings size={20} />, href: '/profile' },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      
      <div className="flex">
        <div 
          className={`${
            sidebarOpen ? 'w-64' : 'w-20'
          } bg-white shadow-md transition-all duration-300 ease-in-out fixed h-full z-10`}
        >
          <div className="h-16 flex items-center justify-between px-4 border-b">
            <h2 className={`font-semibold text-blue-800 ${sidebarOpen ? 'block' : 'hidden'}`}>
              {currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)} Panel
            </h2>
            <button
              onClick={toggleSidebar}
              className="p-1 rounded-full hover:bg-gray-100 focus:outline-none"
            >
              {sidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
            </button>
          </div>
          
          <nav className="mt-4 px-2">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="flex items-center py-2 px-4 rounded-md my-1 text-gray-700 hover:bg-blue-50 hover:text-blue-800"
              >
                <span className="mr-3">{item.icon}</span>
                <span className={`${sidebarOpen ? 'block' : 'hidden'}`}>{item.name}</span>
              </a>
            ))}
          </nav>
        </div>
        
        <div className={`${sidebarOpen ? 'ml-64' : 'ml-20'} flex-1 transition-all duration-300 ease-in-out`}>
          <main className="py-6 px-4 sm:px-6 lg:px-8">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            </div>
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;