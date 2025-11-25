import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ShopItem {
  id: string;
  name: string;
  type: 'character' | 'car';
  emoji: string;
  price: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface ShopState {
  items: ShopItem[];
  userPurchases: Record<string, string[]>; // userId -> itemIds
  addItem: (item: ShopItem) => void;
  purchaseItem: (userId: string, itemId: string) => void;
  getUserItems: (userId: string) => ShopItem[];
}

const mockCharacters: ShopItem[] = [
  { id: 'c1', name: 'Piloto Clássico', type: 'character', emoji: '🏎️', price: 100, rarity: 'common' },
  { id: 'c2', name: 'Vendedor Pro', type: 'character', emoji: '🚗', price: 150, rarity: 'common' },
  { id: 'c3', name: 'Executivo', type: 'character', emoji: '🚙', price: 200, rarity: 'common' },
  { id: 'c4', name: 'Líder', type: 'character', emoji: '🚕', price: 250, rarity: 'rare' },
  { id: 'c5', name: 'Campeão', type: 'character', emoji: '🏁', price: 300, rarity: 'rare' },
  { id: 'c6', name: 'Ninja', type: 'character', emoji: '🥷', price: 350, rarity: 'rare' },
  { id: 'c7', name: 'Super-herói', type: 'character', emoji: '🦸', price: 400, rarity: 'epic' },
  { id: 'c8', name: 'Mago', type: 'character', emoji: '🧙', price: 450, rarity: 'epic' },
  { id: 'c9', name: 'Robô', type: 'character', emoji: '🤖', price: 500, rarity: 'epic' },
  { id: 'c10', name: 'Alienígena', type: 'character', emoji: '👽', price: 550, rarity: 'epic' },
  { id: 'c11', name: 'Astronauta', type: 'character', emoji: '👨‍🚀', price: 600, rarity: 'legendary' },
  { id: 'c12', name: 'Vampiro', type: 'character', emoji: '🧛', price: 650, rarity: 'legendary' },
  { id: 'c13', name: 'Princesa', type: 'character', emoji: '👸', price: 700, rarity: 'legendary' },
  { id: 'c14', name: 'Príncipe', type: 'character', emoji: '🤴', price: 750, rarity: 'legendary' },
  { id: 'c15', name: 'Detective', type: 'character', emoji: '🕵️', price: 800, rarity: 'legendary' },
  { id: 'c16', name: 'Pirata', type: 'character', emoji: '🏴‍☠️', price: 200, rarity: 'common' },
  { id: 'c17', name: 'Cowboy', type: 'character', emoji: '🤠', price: 250, rarity: 'common' },
  { id: 'c18', name: 'Cientista', type: 'character', emoji: '🧑‍🔬', price: 300, rarity: 'rare' },
  { id: 'c19', name: 'Chef', type: 'character', emoji: '👨‍🍳', price: 350, rarity: 'rare' },
  { id: 'c20', name: 'Bombeiro', type: 'character', emoji: '👨‍🚒', price: 400, rarity: 'epic' },
  { id: 'c21', name: 'Policial', type: 'character', emoji: '👮', price: 450, rarity: 'epic' },
  { id: 'c22', name: 'Médico', type: 'character', emoji: '👨‍⚕️', price: 500, rarity: 'epic' },
  { id: 'c23', name: 'Zumbi', type: 'character', emoji: '🧟', price: 550, rarity: 'epic' },
  { id: 'c24', name: 'Elfo', type: 'character', emoji: '🧝', price: 600, rarity: 'legendary' },
  { id: 'c25', name: 'Fada', type: 'character', emoji: '🧚', price: 650, rarity: 'legendary' },
  { id: 'c26', name: 'Sereia', type: 'character', emoji: '🧜', price: 700, rarity: 'legendary' },
  { id: 'c27', name: 'Anjo', type: 'character', emoji: '😇', price: 750, rarity: 'legendary' },
  { id: 'c28', name: 'Demônio', type: 'character', emoji: '😈', price: 800, rarity: 'legendary' },
  { id: 'c29', name: 'Palhaço', type: 'character', emoji: '🤡', price: 200, rarity: 'common' },
  { id: 'c30', name: 'Artista', type: 'character', emoji: '🎨', price: 250, rarity: 'common' },
  { id: 'c31', name: 'Músico', type: 'character', emoji: '🎸', price: 300, rarity: 'rare' },
  { id: 'c32', name: 'Dançarino', type: 'character', emoji: '💃', price: 350, rarity: 'rare' },
  { id: 'c33', name: 'Surfista', type: 'character', emoji: '🏄', price: 400, rarity: 'epic' },
  { id: 'c34', name: 'Skatista', type: 'character', emoji: '🛹', price: 450, rarity: 'epic' },
  { id: 'c35', name: 'Ciclista', type: 'character', emoji: '🚴', price: 500, rarity: 'epic' },
  { id: 'c36', name: 'Jogador', type: 'character', emoji: '🎮', price: 550, rarity: 'epic' },
  { id: 'c37', name: 'Guru', type: 'character', emoji: '🧘', price: 600, rarity: 'legendary' },
  { id: 'c38', name: 'Fantasma', type: 'character', emoji: '👻', price: 650, rarity: 'legendary' },
  { id: 'c39', name: 'Dragão', type: 'character', emoji: '🐉', price: 700, rarity: 'legendary' },
  { id: 'c40', name: 'Unicórnio', type: 'character', emoji: '🦄', price: 750, rarity: 'legendary' },
];

const mockCars: ShopItem[] = [
  { id: 'v1', name: 'F1 Clássico', type: 'car', emoji: '🏎️', price: 100, rarity: 'common' },
  { id: 'v2', name: 'Sedan Básico', type: 'car', emoji: '🚗', price: 150, rarity: 'common' },
  { id: 'v3', name: 'SUV Compacto', type: 'car', emoji: '🚙', price: 200, rarity: 'common' },
  { id: 'v4', name: 'Taxi Amarelo', type: 'car', emoji: '🚕', price: 250, rarity: 'common' },
  { id: 'v5', name: 'Carro Esporte', type: 'car', emoji: '🚘', price: 300, rarity: 'rare' },
  { id: 'v6', name: 'Conversível', type: 'car', emoji: '🏎️', price: 350, rarity: 'rare' },
  { id: 'v7', name: 'Jeep 4x4', type: 'car', emoji: '🚙', price: 400, rarity: 'rare' },
  { id: 'v8', name: 'Pick-up', type: 'car', emoji: '🛻', price: 450, rarity: 'epic' },
  { id: 'v9', name: 'Caminhão', type: 'car', emoji: '🚚', price: 500, rarity: 'epic' },
  { id: 'v10', name: 'Van Luxo', type: 'car', emoji: '🚐', price: 550, rarity: 'epic' },
  { id: 'v11', name: 'Ônibus', type: 'car', emoji: '🚌', price: 600, rarity: 'epic' },
  { id: 'v12', name: 'Ambulância', type: 'car', emoji: '🚑', price: 650, rarity: 'epic' },
  { id: 'v13', name: 'Carro Polícia', type: 'car', emoji: '🚓', price: 700, rarity: 'legendary' },
  { id: 'v14', name: 'Carro Bombeiros', type: 'car', emoji: '🚒', price: 750, rarity: 'legendary' },
  { id: 'v15', name: 'Limousine', type: 'car', emoji: '🚙', price: 800, rarity: 'legendary' },
  { id: 'v16', name: 'Trator', type: 'car', emoji: '🚜', price: 200, rarity: 'common' },
  { id: 'v17', name: 'Moto Básica', type: 'car', emoji: '🏍️', price: 250, rarity: 'common' },
  { id: 'v18', name: 'Scooter', type: 'car', emoji: '🛵', price: 300, rarity: 'common' },
  { id: 'v19', name: 'Bicicleta', type: 'car', emoji: '🚲', price: 350, rarity: 'rare' },
  { id: 'v20', name: 'Monocicleta', type: 'car', emoji: '🚲', price: 400, rarity: 'rare' },
  { id: 'v21', name: 'Trem', type: 'car', emoji: '🚂', price: 450, rarity: 'epic' },
  { id: 'v22', name: 'Metrô', type: 'car', emoji: '🚇', price: 500, rarity: 'epic' },
  { id: 'v23', name: 'Avião', type: 'car', emoji: '✈️', price: 550, rarity: 'epic' },
  { id: 'v24', name: 'Helicóptero', type: 'car', emoji: '🚁', price: 600, rarity: 'legendary' },
  { id: 'v25', name: 'Foguete', type: 'car', emoji: '🚀', price: 650, rarity: 'legendary' },
  { id: 'v26', name: 'UFO', type: 'car', emoji: '🛸', price: 700, rarity: 'legendary' },
  { id: 'v27', name: 'Barco', type: 'car', emoji: '⛵', price: 750, rarity: 'legendary' },
  { id: 'v28', name: 'Iate', type: 'car', emoji: '🛥️', price: 800, rarity: 'legendary' },
  { id: 'v29', name: 'Submarino', type: 'car', emoji: '🚢', price: 200, rarity: 'common' },
  { id: 'v30', name: 'Tanque Guerra', type: 'car', emoji: '🚙', price: 250, rarity: 'rare' },
  { id: 'v31', name: 'Buggy', type: 'car', emoji: '🏎️', price: 300, rarity: 'rare' },
  { id: 'v32', name: 'Monster Truck', type: 'car', emoji: '🚚', price: 350, rarity: 'epic' },
  { id: 'v33', name: 'Dragster', type: 'car', emoji: '🏎️', price: 400, rarity: 'epic' },
  { id: 'v34', name: 'NASCAR', type: 'car', emoji: '🏁', price: 450, rarity: 'epic' },
  { id: 'v35', name: 'Rally', type: 'car', emoji: '🚗', price: 500, rarity: 'epic' },
  { id: 'v36', name: 'Formula E', type: 'car', emoji: '🏎️', price: 550, rarity: 'legendary' },
  { id: 'v37', name: 'Batmóvel', type: 'car', emoji: '🦇', price: 600, rarity: 'legendary' },
  { id: 'v38', name: 'DeLorean', type: 'car', emoji: '⚡', price: 650, rarity: 'legendary' },
  { id: 'v39', name: 'Carro Voador', type: 'car', emoji: '🚗', price: 700, rarity: 'legendary' },
  { id: 'v40', name: 'Tesla Cybertruck', type: 'car', emoji: '🔺', price: 750, rarity: 'legendary' },
];

export const useShopStore = create<ShopState>()(
  persist(
    (set, get) => ({
      items: [...mockCharacters, ...mockCars],
      userPurchases: {},
      addItem: (item) => set((state) => ({ items: [...state.items, item] })),
      purchaseItem: (userId, itemId) => set((state) => ({
        userPurchases: {
          ...state.userPurchases,
          [userId]: [...(state.userPurchases[userId] || []), itemId]
        }
      })),
      getUserItems: (userId) => {
        const state = get();
        const purchasedIds = state.userPurchases[userId] || [];
        return state.items.filter(item => purchasedIds.includes(item.id));
      }
    }),
    {
      name: 'growthlab-shop'
    }
  )
);
