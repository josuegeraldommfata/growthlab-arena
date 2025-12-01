import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useGameStore } from '@/store/useGameStore';
import { Trophy, Calendar, Users, Flag, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Races = () => {
  const { races } = useGameStore();
  const navigate = useNavigate();

  const getStatusBadge = (status: string) => {
    const statusMap = {
      active: { label: 'Ativa', class: 'bg-primary text-primary-foreground' },
      upcoming: { label: 'Em breve', class: 'bg-secondary text-secondary-foreground' },
      finished: { label: 'Finalizada', class: 'bg-muted text-muted-foreground' }
    };
    return statusMap[status as keyof typeof statusMap] || statusMap.active;
  };

  return (
    <Layout>
      <div className="p-4 md:p-6 lg:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">Corridas 🏁</h1>
          <p className="text-sm md:text-base text-muted-foreground mb-6 md:mb-8">
            Acompanhe as corridas e sua posição no ranking!
          </p>

          <div className="grid gap-6">
            {races.map((race, index) => {
              const statusInfo = getStatusBadge(race.status);
              
              return (
                <motion.div
                  key={race.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="p-4 md:p-6">
                    <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-4">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-2">
                          <Trophy className="w-6 h-6 text-primary" />
                          <h3 className="text-2xl font-bold">{race.name}</h3>
                        </div>
                        <p className="text-muted-foreground">{race.theme}</p>
                      </div>
                      <Badge className={statusInfo.class}>
                        {statusInfo.label}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                      <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                        <Calendar className="w-5 h-5 text-primary" />
                        <div>
                          <p className="text-sm text-muted-foreground">Início</p>
                          <p className="font-medium">{new Date(race.startDate).toLocaleDateString()}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                        <Flag className="w-5 h-5 text-secondary" />
                        <div>
                          <p className="text-sm text-muted-foreground">Término</p>
                          <p className="font-medium">{new Date(race.endDate).toLocaleDateString()}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                        <Users className="w-5 h-5 text-accent" />
                        <div>
                          <p className="text-sm text-muted-foreground">Participantes</p>
                          <p className="font-medium">{race.participants.length}</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4">
                      <p className="text-sm font-medium mb-2">Indicadores:</p>
                      <div className="flex gap-2">
                        {race.indicators.map(indicator => (
                          <Badge key={indicator} variant="outline">
                            {indicator}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {race.status === 'active' && (
                      <div className="mt-6 space-y-3">
                        <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                          <p className="text-sm font-medium text-primary">
                            🔥 Você está participando desta corrida! Continue completando tarefas para subir no ranking.
                          </p>
                        </div>
                        <Button 
                          onClick={() => navigate(`/race-track/${race.id}`)}
                          className="w-full bg-gradient-to-r from-primary to-secondary"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Ver Pista de Corrida
                        </Button>
                      </div>
                    )}
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Races;
