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

  // Calcular posição na pista baseada na pontuação
  const maxPoints = Math.max(...participants.map(p => p.points), 1);
  const minPoints = Math.min(...participants.map(p => p.points), 0);
  const getPosition = (points: number) => {
    // Todos começam na posição inicial, mas diferenças de pontuação criam separação VISÍVEL
    if (maxPoints === minPoints) return 2; // Se todos têm a mesma pontuação, ficam no início
    const normalizedPoints = (points - minPoints) / (maxPoints - minPoints);
    // Usa exponencial forte para amplificar MUITO as diferenças e evitar que fiquem lado a lado
    // Quanto menor a pontuação, MUITO mais atrás fica
    const separationFactor = Math.pow(1 - normalizedPoints, 2.5); // Exponencial forte para amplificar
    return 2 + (separationFactor * 40); // Primeiro em 2%, outros bem separados até 42%
  };

  // Carros diferentes para cada posição - todos virados para direita (finish line)
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
          const height = 80 + Math.random() * 140;
          const width = 50 + Math.random() * 35;
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
            </div>
          );
        })}
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


        {/* Zebra superior */}
        <div className="h-3 bg-[repeating-linear-gradient(90deg,#dc2626_0px,#dc2626_25px,#ffffff_25px,#ffffff_50px)]" />

        {/* PISTA DE ASFALTO PRINCIPAL */}
        <div className="relative h-[180px] bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 shadow-[inset_0_10px_30px_rgba(0,0,0,0.6)] overflow-visible">
          {/* Textura do asfalto */}
          <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle,#fff_1px,transparent_1px)] bg-[size:10px_10px]" />
          
          {/* Linhas tracejadas - múltiplas faixas */}
          <div className="absolute top-[33%] left-0 right-0 h-1 bg-[repeating-linear-gradient(90deg,#ffffff_0px,#ffffff_50px,transparent_50px,transparent_100px)] opacity-60" />
          <div className="absolute top-[66%] left-0 right-0 h-1 bg-[repeating-linear-gradient(90deg,#ffffff_0px,#ffffff_50px,transparent_50px,transparent_100px)] opacity-60" />
          
          {/* Linha de largada/chegada - removida da pista */}

          {/* Participantes */}
          {participants.map((participant, index) => {
            // Posição baseada no RANK (1, 2, 3, 4) - INVERTIDO
            // 1º lugar: mais atrás, 2º: pouco à frente, 3º: mais à frente, 4º: na frente
            const rankPositions = [25, 15, 5, 2]; // Posições fixas por rank (1º atrás, 4º na frente)
            const position = rankPositions[index] || 2;
            const totalLanes = participants.length;
            const laneHeight = 180 / (totalLanes + 1);
            const verticalPos = (index + 1) * laneHeight - 20;
            
            return (
              <motion.div
                key={participant.id}
                className="absolute z-20"
                initial={{ left: '2%' }}
                animate={{ left: `${position}%` }}
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
                {/* Carro - virado para direita (finish line) */}
                <motion.div
                  className="relative"
                  animate={{ x: [0, 1, 0, -1, 0] }}
                  transition={{ duration: 0.2, repeat: Infinity }}
                  style={{ transform: 'scaleX(-1)' }}
                >
                  <div className="absolute top-9 left-1 w-10 h-2 bg-black/40 rounded-full blur-sm" />
                  <div className="text-4xl drop-shadow-xl" style={{ transform: 'scaleX(-1)' }}>
                    {vehicles[index % vehicles.length]}
                  </div>
                  {/* Rastro de velocidade - atrás do carro (lado esquerdo) */}
                  <motion.div
                    className="absolute top-1/2 -translate-y-1/2 -left-5 flex gap-0.5"
                    animate={{ opacity: [0.2, 0.7, 0.2] }}
                    transition={{ duration: 0.3, repeat: Infinity }}
                  >
                    <div className="w-3 h-0.5 bg-white/60 rounded-full" />
                    <div className="w-2 h-0.5 bg-white/40 rounded-full" />
                  </motion.div>
                </motion.div>

                {/* Badge - posicionado à frente (direita) do carro para não tampar */}
                <motion.div
                  className="absolute top-1/2 -translate-y-1/2 left-full ml-4 whitespace-nowrap z-30"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
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

      {/* Faixa de chegada tipo F1 e bandeira - no final da pista, fora da pista */}
      <div className="absolute top-[28%] right-0 h-[180px] z-25">
        {/* Linha de chegada tipo F1 - faixas pretas e brancas verticais - cobrindo toda a altura da pista */}
        <div className="absolute right-14 top-8 bottom-0 w-[55px] h-[192px] bg-[repeating-linear-gradient(0deg,#ffffff_0px,#ffffff_12px,#000000_12px,#000000_24px)]" />
        
        {/* Bandeira quadriculada - acima da faixa de chegada, um pouco mais alta */}
        <div className="absolute right-14 -top-14 z-30">
          <div className="w-14 h-12 bg-[conic-gradient(#000_0deg_90deg,#fff_90deg_180deg,#000_180deg_270deg,#fff_270deg_360deg)] bg-[length:14px_12px] border-2 border-gray-600 shadow-xl" />
          <div className="w-2.5 h-12 bg-gray-600 mx-auto shadow-lg" />
        </div>
      </div>

      {/* Arquibancada com bonequinhos animados - abaixo da pista e acima dos troféus */}
      <div className="absolute bottom-32 left-0 right-0 h-28 z-20">
        {/* Estrutura da arquibancada melhorada */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-gray-500 via-gray-600 to-gray-800 rounded-t-xl border-t-4 border-gray-400 shadow-2xl">
          {/* Degraus da arquibancada */}
          <div className="absolute bottom-0 left-0 right-0 h-5 bg-gradient-to-b from-gray-400 to-gray-500 rounded-t-lg" />
          <div className="absolute bottom-5 left-0 right-0 h-4 bg-gradient-to-b from-gray-500 to-gray-600" />
          <div className="absolute bottom-9 left-0 right-0 h-3 bg-gradient-to-b from-gray-600 to-gray-700" />
          <div className="absolute bottom-12 left-0 right-0 h-2 bg-gradient-to-b from-gray-700 to-gray-800" />
        </div>

        {/* Bonequinhos animados com plaquinhas - posicionados fixos, apenas animados */}
        {participants.map((participant, index) => {
          const colors = ['#ef4444', '#3b82f6', '#22c55e', '#eab308', '#8b5cf6', '#ec4899'];
          const participantColor = colors[index % colors.length];
          // Posição fixa distribuída pela arquibancada (não baseada em pontuação)
          const fixedPosition = 10 + (index * 20) + Math.random() * 5;
          
          return (
            <motion.div
              key={`crowd-${participant.id}`}
              className="absolute bottom-16 z-30"
              style={{ left: `${fixedPosition}%` }}
            >
              {/* Plaquinha com nome melhorada */}
              <motion.div
                className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap z-40"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.3 }}
              >
                <div className="bg-white px-2.5 py-1 rounded-md shadow-xl border-2 border-gray-400">
                  <p className="text-[11px] font-bold text-gray-800">
                    {participant.name.split(' ')[0]}
                  </p>
                </div>
                {/* Seta apontando para baixo */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-transparent border-t-white" />
              </motion.div>

              {/* Bonequinho animado melhorado */}
              <motion.div
                className="relative"
                animate={{ 
                  y: [0, -6, 0],
                }}
                transition={{ 
                  duration: 0.8 + Math.random() * 0.3,
                  repeat: Infinity,
                  delay: index * 0.15
                }}
              >
                {/* Cabeça melhorada */}
                <div 
                  className="w-7 h-7 rounded-full mx-auto mb-1 shadow-lg border-2 border-white/50 relative"
                  style={{ backgroundColor: participantColor }}
                >
                  {/* Olhos */}
                  <div className="absolute top-2 left-1.5 w-1 h-1 bg-white rounded-full" />
                  <div className="absolute top-2 right-1.5 w-1 h-1 bg-white rounded-full" />
                  {/* Boca */}
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-3 h-1 bg-white/80 rounded-full" />
                </div>
                {/* Corpo melhorado */}
                <div 
                  className="w-6 h-8 rounded-lg mx-auto shadow-lg relative"
                  style={{ backgroundColor: participantColor }}
                >
                  {/* Detalhes do corpo */}
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 w-3 h-1 bg-white/30 rounded" />
                </div>
                {/* Braços (acenando) melhorados */}
                <motion.div
                  className="absolute top-2 -left-2 w-2.5 h-5 rounded-full shadow-md"
                  style={{ backgroundColor: participantColor }}
                  animate={{ rotate: [0, 25, -25, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: index * 0.15 }}
                />
                <motion.div
                  className="absolute top-2 -right-2 w-2.5 h-5 rounded-full shadow-md"
                  style={{ backgroundColor: participantColor }}
                  animate={{ rotate: [0, -25, 25, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: index * 0.15 + 0.3 }}
                />
              </motion.div>
            </motion.div>
          );
        })}

        {/* Bonequinhos genéricos adicionais - multidão na arquibancada */}
        {[...Array(12)].map((_, i) => {
          const colors = ['#ef4444', '#3b82f6', '#22c55e', '#eab308', '#8b5cf6', '#ec4899', '#f97316', '#06b6d4'];
          const randomColor = colors[Math.floor(Math.random() * colors.length)];
          const randomPosition = 5 + Math.random() * 90;
          const randomDelay = Math.random() * 0.5;
          
          return (
            <motion.div
              key={`generic-crowd-${i}`}
              className="absolute bottom-16 z-25"
              style={{ left: `${randomPosition}%` }}
            >
              {/* Bonequinho genérico animado */}
              <motion.div
                className="relative"
                animate={{ 
                  y: [0, -5, 0],
                }}
                transition={{ 
                  duration: 0.7 + Math.random() * 0.4,
                  repeat: Infinity,
                  delay: randomDelay
                }}
              >
                {/* Cabeça */}
                <div 
                  className="w-6 h-6 rounded-full mx-auto mb-0.5 shadow-md border border-white/40 relative"
                  style={{ backgroundColor: randomColor }}
                >
                  {/* Olhos */}
                  <div className="absolute top-1.5 left-1 w-0.5 h-0.5 bg-white rounded-full" />
                  <div className="absolute top-1.5 right-1 w-0.5 h-0.5 bg-white rounded-full" />
                </div>
                {/* Corpo */}
                <div 
                  className="w-5 h-6 rounded-md mx-auto shadow-md"
                  style={{ backgroundColor: randomColor }}
                />
                {/* Braços */}
                <motion.div
                  className="absolute top-1.5 -left-1.5 w-2 h-4 rounded-full"
                  style={{ backgroundColor: randomColor }}
                  animate={{ rotate: [0, 20, -20, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity, delay: randomDelay }}
                />
                <motion.div
                  className="absolute top-1.5 -right-1.5 w-2 h-4 rounded-full"
                  style={{ backgroundColor: randomColor }}
                  animate={{ rotate: [0, -20, 20, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity, delay: randomDelay + 0.25 }}
                />
              </motion.div>
            </motion.div>
          );
        })}

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

