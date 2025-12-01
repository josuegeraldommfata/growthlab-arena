import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { useAuthStore } from '@/store/useAuthStore';
import { useToast } from '@/hooks/use-toast';
import { User, Shield } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const { toast } = useToast();

  const fillUserCredentials = () => {
    setEmail('usuario@email.com');
    setPassword('user123');
  };

  const fillAdminCredentials = () => {
    setEmail('admin@email.com');
    setPassword('admin123');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(email, password);
    
    if (success) {
      toast({
        title: "Login realizado!",
        description: "Bem-vindo ao GrowthLab Xp 🚀",
      });
      navigate('/dashboard');
    } else {
      toast({
        title: "Erro no login",
        description: "Email ou senha incorretos",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="w-full p-6 md:p-8 backdrop-blur-sm bg-card/80">
          <div className="text-center mb-6 md:mb-8">
            <div className="flex items-center justify-center gap-2 mb-3 md:mb-4">
              <img 
                src="/assets/folha degrade roxo.png" 
                alt="GrowthLab Xp" 
                className="h-10 md:h-12 w-auto object-contain"
              />
              <motion.h1 
                className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                GrowthLab Xp
              </motion.h1>
            </div>
            <p className="text-sm md:text-base text-muted-foreground">Sistema de gamificação para equipes</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="usuario@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90">
              Entrar
            </Button>
          </form>

          <div className="mt-6 space-y-3">
            <p className="text-center text-sm text-muted-foreground">Acesso rápido:</p>
            <div className="grid grid-cols-2 gap-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={fillUserCredentials}
                className="flex items-center gap-2"
              >
                <User className="w-4 h-4" />
                Usuário
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={fillAdminCredentials}
                className="flex items-center gap-2"
              >
                <Shield className="w-4 h-4" />
                Admin
              </Button>
            </div>
            <p className="text-xs text-center text-muted-foreground mt-2">
              Clique para preencher as credenciais
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Login;
