
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import CartItem from '@/components/cart/CartItem';
import CartSummary from '@/components/cart/CartSummary';
import { useCartStore } from '@/store/useCartStore';
import { generateWhatsAppLink } from '@/lib/utils';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CartPage = () => {
  const navigate = useNavigate();
  const { items, getTotalPrice } = useCartStore();
  
  const handleCheckout = () => {
    const totalPrice = getTotalPrice();
    
    // Create a message for WhatsApp
    let message = "Hello! I'd like to order the following posters:\n\n";
    
    items.forEach((item) => {
      const itemPrice = item.size === 'A3' ? item.poster.priceA3 : item.poster.priceA4;
      message += `• ${item.poster.title} (${item.size}) - Quantity: ${item.quantity} - Price: ₹${itemPrice * item.quantity}\n`;
    });
    
    message += `\nTotal Amount: ₹${totalPrice}`;
    message += "\n\nPlease let me know how to proceed with the payment and delivery details.";
    
    // Open WhatsApp with the message
    window.open(generateWhatsAppLink(message), '_blank');
  };
  
  return (
    <Layout>
      <div className="container mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
        
        {items.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto w-16 h-16 rounded-full bg-prosterz-50 flex items-center justify-center mb-4">
              <ShoppingCart size={24} className="text-prosterz-400" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
            <p className="text-prosterz-600 mb-6">
              Looks like you haven't added any posters to your cart yet.
            </p>
            <Button onClick={() => navigate('/posters')}>Browse Posters</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">Cart Items</h2>
                <div className="divide-y">
                  {items.map((item) => (
                    <CartItem key={`${item.poster.id}-${item.size}`} item={item} />
                  ))}
                </div>
              </div>
            </div>
            
            <div>
              <CartSummary onCheckout={handleCheckout} />
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CartPage;
