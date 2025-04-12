
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface PricingInputsProps {
  priceA3: number;
  priceA4: number;
  onPriceA3Change: (price: number) => void;
  onPriceA4Change: (price: number) => void;
}

const PricingInputs = ({ 
  priceA3, 
  priceA4, 
  onPriceA3Change, 
  onPriceA4Change 
}: PricingInputsProps) => {
  
  const handlePriceChange = (setter: (price: number) => void, value: string) => {
    const numValue = parseInt(value, 10);
    // Ensure we have a valid positive number
    setter(isNaN(numValue) || numValue < 1 ? 1 : numValue);
  };
  
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="priceA3">A3 Price (₹)</Label>
        <Input
          id="priceA3"
          type="number"
          min={1}
          value={priceA3}
          onChange={(e) => handlePriceChange(onPriceA3Change, e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="priceA4">A4 Price (₹)</Label>
        <Input
          id="priceA4"
          type="number"
          min={1}
          value={priceA4}
          onChange={(e) => handlePriceChange(onPriceA4Change, e.target.value)}
          required
        />
      </div>
    </div>
  );
};

export default PricingInputs;
