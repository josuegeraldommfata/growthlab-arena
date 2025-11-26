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

      {/* Pista de corrida */}
      <div className="absolute bottom-0 left-0 right-0 h-[60vh] z-5">
        {/* Ondas decorativas */}
        <svg className="absolute bottom-0 w-full h-32 z-0" viewBox="0 0 1440 120" preserveAspectRatio="none">
          <motion.path
            d="M0,60 Q180,20 360,60 T720,60 T1080,60 T1440,60 L1440,120 L0,120 Z"
            fill="#00e1aB"
            opacity="0.3"
            animate={{
              d: [
                "M0,60 Q180,20 360,60 T720,60 T1080,60 T1440,60 L1440,120 L0,120 Z",
                "M0,50 Q180,80 360,50 T720,50 T1080,50 T1440,50 L1440,120 L0,120 Z",
                "M0,60 Q180,20 360,60 T720,60 T1080,60 T1440,60 L1440,120 L0,120 Z"
              ]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.path
            d="M0,80 Q240,40 480,80 T960,80 T1440,80 L1440,120 L0,120 Z"
            fill="#00b1f5"
            opacity="0.2"
            animate={{
              d: [
                "M0,80 Q240,40 480,80 T960,80 T1440,80 L1440,120 L0,120 Z",
                "M0,70 Q240,100 480,70 T960,70 T1440,70 L1440,120 L0,120 Z",
                "M0,80 Q240,40 480,80 T960,80 T1440,80 L1440,120 L0,120 Z"
              ]
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </svg>

        {/* Linha da pista */}
        <div className="absolute bottom-32 left-0 right-0 h-1 bg-white/30 z-10" />
        <motion.div 
          className="absolute bottom-32 left-0 h-1 bg-gradient-to-r from-[#00e1aB] to-[#00b1f5] z-10"
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 2 }}
        />

        {/* Participantes */}
        <div className="absolute bottom-36 left-0 right-0 z-20">
          {participants.map((participant, index) => {
            const position = getPosition(participant.points);
            
            return (
              <motion.div
                key={participant.id}
                className="absolute"
                initial={{ left: '0%' }}
                animate={{ left: `${position}%` }}
                transition={{ 
                  duration: 2,
                  delay: index * 0.2,
                  type: "spring",
                  stiffness: 50
                }}
                style={{
                  bottom: `${index * 80}px`
                }}
              >
                {/* Badge com nome e pontos */}
                <motion.div
                  className="absolute -top-16 left-1/2 -translate-x-1/2 whitespace-nowrap"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 + 0.5 }}
                >
                  <div className="flex items-center gap-2 bg-gradient-to-r from-[#00e1aB] to-[#00b1f5] px-4 py-2 rounded-full shadow-lg">
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center font-bold text-[#6000c4]">
                      {index + 1}
                    </div>
                    <span className="font-bold text-white font-['Montserrat']">
                      {participant.name.toUpperCase()} | {participant.points} pts
                    </span>
                  </div>
                </motion.div>

                {/* Veículo */}
                <motion.div
                  className="text-6xl filter drop-shadow-lg"
                  animate={{
                    y: [0, -8, 0],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  {vehicles[index % vehicles.length]}
                </motion.div>
              </motion.div>
            );
          })}
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
