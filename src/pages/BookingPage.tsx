import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { ArrowLeft, CalendarIcon, Upload } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { cn } from '@/lib/utils';

interface Car {
  id: number;
  name: string;
  type: string;
  price_per_day: number;
  image_url: string;
}

export default function BookingPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (id) {
      fetchCar();
    }
  }, [id, user, navigate]);

  const fetchCar = async () => {
    try {
      const { data, error } = await supabase
        .from('cars')
        .select('id, name, type, price_per_day, image_url')
        .eq('id', parseInt(id!))
        .eq('is_available', true)
        .single();

      if (error) throw error;
      setCar(data);
    } catch (error) {
      console.error('Error fetching car:', error);
      toast({
        title: "Error",
        description: "Mobil tidak ditemukan atau tidak tersedia.",
        variant: "destructive"
      });
      navigate('/cars');
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalPrice = () => {
    if (!startDate || !endDate || !car) return 0;
    const days = differenceInDays(endDate, startDate) + 1;
    return days * car.price_per_day;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPaymentProof(file);
    }
  };

  const uploadPaymentProof = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `payment-proofs/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('user-documents')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('user-documents')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!startDate || !endDate || !paymentProof || !car || !user) {
      toast({
        title: "Error",
        description: "Harap lengkapi semua field yang diperlukan.",
        variant: "destructive"
      });
      return;
    }

    if (startDate >= endDate) {
      toast({
        title: "Error",
        description: "Tanggal akhir harus setelah tanggal mulai.",
        variant: "destructive"
      });
      return;
    }

    setSubmitting(true);

    try {
      // Upload payment proof
      const paymentProofUrl = await uploadPaymentProof(paymentProof);
      
      // Create booking
      const { error } = await supabase
        .from('bookings')
        .insert({
          user_id: user.id,
          car_id: car.id,
          start_date: format(startDate, 'yyyy-MM-dd'),
          end_date: format(endDate, 'yyyy-MM-dd'),
          total_price: calculateTotalPrice(),
          status: 'pending_verification',
          payment_proof_url: paymentProofUrl
        });

      if (error) throw error;

      toast({
        title: "Pemesanan Berhasil",
        description: "Pemesanan Anda telah dikirim dan menunggu verifikasi.",
      });

      navigate('/dashboard');
    } catch (error) {
      console.error('Error creating booking:', error);
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat membuat pemesanan.",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
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

  if (!car) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Mobil Tidak Ditemukan</h1>
          <Button onClick={() => navigate('/cars')}>
            Kembali ke Koleksi Mobil
          </Button>
        </div>
      </div>
    );
  }

  const totalPrice = calculateTotalPrice();
  const totalDays = startDate && endDate ? differenceInDays(endDate, startDate) + 1 : 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <Button 
        variant="ghost" 
        onClick={() => navigate(`/cars/${car.id}`)}
        className="mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Kembali ke Detail Mobil
      </Button>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Car Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Detail Mobil</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-4">
              <div className="w-24 h-16 bg-muted rounded-md overflow-hidden flex-shrink-0">
                {car.image_url ? (
                  <img 
                    src={car.image_url} 
                    alt={car.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                    No Image
                  </div>
                )}
              </div>
              <div>
                <h3 className="font-semibold text-lg">{car.name}</h3>
                <p className="text-sm text-muted-foreground">{car.type}</p>
                <p className="text-sm font-medium mt-1">
                  Rp {car.price_per_day.toLocaleString()}/hari
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Booking Form */}
        <Card>
          <CardHeader>
            <CardTitle>Form Pemesanan</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Start Date */}
              <div className="space-y-2">
                <Label>Tanggal Mulai</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !startDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "dd MMMM yyyy") : "Pilih tanggal"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      disabled={(date) => date < new Date()}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* End Date */}
              <div className="space-y-2">
                <Label>Tanggal Akhir</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !endDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "dd MMMM yyyy") : "Pilih tanggal"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      disabled={(date) => !startDate || date <= startDate}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Price Summary */}
              {startDate && endDate && (
                <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Durasi:</span>
                    <span>{totalDays} hari</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Harga per hari:</span>
                    <span>Rp {car.price_per_day.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg border-t pt-2">
                    <span>Total:</span>
                    <span className="text-primary">Rp {totalPrice.toLocaleString()}</span>
                  </div>
                </div>
              )}

              {/* Payment Proof Upload */}
              <div className="space-y-2">
                <Label>Upload Bukti Transfer</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleFileChange}
                    className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                  />
                  <Upload className="h-4 w-4 text-muted-foreground" />
                </div>
                {paymentProof && (
                  <p className="text-sm text-muted-foreground">
                    File dipilih: {paymentProof.name}
                  </p>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={!startDate || !endDate || !paymentProof || submitting}
              >
                {submitting ? "Memproses..." : "Konfirmasi Pemesanan"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}