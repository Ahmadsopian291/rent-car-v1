import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { Car, LogOut, User } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const Navigation = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchUserRole();
    }
  }, [user]);

  const fetchUserRole = async () => {
    if (!user) return;
    
    try {
      const { data } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
      
      setUserRole(data?.role || 'user');
    } catch (error) {
      console.error('Error fetching user role:', error);
      setUserRole('user');
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="bg-background border-b sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2 text-xl font-bold text-primary">
          <Car className="h-6 w-6" />
          <span>RentCar</span>
        </Link>

        {/* Only show navigation links if not in dashboard or admin pages */}
        {!location.pathname.startsWith('/dashboard') && !location.pathname.startsWith('/admin') && (
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-foreground hover:text-primary transition-colors">
              Beranda
            </Link>
            <Link to="/cars" className="text-foreground hover:text-primary transition-colors">
              Koleksi Mobil
            </Link>
            <Link to="/about" className="text-foreground hover:text-primary transition-colors">
              Tentang Kami
            </Link>
            <Link to="/blog" className="text-foreground hover:text-primary transition-colors">
              Blog
            </Link>
            <Link to="/contact" className="text-foreground hover:text-primary transition-colors">
              Kontak
            </Link>
          </div>
        )}

        <div className="flex items-center space-x-3">
          {user ? (
            <>
              {/* Show dashboard button only if not already in dashboard/admin pages */}
              {!location.pathname.startsWith('/dashboard') && !location.pathname.startsWith('/admin') && (
                <Button variant="outline" size="sm" asChild>
                  <Link to={userRole === 'admin' || userRole === 'sub_admin' ? '/admin' : '/dashboard'}>
                    <User className="h-4 w-4 mr-2" />
                    Dashboard
                  </Link>
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/login">Login</Link>
              </Button>
              <Button size="sm" asChild>
                <Link to="/register">Daftar</Link>
              </Button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};