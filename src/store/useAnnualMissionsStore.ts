import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type MissionCategory = 'development' | 'performance' | 'engagement' | 'culture' | 'wellness';

export interface Mission {
  id: string;
  title: string;
  description: string;
  category: MissionCategory;
  coinsReward: number;
  xpReward: number;
  startDate: string;
  endDate: string;
  isCompleted: boolean;
  completedAt?: string;
  assignedBy?: string;
}

export interface MonthlyChapter {
  id: string;
  month: number; // 1-12
  year: number;
  title: string;
  description: string;
  missions: Mission[];
  isCompleted: boolean;
  completedAt?: string;
}

export interface AnnualSeal {
  id: string;
  year: number;
  type: 'standard' | 'gold'; // gold = 12/12 chapters
  earnedAt: string;
  bonusCoins: number;
}

export interface UserAnnualProgress {
  userId: string;
  currentYear: number;
  completedChapters: number;
  totalCoinsEarned: number;
  monthlySpent: number;
  lastSpentMonth: number;
  seals: AnnualSeal[];
  masterPrizeProgress: number; // years completed toward master prize
}

interface AnnualMissionsState {
  chapters: MonthlyChapter[];
  userProgress: UserAnnualProgress[];
  spendingLimit: number; // percentage of coins that can be spent per month (0.3 = 30%)
  masterPrizeYearsRequired: number;
  masterPrizeName: string;
  
  // Actions
  addChapter: (chapter: Omit<MonthlyChapter, 'id' | 'isCompleted'>) => void;
  addMissionToChapter: (chapterId: string, mission: Omit<Mission, 'id' | 'isCompleted'>) => void;
  completeMission: (chapterId: string, missionId: string, userId: string) => { coinsEarned: number; xpEarned: number } | null;
  completeChapter: (chapterId: string, userId: string) => void;
  getUserProgress: (userId: string) => UserAnnualProgress | null;
  initUserProgress: (userId: string) => void;
  canUserSpend: (userId: string, amount: number, totalCoins: number) => boolean;
  recordSpending: (userId: string, amount: number, month: number) => void;
  awardAnnualSeal: (userId: string, year: number, type: 'standard' | 'gold') => void;
  updateMasterPrize: (name: string, yearsRequired: number) => void;
}

// Mock missions templates
const missionTemplates: Omit<Mission, 'id' | 'isCompleted' | 'startDate' | 'endDate'>[] = [
  // Development
  { title: 'Concluir um curso aprovado pela empresa', description: 'Complete um curso do catálogo de treinamentos', category: 'development', coinsReward: 500, xpReward: 200 },
  { title: 'Participar de treinamento presencial/online', description: 'Participe ativamente de um treinamento', category: 'development', coinsReward: 300, xpReward: 150 },
  { title: 'Ler um livro e enviar resumo', description: 'Leia um livro do catálogo e envie um resumo de 1 página', category: 'development', coinsReward: 400, xpReward: 180 },
  { title: 'Completar módulo da universidade interna', description: 'Finalize um módulo completo de aprendizado', category: 'development', coinsReward: 350, xpReward: 160 },
  { title: 'Tirar certificação interna', description: 'Obtenha uma certificação de nível iniciante a avançado', category: 'development', coinsReward: 600, xpReward: 250 },
  
  // Performance
  { title: 'Bater a meta mensal', description: 'Alcance 100% da meta definida pelo gestor', category: 'performance', coinsReward: 800, xpReward: 300 },
  { title: 'Aumentar performance em X%', description: 'Melhore sua performance comparada ao mês anterior', category: 'performance', coinsReward: 500, xpReward: 200 },
  { title: 'Concluir tarefas dentro dos prazos', description: 'Finalize todas as tarefas sem atrasos', category: 'performance', coinsReward: 400, xpReward: 180 },
  { title: 'Reduzir indicadores de falha', description: 'Diminua atrasos, retrabalhos e erros', category: 'performance', coinsReward: 450, xpReward: 190 },
  { title: 'Cumprir metas de atendimento', description: 'Alcance TPA, taxa de resposta e SLA', category: 'performance', coinsReward: 550, xpReward: 220 },
  
  // Engagement
  { title: 'Ajudar um colega', description: 'Auxilie um colega em um projeto ou tarefa', category: 'engagement', coinsReward: 200, xpReward: 100 },
  { title: 'Compartilhar ideias de melhoria', description: 'Sugira 2 ideias de melhoria nos processos', category: 'engagement', coinsReward: 300, xpReward: 140 },
  { title: 'Participar de reunião estratégica', description: 'Participe ativamente de um alinhamento', category: 'engagement', coinsReward: 250, xpReward: 120 },
  { title: 'Criar conteúdo para Rede Social', description: 'Publique texto, vídeo, dica ou insight na intranet', category: 'engagement', coinsReward: 350, xpReward: 160 },
  { title: 'Engajar com postagens de colegas', description: 'Interaja com 5 postagens internas', category: 'engagement', coinsReward: 150, xpReward: 80 },
  
  // Culture
  { title: 'Representar a empresa em evento', description: 'Participe como representante em evento online ou presencial', category: 'culture', coinsReward: 500, xpReward: 200 },
  { title: 'Cumprir Desafio da Semana', description: 'Complete o desafio criado pelo time', category: 'culture', coinsReward: 300, xpReward: 140 },
  { title: 'Praticar valor corporativo do mês', description: 'Demonstre o valor do mês com evidências', category: 'culture', coinsReward: 400, xpReward: 180 },
  { title: 'Fazer ação voluntária', description: 'Participe de uma ação voluntária apoiada pela empresa', category: 'culture', coinsReward: 450, xpReward: 190 },
  { title: 'Conquistar Título do Mês', description: 'Ganhe título como Boa energia, Suporte ou Criatividade', category: 'culture', coinsReward: 600, xpReward: 250 },
  
  // Wellness
  { title: 'Cumprir desafio fitness', description: 'Complete 10 treinos no mês', category: 'wellness', coinsReward: 400, xpReward: 180 },
  { title: 'Participar programa de saúde mental', description: 'Engaje com o programa de bem-estar', category: 'wellness', coinsReward: 350, xpReward: 160 },
  { title: 'Manter constância na jornada', description: 'Reduza faltas e mantenha presença', category: 'wellness', coinsReward: 300, xpReward: 140 },
  { title: 'Cumprir desafio de leitura/hobby', description: 'Complete um desafio pessoal de desenvolvimento', category: 'wellness', coinsReward: 250, xpReward: 120 },
  { title: 'Completar check-up anual', description: 'Realize o check-up fornecido pela empresa', category: 'wellness', coinsReward: 500, xpReward: 200 },
];

const generateMockChapters = (): MonthlyChapter[] => {
  const currentYear = new Date().getFullYear();
  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];
  
  return months.map((monthName, index) => {
    const month = index + 1;
    const selectedMissions = missionTemplates
      .sort(() => Math.random() - 0.5)
      .slice(0, 5)
      .map((template, mIndex) => ({
        ...template,
        id: `mission-${month}-${mIndex}`,
        isCompleted: false,
        startDate: new Date(currentYear, index, 1).toISOString(),
        endDate: new Date(currentYear, index + 1, 0).toISOString(),
      }));
    
    return {
      id: `chapter-${currentYear}-${month}`,
      month,
      year: currentYear,
      title: `Capítulo ${month}: ${monthName}`,
      description: `Complete as missões de ${monthName} para ganhar o selo do mês`,
      missions: selectedMissions,
      isCompleted: false,
    };
  });
};

export const useAnnualMissionsStore = create<AnnualMissionsState>()(
  persist(
    (set, get) => ({
      chapters: generateMockChapters(),
      userProgress: [],
      spendingLimit: 0.3, // 30% limit
      masterPrizeYearsRequired: 7,
      masterPrizeName: 'Carro Zero KM',
      
      addChapter: (chapter) => set((state) => ({
        chapters: [...state.chapters, {
          ...chapter,
          id: `chapter-${Date.now()}`,
          isCompleted: false,
        }]
      })),
      
      addMissionToChapter: (chapterId, mission) => set((state) => ({
        chapters: state.chapters.map(chapter =>
          chapter.id === chapterId
            ? {
                ...chapter,
                missions: [...chapter.missions, {
                  ...mission,
                  id: `mission-${Date.now()}`,
                  isCompleted: false,
                }]
              }
            : chapter
        )
      })),
      
      completeMission: (chapterId, missionId, userId) => {
        const state = get();
        const chapter = state.chapters.find(c => c.id === chapterId);
        const mission = chapter?.missions.find(m => m.id === missionId);
        
        if (!mission || mission.isCompleted) return null;
        
        set((state) => ({
          chapters: state.chapters.map(chapter =>
            chapter.id === chapterId
              ? {
                  ...chapter,
                  missions: chapter.missions.map(m =>
                    m.id === missionId
                      ? { ...m, isCompleted: true, completedAt: new Date().toISOString() }
                      : m
                  )
                }
              : chapter
          ),
          userProgress: state.userProgress.map(p =>
            p.userId === userId
              ? { ...p, totalCoinsEarned: p.totalCoinsEarned + mission.coinsReward }
              : p
          )
        }));
        
        return { coinsEarned: mission.coinsReward, xpEarned: mission.xpReward };
      },
      
      completeChapter: (chapterId, userId) => set((state) => {
        const chapter = state.chapters.find(c => c.id === chapterId);
        if (!chapter) return state;
        
        const allMissionsCompleted = chapter.missions.every(m => m.isCompleted);
        if (!allMissionsCompleted) return state;
        
        return {
          chapters: state.chapters.map(c =>
            c.id === chapterId
              ? { ...c, isCompleted: true, completedAt: new Date().toISOString() }
              : c
          ),
          userProgress: state.userProgress.map(p =>
            p.userId === userId
              ? { ...p, completedChapters: p.completedChapters + 1 }
              : p
          )
        };
      }),
      
      getUserProgress: (userId) => {
        const state = get();
        return state.userProgress.find(p => p.userId === userId) || null;
      },
      
      initUserProgress: (userId) => set((state) => {
        if (state.userProgress.find(p => p.userId === userId)) return state;
        
        return {
          userProgress: [...state.userProgress, {
            userId,
            currentYear: new Date().getFullYear(),
            completedChapters: 0,
            totalCoinsEarned: 0,
            monthlySpent: 0,
            lastSpentMonth: 0,
            seals: [],
            masterPrizeProgress: 0,
          }]
        };
      }),
      
      canUserSpend: (userId, amount, totalCoins) => {
        const state = get();
        const progress = state.userProgress.find(p => p.userId === userId);
        const currentMonth = new Date().getMonth() + 1;
        
        if (!progress) return true;
        
        // Reset monthly spent if new month
        const monthlySpent = progress.lastSpentMonth === currentMonth ? progress.monthlySpent : 0;
        const maxSpendable = totalCoins * state.spendingLimit;
        
        return (monthlySpent + amount) <= maxSpendable;
      },
      
      recordSpending: (userId, amount, month) => set((state) => ({
        userProgress: state.userProgress.map(p =>
          p.userId === userId
            ? {
                ...p,
                monthlySpent: p.lastSpentMonth === month ? p.monthlySpent + amount : amount,
                lastSpentMonth: month,
              }
            : p
        )
      })),
      
      awardAnnualSeal: (userId, year, type) => set((state) => ({
        userProgress: state.userProgress.map(p =>
          p.userId === userId
            ? {
                ...p,
                seals: [...p.seals, {
                  id: `seal-${year}-${type}`,
                  year,
                  type,
                  earnedAt: new Date().toISOString(),
                  bonusCoins: type === 'gold' ? 5000 : 2500,
                }],
                masterPrizeProgress: p.masterPrizeProgress + 1,
              }
            : p
        )
      })),
      
      updateMasterPrize: (name, yearsRequired) => set({
        masterPrizeName: name,
        masterPrizeYearsRequired: yearsRequired,
      }),
    }),
    {
      name: 'growthlab-annual-missions'
    }
  )
);
