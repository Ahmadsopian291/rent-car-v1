import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Pencil, Trash2, Plus, Eye, Upload, X } from 'lucide-react';

interface Car {
  id: number;
  name: string;
  type: string;
  price_per_day: number;
  fuel_type: string;
  seats: number;
  transmission: string;
  engine_cc: number;
  description: string;
  image_url: string;
  is_available: boolean;
}

interface UserProfile {
  role: string;
}

export default function CarManagement() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [cars, setCars] = useState<Car[]>([]);
  const [userRole, setUserRole] = useState<string>('user');
  const [loading, setLoading] = useState(true);
  const [editingCar, setEditingCar] = useState<Car | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  const [formData, setFormData] = useState({
    name: '',
    type: '',
    price_per_day: '',
    fuel_type: '',
    seats: '',
    transmission: '',
    engine_cc: '',
    description: '',
    image_url: '',
    is_available: true,
  });

  useEffect(() => {
    fetchUserRole();
    fetchCars();
  }, []);

  const fetchUserRole = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      setUserRole((data as UserProfile)?.role || 'user');
    } catch (error) {
      console.error('Error fetching user role:', error);
    }
  };

  const fetchCars = async () => {
    try {
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .order('name');

      if (error) throw error;
      setCars(data || []);
    } catch (error) {
      console.error('Error fetching cars:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      type: '',
      price_per_day: '',
      fuel_type: '',
      seats: '',
      transmission: '',
      engine_cc: '',
      description: '',
      image_url: '',
      is_available: true,
    });
    setEditingCar(null);
    setImageFile(null);
    setImagePreview('');
  };

  const handleEdit = (car: Car) => {
    setEditingCar(car);
    setFormData({
      name: car.name,
      type: car.type,
      price_per_day: car.price_per_day.toString(),
      fuel_type: car.fuel_type,
      seats: car.seats.toString(),
      transmission: car.transmission,
      engine_cc: car.engine_cc.toString(),
      description: car.description || '',
      image_url: car.image_url || '',
      is_available: car.is_available,
    });
    setImagePreview(car.image_url || '');
    setShowDialog(true);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile) return null;

    setUploading(true);
    try {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `car-images/${Date.now()}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('user-documents')
        .upload(fileName, imageFile);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('user-documents')
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Error",
        description: "Gagal mengupload gambar",
        variant: "destructive",
      });
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (userRole !== 'admin') {
      toast({
        title: "Error",
        description: "Anda tidak memiliki izin untuk melakukan aksi ini.",
        variant: "destructive"
      });
      return;
    }

    try {
      let imageUrl = formData.image_url;

      // Upload new image if selected
      if (imageFile) {
        const uploadedUrl = await uploadImage();
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        }
      }

      const carData = {
        name: formData.name,
        type: formData.type,
        price_per_day: parseFloat(formData.price_per_day),
        fuel_type: formData.fuel_type,
        seats: parseInt(formData.seats),
        transmission: formData.transmission,
        engine_cc: parseInt(formData.engine_cc),
        description: formData.description,
        image_url: imageUrl,
        is_available: formData.is_available,
      };

      if (editingCar) {
        const { error } = await supabase
          .from('cars')
          .update(carData)
          .eq('id', editingCar.id);

        if (error) throw error;

        toast({
          title: "Berhasil",
          description: "Data mobil berhasil diperbarui.",
        });
      } else {
        const { error } = await supabase
          .from('cars')
          .insert(carData);

        if (error) throw error;

        toast({
          title: "Berhasil",
          description: "Mobil baru berhasil ditambahkan.",
        });
      }

      setShowDialog(false);
      resetForm();
      fetchCars();
    } catch (error) {
      console.error('Error saving car:', error);
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat menyimpan data.",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (carId: number) => {
    if (userRole !== 'admin') {
      toast({
        title: "Error",
        description: "Anda tidak memiliki izin untuk melakukan aksi ini.",
        variant: "destructive"
      });
      return;
    }

    if (!confirm('Apakah Anda yakin ingin menghapus mobil ini?')) return;

    try {
      const { error } = await supabase
        .from('cars')
        .delete()
        .eq('id', carId);

      if (error) throw error;

      toast({
        title: "Berhasil",
        description: "Mobil berhasil dihapus.",
      });

      fetchCars();
    } catch (error) {
      console.error('Error deleting car:', error);
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat menghapus mobil.",
        variant: "destructive"
      });
    }
  };

  const isAdmin = userRole === 'admin';

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Manajemen Mobil</h2>
          <p className="text-muted-foreground">
            Kelola data mobil yang tersedia untuk disewa
          </p>
        </div>
        {isAdmin && (
          <Dialog open={showDialog} onOpenChange={setShowDialog}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                Tambah Mobil
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingCar ? 'Edit Mobil' : 'Tambah Mobil Baru'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Nama Mobil</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="type">Tipe</Label>
                    <Input
                      id="type"
                      value={formData.type}
                      onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price">Harga per Hari</Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price_per_day}
                      onChange={(e) => setFormData(prev => ({ ...prev, price_per_day: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="seats">Jumlah Kursi</Label>
                    <Input
                      id="seats"
                      type="number"
                      value={formData.seats}
                      onChange={(e) => setFormData(prev => ({ ...prev, seats: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fuel_type">Jenis Bahan Bakar</Label>
                    <Select value={formData.fuel_type} onValueChange={(value) => setFormData(prev => ({ ...prev, fuel_type: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih jenis bahan bakar" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Bensin">Bensin</SelectItem>
                        <SelectItem value="Diesel">Diesel</SelectItem>
                        <SelectItem value="Listrik">Listrik</SelectItem>
                        <SelectItem value="Hybrid">Hybrid</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="transmission">Transmisi</Label>
                    <Select value={formData.transmission} onValueChange={(value) => setFormData(prev => ({ ...prev, transmission: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih transmisi" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Manual">Manual</SelectItem>
                        <SelectItem value="Automatic">Automatic</SelectItem>
                        <SelectItem value="CVT">CVT</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="engine_cc">Kapasitas Mesin (CC)</Label>
                  <Input
                    id="engine_cc"
                    type="number"
                    value={formData.engine_cc}
                    onChange={(e) => setFormData(prev => ({ ...prev, engine_cc: e.target.value }))}
                    required
                  />
                </div>

                <div>
                  <Label>Gambar Mobil</Label>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleImageSelect}
                        className="flex-1"
                      />
                      {imagePreview && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setImageFile(null);
                            setImagePreview('');
                            setFormData(prev => ({ ...prev, image_url: '' }));
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    
                    {imagePreview && (
                      <div className="border rounded-lg p-4 bg-muted/50">
                        <img 
                          src={imagePreview} 
                          alt="Preview" 
                          className="max-w-full h-auto max-h-48 object-contain mx-auto rounded"
                        />
                      </div>
                    )}
                    
                    <div className="text-sm text-muted-foreground">
                      <p>Atau masukkan URL gambar:</p>
                      <Input
                        type="url"
                        value={formData.image_url}
                        onChange={(e) => {
                          setFormData(prev => ({ ...prev, image_url: e.target.value }));
                          if (e.target.value && !imageFile) {
                            setImagePreview(e.target.value);
                          }
                        }}
                        placeholder="https://example.com/image.jpg"
                        className="mt-2"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Deskripsi</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="is_available"
                    checked={formData.is_available}
                    onChange={(e) => setFormData(prev => ({ ...prev, is_available: e.target.checked }))}
                  />
                  <Label htmlFor="is_available">Tersedia untuk disewa</Label>
                </div>

                <div className="flex space-x-2">
                  <Button type="submit" disabled={uploading}>
                    {uploading ? (
                      <>
                        <Upload className="h-4 w-4 mr-2 animate-spin" />
                        Mengupload...
                      </>
                    ) : editingCar ? 'Perbarui' : 'Simpan'}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowDialog(false)}>
                    Batal
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Mobil</CardTitle>
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
                  <TableHead>Nama</TableHead>
                  <TableHead>Tipe</TableHead>
                  <TableHead>Harga/Hari</TableHead>
                  <TableHead>Kursi</TableHead>
                  <TableHead>Bahan Bakar</TableHead>
                  <TableHead>Transmisi</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cars.map((car) => (
                  <TableRow key={car.id}>
                    <TableCell className="font-medium">{car.name}</TableCell>
                    <TableCell>{car.type}</TableCell>
                    <TableCell>Rp {car.price_per_day.toLocaleString()}</TableCell>
                    <TableCell>{car.seats}</TableCell>
                    <TableCell>{car.fuel_type}</TableCell>
                    <TableCell>{car.transmission}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        car.is_available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {car.is_available ? 'Tersedia' : 'Tidak Tersedia'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        {isAdmin ? (
                          <>
                            <Button variant="outline" size="sm" onClick={() => handleEdit(car)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleDelete(car.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        ) : (
                          <Button variant="outline" size="sm" disabled>
                            <Eye className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
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