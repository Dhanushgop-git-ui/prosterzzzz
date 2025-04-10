
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, User, LogIn, LogOut, Menu, X } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const Navbar = () => {
  const totalItems = useCartStore((state) => state.getTotalItems());
  const { user, logout, isAdmin } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
          {user && isAdmin() && (
            <Link to="/admin" className="text-prosterz-800 hover:text-prosterz-900 font-medium">
              Admin
            </Link>
          )}
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
              {isAdmin() && (
                <Link to="/admin" className="text-sm text-prosterz-800 hover:text-prosterz-900 md:hidden">
                  Admin
                </Link>
              )}
              <Button variant="ghost" size="sm" onClick={logout} className="flex items-center space-x-1">
                <LogOut size={16} />
                <span className="hidden md:inline">Logout</span>
              </Button>
            </div>
          ) : (
            <Link to="/login" className="flex items-center space-x-1 text-prosterz-800 hover:text-prosterz-900">
              <LogIn size={16} />
              <span className="hidden md:inline">Login</span>
            </Link>
          )}
          
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu size={20} />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[240px]">
              <div className="flex flex-col space-y-4 mt-8">
                <Link to="/" className="text-prosterz-800 hover:text-prosterz-900 px-2 py-1.5">
                  Home
                </Link>
                <Link to="/posters" className="text-prosterz-800 hover:text-prosterz-900 px-2 py-1.5">
                  Shop
                </Link>
                <Link to="/about" className="text-prosterz-800 hover:text-prosterz-900 px-2 py-1.5">
                  About
                </Link>
                <Link to="/contact" className="text-prosterz-800 hover:text-prosterz-900 px-2 py-1.5">
                  Contact
                </Link>
                {user && isAdmin() && (
                  <Link to="/admin" className="text-prosterz-800 hover:text-prosterz-900 font-medium px-2 py-1.5">
                    Admin Dashboard
                  </Link>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
