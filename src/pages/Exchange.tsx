import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useAuthStore } from '@/store/useAuthStore';
import { useRewardsStore, Reward } from '@/store/useRewardsStore';
import { 
  Gift, Coins, ShoppingCart, UtensilsCrossed, Ticket, Plane, Tv, Package,
  Sparkles, CheckCircle, Clock, Truck, History
} from 'lucide-react';

const Exchange = () => {
  const { toast } = useToast();
  const { user, updateUser } = useAuthStore();
  const { rewards, requestExchange, getUserExchanges } = useRewardsStore();
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);

  const userExchanges = user ? getUserExchanges(user.id) : [];

  const handleExchange = (reward: Reward) => {
    if (!user) return;

    if ((user.coins || 0) < reward.price) {
      toast({
        title: "Coins insuficientes!",
        description: `Você precisa de ${reward.price} coins, mas tem apenas ${user.coins || 0}.`,
        variant: "destructive"
      });
      return;
    }

    if (reward.stock <= 0) {
      toast({
        title: "Produto esgotado!",
        description: "Este prêmio não está mais disponível.",
        variant: "destructive"
      });
      return;
    }

    // Deduct coins
    updateUser({ coins: (user.coins || 0) - reward.price });
    
    // Register exchange
    requestExchange(user.id, reward);

    toast({
      title: "🎉 Troca solicitada!",
      description: `${reward.name} será entregue em breve!`,
    });

    setSelectedReward(null);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'food': return <UtensilsCrossed className="w-4 h-4" />;
      case 'voucher': return <Ticket className="w-4 h-4" />;
      case 'experience': return <Gift className="w-4 h-4" />;
      case 'subscription': return <Tv className="w-4 h-4" />;
      case 'travel': return <Plane className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  const getTierColor = (tier?: string) => {
    switch (tier) {
      case '1D': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case '2D': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case '3D': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case '4D': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      default: return '';
    }
  };

  const getTierGlow = (tier?: string) => {
    switch (tier) {
      case '4D': return 'shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40';
      case '3D': return 'shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40';
      case '2D': return 'shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40';
      default: return '';
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
      pending: 'Aguardando',
      approved: 'Aprovado',
      delivered: 'Entregue'
    };
    return labels[status] || status;
  };

  const filteredRewards = activeCategory === 'all' 
    ? rewards 
    : rewards.filter(r => r.category === activeCategory);

  const categories = [
    { id: 'all', label: 'Todos', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'food', label: 'Alimentos', icon: <UtensilsCrossed className="w-4 h-4" /> },
    { id: 'voucher', label: 'Vales', icon: <Ticket className="w-4 h-4" /> },
    { id: 'experience', label: 'Experiências', icon: <Gift className="w-4 h-4" /> },
    { id: 'subscription', label: 'Assinaturas', icon: <Tv className="w-4 h-4" /> },
    { id: 'travel', label: 'Viagens', icon: <Plane className="w-4 h-4" /> },
  ];

  return (
    <Layout>
      <div className="p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header with coins balance */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">Troca de Prêmios 🎁</h1>
              <p className="text-muted-foreground">
                Troque seus coins por prêmios incríveis!
              </p>
            </div>
            
            <Card className="p-4 bg-gradient-to-r from-primary/20 to-secondary/20 border-primary/30">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary/30 rounded-full">
                  <Coins className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Seus Coins</p>
                  <p className="text-3xl font-bold text-primary">{user?.coins || 0}</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Tabs for categories and history */}
          <Tabs defaultValue="shop" className="space-y-6">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="shop" className="flex items-center gap-2">
                <ShoppingCart className="w-4 h-4" />
                Loja
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-2">
                <History className="w-4 h-4" />
                Minhas Trocas ({userExchanges.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="shop" className="space-y-6">
              {/* Category filters */}
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <Button
                    key={cat.id}
                    variant={activeCategory === cat.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveCategory(cat.id)}
                    className="flex items-center gap-2"
                  >
                    {cat.icon}
                    {cat.label}
                  </Button>
                ))}
              </div>

              {/* Rewards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                <AnimatePresence mode="popLayout">
                  {filteredRewards.map((reward, index) => {
                    const canAfford = (user?.coins || 0) >= reward.price;
                    const inStock = reward.stock > 0;
                    
                    return (
                      <motion.div
                        key={reward.id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ delay: index * 0.02 }}
                      >
                        <Card 
                          className={`p-4 transition-all duration-300 cursor-pointer group relative overflow-hidden
                            ${getTierGlow(reward.tier)}
                            ${!canAfford || !inStock ? 'opacity-60' : 'hover:scale-105'}
                          `}
                          onClick={() => canAfford && inStock && setSelectedReward(reward)}
                        >
                          {/* Tier badge */}
                          {reward.tier && (
                            <Badge className={`absolute top-2 right-2 ${getTierColor(reward.tier)}`}>
                              {reward.tier}
                            </Badge>
                          )}
                          
                          {/* Out of stock overlay */}
                          {!inStock && (
                            <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-10">
                              <Badge variant="destructive">Esgotado</Badge>
                            </div>
                          )}

                          <div className="text-center mb-3">
                            <span className="text-4xl block mb-2 group-hover:scale-110 transition-transform">
                              {reward.emoji}
                            </span>
                            <h3 className="font-semibold text-sm leading-tight line-clamp-2">
                              {reward.name}
                            </h3>
                          </div>
                          
                          <div className="flex items-center justify-between mt-auto pt-2 border-t border-border/50">
                            <span className={`flex items-center gap-1 font-bold text-sm ${canAfford ? 'text-primary' : 'text-destructive'}`}>
                              <Coins className="w-4 h-4" />
                              {reward.price}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {reward.stock} restantes
                            </span>
                          </div>
                        </Card>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </TabsContent>

            <TabsContent value="history" className="space-y-4">
              {userExchanges.length === 0 ? (
                <Card className="p-8 text-center">
                  <Gift className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    Você ainda não fez nenhuma troca. Explore a loja!
                  </p>
                </Card>
              ) : (
                <div className="space-y-3">
                  {userExchanges.map((exchange) => (
                    <Card key={exchange.id} className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(exchange.status)}
                          <div>
                            <p className="font-semibold">{exchange.rewardName}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(exchange.date).toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1 text-primary font-bold">
                            <Coins className="w-4 h-4" />
                            -{exchange.price}
                          </span>
                          <Badge variant="outline">
                            {getStatusLabel(exchange.status)}
                          </Badge>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>

          {/* Confirmation Modal */}
          <AnimatePresence>
            {selectedReward && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                onClick={() => setSelectedReward(null)}
              >
                <motion.div
                  initial={{ scale: 0.9, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.9, y: 20 }}
                  className="w-full max-w-md"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Card className="p-6">
                    <div className="text-center mb-6">
                      <span className="text-6xl block mb-4">{selectedReward.emoji}</span>
                      <h2 className="text-2xl font-bold mb-2">{selectedReward.name}</h2>
                      {selectedReward.description && (
                        <p className="text-muted-foreground">{selectedReward.description}</p>
                      )}
                      
                      <div className="flex items-center justify-center gap-2 mt-4">
                        <Coins className="w-6 h-6 text-primary" />
                        <span className="text-3xl font-bold text-primary">{selectedReward.price}</span>
                        <span className="text-muted-foreground">coins</span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="p-4 bg-muted rounded-lg">
                        <div className="flex justify-between text-sm">
                          <span>Seus coins:</span>
                          <span className="font-bold">{user?.coins || 0}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Custo:</span>
                          <span className="font-bold text-destructive">-{selectedReward.price}</span>
                        </div>
                        <div className="border-t border-border mt-2 pt-2 flex justify-between">
                          <span>Saldo após troca:</span>
                          <span className="font-bold text-primary">
                            {(user?.coins || 0) - selectedReward.price}
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <Button
                          variant="outline"
                          className="flex-1"
                          onClick={() => setSelectedReward(null)}
                        >
                          Cancelar
                        </Button>
                        <Button
                          className="flex-1 bg-gradient-to-r from-primary to-secondary"
                          onClick={() => handleExchange(selectedReward)}
                        >
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          Confirmar Troca
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Exchange;
