import { motion } from 'framer-motion';
import { useState } from 'react';
import { Lock, Star, Crown, Zap, Gift, Trophy, Target, Skull, Shield, Gem } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Stage {
  id: string;
  type: 'task' | 'quiz' | 'boss' | 'reward' | 'checkpoint';
  title: string;
  description: string;
  xpReward: number;
  coinsReward: number;
  completed: boolean;
  locked: boolean;
  current: boolean;
}

interface JourneyPathProps {
  stages: Stage[];
  onStageClick: (stage: Stage) => void;
  userAvatar?: string;
}

const stageIcons = {
  task: Target,
  quiz: Zap,
  boss: Skull,
  reward: Gift,
  checkpoint: Shield,
};

const stageColors = {
  task: 'from-blue-500 to-blue-600',
  quiz: 'from-purple-500 to-purple-600',
  boss: 'from-red-500 to-red-600',
  reward: 'from-yellow-500 to-yellow-600',
  checkpoint: 'from-green-500 to-green-600',
};

const JourneyPath = ({ stages, onStageClick, userAvatar = '🏎️' }: JourneyPathProps) => {
  const currentStageIndex = stages.findIndex(s => s.current);

  return (
    <div className="relative w-full overflow-x-auto pb-8">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-20 h-20 bg-primary/10 rounded-full blur-xl animate-pulse" />
        <div className="absolute top-40 right-20 w-32 h-32 bg-secondary/10 rounded-full blur-xl animate-pulse delay-1000" />
        <div className="absolute bottom-20 left-1/3 w-24 h-24 bg-accent/10 rounded-full blur-xl animate-pulse delay-500" />
        
        {/* Trees */}
        {[...Array(8)].map((_, i) => (
          <div key={i} className="absolute text-4xl opacity-30" style={{ 
            left: `${10 + i * 12}%`, 
            top: `${20 + (i % 2) * 40}%`,
            transform: `rotate(${(i % 2) * 10 - 5}deg)`
          }}>
            🌲
          </div>
        ))}
        
        {/* Clouds */}
        {[...Array(5)].map((_, i) => (
          <motion.div 
            key={`cloud-${i}`}
            className="absolute text-3xl opacity-20"
            initial={{ x: 0 }}
            animate={{ x: [0, 20, 0] }}
            transition={{ duration: 10 + i * 2, repeat: Infinity, ease: "linear" }}
            style={{ 
              left: `${5 + i * 20}%`, 
              top: `${5 + (i % 3) * 10}%` 
            }}
          >
            ☁️
          </motion.div>
        ))}
      </div>

      {/* Path Container */}
      <div className="relative min-w-[900px] py-16 px-8">
        {/* The winding path */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 900 400" preserveAspectRatio="none">
          <defs>
            <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
              <stop offset="50%" stopColor="hsl(var(--secondary))" stopOpacity="0.3" />
              <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity="0.3" />
            </linearGradient>
          </defs>
          <path
            d="M 50 200 Q 150 100 250 200 T 450 200 T 650 200 T 850 200"
            fill="none"
            stroke="url(#pathGradient)"
            strokeWidth="40"
            strokeLinecap="round"
          />
          <path
            d="M 50 200 Q 150 100 250 200 T 450 200 T 650 200 T 850 200"
            fill="none"
            stroke="hsl(var(--border))"
            strokeWidth="4"
            strokeDasharray="10 10"
          />
        </svg>

        {/* Stages */}
        <div className="relative flex items-center justify-between" style={{ minHeight: '300px' }}>
          {stages.map((stage, index) => {
            const Icon = stageIcons[stage.type];
            const isEven = index % 2 === 0;
            const yOffset = isEven ? -60 : 60;
            const xPosition = 50 + (index * (800 / (stages.length - 1 || 1)));

            return (
              <motion.div
                key={stage.id}
                className="absolute"
                style={{ 
                  left: `${xPosition}px`, 
                  top: `calc(50% + ${yOffset}px)`,
                  transform: 'translate(-50%, -50%)'
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1, type: 'spring' }}
              >
                {/* Connector dots */}
                {index > 0 && (
                  <div className="absolute w-2 h-2 bg-primary/50 rounded-full" 
                    style={{ 
                      left: '-40px', 
                      top: '50%', 
                      transform: 'translateY(-50%)' 
                    }} 
                  />
                )}

                {/* Current user position indicator */}
                {stage.current && (
                  <motion.div
                    className="absolute -top-16 left-1/2 transform -translate-x-1/2 text-4xl"
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    {userAvatar}
                    <motion.div
                      className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-8 h-2 bg-black/20 rounded-full blur-sm"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                  </motion.div>
                )}

                {/* Stage Node */}
                <motion.button
                  onClick={() => !stage.locked && onStageClick(stage)}
                  disabled={stage.locked}
                  whileHover={!stage.locked ? { scale: 1.1 } : {}}
                  whileTap={!stage.locked ? { scale: 0.95 } : {}}
                  className={cn(
                    "relative w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition-all",
                    stage.completed && "ring-4 ring-green-400 ring-offset-2 ring-offset-background",
                    stage.current && "ring-4 ring-yellow-400 ring-offset-2 ring-offset-background animate-pulse",
                    stage.locked ? "bg-muted cursor-not-allowed" : `bg-gradient-to-br ${stageColors[stage.type]} cursor-pointer hover:shadow-xl`,
                  )}
                >
                  {stage.locked ? (
                    <Lock className="w-8 h-8 text-muted-foreground" />
                  ) : stage.completed ? (
                    <div className="relative">
                      <Icon className="w-8 h-8 text-white" />
                      <Star className="absolute -top-1 -right-1 w-4 h-4 text-yellow-400 fill-yellow-400" />
                    </div>
                  ) : (
                    <Icon className="w-8 h-8 text-white" />
                  )}

                  {/* Boss crown */}
                  {stage.type === 'boss' && !stage.locked && (
                    <Crown className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-6 h-6 text-yellow-400" />
                  )}

                  {/* Stage number */}
                  <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-background px-2 py-0.5 rounded-full text-xs font-bold border border-border">
                    {index + 1}
                  </span>
                </motion.button>

                {/* Stage Info */}
                <div className={cn(
                  "absolute left-1/2 transform -translate-x-1/2 text-center w-32",
                  isEven ? "top-24" : "bottom-24"
                )}>
                  <p className="text-sm font-semibold truncate">{stage.title}</p>
                  <div className="flex items-center justify-center gap-2 mt-1">
                    <span className="text-xs flex items-center gap-0.5 text-primary">
                      <Zap className="w-3 h-3" />
                      {stage.xpReward}
                    </span>
                    <span className="text-xs flex items-center gap-0.5 text-secondary">
                      <Gem className="w-3 h-3" />
                      {stage.coinsReward}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-4 mt-8 px-4">
        {Object.entries(stageIcons).map(([type, Icon]) => (
          <div key={type} className="flex items-center gap-2 text-sm">
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-br",
              stageColors[type as keyof typeof stageColors]
            )}>
              <Icon className="w-4 h-4 text-white" />
            </div>
            <span className="capitalize text-muted-foreground">{type}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JourneyPath;
