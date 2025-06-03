// src/components/ui/SkeletonCard.tsx
const SkeletonCard: React.FC = () => {
  return (
    <div className="bg-card rounded-lg shadow border border-border p-6 animate-pulse">
      <div className="flex items-center justify-between mb-2">
        <div className="h-6 bg-muted rounded w-20"></div>
        <div className="h-6 bg-muted rounded w-16"></div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <div className="h-4 bg-muted rounded w-12"></div>
          <div className="h-4 bg-muted rounded w-24"></div>
        </div>
        
        <div className="flex justify-between">
          <div className="h-4 bg-muted rounded w-16"></div>
          <div className="h-4 bg-muted rounded w-20"></div>
        </div>
        
        <div className="flex justify-between">
          <div className="h-4 bg-muted rounded w-14"></div>
          <div className="h-4 bg-muted rounded w-28"></div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;
