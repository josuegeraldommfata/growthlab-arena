import { useState } from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/store/useAuthStore';
import { useGameStore } from '@/store/useGameStore';
import { 
  Crown, Medal, Trophy, Users, User, Flame, 
  TrendingUp, Star, Zap
} from 'lucide-react';

const Leaderboard = () => {
  const { user } = useAuthStore();
  const { users, teams } = useGameStore();
  const [period, setPeriod] = useState<'all' | 'month' | 'week'>('all');

  // Sort users by points
  const sortedUsers = [...users].sort((a, b) => b.points - a.points);
  
  // Sort teams by points
  const sortedTeams = [...teams].sort((a, b) => b.points - a.points);

  // Find current user's rank
  const userRank = sortedUsers.findIndex(u => u.id === user?.id) + 1;
  const currentUserData = sortedUsers.find(u => u.id === user?.id);

  const getRankDisplay = (index: number) => {
    if (index === 0) return { icon: <Crown className="w-6 h-6" />, color: 'text-yellow-500', bg: 'bg-yellow-500/20' };
    if (index === 1) return { icon: <Medal className="w-6 h-6" />, color: 'text-gray-400', bg: 'bg-gray-400/20' };
    if (index === 2) return { icon: <Medal className="w-6 h-6" />, color: 'text-amber-600', bg: 'bg-amber-600/20' };
    return { icon: <span className="font-bold text-lg">{index + 1}</span>, color: 'text-muted-foreground', bg: 'bg-muted' };
  };

  const topThree = sortedUsers.slice(0, 3);

  return (
    <Layout>
      <div className="p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2 flex items-center gap-2">
                Leaderboard <Trophy className="w-8 h-8 text-yellow-500" />
              </h1>
              <p className="text-muted-foreground">
                Veja quem está no topo da competição!
              </p>
            </div>
            
            {currentUserData && (
              <Card className="p-4 bg-gradient-to-r from-primary/20 to-secondary/20 border-primary/30">
                <div className="flex items-center gap-4">
                  <span className="text-3xl">{currentUserData.avatar}</span>
                  <div>
                    <p className="text-sm text-muted-foreground">Sua Posição</p>
                    <p className="text-2xl font-bold">#{userRank}</p>
                  </div>
                  <div className="border-l border-border pl-4">
                    <p className="text-sm text-muted-foreground">Seus Pontos</p>
                    <p className="text-2xl font-bold text-primary">{currentUserData.points}</p>
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Top 3 Podium */}
          <Card className="p-6 mb-8 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
            <h3 className="text-xl font-semibold mb-6 text-center relative flex items-center justify-center gap-2">
              <Flame className="w-5 h-5 text-orange-500" />
              Top 3 do Ranking
            </h3>
            
            <div className="flex justify-center items-end gap-4 relative">
              {/* 2nd Place */}
              {topThree[1] && (
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-center"
                >
                  <div className="w-24 h-24 mx-auto mb-2 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-4xl">
                    {topThree[1].avatar}
                  </div>
                  <Medal className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                  <p className="font-bold">{topThree[1].name.split(' ')[0]}</p>
                  <p className="text-primary font-semibold">{topThree[1].points} pts</p>
                  <div className="w-24 h-20 bg-gray-400/20 rounded-t-lg mt-2" />
                </motion.div>
              )}
              
              {/* 1st Place */}
              {topThree[0] && (
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-center -mt-8"
                >
                  <div className="relative">
                    <div className="w-28 h-28 mx-auto mb-2 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 flex items-center justify-center text-5xl ring-4 ring-yellow-400/50">
                      {topThree[0].avatar}
                    </div>
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute -top-4 left-1/2 -translate-x-1/2"
                    >
                      <Crown className="w-10 h-10 text-yellow-500" />
                    </motion.div>
                  </div>
                  <p className="font-bold text-lg">{topThree[0].name.split(' ')[0]}</p>
                  <p className="text-primary font-semibold text-xl">{topThree[0].points} pts</p>
                  <div className="w-28 h-28 bg-yellow-500/20 rounded-t-lg mt-2" />
                </motion.div>
              )}
              
              {/* 3rd Place */}
              {topThree[2] && (
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-center"
                >
                  <div className="w-20 h-20 mx-auto mb-2 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-3xl">
                    {topThree[2].avatar}
                  </div>
                  <Medal className="w-8 h-8 mx-auto text-amber-600 mb-2" />
                  <p className="font-bold">{topThree[2].name.split(' ')[0]}</p>
                  <p className="text-primary font-semibold">{topThree[2].points} pts</p>
                  <div className="w-20 h-16 bg-amber-600/20 rounded-t-lg mt-2" />
                </motion.div>
              )}
            </div>
          </Card>

          {/* Tabs for Users and Teams */}
          <Tabs defaultValue="users" className="space-y-6">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="users" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Usuários
              </TabsTrigger>
              <TabsTrigger value="teams" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Equipes
              </TabsTrigger>
            </TabsList>

            <TabsContent value="users">
              <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted">
                      <tr>
                        <th className="text-left p-4 font-semibold w-16">Rank</th>
                        <th className="text-left p-4 font-semibold">Usuário</th>
                        <th className="text-right p-4 font-semibold">Pontos</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedUsers.map((u, index) => {
                        const rankDisplay = getRankDisplay(index);
                        const isCurrentUser = u.id === user?.id;
                        
                        return (
                          <motion.tr
                            key={u.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.03 }}
                            className={`border-b border-border ${
                              isCurrentUser 
                                ? 'bg-primary/10 hover:bg-primary/15' 
                                : 'hover:bg-muted/50'
                            } transition-colors`}
                          >
                            <td className="p-4">
                              <div className={`w-10 h-10 rounded-full ${rankDisplay.bg} flex items-center justify-center ${rankDisplay.color}`}>
                                {rankDisplay.icon}
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <span className="text-2xl">{u.avatar}</span>
                                <div>
                                  <p className="font-semibold flex items-center gap-2">
                                    {u.name}
                                    {isCurrentUser && (
                                      <Badge variant="outline" className="text-xs">Você</Badge>
                                    )}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="p-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Zap className="w-4 h-4 text-primary" />
                                <span className="font-bold text-lg">{u.points}</span>
                              </div>
                            </td>
                          </motion.tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="teams">
              <div className="grid gap-4">
                {sortedTeams.map((team, index) => {
                  const rankDisplay = getRankDisplay(index);
                  
                  return (
                    <motion.div
                      key={team.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="p-6">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-full ${rankDisplay.bg} flex items-center justify-center ${rankDisplay.color}`}>
                            {rankDisplay.icon}
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-xl font-bold">{team.name}</h3>
                              <Badge variant={team.type === 'vendas' ? 'default' : 'secondary'}>
                                {team.type}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {team.members.length} membros
                            </p>
                          </div>
                          
                          <div className="text-right">
                            <div className="flex items-center gap-2 justify-end">
                              <Star className="w-5 h-5 text-yellow-500" />
                              <span className="text-3xl font-bold text-primary">{team.points}</span>
                            </div>
                            <p className="text-xs text-muted-foreground">pontos</p>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Leaderboard;
