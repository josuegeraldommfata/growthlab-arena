import { useState } from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useRewardsStore, Reward } from '@/store/useRewardsStore';
import { 
  Gift, Plus, Coins, Trash2, Edit, Package, 
  UtensilsCrossed, Ticket, Plane, Tv, CheckCircle, Clock, Truck
} from 'lucide-react';

const AdminRewards = () => {
  const { toast } = useToast();
  const { rewards, exchanges, addReward, deleteReward, updateExchangeStatus } = useRewardsStore();
  const [activeTab, setActiveTab] = useState('rewards');
  
  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    category: 'food' as Reward['category'],
    emoji: '🎁',
    stock: 10,
    tier: '' as Reward['tier'] | ''
  });

  const handleAddReward = (e: React.FormEvent) => {
    e.preventDefault();
    
    addReward({
      ...formData,
      tier: formData.tier || undefined
    });

    toast({
      title: "Recompensa adicionada!",
      description: `${formData.name} foi adicionada ao catálogo.`,
    });

    setFormData({
      name: '',
      price: 0,
      category: 'food',
      emoji: '🎁',
      stock: 10,
      tier: ''
    });
  };

  const handleDelete = (id: string, name: string) => {
    deleteReward(id);
    toast({
      title: "Recompensa removida",
      description: `${name} foi removida do catálogo.`,
    });
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'food': return <UtensilsCrossed className="w-5 h-5" />;
      case 'voucher': return <Ticket className="w-5 h-5" />;
      case 'experience': return <Gift className="w-5 h-5" />;
      case 'subscription': return <Tv className="w-5 h-5" />;
      case 'travel': return <Plane className="w-5 h-5" />;
      default: return <Package className="w-5 h-5" />;
    }
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      food: 'Alimentos',
      voucher: 'Vales',
      experience: 'Experiências',
      subscription: 'Assinaturas',
      travel: 'Viagens'
    };
    return labels[category] || category;
  };

  const getTierColor = (tier?: string) => {
    switch (tier) {
      case '1D': return 'bg-emerald-500/20 text-emerald-400';
      case '2D': return 'bg-blue-500/20 text-blue-400';
      case '3D': return 'bg-purple-500/20 text-purple-400';
      case '4D': return 'bg-amber-500/20 text-amber-400';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'approved': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'delivered': return <Truck className="w-4 h-4 text-blue-500" />;
      default: return null;
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: 'Pendente',
      approved: 'Aprovado',
      delivered: 'Entregue'
    };
    return labels[status] || status;
  };

  const categories = ['food', 'voucher', 'experience', 'subscription', 'travel'];

  return (
    <Layout>
      <div className="p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold mb-2">Gerenciar Recompensas 🎁</h1>
          <p className="text-muted-foreground mb-8">
            Configure os prêmios disponíveis para troca de pontos
          </p>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="rewards">Catálogo</TabsTrigger>
              <TabsTrigger value="exchanges">Solicitações ({exchanges.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="rewards" className="space-y-6">
              {/* Form to add new reward */}
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Adicionar Nova Recompensa
                </h3>
                <form onSubmit={handleAddReward} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="reward-name">Nome da Recompensa</Label>
                      <Input
                        id="reward-name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Ex: Vale Uber R$20"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="reward-emoji">Emoji</Label>
                      <Input
                        id="reward-emoji"
                        value={formData.emoji}
                        onChange={(e) => setFormData({ ...formData, emoji: e.target.value })}
                        placeholder="🎁"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <Label htmlFor="reward-price">Preço (Coins)</Label>
                      <Input
                        id="reward-price"
                        type="number"
                        min="0"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="reward-stock">Estoque</Label>
                      <Input
                        id="reward-stock"
                        type="number"
                        min="0"
                        value={formData.stock}
                        onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="reward-category">Categoria</Label>
                      <select
                        id="reward-category"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value as Reward['category'] })}
                        className="w-full h-10 px-3 rounded-md border border-input bg-background"
                      >
                        <option value="food">Alimentos</option>
                        <option value="voucher">Vales</option>
                        <option value="experience">Experiências</option>
                        <option value="subscription">Assinaturas</option>
                        <option value="travel">Viagens</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="reward-tier">Tier (opcional)</Label>
                      <select
                        id="reward-tier"
                        value={formData.tier}
                        onChange={(e) => setFormData({ ...formData, tier: e.target.value as Reward['tier'] | '' })}
                        className="w-full h-10 px-3 rounded-md border border-input bg-background"
                      >
                        <option value="">Sem tier</option>
                        <option value="1D">1D (R$0-R$10)</option>
                        <option value="2D">2D (R$10-R$30)</option>
                        <option value="3D">3D (R$31-R$100)</option>
                        <option value="4D">4D (R$100+)</option>
                      </select>
                    </div>
                  </div>

                  <Button type="submit" className="w-full bg-gradient-to-r from-primary to-secondary">
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Recompensa
                  </Button>
                </form>
              </Card>

              {/* Rewards by category */}
              {categories.map((category) => {
                const categoryRewards = rewards.filter(r => r.category === category);
                if (categoryRewards.length === 0) return null;

                return (
                  <div key={category} className="space-y-4">
                    <h3 className="text-xl font-semibold flex items-center gap-2">
                      {getCategoryIcon(category)}
                      {getCategoryLabel(category)} ({categoryRewards.length})
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {categoryRewards.map((reward, index) => (
                        <motion.div
                          key={reward.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <Card className="p-4 hover:shadow-lg transition-shadow relative group">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive"
                              onClick={() => handleDelete(reward.id, reward.name)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                            
                            <div className="flex items-start gap-3 mb-3">
                              <span className="text-3xl">{reward.emoji}</span>
                              <div className="flex-1">
                                <h4 className="font-semibold text-sm leading-tight">{reward.name}</h4>
                                {reward.tier && (
                                  <Badge className={`mt-1 ${getTierColor(reward.tier)}`}>
                                    {reward.tier}
                                  </Badge>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <span className="flex items-center gap-1 text-primary font-bold">
                                <Coins className="w-4 h-4" />
                                {reward.price}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                Estoque: {reward.stock}
                              </span>
                            </div>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </TabsContent>

            <TabsContent value="exchanges" className="space-y-4">
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">Solicitações de Troca</h3>
                
                {exchanges.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    Nenhuma solicitação de troca ainda.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {exchanges.map((exchange) => (
                      <Card key={exchange.id} className="p-4 bg-card/50">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            {getStatusIcon(exchange.status)}
                            <div>
                              <p className="font-semibold">{exchange.rewardName}</p>
                              <p className="text-sm text-muted-foreground">
                                Usuário: {exchange.userId} • {new Date(exchange.date).toLocaleDateString('pt-BR')}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1 text-primary font-bold">
                              <Coins className="w-4 h-4" />
                              {exchange.price}
                            </span>
                            
                            <div className="flex gap-2">
                              {exchange.status === 'pending' && (
                                <Button
                                  size="sm"
                                  onClick={() => updateExchangeStatus(exchange.id, 'approved')}
                                >
                                  Aprovar
                                </Button>
                              )}
                              {exchange.status === 'approved' && (
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  onClick={() => updateExchangeStatus(exchange.id, 'delivered')}
                                >
                                  Marcar Entregue
                                </Button>
                              )}
                              <Badge variant="outline">
                                {getStatusLabel(exchange.status)}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </Layout>
  );
};

export default AdminRewards;
