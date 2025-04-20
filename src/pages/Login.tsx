import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, School, User, Users } from 'lucide-react';
import AuthLayout from '../components/layout/AuthLayout';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { useAuth } from '../contexts/AuthContext';

type LoginRole = 'student' | 'teacher' | 'admin';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<LoginRole>('student');
  const [error, setError] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      if (!email || !password) {
        setError('Please enter both email and password');
        return;
      }
      
      // For demo, use any password
      await login(email, password, selectedRole);
      
      // Redirect based on role
      switch (selectedRole) {
        case 'student':
          navigate('/student/dashboard');
          break;
        case 'teacher':
          navigate('/teacher/dashboard');
          break;
        case 'admin':
          navigate('/admin/dashboard');
          break;
        default:
          navigate('/');
      }
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    }
  };

  const roleOptions = [
    { id: 'student', label: 'Student', icon: <User size={20} /> },
    { id: 'teacher', label: 'Teacher', icon: <School size={20} /> },
    { id: 'admin', label: 'Administrator', icon: <Users size={20} /> },
  ];

  return (
    <AuthLayout title="Sign in to EduTrack" subtitle="Enter your credentials to access your account">
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <div className="flex justify-center space-x-4 mb-6">
            {roleOptions.map((role) => (
              <button
                key={role.id}
                type="button"
                className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 ${
                  selectedRole === role.id
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => setSelectedRole(role.id as LoginRole)}
              >
                <span className="mb-2">{role.icon}</span>
                <span className="text-sm font-medium">{role.label}</span>
              </button>
            ))}
          </div>
          
          <div className="mb-4">
            <Input
              type="email"
              label="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail size={20} />}
              placeholder="Enter your email"
              fullWidth
              required
            />
          </div>
          
          <div className="mb-6">
            <Input
              type="password"
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<Lock size={20} />}
              placeholder="Enter your password"
              fullWidth
              required
            />
          </div>
          
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                Remember me
              </label>
            </div>
            
            <div className="text-sm">
              <Link to="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
                Forgot your password?
              </Link>
            </div>
          </div>
          
          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={loading}
            fullWidth
          >
            Sign in
          </Button>
        </div>
      </form>
      
      {/* Demo Credentials */}
      <div className="mt-6 bg-blue-50 p-4 rounded-md">
        <h3 className="text-sm font-medium text-blue-800 mb-2">Demo Credentials</h3>
        <div className="space-y-2 text-xs text-blue-700">
          <p><strong>Student:</strong> john.smith@school.edu</p>
          <p><strong>Teacher:</strong> jessica.brown@school.edu</p>
          <p><strong>Admin:</strong> sarah.wilson@school.edu</p>
          <p className="italic text-blue-600">Use any password for demo purposes</p>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Login;