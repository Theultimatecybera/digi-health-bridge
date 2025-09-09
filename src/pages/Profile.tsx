import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Shield,
  Stethoscope,
  Edit2,
  Save,
  X,
  Heart,
  AlertTriangle,
  Camera
} from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { useToast } from '@/hooks/use-toast';

export default function Profile() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    // Worker specific
    dateOfBirth: user?.workerDetails?.dateOfBirth || '',
    nationality: user?.workerDetails?.nationality || '',
    emergencyContact: user?.workerDetails?.emergencyContact || '',
    bloodGroup: user?.workerDetails?.bloodGroup || '',
    allergies: user?.workerDetails?.allergies?.join(', ') || '',
    // Doctor specific
    licenseNumber: user?.doctorDetails?.licenseNumber || '',
    specialization: user?.doctorDetails?.specialization || '',
    hospital: user?.doctorDetails?.hospital || '',
    experience: user?.doctorDetails?.experience?.toString() || ''
  });

  const handleSave = () => {
    // Simulate save
    toast({
      title: t('common.success'),
      description: 'Profile updated successfully!',
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    // Reset form data
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      dateOfBirth: user?.workerDetails?.dateOfBirth || '',
      nationality: user?.workerDetails?.nationality || '',
      emergencyContact: user?.workerDetails?.emergencyContact || '',
      bloodGroup: user?.workerDetails?.bloodGroup || '',
      allergies: user?.workerDetails?.allergies?.join(', ') || '',
      licenseNumber: user?.doctorDetails?.licenseNumber || '',
      specialization: user?.doctorDetails?.specialization || '',
      hospital: user?.doctorDetails?.hospital || '',
      experience: user?.doctorDetails?.experience?.toString() || ''
    });
    setIsEditing(false);
  };

  if (!user) return null;

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{t('nav.profile')}</h1>
            <p className="text-muted-foreground mt-1">
              Manage your personal information and preferences
            </p>
          </div>
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button variant="outline" onClick={handleCancel}>
                  <X className="w-4 h-4 mr-2" />
                  {t('common.cancel')}
                </Button>
                <Button onClick={handleSave}>
                  <Save className="w-4 h-4 mr-2" />
                  {t('common.save')}
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)}>
                <Edit2 className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <Card className="shadow-card">
            <CardContent className="p-6 text-center">
              <div className="relative inline-block mb-4">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={user.profileImage} />
                  <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                    {user.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <Button
                    size="sm"
                    className="absolute -bottom-1 -right-1 rounded-full w-8 h-8 p-0"
                  >
                    <Camera className="w-4 h-4" />
                  </Button>
                )}
              </div>
              <h2 className="text-xl font-bold mb-1">{user.name}</h2>
              <Badge 
                variant={user.role === 'doctor' ? 'default' : 'secondary'}
                className="mb-3"
              >
                {user.role === 'doctor' ? (
                  <><Stethoscope className="w-3 h-3 mr-1" /> Doctor</>
                ) : (
                  <><User className="w-3 h-3 mr-1" /> Health Worker</>
                )}
              </Badge>
              
              {user.role === 'worker' && user.workerDetails && (
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-center gap-2">
                    <Shield className="w-4 h-4 text-primary" />
                    <span className="font-mono">{user.workerDetails.healthId}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="shadow-card lg:col-span-2">
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>Your basic contact details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">{t('auth.name')}</Label>
                  {isEditing ? (
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    />
                  ) : (
                    <div className="flex items-center gap-2 p-2 border rounded-md bg-muted/30">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span>{user.name}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">{t('auth.email')}</Label>
                  {isEditing ? (
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    />
                  ) : (
                    <div className="flex items-center gap-2 p-2 border rounded-md bg-muted/30">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span>{user.email}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">{t('auth.phone')}</Label>
                  {isEditing ? (
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    />
                  ) : (
                    <div className="flex items-center gap-2 p-2 border rounded-md bg-muted/30">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span>{user.phone || 'Not provided'}</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Role-specific Information */}
        {user.role === 'worker' && user.workerDetails && (
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Health Information</CardTitle>
              <CardDescription>Your medical and personal details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  {isEditing ? (
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => setFormData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                    />
                  ) : (
                    <div className="flex items-center gap-2 p-2 border rounded-md bg-muted/30">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span>{user.workerDetails.dateOfBirth || 'Not provided'}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nationality">Nationality</Label>
                  {isEditing ? (
                    <Input
                      id="nationality"
                      value={formData.nationality}
                      onChange={(e) => setFormData(prev => ({ ...prev, nationality: e.target.value }))}
                    />
                  ) : (
                    <div className="flex items-center gap-2 p-2 border rounded-md bg-muted/30">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span>{user.workerDetails.nationality}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bloodGroup">Blood Group</Label>
                  {isEditing ? (
                    <Input
                      id="bloodGroup"
                      value={formData.bloodGroup}
                      onChange={(e) => setFormData(prev => ({ ...prev, bloodGroup: e.target.value }))}
                      placeholder="e.g., B+"
                    />
                  ) : (
                    <div className="flex items-center gap-2 p-2 border rounded-md bg-muted/30">
                      <Heart className="w-4 h-4 text-muted-foreground" />
                      <span>{user.workerDetails.bloodGroup || 'Not provided'}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="emergencyContact">Emergency Contact</Label>
                {isEditing ? (
                  <Input
                    id="emergencyContact"
                    value={formData.emergencyContact}
                    onChange={(e) => setFormData(prev => ({ ...prev, emergencyContact: e.target.value }))}
                    placeholder="Emergency contact number"
                  />
                ) : (
                  <div className="flex items-center gap-2 p-2 border rounded-md bg-muted/30">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span>{user.workerDetails.emergencyContact || 'Not provided'}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="allergies">Known Allergies</Label>
                {isEditing ? (
                  <Textarea
                    id="allergies"
                    value={formData.allergies}
                    onChange={(e) => setFormData(prev => ({ ...prev, allergies: e.target.value }))}
                    placeholder="List any known allergies, separated by commas"
                    rows={3}
                  />
                ) : (
                  <div className="flex items-start gap-2 p-2 border rounded-md bg-muted/30 min-h-[80px]">
                    <AlertTriangle className="w-4 h-4 text-muted-foreground mt-1" />
                    <div className="flex flex-wrap gap-2">
                      {user.workerDetails.allergies && user.workerDetails.allergies.length > 0 ? (
                        user.workerDetails.allergies.map((allergy, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {allergy}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-muted-foreground">No known allergies</span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {user.role === 'doctor' && user.doctorDetails && (
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Professional Information</CardTitle>
              <CardDescription>Your medical practice details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="licenseNumber">Medical License Number</Label>
                  {isEditing ? (
                    <Input
                      id="licenseNumber"
                      value={formData.licenseNumber}
                      onChange={(e) => setFormData(prev => ({ ...prev, licenseNumber: e.target.value }))}
                    />
                  ) : (
                    <div className="flex items-center gap-2 p-2 border rounded-md bg-muted/30">
                      <Shield className="w-4 h-4 text-muted-foreground" />
                      <span className="font-mono">{user.doctorDetails.licenseNumber || 'Not provided'}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="specialization">Specialization</Label>
                  {isEditing ? (
                    <Input
                      id="specialization"
                      value={formData.specialization}
                      onChange={(e) => setFormData(prev => ({ ...prev, specialization: e.target.value }))}
                    />
                  ) : (
                    <div className="flex items-center gap-2 p-2 border rounded-md bg-muted/30">
                      <Stethoscope className="w-4 h-4 text-muted-foreground" />
                      <span>{user.doctorDetails.specialization}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hospital">Hospital/Clinic</Label>
                  {isEditing ? (
                    <Input
                      id="hospital"
                      value={formData.hospital}
                      onChange={(e) => setFormData(prev => ({ ...prev, hospital: e.target.value }))}
                    />
                  ) : (
                    <div className="flex items-center gap-2 p-2 border rounded-md bg-muted/30">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span>{user.doctorDetails.hospital}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experience">Years of Experience</Label>
                  {isEditing ? (
                    <Input
                      id="experience"
                      type="number"
                      value={formData.experience}
                      onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
                    />
                  ) : (
                    <div className="flex items-center gap-2 p-2 border rounded-md bg-muted/30">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span>{user.doctorDetails.experience} years</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
}