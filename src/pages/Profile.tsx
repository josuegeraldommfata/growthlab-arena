import { useState } from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { useAuthStore } from '@/store/useAuthStore';
import { useGameStore } from '@/store/useGameStore';
import { useRewardsStore } from '@/store/useRewardsStore';
import { useToast } from '@/hooks/use-toast';
import { 
  User, Zap, Coins, Trophy, Target, Award, Edit2, Save, 
  Star, TrendingUp, Calendar, Gift, CheckCircle
} from 'lucide-react';

const Profile = () => {
  const { user, updateUser } = useAuthStore();
  const { tasks, races } = useGameStore();
  const { getUserExchanges } = useRewardsStore();
  const { toast } = useToast();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(user?.name || '');
  const [selectedAvatar, setSelectedAvatar] = useState(user?.avatar || '👤');

  const avatarOptions = ['👤', '👩', '👨', '🧑', '👩‍💼', '👨‍💼', '🦸', '🦹', '🧙', '🎅', '👸', '🤴', '🏎️', '🚗', '🚙'];

  const userTasks = tasks.filter(t => t.userId === user?.id);
  const completedTasks = userTasks.filter(t => t.completed).length;
  const userExchanges = user ? getUserExchanges(user.id) : [];
  
  const xpForNextLevel = (user?.level || 1) * 120;
  const xpProgress = ((user?.xp || 0) / xpForNextLevel) * 100;

  const handleSaveProfile = () => {
    if (!editedName.trim()) {
      toast({
        title: "Erro",
        description: "O nome não pode estar vazio",
        variant: "destructive"
      });
      return;
    }

    updateUser({ name: editedName, avatar: selectedAvatar });
    setIsEditing(false);
    
    toast({
      title: "Perfil atualizado!",
      description: "Suas alterações foram salvas.",
    });
  };

  const stats = [
    { label: 'XP Total', value: user?.xp || 0, icon: Zap, color: 'text-primary' },
    { label: 'Coins', value: user?.coins || 0, icon: Coins, color: 'text-secondary' },
    { label: 'Nível', value: user?.level || 1, icon: TrendingUp, color: 'text-accent' },
    { label: 'Tarefas Concluídas', value: completedTasks, icon: CheckCircle, color: 'text-green-500' },
  ];

  const achievements = [
    { id: '1', name: 'Primeiro Login', description: 'Fez login pela primeira vez', icon: '🎉', unlocked: true },
    { id: '2', name: 'Primeira Tarefa', description: 'Completou a primeira tarefa', icon: '✅', unlocked: completedTasks >= 1 },
    { id: '3', name: '5 Tarefas', description: 'Completou 5 tarefas', icon: '🏅', unlocked: completedTasks >= 5 },
    { id: '4', name: '10 Tarefas', description: 'Completou 10 tarefas', icon: '🥇', unlocked: completedTasks >= 10 },
    { id: '5', name: 'Nível 5', description: 'Alcançou o nível 5', icon: '⭐', unlocked: (user?.level || 1) >= 5 },
    { id: '6', name: 'Primeira Troca', description: 'Fez a primeira troca de prêmio', icon: '🎁', unlocked: userExchanges.length >= 1 },
    { id: '7', name: '1000 Coins', description: 'Acumulou 1000 coins', icon: '💰', unlocked: (user?.coins || 0) >= 1000 },
    { id: '8', name: 'Milionário', description: 'Acumulou 5000 coins', icon: '🤑', unlocked: (user?.coins || 0) >= 5000 },
  ];

  return (
    <Layout>
      <div className="p-8 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Profile Header */}
          <Card className="p-6 mb-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full -mr-16 -mt-16" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-accent/20 to-primary/20 rounded-full -ml-12 -mb-12" />
            
            <div className="relative flex flex-col md:flex-row items-center gap-6">
              {/* Avatar */}
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-5xl">
                  {selectedAvatar}
                </div>
                <div className="absolute -bottom-2 -right-2 bg-accent text-accent-foreground rounded-full px-2 py-1 text-xs font-bold">
                  Nv. {user?.level || 1}
                </div>
              </div>
              
              {/* Info */}
              <div className="flex-1 text-center md:text-left">
                {isEditing ? (
                  <div className="space-y-3">
                    <div>
                      <Label>Nome</Label>
                      <Input
                        value={editedName}
                        onChange={(e) => setEditedName(e.target.value)}
                        className="max-w-xs"
                      />
                    </div>
                    <div>
                      <Label>Avatar</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {avatarOptions.map(avatar => (
                          <Button
                            key={avatar}
                            variant={selectedAvatar === avatar ? "default" : "outline"}
                            size="icon"
                            onClick={() => setSelectedAvatar(avatar)}
                          >
                            {avatar}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <h1 className="text-3xl font-bold mb-1">{user?.name}</h1>
                    <p className="text-muted-foreground mb-2">{user?.email}</p>
                    <div className="flex items-center justify-center md:justify-start gap-2">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm text-muted-foreground">
                        {user?.role === 'admin' ? 'Administrador' : 'Membro'}
                      </span>
                    </div>
                  </>
                )}
              </div>
              
              {/* Edit Button */}
              {isEditing ? (
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleSaveProfile}>
                    <Save className="w-4 h-4 mr-2" />
                    Salvar
                  </Button>
                </div>
              ) : (
                <Button variant="outline" onClick={() => setIsEditing(true)}>
                  <Edit2 className="w-4 h-4 mr-2" />
                  Editar Perfil
                </Button>
              )}
            </div>
          </Card>

          {/* Level Progress */}
          <Card className="p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Progresso do Nível
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="font-medium">Nível {user?.level}</span>
                <span className="text-muted-foreground">{user?.xp} / {xpForNextLevel} XP</span>
              </div>
              <Progress value={xpProgress} className="h-4" />
              <p className="text-xs text-muted-foreground text-center">
                Faltam <span className="font-bold text-primary">{xpForNextLevel - (user?.xp || 0)} XP</span> para o próximo nível!
              </p>
            </div>
          </Card>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-4 text-center hover:shadow-lg transition-shadow">
                  <stat.icon className={`w-8 h-8 mx-auto mb-2 ${stat.color}`} />
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Achievements */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-secondary" />
              Conquistas ({achievements.filter(a => a.unlocked).length}/{achievements.length})
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className={`p-4 rounded-lg text-center transition-all ${
                    achievement.unlocked 
                      ? 'bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/30' 
                      : 'bg-muted opacity-50'
                  }`}
                >
                  <span className={`text-3xl block mb-2 ${!achievement.unlocked && 'grayscale'}`}>
                    {achievement.icon}
                  </span>
                  <p className="font-semibold text-sm mb-1">{achievement.name}</p>
                  <p className="text-xs text-muted-foreground">{achievement.description}</p>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Profile;
