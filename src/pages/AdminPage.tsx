
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, List, Loader, Upload, AlertTriangle, RefreshCw, ShieldAlert } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import PosterForm from '@/components/admin/PosterForm';
import PosterList from '@/components/admin/PosterList';
import BulkPosterUpload from '@/components/admin/BulkPosterUpload';
import SupabaseDiagnostic from '@/components/admin/SupabaseDiagnostic';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { User } from '@/types';
import { usePosterStore } from '@/store/usePosterStore';
import { supabase } from '@/integrations/supabase/client';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { checkStorageBucketExists } from '@/utils/imageUploader';

// Constants
const BUCKET_NAME = 'proterz';

const AdminPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAdmin } = useAuthStore();
  const [activeTab, setActiveTab] = useState('list');
  
  const { fetchPosters, isLoading, error, posters, setError } = usePosterStore();
  const [storageBucketChecked, setStorageBucketChecked] = useState(false);
  const [storageError, setStorageError] = useState<string | null>(null);
  
  // Check for bucket existence on component mount - no longer tries to create
  useEffect(() => {
    async function checkBucket() {
      try {
        // Just attempt to list buckets first to check if bucket exists
        const { data: buckets, error: listError } = await supabase.storage.listBuckets();
        
        if (listError) {
          console.error('Error listing buckets:', listError);
          setStorageError(`Error accessing Supabase storage: ${listError.message}`);
          return;
        }
        
        // Check if our bucket exists in the list
        const bucketExists = buckets.some(bucket => bucket.name === BUCKET_NAME);
        
        if (bucketExists) {
          console.log(`Bucket ${BUCKET_NAME} exists - using existing configuration`);
          setStorageBucketChecked(true);
          setStorageError(null);
          return;
        }
        
        // If bucket doesn't exist, show error
        console.warn(`Bucket ${BUCKET_NAME} does not exist`);
        setStorageBucketChecked(true);
        setStorageError(`Storage bucket '${BUCKET_NAME}' does not exist. Please create it manually in the Supabase dashboard.`);
      } catch (err) {
        console.error('Error checking bucket existence:', err);
        setStorageError(`Error verifying storage: ${err instanceof Error ? err.message : 'Unknown error'}`);
      }
    }
    
    checkBucket();
  }, []);
  
  // Check storage bucket - no longer tries to create/update
  useEffect(() => {
    const checkStorageBucket = async () => {
      if (storageBucketChecked) return;
      
      try {
        console.log('AdminPage: Checking if storage bucket exists');
        const exists = await checkStorageBucketExists();
        setStorageBucketChecked(true);
        
        if (exists) {
          console.log('AdminPage: Storage bucket confirmed');
          setStorageError(null);
        } else {
          console.warn('AdminPage: Storage bucket not found');
          setStorageError(`Storage bucket '${BUCKET_NAME}' not found. Please create it manually in the Supabase dashboard.`);
        }
      } catch (err) {
        console.error('AdminPage: Error checking bucket:', err);
        setStorageError('Error verifying storage. Please try again later or contact an administrator.');
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
      description: "Checking storage bucket and fetching the latest posters."
    });
    
    // Reset states
    setStorageError(null);
    setStorageBucketChecked(false);
    
    // Try to verify the bucket exists using listBuckets
    try {
      const { data: buckets, error: listError } = await supabase.storage.listBuckets();
      
      if (listError) {
        console.error('Error listing buckets during refresh:', listError);
        setStorageError(`Error accessing Supabase storage: ${listError.message}`);
        return;
      }
      
      // Check if our bucket exists in the list
      const bucketExists = buckets.some(bucket => bucket.name === BUCKET_NAME);
      
      if (bucketExists) {
        console.log(`Bucket ${BUCKET_NAME} exists - using existing configuration`);
        setStorageBucketChecked(true);
        setStorageError(null);
      } else {
        console.warn(`Bucket ${BUCKET_NAME} not found`);
        setStorageBucketChecked(true);
        setStorageError(`Storage bucket '${BUCKET_NAME}' not found. Please create it manually in the Supabase dashboard.`);
      }
    } catch (err) {
      console.error('Error during refresh bucket check:', err);
      setStorageError('Error verifying storage. Please try again later.');
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
        
        {/* Specific storage error message - updated for custom policies */}
        {storageError && (
          <Alert variant="destructive" className="mb-6">
            <ShieldAlert className="h-4 w-4" />
            <AlertTitle>Storage Configuration Notice</AlertTitle>
            <AlertDescription className="flex flex-col gap-2">
              <p>{storageError}</p>
              <p className="text-sm mt-1">
                Note: If you've manually configured the '{BUCKET_NAME}' bucket with custom RLS policies, 
                you may see this message even though uploads will work for authorized users.
                The application needs the '{BUCKET_NAME}' bucket to exist but will respect your custom permissions.
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRefresh} 
                disabled={isLoading}
                className="mt-2 w-fit"
              >
                {isLoading ? 'Checking again...' : 'Check Again'}
              </Button>
            </AlertDescription>
          </Alert>
        )}
        
        {/* General error message */}
        {error && !error.includes('Storage configuration') && (
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
              <TabsTrigger value="diagnostics" className="flex items-center">
                <AlertTriangle size={16} className="mr-2" />
                Diagnostics
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
            
            <TabsContent value="diagnostics">
              <div className="max-w-xl mx-auto">
                <SupabaseDiagnostic />
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </Layout>
  );
};

export default AdminPage;
