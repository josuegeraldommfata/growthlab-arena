import { useState } from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useAnnualMissionsStore, MissionCategory } from '@/store/useAnnualMissionsStore';
import { 
  Trophy, 
  Plus, 
  Settings, 
  Calendar,
  Target,
  BookOpen,
  TrendingUp,
  Users,
  Heart,
  Star,
  Trash2,
  Save,
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

const AdminAnnualMissions = () => {
  const { 
    chapters, 
    spendingLimit, 
    masterPrizeYearsRequired, 
    masterPrizeName,
    addMissionToChapter,
    updateMasterPrize,
  } = useAnnualMissionsStore();
  const { toast } = useToast();
  
  const [selectedChapter, setSelectedChapter] = useState(chapters[0]?.id || '');
  const [newMission, setNewMission] = useState({
    title: '',
    description: '',
    category: 'development' as MissionCategory,
    coinsReward: 300,
    xpReward: 150,
  });
  
  const [masterPrizeForm, setMasterPrizeForm] = useState({
    name: masterPrizeName,
    yearsRequired: masterPrizeYearsRequired,
  });
  
  const handleAddMission = () => {
    if (!newMission.title || !selectedChapter) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }
    
    const chapter = chapters.find(c => c.id === selectedChapter);
    if (!chapter) return;
    
    addMissionToChapter(selectedChapter, {
      ...newMission,
      startDate: new Date(chapter.year, chapter.month - 1, 1).toISOString(),
      endDate: new Date(chapter.year, chapter.month, 0).toISOString(),
    });
    
    toast({
      title: "Missão adicionada!",
      description: `${newMission.title} foi adicionada ao capítulo`,
    });
    
    setNewMission({
      title: '',
      description: '',
      category: 'development',
      coinsReward: 300,
      xpReward: 150,
    });
  };
  
  const handleUpdateMasterPrize = () => {
    updateMasterPrize(masterPrizeForm.name, masterPrizeForm.yearsRequired);
    toast({
      title: "Prêmio Master atualizado!",
      description: `Novo prêmio: ${masterPrizeForm.name}`,
    });
  };
  
  const selectedChapterData = chapters.find(c => c.id === selectedChapter);
  
  return (
    <Layout>
      <div className="p-4 md:p-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2 flex items-center gap-3">
              <Settings className="w-8 h-8 text-primary" />
              Gerenciar Missões Anuais
            </h1>
            <p className="text-muted-foreground">
              Configure capítulos mensais, missões e o prêmio master
            </p>
          </div>
          
          <Tabs defaultValue="missions">
            <TabsList className="mb-6">
              <TabsTrigger value="missions">Missões</TabsTrigger>
              <TabsTrigger value="master-prize">Prêmio Master</TabsTrigger>
              <TabsTrigger value="settings">Configurações</TabsTrigger>
            </TabsList>
            
            <TabsContent value="missions">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Add Mission Form */}
                <Card className="p-6">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    Adicionar Missão
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <Label>Capítulo (Mês)</Label>
                      <Select value={selectedChapter} onValueChange={setSelectedChapter}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o mês" />
                        </SelectTrigger>
                        <SelectContent>
                          {chapters.map((chapter) => (
                            <SelectItem key={chapter.id} value={chapter.id}>
                              {chapter.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label>Título da Missão *</Label>
                      <Input
                        value={newMission.title}
                        onChange={(e) => setNewMission({ ...newMission, title: e.target.value })}
                        placeholder="Ex: Completar curso de liderança"
                      />
                    </div>
                    
                    <div>
                      <Label>Descrição</Label>
                      <Textarea
                        value={newMission.description}
                        onChange={(e) => setNewMission({ ...newMission, description: e.target.value })}
                        placeholder="Descreva os requisitos da missão..."
                      />
                    </div>
                    
                    <div>
                      <Label>Categoria</Label>
                      <Select 
                        value={newMission.category} 
                        onValueChange={(v) => setNewMission({ ...newMission, category: v as MissionCategory })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(categoryConfig).map(([key, config]) => (
                            <SelectItem key={key} value={key}>
                              <div className="flex items-center gap-2">
                                <div className={`w-3 h-3 rounded-full ${config.color}`} />
                                {config.label}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Recompensa (Coins)</Label>
                        <Input
                          type="number"
                          value={newMission.coinsReward}
                          onChange={(e) => setNewMission({ ...newMission, coinsReward: parseInt(e.target.value) || 0 })}
                        />
                      </div>
                      <div>
                        <Label>Recompensa (XP)</Label>
                        <Input
                          type="number"
                          value={newMission.xpReward}
                          onChange={(e) => setNewMission({ ...newMission, xpReward: parseInt(e.target.value) || 0 })}
                        />
                      </div>
                    </div>
                    
                    <Button onClick={handleAddMission} className="w-full">
                      <Plus className="w-4 h-4 mr-2" />
                      Adicionar Missão
                    </Button>
                  </div>
                </Card>
                
                {/* Chapter Preview */}
                <Card className="p-6">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    {selectedChapterData?.title || 'Selecione um capítulo'}
                  </h3>
                  
                  {selectedChapterData && (
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground mb-4">
                        {selectedChapterData.missions.length} missões configuradas
                        {selectedChapterData.missions.length < 3 && (
                          <Badge variant="destructive" className="ml-2">Mínimo 3</Badge>
                        )}
                        {selectedChapterData.missions.length > 7 && (
                          <Badge variant="destructive" className="ml-2">Máximo 7</Badge>
                        )}
                      </p>
                      
                      {selectedChapterData.missions.map((mission) => {
                        const config = categoryConfig[mission.category];
                        const Icon = config.icon;
                        
                        return (
                          <div 
                            key={mission.id}
                            className="p-3 rounded-lg bg-muted/50 flex items-start gap-3"
                          >
                            <div className={`p-2 rounded ${config.color}`}>
                              <Icon className="w-4 h-4 text-white" />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium">{mission.title}</p>
                              <p className="text-sm text-muted-foreground">{mission.description}</p>
                              <div className="flex gap-3 mt-1 text-xs">
                                <span className="text-yellow-500">+{mission.coinsReward} Coins</span>
                                <span className="text-blue-500">+{mission.xpReward} XP</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </Card>
              </div>
              
              {/* Mission Templates */}
              <Card className="p-6 mt-6">
                <h3 className="text-xl font-bold mb-4">Sugestões de Missões por Categoria</h3>
                <div className="grid md:grid-cols-5 gap-4">
                  {Object.entries(categoryConfig).map(([category, config]) => {
                    const Icon = config.icon;
                    const suggestions = [
                      category === 'development' && ['Concluir curso', 'Participar de treinamento', 'Tirar certificação'],
                      category === 'performance' && ['Bater meta mensal', 'Aumentar performance', 'Zero atrasos'],
                      category === 'engagement' && ['Ajudar colega', 'Criar conteúdo', 'Participar de reunião'],
                      category === 'culture' && ['Representar empresa', 'Praticar valor do mês', 'Ação voluntária'],
                      category === 'wellness' && ['Desafio fitness', 'Check-up anual', 'Programa de bem-estar'],
                    ].filter(Boolean)[0] as string[];
                    
                    return (
                      <div key={category} className="p-4 rounded-lg bg-muted/50">
                        <div className="flex items-center gap-2 mb-3">
                          <div className={`p-2 rounded ${config.color}`}>
                            <Icon className="w-4 h-4 text-white" />
                          </div>
                          <span className="font-semibold text-sm">{config.label}</span>
                        </div>
                        <ul className="text-xs text-muted-foreground space-y-1">
                          {suggestions?.map((s, i) => (
                            <li key={i}>• {s}</li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </TabsContent>
            
            <TabsContent value="master-prize">
              <Card className="p-6 max-w-xl">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Car className="w-5 h-5 text-yellow-500" />
                  Configurar Prêmio Master
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <Label>Nome do Prêmio</Label>
                    <Input
                      value={masterPrizeForm.name}
                      onChange={(e) => setMasterPrizeForm({ ...masterPrizeForm, name: e.target.value })}
                      placeholder="Ex: Carro Zero KM"
                    />
                  </div>
                  
                  <div>
                    <Label>Anos Necessários</Label>
                    <Input
                      type="number"
                      value={masterPrizeForm.yearsRequired}
                      onChange={(e) => setMasterPrizeForm({ ...masterPrizeForm, yearsRequired: parseInt(e.target.value) || 1 })}
                      min={1}
                      max={20}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Quantos selos anuais são necessários para conquistar o prêmio
                    </p>
                  </div>
                  
                  <div className="p-4 bg-yellow-500/10 rounded-lg">
                    <h4 className="font-semibold mb-2">Sugestões de Prêmios Master:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Carro zero KM</li>
                      <li>• Moto zero</li>
                      <li>• Intercâmbio internacional</li>
                      <li>• 1 mês de férias pagas</li>
                      <li>• Bônus financeiro de R$ 50.000</li>
                      <li>• Viagem dos sonhos com acompanhante</li>
                    </ul>
                  </div>
                  
                  <Button onClick={handleUpdateMasterPrize} className="w-full">
                    <Save className="w-4 h-4 mr-2" />
                    Salvar Configurações
                  </Button>
                </div>
              </Card>
            </TabsContent>
            
            <TabsContent value="settings">
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="p-6">
                  <h3 className="text-xl font-bold mb-4">Limite de Gastos Mensal</h3>
                  <p className="text-muted-foreground mb-4">
                    Atual: <span className="font-bold text-primary">{Math.round(spendingLimit * 100)}%</span> das moedas por mês
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Este limite incentiva os colaboradores a acumular moedas ao longo do tempo,
                    aumentando a retenção e o engajamento de longo prazo.
                  </p>
                </Card>
                
                <Card className="p-6">
                  <h3 className="text-xl font-bold mb-4">Regras dos Selos Anuais</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-2">
                      <Badge className="bg-gray-500">Padrão</Badge>
                      <span>Completar 10 de 12 capítulos mensais</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Badge className="bg-yellow-500">Dourado</Badge>
                      <span>Completar 12 de 12 capítulos (bônus extra de moedas)</span>
                    </div>
                  </div>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </Layout>
  );
};

export default AdminAnnualMissions;
