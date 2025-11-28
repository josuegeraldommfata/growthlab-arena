import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Task {
  id: string;
  title: string;
  description: string;
  xp: number;
  coins: number;
  completed: boolean;
  userId: string;
  dueDate?: string;
}

export interface Race {
  id: string;
  name: string;
  theme: string;
  status: 'active' | 'upcoming' | 'finished';
  startDate: string;
  endDate: string;
  participants: string[];
  indicators: string[];
}

export interface Team {
  id: string;
  name: string;
  type: 'vendas' | 'prospeccao';
  members: string[];
  points: number;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: {
    id: string;
    question: string;
    options: string[];
    correctAnswer: number;
    points: number;
  }[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  chapters: {
    id: string;
    title: string;
    order: number;
  }[];
  materials: string[];
}

export interface User {
  id: string;
  name: string;
  points: number;
  avatar?: string;
}

interface GameState {
  tasks: Task[];
  races: Race[];
  teams: Team[];
  quizzes: Quiz[];
  courses: Course[];
  users: User[];
  addTask: (task: Task) => void;
  completeTask: (id: string) => void;
  addRace: (race: Race) => void;
  addTeam: (team: Team) => void;
  addQuiz: (quiz: Quiz) => void;
  addCourse: (course: Course) => void;
}

export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      tasks: [
        {
          id: '1',
          title: 'Prospectar 10 novos leads',
          description: 'Encontrar e qualificar 10 novos leads para o pipeline de vendas',
          xp: 100,
          coins: 50,
          completed: false,
          userId: '1',
          dueDate: '2025-12-01'
        },
        {
          id: '2',
          title: 'Fechar 2 vendas',
          description: 'Concluir 2 negociações com sucesso até o final da semana',
          xp: 200,
          coins: 150,
          completed: false,
          userId: '1',
          dueDate: '2025-12-05'
        },
        {
          id: '3',
          title: 'Fazer follow-up com clientes',
          description: 'Entrar em contato com 5 clientes antigos para novas oportunidades',
          xp: 80,
          coins: 40,
          completed: false,
          userId: '2',
          dueDate: '2025-12-03'
        },
        {
          id: '4',
          title: 'Atualizar CRM',
          description: 'Atualizar todas as informações dos leads no sistema',
          xp: 50,
          coins: 25,
          completed: true,
          userId: '1'
        },
        {
          id: '5',
          title: 'Preparar apresentação de vendas',
          description: 'Criar slides para reunião com cliente importante',
          xp: 120,
          coins: 60,
          completed: false,
          userId: '3',
          dueDate: '2025-12-02'
        },
        {
          id: '6',
          title: 'Mapear concorrentes',
          description: 'Pesquisar e documentar principais concorrentes do mercado',
          xp: 150,
          coins: 80,
          completed: false,
          userId: '2'
        }
      ],
      races: [
        {
          id: '1',
          name: 'Vendas Revier',
          theme: 'Prospecção Máxima - Meta de Vendas Q1',
          status: 'active',
          startDate: '2025-01-01',
          endDate: '2025-03-31',
          participants: ['1', '2', '3', '4'],
          indicators: ['vendas', 'prospeccao']
        }
      ],
      users: [
        {
          id: '1',
          name: 'Beatriz de Melo',
          points: 2455,
          avatar: '🏎️'
        },
        {
          id: '2',
          name: 'Renato Barbosa',
          points: 3200,
          avatar: '🚗'
        },
        {
          id: '3',
          name: 'Barbara Miranda',
          points: 2800,
          avatar: '🚙'
        },
        {
          id: '4',
          name: 'Daniel de Jesus',
          points: 1500,
          avatar: '🚕'
        },
        {
          id: '5',
          name: 'Amanda Costa',
          points: 2100,
          avatar: '🏁'
        },
        {
          id: '6',
          name: 'Carlos Silva',
          points: 1800,
          avatar: '🚓'
        },
        {
          id: '7',
          name: 'Fernanda Lima',
          points: 2650,
          avatar: '🚐'
        },
        {
          id: '8',
          name: 'Lucas Martins',
          points: 980,
          avatar: '🛻'
        },
        {
          id: '9',
          name: 'Juliana Santos',
          points: 3450,
          avatar: '🚑'
        },
        {
          id: '10',
          name: 'Pedro Oliveira',
          points: 750,
          avatar: '🚒'
        }
      ],
      teams: [
        {
          id: 'vendas',
          name: 'Equipe de Vendas',
          type: 'vendas',
          members: ['1'],
          points: 1500
        },
        {
          id: 'prospeccao',
          name: 'Equipe de Prospecção',
          type: 'prospeccao',
          members: [],
          points: 800
        }
      ],
      quizzes: [
        {
          id: '1',
          title: 'Quiz de Vendas Básico',
          description: 'Teste seus conhecimentos em técnicas de vendas',
          questions: [
            {
              id: 'q1',
              question: 'Qual é a primeira etapa do funil de vendas?',
              options: ['Prospecção', 'Fechamento', 'Negociação', 'Pós-venda'],
              correctAnswer: 0,
              points: 25
            },
            {
              id: 'q2',
              question: 'O que significa SPIN Selling?',
              options: ['Situação, Problema, Implicação, Necessidade', 'Sistema, Processo, Integração, Negócio', 'Serviço, Produto, Investimento, Negociação', 'Suporte, Planejamento, Inovação, Networking'],
              correctAnswer: 0,
              points: 30
            },
            {
              id: 'q3',
              question: 'Qual a melhor forma de lidar com objeções?',
              options: ['Ignorar completamente', 'Ouvir, entender e contornar com benefícios', 'Insistir na venda', 'Oferecer desconto imediatamente'],
              correctAnswer: 1,
              points: 25
            }
          ]
        },
        {
          id: '2',
          title: 'Quiz de Prospecção',
          description: 'Aprenda técnicas avançadas de prospecção',
          questions: [
            {
              id: 'q1',
              question: 'Qual canal é mais efetivo para B2B?',
              options: ['Instagram', 'LinkedIn', 'TikTok', 'Pinterest'],
              correctAnswer: 1,
              points: 20
            },
            {
              id: 'q2',
              question: 'O que é cold calling?',
              options: ['Ligar para amigos', 'Ligar para leads sem contato prévio', 'Ligar no inverno', 'Ligar para reclamar'],
              correctAnswer: 1,
              points: 25
            }
          ]
        },
        {
          id: '3',
          title: 'Quiz de Negociação',
          description: 'Domine técnicas de negociação',
          questions: [
            {
              id: 'q1',
              question: 'Qual o princípio da reciprocidade?',
              options: ['Dar para receber', 'Nunca ceder', 'Sempre pedir desconto', 'Ignorar o cliente'],
              correctAnswer: 0,
              points: 30
            }
          ]
        }
      ],
      courses: [
        {
          id: '1',
          title: 'Fundamentos de Vendas',
          description: 'Aprenda os conceitos básicos para se tornar um vendedor de sucesso',
          videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          chapters: [
            { id: 'c1', title: 'Introdução às Vendas', order: 1 },
            { id: 'c2', title: 'Técnicas de Prospecção', order: 2 }
          ],
          materials: ['Apostila de Vendas.pdf', 'Planilha de Prospecção.xlsx']
        }
      ],
      addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
      completeTask: (id) => set((state) => ({
        tasks: state.tasks.map(t => t.id === id ? { ...t, completed: true } : t)
      })),
      addRace: (race) => set((state) => ({ races: [...state.races, race] })),
      addTeam: (team) => set((state) => ({ teams: [...state.teams, team] })),
      addQuiz: (quiz) => set((state) => ({ quizzes: [...state.quizzes, quiz] })),
      addCourse: (course) => set((state) => ({ courses: [...state.courses, course] }))
    }),
    {
      name: 'growthlab-game'
    }
  )
);
