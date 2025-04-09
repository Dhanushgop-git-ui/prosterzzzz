
import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface CartSummaryProps {
  onCheckout: () => void;
}

const CartSummary = ({ onCheckout }: CartSummaryProps) => {
  const { items, getTotalPrice } = useCartStore();
  const totalPrice = getTotalPrice();
  
  // Simplified shipping calculation
  const shipping = items.length > 0 ? 99 : 0;
  const grandTotal = totalPrice + shipping;
  
  return (
    <div className="bg-prosterz-50 rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
      
      <div className="space-y-3 mb-6">
        <div className="flex justify-between">
          <span className="text-prosterz-600">Subtotal</span>
          <span className="font-medium">{formatPrice(totalPrice)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-prosterz-600">Shipping</span>
          <span className="font-medium">{items.length > 0 ? formatPrice(shipping) : 'Free'}</span>
        </div>
        <div className="border-t pt-3 flex justify-between">
          <span className="font-semibold">Total</span>
          <span className="font-semibold">{formatPrice(grandTotal)}</span>
        </div>
      </div>
      
      <Button 
        onClick={onCheckout} 
        disabled={items.length === 0} 
        className="w-full bg-prosterz-900 hover:bg-prosterz-800 text-white py-3"
      >
        <ShoppingBag size={18} className="mr-2" />
        Proceed to WhatsApp
      </Button>
      
      <p className="mt-4 text-sm text-prosterz-600 text-center">
        We'll send your order details to our WhatsApp for payment and delivery.
      </p>
    </div>
  );
};

export default CartSummary;
