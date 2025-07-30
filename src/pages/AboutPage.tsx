import { Card, CardContent } from '@/components/ui/card';
import { Award, Heart, Users } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-4">Tentang Kami</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Kami adalah penyedia layanan sewa mobil terpercaya yang telah melayani ribuan pelanggan dengan komitmen memberikan pelayanan terbaik.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 mb-16">
        <div>
          <h2 className="text-2xl font-bold mb-4">Visi Kami</h2>
          <p className="text-muted-foreground mb-6">
            Menjadi perusahaan penyewaan mobil terdepan di Indonesia yang memberikan pelayanan berkualitas tinggi dengan armada terlengkap dan terpercaya.
          </p>
          
          <h2 className="text-2xl font-bold mb-4">Misi Kami</h2>
          <ul className="text-muted-foreground space-y-2">
            <li>• Menyediakan armada mobil berkualitas dan terawat</li>
            <li>• Memberikan pelayanan customer service yang excellent</li>
            <li>• Menawarkan harga yang kompetitif dan transparan</li>
            <li>• Memastikan kepuasan dan keamanan pelanggan</li>
          </ul>
        </div>
        
        <div className="bg-muted/50 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Mengapa Memilih Kami?</h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Award className="h-5 w-5 text-primary mt-1" />
              <div>
                <h4 className="font-medium">Berpengalaman</h4>
                <p className="text-sm text-muted-foreground">Lebih dari 10 tahun melayani pelanggan</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Users className="h-5 w-5 text-primary mt-1" />
              <div>
                <h4 className="font-medium">Tim Profesional</h4>
                <p className="text-sm text-muted-foreground">Didukung tim yang berpengalaman dan ramah</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Heart className="h-5 w-5 text-primary mt-1" />
              <div>
                <h4 className="font-medium">Pelayanan Prima</h4>
                <p className="text-sm text-muted-foreground">Mengutamakan kepuasan pelanggan</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-primary mb-2">500+</div>
            <p className="text-muted-foreground">Mobil Tersedia</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-primary mb-2">10,000+</div>
            <p className="text-muted-foreground">Pelanggan Puas</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-primary mb-2">15+</div>
            <p className="text-muted-foreground">Kota Terlayani</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}