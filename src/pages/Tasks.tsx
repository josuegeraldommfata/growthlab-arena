import { useState } from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { useAuthStore } from '@/store/useAuthStore';
import { useGameStore } from '@/store/useGameStore';
import { useToast } from '@/hooks/use-toast';
import { Target, Zap, Coins, CheckCircle2, Circle } from 'lucide-react';

const Tasks = () => {
  const user = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);
  const { tasks, completeTask } = useGameStore();
  const { toast } = useToast();
  
  const userTasks = tasks.filter(t => t.userId === user?.id);
  const completedTasks = userTasks.filter(t => t.completed).length;
  const totalTasks = userTasks.length;
  const progressPercent = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const handleCompleteTask = (taskId: string, xp: number, coins: number) => {
    completeTask(taskId);
    
    if (user) {
      const newXp = (user.xp || 0) + xp;
      const newCoins = (user.coins || 0) + coins;
      const xpForNextLevel = user.level * 120;
      
      let newLevel = user.level;
      let remainingXp = newXp;
      
      if (newXp >= xpForNextLevel) {
        newLevel += 1;
        remainingXp = newXp - xpForNextLevel;
        
        toast({
          title: "🎉 Subiu de nível!",
          description: `Parabéns! Você alcançou o nível ${newLevel}!`,
        });
      }
      
      updateUser({ 
        xp: remainingXp,
        coins: newCoins,
        level: newLevel
      });
      
      toast({
        title: "✅ Tarefa concluída!",
        description: `+${xp} XP e +${coins} Coins`,
      });
    }
  };

  return (
    <Layout>
      <div className="p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold mb-2">Minhas Tarefas 🎯</h1>
          <p className="text-muted-foreground mb-6">
            Complete suas tarefas e ganhe XP e Coins!
          </p>

          {/* Progress Card */}
          {totalTasks > 0 && (
            <Card className="p-6 mb-6 bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/20 rounded-full">
                    <Target className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Progresso das Tarefas</h3>
                    <p className="text-sm text-muted-foreground">
                      {completedTasks} de {totalTasks} tarefas concluídas
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-bold text-primary">{Math.round(progressPercent)}%</span>
                </div>
              </div>
              
              <Progress value={progressPercent} className="h-3 mb-3" />
              
              <div className="flex justify-between text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Circle className="w-4 h-4" />
                  <span>{totalTasks - completedTasks} pendentes</span>
                </div>
                <div className="flex items-center gap-2 text-green-500">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{completedTasks} concluídas</span>
                </div>
              </div>
            </Card>
          )}

          <div className="grid gap-4">
            {userTasks.map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`p-6 ${task.completed ? 'opacity-60' : ''}`}>
                  <div className="flex items-start gap-4">
                    <Checkbox
                      checked={task.completed}
                      onCheckedChange={() => {
                        if (!task.completed) {
                          handleCompleteTask(task.id, task.xp, task.coins);
                        }
                      }}
                      disabled={task.completed}
                      className="mt-1"
                    />
                    
                    <div className="flex-1">
                      <h3 className={`text-xl font-semibold mb-2 ${task.completed ? 'line-through' : ''}`}>
                        {task.title}
                      </h3>
                      <p className="text-muted-foreground mb-4">{task.description}</p>
                      
                      <div className="flex gap-3">
                        <span className="flex items-center gap-1 px-3 py-1 bg-primary/20 text-primary rounded-full text-sm">
                          <Zap className="w-4 h-4" />
                          +{task.xp} XP
                        </span>
                        <span className="flex items-center gap-1 px-3 py-1 bg-secondary/20 text-secondary rounded-full text-sm">
                          <Coins className="w-4 h-4" />
                          +{task.coins} Coins
                        </span>
                      </div>
                    </div>
                    
                    {task.completed && (
                      <div className="text-4xl">✅</div>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {userTasks.length === 0 && (
            <Card className="p-12 text-center">
              <Target className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">Nenhuma tarefa por enquanto</h3>
              <p className="text-muted-foreground">Aguarde novas tarefas serem atribuídas!</p>
            </Card>
          )}
        </motion.div>
      </div>
    </Layout>
  );
};

export default Tasks;
