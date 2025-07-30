import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { Fuel, Users, Cog } from 'lucide-react';

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

export default function CarsPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .eq('is_available', true)
        .order('name');

      if (error) throw error;
      setCars(data || []);
    } catch (error) {
      console.error('Error fetching cars:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Koleksi Mobil Kami</h1>
        <p className="text-muted-foreground">
          Pilih dari berbagai jenis mobil yang sesuai dengan kebutuhan Anda
        </p>
      </div>

      {cars.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">
            Belum ada mobil yang tersedia saat ini.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cars.map((car) => (
            <Card key={car.id} className="overflow-hidden">
              <div className="aspect-video bg-muted flex items-center justify-center">
                {car.image_url ? (
                  <img 
                    src={car.image_url} 
                    alt={car.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-muted-foreground">No Image</div>
                )}
              </div>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{car.name}</CardTitle>
                  <Badge variant="secondary">{car.type}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>{car.seats} kursi</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Fuel className="h-4 w-4" />
                      <span>{car.fuel_type}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Cog className="h-4 w-4" />
                      <span>{car.transmission}</span>
                    </div>
                  </div>
                  
                  {car.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {car.description}
                    </p>
                  )}
                  
                  <div className="flex justify-between items-center pt-2">
                    <div>
                      <span className="text-2xl font-bold text-primary">
                        Rp {car.price_per_day.toLocaleString()}
                      </span>
                      <span className="text-sm text-muted-foreground">/hari</span>
                    </div>
                    <Button>Sewa Sekarang</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}