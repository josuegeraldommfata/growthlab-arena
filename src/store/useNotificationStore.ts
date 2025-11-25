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
      notifications: [],
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
