import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { useGameStore } from '@/store/useGameStore';
import { useAuthStore } from '@/store/useAuthStore';
import { Trophy, TrendingUp, Target, Zap } from 'lucide-react';

const TVDashboard = () => {
  const { teams, races } = useGameStore();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    const slideTimer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % 2);
    }, 10000);

    return () => {
      clearInterval(timer);
      clearInterval(slideTimer);
    };
  }, []);

  const sortedTeams = [...teams].sort((a, b) => b.points - a.points);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 p-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-6xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent mb-4">
            GrowthLab Xp TV 📺
          </h1>
          <p className="text-2xl text-muted-foreground">
            {currentTime.toLocaleTimeString()} - {currentTime.toLocaleDateString()}
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {activeSlide === 0 ? (
            <motion.div
              key="ranking"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="p-8 mb-8">
                <h2 className="text-4xl font-bold mb-6 flex items-center gap-3">
                  <Trophy className="w-10 h-10 text-primary" />
                  Ranking de Equipes 🏆
                </h2>
                <div className="space-y-4">
                  {sortedTeams.map((team, index) => (
                    <motion.div
                      key={team.id}
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-6 bg-gradient-to-r from-muted to-transparent rounded-lg"
                    >
                      <div className="flex items-center gap-6">
                        <span className="text-5xl font-bold text-primary">
                          {index + 1}°
                        </span>
                        <div>
                          <p className="text-2xl font-bold">{team.name}</p>
                          <p className="text-muted-foreground">
                            {team.members.length} membros
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-4xl font-bold text-primary">
                          {team.points}
                        </p>
                        <p className="text-muted-foreground">pontos</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="races"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
            >
              <div className="grid grid-cols-2 gap-6 mb-8">
                <Card className="p-8">
                  <h3 className="text-3xl font-bold mb-4 flex items-center gap-2">
                    <Target className="w-8 h-8 text-primary" />
                    Corridas Ativas
                  </h3>
                  <div className="space-y-4">
                    {races.filter(r => r.status === 'active').map(race => (
                      <div key={race.id} className="p-4 bg-muted rounded-lg">
                        <p className="text-xl font-bold mb-2">{race.name}</p>
                        <p className="text-muted-foreground">{race.theme}</p>
                        <div className="mt-3 flex gap-2">
                          <span className="px-3 py-1 bg-primary/20 text-primary rounded text-sm">
                            {race.participants.length} participantes
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="p-8">
                  <h3 className="text-3xl font-bold mb-4 flex items-center gap-2">
                    <Zap className="w-8 h-8 text-secondary" />
                    Metas Globais
                  </h3>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-lg">Meta de Vendas</span>
                        <span className="text-2xl font-bold text-primary">75%</span>
                      </div>
                      <div className="w-full h-4 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: '75%' }}
                          transition={{ duration: 1, delay: 0.5 }}
                          className="h-full bg-gradient-to-r from-primary to-secondary"
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-lg">Meta de Prospecção</span>
                        <span className="text-2xl font-bold text-secondary">82%</span>
                      </div>
                      <div className="w-full h-4 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: '82%' }}
                          transition={{ duration: 1, delay: 0.7 }}
                          className="h-full bg-gradient-to-r from-secondary to-accent"
                        />
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-muted-foreground"
        >
          <p className="text-sm">Atualização automática a cada minuto • Dados em tempo real</p>
        </motion.div>
      </div>
    </div>
  );
};

export default TVDashboard;
