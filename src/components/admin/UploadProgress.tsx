
import React from 'react';
import { CheckCircle2 } from 'lucide-react';

interface UploadProgressProps {
  progress: number;
  completedPosters: string[];
}

const UploadProgress: React.FC<UploadProgressProps> = ({ progress, completedPosters }) => {
  if (completedPosters.length === 0) return null;

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium">Uploaded posters:</h3>
      <ul className="space-y-1 max-h-60 overflow-y-auto text-sm">
        {completedPosters.map((title, index) => (
          <li key={index} className="flex items-center">
            <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
            {title}
          </li>
        ))}
      </ul>
      
      {progress > 0 && progress < 100 && (
        <div className="w-full bg-prosterz-100 rounded-full h-2.5">
          <div 
            className="bg-prosterz-600 h-2.5 rounded-full transition-all duration-300" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}
    </div>
  );
};

export default UploadProgress;

