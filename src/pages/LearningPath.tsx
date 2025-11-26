import { useState } from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useGameStore } from '@/store/useGameStore';
import { useToast } from '@/hooks/use-toast';
import { Route, Plus, Award, BookOpen, GripVertical } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface PathStep {
  id: string;
  type: 'course' | 'quiz';
  contentId: string;
  order: number;
}

const LearningPath = () => {
  const { quizzes, courses } = useGameStore();
  const { toast } = useToast();
  
  const [pathName, setPathName] = useState('');
  const [pathDescription, setPathDescription] = useState('');
  const [steps, setSteps] = useState<PathStep[]>([]);
  const [draggedItem, setDraggedItem] = useState<number | null>(null);

  const handleAddStep = (type: 'course' | 'quiz', contentId: string) => {
    const newStep: PathStep = {
      id: Date.now().toString(),
      type,
      contentId,
      order: steps.length + 1
    };
    setSteps([...steps, newStep]);
  };

  const handleDragStart = (index: number) => {
    setDraggedItem(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedItem === null || draggedItem === index) return;

    const newSteps = [...steps];
    const draggedStep = newSteps[draggedItem];
    newSteps.splice(draggedItem, 1);
    newSteps.splice(index, 0, draggedStep);
    
    // Atualizar ordem
    newSteps.forEach((step, idx) => {
      step.order = idx + 1;
    });
    
    setSteps(newSteps);
    setDraggedItem(index);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  const handleRemoveStep = (stepId: string) => {
    setSteps(steps.filter(s => s.id !== stepId));
  };

  const handleSavePath = () => {
    if (!pathName || steps.length === 0) {
      toast({
        title: "Erro",
        description: "Preencha o nome e adicione pelo menos uma etapa.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Trilha criada!",
      description: `${pathName} foi criada com ${steps.length} etapas.`,
    });

    setPathName('');
    setPathDescription('');
    setSteps([]);
  };

  const getStepContent = (step: PathStep) => {
    if (step.type === 'course') {
      return courses.find(c => c.id === step.contentId);
    } else {
      return quizzes.find(q => q.id === step.contentId);
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
          <h1 className="text-4xl font-bold mb-2">Trilhas de Aprendizado 🎯</h1>
          <p className="text-muted-foreground mb-8">
            Crie jornadas de aprendizado combinando cursos e quizzes
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Formulário de Criação */}
            <div className="space-y-6">
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Route className="w-5 h-5" />
                  Criar Nova Trilha
                </h3>

                <div className="space-y-4">
                  <div>
                    <Label>Nome da Trilha</Label>
                    <Input
                      value={pathName}
                      onChange={(e) => setPathName(e.target.value)}
                      placeholder="Ex: Desenvolvimento em Vendas"
                    />
                  </div>

                  <div>
                    <Label>Descrição</Label>
                    <Textarea
                      value={pathDescription}
                      onChange={(e) => setPathDescription(e.target.value)}
                      placeholder="Descreva o objetivo desta trilha..."
                    />
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Adicionar Conteúdo</h3>

                <div className="space-y-4">
                  <div>
                    <Label>Associar Curso</Label>
                    <Select onValueChange={(value) => handleAddStep('course', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um curso" />
                      </SelectTrigger>
                      <SelectContent>
                        {courses.map(course => (
                          <SelectItem key={course.id} value={course.id}>
                            {course.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Associar Quiz</Label>
                    <Select onValueChange={(value) => handleAddStep('quiz', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um quiz" />
                      </SelectTrigger>
                      <SelectContent>
                        {quizzes.map(quiz => (
                          <SelectItem key={quiz.id} value={quiz.id}>
                            {quiz.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </Card>
            </div>

            {/* Preview e Organização */}
            <div>
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">
                  Etapas da Trilha ({steps.length})
                </h3>
                
                <p className="text-sm text-muted-foreground mb-4">
                  Arraste para reordenar as etapas
                </p>

                {steps.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Route className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p>Nenhuma etapa adicionada ainda</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {steps.map((step, index) => {
                      const content = getStepContent(step);
                      if (!content) return null;

                      return (
                        <motion.div
                          key={step.id}
                          draggable
                          onDragStart={() => handleDragStart(index)}
                          onDragOver={(e) => handleDragOver(e, index)}
                          onDragEnd={handleDragEnd}
                          className="p-4 bg-muted rounded-lg cursor-move hover:bg-muted/80 transition-colors"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="flex items-center gap-3">
                            <GripVertical className="w-5 h-5 text-muted-foreground" />
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                {step.type === 'course' ? (
                                  <BookOpen className="w-4 h-4 text-primary" />
                                ) : (
                                  <Award className="w-4 h-4 text-secondary" />
                                )}
                                <span className="text-xs text-muted-foreground">
                                  Etapa {step.order}
                                </span>
                              </div>
                              <p className="font-medium">{content.title}</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {step.type === 'course' ? 'Curso' : 'Quiz'}
                              </p>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleRemoveStep(step.id)}
                            >
                              Remover
                            </Button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}

                <Button 
                  onClick={handleSavePath}
                  disabled={!pathName || steps.length === 0}
                  className="w-full mt-6 bg-gradient-to-r from-primary to-secondary"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Criar Trilha
                </Button>
              </Card>

              {/* Trilhas Salvas (Mock) */}
              <Card className="p-6 mt-6">
                <h3 className="text-lg font-semibold mb-4">Trilhas Criadas</h3>
                <div className="space-y-3">
                  {[
                    { name: 'Onboarding Vendas', steps: 5, students: 12 },
                    { name: 'Prospecção Avançada', steps: 8, students: 8 }
                  ].map((path, idx) => (
                    <div key={idx} className="p-4 bg-muted rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{path.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {path.steps} etapas • {path.students} alunos
                          </p>
                        </div>
                        <Button size="sm" variant="outline">
                          Editar
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default LearningPath;