import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useAuthStore } from '@/store/useAuthStore';
import { useGameStore } from '@/store/useGameStore';
import { Trophy, Target, Zap, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  const user = useAuthStore((state) => state.user);
  const { tasks, races } = useGameStore();
  
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
      <div className="p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold mb-2">
            Bem-vindo, {user?.name}! 👋
          </h1>
          <p className="text-muted-foreground mb-8">
            Continue sua jornada rumo ao topo! 🚀
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 relative overflow-hidden">
                  <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${stat.color} opacity-10 rounded-full -mr-8 -mt-8`} />
                  <div className="flex items-center justify-between mb-2">
                    <stat.icon className={`w-8 h-8 bg-gradient-to-br ${stat.color} bg-clip-text text-transparent`} />
                    <span className="text-3xl font-bold">{stat.value}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
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

            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-secondary" />
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

          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Tarefas Pendentes</h3>
            <div className="space-y-3">
              {pendingTasks.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  Nenhuma tarefa pendente! 🎉
                </p>
              ) : (
                pendingTasks.map(task => (
                  <div key={task.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div>
                      <p className="font-medium">{task.title}</p>
                      <p className="text-sm text-muted-foreground">{task.description}</p>
                    </div>
                    <div className="flex gap-2 text-sm">
                      <span className="px-3 py-1 bg-primary/20 text-primary rounded">
                        +{task.xp} XP
                      </span>
                      <span className="px-3 py-1 bg-secondary/20 text-secondary rounded">
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
