import { motion } from 'framer-motion';
import { useGameStore } from '@/store/useGameStore';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Trophy, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RaceTrackScenario, type ScenarioType } from '@/components/RaceTrackScenarios';
import { useEffect, useState } from 'react';

const RaceTrack = () => {
  const { raceId } = useParams();
  const navigate = useNavigate();
  const { races, users } = useGameStore();
  const [liveParticipants, setLiveParticipants] = useState<any[]>([]);
  
  // Simula atualização em tempo real a cada 5 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveParticipants(prev => {
        if (prev.length === 0) return prev;
        return prev.map(p => ({
          ...p,
          points: p.points + Math.floor(Math.random() * 50)
        }));
      });
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  const race = races.find(r => r.id === raceId);
  
  if (!race) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#6000c4] to-[#01051e] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Corrida não encontrada</h2>
          <Button onClick={() => navigate('/races')} variant="outline">
            Voltar
          </Button>
        </div>
      </div>
    );
  }

  // Pegar participantes com suas pontuações
  const initialParticipants = race.participants.map(userId => {
    const user = users.find(u => u.id === userId);
    return {
      id: userId,
      name: user?.name || 'Usuário',
      points: user?.points || 0,
      avatar: user?.avatar || '🚗'
    };
  });
  
  // Usar participantes ao vivo ou iniciais
  const participants = (liveParticipants.length > 0 ? liveParticipants : initialParticipants)
    .sort((a, b) => b.points - a.points);
  
  // Atualizar participantes ao vivo quando mudar
  useEffect(() => {
    if (liveParticipants.length === 0) {
      setLiveParticipants(initialParticipants);
    }
  }, [race.id]);
  
  // Definir cenário baseado no tema da corrida
  const getScenarioFromTheme = (theme: string): ScenarioType => {
    const themeMap: Record<string, ScenarioType> = {
      'vendas': 'city',
      'prospecção': 'highway',
      'meta anual': 'futuristic',
      'trimestre': 'mountain',
      'sprint': 'beach'
    };
    const themeKey = Object.keys(themeMap).find(key => theme.toLowerCase().includes(key));
    return themeMap[themeKey || ''] || 'city';
  };
  
  const scenario = getScenarioFromTheme(race.theme);

  // Calcular posição na pista (0-100%)
  const maxPoints = Math.max(...participants.map(p => p.points), 1);
  const getPosition = (points: number) => {
    return (points / maxPoints) * 85; // 85% max para não sair da tela
  };

  // Carros diferentes para cada posição
  const vehicles = ['🏎️', '🚙', '🚗', '🚕', '🚐'];

  return (
    <div className="min-h-screen overflow-hidden relative bg-gradient-to-b from-sky-400 via-sky-300 to-sky-200">
      {/* Céu com nuvens */}
      <div className="absolute top-0 left-0 right-0 h-[35%] overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${i * 18}%`,
              top: `${20 + Math.random() * 60}px`
            }}
            animate={{
              x: [0, 40, 0],
            }}
            transition={{
              duration: 15 + Math.random() * 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <div className="bg-white/80 rounded-full px-16 py-6 shadow-lg" />
          </motion.div>
        ))}
      </div>

      {/* Skyline de prédios */}
      <div className="absolute top-[15%] left-0 right-0 h-[25%] flex items-end z-5">
        {[...Array(20)].map((_, i) => {
          const height = 60 + Math.random() * 120;
          const width = 40 + Math.random() * 30;
          return (
            <div
              key={i}
              className="relative"
              style={{
                width: `${width}px`,
                height: `${height}px`,
                marginLeft: i === 0 ? '0' : '-5px',
                background: `linear-gradient(to top, ${
                  i % 4 === 0 ? '#374151' : 
                  i % 4 === 1 ? '#1f2937' : 
                  i % 4 === 2 ? '#4b5563' : '#6b7280'
                }, ${
                  i % 4 === 0 ? '#6b7280' : 
                  i % 4 === 1 ? '#374151' : 
                  i % 4 === 2 ? '#9ca3af' : '#d1d5db'
                })`
              }}
            >
              {/* Janelas */}
              <div className="absolute inset-2 grid grid-cols-3 gap-1">
                {[...Array(Math.floor(height / 15))].map((_, j) => (
                  <div key={j} className="flex gap-1">
                    {[...Array(3)].map((_, k) => (
                      <motion.div
                        key={k}
                        className="w-2 h-2"
                        style={{
                          backgroundColor: Math.random() > 0.4 ? '#fef08a' : '#1f2937'
                        }}
                        animate={Math.random() > 0.7 ? { opacity: [1, 0.3, 1] } : {}}
                        transition={{ duration: 2 + Math.random() * 3, repeat: Infinity }}
                      />
                    ))}
                  </div>
                ))}
              </div>
              {/* Topo do prédio */}
              {i % 3 === 0 && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-3 h-8 bg-red-500 rounded-full">
                  <motion.div
                    className="w-full h-full bg-red-400 rounded-full"
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Arquibancadas grandes */}
      <div className="absolute top-[35%] left-[2%] w-[25%] h-20 z-10">
        <div className="w-full h-full bg-gradient-to-b from-gray-500 to-gray-700 rounded-t-lg border-t-4 border-gray-400">
          <div className="grid grid-cols-12 gap-1 p-2">
            {[...Array(36)].map((_, i) => (
              <motion.div 
                key={i} 
                className="w-3 h-4 rounded-full"
                style={{ backgroundColor: ['#ef4444', '#3b82f6', '#22c55e', '#eab308', '#8b5cf6', '#ec4899'][i % 6] }}
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 0.4, repeat: Infinity, delay: i * 0.05 }}
              />
            ))}
          </div>
        </div>
        <div className="w-full h-4 bg-gradient-to-b from-gray-700 to-gray-800" />
      </div>

      <div className="absolute top-[35%] right-[2%] w-[25%] h-20 z-10">
        <div className="w-full h-full bg-gradient-to-b from-gray-500 to-gray-700 rounded-t-lg border-t-4 border-gray-400">
          <div className="grid grid-cols-12 gap-1 p-2">
            {[...Array(36)].map((_, i) => (
              <motion.div 
                key={i} 
                className="w-3 h-4 rounded-full"
                style={{ backgroundColor: ['#ef4444', '#3b82f6', '#22c55e', '#eab308', '#8b5cf6', '#ec4899'][i % 6] }}
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 0.4, repeat: Infinity, delay: i * 0.08 }}
              />
            ))}
          </div>
        </div>
        <div className="w-full h-4 bg-gradient-to-b from-gray-700 to-gray-800" />
      </div>

      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-20 p-4">
        <div className="flex items-center justify-between">
          <Button 
            onClick={() => navigate('/races')}
            variant="ghost"
            className="text-gray-800 bg-white/50 hover:bg-white/70"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Calendar className="w-4 h-4 text-gray-700" />
              <span className="text-xs text-gray-700 bg-white/50 px-2 py-1 rounded">
                {new Date(race.startDate).toLocaleDateString()} - {new Date(race.endDate).toLocaleDateString()}
              </span>
            </div>
            <h1 className="text-2xl md:text-4xl font-bold text-gray-800 drop-shadow-lg">
              🏁 {race.name}
            </h1>
          </div>
          
          <div className="w-20" />
        </div>
      </div>

      {/* Área da pista - posicionada mais acima */}
      <div className="absolute top-[28%] left-0 right-0 z-15">
        {/* Grama verde superior */}
        <div className="h-8 bg-gradient-to-b from-green-500 to-green-600">
          <div className="absolute inset-0 opacity-20 bg-[repeating-linear-gradient(90deg,transparent,transparent_30px,#166534_30px,#166534_32px)]" />
        </div>

        {/* Placas de publicidade */}
        <div className="absolute top-0 left-0 right-0 flex justify-around px-8 z-10">
          {['SPEED', 'TURBO', 'RACE', 'FAST', 'WIN', 'GO!'].map((text, i) => (
            <div 
              key={i}
              className="px-4 py-1 bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500 rounded text-white text-xs font-bold shadow-lg"
            >
              {text}
            </div>
          ))}
        </div>

        {/* Zebra superior */}
        <div className="h-3 bg-[repeating-linear-gradient(90deg,#dc2626_0px,#dc2626_25px,#ffffff_25px,#ffffff_50px)]" />

        {/* PISTA DE ASFALTO PRINCIPAL */}
        <div className="relative h-[180px] bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 shadow-[inset_0_10px_30px_rgba(0,0,0,0.6)] overflow-visible">
          {/* Textura do asfalto */}
          <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle,#fff_1px,transparent_1px)] bg-[size:10px_10px]" />
          
          {/* Linhas tracejadas - múltiplas faixas */}
          <div className="absolute top-[33%] left-0 right-0 h-1 bg-[repeating-linear-gradient(90deg,#ffffff_0px,#ffffff_50px,transparent_50px,transparent_100px)] opacity-60" />
          <div className="absolute top-[66%] left-0 right-0 h-1 bg-[repeating-linear-gradient(90deg,#ffffff_0px,#ffffff_50px,transparent_50px,transparent_100px)] opacity-60" />
          
          {/* Linha de largada/chegada */}
          <div className="absolute right-[8%] top-0 bottom-0 w-10 bg-[repeating-linear-gradient(0deg,#ffffff_0px,#ffffff_12px,#000000_12px,#000000_24px)]" />
          
          {/* Bandeira quadriculada */}
          <div className="absolute right-[7%] -top-8 z-20">
            <div className="w-12 h-10 bg-[conic-gradient(#000_0deg_90deg,#fff_90deg_180deg,#000_180deg_270deg,#fff_270deg_360deg)] bg-[length:12px_10px] border-2 border-gray-600" />
            <div className="w-2 h-10 bg-gray-600 mx-auto" />
          </div>

          {/* Participantes */}
          {participants.map((participant, index) => {
            const position = getPosition(participant.points);
            const totalLanes = participants.length;
            const laneHeight = 180 / (totalLanes + 1);
            const verticalPos = (index + 1) * laneHeight - 20;
            
            return (
              <motion.div
                key={participant.id}
                className="absolute z-20"
                initial={{ left: '3%' }}
                animate={{ left: `${Math.min(position, 82)}%` }}
                transition={{ 
                  duration: 2,
                  delay: index * 0.15,
                  type: "spring",
                  stiffness: 60
                }}
                style={{
                  top: `${verticalPos}px`
                }}
              >
                {/* Badge - posicionado ao lado do carro */}
                <motion.div
                  className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap z-30"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.15 + 0.5 }}
                >
                  <div className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-500 to-cyan-500 px-2.5 py-1 rounded-full shadow-xl border-2 border-white/50">
                    <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center font-bold text-emerald-600 text-xs">
                      {index + 1}
                    </div>
                    <span className="font-bold text-white text-[11px]">
                      {participant.name.split(' ')[0].toUpperCase()} | {participant.points}
                    </span>
                  </div>
                </motion.div>

                {/* Carro */}
                <motion.div
                  className="relative"
                  animate={{ x: [0, 1, 0, -1, 0] }}
                  transition={{ duration: 0.2, repeat: Infinity }}
                >
                  <div className="absolute top-9 left-1 w-10 h-2 bg-black/40 rounded-full blur-sm" />
                  <div className="text-4xl drop-shadow-xl">
                    {vehicles[index % vehicles.length]}
                  </div>
                  {/* Rastro de velocidade */}
                  <motion.div
                    className="absolute top-1/2 -translate-y-1/2 -left-5 flex gap-0.5"
                    animate={{ opacity: [0.2, 0.7, 0.2] }}
                    transition={{ duration: 0.3, repeat: Infinity }}
                  >
                    <div className="w-3 h-0.5 bg-white/60 rounded-full" />
                    <div className="w-2 h-0.5 bg-white/40 rounded-full" />
                  </motion.div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        {/* Zebra inferior */}
        <div className="h-3 bg-[repeating-linear-gradient(90deg,#dc2626_0px,#dc2626_25px,#ffffff_25px,#ffffff_50px)]" />

        {/* Grama verde inferior */}
        <div className="h-6 bg-gradient-to-b from-green-600 to-green-700" />

        {/* Área de escape (brita) */}
        <div className="h-6 bg-gradient-to-b from-amber-300 to-amber-400">
          <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle,#92400e_2px,transparent_2px)] bg-[size:8px_8px]" />
        </div>

        {/* Muro de proteção */}
        <div className="h-2 bg-gradient-to-b from-blue-500 to-blue-700" />
      </div>

      {/* Área do pódio com fundo */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-sky-100 to-sky-200 z-25">
        {/* Pódio centralizado */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-end gap-2">
          {[1, 0, 2].map((podiumIndex) => {
            const participant = participants[podiumIndex];
            if (!participant) return null;
            const heights = ['h-14', 'h-20', 'h-10'];
            const colors = [
              'from-gray-300 to-gray-400 border-gray-200',
              'from-yellow-400 to-yellow-500 border-yellow-300', 
              'from-orange-400 to-orange-500 border-orange-300'
            ];
            const positions = [2, 1, 3];
            return (
              <motion.div
                key={podiumIndex}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2 + podiumIndex * 0.15, type: "spring" }}
                className="text-center"
              >
                <div className={`w-18 ${heights[podiumIndex]} rounded-t-lg flex flex-col items-center justify-center bg-gradient-to-b ${colors[podiumIndex]} shadow-lg border-t-4`}>
                  <Trophy className="w-4 h-4 text-white mb-0.5 drop-shadow" />
                  <span className="text-sm font-bold text-white drop-shadow">{positions[podiumIndex]}°</span>
                </div>
                <div className="bg-gray-800/95 px-1.5 py-0.5 rounded-b-lg shadow-lg">
                  <p className="text-[8px] text-white font-medium truncate max-w-[70px]">
                    {participant.name}
                  </p>
                  <p className="text-[8px] text-emerald-400 font-bold">{participant.points} pts</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RaceTrack;
