import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'race' | 'task' | 'achievement' | 'post' | 'system';
  read: boolean;
  timestamp: string;
}

interface NotificationState {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: (userId: string) => void;
  getUserNotifications: (userId: string) => Notification[];
  getUnreadCount: (userId: string) => number;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      notifications: [
        {
          id: '1',
          userId: '1',
          title: 'Bem-vindo ao GrowthLab Xp!',
          message: 'Complete suas primeiras tarefas e ganhe recompensas!',
          type: 'system',
          read: false,
          timestamp: new Date().toISOString()
        },
        {
          id: '2',
          userId: '1',
          title: 'Nova corrida iniciada!',
          message: 'A corrida "Vendas Revier" começou. Participe e ganhe prêmios!',
          type: 'race',
          read: false,
          timestamp: new Date(Date.now() - 3600000).toISOString()
        },
        {
          id: '3',
          userId: '1',
          title: 'Tarefa atribuída',
          message: 'Você recebeu uma nova tarefa: Prospectar 10 novos leads',
          type: 'task',
          read: true,
          timestamp: new Date(Date.now() - 7200000).toISOString()
        },
        {
          id: '4',
          userId: '1',
          title: 'Conquista desbloqueada!',
          message: 'Parabéns! Você completou seu primeiro quiz!',
          type: 'achievement',
          read: true,
          timestamp: new Date(Date.now() - 86400000).toISOString()
        },
        {
          id: '5',
          userId: '2',
          title: 'Novo usuário cadastrado',
          message: 'Um novo membro entrou na equipe de vendas.',
          type: 'system',
          read: false,
          timestamp: new Date().toISOString()
        }
      ],
      addNotification: (notification) => set((state) => ({
        notifications: [{
          ...notification,
          id: Date.now().toString(),
          timestamp: new Date().toISOString(),
          read: false
        }, ...state.notifications]
      })),
      markAsRead: (id) => set((state) => ({
        notifications: state.notifications.map(n =>
          n.id === id ? { ...n, read: true } : n
        )
      })),
      markAllAsRead: (userId) => set((state) => ({
        notifications: state.notifications.map(n =>
          n.userId === userId ? { ...n, read: true } : n
        )
      })),
      getUserNotifications: (userId) => {
        return get().notifications.filter(n => n.userId === userId);
      },
      getUnreadCount: (userId) => {
        return get().notifications.filter(n => n.userId === userId && !n.read).length;
      }
    }),
    {
      name: 'growthlab-notifications'
    }
  )
);
