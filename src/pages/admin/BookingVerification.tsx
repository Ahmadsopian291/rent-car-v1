import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { CheckCircle, XCircle, ExternalLink, Download, Filter } from 'lucide-react';
import { format } from 'date-fns';
import * as XLSX from 'xlsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { DateRange } from 'react-day-picker';

interface Booking {
  id: number;
  user_id: string;
  start_date: string;
  end_date: string;
  total_price: number;
  status: string;
  created_at: string;
  payment_proof_url: string;
  cars: {
    name: string;
    type: string;
  } | null;
  profiles: {
    full_name: string;
    phone_number: string;
  } | null;
}

export default function BookingVerification() {
  const { toast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    filterBookings();
  }, [bookings, statusFilter, dateRange]);

  const fetchBookings = async () => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          id,
          user_id,
          start_date,
          end_date,
          total_price,
          status,
          created_at,
          payment_proof_url,
          cars (
            name,
            type
          ),
          profiles (
            full_name,
            phone_number
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBookings((data as any) || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast({
        title: "Error",
        description: "Gagal mengambil data pemesanan.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filterBookings = () => {
    let filtered = bookings;

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(booking => booking.status === statusFilter);
    }

    // Filter by date range
    if (dateRange?.from && dateRange?.to) {
      filtered = filtered.filter(booking => {
        const createdDate = new Date(booking.created_at);
        return createdDate >= dateRange.from! && createdDate <= dateRange.to!;
      });
    }

    setFilteredBookings(filtered);
  };

  const handleApprove = async (bookingId: number) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'confirmed' })
        .eq('id', bookingId);

      if (error) throw error;

      toast({
        title: "Berhasil",
        description: "Pemesanan telah disetujui.",
      });

      fetchBookings();
    } catch (error) {
      console.error('Error approving booking:', error);
      toast({
        title: "Error",
        description: "Gagal menyetujui pemesanan.",
        variant: "destructive"
      });
    }
  };

  const handleReject = async (bookingId: number) => {
    if (!confirm('Apakah Anda yakin ingin menolak pemesanan ini?')) return;

    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('id', bookingId);

      if (error) throw error;

      toast({
        title: "Berhasil",
        description: "Pemesanan telah ditolak.",
      });

      fetchBookings();
    } catch (error) {
      console.error('Error rejecting booking:', error);
      toast({
        title: "Error",
        description: "Gagal menolak pemesanan.",
        variant: "destructive"
      });
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

  const exportToExcel = () => {
    const exportData = filteredBookings.map(booking => ({
      'ID Booking': booking.id,
      'Nama Customer': booking.profiles?.full_name || 'N/A',
      'No. Telepon': booking.profiles?.phone_number || 'N/A',
      'Nama Mobil': booking.cars?.name || 'N/A',
      'Tipe Mobil': booking.cars?.type || 'N/A',
      'Tanggal Mulai': format(new Date(booking.start_date), 'dd/MM/yyyy'),
      'Tanggal Akhir': format(new Date(booking.end_date), 'dd/MM/yyyy'),
      'Total Harga': booking.total_price,
      'Status': booking.status,
      'Tanggal Pesan': format(new Date(booking.created_at), 'dd/MM/yyyy HH:mm'),
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Laporan Transaksi');
    
    const fileName = `laporan-transaksi-${format(new Date(), 'yyyy-MM-dd')}.xlsx`;
    XLSX.writeFile(wb, fileName);

    toast({
      title: "Berhasil",
      description: "Laporan berhasil diunduh.",
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Verifikasi Pesanan</h2>
          <p className="text-muted-foreground">
            Kelola dan verifikasi pemesanan dari customer
          </p>
        </div>
        <Button onClick={exportToExcel}>
          <Download className="h-4 w-4 mr-2" />
          Download Laporan (.xlsx)
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Filter Data</CardTitle>
            <Filter className="h-5 w-5" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-end">
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="pending_verification">Menunggu Verifikasi</SelectItem>
                  <SelectItem value="confirmed">Dikonfirmasi</SelectItem>
                  <SelectItem value="cancelled">Dibatalkan</SelectItem>
                  <SelectItem value="completed">Selesai</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Rentang Tanggal</label>
              <DatePickerWithRange date={dateRange} setDate={setDateRange} />
            </div>
            <Button 
              variant="outline" 
              onClick={() => {
                setStatusFilter('all');
                setDateRange(undefined);
              }}
            >
              Reset Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Pemesanan ({filteredBookings.length})</CardTitle>
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
                  <TableHead>ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Mobil</TableHead>
                  <TableHead>Periode Sewa</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Bukti Bayar</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell className="font-medium">#{booking.id}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{booking.profiles?.full_name || 'N/A'}</div>
                        <div className="text-sm text-muted-foreground">
                          {booking.profiles?.phone_number || 'N/A'}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{booking.cars?.name || 'N/A'}</div>
                        <div className="text-sm text-muted-foreground">
                          {booking.cars?.type || 'N/A'}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{format(new Date(booking.start_date), 'dd MMM yyyy')}</div>
                        <div className="text-muted-foreground">
                          s/d {format(new Date(booking.end_date), 'dd MMM yyyy')}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>Rp {booking.total_price.toLocaleString()}</TableCell>
                    <TableCell>{getStatusBadge(booking.status)}</TableCell>
                    <TableCell>
                      {booking.payment_proof_url ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(booking.payment_proof_url, '_blank')}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      ) : (
                        <span className="text-muted-foreground text-sm">Tidak ada</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {booking.status === 'pending_verification' && (
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleApprove(booking.id)}
                            className="text-green-600 hover:text-green-700"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleReject(booking.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
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