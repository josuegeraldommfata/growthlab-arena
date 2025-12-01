import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import MiniRaceTrack from '@/components/MiniRaceTrack';
import { useAuthStore } from '@/store/useAuthStore';
import { useGameStore } from '@/store/useGameStore';
import { Trophy, Target, Zap, TrendingUp, Map, ArrowRight, Sparkles } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const { tasks, races, users, quizzes } = useGameStore();
  
  const userTasks = tasks.filter(t => t.userId === user?.id);
  const pendingTasks = userTasks.filter(t => !t.completed);
  const completedToday = userTasks.filter(t => t.completed).length;

  const stats = [
    { label: 'XP Total', value: user?.xp || 0, icon: Zap, color: 'from-primary to-primary/70' },
    { label: 'Coins', value: user?.coins || 0, icon: Trophy, color: 'from-secondary to-secondary/70' },
    { label: 'Nível', value: user?.level || 1, icon: TrendingUp, color: 'from-accent to-accent/70' },
    { label: 'Tarefas Hoje', value: completedToday, icon: Target, color: 'from-primary to-secondary' },
  ];

  return (
    <Layout>
      <div className="p-4 md:p-6 lg:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">
            Bem-vindo, {user?.name}! 👋
          </h1>
          <p className="text-sm md:text-base text-muted-foreground mb-6 md:mb-8">
            Continue sua jornada rumo ao topo! 🚀
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-4 md:p-6 relative overflow-hidden">
                  <div className={`absolute top-0 right-0 w-20 md:w-24 h-20 md:h-24 bg-gradient-to-br ${stat.color} opacity-10 rounded-full -mr-6 md:-mr-8 -mt-6 md:-mt-8`} />
                  <div className="flex items-center justify-between mb-2">
                    <stat.icon className={`w-6 h-6 md:w-8 md:h-8 bg-gradient-to-br ${stat.color} bg-clip-text text-transparent`} />
                    <span className="text-2xl md:text-3xl font-bold">{stat.value}</span>
                  </div>
                  <p className="text-xs md:text-sm text-muted-foreground">{stat.label}</p>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Journey Preview Card */}
          <Card className="p-4 md:p-6 mb-6 md:mb-8 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 border-2 border-primary/20">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-3 md:gap-4 flex-1">
                <div className="text-3xl md:text-5xl">
                  <Sparkles className="w-8 h-8 md:w-12 md:h-12 text-yellow-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg md:text-xl font-semibold mb-1 flex items-center gap-2">
                    <Map className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                    Sua Jornada
                  </h3>
                  <p className="text-sm md:text-base text-muted-foreground">
                    Complete tarefas, quizzes e derrote bosses para subir de nível!
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-2">
                    <span className="text-xs md:text-sm text-muted-foreground">
                      📋 {pendingTasks.length} tarefas pendentes
                    </span>
                    <span className="text-xs md:text-sm text-muted-foreground">
                      📝 {quizzes.length} quizzes disponíveis
                    </span>
                  </div>
                </div>
              </div>
              <Button onClick={() => navigate('/journey')} className="w-full md:w-auto bg-gradient-to-r from-primary to-secondary">
                Começar Jornada
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
            <Card className="p-4 md:p-6">
              <h3 className="text-lg md:text-xl font-semibold mb-4 flex items-center gap-2">
                <Target className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                Progresso do Nível
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Nível {user?.level}</span>
                  <span className="text-muted-foreground">{user?.xp} / {(user?.level || 1) * 120} XP</span>
                </div>
                <Progress value={((user?.xp || 0) / ((user?.level || 1) * 120)) * 100} className="h-3" />
                <p className="text-xs text-muted-foreground">
                  Faltam {((user?.level || 1) * 120) - (user?.xp || 0)} XP para o próximo nível!
                </p>
              </div>
            </Card>

            <Card className="p-4 md:p-6">
              <h3 className="text-lg md:text-xl font-semibold mb-4 flex items-center gap-2">
                <Trophy className="w-4 h-4 md:w-5 md:h-5 text-secondary" />
                Corridas Ativas
              </h3>
              {races.filter(r => r.status === 'active').map(race => (
                <div key={race.id} className="p-4 bg-muted rounded-lg">
                  <p className="font-medium">{race.name}</p>
                  <p className="text-sm text-muted-foreground">{race.theme}</p>
                  <div className="mt-2 flex gap-2 text-xs">
                    <span className="px-2 py-1 bg-primary/20 text-primary rounded">
                      {race.participants.length} participantes
                    </span>
                  </div>
                </div>
              ))}
            </Card>
          </div>

          {/* Mini Race Track */}
          <Card className="p-4 md:p-6 mb-6 md:mb-8">
            <h3 className="text-lg md:text-xl font-semibold mb-4 flex items-center gap-2">
              <Trophy className="w-4 h-4 md:w-5 md:h-5 text-yellow-400" />
              Ranking da Corrida
            </h3>
            <MiniRaceTrack users={users} />
            <div className="mt-4 text-center">
              <Button variant="outline" onClick={() => navigate('/races')}>
                Ver Todas as Corridas
              </Button>
            </div>
          </Card>

          <Card className="p-4 md:p-6">
            <h3 className="text-lg md:text-xl font-semibold mb-4">Tarefas Pendentes</h3>
            <div className="space-y-3">
              {pendingTasks.length === 0 ? (
                <p className="text-sm md:text-base text-muted-foreground text-center py-6 md:py-8">
                  Nenhuma tarefa pendente! 🎉
                </p>
              ) : (
                pendingTasks.map(task => (
                  <div key={task.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 md:p-4 bg-muted rounded-lg">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm md:text-base">{task.title}</p>
                      <p className="text-xs md:text-sm text-muted-foreground">{task.description}</p>
                    </div>
                    <div className="flex gap-2 text-xs md:text-sm">
                      <span className="px-2 md:px-3 py-1 bg-primary/20 text-primary rounded whitespace-nowrap">
                        +{task.xp} XP
                      </span>
                      <span className="px-2 md:px-3 py-1 bg-secondary/20 text-secondary rounded whitespace-nowrap">
                        +{task.coins} Coins
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Dashboard;
