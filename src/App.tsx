
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import Index from '@/pages/Index';
import LoginPage from '@/pages/LoginPage';
import SignupPage from '@/pages/SignupPage';
import NotFound from '@/pages/NotFound';
import AdminPage from '@/pages/AdminPage';
import PostersPage from '@/pages/PostersPage';
import PosterDetail from '@/pages/PosterDetail';
import CartPage from '@/pages/CartPage';
import WhatsAppButton from '@/components/shared/WhatsAppButton';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/posters" element={<PostersPage />} />
        <Route path="/poster/:id" element={<PosterDetail />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <WhatsAppButton />
      <Toaster />
    </BrowserRouter>
  );
};

export default App;
