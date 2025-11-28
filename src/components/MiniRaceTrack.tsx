import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';
import { User } from '@/store/useGameStore';

interface MiniRaceTrackProps {
  users: User[];
  maxPoints?: number;
}

const MiniRaceTrack = ({ users, maxPoints = 5000 }: MiniRaceTrackProps) => {
  const sortedUsers = [...users].sort((a, b) => b.points - a.points);
  const topUsers = sortedUsers.slice(0, 5);

  return (
    <div className="relative bg-gradient-to-r from-green-900/20 via-green-800/20 to-green-900/20 rounded-xl p-4 overflow-hidden">
      {/* Track decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-white/20 via-transparent to-white/20" />
        <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-white/20 via-transparent to-white/20" />
        {/* Track lines */}
        {[...Array(10)].map((_, i) => (
          <div 
            key={i} 
            className="absolute h-full w-0.5 bg-white/10"
            style={{ left: `${i * 10 + 5}%` }}
          />
        ))}
      </div>

      {/* Finish line */}
      <div className="absolute right-4 top-0 bottom-0 w-4 flex flex-col">
        {[...Array(8)].map((_, i) => (
          <div 
            key={i} 
            className={`flex-1 ${i % 2 === 0 ? 'bg-white/80' : 'bg-black/80'}`}
          />
        ))}
      </div>

      {/* Trophy at finish */}
      <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
        <Trophy className="w-6 h-6 text-yellow-400" />
      </div>

      {/* Track lanes */}
      <div className="relative space-y-2">
        {topUsers.map((user, index) => {
          const progress = Math.min((user.points / maxPoints) * 100, 95);
          const medals = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣'];

          return (
            <div key={user.id} className="relative h-10 bg-muted/30 rounded-lg overflow-hidden">
              {/* Lane markers */}
              <div className="absolute inset-0 flex items-center">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="flex-1 border-r border-dashed border-white/10 h-full" />
                ))}
              </div>

              {/* Car/Avatar */}
              <motion.div
                className="absolute top-1/2 transform -translate-y-1/2 flex items-center gap-1 z-10"
                initial={{ left: '0%' }}
                animate={{ left: `${progress}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
              >
                <span className="text-xs bg-background/80 px-1 rounded">{medals[index]}</span>
                <span className="text-xl">{user.avatar || '🏎️'}</span>
              </motion.div>

              {/* User info */}
              <div className="absolute right-12 top-1/2 transform -translate-y-1/2 text-xs text-right">
                <span className="font-medium">{user.name.split(' ')[0]}</span>
                <span className="ml-2 text-muted-foreground">{user.points}pts</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Start label */}
      <div className="absolute left-2 top-1/2 transform -translate-y-1/2 -rotate-90 text-xs text-muted-foreground font-bold">
        START
      </div>
    </div>
  );
};

export default MiniRaceTrack;
