import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Post {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  timestamp: string;
  likes: string[];
  comments: Comment[];
  shares: number;
  scheduled?: string;
  isScheduled?: boolean;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: string;
}

interface TimelineState {
  posts: Post[];
  addPost: (post: Omit<Post, 'id' | 'likes' | 'comments' | 'shares'>) => void;
  likePost: (postId: string, userId: string) => void;
  addComment: (postId: string, comment: Omit<Comment, 'id' | 'timestamp'>) => void;
  sharePost: (postId: string) => void;
}

export const useTimelineStore = create<TimelineState>()(
  persist(
    (set) => ({
      posts: [
        {
          id: '1',
          userId: '2',
          userName: 'Administrador',
          userAvatar: '👨‍💼',
          content: 'Bem-vindos ao GrowthLab Xp! 🚀 Vamos juntos alcançar nossas metas!',
          timestamp: new Date().toISOString(),
          likes: [],
          comments: [],
          shares: 0
        }
      ],
      addPost: (post) => set((state) => ({
        posts: [{
          ...post,
          id: Date.now().toString(),
          likes: [],
          comments: [],
          shares: 0
        }, ...state.posts]
      })),
      likePost: (postId, userId) => set((state) => ({
        posts: state.posts.map(post =>
          post.id === postId
            ? {
                ...post,
                likes: post.likes.includes(userId)
                  ? post.likes.filter(id => id !== userId)
                  : [...post.likes, userId]
              }
            : post
        )
      })),
      addComment: (postId, comment) => set((state) => ({
        posts: state.posts.map(post =>
          post.id === postId
            ? {
                ...post,
                comments: [...post.comments, {
                  ...comment,
                  id: Date.now().toString(),
                  timestamp: new Date().toISOString()
                }]
              }
            : post
        )
      })),
      sharePost: (postId) => set((state) => ({
        posts: state.posts.map(post =>
          post.id === postId ? { ...post, shares: post.shares + 1 } : post
        )
      }))
    }),
    {
      name: 'growthlab-timeline'
    }
  )
);
