import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/store/useAuthStore';
import { useGameStore } from '@/store/useGameStore';
import { useToast } from '@/hooks/use-toast';
import { 
  ArrowLeft, PlayCircle, BookOpen, FileText, CheckCircle, 
  Zap, Lock, Trophy, Download
} from 'lucide-react';

const CourseView = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, updateUser } = useAuthStore();
  const { courses } = useGameStore();
  
  const course = courses.find(c => c.id === courseId);
  
  const [completedChapters, setCompletedChapters] = useState<string[]>([]);
  const [activeChapter, setActiveChapter] = useState<string | null>(null);

  if (!course) {
    return (
      <Layout>
        <div className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Curso não encontrado</h2>
          <Button onClick={() => navigate('/learn')}>Voltar para Escola</Button>
        </div>
      </Layout>
    );
  }

  const progress = (completedChapters.length / course.chapters.length) * 100;
  const isCompleted = completedChapters.length === course.chapters.length;
  const xpPerChapter = 50;
  const coinsPerChapter = 20;

  const handleCompleteChapter = (chapterId: string) => {
    if (completedChapters.includes(chapterId)) return;
    
    setCompletedChapters(prev => [...prev, chapterId]);
    
    // Add XP and coins
    if (user) {
      updateUser({
        xp: (user.xp || 0) + xpPerChapter,
        coins: (user.coins || 0) + coinsPerChapter
      });
      
      toast({
        title: "Capítulo concluído! 🎉",
        description: `+${xpPerChapter} XP e +${coinsPerChapter} Coins`,
      });
    }
    
    // Check if course is completed
    if (completedChapters.length + 1 === course.chapters.length) {
      const bonusXp = 100;
      const bonusCoins = 50;
      
      if (user) {
        updateUser({
          xp: (user.xp || 0) + bonusXp,
          coins: (user.coins || 0) + bonusCoins
        });
      }
      
      toast({
        title: "🏆 Curso Completo!",
        description: `Parabéns! Bônus de +${bonusXp} XP e +${bonusCoins} Coins!`,
      });
    }
  };

  const getYouTubeEmbedUrl = (url: string) => {
    const videoId = url.split('v=')[1]?.split('&')[0] || url.split('/').pop();
    return `https://www.youtube.com/embed/${videoId}`;
  };

  return (
    <Layout>
      <div className="p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" onClick={() => navigate('/learn')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold">{course.title}</h1>
              <p className="text-muted-foreground">{course.description}</p>
            </div>
            {isCompleted && (
              <Badge className="bg-green-500">
                <CheckCircle className="w-4 h-4 mr-1" />
                Completo
              </Badge>
            )}
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Video Player */}
              <Card className="overflow-hidden">
                <div className="aspect-video bg-black">
                  <iframe
                    src={getYouTubeEmbedUrl(course.videoUrl)}
                    title={course.title}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </Card>

              {/* Course Progress */}
              <Card className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Progresso do Curso</span>
                  <span className="text-sm text-muted-foreground">
                    {completedChapters.length}/{course.chapters.length} capítulos
                  </span>
                </div>
                <Progress value={progress} className="h-3" />
              </Card>

              {/* Chapters */}
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" />
                  Capítulos do Curso
                </h3>
                
                <div className="space-y-3">
                  {course.chapters.map((chapter, index) => {
                    const isChapterCompleted = completedChapters.includes(chapter.id);
                    const isPreviousCompleted = index === 0 || completedChapters.includes(course.chapters[index - 1].id);
                    const isLocked = !isPreviousCompleted;
                    const isActive = activeChapter === chapter.id;
                    
                    return (
                      <motion.div
                        key={chapter.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          isActive ? 'border-primary bg-primary/10' :
                          isChapterCompleted ? 'border-green-500/50 bg-green-500/10' :
                          isLocked ? 'border-border bg-muted opacity-50' : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            isChapterCompleted ? 'bg-green-500 text-white' :
                            isLocked ? 'bg-muted' : 'bg-primary/20 text-primary'
                          }`}>
                            {isChapterCompleted ? (
                              <CheckCircle className="w-5 h-5" />
                            ) : isLocked ? (
                              <Lock className="w-5 h-5" />
                            ) : (
                              <PlayCircle className="w-5 h-5" />
                            )}
                          </div>
                          
                          <div className="flex-1">
                            <p className="font-semibold">{chapter.title}</p>
                            <p className="text-xs text-muted-foreground">
                              Capítulo {chapter.order}
                            </p>
                          </div>
                          
                          {!isLocked && !isChapterCompleted && (
                            <Button
                              size="sm"
                              onClick={() => {
                                setActiveChapter(chapter.id);
                                handleCompleteChapter(chapter.id);
                              }}
                            >
                              Concluir
                            </Button>
                          )}
                          
                          {isChapterCompleted && (
                            <span className="text-sm text-green-500 font-medium flex items-center gap-1">
                              <Zap className="w-4 h-4" />
                              +{xpPerChapter} XP
                            </span>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Course Stats */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Informações do Curso</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Capítulos</span>
                    <span className="font-medium">{course.chapters.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Materiais</span>
                    <span className="font-medium">{course.materials.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">XP Total</span>
                    <span className="font-medium text-primary flex items-center gap-1">
                      <Zap className="w-4 h-4" />
                      {course.chapters.length * xpPerChapter + 100}
                    </span>
                  </div>
                </div>
              </Card>

              {/* Materials */}
              {course.materials.length > 0 && (
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-secondary" />
                    Materiais de Apoio
                  </h3>
                  
                  <div className="space-y-2">
                    {course.materials.map((material, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="w-full justify-start"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        {material}
                      </Button>
                    ))}
                  </div>
                </Card>
              )}

              {/* Completion Card */}
              {isCompleted && (
                <Card className="p-6 bg-gradient-to-br from-primary/20 to-secondary/20 border-primary/30">
                  <div className="text-center">
                    <Trophy className="w-12 h-12 mx-auto text-yellow-500 mb-3" />
                    <h3 className="text-xl font-bold mb-2">Curso Concluído!</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Parabéns por completar este curso!
                    </p>
                    <div className="flex justify-center gap-4">
                      <Badge variant="outline">
                        <Zap className="w-3 h-3 mr-1" />
                        +{course.chapters.length * xpPerChapter + 100} XP
                      </Badge>
                      <Badge variant="outline">
                        🪙 +{course.chapters.length * coinsPerChapter + 50}
                      </Badge>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default CourseView;
