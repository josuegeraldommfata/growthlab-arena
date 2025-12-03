import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuthStore } from '@/store/useAuthStore';
import { useAnnualMissionsStore, MissionCategory } from '@/store/useAnnualMissionsStore';
import { 
  Trophy, 
  Star, 
  Calendar, 
  Target, 
  BookOpen, 
  TrendingUp, 
  Users, 
  Heart, 
  Award,
  Lock,
  CheckCircle2,
  Coins,
  Sparkles,
  Crown,
  Car
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const categoryConfig: Record<MissionCategory, { icon: typeof Trophy; label: string; color: string }> = {
  development: { icon: BookOpen, label: 'Desenvolvimento', color: 'bg-blue-500' },
  performance: { icon: TrendingUp, label: 'Performance', color: 'bg-green-500' },
  engagement: { icon: Users, label: 'Engajamento', color: 'bg-purple-500' },
  culture: { icon: Star, label: 'Cultura', color: 'bg-orange-500' },
  wellness: { icon: Heart, label: 'Bem-estar', color: 'bg-pink-500' },
};

const AnnualMissions = () => {
  const user = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);
  const { 
    chapters, 
    userProgress, 
    spendingLimit, 
    masterPrizeYearsRequired, 
    masterPrizeName,
    completeMission, 
    completeChapter,
    initUserProgress,
    getUserProgress,
  } = useAnnualMissionsStore();
  const { toast } = useToast();
  
  const [selectedChapter, setSelectedChapter] = useState<string | null>(null);
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();
  
  useEffect(() => {
    if (user) {
      initUserProgress(user.id);
    }
  }, [user, initUserProgress]);
  
  const progress = user ? getUserProgress(user.id) : null;
  const currentChapter = chapters.find(c => c.month === currentMonth && c.year === currentYear);
  
  const handleCompleteMission = (chapterId: string, missionId: string) => {
    if (!user) return;
    
    const result = completeMission(chapterId, missionId, user.id);
    if (result) {
      updateUser({
        xp: (user.xp || 0) + result.xpEarned,
        coins: (user.coins || 0) + result.coinsEarned,
      });
      
      toast({
        title: "Missão Concluída! 🎉",
        description: `+${result.coinsEarned} Coins e +${result.xpEarned} XP`,
      });
      
      // Check if chapter is complete
      const chapter = chapters.find(c => c.id === chapterId);
      if (chapter && chapter.missions.filter(m => m.id !== missionId).every(m => m.isCompleted)) {
        completeChapter(chapterId, user.id);
        toast({
          title: "Capítulo Completo! 🏆",
          description: "Você completou todas as missões do mês!",
        });
      }
    }
  };
  
  const completedChaptersCount = chapters.filter(c => c.isCompleted).length;
  const masterPrizeProgress = progress?.masterPrizeProgress || 0;
  
  return (
    <Layout>
      <div className="p-4 md:p-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2 flex items-center gap-3">
              <Trophy className="w-8 h-8 text-primary" />
              Missões Anuais
            </h1>
            <p className="text-muted-foreground">
              Complete missões mensais, ganhe selos e conquiste o prêmio master!
            </p>
          </div>
          
          {/* Master Prize Card */}
          <Card className="p-6 mb-8 bg-gradient-to-r from-yellow-500/20 via-orange-500/20 to-red-500/20 border-yellow-500/50">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="text-6xl">
                <Car className="w-20 h-20 text-yellow-500" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl font-bold mb-2 flex items-center justify-center md:justify-start gap-2">
                  <Crown className="w-6 h-6 text-yellow-500" />
                  Prêmio Master: {masterPrizeName}
                </h2>
                <p className="text-muted-foreground mb-4">
                  Complete {masterPrizeYearsRequired} anos de missões para conquistar!
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progresso: {masterPrizeProgress}/{masterPrizeYearsRequired} anos</span>
                    <span>{Math.round((masterPrizeProgress / masterPrizeYearsRequired) * 100)}%</span>
                  </div>
                  <Progress value={(masterPrizeProgress / masterPrizeYearsRequired) * 100} className="h-3" />
                </div>
              </div>
              <div className="flex flex-wrap gap-2 justify-center">
                {progress?.seals.map((seal) => (
                  <div 
                    key={seal.id}
                    className={`p-3 rounded-full ${seal.type === 'gold' ? 'bg-yellow-500' : 'bg-gray-400'}`}
                    title={`Selo ${seal.year} - ${seal.type === 'gold' ? 'Dourado' : 'Padrão'}`}
                  >
                    <Award className="w-6 h-6 text-white" />
                  </div>
                ))}
              </div>
            </div>
          </Card>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card className="p-4 text-center">
              <Calendar className="w-8 h-8 mx-auto mb-2 text-primary" />
              <p className="text-2xl font-bold">{completedChaptersCount}/12</p>
              <p className="text-sm text-muted-foreground">Capítulos Completos</p>
            </Card>
            <Card className="p-4 text-center">
              <Coins className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
              <p className="text-2xl font-bold">{progress?.totalCoinsEarned || 0}</p>
              <p className="text-sm text-muted-foreground">Coins Ganhos</p>
            </Card>
            <Card className="p-4 text-center">
              <Award className="w-8 h-8 mx-auto mb-2 text-purple-500" />
              <p className="text-2xl font-bold">{progress?.seals.length || 0}</p>
              <p className="text-sm text-muted-foreground">Selos Conquistados</p>
            </Card>
            <Card className="p-4 text-center">
              <Target className="w-8 h-8 mx-auto mb-2 text-green-500" />
              <p className="text-2xl font-bold">{Math.round(spendingLimit * 100)}%</p>
              <p className="text-sm text-muted-foreground">Limite Mensal</p>
            </Card>
          </div>
          
          {/* Current Chapter Highlight */}
          {currentChapter && (
            <Card className="p-6 mb-8 border-2 border-primary">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="w-6 h-6 text-primary" />
                <h3 className="text-xl font-bold">{currentChapter.title}</h3>
                <Badge variant="default">Mês Atual</Badge>
              </div>
              <p className="text-muted-foreground mb-4">{currentChapter.description}</p>
              <div className="flex items-center gap-4">
                <span className="text-sm">
                  Missões: {currentChapter.missions.filter(m => m.isCompleted).length}/{currentChapter.missions.length}
                </span>
                <Progress 
                  value={(currentChapter.missions.filter(m => m.isCompleted).length / currentChapter.missions.length) * 100} 
                  className="flex-1 h-2"
                />
              </div>
            </Card>
          )}
          
          {/* Chapters Grid */}
          <Tabs defaultValue="chapters" className="mb-8">
            <TabsList className="mb-4">
              <TabsTrigger value="chapters">Capítulos do Ano</TabsTrigger>
              <TabsTrigger value="missions">Missões do Mês</TabsTrigger>
              <TabsTrigger value="seals">Meus Selos</TabsTrigger>
            </TabsList>
            
            <TabsContent value="chapters">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {chapters.map((chapter, index) => {
                  const isPast = chapter.month < currentMonth;
                  const isCurrent = chapter.month === currentMonth;
                  const isFuture = chapter.month > currentMonth;
                  const completedMissions = chapter.missions.filter(m => m.isCompleted).length;
                  
                  return (
                    <motion.div
                      key={chapter.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card 
                        className={`p-4 cursor-pointer transition-all hover:shadow-lg ${
                          isCurrent ? 'border-2 border-primary ring-2 ring-primary/20' : ''
                        } ${chapter.isCompleted ? 'bg-green-500/10' : ''} ${isFuture ? 'opacity-50' : ''}`}
                        onClick={() => setSelectedChapter(chapter.id)}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-3xl font-bold text-primary">{chapter.month}</span>
                          {chapter.isCompleted ? (
                            <CheckCircle2 className="w-6 h-6 text-green-500" />
                          ) : isFuture ? (
                            <Lock className="w-6 h-6 text-muted-foreground" />
                          ) : null}
                        </div>
                        <h4 className="font-semibold mb-2 truncate">{chapter.title.split(':')[1]}</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>{completedMissions}/{chapter.missions.length}</span>
                          </div>
                          <Progress 
                            value={(completedMissions / chapter.missions.length) * 100} 
                            className="h-1.5"
                          />
                        </div>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </TabsContent>
            
            <TabsContent value="missions">
              {currentChapter && (
                <div className="space-y-4">
                  {Object.entries(categoryConfig).map(([category, config]) => {
                    const categoryMissions = currentChapter.missions.filter(m => m.category === category);
                    if (categoryMissions.length === 0) return null;
                    
                    const Icon = config.icon;
                    
                    return (
                      <Card key={category} className="p-4">
                        <div className="flex items-center gap-3 mb-4">
                          <div className={`p-2 rounded-lg ${config.color}`}>
                            <Icon className="w-5 h-5 text-white" />
                          </div>
                          <h4 className="font-semibold">{config.label}</h4>
                        </div>
                        <div className="space-y-3">
                          {categoryMissions.map((mission) => (
                            <div 
                              key={mission.id}
                              className={`flex items-center justify-between p-3 rounded-lg ${
                                mission.isCompleted ? 'bg-green-500/10' : 'bg-muted/50'
                              }`}
                            >
                              <div className="flex-1">
                                <p className={`font-medium ${mission.isCompleted ? 'line-through text-muted-foreground' : ''}`}>
                                  {mission.title}
                                </p>
                                <p className="text-sm text-muted-foreground">{mission.description}</p>
                                <div className="flex gap-3 mt-1 text-xs">
                                  <span className="text-yellow-500">+{mission.coinsReward} Coins</span>
                                  <span className="text-blue-500">+{mission.xpReward} XP</span>
                                </div>
                              </div>
                              {mission.isCompleted ? (
                                <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0" />
                              ) : (
                                <Button 
                                  size="sm"
                                  onClick={() => handleCompleteMission(currentChapter.id, mission.id)}
                                >
                                  Completar
                                </Button>
                              )}
                            </div>
                          ))}
                        </div>
                      </Card>
                    );
                  })}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="seals">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {Array.from({ length: masterPrizeYearsRequired }, (_, i) => {
                  const year = currentYear - (masterPrizeYearsRequired - 1 - i);
                  const seal = progress?.seals.find(s => s.year === year);
                  
                  return (
                    <Card 
                      key={i}
                      className={`p-6 text-center ${seal ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20' : ''}`}
                    >
                      <div className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center ${
                        seal?.type === 'gold' ? 'bg-yellow-500' : seal ? 'bg-gray-400' : 'bg-muted'
                      }`}>
                        {seal ? (
                          <Award className="w-10 h-10 text-white" />
                        ) : (
                          <Lock className="w-10 h-10 text-muted-foreground" />
                        )}
                      </div>
                      <h4 className="font-bold text-lg">{year}</h4>
                      {seal ? (
                        <>
                          <Badge className={seal.type === 'gold' ? 'bg-yellow-500' : 'bg-gray-500'}>
                            {seal.type === 'gold' ? 'Selo Dourado' : 'Selo Padrão'}
                          </Badge>
                          <p className="text-sm text-muted-foreground mt-2">
                            +{seal.bonusCoins} Coins de bônus
                          </p>
                        </>
                      ) : (
                        <p className="text-sm text-muted-foreground">Não conquistado</p>
                      )}
                    </Card>
                  );
                })}
              </div>
            </TabsContent>
          </Tabs>
          
          {/* Spending Limit Info */}
          <Card className="p-4 bg-muted/50">
            <div className="flex items-start gap-3">
              <Coins className="w-5 h-5 text-yellow-500 mt-0.5" />
              <div>
                <h4 className="font-semibold mb-1">Limite de Gastos Mensal</h4>
                <p className="text-sm text-muted-foreground">
                  Para incentivar o acúmulo e a retenção, você pode gastar apenas {Math.round(spendingLimit * 100)}% 
                  das suas moedas por mês. Planeje suas trocas com sabedoria!
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </Layout>
  );
};

export default AnnualMissions;
