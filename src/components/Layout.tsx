import { ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Trophy, 
  BookOpen, 
  MessageSquare, 
  Settings,
  Tv,
  LogOut,
  Target
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/useAuthStore';
import { NavLink } from '@/components/NavLink';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const userMenuItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/tasks', icon: Target, label: 'Tarefas' },
    { to: '/races', icon: Trophy, label: 'Corridas' },
    { to: '/learn', icon: BookOpen, label: 'Escola' },
    { to: '/timeline', icon: MessageSquare, label: 'Intranet' },
    { to: '/tv', icon: Tv, label: 'TV Dashboard' },
  ];

  const adminMenuItems = [
    { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard Admin' },
    { to: '/admin/teams', icon: Users, label: 'Equipes' },
    { to: '/admin/races', icon: Trophy, label: 'Gerenciar Corridas' },
    { to: '/admin/learn', icon: BookOpen, label: 'Conteúdo' },
    { to: '/admin/products', icon: Settings, label: 'Produtos' },
  ];

  const menuItems = user?.role === 'admin' ? adminMenuItems : userMenuItems;

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed left-0 top-0 h-full w-64 bg-sidebar border-r border-sidebar-border">
        <div className="p-6">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            GrowthLab Xp
          </h1>
        </div>

        <div className="px-4 py-2">
          <div className="mb-6 p-4 rounded-lg bg-sidebar-accent">
            <div className="flex items-center gap-3 mb-2">
              <div className="text-3xl">{user?.avatar}</div>
              <div>
                <p className="font-semibold text-sidebar-foreground">{user?.name}</p>
                <p className="text-xs text-sidebar-foreground/70">Nível {user?.level}</p>
              </div>
            </div>
            <div className="space-y-2 mt-3">
              <div className="flex justify-between text-xs text-sidebar-foreground/70">
                <span>XP: {user?.xp}</span>
                <span>Coins: {user?.coins}</span>
              </div>
              <div className="w-full bg-sidebar-background rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full"
                  style={{ width: `${((user?.xp || 0) % 100)}%` }}
                />
              </div>
            </div>
          </div>

          <nav className="space-y-1">
            {menuItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
                activeClassName="bg-sidebar-accent text-primary font-medium"
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4">
          <Button 
            onClick={handleLogout}
            variant="ghost"
            className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Sair
          </Button>
        </div>
      </aside>

      <main className="ml-64 min-h-screen">
        {children}
      </main>
    </div>
  );
};

export default Layout;
