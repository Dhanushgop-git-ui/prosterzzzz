
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, List, Loader, Upload, AlertTriangle, RefreshCw } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import PosterForm from '@/components/admin/PosterForm';
import PosterList from '@/components/admin/PosterList';
import BulkPosterUpload from '@/components/admin/BulkPosterUpload';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { User } from '@/types';
import { usePosterStore } from '@/store/usePosterStore';
import { supabase } from '@/integrations/supabase/client';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ensureStorageBucketExists } from '@/utils/imageUploader';

const AdminPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAdmin } = useAuthStore();
  const [activeTab, setActiveTab] = useState('list');
  
  const { fetchPosters, isLoading, error, posters, setError } = usePosterStore();
  const [storageBucketChecked, setStorageBucketChecked] = useState(false);
  
  // Check and create storage bucket if needed
  useEffect(() => {
    const checkStorageBucket = async () => {
      if (storageBucketChecked) return;
      
      try {
        console.log('AdminPage: Checking if storage bucket exists');
        await ensureStorageBucketExists();
        setStorageBucketChecked(true);
        console.log('AdminPage: Storage bucket confirmed');
      } catch (err) {
        console.error('AdminPage: Error checking/creating bucket:', err);
        // Don't set an error here, we'll let the poster fetch handle errors
      }
    };
    
    checkStorageBucket();
  }, [storageBucketChecked]);
  
  // Fetch posters on load
  useEffect(() => {
    const loadPosters = async () => {
      console.log('AdminPage: Loading posters');
      try {
        await fetchPosters();
      } catch (err) {
        console.error('Error loading posters:', err);
      }
    };
    
    loadPosters();
  }, [fetchPosters, storageBucketChecked]);
  
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
  
  const handleRefresh = async () => {
    toast({
      title: "Refreshing Data",
      description: "Fetching the latest posters from the database."
    });
    
    // Try to check storage bucket again
    if (!storageBucketChecked) {
      try {
        await ensureStorageBucketExists();
        setStorageBucketChecked(true);
      } catch (err) {
        console.error('Error during refresh bucket check:', err);
      }
    }
    
    // Then fetch posters, with forced retry
    await fetchPosters(true);
  };
  
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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader size={16} className="animate-spin" />
                Refreshing...
              </>
            ) : (
              <>
                <RefreshCw size={16} />
                Refresh Data
              </>
            )}
          </Button>
        </div>
        
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription className="flex flex-col gap-2">
              <p>{error}</p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRefresh} 
                disabled={isLoading}
                className="mt-2 w-fit"
              >
                {isLoading ? 'Trying again...' : 'Try Again'}
              </Button>
            </AlertDescription>
          </Alert>
        )}
        
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
              <TabsTrigger value="bulk" className="flex items-center">
                <Upload size={16} className="mr-2" />
                Bulk Upload
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
            
            <TabsContent value="bulk">
              <div className="max-w-xl mx-auto">
                <BulkPosterUpload />
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </Layout>
  );
};

export default AdminPage;
