import { Flame } from 'lucide-react';

const StreakBadge = ({ currentStreak, className = '' }) => {
  const isActive = currentStreak > 0;
  
  return (
    <div className={`inline-flex items-center gap-1.5 rounded-full px-2 py-1 ${isActive ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-500'} ${className}`}>
      <Flame size={16} className={isActive ? 'text-orange-500 animate-pulse' : 'text-gray-400'} />
      <span className="text-sm font-bold">{currentStreak}</span>
    </div>
  );
};

export default StreakBadge;
