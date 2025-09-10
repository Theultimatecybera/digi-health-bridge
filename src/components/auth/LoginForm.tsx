import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Stethoscope, User, Shield, Globe } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { languages } from '@/contexts/LanguageContext';

const logoUrl = '/lovable-uploads/66a1a78a-f368-4624-b170-87a848656703.png';

interface LoginFormProps {
  onSwitchToSignup: () => void;
}

export function LoginForm({ onSwitchToSignup }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'worker' | 'doctor'>('worker');
  const { login, isLoading } = useAuth();
  const { currentLanguage, setLanguage, t } = useLanguage();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const success = await login(email, password, role);
    
    if (success) {
      toast({
        title: t('common.success'),
        description: `Welcome back!`,
      });
    } else {
      toast({
        title: t('common.error'),
        description: 'Invalid credentials. Try ram@example.com / worker123 or priya@example.com / doctor123',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary/5 via-background to-success/5">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center w-16 h-16 mx-auto rounded-2xl bg-card border-2 border-primary/20 shadow-medical overflow-hidden">
            <img src={logoUrl} alt="Digital Health Records Logo" className="w-12 h-12 object-contain" />
          </div>
          <h1 className="text-2xl font-bold">Digital Health Records</h1>
          <p className="text-muted-foreground">Secure healthcare management for migrant workers</p>
        </div>

        {/* Language Selector */}
        <div className="flex justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Globe className="w-4 h-4" />
                {currentLanguage.nativeName}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {languages.map((lang) => (
                <DropdownMenuItem
                  key={lang.code}
                  onClick={() => setLanguage(lang)}
                  className={currentLanguage.code === lang.code ? "bg-muted" : ""}
                >
                  {lang.nativeName}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Card className="shadow-medical">
          <CardHeader>
            <CardTitle>{t('auth.login')}</CardTitle>
            <CardDescription>
              Choose your role and enter your credentials
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Role Selection */}
              <Tabs value={role} onValueChange={(value) => setRole(value as 'worker' | 'doctor')}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="worker" className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    {t('auth.role.worker')}
                  </TabsTrigger>
                  <TabsTrigger value="doctor" className="flex items-center gap-2">
                    <Stethoscope className="w-4 h-4" />
                    {t('auth.role.doctor')}
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              {/* Form Fields */}
              <div className="space-y-2">
                <Label htmlFor="email">{t('auth.email')}</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">{t('auth.password')}</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? t('common.loading') : t('auth.login')}
              </Button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-4 p-3 bg-muted rounded-lg text-sm">
              <p className="font-medium mb-2">Demo Credentials:</p>
              <p><strong>Worker:</strong> ram@example.com / worker123</p>
              <p><strong>Doctor:</strong> priya@example.com / doctor123</p>
            </div>

            <div className="mt-4 text-center">
              <Button variant="link" onClick={onSwitchToSignup}>
                Don't have an account? {t('auth.signup')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}