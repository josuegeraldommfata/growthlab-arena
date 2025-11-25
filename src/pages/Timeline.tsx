import { useState } from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/store/useAuthStore';
import { useTimelineStore } from '@/store/useTimelineStore';
import { Heart, MessageCircle, Share2, Send, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Timeline = () => {
  const user = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);
  const { posts, addPost, likePost, sharePost } = useTimelineStore();
  const [newPost, setNewPost] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [showSchedule, setShowSchedule] = useState(false);
  const { toast } = useToast();

  const handlePost = () => {
    if (!newPost.trim() || !user) return;
    
    const postTimestamp = scheduledDate || new Date().toISOString();
    const isScheduled = !!scheduledDate && new Date(scheduledDate) > new Date();
    
    addPost({
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      content: newPost,
      timestamp: postTimestamp,
      scheduled: scheduledDate || undefined,
      isScheduled
    });
    
    if (!isScheduled) {
      updateUser({ 
        xp: (user.xp || 0) + 10,
        coins: (user.coins || 0) + 5
      });
    }
    
    setNewPost('');
    setScheduledDate('');
    setShowSchedule(false);
    
    toast({
      title: isScheduled ? "Post agendado!" : "Post publicado!",
      description: isScheduled ? "Seu post será publicado na data agendada" : "+10 XP e +5 Coins",
    });
  };

  const handleLike = (postId: string) => {
    if (!user) return;
    likePost(postId, user.id);
    
    // Dar pontos por curtir
    updateUser({ 
      xp: (user.xp || 0) + 2,
      coins: (user.coins || 0) + 1
    });
  };

  const handleShare = (postId: string) => {
    if (!user) return;
    sharePost(postId);
    
    // Dar pontos por compartilhar
    updateUser({ 
      xp: (user.xp || 0) + 5,
      coins: (user.coins || 0) + 3
    });
    
    toast({
      title: "Post compartilhado!",
      description: "+5 XP e +3 Coins",
    });
  };

  return (
    <Layout>
      <div className="p-8 max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold mb-2">Intranet 💬</h1>
          <p className="text-muted-foreground mb-8">
            Compartilhe suas conquistas e interaja com a equipe!
          </p>

          <Card className="p-6 mb-6">
            <div className="flex gap-4">
              <div className="text-3xl">{user?.avatar}</div>
              <div className="flex-1">
                <Textarea
                  placeholder="O que você está pensando?"
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  className="min-h-24 mb-3"
                />
                
                {showSchedule && (
                  <div className="mb-3">
                    <Label>Agendar publicação</Label>
                    <Input
                      type="datetime-local"
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                      min={new Date().toISOString().slice(0, 16)}
                    />
                  </div>
                )}
                
                <div className="flex gap-2">
                  <Button 
                    onClick={handlePost}
                    disabled={!newPost.trim()}
                    className="bg-gradient-to-r from-primary to-secondary"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {scheduledDate ? 'Agendar' : 'Publicar'}
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setShowSchedule(!showSchedule)}
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    {showSchedule ? 'Cancelar' : 'Agendar'}
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          <div className="space-y-4">
            {posts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6">
                  <div className="flex gap-4 mb-4">
                    <div className="text-3xl">{post.userAvatar}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold">{post.userName}</p>
                        {post.isScheduled && (
                          <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded">Agendado</span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {post.isScheduled ? `Agendado para ${new Date(post.timestamp).toLocaleString()}` : new Date(post.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <p className="mb-4 whitespace-pre-wrap">{post.content}</p>

                  <div className="flex items-center gap-4 pt-4 border-t">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleLike(post.id)}
                      className={user && post.likes.includes(user.id) ? 'text-primary' : ''}
                    >
                      <Heart className={`w-4 h-4 mr-1 ${user && post.likes.includes(user.id) ? 'fill-current' : ''}`} />
                      {post.likes.length}
                    </Button>

                    <Button variant="ghost" size="sm">
                      <MessageCircle className="w-4 h-4 mr-1" />
                      {post.comments.length}
                    </Button>

                    <Button variant="ghost" size="sm" onClick={() => handleShare(post.id)}>
                      <Share2 className="w-4 h-4 mr-1" />
                      {post.shares}
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Timeline;
