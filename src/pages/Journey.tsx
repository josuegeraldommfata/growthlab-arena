import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '@/components/Layout';
import JourneyPath, { Stage } from '@/components/JourneyPath';
import MiniRaceTrack from '@/components/MiniRaceTrack';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/store/useAuthStore';
import { useGameStore, Quiz, Task } from '@/store/useGameStore';
import { useToast } from '@/hooks/use-toast';
import { 
  Trophy, Zap, Gem, Star, Target, Skull, CheckCircle2, XCircle, 
  Sparkles, ArrowRight, Award
} from 'lucide-react';

const Journey = () => {
  const user = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);
  const { tasks, quizzes, users, completeTask } = useGameStore();
  const { toast } = useToast();

  const [selectedStage, setSelectedStage] = useState<Stage | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [earnedXp, setEarnedXp] = useState(0);
  const [earnedCoins, setEarnedCoins] = useState(0);

  // Generate stages from tasks and quizzes
  const generateStages = (): Stage[] => {
    const allStages: Stage[] = [];
    let stageIndex = 0;

    // Add tasks as stages
    tasks.slice(0, 3).forEach((task, idx) => {
      allStages.push({
        id: `task-${task.id}`,
        type: 'task',
        title: task.title,
        description: task.description,
        xpReward: task.xp,
        coinsReward: task.coins,
        completed: task.completed,
        locked: stageIndex > 0 && !allStages[stageIndex - 1]?.completed,
        current: !task.completed && (stageIndex === 0 || allStages[stageIndex - 1]?.completed),
      });
      stageIndex++;

      // Add boss after every 2 tasks
      if ((idx + 1) % 2 === 0) {
        allStages.push({
          id: `boss-${idx}`,
          type: 'boss',
          title: `Boss Fase ${Math.floor(idx / 2) + 1}`,
          description: 'Derrote o boss para avançar!',
          xpReward: 150,
          coinsReward: 100,
          completed: false,
          locked: !allStages[stageIndex - 1]?.completed,
          current: false,
        });
        stageIndex++;
      }
    });

    // Add quizzes as stages
    quizzes.slice(0, 2).forEach((quiz, idx) => {
      allStages.push({
        id: `quiz-${quiz.id}`,
        type: 'quiz',
        title: quiz.title,
        description: quiz.description,
        xpReward: quiz.questions.reduce((acc, q) => acc + q.points, 0),
        coinsReward: 50,
        completed: false,
        locked: stageIndex > 0 && !allStages[stageIndex - 1]?.completed,
        current: false,
      });
      stageIndex++;
    });

    // Add reward checkpoints
    allStages.push({
      id: 'reward-1',
      type: 'reward',
      title: 'Recompensa Especial',
      description: 'Parabéns! Você ganhou uma recompensa!',
      xpReward: 200,
      coinsReward: 150,
      completed: false,
      locked: true,
      current: false,
    });

    // Add final checkpoint
    allStages.push({
      id: 'checkpoint-final',
      type: 'checkpoint',
      title: 'Fase Completa!',
      description: 'Você completou esta fase da jornada!',
      xpReward: 100,
      coinsReward: 50,
      completed: false,
      locked: true,
      current: false,
    });

    // Update current stage
    const firstIncomplete = allStages.findIndex(s => !s.completed && !s.locked);
    if (firstIncomplete !== -1) {
      allStages[firstIncomplete].current = true;
    }

    return allStages;
  };

  const [stages, setStages] = useState<Stage[]>(generateStages());

  // Get current quiz for quiz stages
  const getCurrentQuiz = (stageId: string): Quiz | undefined => {
    const quizId = stageId.replace('quiz-', '');
    return quizzes.find(q => q.id === quizId);
  };

  // Get current task for task stages
  const getCurrentTask = (stageId: string): Task | undefined => {
    const taskId = stageId.replace('task-', '');
    return tasks.find(t => t.id === taskId);
  };

  const handleStageClick = (stage: Stage) => {
    setSelectedStage(stage);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
  };

  const handleCompleteTask = () => {
    if (!selectedStage || !user) return;

    const xp = selectedStage.xpReward;
    const coins = selectedStage.coinsReward;

    setEarnedXp(xp);
    setEarnedCoins(coins);
    setShowResult(true);
    setIsCorrect(true);

    // Update user stats
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

    // Mark stage as complete
    if (selectedStage.type === 'task') {
      const taskId = selectedStage.id.replace('task-', '');
      completeTask(taskId);
    }

    // Update stages
    setStages(prev => prev.map((s, idx) => {
      if (s.id === selectedStage.id) {
        return { ...s, completed: true, current: false };
      }
      if (idx > 0 && prev[idx - 1].id === selectedStage.id) {
        return { ...s, locked: false, current: true };
      }
      return s;
    }));
  };

  const handleQuizAnswer = () => {
    if (selectedAnswer === null || !selectedStage) return;

    const quiz = getCurrentQuiz(selectedStage.id);
    if (!quiz) return;

    const question = quiz.questions[currentQuestion];
    const correct = selectedAnswer === question.correctAnswer;

    setIsCorrect(correct);
    setShowResult(true);

    if (correct) {
      setEarnedXp(prev => prev + question.points);
      setEarnedCoins(prev => prev + 10);
    }
  };

  const handleNextQuestion = () => {
    if (!selectedStage) return;

    const quiz = getCurrentQuiz(selectedStage.id);
    if (!quiz) return;

    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      // Quiz completed
      if (user) {
        const newXp = (user.xp || 0) + earnedXp;
        const newCoins = (user.coins || 0) + earnedCoins;

        updateUser({
          xp: newXp,
          coins: newCoins
        });

        toast({
          title: "Quiz Completo! 🎉",
          description: `Você ganhou +${earnedXp} XP e +${earnedCoins} Coins!`,
        });
      }

      // Update stages
      setStages(prev => prev.map((s, idx) => {
        if (s.id === selectedStage.id) {
          return { ...s, completed: true, current: false };
        }
        if (idx > 0 && prev[idx - 1].id === selectedStage.id) {
          return { ...s, locked: false, current: true };
        }
        return s;
      }));

      setSelectedStage(null);
      setEarnedXp(0);
      setEarnedCoins(0);
    }
  };

  const handleBossBattle = () => {
    // Simulate boss battle
    const win = Math.random() > 0.3; // 70% chance to win

    if (win) {
      setIsCorrect(true);
      setEarnedXp(selectedStage?.xpReward || 0);
      setEarnedCoins(selectedStage?.coinsReward || 0);

      if (user && selectedStage) {
        updateUser({
          xp: (user.xp || 0) + selectedStage.xpReward,
          coins: (user.coins || 0) + selectedStage.coinsReward
        });
      }

      // Update stages
      setStages(prev => prev.map((s, idx) => {
        if (s.id === selectedStage?.id) {
          return { ...s, completed: true, current: false };
        }
        if (idx > 0 && prev[idx - 1].id === selectedStage?.id) {
          return { ...s, locked: false, current: true };
        }
        return s;
      }));

      toast({
        title: "Boss Derrotado! 💪",
        description: `Você venceu o boss e ganhou recompensas!`,
      });
    } else {
      setIsCorrect(false);
      toast({
        title: "Boss venceu... 😢",
        description: "Tente novamente! Você consegue!",
        variant: "destructive"
      });
    }

    setShowResult(true);
  };

  const completedStages = stages.filter(s => s.completed).length;
  const progressPercentage = (completedStages / stages.length) * 100;

  return (
    <Layout>
      <div className="p-4 md:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
            <div>
              <h1 className="text-4xl font-bold mb-2 flex items-center gap-2">
                Jornada <Sparkles className="w-8 h-8 text-yellow-400" />
              </h1>
              <p className="text-muted-foreground">
                Complete tarefas, quizzes e derrote bosses para subir de nível!
              </p>
            </div>
            
            {/* User Stats */}
            <div className="flex gap-4">
              <Card className="p-3 flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" />
                <span className="font-bold">{user?.xp || 0} XP</span>
              </Card>
              <Card className="p-3 flex items-center gap-2">
                <Gem className="w-5 h-5 text-secondary" />
                <span className="font-bold">{user?.coins || 0}</span>
              </Card>
              <Card className="p-3 flex items-center gap-2">
                <Award className="w-5 h-5 text-accent" />
                <span className="font-bold">Nv. {user?.level || 1}</span>
              </Card>
            </div>
          </div>

          {/* Progress Bar */}
          <Card className="p-4 mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Progresso da Jornada</span>
              <span className="text-sm text-muted-foreground">{completedStages}/{stages.length} fases</span>
            </div>
            <Progress value={progressPercentage} className="h-3" />
          </Card>

          {/* Mini Race Track */}
          <Card className="p-4 mb-6">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-400" />
              Ranking da Corrida
            </h3>
            <MiniRaceTrack users={users} />
          </Card>

          {/* Journey Path */}
          <Card className="p-4 overflow-hidden">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              Sua Jornada
            </h3>
            <JourneyPath 
              stages={stages} 
              onStageClick={handleStageClick}
              userAvatar={user?.avatar || '🏎️'}
            />
          </Card>
        </motion.div>

        {/* Stage Dialog */}
        <Dialog open={!!selectedStage} onOpenChange={() => setSelectedStage(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {selectedStage?.type === 'boss' && <Skull className="w-6 h-6 text-red-500" />}
                {selectedStage?.type === 'quiz' && <Zap className="w-6 h-6 text-purple-500" />}
                {selectedStage?.type === 'task' && <Target className="w-6 h-6 text-blue-500" />}
                {selectedStage?.title}
              </DialogTitle>
              <DialogDescription>{selectedStage?.description}</DialogDescription>
            </DialogHeader>

            <AnimatePresence mode="wait">
              {/* Task Content */}
              {selectedStage?.type === 'task' && !showResult && (
                <motion.div
                  key="task"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  <Card className="p-4 bg-muted">
                    <p className="text-sm mb-4">{getCurrentTask(selectedStage.id)?.description}</p>
                    <div className="flex gap-4">
                      <span className="flex items-center gap-1 text-primary">
                        <Zap className="w-4 h-4" /> +{selectedStage.xpReward} XP
                      </span>
                      <span className="flex items-center gap-1 text-secondary">
                        <Gem className="w-4 h-4" /> +{selectedStage.coinsReward} Coins
                      </span>
                    </div>
                  </Card>
                  <Button onClick={handleCompleteTask} className="w-full">
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Marcar como Concluída
                  </Button>
                </motion.div>
              )}

              {/* Quiz Content */}
              {selectedStage?.type === 'quiz' && !showResult && (
                <motion.div
                  key="quiz"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  {(() => {
                    const quiz = getCurrentQuiz(selectedStage.id);
                    if (!quiz) return null;
                    const question = quiz.questions[currentQuestion];
                    return (
                      <>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">
                            Pergunta {currentQuestion + 1} de {quiz.questions.length}
                          </span>
                          <span className="text-sm font-medium text-primary">
                            +{question.points} XP
                          </span>
                        </div>
                        <Progress value={((currentQuestion + 1) / quiz.questions.length) * 100} className="h-2" />
                        
                        <Card className="p-4">
                          <p className="font-medium mb-4">{question.question}</p>
                          <RadioGroup
                            value={selectedAnswer?.toString()}
                            onValueChange={(v) => setSelectedAnswer(parseInt(v))}
                          >
                            {question.options.map((option, idx) => (
                              <div key={idx} className="flex items-center space-x-2 p-2 rounded hover:bg-muted">
                                <RadioGroupItem value={idx.toString()} id={`option-${idx}`} />
                                <Label htmlFor={`option-${idx}`} className="cursor-pointer flex-1">
                                  {option}
                                </Label>
                              </div>
                            ))}
                          </RadioGroup>
                        </Card>

                        <Button 
                          onClick={handleQuizAnswer} 
                          disabled={selectedAnswer === null}
                          className="w-full"
                        >
                          Confirmar Resposta
                        </Button>
                      </>
                    );
                  })()}
                </motion.div>
              )}

              {/* Boss Battle Content */}
              {selectedStage?.type === 'boss' && !showResult && (
                <motion.div
                  key="boss"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  <div className="text-center py-8">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="text-8xl mb-4"
                    >
                      👹
                    </motion.div>
                    <p className="text-lg font-semibold">Prepare-se para a batalha!</p>
                    <p className="text-muted-foreground">Derrote o boss para ganhar recompensas!</p>
                    <div className="flex justify-center gap-4 mt-4">
                      <span className="flex items-center gap-1 text-primary">
                        <Zap className="w-4 h-4" /> +{selectedStage.xpReward} XP
                      </span>
                      <span className="flex items-center gap-1 text-secondary">
                        <Gem className="w-4 h-4" /> +{selectedStage.coinsReward} Coins
                      </span>
                    </div>
                  </div>
                  <Button onClick={handleBossBattle} className="w-full bg-red-600 hover:bg-red-700">
                    <Skull className="w-4 h-4 mr-2" />
                    Batalhar!
                  </Button>
                </motion.div>
              )}

              {/* Result Content */}
              {showResult && (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-6"
                >
                  {isCorrect ? (
                    <>
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', delay: 0.2 }}
                        className="text-7xl mb-4"
                      >
                        🎉
                      </motion.div>
                      <h3 className="text-2xl font-bold text-green-500 mb-2">
                        {selectedStage?.type === 'boss' ? 'Boss Derrotado!' : 'Correto!'}
                      </h3>
                      <div className="flex justify-center gap-4 mb-6">
                        <motion.div
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.3 }}
                          className="flex items-center gap-1 text-lg text-primary"
                        >
                          <Zap className="w-5 h-5" /> +{earnedXp || selectedStage?.xpReward} XP
                        </motion.div>
                        <motion.div
                          initial={{ x: 20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.4 }}
                          className="flex items-center gap-1 text-lg text-secondary"
                        >
                          <Gem className="w-5 h-5" /> +{earnedCoins || selectedStage?.coinsReward}
                        </motion.div>
                      </div>
                    </>
                  ) : (
                    <>
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring' }}
                        className="text-7xl mb-4"
                      >
                        😢
                      </motion.div>
                      <h3 className="text-2xl font-bold text-red-500 mb-2">
                        {selectedStage?.type === 'boss' ? 'Boss venceu...' : 'Incorreto!'}
                      </h3>
                      <p className="text-muted-foreground mb-6">Tente novamente!</p>
                    </>
                  )}
                  
                  <Button 
                    onClick={() => {
                      if (selectedStage?.type === 'quiz' && isCorrect) {
                        handleNextQuestion();
                      } else {
                        setSelectedStage(null);
                        setShowResult(false);
                        setEarnedXp(0);
                        setEarnedCoins(0);
                      }
                    }}
                    className="w-full"
                  >
                    {selectedStage?.type === 'quiz' && isCorrect ? (
                      <>Próxima <ArrowRight className="w-4 h-4 ml-2" /></>
                    ) : (
                      'Continuar'
                    )}
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default Journey;
