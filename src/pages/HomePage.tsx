import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Car, Shield, Clock, Star } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section 
        className="relative h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1920&q=80)'
        }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/50"></div>
        
        {/* Hero content */}
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-6">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
            Kemudahan Berkendara Premium di Bandung
          </h1>
          <p className="text-xl md:text-2xl mb-10 max-w-2xl mx-auto animate-fade-in-up" style={{animationDelay: '0.2s'}}>
            Pilih dan pesan mobil impian Anda hanya dengan beberapa klik.
          </p>
          <Button 
            size="lg" 
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg animate-fade-in-up" 
            style={{animationDelay: '0.4s'}}
            asChild
          >
            <Link to="/cars">Lihat Koleksi Mobil</Link>
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16 text-foreground">Mengapa Memilih Kami?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="transition-all duration-300 hover:shadow-xl hover:-translate-y-2 group">
              <CardContent className="p-8 text-center">
                <Shield className="h-16 w-16 mx-auto mb-6 text-primary group-hover:scale-110 transition-transform duration-300" />
                <h3 className="text-2xl font-semibold mb-4 text-foreground">Aman & Terpercaya</h3>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Semua mobil dalam kondisi prima dan asuransi lengkap
                </p>
              </CardContent>
            </Card>
            <Card className="transition-all duration-300 hover:shadow-xl hover:-translate-y-2 group">
              <CardContent className="p-8 text-center">
                <Clock className="h-16 w-16 mx-auto mb-6 text-primary group-hover:scale-110 transition-transform duration-300" />
                <h3 className="text-2xl font-semibold mb-4 text-foreground">Layanan 24/7</h3>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Siap melayani Anda kapan saja dengan customer service terbaik
                </p>
              </CardContent>
            </Card>
            <Card className="transition-all duration-300 hover:shadow-xl hover:-translate-y-2 group">
              <CardContent className="p-8 text-center">
                <Star className="h-16 w-16 mx-auto mb-6 text-primary group-hover:scale-110 transition-transform duration-300" />
                <h3 className="text-2xl font-semibold mb-4 text-foreground">Harga Terbaik</h3>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Dapatkan harga sewa yang kompetitif tanpa biaya tersembunyi
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary/5">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6 text-foreground">Siap untuk Perjalanan Anda?</h2>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            Daftar sekarang dan dapatkan penawaran menarik untuk sewa mobil pertama Anda
          </p>
          <Button 
            size="lg" 
            className="px-8 py-4 text-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg"
            asChild
          >
            <Link to="/register">Daftar Sekarang</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}