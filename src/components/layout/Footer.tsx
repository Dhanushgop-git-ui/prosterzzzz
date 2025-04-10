
import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-prosterz-900 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">PROSTERZ</h3>
            <p className="text-prosterz-300 mb-4">
              Premium quality posters that transform any space into a reflection of your style.
            </p>
            <div className="flex space-x-4">
              <a href="https://instagram.com/prosterzzzz" className="text-white hover:text-prosterz-300" target="_blank" rel="noreferrer">
                <Instagram size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Shop</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/posters" className="text-prosterz-300 hover:text-white">
                  All Posters
                </Link>
              </li>
              <li>
                <Link to="/posters/motivational" className="text-prosterz-300 hover:text-white">
                  Motivational
                </Link>
              </li>
              <li>
                <Link to="/posters/abstract" className="text-prosterz-300 hover:text-white">
                  Abstract
                </Link>
              </li>
              <li>
                <Link to="/posters/nature" className="text-prosterz-300 hover:text-white">
                  Nature
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Help</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/faq" className="text-prosterz-300 hover:text-white">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="text-prosterz-300 hover:text-white">
                  Shipping
                </Link>
              </li>
              <li>
                <Link to="/returns" className="text-prosterz-300 hover:text-white">
                  Returns
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-prosterz-300 hover:text-white">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
            <p className="text-prosterz-300 mb-4">
              Follow us on Instagram for updates and inspiration.
            </p>
            <div className="bg-white p-2 rounded-md">
              <img src="/lovable-uploads/fd7edbe1-67ec-4bf6-b8db-370b59439602.png" alt="Instagram QR Code" className="w-32 h-32 mx-auto" />
              <p className="text-prosterz-900 text-center text-sm mt-2">@PROSTERZZZZ</p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-prosterz-800 mt-8 pt-8 text-center text-prosterz-400">
          <p>&copy; {new Date().getFullYear()} Prosterz. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
