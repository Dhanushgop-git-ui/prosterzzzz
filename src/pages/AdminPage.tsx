
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, List } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import PosterForm from '@/components/admin/PosterForm';
import PosterList from '@/components/admin/PosterList';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const AdminPage = () => {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuthStore();
  const [activeTab, setActiveTab] = useState('list');
  
  useEffect(() => {
    // Check if user is admin
    if (!user || !isAdmin()) {
      navigate('/login');
    }
  }, [user, isAdmin, navigate]);
  
  if (!user || !isAdmin()) {
    return null; // Will redirect in the useEffect
  }
  
  return (
    <Layout>
      <div className="container mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-8">
            <TabsTrigger value="list" className="flex items-center">
              <List size={16} className="mr-2" />
              Manage Posters
            </TabsTrigger>
            <TabsTrigger value="add" className="flex items-center">
              <Plus size={16} className="mr-2" />
              Add Poster
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="list">
            <PosterList />
          </TabsContent>
          
          <TabsContent value="add">
            <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-6">Add New Poster</h2>
              <PosterForm onComplete={() => setActiveTab('list')} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default AdminPage;
