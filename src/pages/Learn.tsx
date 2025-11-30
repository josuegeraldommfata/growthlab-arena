import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useGameStore } from '@/store/useGameStore';
import { BookOpen, PlayCircle, Award, FileText, Zap, Clock, Users } from 'lucide-react';

const Learn = () => {
  const { quizzes, courses } = useGameStore();
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold mb-2">Escola 📚</h1>
          <p className="text-muted-foreground mb-8">
            Aprenda e evolua com nossos cursos e quizzes!
          </p>

          <Tabs defaultValue="courses" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="courses">Cursos</TabsTrigger>
              <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
            </TabsList>

            <TabsContent value="courses" className="mt-6">
              <div className="grid gap-6">
                {courses.map((course, index) => (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="p-6 hover:shadow-lg transition-all">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-primary/20 rounded-lg">
                          <PlayCircle className="w-8 h-8 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold mb-2">{course.title}</h3>
                          <p className="text-muted-foreground mb-4">{course.description}</p>
                          
                          <div className="flex flex-wrap gap-2 mb-4">
                            <Badge variant="outline" className="flex items-center gap-1">
                              <BookOpen className="w-3 h-3" />
                              {course.chapters.length} capítulos
                            </Badge>
                            <Badge variant="outline" className="flex items-center gap-1">
                              <FileText className="w-3 h-3" />
                              {course.materials.length} materiais
                            </Badge>
                            <Badge className="bg-primary/20 text-primary border-primary/30 flex items-center gap-1">
                              <Zap className="w-3 h-3" />
                              +{course.chapters.length * 50 + 100} XP
                            </Badge>
                          </div>

                          <Button 
                            onClick={() => navigate(`/course/${course.id}`)}
                            className="bg-gradient-to-r from-primary to-secondary"
                          >
                            <PlayCircle className="w-4 h-4 mr-2" />
                            Iniciar Curso
                          </Button>
                        </div>
                      </div>

                      <div className="mt-6 pt-6 border-t">
                        <p className="text-sm font-medium mb-3">Capítulos:</p>
                        <div className="space-y-2">
                          {course.chapters.map(chapter => (
                            <div key={chapter.id} className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                              <span className="text-sm font-medium text-muted-foreground">
                                {chapter.order}.
                              </span>
                              <span className="text-sm">{chapter.title}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}

                {courses.length === 0 && (
                  <Card className="p-8 text-center">
                    <BookOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Nenhum curso disponível ainda</p>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="quizzes" className="mt-6">
              <div className="grid md:grid-cols-2 gap-6">
                {quizzes.map((quiz, index) => (
                  <motion.div
                    key={quiz.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="p-6 hover:shadow-lg transition-all h-full flex flex-col">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="p-3 bg-secondary/20 rounded-lg">
                          <Award className="w-8 h-8 text-secondary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold mb-2">{quiz.title}</h3>
                          <p className="text-muted-foreground mb-4">{quiz.description}</p>
                          
                          <div className="flex flex-wrap gap-2 mb-4">
                            <Badge variant="outline">
                              {quiz.questions.length} perguntas
                            </Badge>
                            <Badge variant="outline" className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              ~{quiz.questions.length * 30}s
                            </Badge>
                            <Badge className="bg-primary/20 text-primary border-primary/30 flex items-center gap-1">
                              <Zap className="w-3 h-3" />
                              +{quiz.questions.reduce((acc, q) => acc + q.points, 0)} XP
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <Button 
                        onClick={() => navigate(`/quiz/${quiz.id}`)}
                        className="w-full mt-4 bg-gradient-to-r from-secondary to-accent"
                      >
                        <Award className="w-4 h-4 mr-2" />
                        Fazer Quiz
                      </Button>
                    </Card>
                  </motion.div>
                ))}

                {quizzes.length === 0 && (
                  <Card className="p-8 text-center col-span-2">
                    <Award className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Nenhum quiz disponível ainda</p>
                  </Card>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Learn;
