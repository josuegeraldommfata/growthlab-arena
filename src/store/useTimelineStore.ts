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
          likes: ['1', '3', '4'],
          comments: [
            { id: 'c1', userId: '1', userName: 'Usuário Padrão', content: 'Vamos com tudo! 💪', timestamp: new Date().toISOString() }
          ],
          shares: 5
        },
        {
          id: '2',
          userId: '3',
          userName: 'Barbara Miranda',
          userAvatar: '🚙',
          content: 'Acabei de fechar minha primeira venda do mês! 🎉 Obrigada pela equipe que me apoiou nessa jornada. #TeamWork #Vendas',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          likes: ['1', '2', '4', '5'],
          comments: [],
          shares: 2
        },
        {
          id: '3',
          userId: '9',
          userName: 'Juliana Santos',
          userAvatar: '🚑',
          content: '📊 ENQUETE: Qual o maior desafio em vendas?\n1. Prospecção\n2. Fechamento\n3. Negociação\n4. Follow-up',
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          likes: ['2', '3'],
          comments: [
            { id: 'c2', userId: '2', userName: 'Renato Barbosa', content: 'Prospecção com certeza!', timestamp: new Date(Date.now() - 3600000).toISOString() },
            { id: 'c3', userId: '5', userName: 'Amanda Costa', content: 'Para mim é o fechamento 😅', timestamp: new Date(Date.now() - 1800000).toISOString() }
          ],
          shares: 8
        },
        {
          id: '4',
          userId: '7',
          userName: 'Fernanda Lima',
          userAvatar: '🚐',
          content: 'Dica do dia: Sempre faça follow-up em até 24h após o primeiro contato. Isso aumenta em 70% suas chances de conversão! 📈',
          timestamp: new Date(Date.now() - 86400000).toISOString(),
          likes: ['1', '2', '3', '4', '5', '6'],
          comments: [],
          shares: 15
        },
        {
          id: '5',
          userId: '2',
          userName: 'Renato Barbosa',
          userAvatar: '🚗',
          content: 'Parabéns a toda equipe de vendas pelo resultado do último trimestre! Batemos a meta em 120%! 🏆🎊',
          timestamp: new Date(Date.now() - 172800000).toISOString(),
          likes: ['1', '3', '4', '5', '6', '7', '8', '9'],
          comments: [
            { id: 'c4', userId: '1', userName: 'Beatriz de Melo', content: 'Equipe sensacional! 🙌', timestamp: new Date(Date.now() - 86400000).toISOString() }
          ],
          shares: 12
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
