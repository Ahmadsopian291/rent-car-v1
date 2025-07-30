import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Hubungi Kami</h1>
        <p className="text-muted-foreground">
          Ada pertanyaan? Jangan ragu untuk menghubungi kami
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Kirim Pesan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Nama Lengkap</Label>
                <Input id="name" placeholder="Masukkan nama lengkap" />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="Masukkan email" />
              </div>
              <div>
                <Label htmlFor="phone">Nomor Telepon</Label>
                <Input id="phone" placeholder="Masukkan nomor telepon" />
              </div>
              <div>
                <Label htmlFor="subject">Subjek</Label>
                <Input id="subject" placeholder="Subjek pesan" />
              </div>
              <div>
                <Label htmlFor="message">Pesan</Label>
                <Textarea 
                  id="message" 
                  placeholder="Tulis pesan Anda di sini..."
                  rows={4}
                />
              </div>
              <Button className="w-full">Kirim Pesan</Button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informasi Kontak</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold">Alamat</h3>
                  <p className="text-muted-foreground">
                    Jl. Sudirman No. 123<br />
                    Jakarta Pusat, DKI Jakarta 10110
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Phone className="h-5 w-5 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold">Telepon</h3>
                  <p className="text-muted-foreground">+62 21 1234 5678</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Mail className="h-5 w-5 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold">Email</h3>
                  <p className="text-muted-foreground">info@rentcar.com</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Clock className="h-5 w-5 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold">Jam Operasional</h3>
                  <p className="text-muted-foreground">
                    Senin - Jumat: 08:00 - 17:00<br />
                    Sabtu - Minggu: 09:00 - 15:00
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Lokasi Kami</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">Google Maps akan ditampilkan di sini</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}