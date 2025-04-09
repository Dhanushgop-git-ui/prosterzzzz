
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { usePosterStore } from '@/store/usePosterStore';
import { useCartStore } from '@/store/useCartStore';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const PosterDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const poster = usePosterStore((state) => 
    state.posters.find((p) => p.id === id)
  );
  
  const { addToCart } = useCartStore();
  const [selectedSize, setSelectedSize] = useState<'A3' | 'A4'>('A4');
  
  if (!poster) {
    return (
      <Layout>
        <div className="container mx-auto py-12 px-4 text-center">
          <h1 className="text-2xl font-bold mb-4">Poster Not Found</h1>
          <p className="mb-8">The poster you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate('/posters')}>Back to Shop</Button>
        </div>
      </Layout>
    );
  }
  
  const handleAddToCart = () => {
    addToCart(poster, selectedSize);
    toast({
      title: 'Added to Cart',
      description: `${poster.title} (${selectedSize}) has been added to your cart.`,
    });
  };
  
  const price = selectedSize === 'A3' ? poster.priceA3 : poster.priceA4;
  
  return (
    <Layout>
      <div className="container mx-auto py-12 px-4">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-prosterz-50 rounded-lg overflow-hidden">
            <img
              src={poster.image}
              alt={poster.title}
              className="w-full h-full object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/placeholder.svg';
              }}
            />
          </div>
          
          <div>
            <div className="mb-6">
              <span className="category-pill">{poster.category}</span>
            </div>
            
            <h1 className="text-3xl font-bold mb-4">{poster.title}</h1>
            
            <p className="text-2xl font-semibold mb-6">{formatPrice(price)}</p>
            
            <div className="mb-8">
              <h3 className="text-lg font-medium mb-3">Select Size</h3>
              <RadioGroup value={selectedSize} onValueChange={(value) => setSelectedSize(value as 'A3' | 'A4')}>
                <div className="flex space-x-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="A4" id="A4" />
                    <Label htmlFor="A4" className="cursor-pointer">
                      A4 ({formatPrice(poster.priceA4)})
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="A3" id="A3" />
                    <Label htmlFor="A3" className="cursor-pointer">
                      A3 ({formatPrice(poster.priceA3)})
                    </Label>
                  </div>
                </div>
              </RadioGroup>
              <p className="text-sm text-prosterz-600 mt-2">
                A4: 210 × 297 mm (8.3 × 11.7 in) • A3: 297 × 420 mm (11.7 × 16.5 in)
              </p>
            </div>
            
            <Button 
              onClick={handleAddToCart} 
              className="w-full mb-4 bg-prosterz-900 hover:bg-prosterz-800 py-6"
            >
              <ShoppingCart size={20} className="mr-2" />
              Add to Cart
            </Button>
            
            <div className="border-t border-prosterz-200 pt-6 mt-6">
              <h3 className="text-lg font-medium mb-3">Description</h3>
              <p className="text-prosterz-600 mb-4">
                Elevate your space with this stunning {poster.category.toLowerCase()} poster. 
                Our premium posters are printed on high-quality paper that preserves color 
                vibrancy and ensures long-lasting beauty.
              </p>
              <ul className="space-y-2 text-prosterz-600">
                <li className="flex items-center">
                  <span className="w-2 h-2 rounded-full bg-prosterz-900 mr-2"></span>
                  High-quality print with excellent color reproduction
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 rounded-full bg-prosterz-900 mr-2"></span>
                  Printed on premium 200 gsm paper
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 rounded-full bg-prosterz-900 mr-2"></span>
                  Available in A4 and A3 sizes
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 rounded-full bg-prosterz-900 mr-2"></span>
                  Frame not included
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PosterDetail;
