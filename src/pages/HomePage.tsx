import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Car, Shield, Clock, Star } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Sewa Mobil Terpercaya
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
            Temukan mobil impian Anda dengan harga terjangkau dan pelayanan terbaik
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link to="/cars">Lihat Koleksi Mobil</Link>
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Mengapa Memilih Kami?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-6 text-center">
                <Shield className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-2">Aman & Terpercaya</h3>
                <p className="text-muted-foreground">
                  Semua mobil dalam kondisi prima dan asuransi lengkap
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Clock className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-2">Layanan 24/7</h3>
                <p className="text-muted-foreground">
                  Siap melayani Anda kapan saja dengan customer service terbaik
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Star className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-2">Harga Terbaik</h3>
                <p className="text-muted-foreground">
                  Dapatkan harga sewa yang kompetitif tanpa biaya tersembunyi
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Siap untuk Perjalanan Anda?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Daftar sekarang dan dapatkan penawaran menarik untuk sewa mobil pertama Anda
          </p>
          <Button size="lg" asChild>
            <Link to="/register">Daftar Sekarang</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}