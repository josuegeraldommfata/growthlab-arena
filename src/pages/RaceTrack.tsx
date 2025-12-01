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
    <div className="min-h-screen overflow-hidden relative">
      {/* Cenário de fundo */}
      <RaceTrackScenario type={scenario} />
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 p-6">
        <Button 
          onClick={() => navigate('/races')}
          variant="ghost"
          className="text-white mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
        
        <div className="text-center text-white">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Calendar className="w-5 h-5 text-[#00e1aB]" />
            <span className="text-sm">
              Início: {new Date(race.startDate).toLocaleDateString()} | 
              Término: {new Date(race.endDate).toLocaleDateString()}
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold font-['Kanggez'] mb-2">
            {race.name}
          </h1>
        </div>
      </div>

      {/* Nuvens decorativas */}
      <div className="absolute top-20 left-0 right-0 z-0">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${i * 15}%`,
              top: `${Math.random() * 100}px`
            }}
            animate={{
              x: [0, 30, 0],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-full px-12 py-3 border border-white/20" />
          </motion.div>
        ))}
      </div>

      {/* Pista de Fórmula 1 */}
      <div className="absolute bottom-0 left-0 right-0 h-[55vh] z-5">
        {/* Grama verde ao redor */}
        <div className="absolute bottom-0 left-0 right-0 h-full bg-gradient-to-t from-green-700 via-green-600 to-green-500">
          {/* Textura da grama */}
          <div className="absolute inset-0 opacity-30 bg-[repeating-linear-gradient(90deg,transparent,transparent_20px,#228B22_20px,#228B22_22px)]" />
        </div>

        {/* Zebra externa (vermelho/branco) - borda superior da pista */}
        <div className="absolute bottom-[280px] left-0 right-0 h-4 bg-[repeating-linear-gradient(90deg,#dc2626_0px,#dc2626_30px,#ffffff_30px,#ffffff_60px)]" />
        
        {/* Pista de asfalto principal */}
        <div className="absolute bottom-[120px] left-0 right-0 h-[160px] bg-gradient-to-b from-gray-800 via-gray-700 to-gray-800 shadow-[inset_0_5px_20px_rgba(0,0,0,0.5)]">
          {/* Textura do asfalto */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle,#000_1px,transparent_1px)] bg-[size:8px_8px]" />
          
          {/* Linhas brancas tracejadas da pista */}
          <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-1 bg-[repeating-linear-gradient(90deg,#ffffff_0px,#ffffff_40px,transparent_40px,transparent_80px)] opacity-80" />
          
          {/* Linha de largada/chegada */}
          <div className="absolute right-[10%] top-0 bottom-0 w-8 bg-[repeating-linear-gradient(0deg,#ffffff_0px,#ffffff_10px,#000000_10px,#000000_20px)]" />
          
          {/* Bandeira quadriculada na chegada */}
          <div className="absolute right-[10%] -top-12 w-12 h-10">
            <div className="w-full h-full bg-[repeating-conic-gradient(#000_0deg_90deg,#fff_90deg_180deg)] bg-[length:8px_8px]" />
            <div className="absolute -bottom-8 left-1/2 w-1 h-8 bg-gray-600" />
          </div>
        </div>
        
        {/* Zebra interna (vermelho/branco) - borda inferior da pista */}
        <div className="absolute bottom-[116px] left-0 right-0 h-4 bg-[repeating-linear-gradient(90deg,#dc2626_0px,#dc2626_30px,#ffffff_30px,#ffffff_60px)]" />
        
        {/* Área de escape (brita) */}
        <div className="absolute bottom-[80px] left-0 right-0 h-[36px] bg-gradient-to-b from-amber-200 to-amber-300">
          <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle,#92400e_2px,transparent_2px)] bg-[size:6px_6px]" />
        </div>
        
        {/* Muro de proteção */}
        <div className="absolute bottom-[76px] left-0 right-0 h-2 bg-gradient-to-b from-blue-500 to-blue-700" />
        <div className="absolute bottom-[72px] left-0 right-0 h-1 bg-white" />
        
        {/* Placas de publicidade ao longo da pista */}
        {[...Array(8)].map((_, i) => (
          <div 
            key={i} 
            className="absolute bottom-[284px]"
            style={{ left: `${i * 12 + 5}%` }}
          >
            <div className="w-16 h-6 bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500 rounded-sm flex items-center justify-center">
              <span className="text-[8px] font-bold text-white">SPEED</span>
            </div>
          </div>
        ))}

        {/* Participantes na pista */}
        <div className="absolute bottom-[120px] left-0 right-0 h-[160px] z-20">
          {participants.map((participant, index) => {
            const position = getPosition(participant.points);
            const laneHeight = 160 / Math.max(participants.length, 1);
            const lanePosition = index * laneHeight + laneHeight / 2 - 30;
            
            return (
              <motion.div
                key={participant.id}
                className="absolute"
                initial={{ left: '5%' }}
                animate={{ left: `${Math.min(position, 85)}%` }}
                transition={{ 
                  duration: 2,
                  delay: index * 0.2,
                  type: "spring",
                  stiffness: 50
                }}
                style={{
                  top: `${lanePosition}px`
                }}
              >
                {/* Badge com nome e pontos */}
                <motion.div
                  className="absolute -top-14 left-1/2 -translate-x-1/2 whitespace-nowrap"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 + 0.5 }}
                >
                  <div className="flex items-center gap-2 bg-gradient-to-r from-[#00e1aB] to-[#00b1f5] px-3 py-1.5 rounded-full shadow-lg border-2 border-white/30">
                    <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center font-bold text-[#6000c4] text-sm">
                      {index + 1}
                    </div>
                    <span className="font-bold text-white text-sm">
                      {participant.name.toUpperCase()} | {participant.points} pts
                    </span>
                  </div>
                </motion.div>

                {/* Carro de F1 */}
                <motion.div
                  className="relative"
                  animate={{
                    x: [0, 2, 0, -2, 0],
                  }}
                  transition={{
                    duration: 0.3,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                >
                  {/* Sombra do carro */}
                  <div className="absolute top-8 left-2 w-12 h-3 bg-black/30 rounded-full blur-sm" />
                  
                  {/* Carro */}
                  <div className="text-5xl filter drop-shadow-lg transform -rotate-0">
                    {vehicles[index % vehicles.length]}
                  </div>
                  
                  {/* Efeito de velocidade */}
                  <motion.div
                    className="absolute top-1/2 -left-8 flex gap-1"
                    animate={{ opacity: [0.3, 0.8, 0.3], x: [-5, 0, -5] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                  >
                    <div className="w-6 h-0.5 bg-gray-400 rounded-full" />
                    <div className="w-4 h-0.5 bg-gray-300 rounded-full" />
                    <div className="w-2 h-0.5 bg-gray-200 rounded-full" />
                  </motion.div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
        
        {/* Arquibancada no fundo */}
        <div className="absolute bottom-[300px] left-[5%] w-[30%] h-16">
          <div className="w-full h-full bg-gradient-to-t from-gray-600 to-gray-500 rounded-t-lg">
            {/* Pessoas na arquibancada */}
            <div className="flex flex-wrap gap-1 p-2">
              {[...Array(20)].map((_, i) => (
                <motion.div 
                  key={i} 
                  className="w-2 h-3 rounded-full"
                  style={{ backgroundColor: ['#ef4444', '#3b82f6', '#22c55e', '#eab308', '#8b5cf6'][i % 5] }}
                  animate={{ y: [0, -2, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Pódio (top 3) */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-4">
        {participants.slice(0, 3).map((participant, index) => (
          <motion.div
            key={participant.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 2 + index * 0.2 }}
            className="text-center"
          >
            <div className={`w-20 h-24 rounded-t-lg flex flex-col items-center justify-center ${
              index === 0 ? 'bg-gradient-to-b from-yellow-400 to-yellow-600' :
              index === 1 ? 'bg-gradient-to-b from-gray-300 to-gray-500' :
              'bg-gradient-to-b from-orange-400 to-orange-600'
            }`}>
              <Trophy className="w-8 h-8 text-white mb-1" />
              <span className="text-2xl font-bold text-white">{index + 1}°</span>
            </div>
            <div className="bg-white/20 backdrop-blur-sm px-3 py-2 rounded-b-lg">
              <p className="text-xs text-white font-medium truncate max-w-[80px]">
                {participant.name}
              </p>
              <p className="text-xs text-[#00e1aB] font-bold">{participant.points} pts</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default RaceTrack;
