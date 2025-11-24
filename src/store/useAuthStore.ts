import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserRole = 'admin' | 'user';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar: string;
  level: number;
  xp: number;
  coins: number;
  teamId?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

const mockUsers = {
  'usuario@email.com': {
    id: '1',
    email: 'usuario@email.com',
    password: 'user123',
    name: 'Usuário Padrão',
    role: 'user' as UserRole,
    avatar: '👤',
    level: 5,
    xp: 450,
    coins: 1200,
    teamId: 'vendas'
  },
  'admin@email.com': {
    id: '2',
    email: 'admin@email.com',
    password: 'admin123',
    name: 'Administrador',
    role: 'admin' as UserRole,
    avatar: '👨‍💼',
    level: 10,
    xp: 2500,
    coins: 5000
  }
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (email: string, password: string) => {
        const mockUser = mockUsers[email as keyof typeof mockUsers];
        if (mockUser && mockUser.password === password) {
          const { password: _, ...userWithoutPassword } = mockUser;
          set({ user: userWithoutPassword, isAuthenticated: true });
          return true;
        }
        return false;
      },
      logout: () => set({ user: null, isAuthenticated: false }),
      updateUser: (updates) => set((state) => ({
        user: state.user ? { ...state.user, ...updates } : null
      }))
    }),
    {
      name: 'growthlab-auth'
    }
  )
);
