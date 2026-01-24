'use client';

import { useEffect, useState } from 'react';
import { getCategories, createCategory, updateCategory, deleteCategory, generateSlug } from '@/lib/firestore';
import { Category } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Loader2, Plus, Pencil, Trash2 } from 'lucide-react';

const COLORS = [
  { value: 'blue', label: 'Azul', class: 'bg-blue-500/20 text-blue-300' },
  { value: 'purple', label: 'Morado', class: 'bg-purple-500/20 text-purple-300' },
  { value: 'green', label: 'Verde', class: 'bg-green-500/20 text-green-300' },
  { value: 'yellow', label: 'Amarillo', class: 'bg-yellow-500/20 text-yellow-300' },
  { value: 'red', label: 'Rojo', class: 'bg-red-500/20 text-red-300' },
  { value: 'orange', label: 'Naranja', class: 'bg-orange-500/20 text-orange-300' },
];

const EMOJIS = ['💻', '🎨', '📱', '🌐', '🔧', '📊', '🎮', '🤖', '📝', '🚀'];

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [saving, setSaving] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState('💻');
  const [color, setColor] = useState('blue');
  const [order, setOrder] = useState(0);

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const resetForm = () => {
    setName('');
    setEmoji('💻');
    setColor('blue');
    setOrder(categories.length);
    setEditingCategory(null);
  };

  const openCreateDialog = () => {
    resetForm();
    setOrder(categories.length);
    setIsDialogOpen(true);
  };

  const openEditDialog = (category: Category) => {
    setEditingCategory(category);
    setName(category.name);
    setEmoji(category.emoji);
    setColor(category.color);
    setOrder(category.order);
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSaving(true);
    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, {
          name,
          slug: generateSlug(name),
          emoji,
          color,
          order,
        });
      } else {
        await createCategory({
          name,
          slug: generateSlug(name),
          emoji,
          color,
          order,
          createdAt: new Date(),
        });
      }
      await fetchCategories();
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error saving category:', error);
      alert('Error al guardar la categoría');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta categoría? Los proyectos asociados mantendrán el slug de categoría pero no se mostrará el nombre.')) return;

    try {
      await deleteCategory(id);
      setCategories(categories.filter(cat => cat.id !== id));
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Error al eliminar la categoría');
    }
  };

  const getColorClass = (colorValue: string) => {
    return COLORS.find(c => c.value === colorValue)?.class || 'bg-gray-500/20 text-gray-300';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Categorías</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog}>
              <Plus className="w-4 h-4 mr-2" />
              Nueva Categoría
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Nombre *</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej: Desarrollo Web"
                  required
                />
              </div>

              <div>
                <Label htmlFor="emoji">Emoji</Label>
                <Select value={emoji} onValueChange={setEmoji}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {EMOJIS.map((e) => (
                      <SelectItem key={e} value={e}>
                        {e}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="color">Color</Label>
                <Select value={color} onValueChange={setColor}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {COLORS.map((c) => (
                      <SelectItem key={c.value} value={c.value}>
                        <span className={`px-2 py-1 rounded ${c.class}`}>
                          {c.label}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="order">Orden</Label>
                <Input
                  id="order"
                  type="number"
                  value={order}
                  onChange={(e) => setOrder(parseInt(e.target.value) || 0)}
                  min={0}
                />
                <p className="text-xs text-gray-500 mt-1">Menor número = aparece primero</p>
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button type="submit" className="flex-1" disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Guardando...
                    </>
                  ) : editingCategory ? (
                    'Actualizar'
                  ) : (
                    'Crear'
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {categories.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-gray-500">
                No hay categorías creadas. Crea tu primera categoría para organizar tus proyectos.
              </p>
            </CardContent>
          </Card>
        ) : (
          categories.map((category) => (
            <Card key={category.id}>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{category.emoji}</span>
                    <div>
                      <CardTitle className="text-lg">{category.name}</CardTitle>
                      <p className="text-sm text-gray-500">Slug: {category.slug}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-sm ${getColorClass(category.color)}`}>
                      Orden: {category.order}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEditDialog(category)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(category.id)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
