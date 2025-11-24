import { useState } from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGameStore } from '@/store/useGameStore';
import { useToast } from '@/hooks/use-toast';
import { Users, Plus } from 'lucide-react';

const AdminTeams = () => {
  const { teams, addTeam } = useGameStore();
  const { toast } = useToast();
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamType, setNewTeamType] = useState<'vendas' | 'prospeccao'>('vendas');

  const handleAddTeam = () => {
    if (!newTeamName.trim()) return;

    addTeam({
      id: Date.now().toString(),
      name: newTeamName,
      type: newTeamType,
      members: [],
      points: 0
    });

    toast({
      title: "Equipe criada!",
      description: `${newTeamName} foi adicionada ao sistema.`,
    });

    setNewTeamName('');
  };

  return (
    <Layout>
      <div className="p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold mb-2">Gerenciar Equipes 👥</h1>
          <p className="text-muted-foreground mb-8">
            Crie e gerencie as equipes de vendas e prospecção
          </p>

          <Card className="p-6 mb-8">
            <h3 className="text-xl font-semibold mb-4">Criar Nova Equipe</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="team-name">Nome da Equipe</Label>
                <Input
                  id="team-name"
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  placeholder="Ex: Equipe Alpha"
                />
              </div>
              <div>
                <Label htmlFor="team-type">Tipo</Label>
                <Select value={newTeamType} onValueChange={(v) => setNewTeamType(v as 'vendas' | 'prospeccao')}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vendas">Vendas</SelectItem>
                    <SelectItem value="prospeccao">Prospecção</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button onClick={handleAddTeam} className="w-full bg-gradient-to-r from-primary to-secondary">
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar
                </Button>
              </div>
            </div>
          </Card>

          <div className="grid gap-6">
            {teams.map((team, index) => (
              <motion.div
                key={team.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-primary/20 rounded-lg">
                        <Users className="w-8 h-8 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">{team.name}</h3>
                        <p className="text-muted-foreground">
                          {team.type === 'vendas' ? '💼 Vendas' : '🎯 Prospecção'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold text-primary">{team.points}</p>
                      <p className="text-sm text-muted-foreground">pontos</p>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm text-muted-foreground mb-2">
                      Membros: {team.members.length}
                    </p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default AdminTeams;
