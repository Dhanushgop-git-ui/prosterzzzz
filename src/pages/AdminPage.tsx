
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, List, Loader } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import PosterForm from '@/components/admin/PosterForm';
import PosterList from '@/components/admin/PosterList';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { User } from '@/types';
import { usePosterStore } from '@/store/usePosterStore';

const AdminPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAdmin } = useAuthStore();
  const [activeTab, setActiveTab] = useState('list');
  
  const { fetchPosters, isLoading, error, posters } = usePosterStore();
  
  // Fetch posters on load
  useEffect(() => {
    fetchPosters();
  }, [fetchPosters]);
  
  // Automatically log in as admin for demo purposes
  useEffect(() => {
    if (!user) {
      // For demonstration, automatically log in as admin
      const admin: User = {
        id: 'admin1',
        name: 'Admin User',
        email: 'admin@prosterz.com',
        role: 'admin'
      };
      
      useAuthStore.getState().login(admin);
      toast({
        title: "Admin Demo Mode",
        description: "You've been automatically logged in as admin for demonstration purposes.",
      });
    }
  }, [user, toast]);
  
  // Show error toast if fetching posters fails
  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive"
      });
    }
  }, [error, toast]);
  
  if (!isAdmin()) {
    return (
      <Layout>
        <div className="container mx-auto py-12 px-4 text-center">
          <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
          <p className="mb-6">You need admin permissions to access this page.</p>
          <Button onClick={() => navigate('/')}>Back to Home</Button>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="container mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        
        {isLoading && posters.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <Loader size={32} className="animate-spin text-prosterz-600 mr-2" />
            <span>Loading posters...</span>
          </div>
        ) : (
          <Tabs defaultValue="list" value={activeTab} onValueChange={setActiveTab}>
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
                <PosterForm onComplete={() => {
                  setActiveTab('list');
                  // Refresh the list of posters
                  fetchPosters();
                }} />
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </Layout>
  );
};

export default AdminPage;
