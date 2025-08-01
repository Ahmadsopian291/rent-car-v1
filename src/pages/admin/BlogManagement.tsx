import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { RichTextEditor } from '@/components/RichTextEditor';

interface BlogPost {
  id: number;
  title: string;
  content: string;
  author_id: string;
  created_at: string;
}

export default function BlogManagement() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [formData, setFormData] = useState({ title: '', content: '' });

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingPost) {
        const { error } = await supabase
          .from('blog_posts')
          .update({ title: formData.title, content: formData.content })
          .eq('id', editingPost.id);

        if (error) throw error;
        toast({ title: "Berhasil", description: "Post berhasil diperbarui." });
      } else {
        const { error } = await supabase
          .from('blog_posts')
          .insert({ title: formData.title, content: formData.content, author_id: user?.id });

        if (error) throw error;
        toast({ title: "Berhasil", description: "Post berhasil dibuat." });
      }

      setShowDialog(false);
      setFormData({ title: '', content: '' });
      setEditingPost(null);
      fetchPosts();
    } catch (error) {
      toast({ title: "Error", description: "Gagal menyimpan post.", variant: "destructive" });
    }
  };

  const handleDelete = async (postId: number) => {
    if (!confirm('Hapus post ini?')) return;

    try {
      const { error } = await supabase.from('blog_posts').delete().eq('id', postId);
      if (error) throw error;
      toast({ title: "Berhasil", description: "Post berhasil dihapus." });
      fetchPosts();
    } catch (error) {
      toast({ title: "Error", description: "Gagal menghapus post.", variant: "destructive" });
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Manajemen Blog</h2>
          <p className="text-muted-foreground">Kelola konten blog</p>
        </div>
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button onClick={() => { setFormData({ title: '', content: '' }); setEditingPost(null); }}>
              <Plus className="h-4 w-4 mr-2" />
              Tambah Post
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingPost ? 'Edit Post' : 'Tambah Post Baru'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  placeholder="Judul post"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  required
                />
              </div>
              <RichTextEditor
                value={formData.content}
                onChange={(value) => setFormData(prev => ({ ...prev, content: value }))}
                placeholder="Tulis konten blog Anda di sini..."
              />
              <div className="flex space-x-2">
                <Button type="submit">{editingPost ? 'Perbarui' : 'Simpan'}</Button>
                <Button type="button" variant="outline" onClick={() => setShowDialog(false)}>Batal</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Post</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Judul</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {posts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell className="font-medium">{post.title}</TableCell>
                    <TableCell>{new Date(post.created_at).toLocaleDateString('id-ID')}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => {
                          setEditingPost(post);
                          setFormData({ title: post.title, content: post.content });
                          setShowDialog(true);
                        }}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDelete(post.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}