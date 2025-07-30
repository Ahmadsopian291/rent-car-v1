import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { BarChart3, Users, Car, FileCheck } from 'lucide-react';

interface DashboardStats {
  totalUsers: number;
  totalCars: number;
  pendingBookings: number;
  totalBookings: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalCars: 0,
    pendingBookings: 0,
    totalBookings: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [usersResponse, carsResponse, bookingsResponse, pendingResponse] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('cars').select('id', { count: 'exact', head: true }),
        supabase.from('bookings').select('id', { count: 'exact', head: true }),
        supabase.from('bookings').select('id', { count: 'exact', head: true }).eq('status', 'pending_verification'),
      ]);

      setStats({
        totalUsers: usersResponse.count || 0,
        totalCars: carsResponse.count || 0,
        totalBookings: bookingsResponse.count || 0,
        pendingBookings: pendingResponse.count || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Pengguna',
      value: stats.totalUsers,
      icon: Users,
      color: 'text-blue-600',
    },
    {
      title: 'Total Mobil',
      value: stats.totalCars,
      icon: Car,
      color: 'text-green-600',
    },
    {
      title: 'Total Pesanan',
      value: stats.totalBookings,
      icon: BarChart3,
      color: 'text-purple-600',
    },
    {
      title: 'Menunggu Verifikasi',
      value: stats.pendingBookings,
      icon: FileCheck,
      color: 'text-orange-600',
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard Admin</h2>
        <p className="text-muted-foreground">
          Ringkasan aktivitas dan statistik sistem
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? '...' : card.value.toLocaleString()}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Aktivitas Terbaru</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              Fitur aktivitas terbaru akan ditambahkan
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Statistik Cepat</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-600 rounded-full mr-2"></div>
                <span className="text-sm">Pengguna Aktif</span>
                <span className="ml-auto font-medium">{stats.totalUsers}</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-600 rounded-full mr-2"></div>
                <span className="text-sm">Mobil Tersedia</span>
                <span className="ml-auto font-medium">{stats.totalCars}</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-orange-600 rounded-full mr-2"></div>
                <span className="text-sm">Perlu Verifikasi</span>
                <span className="ml-auto font-medium">{stats.pendingBookings}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}