
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag, Sparkle, Star, Truck } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import PosterGrid from '@/components/posters/PosterGrid';
import { usePosterStore } from '@/store/usePosterStore';
import { Button } from '@/components/ui/button';

const Index = () => {
  const featuredPosters = usePosterStore((state) => state.getFeaturedPosters());
  
  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-prosterz-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                Transform Your Space with Style
              </h1>
              <p className="text-lg md:text-xl mb-6 text-prosterz-200">
                Premium quality posters that reflect your personality and elevate your surroundings.
              </p>
              <div className="flex space-x-4">
                <Button asChild size="lg" className="bg-white text-prosterz-900 hover:bg-prosterz-100">
                  <Link to="/posters">Shop Now</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                  <Link to="/about">Learn More</Link>
                </Button>
              </div>
            </div>
            <div className="md:w-1/2 grid grid-cols-2 gap-4">
              {featuredPosters.slice(0, 4).map((poster, index) => (
                <div key={poster.id} className={`poster-card !bg-prosterz-800 ${index % 3 === 0 ? 'col-span-2' : ''}`}>
                  <img
                    src={poster.image}
                    alt={poster.title}
                    className="w-full h-full object-cover rounded-lg"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder.svg';
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Prosterz?</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-prosterz-50 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Sparkle size={24} className="text-prosterz-900" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Premium Quality</h3>
              <p className="text-prosterz-600">
                High-quality prints on premium paper that preserve color vibrancy and details.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-prosterz-50 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Truck size={24} className="text-prosterz-900" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
              <p className="text-prosterz-600">
                Quick shipping with secure packaging to ensure your posters arrive in perfect condition.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-prosterz-50 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Star size={24} className="text-prosterz-900" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Unique Designs</h3>
              <p className="text-prosterz-600">
                Curated collection of eye-catching designs to suit various tastes and preferences.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Posters Section */}
      <section className="py-16 bg-prosterz-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Featured Posters</h2>
            <Link 
              to="/posters" 
              className="flex items-center text-prosterz-900 font-medium hover:text-prosterz-700"
            >
              View All <ArrowRight size={18} className="ml-2" />
            </Link>
          </div>
          
          <PosterGrid posters={featuredPosters} />
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-16 bg-prosterz-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Transform Your Space?</h2>
          <p className="text-lg mb-8 text-prosterz-200 max-w-2xl mx-auto">
            Explore our collection of premium posters and find the perfect match for your style.
          </p>
          <Button asChild size="lg" className="bg-white text-prosterz-900 hover:bg-prosterz-100">
            <Link to="/posters" className="flex items-center">
              <ShoppingBag size={20} className="mr-2" /> Shop Collection
            </Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
