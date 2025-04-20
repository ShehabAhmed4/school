import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Bell, ChevronDown, LogOut, UserCircle, School } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Avatar from './Avatar';
import { notifications } from '../../data/mockData';

const Navbar: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const navigate = useNavigate();
  
  const userNotifications = notifications.filter(n => 
    n.userId === currentUser?.id
  ).slice(0, 5);
  
  const unreadCount = userNotifications.filter(n => !n.read).length;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (isProfileOpen) setIsProfileOpen(false);
    if (isNotificationsOpen) setIsNotificationsOpen(false);
  };

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
    if (isNotificationsOpen) setIsNotificationsOpen(false);
  };

  const toggleNotifications = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
    if (isProfileOpen) setIsProfileOpen(false);
  };

  return (
    <nav className="bg-blue-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <School className="h-8 w-8 text-white" />
              <span className="ml-2 text-white font-bold text-xl">EduTrack</span>
            </Link>
            
            <div className="hidden md:ml-6 md:flex md:space-x-4">
              <Link
                to="/"
                className="px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-blue-700"
              >
                Home
              </Link>
              
              {currentUser && currentUser.role === 'student' && (
                <Link
                  to="/student/dashboard"
                  className="px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-blue-700"
                >
                  Dashboard
                </Link>
              )}
              
              {currentUser && currentUser.role === 'teacher' && (
                <Link
                  to="/teacher/dashboard"
                  className="px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-blue-700"
                >
                  Dashboard
                </Link>
              )}
              
              {currentUser && currentUser.role === 'admin' && (
                <Link
                  to="/admin/dashboard"
                  className="px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-blue-700"
                >
                  Dashboard
                </Link>
              )}
            </div>
          </div>
          
          <div className="flex items-center">
            {currentUser ? (
              <>
                <div className="hidden md:ml-4 md:flex md:items-center">
                  <div className="relative">
                    <button
                      onClick={toggleNotifications}
                      className="p-1 rounded-full text-white hover:bg-blue-700 focus:outline-none"
                    >
                      <Bell className="h-6 w-6" />
                      {unreadCount > 0 && (
                        <span className="absolute top-0 right-0 block h-4 w-4 rounded-full bg-red-500 text-xs text-white text-center">
                          {unreadCount}
                        </span>
                      )}
                    </button>
                    
                    {isNotificationsOpen && (
                      <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                        <div className="py-2 px-4 text-sm font-medium text-gray-700 border-b border-gray-200">
                          Notifications
                        </div>
                        <div className="max-h-96 overflow-y-auto">
                          {userNotifications.length > 0 ? (
                            userNotifications.map((notification) => (
                              <div
                                key={notification.id}
                                className={`px-4 py-3 hover:bg-gray-50 border-b border-gray-100 ${
                                  !notification.read ? 'bg-blue-50' : ''
                                }`}
                              >
                                <p className="text-sm text-gray-800">{notification.message}</p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {notification.createdAt}
                                </p>
                              </div>
                            ))
                          ) : (
                            <div className="px-4 py-3 text-sm text-gray-500">
                              No notifications
                            </div>
                          )}
                        </div>
                        {userNotifications.length > 0 && (
                          <div className="py-2 px-4 text-sm font-medium text-blue-700 border-t border-gray-200">
                            <Link to="/notifications" className="block">
                              View all notifications
                            </Link>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="ml-4 relative flex-shrink-0">
                    <div>
                      <button
                        onClick={toggleProfile}
                        className="flex text-sm rounded-full focus:outline-none items-center"
                      >
                        <Avatar
                          src={currentUser.avatar}
                          alt={currentUser.name}
                          size="sm"
                        />
                        <span className="ml-2 text-white">{currentUser.name}</span>
                        <ChevronDown className="ml-1 h-4 w-4 text-white" />
                      </button>
                    </div>
                    
                    {isProfileOpen && (
                      <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                        <div className="py-1">
                          <Link
                            to="/profile"
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <UserCircle className="mr-2 h-4 w-4" />
                            Your Profile
                          </Link>
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <LogOut className="mr-2 h-4 w-4" />
                            Sign out
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex md:hidden">
                  <button
                    onClick={toggleMenu}
                    className="p-2 rounded-md text-white hover:bg-blue-700 focus:outline-none"
                  >
                    {isMenuOpen ? (
                      <X className="block h-6 w-6" />
                    ) : (
                      <Menu className="block h-6 w-6" />
                    )}
                  </button>
                </div>
              </>
            ) : (
              <div className="flex space-x-4">
                <Link
                  to="/login"
                  className="px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-blue-700"
                >
                  Login
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/"
              className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-blue-700"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            
            {currentUser && currentUser.role === 'student' && (
              <Link
                to="/student/dashboard"
                className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-blue-700"
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
            )}
            
            {currentUser && currentUser.role === 'teacher' && (
              <Link
                to="/teacher/dashboard"
                className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-blue-700"
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
            )}
            
            {currentUser && currentUser.role === 'admin' && (
              <Link
                to="/admin/dashboard"
                className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-blue-700"
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
            )}
            
            {currentUser && (
              <>
                <Link
                  to="/profile"
                  className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-blue-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile
                </Link>
                <Link
                  to="/notifications"
                  className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-blue-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Notifications {unreadCount > 0 && `(${unreadCount})`}
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white hover:bg-blue-700"
                >
                  Sign out
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;