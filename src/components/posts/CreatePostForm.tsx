
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Video, Image, X, Upload } from 'lucide-react';
import { toast } from 'sonner';

interface CreatePostFormProps {
  onPostCreated: () => void;
  onCancel: () => void;
}

const CreatePostForm: React.FC<CreatePostFormProps> = ({ onPostCreated, onCancel }) => {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith('video/')) {
        setVideoFile(file);
        const url = URL.createObjectURL(file);
        setVideoPreview(url);
      } else {
        toast.error('Por favor, selecione apenas arquivos de vídeo');
      }
    }
  };

  const removeVideo = () => {
    setVideoFile(null);
    if (videoPreview) {
      URL.revokeObjectURL(videoPreview);
      setVideoPreview(null);
    }
  };

  const uploadVideo = async (file: File): Promise<string | null> => {
    if (!user) return null;

    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('post-videos')
      .upload(fileName, file);

    if (uploadError) {
      console.error('Error uploading video:', uploadError);
      return null;
    }

    const { data } = supabase.storage
      .from('post-videos')
      .getPublicUrl(fileName);

    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || (!content.trim() && !videoFile)) {
      toast.error('Adicione um texto ou vídeo para criar o post');
      return;
    }

    setUploading(true);

    try {
      let videoUrl = null;
      
      if (videoFile) {
        videoUrl = await uploadVideo(videoFile);
        if (!videoUrl) {
          toast.error('Erro ao fazer upload do vídeo');
          setUploading(false);
          return;
        }
      }

      const { error } = await supabase
        .from('posts')
        .insert([
          {
            user_id: user.id,
            content: content.trim() || null,
            video_url: videoUrl,
          },
        ]);

      if (error) {
        console.error('Error creating post:', error);
        toast.error('Erro ao criar post');
      } else {
        toast.success('Post criado com sucesso!');
        onPostCreated();
      }
    } catch (err) {
      console.error('Unexpected error creating post:', err);
      toast.error('Erro inesperado ao criar post');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Image className="h-5 w-5 mr-2" />
          Criar Novo Post
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Textarea
              placeholder="O que você está pensando?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>

          <div>
            <label htmlFor="video-upload" className="block text-sm font-medium mb-2">
              Adicionar Vídeo (opcional)
            </label>
            <div className="flex items-center gap-4">
              <Input
                id="video-upload"
                type="file"
                accept="video/*"
                onChange={handleVideoChange}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('video-upload')?.click()}
              >
                <Video className="h-4 w-4 mr-2" />
                Selecionar Vídeo
              </Button>
              {videoFile && (
                <span className="text-sm text-muted-foreground">
                  {videoFile.name}
                </span>
              )}
            </div>
          </div>

          {videoPreview && (
            <div className="relative">
              <video
                src={videoPreview}
                controls
                className="w-full max-h-64 rounded-lg"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={removeVideo}
                className="absolute top-2 right-2"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={uploading || (!content.trim() && !videoFile)}
              className="bg-green-600 hover:bg-green-700"
            >
              {uploading ? (
                <>
                  <Upload className="h-4 w-4 mr-2 animate-spin" />
                  Publicando...
                </>
              ) : (
                'Publicar'
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={uploading}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreatePostForm;
