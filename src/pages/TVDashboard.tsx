import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { useGameStore } from '@/store/useGameStore';
import { Trophy, Target, Zap, Users as UsersIcon, CheckCircle2 } from 'lucide-react';

const TVDashboard = () => {
  const { teams, races, users } = useGameStore();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeSlide, setActiveSlide] = useState(0);
  const [liveData, setLiveData] = useState({
    salesGoal: 75,
    prospectionGoal: 82,
    salesTarget: 100000,
    salesCurrent: 75000,
    prospectionTarget: 500,
    prospectionCurrent: 410
  });

  // Atualizar dados em tempo real a cada 60 segundos
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    const dataUpdateTimer = setInterval(() => {
      setLiveData(prev => ({
        ...prev,
        salesGoal: Math.min(100, prev.salesGoal + Math.random() * 3),
        prospectionGoal: Math.min(100, prev.prospectionGoal + Math.random() * 2),
        salesCurrent: prev.salesCurrent + Math.floor(Math.random() * 2000),
        prospectionCurrent: prev.prospectionCurrent + Math.floor(Math.random() * 10)
      }));
    }, 60000); // 60 segundos

    const slideTimer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % 3); // 3 slides agora
    }, 10000);

    return () => {
      clearInterval(timer);
      clearInterval(dataUpdateTimer);
      clearInterval(slideTimer);
    };
  }, []);

  const sortedTeams = [...teams].sort((a, b) => b.points - a.points);
  const sortedUsers = [...users].sort((a, b) => b.points - a.points).slice(0, 5);
  const activeRaces = races.filter(r => r.status === 'active');
  
  const salesRemaining = liveData.salesTarget - liveData.salesCurrent;
  const prospectionRemaining = liveData.prospectionTarget - liveData.prospectionCurrent;

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
          {activeSlide === 0 && (
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
          )}
          
          {activeSlide === 1 && (
            <motion.div
              key="race-animation"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="p-8 mb-8 bg-gradient-to-br from-primary/10 to-secondary/10">
                <h2 className="text-4xl font-bold mb-6 flex items-center gap-3">
                  <Trophy className="w-10 h-10 text-primary" />
                  Corrida ao Vivo 🏁
                </h2>
                
                {activeRaces.length > 0 ? (
                  <div className="space-y-6">
                    <div className="text-center mb-8">
                      <p className="text-3xl font-bold">{activeRaces[0].name}</p>
                      <p className="text-xl text-muted-foreground">{activeRaces[0].theme}</p>
                    </div>
                    
                    <div className="relative h-96">
                      {/* Pista */}
                      <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-primary to-secondary rounded-full" />
                      
                      {/* Participantes */}
                      {sortedUsers.map((user, index) => {
                        const position = (user.points / Math.max(...sortedUsers.map(u => u.points))) * 90;
                        
                        return (
                          <motion.div
                            key={user.id}
                            className="absolute"
                            initial={{ left: 0 }}
                            animate={{ left: `${position}%` }}
                            transition={{ duration: 2, type: 'spring' }}
                            style={{ bottom: `${index * 70 + 20}px` }}
                          >
                            <div className="relative">
                              <div className="absolute -top-16 left-1/2 -translate-x-1/2 whitespace-nowrap">
                                <div className="bg-gradient-to-r from-primary to-secondary px-4 py-2 rounded-full">
                                  <span className="font-bold text-white">
                                    {index + 1}° {user.name} - {user.points} pts
                                  </span>
                                </div>
                              </div>
                              <div className="text-5xl">{user.avatar}</div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <p className="text-center text-2xl text-muted-foreground py-12">
                    Nenhuma corrida ativa no momento
                  </p>
                )}
              </Card>
            </motion.div>
          )}
          
          {activeSlide === 2 && (
            <motion.div
              key="goals"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
            >
              <div className="grid grid-cols-2 gap-6 mb-8">
                <Card className="p-8">
                  <h3 className="text-3xl font-bold mb-4 flex items-center gap-2">
                    <Target className="w-8 h-8 text-primary" />
                    Meta de Vendas
                  </h3>
                  <div className="space-y-6">
                    <div className="text-center">
                      <p className="text-6xl font-bold text-primary mb-2">
                        {Math.round(liveData.salesGoal)}%
                      </p>
                      <p className="text-xl text-muted-foreground">
                        Alcançado
                      </p>
                    </div>
                    
                    <div className="w-full h-6 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${liveData.salesGoal}%` }}
                        transition={{ duration: 1 }}
                        className="h-full bg-gradient-to-r from-primary to-secondary"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div className="p-4 bg-muted rounded-lg">
                        <p className="text-sm text-muted-foreground mb-1">Atual</p>
                        <p className="text-2xl font-bold">
                          R$ {liveData.salesCurrent.toLocaleString()}
                        </p>
                      </div>
                      <div className="p-4 bg-muted rounded-lg">
                        <p className="text-sm text-muted-foreground mb-1">Meta</p>
                        <p className="text-2xl font-bold">
                          R$ {liveData.salesTarget.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-primary/10 rounded-lg text-center">
                      <p className="text-sm text-muted-foreground mb-1">Faltam</p>
                      <p className="text-3xl font-bold text-primary">
                        R$ {salesRemaining.toLocaleString()}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        para atingir a meta
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-8">
                  <h3 className="text-3xl font-bold mb-4 flex items-center gap-2">
                    <Zap className="w-8 h-8 text-secondary" />
                    Meta de Prospecção
                  </h3>
                  <div className="space-y-6">
                    <div className="text-center">
                      <p className="text-6xl font-bold text-secondary mb-2">
                        {Math.round(liveData.prospectionGoal)}%
                      </p>
                      <p className="text-xl text-muted-foreground">
                        Alcançado
                      </p>
                    </div>
                    
                    <div className="w-full h-6 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${liveData.prospectionGoal}%` }}
                        transition={{ duration: 1 }}
                        className="h-full bg-gradient-to-r from-secondary to-accent"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div className="p-4 bg-muted rounded-lg">
                        <p className="text-sm text-muted-foreground mb-1">Atual</p>
                        <p className="text-2xl font-bold">
                          {liveData.prospectionCurrent}
                        </p>
                      </div>
                      <div className="p-4 bg-muted rounded-lg">
                        <p className="text-sm text-muted-foreground mb-1">Meta</p>
                        <p className="text-2xl font-bold">
                          {liveData.prospectionTarget}
                        </p>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-secondary/10 rounded-lg text-center">
                      <p className="text-sm text-muted-foreground mb-1">Faltam</p>
                      <p className="text-3xl font-bold text-secondary">
                        {prospectionRemaining}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        prospecções para atingir a meta
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
              
              {/* Estatísticas Adicionais */}
              <div className="grid grid-cols-3 gap-6">
                <Card className="p-6 text-center">
                  <UsersIcon className="w-12 h-12 text-primary mx-auto mb-3" />
                  <p className="text-4xl font-bold text-primary mb-1">
                    {users.length}
                  </p>
                  <p className="text-muted-foreground">Usuários Ativos</p>
                </Card>
                
                <Card className="p-6 text-center">
                  <Trophy className="w-12 h-12 text-secondary mx-auto mb-3" />
                  <p className="text-4xl font-bold text-secondary mb-1">
                    {races.filter(r => r.status === 'active').length}
                  </p>
                  <p className="text-muted-foreground">Corridas Ativas</p>
                </Card>
                
                <Card className="p-6 text-center">
                  <CheckCircle2 className="w-12 h-12 text-accent mx-auto mb-3" />
                  <p className="text-4xl font-bold text-accent mb-1">
                    {users.reduce((acc, u) => acc + u.points, 0)}
                  </p>
                  <p className="text-muted-foreground">Pontos Totais</p>
                </Card>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-muted-foreground mt-6"
        >
          <p className="text-sm">Atualização automática a cada minuto • Dados em tempo real</p>
        </motion.div>
      </div>
    </div>
  );
};

export default TVDashboard;