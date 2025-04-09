
import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { usePosterStore } from '@/store/usePosterStore';
import { Poster } from '@/types';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const PosterList = () => {
  const { toast } = useToast();
  const { posters, deletePoster } = usePosterStore();
  
  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      deletePoster(id);
      toast({
        title: 'Poster Deleted',
        description: `"${title}" has been removed.`,
      });
    }
  };
  
  const handleEdit = (poster: Poster) => {
    toast({
      title: 'Edit Feature',
      description: 'In a full implementation, this would open an edit form.',
    });
  };
  
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Manage Posters</h2>
      
      {posters.length === 0 ? (
        <p className="text-prosterz-600 py-4">No posters available. Add your first poster!</p>
      ) : (
        <div className="border rounded-lg overflow-hidden">
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
        </div>
      )}
    </div>
  );
};

export default PosterList;
