
import React from 'react';
import { Minus, Plus, Trash } from 'lucide-react';
import { CartItem as CartItemType } from '@/types';
import { useCartStore } from '@/store/useCartStore';
import { formatPrice } from '@/lib/utils';

interface CartItemProps {
  item: CartItemType;
}

const CartItem = ({ item }: CartItemProps) => {
  const { updateQuantity, removeFromCart } = useCartStore();
  const { poster, size, quantity } = item;
  
  const price = size === 'A3' ? poster.priceA3 : poster.priceA4;
  const totalPrice = price * quantity;
  
  const handleIncrement = () => {
    updateQuantity(poster.id, size, quantity + 1);
  };
  
  const handleDecrement = () => {
    if (quantity > 1) {
      updateQuantity(poster.id, size, quantity - 1);
    }
  };
  
  const handleRemove = () => {
    removeFromCart(poster.id, size);
  };
  
  return (
    <div className="flex border-b py-4">
      <div className="w-20 h-20 bg-prosterz-100 overflow-hidden rounded">
        <img 
          src={poster.image} 
          alt={poster.title} 
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/placeholder.svg';
          }}
        />
      </div>
      
      <div className="ml-4 flex-grow">
        <h3 className="font-medium">{poster.title}</h3>
        <p className="text-sm text-prosterz-600">Size: {size}</p>
        <p className="text-sm font-medium">{formatPrice(price)}</p>
      </div>
      
      <div className="flex flex-col items-center justify-between">
        <div className="flex items-center space-x-2">
          <button
            onClick={handleDecrement}
            className="btn-icon !p-1"
            disabled={quantity <= 1}
          >
            <Minus size={14} />
          </button>
          <span className="w-8 text-center">{quantity}</span>
          <button onClick={handleIncrement} className="btn-icon !p-1">
            <Plus size={14} />
          </button>
        </div>
        
        <div className="text-right">
          <p className="font-medium">{formatPrice(totalPrice)}</p>
          <button
            onClick={handleRemove}
            className="text-prosterz-600 hover:text-destructive text-sm flex items-center mt-1"
          >
            <Trash size={14} className="mr-1" />
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
