import { Card, CardContent } from '@/components/ui/card';
import { Users, Award, MapPin } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-24 bg-primary/5">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold mb-6 text-foreground animate-fade-in">
            Tentang Kami
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed animate-fade-in-up">
            DriveNow Solutions adalah penyedia layanan sewa mobil terpercaya di Bandung dengan komitmen 
            memberikan pengalaman berkendara yang aman, nyaman, dan berkualitas tinggi.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-8 text-foreground">Cerita Kami</h2>
              <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
                <p>
                  Didirikan pada tahun 2020, DriveNow Solutions lahir dari visi untuk memberikan 
                  solusi transportasi yang fleksibel dan terpercaya bagi masyarakat Bandung dan sekitarnya.
                </p>
                <p>
                  Kami memahami bahwa setiap perjalanan memiliki cerita yang berbeda. Oleh karena itu, 
                  kami menyediakan berbagai pilihan kendaraan yang terawat dengan baik dan dilengkapi 
                  dengan layanan pelanggan yang responsif 24/7.
                </p>
                <p>
                  Dengan armada yang terus berkembang dan teknologi booking yang user-friendly, 
                  kami berkomitmen untuk terus berinovasi demi kepuasan pelanggan.
                </p>
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?auto=format&fit=crop&w=800&q=80"
                alt="Tim DriveNow Solutions"
                className="rounded-lg shadow-2xl w-full h-96 object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16 text-foreground">Nilai-Nilai Kami</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
              <CardContent className="p-8 text-center">
                <Users className="h-16 w-16 mx-auto mb-6 text-primary" />
                <h3 className="text-2xl font-semibold mb-4 text-foreground">Kepercayaan</h3>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Membangun hubungan jangka panjang dengan pelanggan melalui transparansi dan keandalan layanan.
                </p>
              </CardContent>
            </Card>
            <Card className="transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
              <CardContent className="p-8 text-center">
                <Award className="h-16 w-16 mx-auto mb-6 text-primary" />
                <h3 className="text-2xl font-semibold mb-4 text-foreground">Kualitas</h3>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Menjaga standar kualitas tinggi dalam setiap aspek layanan, dari kondisi kendaraan hingga pelayanan pelanggan.
                </p>
              </CardContent>
            </Card>
            <Card className="transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
              <CardContent className="p-8 text-center">
                <MapPin className="h-16 w-16 mx-auto mb-6 text-primary" />
                <h3 className="text-2xl font-semibold mb-4 text-foreground">Aksesibilitas</h3>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Memberikan kemudahan akses layanan sewa mobil kapan saja dan di mana saja melalui platform digital.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-5xl font-bold text-primary">500+</div>
              <div className="text-xl text-muted-foreground">Pelanggan Puas</div>
            </div>
            <div className="space-y-2">
              <div className="text-5xl font-bold text-primary">50+</div>
              <div className="text-xl text-muted-foreground">Armada Kendaraan</div>
            </div>
            <div className="space-y-2">
              <div className="text-5xl font-bold text-primary">24/7</div>
              <div className="text-xl text-muted-foreground">Layanan Pelanggan</div>
            </div>
            <div className="space-y-2">
              <div className="text-5xl font-bold text-primary">4.9</div>
              <div className="text-xl text-muted-foreground">Rating Kepuasan</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}