
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Instagram } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

const SignupForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login } = useAuthStore();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate signup API call
    setTimeout(() => {
      if (name && email && password) {
        // Create a new user for demo
        login({
          id: Date.now().toString(),
          name,
          email,
          role: 'user',
        });
        toast({
          title: 'Account created!',
          description: 'You have successfully signed up.',
        });
        navigate('/');
      } else {
        toast({
          title: 'Signup Failed',
          description: 'Please fill in all required fields.',
          variant: 'destructive',
        });
      }
      
      setIsLoading(false);
    }, 1000);
  };
  
  return (
    <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
      <h2 className="text-2xl font-bold text-center mb-6">Create an Account</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-prosterz-700 mb-1">
            Full Name
          </label>
          <Input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            required
          />
        </div>
        
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
            minLength={6}
          />
        </div>
        
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Creating account...' : 'Sign Up'}
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
            title: 'Instagram Signup',
            description: 'This feature would be implemented with Instagram OAuth in production.',
          })}
        >
          <Instagram size={18} className="mr-2" />
          Sign up with Instagram
        </Button>
      </div>
      
      <p className="mt-6 text-center text-sm text-prosterz-600">
        Already have an account?{' '}
        <Button variant="link" className="p-0" onClick={() => navigate('/login')}>
          Login
        </Button>
      </p>
    </div>
  );
};

export default SignupForm;
