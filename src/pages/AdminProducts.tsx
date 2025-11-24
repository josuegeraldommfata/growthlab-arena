import { useState } from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Package, Plus, Coins } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
}

const AdminProducts = () => {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([
    {
      id: '1',
      name: 'Boost de XP (24h)',
      description: 'Dobra seus ganhos de XP por 24 horas',
      price: 500,
      category: 'boost'
    },
    {
      id: '2',
      name: 'Avatar Especial: Estrela',
      description: 'Avatar exclusivo para mostrar seu status',
      price: 1000,
      category: 'avatar'
    }
  ]);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    category: 'item'
  });

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newProduct: Product = {
      id: Date.now().toString(),
      ...formData
    };

    setProducts([...products, newProduct]);

    toast({
      title: "Produto adicionado!",
      description: `${formData.name} foi adicionado à loja.`,
    });

    setFormData({
      name: '',
      description: '',
      price: 0,
      category: 'item'
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
          <h1 className="text-4xl font-bold mb-2">Gerenciar Produtos 🛒</h1>
          <p className="text-muted-foreground mb-8">
            Adicione produtos e recompensas para a loja
          </p>

          <Card className="p-6 mb-8">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Adicionar Novo Produto
            </h3>
            <form onSubmit={handleAddProduct} className="space-y-4">
              <div>
                <Label htmlFor="product-name">Nome do Produto</Label>
                <Input
                  id="product-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Avatar Premium"
                  required
                />
              </div>

              <div>
                <Label htmlFor="product-description">Descrição</Label>
                <Textarea
                  id="product-description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descreva o produto..."
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="product-price">Preço (Coins)</Label>
                  <Input
                    id="product-price"
                    type="number"
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="product-category">Categoria</Label>
                  <Input
                    id="product-category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="Ex: boost, avatar, item"
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full bg-gradient-to-r from-primary to-secondary">
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Produto
              </Button>
            </form>
          </Card>

          <div className="grid gap-6">
            <h3 className="text-2xl font-semibold">Produtos Cadastrados</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-3 bg-primary/20 rounded-lg">
                        <Package className="w-8 h-8 text-primary" />
                      </div>
                      <span className="flex items-center gap-1 px-3 py-1 bg-secondary/20 text-secondary rounded-full text-sm font-medium">
                        <Coins className="w-4 h-4" />
                        {product.price}
                      </span>
                    </div>
                    <h4 className="text-lg font-bold mb-2">{product.name}</h4>
                    <p className="text-sm text-muted-foreground mb-3">{product.description}</p>
                    <span className="inline-block px-3 py-1 bg-muted rounded-full text-xs">
                      {product.category}
                    </span>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default AdminProducts;
