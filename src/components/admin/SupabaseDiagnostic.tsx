
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, XCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';

const SupabaseDiagnostic = () => {
  const [authStatus, setAuthStatus] = useState<'checking' | 'authenticated' | 'unauthenticated'>('checking');
  const [userId, setUserId] = useState<string | null>(null);
  const [dbAccess, setDbAccess] = useState<'checking' | 'success' | 'error'>('checking');
  const [dbError, setDbError] = useState<string | null>(null);
  const [storageAccess, setStorageAccess] = useState<'checking' | 'success' | 'error'>('checking');
  const [storageError, setStorageError] = useState<string | null>(null);
  const { user } = useAuthStore();

  useEffect(() => {
    checkAuth();
    checkDatabaseAccess();
    checkStorageAccess();
  }, []);

  const checkAuth = async () => {
    try {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Auth check error:', error);
        setAuthStatus('unauthenticated');
        return;
      }
      
      if (data.session) {
        setAuthStatus('authenticated');
        setUserId(data.session.user.id);
      } else {
        setAuthStatus('unauthenticated');
      }
    } catch (err) {
      console.error('Error checking auth:', err);
      setAuthStatus('unauthenticated');
    }
  };

  const checkDatabaseAccess = async () => {
    try {
      setDbAccess('checking');
      const { data, error } = await supabase
        .from('posters')
        .select('count(*)')
        .single();
        
      if (error) {
        console.error('Database access check error:', error);
        setDbAccess('error');
        setDbError(`${error.message}${error.details ? ': ' + error.details : ''}`);
        return;
      }
      
      setDbAccess('success');
      setDbError(null);
    } catch (err) {
      console.error('Error checking database access:', err);
      setDbAccess('error');
      setDbError(err instanceof Error ? err.message : 'Unknown error checking database access');
    }
  };

  const checkStorageAccess = async () => {
    try {
      setStorageAccess('checking');
      const { data: buckets, error } = await supabase.storage.listBuckets();
      
      if (error) {
        console.error('Storage access check error:', error);
        setStorageAccess('error');
        setStorageError(`${error.message}`);
        return;
      }
      
      const proterzBucket = buckets.find(b => b.name === 'proterz');
      
      if (!proterzBucket) {
        setStorageAccess('error');
        setStorageError("'proterz' bucket not found");
        return;
      }
      
      setStorageAccess('success');
      setStorageError(null);
    } catch (err) {
      console.error('Error checking storage access:', err);
      setStorageAccess('error');
      setStorageError(err instanceof Error ? err.message : 'Unknown error checking storage access');
    }
  };

  const runAllChecks = () => {
    checkAuth();
    checkDatabaseAccess();
    checkStorageAccess();
  };

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Supabase Diagnostic</CardTitle>
        <CardDescription>Check your connection to Supabase services</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {authStatus === 'checking' ? (
              <Loader2 className="h-5 w-5 text-orange-500 animate-spin mr-2" />
            ) : authStatus === 'authenticated' ? (
              <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
            ) : (
              <XCircle className="h-5 w-5 text-red-500 mr-2" />
            )}
            <span>Authentication</span>
          </div>
          <div className="text-sm text-gray-500">
            {authStatus === 'checking' ? 'Checking...' : 
             authStatus === 'authenticated' ? `Authenticated as: ${userId}` : 
             'Not authenticated'}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {dbAccess === 'checking' ? (
              <Loader2 className="h-5 w-5 text-orange-500 animate-spin mr-2" />
            ) : dbAccess === 'success' ? (
              <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
            ) : (
              <XCircle className="h-5 w-5 text-red-500 mr-2" />
            )}
            <span>Database Access</span>
          </div>
          <div className="text-sm text-gray-500">
            {dbAccess === 'checking' ? 'Checking...' : 
             dbAccess === 'success' ? 'Connected' : 
             'Error'}
          </div>
        </div>
        {dbError && (
          <div className="ml-7 text-sm text-red-500">
            {dbError}
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {storageAccess === 'checking' ? (
              <Loader2 className="h-5 w-5 text-orange-500 animate-spin mr-2" />
            ) : storageAccess === 'success' ? (
              <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
            ) : (
              <XCircle className="h-5 w-5 text-red-500 mr-2" />
            )}
            <span>Storage Access</span>
          </div>
          <div className="text-sm text-gray-500">
            {storageAccess === 'checking' ? 'Checking...' : 
             storageAccess === 'success' ? 'Connected' : 
             'Error'}
          </div>
        </div>
        {storageError && (
          <div className="ml-7 text-sm text-red-500">
            {storageError}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          variant="outline" 
          className="w-full"
          onClick={runAllChecks}
        >
          Run Diagnostics
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SupabaseDiagnostic;
