
import React, { useEffect } from 'react';
import { Pencil, Trash2, Loader, RefreshCw, AlertTriangle } from 'lucide-react';
import { usePosterStore } from '@/store/usePosterStore';
import { Poster } from '@/types';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const PosterList = () => {
  const { toast } = useToast();
  const { posters, deletePoster, isLoading, fetchPosters, error, retryCount } = usePosterStore();
  
  useEffect(() => {
    // Load posters when component mounts
    fetchPosters();
  }, [fetchPosters]);
  
  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      try {
        await deletePoster(id);
        toast({
          title: 'Poster Deleted',
          description: `"${title}" has been removed.`,
        });
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to delete poster. Please try again.',
          variant: 'destructive',
        });
      }
    }
  };
  
  const handleEdit = (poster: Poster) => {
    toast({
      title: 'Edit Feature',
      description: 'In a full implementation, this would open an edit form.',
    });
  };

  const handleRefresh = async () => {
    toast({
      title: 'Refreshing',
      description: 'Fetching the latest posters from the database.',
    });
    await fetchPosters(true); // Force retry
  };
  
  if (isLoading && posters.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader className="animate-spin mr-2" />
        <p>Loading posters...</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Manage Posters</h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefresh}
          disabled={isLoading}
          className="flex items-center"
        >
          {isLoading ? (
            <>
              <Loader size={16} className="mr-2 animate-spin" />
              Refreshing...
            </>
          ) : (
            <>
              <RefreshCw size={16} className="mr-2" />
              Refresh
            </>
          )}
        </Button>
      </div>
      
      {error && (
        <Alert variant="destructive" className="mb-4">
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
            {retryCount > 2 && (
              <p className="text-xs mt-1">
                Tip: This could be due to Supabase storage configuration. The app will continue to attempt to create the required storage bucket.
              </p>
            )}
          </AlertDescription>
        </Alert>
      )}
      
      {posters.length === 0 && !error ? (
        <p className="text-prosterz-600 py-4">No posters available. Add your first poster!</p>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          {!isLoading && !error && posters.length > 0 && (
            <table className="w-full">
              <thead className="bg-prosterz-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-prosterz-600">Image</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-prosterz-600">Title</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-prosterz-600">Category</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-prosterz-600">A3 Price</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-prosterz-600">A4 Price</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-prosterz-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-prosterz-100">
                {posters.map((poster) => (
                  <tr key={poster.id} className="hover:bg-prosterz-50">
                    <td className="px-4 py-3">
                      <div className="w-12 h-12 bg-prosterz-100 rounded overflow-hidden">
                        <img 
                          src={poster.image} 
                          alt={poster.title} 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.onerror = null; // Prevent infinite loop
                            console.error(`Failed to load image: ${poster.image}`);
                            target.src = '/placeholder.svg';
                          }}
                        />
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">{poster.title}</td>
                    <td className="px-4 py-3 text-sm">{poster.category}</td>
                    <td className="px-4 py-3 text-sm">{formatPrice(poster.priceA3)}</td>
                    <td className="px-4 py-3 text-sm">{formatPrice(poster.priceA4)}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(poster)}
                          className="h-8 w-8 text-prosterz-600 hover:text-prosterz-900"
                        >
                          <Pencil size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(poster.id, poster.title)}
                          className="h-8 w-8 text-prosterz-600 hover:text-destructive"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default PosterList;
