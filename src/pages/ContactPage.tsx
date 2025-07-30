import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    toast({
      title: "Pesan Terkirim!",
      description: "Kami akan menghubungi Anda segera.",
    });
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-24 bg-primary/5">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold mb-6 text-foreground animate-fade-in">
            Hubungi Kami
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed animate-fade-in-up">
            Siap membantu Anda dengan layanan sewa mobil terbaik di Bandung. 
            Hubungi kami kapan saja untuk konsultasi dan pemesanan.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16">
            
            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-4xl font-bold mb-8 text-foreground">Informasi Kontak</h2>
                <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                  Tim customer service kami siap melayani Anda 24/7. Jangan ragu untuk menghubungi kami 
                  melalui berbagai channel komunikasi yang tersedia.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <Card className="transition-all duration-300 hover:shadow-lg">
                  <CardContent className="p-6">
                    <MapPin className="h-12 w-12 text-primary mb-4" />
                    <h3 className="text-xl font-semibold mb-2 text-foreground">Alamat</h3>
                    <p className="text-muted-foreground">
                      Jl. Dago Raya No. 123<br />
                      Bandung, Jawa Barat 40135
                    </p>
                  </CardContent>
                </Card>

                <Card className="transition-all duration-300 hover:shadow-lg">
                  <CardContent className="p-6">
                    <Phone className="h-12 w-12 text-primary mb-4" />
                    <h3 className="text-xl font-semibold mb-2 text-foreground">Telepon</h3>
                    <p className="text-muted-foreground">
                      +62 22 8765 4321<br />
                      +62 812 3456 7890
                    </p>
                  </CardContent>
                </Card>

                <Card className="transition-all duration-300 hover:shadow-lg">
                  <CardContent className="p-6">
                    <Mail className="h-12 w-12 text-primary mb-4" />
                    <h3 className="text-xl font-semibold mb-2 text-foreground">Email</h3>
                    <p className="text-muted-foreground">
                      info@drivenow.co.id<br />
                      support@drivenow.co.id
                    </p>
                  </CardContent>
                </Card>

                <Card className="transition-all duration-300 hover:shadow-lg">
                  <CardContent className="p-6">
                    <Clock className="h-12 w-12 text-primary mb-4" />
                    <h3 className="text-xl font-semibold mb-2 text-foreground">Jam Operasional</h3>
                    <p className="text-muted-foreground">
                      24 Jam Setiap Hari<br />
                      Layanan Customer Service
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <Card className="shadow-xl">
                <CardHeader>
                  <CardTitle className="text-3xl font-bold text-foreground">Kirim Pesan</CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nama Lengkap</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Masukkan nama lengkap Anda"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="nama@email.com"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Nomor Telepon</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+62 812 3456 7890"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Pesan</Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Tulis pesan atau pertanyaan Anda di sini..."
                        rows={5}
                        required
                      />
                    </div>

                    <Button 
                      type="submit" 
                      size="lg" 
                      className="w-full transition-all duration-300 hover:scale-105"
                    >
                      Kirim Pesan
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12 text-foreground">Lokasi Kami</h2>
          <div className="rounded-lg overflow-hidden shadow-xl">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3961.2!2d107.6098!3d-6.8942!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68e7c381e3c123%3A0x5f9f3c5a8b9c6d2e!2sJl.%20Dago%2C%20Bandung%2C%20Jawa%20Barat!5e0!3m2!1sen!2sid!4v1642345678901"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Lokasi DriveNow Solutions"
            ></iframe>
          </div>
        </div>
      </section>
    </div>
  );
}