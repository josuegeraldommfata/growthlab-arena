import { useState } from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useGameStore } from '@/store/useGameStore';
import { useToast } from '@/hooks/use-toast';
import { 
  Users, Plus, Search, Edit2, Trash2, Crown, Zap, Coins, 
  TrendingUp, UserPlus, MoreVertical 
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const AdminUsers = () => {
  const { users, teams } = useGameStore();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('all');
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [editingUser, setEditingUser] = useState<typeof users[0] | null>(null);
  
  const [newUser, setNewUser] = useState({
    name: '',
    avatar: '👤',
    points: 0,
    teamId: ''
  });

  const avatarOptions = ['👤', '👩', '👨', '🧑', '👩‍💼', '👨‍💼', '🦸', '🦹', '🧙', '🎅', '👸', '🤴'];

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTeam = selectedTeam === 'all' || teams.find(t => t.members.includes(user.id))?.id === selectedTeam;
    return matchesSearch && matchesTeam;
  });

  const sortedUsers = [...filteredUsers].sort((a, b) => b.points - a.points);

  const getUserTeam = (userId: string) => {
    return teams.find(t => t.members.includes(userId));
  };

  const handleAddUser = () => {
    if (!newUser.name) {
      toast({
        title: "Erro",
        description: "Preencha o nome do usuário",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Usuário adicionado!",
      description: `${newUser.name} foi adicionado ao sistema.`,
    });

    setNewUser({ name: '', avatar: '👤', points: 0, teamId: '' });
    setIsAddingUser(false);
  };

  const handleEditUser = () => {
    if (!editingUser) return;
    
    toast({
      title: "Usuário atualizado!",
      description: `${editingUser.name} foi atualizado.`,
    });
    
    setEditingUser(null);
  };

  const handleDeleteUser = (userId: string, userName: string) => {
    toast({
      title: "Usuário removido",
      description: `${userName} foi removido do sistema.`,
      variant: "destructive"
    });
  };

  const getRankBadge = (index: number) => {
    if (index === 0) return <Crown className="w-5 h-5 text-yellow-500" />;
    if (index === 1) return <Crown className="w-5 h-5 text-gray-400" />;
    if (index === 2) return <Crown className="w-5 h-5 text-amber-600" />;
    return <span className="text-sm font-bold text-muted-foreground">#{index + 1}</span>;
  };

  return (
    <Layout>
      <div className="p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">Gerenciar Usuários 👥</h1>
              <p className="text-muted-foreground">
                {users.length} usuários cadastrados no sistema
              </p>
            </div>
            
            <Button onClick={() => setIsAddingUser(true)} className="bg-gradient-to-r from-primary to-secondary">
              <UserPlus className="w-4 h-4 mr-2" />
              Adicionar Usuário
            </Button>
          </div>

          {/* Filters */}
          <Card className="p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar usuário..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedTeam} onValueChange={setSelectedTeam}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Filtrar por equipe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as equipes</SelectItem>
                  {teams.map(team => (
                    <SelectItem key={team.id} value={team.id}>{team.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </Card>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <Users className="w-8 h-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{users.length}</p>
                  <p className="text-xs text-muted-foreground">Total Usuários</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-8 h-8 text-secondary" />
                <div>
                  <p className="text-2xl font-bold">{users.reduce((acc, u) => acc + u.points, 0)}</p>
                  <p className="text-xs text-muted-foreground">Pontos Totais</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <Zap className="w-8 h-8 text-accent" />
                <div>
                  <p className="text-2xl font-bold">{Math.round(users.reduce((acc, u) => acc + u.points, 0) / users.length)}</p>
                  <p className="text-xs text-muted-foreground">Média de Pontos</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <Crown className="w-8 h-8 text-yellow-500" />
                <div>
                  <p className="text-2xl font-bold">{sortedUsers[0]?.name.split(' ')[0] || '-'}</p>
                  <p className="text-xs text-muted-foreground">Líder Atual</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Users List */}
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left p-4 font-semibold">Rank</th>
                    <th className="text-left p-4 font-semibold">Usuário</th>
                    <th className="text-left p-4 font-semibold">Equipe</th>
                    <th className="text-left p-4 font-semibold">Pontos</th>
                    <th className="text-right p-4 font-semibold">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedUsers.map((user, index) => {
                    const team = getUserTeam(user.id);
                    
                    return (
                      <motion.tr
                        key={user.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.03 }}
                        className="border-b border-border hover:bg-muted/50 transition-colors"
                      >
                        <td className="p-4">
                          <div className="flex items-center justify-center w-8 h-8">
                            {getRankBadge(index)}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{user.avatar}</span>
                            <div>
                              <p className="font-semibold">{user.name}</p>
                              <p className="text-xs text-muted-foreground">ID: {user.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          {team ? (
                            <Badge variant="outline">
                              {team.name}
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground text-sm">Sem equipe</span>
                          )}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-primary">{user.points}</span>
                            <span className="text-xs text-muted-foreground">pts</span>
                          </div>
                        </td>
                        <td className="p-4 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => setEditingUser(user)}>
                                <Edit2 className="w-4 h-4 mr-2" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleDeleteUser(user.id, user.name)}
                                className="text-destructive"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Remover
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </motion.div>

        {/* Add User Dialog */}
        <Dialog open={isAddingUser} onOpenChange={setIsAddingUser}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Novo Usuário</DialogTitle>
              <DialogDescription>
                Preencha os dados do novo usuário
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div>
                <Label>Nome</Label>
                <Input
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  placeholder="Nome do usuário"
                />
              </div>
              
              <div>
                <Label>Avatar</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {avatarOptions.map(avatar => (
                    <Button
                      key={avatar}
                      variant={newUser.avatar === avatar ? "default" : "outline"}
                      size="icon"
                      onClick={() => setNewUser({ ...newUser, avatar })}
                    >
                      {avatar}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div>
                <Label>Equipe</Label>
                <Select
                  value={newUser.teamId}
                  onValueChange={(value) => setNewUser({ ...newUser, teamId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma equipe" />
                  </SelectTrigger>
                  <SelectContent>
                    {teams.map(team => (
                      <SelectItem key={team.id} value={team.id}>{team.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Pontos Iniciais</Label>
                <Input
                  type="number"
                  value={newUser.points}
                  onChange={(e) => setNewUser({ ...newUser, points: parseInt(e.target.value) || 0 })}
                />
              </div>
              
              <Button onClick={handleAddUser} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Usuário
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit User Dialog */}
        <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Usuário</DialogTitle>
              <DialogDescription>
                Atualize os dados do usuário
              </DialogDescription>
            </DialogHeader>
            
            {editingUser && (
              <div className="space-y-4 py-4">
                <div>
                  <Label>Nome</Label>
                  <Input
                    value={editingUser.name}
                    onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                  />
                </div>
                
                <div>
                  <Label>Avatar</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {avatarOptions.map(avatar => (
                      <Button
                        key={avatar}
                        variant={editingUser.avatar === avatar ? "default" : "outline"}
                        size="icon"
                        onClick={() => setEditingUser({ ...editingUser, avatar })}
                      >
                        {avatar}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <Label>Pontos</Label>
                  <Input
                    type="number"
                    value={editingUser.points}
                    onChange={(e) => setEditingUser({ ...editingUser, points: parseInt(e.target.value) || 0 })}
                  />
                </div>
                
                <Button onClick={handleEditUser} className="w-full">
                  Salvar Alterações
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default AdminUsers;
