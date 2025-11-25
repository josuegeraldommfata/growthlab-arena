import { useState } from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGameStore, Race } from '@/store/useGameStore';
import { useToast } from '@/hooks/use-toast';
import { Trophy, Plus, Calendar, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminRaces = () => {
  const { races, addRace } = useGameStore();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    theme: '',
    status: 'upcoming' as Race['status'],
    startDate: '',
    endDate: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    addRace({
      id: Date.now().toString(),
      ...formData,
      participants: [],
      indicators: ['vendas', 'prospeccao']
    });

    toast({
      title: "Corrida criada!",
      description: `${formData.name} foi adicionada ao sistema.`,
    });

    setFormData({
      name: '',
      theme: '',
      status: 'upcoming',
      startDate: '',
      endDate: ''
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
          <h1 className="text-4xl font-bold mb-2">Gerenciar Corridas 🏁</h1>
          <p className="text-muted-foreground mb-8">
            Crie e configure as corridas de gamificação
          </p>

          <Card className="p-6 mb-8">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Criar Nova Corrida
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="race-name">Nome da Corrida</Label>
                  <Input
                    id="race-name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ex: Sprint Q1 2024"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="race-status">Status</Label>
                  <Select 
                    value={formData.status} 
                    onValueChange={(v) => setFormData({ ...formData, status: v as Race['status'] })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="upcoming">Em breve</SelectItem>
                      <SelectItem value="active">Ativa</SelectItem>
                      <SelectItem value="finished">Finalizada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="race-theme">Tema</Label>
                <Textarea
                  id="race-theme"
                  value={formData.theme}
                  onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
                  placeholder="Descreva o tema da corrida..."
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="start-date">Data de Início</Label>
                  <Input
                    id="start-date"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="end-date">Data de Término</Label>
                  <Input
                    id="end-date"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full bg-gradient-to-r from-primary to-secondary">
                <Plus className="w-4 h-4 mr-2" />
                Criar Corrida
              </Button>
            </form>
          </Card>

          <div className="grid gap-6">
            {races.map((race, index) => (
              <motion.div
                key={race.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Trophy className="w-8 h-8 text-primary" />
                      <div>
                        <h3 className="text-xl font-bold">{race.name}</h3>
                        <p className="text-muted-foreground">{race.theme}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      race.status === 'active' ? 'bg-primary/20 text-primary' :
                      race.status === 'upcoming' ? 'bg-secondary/20 text-secondary' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      {race.status === 'active' ? 'Ativa' : race.status === 'upcoming' ? 'Em breve' : 'Finalizada'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Início</p>
                      <p className="font-medium flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {new Date(race.startDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Término</p>
                      <p className="font-medium flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {new Date(race.endDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <Button 
                    onClick={() => navigate(`/race-track/${race.id}`)}
                    className="w-full mt-4 bg-gradient-to-r from-primary to-secondary"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Visualizar Pista
                  </Button>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default AdminRaces;
