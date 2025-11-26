import { motion } from 'framer-motion';

export type ScenarioType = 'city' | 'highway' | 'desert' | 'forest' | 'beach' | 'mountain' | 'night' | 'snow' | 'futuristic';

interface ScenarioProps {
  type: ScenarioType;
  className?: string;
}

export const RaceTrackScenario = ({ type, className = '' }: ScenarioProps) => {
  const scenarios = {
    city: (
      <div className={`absolute inset-0 ${className}`}>
        {/* Asfalto */}
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-gray-800 to-gray-700">
          <div className="absolute inset-0 opacity-30 bg-[repeating-linear-gradient(90deg,transparent,transparent_50px,white_50px,white_52px)]" />
        </div>
        
        {/* Prédios */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bottom-48"
            style={{
              left: `${i * 10}%`,
              width: `${60 + Math.random() * 40}px`,
              height: `${100 + Math.random() * 150}px`,
              backgroundColor: i % 3 === 0 ? '#4a5568' : i % 3 === 1 ? '#2d3748' : '#1a202c'
            }}
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 3 + Math.random() * 2, repeat: Infinity }}
          >
            {/* Janelas */}
            <div className="grid grid-cols-3 gap-1 p-2">
              {[...Array(15)].map((_, j) => (
                <div
                  key={j}
                  className={`w-2 h-2 ${Math.random() > 0.5 ? 'bg-yellow-300' : 'bg-gray-700'}`}
                />
              ))}
            </div>
          </motion.div>
        ))}
        
        {/* Árvores urbanas */}
        {[...Array(8)].map((_, i) => (
          <div
            key={`tree-${i}`}
            className="absolute bottom-48"
            style={{ left: `${i * 12 + 5}%` }}
          >
            <div className="w-8 h-20 bg-green-700 rounded-full" />
            <div className="w-2 h-12 bg-amber-800 mx-auto" />
          </div>
        ))}
      </div>
    ),
    
    highway: (
      <div className={`absolute inset-0 ${className}`}>
        {/* Asfalto da rodovia */}
        <div className="absolute bottom-0 left-0 right-0 h-56 bg-gradient-to-t from-gray-700 via-gray-600 to-gray-500">
          {/* Linhas da pista */}
          <motion.div 
            className="absolute top-1/2 left-0 right-0 h-1 bg-white"
            animate={{ x: [0, 100, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <div className="absolute top-1/3 left-0 right-0 h-1 bg-yellow-400 opacity-70" />
        </div>
        
        {/* Placas e postes */}
        {[...Array(10)].map((_, i) => (
          <div key={i} className="absolute" style={{ left: `${i * 10}%`, bottom: '220px' }}>
            <div className="w-1 h-24 bg-gray-400" />
            <div className="w-8 h-8 bg-blue-600 rounded" />
          </div>
        ))}
        
        {/* Montanhas ao fundo */}
        <svg className="absolute bottom-56 w-full h-32" viewBox="0 0 1440 120">
          <path d="M0,80 L180,40 L360,70 L540,30 L720,60 L900,20 L1080,50 L1260,35 L1440,60 L1440,120 L0,120 Z" fill="#4a5568" opacity="0.4" />
        </svg>
      </div>
    ),
    
    desert: (
      <div className={`absolute inset-0 ${className}`}>
        {/* Areia */}
        <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-yellow-700 via-yellow-600 to-yellow-500">
          <motion.div
            className="absolute inset-0 opacity-20"
            animate={{ backgroundPosition: ['0px 0px', '100px 100px'] }}
            transition={{ duration: 20, repeat: Infinity }}
            style={{ backgroundImage: 'radial-gradient(circle, #d97706 1px, transparent 1px)', backgroundSize: '20px 20px' }}
          />
        </div>
        
        {/* Dunas */}
        <svg className="absolute bottom-64 w-full h-40" viewBox="0 0 1440 160">
          <motion.path
            d="M0,80 Q360,20 720,80 T1440,80 L1440,160 L0,160 Z"
            fill="#d97706"
            opacity="0.3"
            animate={{ d: ['M0,80 Q360,20 720,80 T1440,80 L1440,160 L0,160 Z', 'M0,70 Q360,100 720,70 T1440,70 L1440,160 L0,160 Z'] }}
            transition={{ duration: 8, repeat: Infinity, repeatType: 'reverse' }}
          />
        </svg>
        
        {/* Cactos */}
        {[...Array(6)].map((_, i) => (
          <div key={i} className="absolute" style={{ left: `${i * 15 + 10}%`, bottom: '250px' }}>
            <div className="relative">
              <div className="w-4 h-20 bg-green-600 mx-auto" />
              <div className="absolute top-8 -left-3 w-8 h-3 bg-green-600 rounded-l-full" />
              <div className="absolute top-12 -right-3 w-8 h-3 bg-green-600 rounded-r-full" />
            </div>
          </div>
        ))}
      </div>
    ),
    
    forest: (
      <div className={`absolute inset-0 ${className}`}>
        {/* Chão da floresta */}
        <div className="absolute bottom-0 left-0 right-0 h-56 bg-gradient-to-t from-green-900 to-green-800">
          <div className="absolute inset-0 opacity-20 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,#1a5f0a_10px,#1a5f0a_20px)]" />
        </div>
        
        {/* Árvores grandes */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${i * 8}%`,
              bottom: `${180 + Math.random() * 40}px`,
              zIndex: Math.floor(Math.random() * 10)
            }}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 3 + Math.random() * 2, repeat: Infinity }}
          >
            <div className="w-16 h-32 bg-green-700 rounded-full" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }} />
            <div className="w-4 h-24 bg-amber-900 mx-auto" />
          </motion.div>
        ))}
        
        {/* Arbustos */}
        {[...Array(20)].map((_, i) => (
          <div
            key={`bush-${i}`}
            className="absolute bottom-56"
            style={{ left: `${i * 6}%` }}
          >
            <div className="w-8 h-6 bg-green-600 rounded-full" />
          </div>
        ))}
      </div>
    ),
    
    beach: (
      <div className={`absolute inset-0 ${className}`}>
        {/* Areia da praia */}
        <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-yellow-200 via-yellow-100 to-blue-200" />
        
        {/* Ondas do mar */}
        <svg className="absolute bottom-64 w-full h-32" viewBox="0 0 1440 120">
          <motion.path
            d="M0,60 Q360,20 720,60 T1440,60 L1440,120 L0,120 Z"
            fill="#3b82f6"
            opacity="0.5"
            animate={{
              d: [
                'M0,60 Q360,20 720,60 T1440,60 L1440,120 L0,120 Z',
                'M0,50 Q360,80 720,50 T1440,50 L1440,120 L0,120 Z',
                'M0,60 Q360,20 720,60 T1440,60 L1440,120 L0,120 Z'
              ]
            }}
            transition={{ duration: 4, repeat: Infinity }}
          />
        </svg>
        
        {/* Palmeiras */}
        {[...Array(5)].map((_, i) => (
          <div key={i} className="absolute" style={{ left: `${i * 20 + 10}%`, bottom: '240px' }}>
            <div className="w-2 h-32 bg-amber-900" />
            {[...Array(6)].map((_, j) => (
              <div
                key={j}
                className="absolute top-0 left-1 w-16 h-3 bg-green-600 rounded-full origin-left"
                style={{ transform: `rotate(${j * 60}deg)` }}
              />
            ))}
          </div>
        ))}
      </div>
    ),
    
    mountain: (
      <div className={`absolute inset-0 ${className}`}>
        {/* Chão rochoso */}
        <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-gray-600 via-gray-500 to-gray-400">
          <div className="absolute inset-0 opacity-30 bg-[repeating-linear-gradient(45deg,transparent,transparent_15px,#4a5568_15px,#4a5568_30px)]" />
        </div>
        
        {/* Montanhas */}
        <svg className="absolute bottom-64 w-full h-64" viewBox="0 0 1440 256">
          <path d="M0,150 L200,80 L400,120 L600,50 L800,90 L1000,30 L1200,100 L1440,70 L1440,256 L0,256 Z" fill="#374151" opacity="0.7" />
          <path d="M0,180 L300,120 L600,160 L900,100 L1200,140 L1440,110 L1440,256 L0,256 Z" fill="#4b5563" opacity="0.5" />
        </svg>
        
        {/* Neve nos picos */}
        <svg className="absolute bottom-64 w-full h-64" viewBox="0 0 1440 256">
          <path d="M200,80 L250,90 L300,85 L250,80 Z" fill="white" opacity="0.9" />
          <path d="M600,50 L650,60 L700,55 L650,50 Z" fill="white" opacity="0.9" />
          <path d="M1000,30 L1050,40 L1100,35 L1050,30 Z" fill="white" opacity="0.9" />
        </svg>
        
        {/* Pinheiros */}
        {[...Array(8)].map((_, i) => (
          <div key={i} className="absolute" style={{ left: `${i * 12 + 5}%`, bottom: '250px' }}>
            <div className="w-8 h-16 bg-green-800" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }} />
            <div className="w-2 h-12 bg-amber-900 mx-auto" />
          </div>
        ))}
      </div>
    ),
    
    night: (
      <div className={`absolute inset-0 bg-gradient-to-b from-indigo-950 via-purple-950 to-gray-900 ${className}`}>
        {/* Estrelas */}
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 60}%`
            }}
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 2 + Math.random() * 3, repeat: Infinity }}
          />
        ))}
        
        {/* Lua */}
        <div className="absolute top-20 right-20 w-20 h-20 bg-yellow-100 rounded-full shadow-[0_0_30px_rgba(255,255,200,0.5)]" />
        
        {/* Asfalto noturno */}
        <div className="absolute bottom-0 left-0 right-0 h-56 bg-gradient-to-t from-gray-900 to-gray-800">
          <div className="absolute inset-0 opacity-20 bg-[repeating-linear-gradient(90deg,transparent,transparent_50px,white_50px,white_52px)]" />
        </div>
        
        {/* Postes de luz */}
        {[...Array(8)].map((_, i) => (
          <div key={i} className="absolute" style={{ left: `${i * 12}%`, bottom: '220px' }}>
            <div className="w-2 h-32 bg-gray-700" />
            <div className="w-8 h-6 bg-yellow-300 rounded-full blur-sm" />
            <div className="absolute top-32 left-1/2 -translate-x-1/2 w-16 h-16 bg-yellow-200 rounded-full opacity-30 blur-xl" />
          </div>
        ))}
        
        {/* Prédios com luzes */}
        {[...Array(10)].map((_, i) => (
          <div
            key={`building-${i}`}
            className="absolute bottom-56 bg-gray-900"
            style={{
              left: `${i * 10}%`,
              width: `${40 + Math.random() * 30}px`,
              height: `${80 + Math.random() * 100}px`
            }}
          >
            <div className="grid grid-cols-2 gap-1 p-1">
              {[...Array(12)].map((_, j) => (
                <div key={j} className={`w-2 h-2 ${Math.random() > 0.6 ? 'bg-yellow-300' : 'bg-gray-800'}`} />
              ))}
            </div>
          </div>
        ))}
      </div>
    ),
    
    snow: (
      <div className={`absolute inset-0 bg-gradient-to-b from-blue-100 to-white ${className}`}>
        {/* Neve caindo */}
        {[...Array(40)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full"
            style={{ left: `${Math.random() * 100}%` }}
            animate={{
              y: [0, 800],
              x: [0, Math.random() * 50 - 25]
            }}
            transition={{
              duration: 5 + Math.random() * 5,
              repeat: Infinity,
              delay: Math.random() * 5
            }}
          />
        ))}
        
        {/* Chão nevado */}
        <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-white via-blue-50 to-blue-100">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle,#3b82f6_1px,transparent_1px)] bg-[size:20px_20px]" />
        </div>
        
        {/* Colinas de neve */}
        <svg className="absolute bottom-64 w-full h-40" viewBox="0 0 1440 160">
          <path d="M0,100 Q360,60 720,100 T1440,100 L1440,160 L0,160 Z" fill="white" opacity="0.8" />
        </svg>
        
        {/* Árvores cobertas de neve */}
        {[...Array(10)].map((_, i) => (
          <div key={i} className="absolute" style={{ left: `${i * 10 + 5}%`, bottom: '240px' }}>
            <div className="relative">
              <div className="w-12 h-20 bg-green-700" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }} />
              <div className="absolute top-0 left-0 right-0 w-12 h-8 bg-white" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }} />
              <div className="w-2 h-16 bg-amber-900 mx-auto" />
            </div>
          </div>
        ))}
        
        {/* Bonecos de neve */}
        {[...Array(3)].map((_, i) => (
          <div key={`snowman-${i}`} className="absolute" style={{ left: `${i * 30 + 15}%`, bottom: '250px' }}>
            <div className="w-8 h-8 bg-white rounded-full mx-auto" />
            <div className="w-10 h-10 bg-white rounded-full mx-auto" />
            <div className="absolute top-1 left-1/2 -translate-x-1/2 flex gap-1">
              <div className="w-1 h-1 bg-black rounded-full" />
              <div className="w-1 h-1 bg-black rounded-full" />
            </div>
          </div>
        ))}
      </div>
    ),
    
    futuristic: (
      <div className={`absolute inset-0 bg-gradient-to-b from-purple-900 via-indigo-900 to-cyan-900 ${className}`}>
        {/* Grid holográfico */}
        <div className="absolute inset-0 opacity-20 bg-[repeating-linear-gradient(0deg,transparent,transparent_50px,#00ffff_50px,#00ffff_51px),repeating-linear-gradient(90deg,transparent,transparent_50px,#00ffff_50px,#00ffff_51px)]" />
        
        {/* Pista holográfica */}
        <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-cyan-500/20 to-transparent">
          <motion.div
            className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent,transparent_100px,#00ffff_100px,#00ffff_102px)]"
            animate={{ x: [0, 100, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        </div>
        
        {/* Prédios futuristas */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bottom-64 bg-gradient-to-t from-cyan-500 to-purple-600 rounded-t-lg"
            style={{
              left: `${i * 12}%`,
              width: `${50 + Math.random() * 40}px`,
              height: `${120 + Math.random() * 180}px`,
              boxShadow: '0 0 20px rgba(0,255,255,0.5)'
            }}
            animate={{
              boxShadow: [
                '0 0 20px rgba(0,255,255,0.5)',
                '0 0 40px rgba(255,0,255,0.8)',
                '0 0 20px rgba(0,255,255,0.5)'
              ]
            }}
            transition={{ duration: 2 + Math.random() * 2, repeat: Infinity }}
          >
            <div className="grid grid-cols-3 gap-1 p-2">
              {[...Array(15)].map((_, j) => (
                <motion.div
                  key={j}
                  className="w-2 h-2 bg-cyan-300 rounded-sm"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1 + Math.random(), repeat: Infinity }}
                />
              ))}
            </div>
          </motion.div>
        ))}
        
        {/* Partículas flutuantes */}
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute w-1 h-1 bg-cyan-300 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
            animate={{
              y: [0, -50, 0],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 3 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 3
            }}
          />
        ))}
      </div>
    )
  };

  return scenarios[type] || scenarios.city;
};

export const getScenarioName = (type: ScenarioType): string => {
  const names: Record<ScenarioType, string> = {
    city: 'Cidade Urbana',
    highway: 'Rodovia',
    desert: 'Deserto',
    forest: 'Floresta',
    beach: 'Praia',
    mountain: 'Montanha',
    night: 'Cidade Noturna',
    snow: 'Neve',
    futuristic: 'Futurista'
  };
  return names[type];
};