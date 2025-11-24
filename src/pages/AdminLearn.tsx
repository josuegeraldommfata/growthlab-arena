import { useState } from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGameStore } from '@/store/useGameStore';
import { useToast } from '@/hooks/use-toast';
import { BookOpen, Plus, Award, Trash2 } from 'lucide-react';

const AdminLearn = () => {
  const { quizzes, courses, addQuiz, addCourse } = useGameStore();
  const { toast } = useToast();

  const [quizForm, setQuizForm] = useState({
    title: '',
    description: '',
    questions: [{
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      points: 25
    }]
  });

  const [courseForm, setCourseForm] = useState({
    title: '',
    description: '',
    videoUrl: '',
    chapters: [{ title: '', order: 1 }],
    materials: ['']
  });

  const handleAddQuiz = () => {
    if (!quizForm.title || !quizForm.questions[0].question) return;

    addQuiz({
      id: Date.now().toString(),
      title: quizForm.title,
      description: quizForm.description,
      questions: quizForm.questions.map((q, idx) => ({
        id: `q${idx + 1}`,
        ...q
      }))
    });

    toast({
      title: "Quiz criado!",
      description: `${quizForm.title} foi adicionado à biblioteca.`,
    });

    setQuizForm({
      title: '',
      description: '',
      questions: [{
        question: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
        points: 25
      }]
    });
  };

  const handleAddCourse = () => {
    if (!courseForm.title || !courseForm.videoUrl) return;

    addCourse({
      id: Date.now().toString(),
      title: courseForm.title,
      description: courseForm.description,
      videoUrl: courseForm.videoUrl,
      chapters: courseForm.chapters.map((c, idx) => ({
        id: `c${idx + 1}`,
        title: c.title,
        order: idx + 1
      })),
      materials: courseForm.materials.filter(m => m.trim())
    });

    toast({
      title: "Curso criado!",
      description: `${courseForm.title} foi adicionado à biblioteca.`,
    });

    setCourseForm({
      title: '',
      description: '',
      videoUrl: '',
      chapters: [{ title: '', order: 1 }],
      materials: ['']
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
          <h1 className="text-4xl font-bold mb-2">Gerenciar Conteúdo 📚</h1>
          <p className="text-muted-foreground mb-8">
            Crie quizzes e cursos para sua equipe
          </p>

          <Tabs defaultValue="quizzes" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
              <TabsTrigger value="courses">Cursos</TabsTrigger>
            </TabsList>

            <TabsContent value="quizzes" className="mt-6">
              <Card className="p-6 mb-8">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Criar Novo Quiz
                </h3>
                <div className="space-y-4">
                  <div>
                    <Label>Título do Quiz</Label>
                    <Input
                      value={quizForm.title}
                      onChange={(e) => setQuizForm({ ...quizForm, title: e.target.value })}
                      placeholder="Ex: Técnicas de Vendas Avançadas"
                    />
                  </div>
                  <div>
                    <Label>Descrição</Label>
                    <Textarea
                      value={quizForm.description}
                      onChange={(e) => setQuizForm({ ...quizForm, description: e.target.value })}
                      placeholder="Descreva o quiz..."
                    />
                  </div>

                  {quizForm.questions.map((q, qIdx) => (
                    <Card key={qIdx} className="p-4 bg-muted">
                      <div className="space-y-3">
                        <div>
                          <Label>Pergunta {qIdx + 1}</Label>
                          <Input
                            value={q.question}
                            onChange={(e) => {
                              const newQuestions = [...quizForm.questions];
                              newQuestions[qIdx].question = e.target.value;
                              setQuizForm({ ...quizForm, questions: newQuestions });
                            }}
                            placeholder="Digite a pergunta..."
                          />
                        </div>
                        {q.options.map((opt, oIdx) => (
                          <div key={oIdx}>
                            <Label>Alternativa {oIdx + 1}</Label>
                            <Input
                              value={opt}
                              onChange={(e) => {
                                const newQuestions = [...quizForm.questions];
                                newQuestions[qIdx].options[oIdx] = e.target.value;
                                setQuizForm({ ...quizForm, questions: newQuestions });
                              }}
                              placeholder={`Opção ${oIdx + 1}`}
                            />
                          </div>
                        ))}
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Resposta Correta (0-3)</Label>
                            <Input
                              type="number"
                              min="0"
                              max="3"
                              value={q.correctAnswer}
                              onChange={(e) => {
                                const newQuestions = [...quizForm.questions];
                                newQuestions[qIdx].correctAnswer = parseInt(e.target.value);
                                setQuizForm({ ...quizForm, questions: newQuestions });
                              }}
                            />
                          </div>
                          <div>
                            <Label>Pontos</Label>
                            <Input
                              type="number"
                              value={q.points}
                              onChange={(e) => {
                                const newQuestions = [...quizForm.questions];
                                newQuestions[qIdx].points = parseInt(e.target.value);
                                setQuizForm({ ...quizForm, questions: newQuestions });
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}

                  <Button onClick={handleAddQuiz} className="w-full bg-gradient-to-r from-secondary to-accent">
                    <Plus className="w-4 h-4 mr-2" />
                    Criar Quiz
                  </Button>
                </div>
              </Card>

              <div className="grid gap-4">
                {quizzes.map((quiz) => (
                  <Card key={quiz.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Award className="w-6 h-6 text-secondary" />
                        <div>
                          <h4 className="font-semibold">{quiz.title}</h4>
                          <p className="text-sm text-muted-foreground">{quiz.questions.length} perguntas</p>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="courses" className="mt-6">
              <Card className="p-6 mb-8">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Criar Novo Curso
                </h3>
                <div className="space-y-4">
                  <div>
                    <Label>Título do Curso</Label>
                    <Input
                      value={courseForm.title}
                      onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                      placeholder="Ex: Fundamentos de Vendas B2B"
                    />
                  </div>
                  <div>
                    <Label>Descrição</Label>
                    <Textarea
                      value={courseForm.description}
                      onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                      placeholder="Descreva o curso..."
                    />
                  </div>
                  <div>
                    <Label>URL do Vídeo (YouTube)</Label>
                    <Input
                      value={courseForm.videoUrl}
                      onChange={(e) => setCourseForm({ ...courseForm, videoUrl: e.target.value })}
                      placeholder="https://www.youtube.com/watch?v=..."
                    />
                  </div>

                  <div>
                    <Label className="mb-2 block">Capítulos</Label>
                    {courseForm.chapters.map((chapter, idx) => (
                      <div key={idx} className="mb-2">
                        <Input
                          value={chapter.title}
                          onChange={(e) => {
                            const newChapters = [...courseForm.chapters];
                            newChapters[idx].title = e.target.value;
                            setCourseForm({ ...courseForm, chapters: newChapters });
                          }}
                          placeholder={`Capítulo ${idx + 1}`}
                        />
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setCourseForm({
                        ...courseForm,
                        chapters: [...courseForm.chapters, { title: '', order: courseForm.chapters.length + 1 }]
                      })}
                    >
                      + Adicionar Capítulo
                    </Button>
                  </div>

                  <Button onClick={handleAddCourse} className="w-full bg-gradient-to-r from-primary to-secondary">
                    <Plus className="w-4 h-4 mr-2" />
                    Criar Curso
                  </Button>
                </div>
              </Card>

              <div className="grid gap-4">
                {courses.map((course) => (
                  <Card key={course.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <BookOpen className="w-6 h-6 text-primary" />
                        <div>
                          <h4 className="font-semibold">{course.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {course.chapters.length} capítulos • {course.materials.length} materiais
                          </p>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </Layout>
  );
};

export default AdminLearn;
