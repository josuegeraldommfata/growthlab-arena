import { ReactNode, useState } from 'react';
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
  Target,
  ShoppingBag,
  Bell,
  School,
  Route,
  Map,
  ClipboardList,
  Gift,
  Repeat,
  User,
  Crown,
  UsersRound,
  Menu,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/useAuthStore';
import { NavLink } from '@/components/NavLink';
import { useIsMobile } from '@/hooks/use-mobile';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const userMenuItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/journey', icon: Map, label: 'Jornada' },
    { to: '/tasks', icon: Target, label: 'Tarefas' },
    { to: '/races', icon: Trophy, label: 'Corridas' },
    { to: '/leaderboard', icon: Crown, label: 'Ranking' },
    { to: '/learn', icon: BookOpen, label: 'Escola' },
    { to: '/my-team', icon: UsersRound, label: 'Minha Equipe' },
    { to: '/exchange', icon: Repeat, label: 'Trocar Prêmios' },
    { to: '/shop', icon: ShoppingBag, label: 'Loja' },
    { to: '/timeline', icon: MessageSquare, label: 'Intranet' },
    { to: '/notifications', icon: Bell, label: 'Notificações' },
    { to: '/profile', icon: User, label: 'Meu Perfil' },
  ];

  const adminMenuItems = [
    { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard Admin' },
    { to: '/admin/users', icon: Users, label: 'Usuários' },
    { to: '/admin/teams', icon: UsersRound, label: 'Equipes' },
    { to: '/admin/tasks', icon: ClipboardList, label: 'Tarefas' },
    { to: '/admin/races', icon: Trophy, label: 'Gerenciar Corridas' },
    { to: '/admin/learn', icon: School, label: 'Conteúdo' },
    { to: '/admin/learning-path', icon: Route, label: 'Trilhas' },
    { to: '/admin/rewards', icon: Gift, label: 'Recompensas' },
    { to: '/admin/products', icon: Settings, label: 'Produtos' },
  ];

  const menuItems = user?.role === 'admin' ? adminMenuItems : userMenuItems;

  return (
    <div className="min-h-screen bg-background">
      {/* Botão menu mobile */}
      {isMobile && (
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="fixed top-4 left-4 z-50 p-2 bg-sidebar rounded-lg text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      )}

      {/* Overlay mobile */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`fixed left-0 top-0 h-full w-64 bg-sidebar border-r border-sidebar-border z-40 transition-transform duration-300 ${
        isMobile && !sidebarOpen ? '-translate-x-full' : 'translate-x-0'
      }`}>
        <div className="p-4 md:p-6 flex items-center gap-0.5">
          <img 
            src="/assets/folha degrade roxo.png" 
            alt="GrowthLab Xp" 
            className="h-6 md:h-8 w-auto object-contain"
          />
          <h1 className="text-base md:text-lg font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent leading-none">
            GrowthLab Xp
          </h1>
        </div>

        <div className="px-2 md:px-4 py-2 overflow-y-auto h-[calc(100vh-80px)]">
          <div className="mb-4 md:mb-6 p-3 md:p-4 rounded-lg bg-sidebar-accent">
            <div className="flex items-center gap-2 md:gap-3 mb-2">
              <div className="text-2xl md:text-3xl">{user?.avatar}</div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-sidebar-foreground text-sm md:text-base truncate">{user?.name}</p>
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
                onClick={() => isMobile && setSidebarOpen(false)}
                className="flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 md:py-3 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent transition-colors text-sm md:text-base"
                activeClassName="bg-sidebar-accent text-primary font-medium"
              >
                <item.icon className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
                <span className="truncate">{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-2 md:p-4">
          <Button 
            onClick={handleLogout}
            variant="ghost"
            className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent text-sm md:text-base"
          >
            <LogOut className="w-4 h-4 md:w-5 md:h-5 mr-2 md:mr-3" />
            Sair
          </Button>
        </div>
      </aside>

      <main className="ml-0 md:ml-64 min-h-screen pt-16 md:pt-0">
        {children}
      </main>
    </div>
  );
};

export default Layout;
