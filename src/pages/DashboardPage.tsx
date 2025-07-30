import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Calendar, Car, Clock, DollarSign } from 'lucide-react';
import { format } from 'date-fns';

interface Booking {
  id: number;
  start_date: string;
  end_date: string;
  total_price: number;
  status: string;
  created_at: string;
  cars: {
    name: string;
    type: string;
    image_url: string;
  };
}

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user]);

  const fetchBookings = async () => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          id,
          start_date,
          end_date,
          total_price,
          status,
          created_at,
          cars (
            name,
            type,
            image_url
          )
        `)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending_payment: { label: 'Menunggu Pembayaran', variant: 'destructive' as const },
      pending_verification: { label: 'Menunggu Verifikasi', variant: 'secondary' as const },
      confirmed: { label: 'Dikonfirmasi', variant: 'default' as const },
      completed: { label: 'Selesai', variant: 'outline' as const },
      cancelled: { label: 'Dibatalkan', variant: 'destructive' as const }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || 
                  { label: status, variant: 'secondary' as const };
    
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  if (authLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Selamat datang, {user.user_metadata?.full_name || user.email}
        </p>
      </div>

      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-6">Riwayat Pemesanan Saya</h2>
          
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <div className="flex space-x-4">
                      <Skeleton className="w-24 h-16 rounded-md" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-5 w-1/3" />
                        <Skeleton className="h-4 w-1/2" />
                        <Skeleton className="h-4 w-1/4" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : bookings.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Car className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">Belum Ada Pemesanan</h3>
                <p className="text-muted-foreground">
                  Anda belum memiliki riwayat pemesanan mobil.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <Card key={booking.id}>
                  <CardContent className="p-6">
                    <div className="flex space-x-6">
                      <div className="w-24 h-16 bg-muted rounded-md overflow-hidden flex-shrink-0">
                        {booking.cars.image_url ? (
                          <img 
                            src={booking.cars.image_url} 
                            alt={booking.cars.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                            No Image
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-semibold text-lg">{booking.cars.name}</h3>
                            <p className="text-sm text-muted-foreground">{booking.cars.type}</p>
                          </div>
                          {getStatusBadge(booking.status)}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <div className="text-sm">
                              <div className="font-medium">Tanggal Sewa</div>
                              <div className="text-muted-foreground">
                                {format(new Date(booking.start_date), 'dd MMM yyyy')} - {format(new Date(booking.end_date), 'dd MMM yyyy')}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                            <div className="text-sm">
                              <div className="font-medium">Total Harga</div>
                              <div className="text-muted-foreground">
                                Rp {booking.total_price.toLocaleString()}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <div className="text-sm">
                              <div className="font-medium">Tanggal Pesan</div>
                              <div className="text-muted-foreground">
                                {format(new Date(booking.created_at), 'dd MMM yyyy HH:mm')}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}