import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Reward {
  id: string;
  name: string;
  price: number;
  category: 'food' | 'voucher' | 'experience' | 'subscription' | 'travel';
  emoji: string;
  image?: string; // URL da logo/imagem do produto
  description?: string;
  stock: number;
  tier?: '1D' | '2D' | '3D' | '4D';
}

interface RewardExchange {
  id: string;
  userId: string;
  rewardId: string;
  rewardName: string;
  price: number;
  date: string;
  status: 'pending' | 'approved' | 'delivered';
}

interface RewardsState {
  rewards: Reward[];
  exchanges: RewardExchange[];
  addReward: (reward: Omit<Reward, 'id'>) => void;
  updateReward: (id: string, updates: Partial<Reward>) => void;
  deleteReward: (id: string) => void;
  requestExchange: (userId: string, reward: Reward) => void;
  updateExchangeStatus: (id: string, status: RewardExchange['status']) => void;
  getUserExchanges: (userId: string) => RewardExchange[];
}

const mockRewards: Reward[] = [
  // Food & Drinks
  { id: '1', name: 'Trident', price: 30, category: 'food', emoji: '🍬', image: 'https://logo.clearbit.com/trident.com', stock: 50 },
  { id: '2', name: 'Sonho de Valsa', price: 15, category: 'food', emoji: '🍫', image: 'https://logo.clearbit.com/lacta.com.br', stock: 100 },
  { id: '3', name: 'Fini', price: 70, category: 'food', emoji: '🍭', image: 'https://logo.clearbit.com/fini.com.br', stock: 30 },
  { id: '4', name: 'Coca Cola', price: 50, category: 'food', emoji: '🥤', image: 'https://logo.clearbit.com/coca-cola.com', stock: 40 },
  { id: '5', name: 'RedBull', price: 90, category: 'food', emoji: '🥫', image: 'https://logo.clearbit.com/redbull.com', stock: 25 },
  { id: '6', name: 'Bombom Branco Cacau Show', price: 70, category: 'food', emoji: '🍬', image: 'https://logo.clearbit.com/cacaushow.com.br', stock: 50 },
  { id: '7', name: 'Wafer Mil-Folhas', price: 160, category: 'food', emoji: '🧇', stock: 20 },
  { id: '8', name: 'Big Mac', price: 120, category: 'food', emoji: '🍔', image: 'https://logo.clearbit.com/mcdonalds.com', stock: 15 },
  { id: '9', name: 'Combo Big Mac', price: 250, category: 'food', emoji: '🍟', image: 'https://logo.clearbit.com/mcdonalds.com', stock: 10 },
  
  // Vouchers - Vale Uber
  { id: '10', name: 'Vale Uber R$20', price: 200, category: 'voucher', emoji: '🚗', image: 'https://logo.clearbit.com/uber.com', stock: 20 },
  
  // Vouchers - Boticário
  { id: '11', name: 'Vale Boticário R$20', price: 200, category: 'voucher', emoji: '💄', image: 'https://logo.clearbit.com/boticario.com.br', stock: 15 },
  { id: '12', name: 'Vale Boticário R$50', price: 500, category: 'voucher', emoji: '💄', image: 'https://logo.clearbit.com/boticario.com.br', stock: 10 },
  { id: '13', name: 'Vale Boticário R$100', price: 1000, category: 'voucher', emoji: '💄', image: 'https://logo.clearbit.com/boticario.com.br', stock: 8 },
  { id: '14', name: 'Vale Boticário R$200', price: 2000, category: 'voucher', emoji: '💄', image: 'https://logo.clearbit.com/boticario.com.br', stock: 5 },
  
  // Vouchers - Assaí
  { id: '15', name: 'Vale Assaí R$20', price: 200, category: 'voucher', emoji: '🛒', image: 'https://logo.clearbit.com/assai.com.br', stock: 15 },
  { id: '16', name: 'Vale Assaí R$50', price: 500, category: 'voucher', emoji: '🛒', image: 'https://logo.clearbit.com/assai.com.br', stock: 10 },
  { id: '17', name: 'Vale Assaí R$100', price: 1000, category: 'voucher', emoji: '🛒', image: 'https://logo.clearbit.com/assai.com.br', stock: 8 },
  
  // Vouchers - Carrefour
  { id: '18', name: 'Vale Carrefour R$20', price: 200, category: 'voucher', emoji: '🏪', image: 'https://logo.clearbit.com/carrefour.com.br', stock: 15 },
  { id: '19', name: 'Vale Carrefour R$50', price: 500, category: 'voucher', emoji: '🏪', image: 'https://logo.clearbit.com/carrefour.com.br', stock: 10 },
  { id: '20', name: 'Vale Carrefour R$100', price: 1000, category: 'voucher', emoji: '🏪', image: 'https://logo.clearbit.com/carrefour.com.br', stock: 8 },
  
  // Vouchers - Cacau Show
  { id: '21', name: 'Cartão Cacau Show R$20', price: 200, category: 'voucher', emoji: '🍫', image: 'https://logo.clearbit.com/cacaushow.com.br', stock: 15 },
  { id: '22', name: 'Cartão Cacau Show R$50', price: 500, category: 'voucher', emoji: '🍫', image: 'https://logo.clearbit.com/cacaushow.com.br', stock: 10 },
  { id: '23', name: 'Cartão Cacau Show R$100', price: 1000, category: 'voucher', emoji: '🍫', image: 'https://logo.clearbit.com/cacaushow.com.br', stock: 8 },
  
  // Vouchers - Outback
  { id: '24', name: 'Cartão Presente Outback R$50', price: 500, category: 'voucher', emoji: '🥩', image: 'https://logo.clearbit.com/outback.com.br', stock: 10 },
  
  // Vouchers - Shopping
  { id: '25', name: 'Vale Presente Shopee R$30', price: 300, category: 'voucher', emoji: '🛍️', image: 'https://logo.clearbit.com/shopee.com.br', stock: 15 },
  { id: '26', name: 'Vale Presente Shopee R$100', price: 1000, category: 'voucher', emoji: '🛍️', image: 'https://logo.clearbit.com/shopee.com.br', stock: 8 },
  { id: '27', name: 'Gift Card Shein R$40', price: 400, category: 'voucher', emoji: '👗', image: 'https://logo.clearbit.com/shein.com', stock: 12 },
  
  // Subscriptions
  { id: '28', name: 'Gift Card Netflix R$35', price: 350, category: 'subscription', emoji: '📺', image: 'https://logo.clearbit.com/netflix.com', tier: '2D', stock: 10 },
  { id: '29', name: 'YouTube Premium 1 Ano', price: 1500, category: 'subscription', emoji: '▶️', image: 'https://logo.clearbit.com/youtube.com', tier: '3D', stock: 5 },
  { id: '30', name: 'Spotify Premium 3 Meses', price: 800, category: 'subscription', emoji: '🎵', image: 'https://logo.clearbit.com/spotify.com', tier: '3D', stock: 8 },
  
  // Books & Products
  { id: '31', name: 'Livro: Mais Esperto que o Diabo', price: 300, category: 'voucher', emoji: '📚', image: 'https://logo.clearbit.com/amazon.com.br', tier: '1D', stock: 10 },
  { id: '32', name: 'Perfume Egeo Spicy Vibe 90ml', price: 800, category: 'voucher', emoji: '✨', image: 'https://logo.clearbit.com/boticario.com.br', tier: '2D', stock: 5 },
  { id: '33', name: 'Nobreak', price: 300, category: 'voucher', emoji: '🔌', stock: 8 },
  
  // Experiences - Food
  { id: '34', name: 'Almoço Padaria América R$30', price: 300, category: 'experience', emoji: '🥐', stock: 10 },
  { id: '35', name: 'Vale Almoço Estrela dos Pampas R$90', price: 900, category: 'experience', emoji: '🥘', stock: 8 },
  { id: '36', name: '2 Rodízios Ragazzo', price: 500, category: 'experience', emoji: '🍕', image: 'https://logo.clearbit.com/ragazzo.com.br', stock: 10 },
  { id: '37', name: 'Rodízio Villa México', price: 900, category: 'experience', emoji: '🌮', stock: 8 },
  { id: '38', name: 'Rodízio Japonês', price: 1000, category: 'experience', emoji: '🍣', stock: 6 },
  
  // Experiences - Entertainment
  { id: '39', name: '2 Ingressos Cinemark', price: 500, category: 'experience', emoji: '🎬', image: 'https://logo.clearbit.com/cinemark.com.br', stock: 15 },
  { id: '40', name: '2 Ingressos Zoológico SP', price: 1000, category: 'experience', emoji: '🦁', stock: 10 },
  { id: '41', name: '4 Ingressos Magic City', price: 1400, category: 'experience', emoji: '🎢', stock: 5 },
  { id: '42', name: '2 Ingressos Rainbow Falls', price: 800, category: 'experience', emoji: '💦', stock: 8 },
  
  // Travel - Premium Tier 4D
  { id: '43', name: 'Viagem Beto Carrero + Hospedagem', price: 5000, category: 'travel', emoji: '🎡', tier: '4D', stock: 3 },
  { id: '44', name: 'Viagem Disney + Acompanhante', price: 15000, category: 'travel', emoji: '🏰', image: 'https://logo.clearbit.com/disney.com', tier: '4D', stock: 2, description: 'Voo, hospedagem e ingresso para o parque' },
  { id: '45', name: 'Porto Seguro + Acompanhante', price: 8000, category: 'travel', emoji: '🏖️', tier: '4D', stock: 3, description: 'Passagem, hotel e refeições' },
];

export const useRewardsStore = create<RewardsState>()(
  persist(
    (set, get) => ({
      rewards: mockRewards,
      exchanges: [],
      
      addReward: (reward) => set((state) => ({
        rewards: [...state.rewards, { ...reward, id: Date.now().toString() }]
      })),
      
      updateReward: (id, updates) => set((state) => ({
        rewards: state.rewards.map(r => r.id === id ? { ...r, ...updates } : r)
      })),
      
      deleteReward: (id) => set((state) => ({
        rewards: state.rewards.filter(r => r.id !== id)
      })),
      
      requestExchange: (userId, reward) => set((state) => ({
        exchanges: [...state.exchanges, {
          id: Date.now().toString(),
          userId,
          rewardId: reward.id,
          rewardName: reward.name,
          price: reward.price,
          date: new Date().toISOString(),
          status: 'pending'
        }],
        rewards: state.rewards.map(r => 
          r.id === reward.id ? { ...r, stock: r.stock - 1 } : r
        )
      })),
      
      updateExchangeStatus: (id, status) => set((state) => ({
        exchanges: state.exchanges.map(e => 
          e.id === id ? { ...e, status } : e
        )
      })),
      
      getUserExchanges: (userId) => get().exchanges.filter(e => e.userId === userId)
    }),
    {
      name: 'growthlab-rewards'
    }
  )
);
