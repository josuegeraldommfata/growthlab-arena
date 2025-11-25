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
          description: 'Encontrar e qualificar 10 novos leads para o pipeline',
          xp: 100,
          coins: 50,
          completed: false,
          userId: '1'
        },
        {
          id: '2',
          title: 'Fechar 2 vendas',
          description: 'Concluir 2 negociações com sucesso',
          xp: 200,
          coins: 150,
          completed: false,
          userId: '1'
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
          points: 50,
          avatar: '🚕'
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
