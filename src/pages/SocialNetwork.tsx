import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { useAuthStore } from '@/store/useAuthStore';
import { useTimelineStore } from '@/store/useTimelineStore';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Send, 
  Calendar, 
  Image, 
  Video, 
  Mic, 
  BarChart3,
  X,
  Play,
  Pause,
  Plus,
  Trash2,
  Check
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PollOption {
  id: string;
  text: string;
  votes: number;
}

const SocialNetwork = () => {
  const user = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);
  const { posts, addPost, likePost, sharePost } = useTimelineStore();
  const [newPost, setNewPost] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [showSchedule, setShowSchedule] = useState(false);
  const { toast } = useToast();
  
  // Media states
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Poll states
  const [showPoll, setShowPoll] = useState(false);
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState<PollOption[]>([
    { id: '1', text: '', votes: 0 },
    { id: '2', text: '', votes: 0 },
  ]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setSelectedVideo(url);
    }
  };
  
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível acessar o microfone",
        variant: "destructive",
      });
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
    }
  };
  
  const addPollOption = () => {
    if (pollOptions.length < 4) {
      setPollOptions([...pollOptions, { id: Date.now().toString(), text: '', votes: 0 }]);
    }
  };
  
  const removePollOption = (id: string) => {
    if (pollOptions.length > 2) {
      setPollOptions(pollOptions.filter(opt => opt.id !== id));
    }
  };
  
  const updatePollOption = (id: string, text: string) => {
    setPollOptions(pollOptions.map(opt => opt.id === id ? { ...opt, text } : opt));
  };
  
  const clearMedia = () => {
    setSelectedImage(null);
    setSelectedVideo(null);
    setAudioUrl(null);
    setShowPoll(false);
    setPollQuestion('');
    setPollOptions([
      { id: '1', text: '', votes: 0 },
      { id: '2', text: '', votes: 0 },
    ]);
  };
  
  const handlePost = () => {
    if (!user) return;
    if (!newPost.trim() && !selectedImage && !selectedVideo && !audioUrl && !showPoll) return;
    
    const postTimestamp = scheduledDate || new Date().toISOString();
    const isScheduled = !!scheduledDate && new Date(scheduledDate) > new Date();
    
    // Build content with media references
    let content = newPost;
    if (showPoll && pollQuestion && pollOptions.every(opt => opt.text.trim())) {
      content += `\n\n📊 ENQUETE: ${pollQuestion}\n${pollOptions.map((opt, i) => `${i + 1}. ${opt.text}`).join('\n')}`;
    }
    if (selectedImage) {
      content += '\n\n[📷 Imagem anexada]';
    }
    if (selectedVideo) {
      content += '\n\n[🎥 Vídeo anexado]';
    }
    if (audioUrl) {
      content += '\n\n[🎙️ Áudio anexado]';
    }
    
    addPost({
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      content,
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
    clearMedia();
    
    toast({
      title: isScheduled ? "Post agendado!" : "Post publicado!",
      description: isScheduled ? "Seu post será publicado na data agendada" : "+10 XP e +5 Coins",
    });
  };

  const handleLike = (postId: string) => {
    if (!user) return;
    likePost(postId, user.id);
    updateUser({ 
      xp: (user.xp || 0) + 2,
      coins: (user.coins || 0) + 1
    });
  };

  const handleShare = (postId: string) => {
    if (!user) return;
    sharePost(postId);
    updateUser({ 
      xp: (user.xp || 0) + 5,
      coins: (user.coins || 0) + 3
    });
    toast({
      title: "Post compartilhado!",
      description: "+5 XP e +3 Coins",
    });
  };

  const formatRecordingTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Layout>
      <div className="p-4 md:p-8 max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Rede Social 💬</h1>
          <p className="text-muted-foreground mb-8">
            Compartilhe suas conquistas, crie enquetes e interaja com a equipe!
          </p>

          <Card className="p-4 md:p-6 mb-6">
            <div className="flex gap-3 md:gap-4">
              <div className="text-2xl md:text-3xl">{user?.avatar}</div>
              <div className="flex-1">
                <Textarea
                  placeholder="O que você está pensando?"
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  className="min-h-20 md:min-h-24 mb-3"
                />
                
                {/* Media Preview */}
                {(selectedImage || selectedVideo || audioUrl) && (
                  <div className="mb-3 space-y-2">
                    {selectedImage && (
                      <div className="relative inline-block">
                        <img src={selectedImage} alt="Preview" className="max-h-40 rounded-lg" />
                        <Button 
                          variant="destructive" 
                          size="icon" 
                          className="absolute top-1 right-1 w-6 h-6"
                          onClick={() => setSelectedImage(null)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                    {selectedVideo && (
                      <div className="relative inline-block">
                        <video src={selectedVideo} controls className="max-h-40 rounded-lg" />
                        <Button 
                          variant="destructive" 
                          size="icon" 
                          className="absolute top-1 right-1 w-6 h-6"
                          onClick={() => setSelectedVideo(null)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                    {audioUrl && (
                      <div className="flex items-center gap-2 p-2 bg-muted rounded-lg">
                        <audio src={audioUrl} controls className="flex-1 h-8" />
                        <Button 
                          variant="destructive" 
                          size="icon" 
                          className="w-6 h-6"
                          onClick={() => setAudioUrl(null)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Poll Creator */}
                {showPoll && (
                  <div className="mb-3 p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <Label className="flex items-center gap-2">
                        <BarChart3 className="w-4 h-4" />
                        Criar Enquete
                      </Label>
                      <Button variant="ghost" size="icon" className="w-6 h-6" onClick={() => setShowPoll(false)}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    <Input
                      placeholder="Pergunta da enquete..."
                      value={pollQuestion}
                      onChange={(e) => setPollQuestion(e.target.value)}
                      className="mb-3"
                    />
                    <div className="space-y-2">
                      {pollOptions.map((option, index) => (
                        <div key={option.id} className="flex gap-2">
                          <Input
                            placeholder={`Opção ${index + 1}`}
                            value={option.text}
                            onChange={(e) => updatePollOption(option.id, e.target.value)}
                          />
                          {pollOptions.length > 2 && (
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => removePollOption(option.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                    {pollOptions.length < 4 && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-2"
                        onClick={addPollOption}
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Adicionar opção
                      </Button>
                    )}
                  </div>
                )}
                
                {/* Recording indicator */}
                {isRecording && (
                  <div className="mb-3 p-3 bg-red-500/10 rounded-lg flex items-center gap-3">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                    <span className="text-red-500 font-medium">Gravando... {formatRecordingTime(recordingTime)}</span>
                    <Button variant="destructive" size="sm" onClick={stopRecording}>
                      Parar
                    </Button>
                  </div>
                )}
                
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
                
                {/* Media buttons */}
                <div className="flex flex-wrap gap-2 mb-3">
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                  <input
                    type="file"
                    accept="video/*"
                    ref={videoInputRef}
                    onChange={handleVideoSelect}
                    className="hidden"
                  />
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    className="gap-1"
                  >
                    <Image className="w-4 h-4" />
                    <span className="hidden sm:inline">Imagem</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => videoInputRef.current?.click()}
                    className="gap-1"
                  >
                    <Video className="w-4 h-4" />
                    <span className="hidden sm:inline">Vídeo</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={isRecording ? stopRecording : startRecording}
                    className={`gap-1 ${isRecording ? 'bg-red-500/10 text-red-500' : ''}`}
                  >
                    <Mic className="w-4 h-4" />
                    <span className="hidden sm:inline">{isRecording ? 'Parar' : 'Áudio'}</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowPoll(!showPoll)}
                    className={`gap-1 ${showPoll ? 'bg-primary/10 text-primary' : ''}`}
                  >
                    <BarChart3 className="w-4 h-4" />
                    <span className="hidden sm:inline">Enquete</span>
                  </Button>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    onClick={handlePost}
                    disabled={!newPost.trim() && !selectedImage && !selectedVideo && !audioUrl && !(showPoll && pollQuestion)}
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
                <Card className="p-4 md:p-6">
                  <div className="flex gap-3 md:gap-4 mb-4">
                    <div className="text-2xl md:text-3xl">{post.userAvatar}</div>
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

                  <div className="mb-4 whitespace-pre-wrap">
                    {post.content.split('\n').map((line, i) => {
                      // Render poll with voting buttons
                      if (line.startsWith('📊 ENQUETE:')) {
                        return (
                          <div key={i} className="my-3 p-3 bg-muted/50 rounded-lg">
                            <p className="font-semibold mb-3">{line}</p>
                          </div>
                        );
                      }
                      if (/^\d+\.\s/.test(line) && post.content.includes('📊 ENQUETE:')) {
                        return (
                          <Button 
                            key={i} 
                            variant="outline" 
                            className="w-full justify-start mb-2"
                            onClick={() => toast({ title: "Voto registrado!", description: line })}
                          >
                            <Check className="w-4 h-4 mr-2" />
                            {line}
                          </Button>
                        );
                      }
                      return <p key={i}>{line}</p>;
                    })}
                  </div>

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

export default SocialNetwork;
