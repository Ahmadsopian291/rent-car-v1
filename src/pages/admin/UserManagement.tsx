import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { UserCheck, UserX, Crown, Shield, User } from 'lucide-react';

interface UserProfile {
  id: string;
  full_name: string;
  phone_number: string;
  role: string;
  created_at: string;
  date_of_birth: string;
}

export default function UserManagement() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [userRole, setUserRole] = useState<string>('user');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserRole();
    fetchUsers();
  }, []);

  const fetchUserRole = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      setUserRole((data as any)?.role || 'user');
    } catch (error) {
      console.error('Error fetching user role:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, phone_number, role, created_at, date_of_birth')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers((data as any) || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    if (userRole !== 'admin') {
      toast({
        title: "Error",
        description: "Anda tidak memiliki izin untuk mengubah role pengguna.",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);

      if (error) throw error;

      toast({
        title: "Berhasil",
        description: "Role pengguna berhasil diperbarui.",
      });

      fetchUsers();
    } catch (error) {
      console.error('Error updating user role:', error);
      toast({
        title: "Error",
        description: "Gagal memperbarui role pengguna.",
        variant: "destructive"
      });
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Crown className="h-4 w-4 text-yellow-500" />;
      case 'sub_admin':
        return <Shield className="h-4 w-4 text-blue-500" />;
      default:
        return <User className="h-4 w-4 text-gray-500" />;
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Administrator';
      case 'sub_admin':
        return 'Sub Admin';
      default:
        return 'User';
    }
  };

  const isAdmin = userRole === 'admin';

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Manajemen Pengguna</h2>
          <p className="text-muted-foreground">
            Kelola pengguna dan role dalam sistem
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Pengguna ({users.length})</CardTitle>
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
                  <TableHead>Nama Lengkap</TableHead>
                  <TableHead>No. Telepon</TableHead>
                  <TableHead>Tanggal Lahir</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Bergabung</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((userProfile) => (
                  <TableRow key={userProfile.id}>
                    <TableCell>
                      <div className="font-medium">{userProfile.full_name || 'N/A'}</div>
                    </TableCell>
                    <TableCell>{userProfile.phone_number || 'N/A'}</TableCell>
                    <TableCell>
                      {userProfile.date_of_birth ? new Date(userProfile.date_of_birth).toLocaleDateString('id-ID') : 'N/A'}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getRoleIcon(userProfile.role)}
                        <span>{getRoleLabel(userProfile.role)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(userProfile.created_at).toLocaleDateString('id-ID')}
                    </TableCell>
                    <TableCell>
                      {isAdmin && userProfile.id !== user?.id ? (
                        <Select
                          value={userProfile.role}
                          onValueChange={(newRole) => handleRoleChange(userProfile.id, newRole)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="user">User</SelectItem>
                            <SelectItem value="sub_admin">Sub Admin</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <span className="text-sm text-muted-foreground">
                          {userProfile.id === user?.id ? 'Anda' : 'Tidak dapat diubah'}
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Statistik Pengguna</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3 p-4 bg-muted/50 rounded-lg">
              <Crown className="h-8 w-8 text-yellow-500" />
              <div>
                <div className="text-2xl font-bold">
                  {users.filter(u => u.role === 'admin').length}
                </div>
                <div className="text-sm text-muted-foreground">Administrator</div>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-muted/50 rounded-lg">
              <Shield className="h-8 w-8 text-blue-500" />
              <div>
                <div className="text-2xl font-bold">
                  {users.filter(u => u.role === 'sub_admin').length}
                </div>
                <div className="text-sm text-muted-foreground">Sub Admin</div>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-muted/50 rounded-lg">
              <User className="h-8 w-8 text-gray-500" />
              <div>
                <div className="text-2xl font-bold">
                  {users.filter(u => u.role === 'user').length}
                </div>
                <div className="text-sm text-muted-foreground">User Biasa</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}