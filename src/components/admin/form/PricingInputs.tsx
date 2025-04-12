
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
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="priceA3">A3 Price (₹)</Label>
        <Input
          id="priceA3"
          type="number"
          min={1}
          value={priceA3}
          onChange={(e) => onPriceA3Change(Number(e.target.value))}
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
          onChange={(e) => onPriceA4Change(Number(e.target.value))}
          required
        />
      </div>
    </div>
  );
};

export default PricingInputs;
