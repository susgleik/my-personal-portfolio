'use client';

import { useEffect, useState } from 'react';
import { getPosts, deletePost } from '@/lib/firestore';
import { Post } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { format } from 'date-fns';

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      const data = await getPosts({ published: undefined, limit: 100 });
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este post?')) return;

    try {
      await deletePost(id);
      setPosts(posts.filter(post => post.id !== id));
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Error al eliminar el post');
    }
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Posts</h1>
        <Button asChild>
          <Link href="/admin/posts/new">Crear Nuevo Post</Link>
        </Button>
      </div>

      <div className="grid gap-4">
        {posts.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-gray-500">No hay posts creados</p>
            </CardContent>
          </Card>
        ) : (
          posts.map((post) => (
            <Card key={post.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{post.title}</CardTitle>
                    <p className="text-sm text-gray-500 mt-1">
                      {format(new Date(post.publishedAt), 'dd/MM/yyyy')}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        post.isPublished
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {post.isPublished ? 'Publicado' : 'Borrador'}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{post.excerpt}</p>
                <div className="flex gap-2 mb-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex gap-2 mt-4">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/admin/posts/edit/${post.id}`}>Editar</Link>
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(post.id)}
                  >
                    Eliminar
                  </Button>
                  <Button asChild variant="ghost" size="sm">
                    <Link href={`/blog/${post.slug}`} target="_blank">
                      Ver
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}