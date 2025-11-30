import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuthStore } from '@/store/useAuthStore';
import { useGameStore } from '@/store/useGameStore';
import { 
  Users, Trophy, Crown, Zap, Target, TrendingUp, 
  Medal, Award
} from 'lucide-react';

const MyTeam = () => {
  const { user } = useAuthStore();
  const { teams, users, tasks } = useGameStore();
  
  // Find user's team
  const userTeam = teams.find(t => t.id === user?.teamId) || teams.find(t => t.members.includes(user?.id || ''));
  
  // Get team members
  const teamMembers = userTeam 
    ? users.filter(u => userTeam.members.includes(u.id) || u.id === user?.id)
    : [];

  // Sort by points
  const sortedMembers = [...teamMembers].sort((a, b) => b.points - a.points);
  
  // Calculate team stats
  const totalPoints = sortedMembers.reduce((acc, m) => acc + m.points, 0);
  const avgPoints = sortedMembers.length > 0 ? Math.round(totalPoints / sortedMembers.length) : 0;
  
  // Get team tasks
  const teamTasks = tasks.filter(t => teamMembers.some(m => m.id === t.userId));
  const completedTeamTasks = teamTasks.filter(t => t.completed).length;
  const taskCompletionRate = teamTasks.length > 0 
    ? Math.round((completedTeamTasks / teamTasks.length) * 100) 
    : 0;

  // Calculate team rank among all teams
  const sortedTeams = [...teams].sort((a, b) => b.points - a.points);
  const teamRank = userTeam ? sortedTeams.findIndex(t => t.id === userTeam.id) + 1 : 0;

  const getRankIcon = (index: number) => {
    if (index === 0) return <Crown className="w-5 h-5 text-yellow-500" />;
    if (index === 1) return <Medal className="w-5 h-5 text-gray-400" />;
    if (index === 2) return <Medal className="w-5 h-5 text-amber-600" />;
    return <span className="font-bold text-muted-foreground">#{index + 1}</span>;
  };

  if (!userTeam) {
    return (
      <Layout>
        <div className="p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <Users className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-2">Você ainda não está em uma equipe</h2>
            <p className="text-muted-foreground">
              Entre em contato com um administrador para ser adicionado a uma equipe.
            </p>
          </motion.div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Team Header */}
          <Card className="p-6 mb-6 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-primary/20 rounded-full">
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">{userTeam.name}</h1>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant={userTeam.type === 'vendas' ? 'default' : 'secondary'}>
                      {userTeam.type === 'vendas' ? '💼 Vendas' : '🎯 Prospecção'}
                    </Badge>
                    <Badge variant="outline">
                      {teamMembers.length} membros
                    </Badge>
                    {teamRank <= 3 && (
                      <Badge className="bg-yellow-500/20 text-yellow-600 border-yellow-500/30">
                        #{teamRank} no Ranking
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="text-center md:text-right">
                <p className="text-4xl font-bold text-primary">{userTeam.points}</p>
                <p className="text-sm text-muted-foreground">Pontos da Equipe</p>
              </div>
            </div>
          </Card>

          {/* Team Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <Trophy className="w-8 h-8 text-yellow-500" />
                <div>
                  <p className="text-2xl font-bold">#{teamRank}</p>
                  <p className="text-xs text-muted-foreground">Ranking Geral</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-8 h-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{avgPoints}</p>
                  <p className="text-xs text-muted-foreground">Média de Pontos</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <Target className="w-8 h-8 text-secondary" />
                <div>
                  <p className="text-2xl font-bold">{completedTeamTasks}/{teamTasks.length}</p>
                  <p className="text-xs text-muted-foreground">Tarefas Completas</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <Zap className="w-8 h-8 text-accent" />
                <div>
                  <p className="text-2xl font-bold">{taskCompletionRate}%</p>
                  <p className="text-xs text-muted-foreground">Taxa de Conclusão</p>
                </div>
              </div>
            </Card>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Team Members */}
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Membros da Equipe
              </h3>
              
              <div className="space-y-3">
                {sortedMembers.map((member, index) => {
                  const memberTasks = tasks.filter(t => t.userId === member.id);
                  const memberCompletedTasks = memberTasks.filter(t => t.completed).length;
                  const isCurrentUser = member.id === user?.id;
                  
                  return (
                    <motion.div
                      key={member.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-4 rounded-lg ${isCurrentUser ? 'bg-primary/10 border border-primary/30' : 'bg-muted'}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-8">
                          {getRankIcon(index)}
                        </div>
                        <span className="text-2xl">{member.avatar}</span>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold">{member.name}</p>
                            {isCurrentUser && (
                              <Badge variant="outline" className="text-xs">Você</Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {memberCompletedTasks} tarefas concluídas
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-primary">{member.points}</p>
                          <p className="text-xs text-muted-foreground">pontos</p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </Card>

            {/* Team Progress */}
            <div className="space-y-6">
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5 text-secondary" />
                  Progresso de Tarefas
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Tarefas da Equipe</span>
                      <span className="font-medium">{taskCompletionRate}%</span>
                    </div>
                    <Progress value={taskCompletionRate} className="h-3" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <div className="text-center p-3 bg-green-500/10 rounded-lg">
                      <p className="text-2xl font-bold text-green-500">{completedTeamTasks}</p>
                      <p className="text-xs text-muted-foreground">Concluídas</p>
                    </div>
                    <div className="text-center p-3 bg-orange-500/10 rounded-lg">
                      <p className="text-2xl font-bold text-orange-500">{teamTasks.length - completedTeamTasks}</p>
                      <p className="text-xs text-muted-foreground">Pendentes</p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* All Teams Ranking */}
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5 text-accent" />
                  Ranking de Equipes
                </h3>
                
                <div className="space-y-3">
                  {sortedTeams.slice(0, 5).map((team, index) => {
                    const isUserTeam = team.id === userTeam?.id;
                    
                    return (
                      <div
                        key={team.id}
                        className={`p-3 rounded-lg flex items-center gap-3 ${
                          isUserTeam ? 'bg-primary/10 border border-primary/30' : 'bg-muted'
                        }`}
                      >
                        <div className="w-8 flex justify-center">
                          {getRankIcon(index)}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold">{team.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {team.members.length} membros
                          </p>
                        </div>
                        <p className="font-bold text-primary">{team.points} pts</p>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default MyTeam;
