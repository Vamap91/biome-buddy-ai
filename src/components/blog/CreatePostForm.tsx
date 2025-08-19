
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Edit, Save, X } from 'lucide-react';

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  authorRole: string;
  authorAvatar: string;
  publishDate: string;
  category: string;
  tags: string[];
  readTime: string;
  views: number;
  likes: number;
  comments: number;
  featured: boolean;
}

interface CreatePostFormProps {
  onCreatePost: (post: Omit<BlogPost, 'id' | 'author' | 'authorRole' | 'authorAvatar' | 'publishDate' | 'readTime' | 'views' | 'likes' | 'comments' | 'featured'>) => void;
  onCancel: () => void;
}

const CreatePostForm: React.FC<CreatePostFormProps> = ({ onCreatePost, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: 'pesquisa',
    tags: [] as string[],
    newTag: ''
  });

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

  const handleSubmit = useCallback(() => {
    if (!formData.title.trim() || !formData.content.trim()) return;
    
    onCreatePost({
      title: formData.title,
      excerpt: formData.excerpt,
      content: formData.content,
      category: formData.category,
      tags: formData.tags
    });
  }, [formData, onCreatePost]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-2xl">
            <Edit className="h-6 w-6 mr-2" />
            Criar Novo Post
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Título do Post</label>
            <Input
              placeholder="Digite o título do seu post..."
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Resumo/Excerpt</label>
            <Textarea
              placeholder="Escreva um resumo atrativo do seu post..."
              value={formData.excerpt}
              onChange={(e) => handleInputChange('excerpt', e.target.value)}
              rows={3}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Categoria</label>
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
            <label className="block text-sm font-medium mb-2">Conteúdo</label>
            <Textarea
              placeholder="Escreva o conteúdo completo do seu post..."
              value={formData.content}
              onChange={(e) => handleInputChange('content', e.target.value)}
              rows={15}
            />
          </div>
          
          <div className="flex gap-3">
            <Button 
              onClick={handleSubmit} 
              className="bg-green-600 hover:bg-green-700"
              disabled={!formData.title.trim() || !formData.content.trim()}
            >
              <Save className="h-4 w-4 mr-2" />
              Publicar Post
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
