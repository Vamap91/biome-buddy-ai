
import React, { useState, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Edit, Save, X, Upload, Image } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface CreatePostFormProps {
  onCreatePost: (post: {
    title: string;
    excerpt: string;
    content: string;
    category: string;
    tags: string[];
    image_url?: string;
  }) => void;
  onCancel: () => void;
}

const CreatePostForm: React.FC<CreatePostFormProps> = ({ onCreatePost, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: 'pesquisa',
    tags: [] as string[],
    newTag: '',
    image_url: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = useCallback((field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const addTag = useCallback(() => {
    if (formData.newTag.trim() && !formData.tags.includes(formData.newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, prev.newTag.trim()],
        newTag: ''
      }));
    }
  }, [formData.newTag, formData.tags]);

  const removeTag = useCallback((tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  }, []);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  }, [addTag]);

  const handleImageUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('blog-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('blog-images')
        .getPublicUrl(filePath);

      setFormData(prev => ({
        ...prev,
        image_url: data.publicUrl
      }));
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setUploadingImage(false);
    }
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!formData.title.trim() || !formData.content.trim()) return;
    
    setIsSubmitting(true);
    try {
      await onCreatePost({
        title: formData.title,
        excerpt: formData.excerpt || formData.content.slice(0, 200) + '...',
        content: formData.content,
        category: formData.category,
        tags: formData.tags,
        image_url: formData.image_url
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, onCreatePost]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-2xl">
            <Edit className="h-6 w-6 mr-2" />
            Compartilhar Conhecimento
          </CardTitle>
          <p className="text-gray-600">
            Contribua com a comunidade compartilhando suas descobertas, pesquisas e conhecimentos sobre biodiversidade.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Título do Post *</label>
            <Input
              placeholder="Digite um título atrativo para seu post..."
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Resumo/Excerpt</label>
            <Textarea
              placeholder="Escreva um resumo que desperte interesse (será gerado automaticamente se deixado em branco)"
              value={formData.excerpt}
              onChange={(e) => handleInputChange('excerpt', e.target.value)}
              rows={3}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Categoria *</label>
            <select 
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
              value={formData.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
            >
              <option value="descobertas">Descobertas</option>
              <option value="pesquisa">Pesquisa</option>
              <option value="conservacao">Conservação</option>
              <option value="educacao">Educação</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Imagem do Post</label>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingImage}
                  className="flex items-center gap-2"
                >
                  <Upload className="h-4 w-4" />
                  {uploadingImage ? 'Enviando...' : 'Selecionar Imagem'}
                </Button>
              </div>
              
              {formData.image_url && (
                <div className="relative">
                  <img
                    src={formData.image_url}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-lg border"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => setFormData(prev => ({ ...prev, image_url: '' }))}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Tags</label>
            <div className="flex gap-2 mb-2">
              <Input
                placeholder="Digite uma tag..."
                value={formData.newTag}
                onChange={(e) => handleInputChange('newTag', e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <Button onClick={addTag} variant="outline" type="button">
                Adicionar
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map(tag => (
                <Badge 
                  key={tag} 
                  variant="secondary" 
                  className="cursor-pointer hover:bg-gray-200" 
                  onClick={() => removeTag(tag)}
                >
                  {tag} <X className="h-3 w-3 ml-1" />
                </Badge>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Conteúdo *</label>
            <Textarea
              placeholder="Compartilhe seu conhecimento de forma detalhada e didática..."
              value={formData.content}
              onChange={(e) => handleInputChange('content', e.target.value)}
              rows={15}
            />
          </div>
          
          <div className="flex gap-3">
            <Button 
              onClick={handleSubmit} 
              className="bg-green-600 hover:bg-green-700"
              disabled={!formData.title.trim() || !formData.content.trim() || isSubmitting}
            >
              <Save className="h-4 w-4 mr-2" />
              {isSubmitting ? 'Publicando...' : 'Publicar Post'}
            </Button>
            <Button variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreatePostForm;
