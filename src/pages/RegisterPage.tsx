import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Eye, EyeOff, Upload, CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    full_name: '',
    phone_number: '',
    ktp_number: '',
    license_number: ''
  });
  const [dateOfBirth, setDateOfBirth] = useState<Date>();
  const [ktpFile, setKtpFile] = useState<File | null>(null);
  const [licenseFile, setLicenseFile] = useState<File | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const uploadFile = async (file: File, folder: string, userId: string) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${folder}/${Date.now()}.${fileExt}`;
    
    const { error } = await supabase.storage
      .from('user-documents')
      .upload(fileName, file);

    if (error) throw error;

    const { data } = supabase.storage
      .from('user-documents')
      .getPublicUrl(fileName);

    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validation
      if (formData.password !== formData.confirmPassword) {
        toast({
          title: "Password Tidak Cocok",
          description: "Pastikan password dan konfirmasi password sama.",
          variant: "destructive",
        });
        return;
      }

      if (formData.password.length < 6) {
        toast({
          title: "Password Terlalu Pendek",
          description: "Password minimal 6 karakter.",
          variant: "destructive",
        });
        return;
      }

      if (!ktpFile || !licenseFile) {
        toast({
          title: "File Belum Lengkap",
          description: "Silakan upload foto KTP dan SIM Anda.",
          variant: "destructive",
        });
        return;
      }

      // Sign up user first
      const { error: signUpError } = await signUp(formData.email, formData.password, {
        full_name: formData.full_name
      });

      if (signUpError) {
        if (signUpError.message === 'User already registered') {
          toast({
            title: "Email Sudah Terdaftar",
            description: "Email ini sudah digunakan. Silakan gunakan email lain atau login.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Pendaftaran Gagal",
            description: signUpError.message,
            variant: "destructive",
          });
        }
        return;
      }

      // Get current user session to get user ID
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        throw new Error('Unable to get user session');
      }

      // Upload files
      const ktpUrl = await uploadFile(ktpFile, 'ktp', session.user.id);
      const licenseUrl = await uploadFile(licenseFile, 'license', session.user.id);

      // Update profile with additional data
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          phone_number: formData.phone_number,
          ktp_number: formData.ktp_number,
          license_number: formData.license_number,
          ktp_image_url: ktpUrl,
          license_image_url: licenseUrl,
          date_of_birth: dateOfBirth ? dateOfBirth.toISOString().split('T')[0] : null
        })
        .eq('id', session.user.id);

      if (updateError) throw updateError;

      toast({
        title: "Pendaftaran Berhasil",
        description: "Akun Anda telah dibuat. Silakan periksa email untuk verifikasi.",
      });
      
      navigate('/');
    } catch (error: any) {
      toast({
        title: "Terjadi Kesalahan",
        description: error.message || "Silakan coba lagi.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/50 px-4 py-8">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Daftar Akun Baru</CardTitle>
          <p className="text-muted-foreground">
            Lengkapi data diri Anda untuk membuat akun
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="full_name">Nama Lengkap</Label>
                <Input
                  id="full_name"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  placeholder="Masukkan nama lengkap"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Masukkan email"
                  required
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Minimal 6 karakter"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              
              <div>
                <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Ulangi password"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone_number">Nomor Telepon</Label>
                <Input
                  id="phone_number"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleInputChange}
                  placeholder="08xxxxxxxxxx"
                  required
                />
              </div>
              
              <div>
                <Label>Tanggal Lahir</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !dateOfBirth && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateOfBirth ? format(dateOfBirth, "dd/MM/yyyy") : <span>Pilih tanggal lahir</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dateOfBirth}
                      onSelect={setDateOfBirth}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="ktp_number">Nomor KTP</Label>
                <Input
                  id="ktp_number"
                  name="ktp_number"
                  value={formData.ktp_number}
                  onChange={handleInputChange}
                  placeholder="16 digit nomor KTP"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="license_number">Nomor SIM</Label>
                <Input
                  id="license_number"
                  name="license_number"
                  value={formData.license_number}
                  onChange={handleInputChange}
                  placeholder="Nomor SIM"
                  required
                />
              </div>
            </div>


            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="ktp_file">Foto KTP</Label>
                <div className="mt-1">
                  <Input
                    id="ktp_file"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setKtpFile(e.target.files?.[0] || null)}
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="license_file">Foto SIM</Label>
                <div className="mt-1">
                  <Input
                    id="license_file"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setLicenseFile(e.target.files?.[0] || null)}
                    required
                  />
                </div>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading}
            >
              {loading ? "Sedang mendaftar..." : "Daftar"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-muted-foreground">
              Sudah punya akun?{' '}
              <Link to="/login" className="text-primary hover:underline font-medium">
                Login di sini
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}