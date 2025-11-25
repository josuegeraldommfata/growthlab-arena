import { useState } from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/store/useAuthStore';
import { useShopStore, ShopItem } from '@/store/useShopStore';
import { ShoppingCart, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Shop = () => {
  const user = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);
  const { items, purchaseItem, getUserItems } = useShopStore();
  const { toast } = useToast();
  const [filter, setFilter] = useState<'all' | 'character' | 'car'>('all');

  const userItems = user ? getUserItems(user.id) : [];
  const userItemIds = userItems.map(item => item.id);

  const filteredItems = items.filter(item => 
    filter === 'all' || item.type === filter
  );

  const getRarityColor = (rarity: ShopItem['rarity']) => {
    switch(rarity) {
      case 'common': return 'bg-slate-500';
      case 'rare': return 'bg-blue-500';
      case 'epic': return 'bg-purple-500';
      case 'legendary': return 'bg-amber-500';
    }
  };

  const handlePurchase = (item: ShopItem) => {
    if (!user) return;

    if (userItemIds.includes(item.id)) {
      toast({
        title: "Item já possui!",
        description: "Você já comprou este item.",
        variant: "destructive"
      });
      return;
    }

    if ((user.coins || 0) < item.price) {
      toast({
        title: "Coins insuficientes!",
        description: `Você precisa de ${item.price} coins para comprar este item.`,
        variant: "destructive"
      });
      return;
    }

    purchaseItem(user.id, item.id);
    updateUser({ coins: (user.coins || 0) - item.price });

    toast({
      title: "Compra realizada!",
      description: `Você comprou ${item.name}!`,
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
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-4xl font-heading font-bold mb-2">Loja 🛍️</h1>
              <p className="text-muted-foreground">
                Troque seus coins por personagens e carrinhos incríveis!
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Seus Coins</p>
              <p className="text-3xl font-bold text-primary">{user?.coins || 0} 🪙</p>
            </div>
          </div>

          <Tabs defaultValue="all" className="mb-6">
            <TabsList>
              <TabsTrigger value="all" onClick={() => setFilter('all')}>Todos</TabsTrigger>
              <TabsTrigger value="character" onClick={() => setFilter('character')}>Personagens</TabsTrigger>
              <TabsTrigger value="car" onClick={() => setFilter('car')}>Carrinhos</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-6">
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {filteredItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.02 }}
                  >
                    <Card className="p-4 text-center hover:shadow-lg transition-all">
                      <div className="relative">
                        <div className="text-5xl mb-2">{item.emoji}</div>
                        <Badge className={`${getRarityColor(item.rarity)} text-white text-xs mb-2`}>
                          {item.rarity}
                        </Badge>
                      </div>
                      <h3 className="font-semibold text-sm mb-1">{item.name}</h3>
                      <div className="flex items-center justify-center gap-1 mb-3">
                        <Star className="w-4 h-4 text-amber-500 fill-current" />
                        <span className="font-bold text-primary">{item.price}</span>
                      </div>
                      {userItemIds.includes(item.id) ? (
                        <Button size="sm" variant="secondary" disabled className="w-full">
                          Já possui
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => handlePurchase(item)}
                          disabled={(user?.coins || 0) < item.price}
                          className="w-full"
                        >
                          <ShoppingCart className="w-3 h-3 mr-1" />
                          Comprar
                        </Button>
                      )}
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="character">
              {/* Same content, filtered automatically */}
            </TabsContent>

            <TabsContent value="car">
              {/* Same content, filtered automatically */}
            </TabsContent>
          </Tabs>

          {userItems.length > 0 && (
            <div className="mt-8">
              <h2 className="text-2xl font-heading font-bold mb-4">Seus Itens</h2>
              <div className="grid grid-cols-4 md:grid-cols-8 lg:grid-cols-10 gap-3">
                {userItems.map((item) => (
                  <Card key={item.id} className="p-3 text-center">
                    <div className="text-3xl">{item.emoji}</div>
                    <p className="text-xs mt-1 truncate">{item.name}</p>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </Layout>
  );
};

export default Shop;
