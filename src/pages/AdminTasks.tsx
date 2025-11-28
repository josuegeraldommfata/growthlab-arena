import { useState } from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGameStore } from '@/store/useGameStore';
import { useToast } from '@/hooks/use-toast';
import { Plus, Target, Trash2, Users, Zap, Coins, Calendar } from 'lucide-react';

const AdminTasks = () => {
  const { tasks, users, teams, addTask } = useGameStore();
  const { toast } = useToast();

  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    xp: 100,
    coins: 50,
    userId: '',
    dueDate: ''
  });

  const handleAddTask = () => {
    if (!taskForm.title || !taskForm.userId) {
      toast({
        title: "Erro",
        description: "Preencha título e selecione um usuário",
        variant: "destructive"
      });
      return;
    }

    addTask({
      id: Date.now().toString(),
      title: taskForm.title,
      description: taskForm.description,
      xp: taskForm.xp,
      coins: taskForm.coins,
      completed: false,
      userId: taskForm.userId,
      dueDate: taskForm.dueDate || undefined
    });

    toast({
      title: "Tarefa criada! ✅",
      description: `${taskForm.title} foi atribuída ao usuário.`,
    });

    setTaskForm({
      title: '',
      description: '',
      xp: 100,
      coins: 50,
      userId: '',
      dueDate: ''
    });
  };

  return (
    <Layout>
      <div className="p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold mb-2">Gerenciar Tarefas 📋</h1>
          <p className="text-muted-foreground mb-8">
            Crie e atribua tarefas para sua equipe
          </p>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Create Task Form */}
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Criar Nova Tarefa
              </h3>
              <div className="space-y-4">
                <div>
                  <Label>Título da Tarefa</Label>
                  <Input
                    value={taskForm.title}
                    onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                    placeholder="Ex: Prospectar 10 leads"
                  />
                </div>

                <div>
                  <Label>Descrição</Label>
                  <Textarea
                    value={taskForm.description}
                    onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                    placeholder="Descreva a tarefa em detalhes..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label>Atribuir para</Label>
                  <Select
                    value={taskForm.userId}
                    onValueChange={(value) => setTaskForm({ ...taskForm, userId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um usuário" />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map(user => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.avatar} {user.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="flex items-center gap-1">
                      <Zap className="w-4 h-4 text-primary" />
                      XP de Recompensa
                    </Label>
                    <Input
                      type="number"
                      value={taskForm.xp}
                      onChange={(e) => setTaskForm({ ...taskForm, xp: parseInt(e.target.value) || 0 })}
                      min={10}
                    />
                  </div>
                  <div>
                    <Label className="flex items-center gap-1">
                      <Coins className="w-4 h-4 text-secondary" />
                      Coins de Recompensa
                    </Label>
                    <Input
                      type="number"
                      value={taskForm.coins}
                      onChange={(e) => setTaskForm({ ...taskForm, coins: parseInt(e.target.value) || 0 })}
                      min={5}
                    />
                  </div>
                </div>

                <div>
                  <Label className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Data de Vencimento (opcional)
                  </Label>
                  <Input
                    type="date"
                    value={taskForm.dueDate}
                    onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
                  />
                </div>

                <Button onClick={handleAddTask} className="w-full bg-gradient-to-r from-primary to-secondary">
                  <Plus className="w-4 h-4 mr-2" />
                  Criar Tarefa
                </Button>
              </div>
            </Card>

            {/* Tasks List */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                Tarefas Criadas ({tasks.length})
              </h3>
              
              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                {tasks.map((task, index) => {
                  const assignedUser = users.find(u => u.id === task.userId);
                  
                  return (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className={`p-4 ${task.completed ? 'opacity-60 bg-muted' : ''}`}>
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              {task.completed && <span className="text-green-500">✅</span>}
                              <h4 className={`font-semibold ${task.completed ? 'line-through' : ''}`}>
                                {task.title}
                              </h4>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{task.description}</p>
                            
                            <div className="flex flex-wrap gap-2">
                              {assignedUser && (
                                <span className="text-xs px-2 py-1 bg-muted rounded-full flex items-center gap-1">
                                  <Users className="w-3 h-3" />
                                  {assignedUser.avatar} {assignedUser.name}
                                </span>
                              )}
                              <span className="text-xs px-2 py-1 bg-primary/20 text-primary rounded-full flex items-center gap-1">
                                <Zap className="w-3 h-3" />
                                +{task.xp} XP
                              </span>
                              <span className="text-xs px-2 py-1 bg-secondary/20 text-secondary rounded-full flex items-center gap-1">
                                <Coins className="w-3 h-3" />
                                +{task.coins}
                              </span>
                              {task.dueDate && (
                                <span className="text-xs px-2 py-1 bg-accent/20 text-accent rounded-full flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {new Date(task.dueDate).toLocaleDateString('pt-BR')}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  );
                })}

                {tasks.length === 0 && (
                  <Card className="p-8 text-center">
                    <Target className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                    <p className="text-muted-foreground">Nenhuma tarefa criada ainda</p>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default AdminTasks;
