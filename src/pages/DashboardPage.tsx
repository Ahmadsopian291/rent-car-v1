import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Car, Calendar, FileText } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Selamat datang kembali, {user?.email}
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6 text-center">
            <User className="h-8 w-8 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold">1</div>
            <p className="text-muted-foreground">Profil</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <Car className="h-8 w-8 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold">0</div>
            <p className="text-muted-foreground">Booking Aktif</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <Calendar className="h-8 w-8 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold">0</div>
            <p className="text-muted-foreground">Riwayat Booking</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <FileText className="h-8 w-8 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold">0</div>
            <p className="text-muted-foreground">Dokumen</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Booking Terbaru</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-center py-8">
              Belum ada booking
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Profil Saya</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <span className="font-medium">Email:</span>
                <span className="ml-2 text-muted-foreground">{user?.email}</span>
              </div>
              <div>
                <span className="font-medium">Status:</span>
                <span className="ml-2 text-green-600">Verified</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}