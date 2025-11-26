import { useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGameStore } from '@/store/useGameStore';
import { useToast } from '@/hooks/use-toast';
import { Settings, Users, BarChart3, Gift, Webhook, ArrowLeft } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const RaceConfig = () => {
  const { raceId } = useParams();
  const navigate = useNavigate();
  const { races, users, teams } = useGameStore();
  const { toast } = useToast();
  
  const race = races.find(r => r.id === raceId);
  
  const [selectedUsers, setSelectedUsers] = useState<string[]>(race?.participants || []);
  const [selectedIndicators, setSelectedIndicators] = useState<string[]>(race?.indicators || []);
  const [rewards, setRewards] = useState([
    { position: 1, prize: 'Troféu de Ouro + 5000 coins', points: 1000 },
    { position: 2, prize: 'Troféu de Prata + 3000 coins', points: 500 },
    { position: 3, prize: 'Troféu de Bronze + 2000 coins', points: 300 }
  ]);
  
  const [webhookUrl, setWebhookUrl] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [crmType, setCrmType] = useState('');

  const indicators = [
    { id: 'vendas', name: 'Vendas Realizadas', weight: 100 },
    { id: 'prospeccao', name: 'Prospecções Feitas', weight: 50 },
    { id: 'reunioes', name: 'Reuniões Agendadas', weight: 75 },
    { id: 'propostas', name: 'Propostas Enviadas', weight: 80 },
    { id: 'conversoes', name: 'Conversões', weight: 150 }
  ];

  if (!race) {
    return (
      <Layout>
        <div className="p-8">
          <h1 className="text-2xl font-bold">Corrida não encontrada</h1>
        </div>
      </Layout>
    );
  }

  const handleSaveConfig = () => {
    toast({
      title: "Configurações salvas!",
      description: "As configurações da corrida foram atualizadas.",
    });
  };

  const handleToggleUser = (userId: string) => {
    setSelectedUsers(prev =>
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  const handleToggleIndicator = (indicatorId: string) => {
    setSelectedIndicators(prev =>
      prev.includes(indicatorId) ? prev.filter(id => id !== indicatorId) : [...prev, indicatorId]
    );
  };

  return (
    <Layout>
      <div className="p-8">
        <Button 
          onClick={() => navigate('/admin/races')}
          variant="ghost"
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar para Corridas
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold mb-2">Configurar Corrida 🏁</h1>
          <p className="text-muted-foreground mb-8">{race.name}</p>

          <Tabs defaultValue="lineup" className="w-full">
            <TabsList className="grid w-full max-w-2xl grid-cols-4">
              <TabsTrigger value="lineup">Escalação</TabsTrigger>
              <TabsTrigger value="indicators">Indicadores</TabsTrigger>
              <TabsTrigger value="rewards">Recompensas</TabsTrigger>
              <TabsTrigger value="integrations">Integrações</TabsTrigger>
            </TabsList>

            <TabsContent value="lineup" className="mt-6">
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Selecionar Participantes
                </h3>

                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-3">Por Usuário</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {users.map(user => (
                        <div key={user.id} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                          <Checkbox
                            checked={selectedUsers.includes(user.id)}
                            onCheckedChange={() => handleToggleUser(user.id)}
                          />
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{user.avatar}</span>
                            <div>
                              <p className="font-medium">{user.name}</p>
                              <p className="text-sm text-muted-foreground">{user.points} pts</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Por Equipe</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {teams.map(team => (
                        <div key={team.id} className="p-3 bg-muted rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <p className="font-medium">{team.name}</p>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                const teamUserIds = users
                                  .filter(u => team.members.includes(u.id))
                                  .map(u => u.id);
                                setSelectedUsers(prev => [...new Set([...prev, ...teamUserIds])]);
                              }}
                            >
                              Adicionar Todos
                            </Button>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {team.members.length} membros • {team.points} pts total
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <Button onClick={handleSaveConfig} className="w-full mt-6 bg-gradient-to-r from-primary to-secondary">
                  Salvar Escalação ({selectedUsers.length} selecionados)
                </Button>
              </Card>
            </TabsContent>

            <TabsContent value="indicators" className="mt-6">
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Indicadores de Pontuação
                </h3>

                <p className="text-muted-foreground mb-6">
                  Selecione quais indicadores contarão para a pontuação dos participantes
                </p>

                <div className="space-y-3">
                  {indicators.map(indicator => (
                    <div key={indicator.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                      <div className="flex items-center gap-3">
                        <Checkbox
                          checked={selectedIndicators.includes(indicator.id)}
                          onCheckedChange={() => handleToggleIndicator(indicator.id)}
                        />
                        <div>
                          <p className="font-medium">{indicator.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Peso: {indicator.weight} pontos por ação
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Button onClick={handleSaveConfig} className="w-full mt-6 bg-gradient-to-r from-primary to-secondary">
                  Salvar Indicadores ({selectedIndicators.length} selecionados)
                </Button>
              </Card>
            </TabsContent>

            <TabsContent value="rewards" className="mt-6">
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Gift className="w-5 h-5" />
                  Premiação e Recompensas
                </h3>

                <div className="space-y-4">
                  {rewards.map((reward, index) => (
                    <div key={index} className="p-4 bg-muted rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label>Posição</Label>
                          <Input
                            type="number"
                            value={reward.position}
                            onChange={(e) => {
                              const newRewards = [...rewards];
                              newRewards[index].position = parseInt(e.target.value);
                              setRewards(newRewards);
                            }}
                          />
                        </div>
                        <div>
                          <Label>Prêmio</Label>
                          <Input
                            value={reward.prize}
                            onChange={(e) => {
                              const newRewards = [...rewards];
                              newRewards[index].prize = e.target.value;
                              setRewards(newRewards);
                            }}
                          />
                        </div>
                        <div>
                          <Label>Pontos XP Bônus</Label>
                          <Input
                            type="number"
                            value={reward.points}
                            onChange={(e) => {
                              const newRewards = [...rewards];
                              newRewards[index].points = parseInt(e.target.value);
                              setRewards(newRewards);
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Button
                  variant="outline"
                  className="w-full mt-4"
                  onClick={() => setRewards([...rewards, { position: rewards.length + 1, prize: '', points: 0 }])}
                >
                  + Adicionar Posição de Premiação
                </Button>

                <Button onClick={handleSaveConfig} className="w-full mt-4 bg-gradient-to-r from-primary to-secondary">
                  Salvar Recompensas
                </Button>
              </Card>
            </TabsContent>

            <TabsContent value="integrations" className="mt-6">
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Webhook className="w-5 h-5" />
                  Integrações e APIs Externas
                </h3>

                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-3">CRM Integration</h4>
                    <div className="space-y-4">
                      <div>
                        <Label>Tipo de CRM</Label>
                        <Select value={crmType} onValueChange={setCrmType}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o CRM" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="hubspot">HubSpot</SelectItem>
                            <SelectItem value="salesforce">Salesforce</SelectItem>
                            <SelectItem value="pipedrive">Pipedrive</SelectItem>
                            <SelectItem value="rdstation">RD Station</SelectItem>
                            <SelectItem value="custom">CRM Personalizado</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>API Key</Label>
                        <Input
                          type="password"
                          value={apiKey}
                          onChange={(e) => setApiKey(e.target.value)}
                          placeholder="Cole sua API key aqui..."
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Webhook Configuration</h4>
                    <div className="space-y-4">
                      <div>
                        <Label>Webhook URL</Label>
                        <Input
                          value={webhookUrl}
                          onChange={(e) => setWebhookUrl(e.target.value)}
                          placeholder="https://seu-crm.com/api/webhook"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Enviaremos atualizações de pontuação para esta URL
                        </p>
                      </div>

                      <div className="p-4 bg-muted rounded-lg">
                        <p className="text-sm font-medium mb-2">Eventos enviados:</p>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• Atualização de pontuação de participante</li>
                          <li>• Conclusão de indicador</li>
                          <li>• Início e fim de corrida</li>
                          <li>• Mudança de ranking</li>
                        </ul>
                      </div>

                      <Button variant="outline" className="w-full">
                        Testar Webhook
                      </Button>
                    </div>
                  </div>
                </div>

                <Button onClick={handleSaveConfig} className="w-full mt-6 bg-gradient-to-r from-primary to-secondary">
                  Salvar Integrações
                </Button>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </Layout>
  );
};

export default RaceConfig;