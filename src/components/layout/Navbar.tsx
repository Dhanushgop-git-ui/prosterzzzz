
import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, User, LogIn, LogOut } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const totalItems = useCartStore((state) => state.getTotalItems());
  const { user, logout } = useAuthStore();

  return (
    <header className="bg-white border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-prosterz-900">
          PROSTERZ
        </Link>
        
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-prosterz-800 hover:text-prosterz-900">
            Home
          </Link>
          <Link to="/posters" className="text-prosterz-800 hover:text-prosterz-900">
            Shop
          </Link>
          <Link to="/about" className="text-prosterz-800 hover:text-prosterz-900">
            About
          </Link>
          <Link to="/contact" className="text-prosterz-800 hover:text-prosterz-900">
            Contact
          </Link>
        </nav>
        
        <div className="flex items-center space-x-4">
          <Link to="/cart" className="btn-icon relative">
            <ShoppingCart size={20} />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-prosterz-900 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>
          
          {user ? (
            <div className="flex items-center space-x-2">
              {user.role === 'admin' && (
                <Link to="/admin" className="text-sm text-prosterz-800 hover:text-prosterz-900">
                  Admin
                </Link>
              )}
              <Button variant="ghost" size="sm" onClick={logout} className="flex items-center space-x-1">
                <LogOut size={16} />
                <span>Logout</span>
              </Button>
            </div>
          ) : (
            <Link to="/login" className="flex items-center space-x-1 text-prosterz-800 hover:text-prosterz-900">
              <LogIn size={16} />
              <span>Login</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
