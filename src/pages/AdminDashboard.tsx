import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { useGameStore } from '@/store/useGameStore';
import { Users, Trophy, BookOpen, TrendingUp, Target } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const AdminDashboard = () => {
  const { teams, races, tasks, quizzes, courses } = useGameStore();

  const stats = [
    { label: 'Total de Equipes', value: teams.length, icon: Users, color: 'from-primary to-primary/70' },
    { label: 'Corridas Ativas', value: races.filter(r => r.status === 'active').length, icon: Trophy, color: 'from-secondary to-secondary/70' },
    { label: 'Tarefas Ativas', value: tasks.filter(t => !t.completed).length, icon: Target, color: 'from-accent to-accent/70' },
    { label: 'Cursos Disponíveis', value: courses.length, icon: BookOpen, color: 'from-primary to-secondary' },
  ];

  const teamPerformanceData = teams.map(team => ({
    name: team.name,
    pontos: team.points,
    membros: team.members.length
  }));

  const taskCompletionData = [
    { mes: 'Jan', concluídas: 45, pendentes: 12 },
    { mes: 'Fev', concluídas: 52, pendentes: 8 },
    { mes: 'Mar', concluídas: 61, pendentes: 15 },
    { mes: 'Abr', concluídas: 48, pendentes: 10 },
  ];

  return (
    <Layout>
      <div className="p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">Dashboard Admin 👨‍💼</h1>
              <p className="text-muted-foreground">Visão geral do sistema</p>
            </div>
          </div>

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
                <TrendingUp className="w-5 h-5 text-primary" />
                Performance das Equipes
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={teamPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Bar dataKey="pontos" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-secondary" />
                Tarefas - Últimos 4 Meses
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={taskCompletionData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="concluídas" stroke="hsl(var(--primary))" strokeWidth={2} />
                  <Line type="monotone" dataKey="pendentes" stroke="hsl(var(--secondary))" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-accent" />
                Equipes
              </h3>
              <div className="space-y-3">
                {teams.map(team => (
                  <div key={team.id} className="p-4 bg-muted rounded-lg flex items-center justify-between">
                    <div>
                      <p className="font-medium">{team.name}</p>
                      <p className="text-sm text-muted-foreground">{team.members.length} membros</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">{team.points}</p>
                      <p className="text-xs text-muted-foreground">pontos</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-secondary" />
                Corridas em Andamento
              </h3>
              <div className="space-y-3">
                {races.filter(r => r.status === 'active').map(race => (
                  <div key={race.id} className="p-4 bg-muted rounded-lg">
                    <p className="font-medium">{race.name}</p>
                    <p className="text-sm text-muted-foreground mb-2">{race.theme}</p>
                    <div className="flex gap-2 text-xs">
                      <span className="px-2 py-1 bg-primary/20 text-primary rounded">
                        {race.participants.length} participantes
                      </span>
                      <span className="px-2 py-1 bg-secondary/20 text-secondary rounded">
                        {new Date(race.endDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
