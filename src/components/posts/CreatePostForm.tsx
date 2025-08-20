
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
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'video' | 'image' | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Limpar preview anterior
      if (mediaPreview) {
        URL.revokeObjectURL(mediaPreview);
      }
      
      if (file.type.startsWith('video/')) {
        setMediaFile(file);
        setMediaType('video');
        const url = URL.createObjectURL(file);
        setMediaPreview(url);
      } else if (file.type.startsWith('image/')) {
        setMediaFile(file);
        setMediaType('image');
        const url = URL.createObjectURL(file);
        setMediaPreview(url);
      } else {
        toast.error('Por favor, selecione apenas arquivos de vídeo ou imagem');
        // Limpar input
        e.target.value = '';
      }
    }
  };

  const removeMedia = () => {
    setMediaFile(null);
    setMediaType(null);
    if (mediaPreview) {
      URL.revokeObjectURL(mediaPreview);
      setMediaPreview(null);
    }
    // Limpar input file
    const fileInput = document.getElementById('media-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const uploadMedia = async (file: File): Promise<string | null> => {
    if (!user?.id) {
      console.error('User ID não encontrado');
      return null;
    }

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      const bucketName = file.type.startsWith('video/') ? 'post-videos' : 'post-images';

      console.log('Fazendo upload para bucket:', bucketName, 'arquivo:', fileName);

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Erro no upload:', uploadError);
        throw uploadError;
      }

      console.log('Upload realizado com sucesso:', uploadData);

      const { data: urlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(fileName);

      console.log('URL pública gerada:', urlData.publicUrl);
      return urlData.publicUrl;
    } catch (error) {
      console.error('Erro durante upload de mídia:', error);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.id) {
      toast.error('Usuário não autenticado');
      return;
    }

    const trimmedContent = content.trim();
    if (!trimmedContent && !mediaFile) {
      toast.error('Adicione um texto, vídeo ou imagem para criar o post');
      return;
    }

    setUploading(true);
    console.log('Iniciando criação de post...');

    try {
      let mediaUrl = null;
      
      if (mediaFile) {
        console.log('Fazendo upload de mídia...');
        mediaUrl = await uploadMedia(mediaFile);
        if (!mediaUrl) {
          toast.error('Erro ao fazer upload da mídia');
          return;
        }
        console.log('Upload de mídia concluído:', mediaUrl);
      }

      const postData: any = {
        user_id: user.id,
        content: trimmedContent || null,
      };

      if (mediaType === 'video' && mediaUrl) {
        postData.video_url = mediaUrl;
      } else if (mediaType === 'image' && mediaUrl) {
        postData.image_url = mediaUrl;
      }

      console.log('Dados do post a serem inseridos:', postData);

      const { data: insertData, error: insertError } = await supabase
        .from('posts')
        .insert([postData])
        .select();

      if (insertError) {
        console.error('Erro ao inserir post:', insertError);
        toast.error(`Erro ao criar post: ${insertError.message}`);
        return;
      }

      console.log('Post criado com sucesso:', insertData);
      toast.success('Post criado com sucesso!');
      
      // Resetar formulário
      setContent('');
      removeMedia();
      
      // Chamar callback
      onPostCreated();
      
    } catch (err) {
      console.error('Erro inesperado ao criar post:', err);
      toast.error('Erro inesperado ao criar post');
    } finally {
      setUploading(false);
    }
  };

  // Cleanup na desmontagem do componente
  React.useEffect(() => {
    return () => {
      if (mediaPreview) {
        URL.revokeObjectURL(mediaPreview);
      }
    };
  }, [mediaPreview]);

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
              disabled={uploading}
            />
          </div>

          <div>
            <label htmlFor="media-upload" className="block text-sm font-medium mb-2">
              Adicionar Mídia (opcional)
            </label>
            <div className="flex items-center gap-4">
              <Input
                id="media-upload"
                type="file"
                accept="video/*,image/*"
                onChange={handleMediaChange}
                className="hidden"
                disabled={uploading}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('media-upload')?.click()}
                disabled={uploading}
              >
                <Video className="h-4 w-4 mr-2" />
                Selecionar Mídia
              </Button>
              {mediaFile && (
                <span className="text-sm text-muted-foreground">
                  {mediaFile.name}
                </span>
              )}
            </div>
          </div>

          {mediaPreview && (
            <div className="relative">
              {mediaType === 'video' ? (
                <video
                  src={mediaPreview}
                  controls
                  className="w-full max-h-64 rounded-lg"
                />
              ) : (
                <img
                  src={mediaPreview}
                  alt="Preview"
                  className="w-full max-h-64 rounded-lg object-cover"
                />
              )}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={removeMedia}
                className="absolute top-2 right-2"
                disabled={uploading}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={uploading || (!content.trim() && !mediaFile)}
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
