import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { ArrowLeft, Fuel, Users, Cog, Gauge } from 'lucide-react';

interface Car {
  id: number;
  name: string;
  type: string;
  price_per_day: number;
  fuel_type: string;
  seats: number;
  transmission: string;
  engine_cc: number;
  description: string;
  image_url: string;
  is_available: boolean;
}

export default function CarDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchCar();
    }
  }, [id]);

  const fetchCar = async () => {
    try {
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .eq('id', parseInt(id!))
        .eq('is_available', true)
        .single();

      if (error) throw error;
      setCar(data);
    } catch (error) {
      console.error('Error fetching car:', error);
      setError('Mobil tidak ditemukan atau tidak tersedia.');
    } finally {
      setLoading(false);
    }
  };

  const handleBookingAction = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    // TODO: Implement booking logic
    console.log('Booking action for car:', car?.id);
  };

  const handleCartAction = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    // TODO: Implement cart logic
    console.log('Add to cart action for car:', car?.id);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Skeleton className="h-6 w-32" />
        </div>
        <div className="grid lg:grid-cols-2 gap-8">
          <Skeleton className="aspect-video w-full" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-24 w-full" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !car) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Mobil Tidak Ditemukan</h1>
          <p className="text-muted-foreground mb-6">
            {error || 'Mobil yang Anda cari tidak tersedia.'}
          </p>
          <Button onClick={() => navigate('/cars')}>
            Kembali ke Koleksi Mobil
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button 
        variant="ghost" 
        onClick={() => navigate('/cars')}
        className="mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Kembali ke Koleksi Mobil
      </Button>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Car Image */}
        <div className="aspect-video bg-muted rounded-lg overflow-hidden">
          {car.image_url ? (
            <img 
              src={car.image_url} 
              alt={car.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              No Image Available
            </div>
          )}
        </div>

        {/* Car Details */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold">{car.name}</h1>
              <Badge variant="secondary" className="text-sm">
                {car.type}
              </Badge>
            </div>
            <div className="text-3xl font-bold text-primary mb-4">
              Rp {car.price_per_day.toLocaleString()}
              <span className="text-lg font-normal text-muted-foreground">/hari</span>
            </div>
          </div>

          {/* Car Specifications */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Spesifikasi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <span>{car.seats} kursi</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Fuel className="h-5 w-5 text-muted-foreground" />
                  <span>{car.fuel_type}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Cog className="h-5 w-5 text-muted-foreground" />
                  <span>{car.transmission}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Gauge className="h-5 w-5 text-muted-foreground" />
                  <span>{car.engine_cc} CC</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          {car.description && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Deskripsi</h3>
              <p className="text-muted-foreground leading-relaxed">
                {car.description}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4 pt-4">
            <Button 
              onClick={handleBookingAction}
              size="lg"
              className="w-full"
            >
              Pesan Sekarang
            </Button>
            <Button 
              onClick={handleCartAction}
              variant="outline"
              size="lg"
              className="w-full"
            >
              Tambah ke Keranjang
            </Button>
          </div>

          {!user && (
            <p className="text-sm text-muted-foreground text-center">
              Silakan login terlebih dahulu untuk melakukan pemesanan.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}