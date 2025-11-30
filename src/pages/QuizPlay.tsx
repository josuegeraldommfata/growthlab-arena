import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/store/useAuthStore';
import { useGameStore } from '@/store/useGameStore';
import { useToast } from '@/hooks/use-toast';
import { 
  ArrowLeft, ArrowRight, CheckCircle, XCircle, 
  Zap, Trophy, Clock, Award, Sparkles
} from 'lucide-react';

const QuizPlay = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, updateUser } = useAuthStore();
  const { quizzes } = useGameStore();
  
  const quiz = quizzes.find(q => q.id === quizId);
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [earnedXp, setEarnedXp] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [answers, setAnswers] = useState<{questionId: string, correct: boolean}[]>([]);

  useEffect(() => {
    if (!showResult && !isFinished && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && !showResult) {
      handleAnswer();
    }
  }, [timeLeft, showResult, isFinished]);

  if (!quiz) {
    return (
      <Layout>
        <div className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Quiz não encontrado</h2>
          <Button onClick={() => navigate('/learn')}>Voltar para Escola</Button>
        </div>
      </Layout>
    );
  }

  const question = quiz.questions[currentQuestion];
  const totalQuestions = quiz.questions.length;
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;

  const handleAnswer = () => {
    const correct = selectedAnswer === question.correctAnswer;
    setIsCorrect(correct);
    setShowResult(true);
    
    if (correct) {
      setScore(prev => prev + 1);
      setEarnedXp(prev => prev + question.points);
    }
    
    setAnswers(prev => [...prev, { questionId: question.id, correct }]);
  };

  const handleNext = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setTimeLeft(30);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    setIsFinished(true);
    
    // Add XP and coins to user
    if (user) {
      const coinsEarned = score * 10;
      const newXp = (user.xp || 0) + earnedXp;
      const newCoins = (user.coins || 0) + coinsEarned;
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
    }
  };

  if (isFinished) {
    const percentage = Math.round((score / totalQuestions) * 100);
    const coinsEarned = score * 10;
    
    return (
      <Layout>
        <div className="p-8 max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Card className="p-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", bounce: 0.5 }}
                className="mb-6"
              >
                {percentage >= 70 ? (
                  <div className="relative">
                    <Trophy className="w-24 h-24 mx-auto text-yellow-500" />
                    <Sparkles className="w-8 h-8 absolute top-0 right-1/4 text-yellow-400 animate-pulse" />
                  </div>
                ) : percentage >= 50 ? (
                  <Award className="w-24 h-24 mx-auto text-primary" />
                ) : (
                  <div className="w-24 h-24 mx-auto bg-muted rounded-full flex items-center justify-center text-4xl">
                    📚
                  </div>
                )}
              </motion.div>
              
              <h2 className="text-3xl font-bold mb-2">
                {percentage >= 70 ? 'Excelente!' : percentage >= 50 ? 'Bom trabalho!' : 'Continue praticando!'}
              </h2>
              <p className="text-muted-foreground mb-6">
                Você completou o quiz "{quiz.title}"
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                <Card className="p-4 bg-primary/10">
                  <p className="text-4xl font-bold text-primary">{score}/{totalQuestions}</p>
                  <p className="text-sm text-muted-foreground">Acertos</p>
                </Card>
                <Card className="p-4 bg-secondary/10">
                  <p className="text-4xl font-bold text-secondary">{percentage}%</p>
                  <p className="text-sm text-muted-foreground">Pontuação</p>
                </Card>
              </div>
              
              <div className="flex justify-center gap-4 mb-8">
                <Card className="p-3 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-primary" />
                  <span className="font-bold">+{earnedXp} XP</span>
                </Card>
                <Card className="p-3 flex items-center gap-2">
                  <span className="text-xl">🪙</span>
                  <span className="font-bold">+{coinsEarned} Coins</span>
                </Card>
              </div>
              
              <div className="flex gap-4">
                <Button variant="outline" onClick={() => navigate('/learn')} className="flex-1">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar para Escola
                </Button>
                <Button 
                  onClick={() => {
                    setCurrentQuestion(0);
                    setSelectedAnswer(null);
                    setShowResult(false);
                    setScore(0);
                    setEarnedXp(0);
                    setIsFinished(false);
                    setTimeLeft(30);
                    setAnswers([]);
                  }}
                  className="flex-1 bg-gradient-to-r from-primary to-secondary"
                >
                  Tentar Novamente
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-8 max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <Button variant="ghost" onClick={() => navigate('/learn')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Sair
            </Button>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Clock className={`w-5 h-5 ${timeLeft <= 10 ? 'text-red-500 animate-pulse' : 'text-muted-foreground'}`} />
                <span className={`font-bold ${timeLeft <= 10 ? 'text-red-500' : ''}`}>{timeLeft}s</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" />
                <span className="font-bold">{earnedXp} XP</span>
              </div>
            </div>
          </div>

          {/* Progress */}
          <Card className="p-4 mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Pergunta {currentQuestion + 1} de {totalQuestions}</span>
              <span className="font-medium text-primary">+{question.points} XP</span>
            </div>
            <Progress value={progress} className="h-2" />
          </Card>

          {/* Question */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
            >
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-6">{question.question}</h2>
                
                <RadioGroup
                  value={selectedAnswer?.toString()}
                  onValueChange={(v) => !showResult && setSelectedAnswer(parseInt(v))}
                  className="space-y-3"
                >
                  {question.options.map((option, idx) => {
                    const isSelected = selectedAnswer === idx;
                    const isCorrectAnswer = idx === question.correctAnswer;
                    
                    let bgColor = '';
                    if (showResult) {
                      if (isCorrectAnswer) bgColor = 'bg-green-500/20 border-green-500';
                      else if (isSelected && !isCorrectAnswer) bgColor = 'bg-red-500/20 border-red-500';
                    }
                    
                    return (
                      <div
                        key={idx}
                        className={`flex items-center p-4 rounded-lg border-2 transition-all ${
                          showResult ? bgColor : isSelected ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'
                        } ${!showResult ? 'cursor-pointer' : ''}`}
                        onClick={() => !showResult && setSelectedAnswer(idx)}
                      >
                        <RadioGroupItem value={idx.toString()} id={`option-${idx}`} disabled={showResult} />
                        <Label htmlFor={`option-${idx}`} className="flex-1 ml-3 cursor-pointer">
                          {option}
                        </Label>
                        {showResult && isCorrectAnswer && (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        )}
                        {showResult && isSelected && !isCorrectAnswer && (
                          <XCircle className="w-5 h-5 text-red-500" />
                        )}
                      </div>
                    );
                  })}
                </RadioGroup>
                
                {/* Result Message */}
                {showResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mt-6 p-4 rounded-lg ${
                      isCorrect ? 'bg-green-500/20' : 'bg-red-500/20'
                    }`}
                  >
                    <p className={`font-semibold ${isCorrect ? 'text-green-500' : 'text-red-500'}`}>
                      {isCorrect ? '✅ Correto!' : '❌ Incorreto!'}
                    </p>
                    {isCorrect && (
                      <p className="text-sm text-muted-foreground">+{question.points} XP</p>
                    )}
                  </motion.div>
                )}
                
                {/* Actions */}
                <div className="mt-6">
                  {!showResult ? (
                    <Button
                      onClick={handleAnswer}
                      disabled={selectedAnswer === null}
                      className="w-full bg-gradient-to-r from-primary to-secondary"
                    >
                      Confirmar Resposta
                    </Button>
                  ) : (
                    <Button onClick={handleNext} className="w-full">
                      {currentQuestion < totalQuestions - 1 ? (
                        <>
                          Próxima Pergunta
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </>
                      ) : (
                        <>
                          Ver Resultado
                          <Trophy className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </Card>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </Layout>
  );
};

export default QuizPlay;
