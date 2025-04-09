
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Instagram } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

const LoginForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login } = useAuthStore();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate login API call
    setTimeout(() => {
      // For demo, let's check for admin login
      if (email === 'admin@prosterz.com' && password === 'admin123') {
        login({
          id: '1',
          name: 'Admin',
          email: 'admin@prosterz.com',
          role: 'admin',
        });
        toast({
          title: 'Welcome back, Admin!',
          description: 'You have successfully logged in.',
        });
        navigate('/admin');
      } else if (email && password) {
        // Regular user login for demo
        login({
          id: '2',
          name: 'User',
          email,
          role: 'user',
        });
        toast({
          title: 'Welcome back!',
          description: 'You have successfully logged in.',
        });
        navigate('/');
      } else {
        toast({
          title: 'Login Failed',
          description: 'Please check your credentials and try again.',
          variant: 'destructive',
        });
      }
      
      setIsLoading(false);
    }, 1000);
  };
  
  return (
    <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
      <h2 className="text-2xl font-bold text-center mb-6">Login to Your Account</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-prosterz-700 mb-1">
            Email
          </label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
          />
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-prosterz-700 mb-1">
            Password
          </label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
        </div>
        
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Login'}
        </Button>
      </form>
      
      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-prosterz-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-prosterz-500">Or continue with</span>
          </div>
        </div>
        
        <Button 
          variant="outline" 
          className="w-full mt-4 flex items-center justify-center" 
          onClick={() => toast({
            title: 'Instagram Login',
            description: 'This feature would be implemented with Instagram OAuth in production.',
          })}
        >
          <Instagram size={18} className="mr-2" />
          Login with Instagram
        </Button>
      </div>
      
      <p className="mt-6 text-center text-sm text-prosterz-600">
        Don't have an account?{' '}
        <Button variant="link" className="p-0" onClick={() => navigate('/signup')}>
          Sign up
        </Button>
      </p>
    </div>
  );
};

export default LoginForm;
