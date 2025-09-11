import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar,
  Clock, 
  Plus, 
  User, 
  Stethoscope,
  CheckCircle,
  XCircle,
  AlertCircle,
  MapPin
} from 'lucide-react';
import { mockAppointments, mockDoctors } from '@/data/mockData';
import { MainLayout } from '@/components/layout/MainLayout';
import { useToast } from '@/hooks/use-toast';

export default function Appointments() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);

  const userAppointments = user?.role === 'worker' 
    ? mockAppointments.filter(apt => apt.workerId === user.id)
    : mockAppointments; // Doctors see all appointments

  const statusFilters = [
    { value: 'all', label: 'All Appointments' },
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  const filteredAppointments = selectedFilter === 'all' 
    ? userAppointments 
    : userAppointments.filter(apt => apt.status === selectedFilter);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return CheckCircle;
      case 'completed': return CheckCircle;
      case 'cancelled': return XCircle;
      case 'pending': return AlertCircle;
      default: return Clock;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'default';
      case 'completed': return 'secondary';
      case 'cancelled': return 'destructive';
      case 'pending': return 'outline';
      default: return 'outline';
    }
  };

  const stats = [
    {
      title: 'Total Appointments',
      value: userAppointments.length,
      icon: Calendar,
      color: 'bg-primary'
    },
    {
      title: 'Pending',
      value: userAppointments.filter(a => a.status === 'pending').length,
      icon: AlertCircle,
      color: 'bg-warning'
    },
    {
      title: 'Approved',
      value: userAppointments.filter(a => a.status === 'approved').length,
      icon: CheckCircle,
      color: 'bg-success'
    },
    {
      title: 'Completed',
      value: userAppointments.filter(a => a.status === 'completed').length,
      icon: CheckCircle,
      color: 'bg-secondary'
    }
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{t('nav.appointments')}</h1>
            <p className="text-muted-foreground mt-1">
              {user?.role === 'worker' 
                ? 'Book and manage your medical appointments'
                : 'Manage patient appointments and schedule'}
            </p>
          </div>
          {user?.role === 'worker' && (
            <BookAppointmentDialog 
              open={bookingDialogOpen} 
              onOpenChange={setBookingDialogOpen}
            />
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="shadow-card">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg ${stat.color} flex items-center justify-center text-white`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <p className="text-sm text-muted-foreground">{stat.title}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Filters */}
        <Card className="shadow-card">
          <CardContent className="p-4">
            <Tabs value={selectedFilter} onValueChange={setSelectedFilter}>
              <TabsList className="grid grid-cols-5 w-full">
                {statusFilters.map((filter) => (
                  <TabsTrigger key={filter.value} value={filter.value}>
                    {filter.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </CardContent>
        </Card>

        {/* Appointments List */}
        <div className="space-y-4">
          {filteredAppointments.length === 0 ? (
            <Card className="shadow-card">
              <CardContent className="p-8 text-center">
                <Calendar className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No Appointments Found</h3>
                <p className="text-muted-foreground mb-4">
                  {selectedFilter === 'all' 
                    ? "You don't have any appointments scheduled." 
                    : `No ${selectedFilter} appointments found.`}
                </p>
                {user?.role === 'worker' && (
                  <Button onClick={() => setBookingDialogOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    {t('appointments.book')}
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredAppointments.map((appointment) => {
                const StatusIcon = getStatusIcon(appointment.status);
                return (
                  <Card key={appointment.id} className="shadow-card">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Stethoscope className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-lg mb-1">
                                {user?.role === 'worker' ? appointment.doctorName : appointment.workerName}
                              </h3>
                              <p className="text-muted-foreground text-sm mb-2">
                                {appointment.type}
                              </p>
                              <div className="flex items-center gap-6 text-sm text-muted-foreground mb-3">
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-4 h-4" />
                                  {new Date(appointment.date).toLocaleDateString()}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  {appointment.time}
                                </div>
                                {user?.role === 'doctor' && (
                                  <div className="flex items-center gap-1">
                                    <User className="w-4 h-4" />
                                    Patient ID: {appointment.workerId}
                                  </div>
                                )}
                              </div>
                              {appointment.notes && (
                                <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                                  <strong>Notes:</strong> {appointment.notes}
                                </p>
                              )}
                            </div>
                            <div className="flex items-center gap-3">
                              <Badge variant={getStatusColor(appointment.status) as any} className="flex items-center gap-1">
                                <StatusIcon className="w-3 h-3" />
                                {appointment.status}
                              </Badge>
                              {user?.role === 'doctor' && appointment.status === 'pending' && (
                                <div className="flex gap-2">
                                  <Button size="sm" variant="outline">
                                    Approve
                                  </Button>
                                  <Button size="sm" variant="outline">
                                    Decline
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

function BookAppointmentDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    doctorId: '',
    date: '',
    time: '',
    type: '',
    urgency: '',
    reason: '',
    symptoms: '',
    insurance: '',
    emergencyContact: '',
    location: '',
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate booking
    toast({
      title: t('common.success'),
      description: 'Appointment booked successfully! You will receive a confirmation soon.',
    });
    
    onOpenChange(false);
    setFormData({ 
      doctorId: '', date: '', time: '', type: '', urgency: '', reason: '', 
      symptoms: '', insurance: '', emergencyContact: '', location: '', notes: '' 
    });
  };

  const timeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          {t('appointments.book')}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('appointments.book')}</DialogTitle>
          <DialogDescription>
            Schedule a medical appointment with a healthcare provider
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="doctor">Select Doctor *</Label>
              <Select value={formData.doctorId} onValueChange={(value) => setFormData(prev => ({ ...prev, doctorId: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a doctor" />
                </SelectTrigger>
                <SelectContent>
                  {mockDoctors.map((doctor) => (
                    <SelectItem key={doctor.id} value={doctor.id}>
                      <div className="flex flex-col">
                        <span>{doctor.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {doctor.specialization} • {doctor.hospital}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="urgency">Priority Level</Label>
              <Select value={formData.urgency} onValueChange={(value) => setFormData(prev => ({ ...prev, urgency: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="routine">Routine</SelectItem>
                  <SelectItem value="urgent">Urgent (within 24hrs)</SelectItem>
                  <SelectItem value="emergency">Emergency</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Preferred Date *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">Preferred Time *</Label>
              <Select value={formData.time} onValueChange={(value) => setFormData(prev => ({ ...prev, time: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select time slot" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Appointment Type *</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select appointment type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="consultation">General Consultation</SelectItem>
                  <SelectItem value="checkup">Health Checkup</SelectItem>
                  <SelectItem value="followup">Follow-up Visit</SelectItem>
                  <SelectItem value="vaccination">Vaccination</SelectItem>
                  <SelectItem value="emergency">Emergency Consultation</SelectItem>
                  <SelectItem value="specialist">Specialist Referral</SelectItem>
                  <SelectItem value="therapy">Physical Therapy</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Preferred Location</Label>
              <Select value={formData.location} onValueChange={(value) => setFormData(prev => ({ ...prev, location: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="main-clinic">Main Clinic</SelectItem>
                  <SelectItem value="community-center">Community Health Center</SelectItem>
                  <SelectItem value="mobile-unit">Mobile Health Unit</SelectItem>
                  <SelectItem value="workplace">Workplace Visit</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Reason for Visit *</Label>
            <Input
              id="reason"
              value={formData.reason}
              onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
              placeholder="e.g., Annual checkup, Follow-up, Vaccination"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="symptoms">Current Symptoms</Label>
            <Textarea
              id="symptoms"
              value={formData.symptoms}
              onChange={(e) => setFormData(prev => ({ ...prev, symptoms: e.target.value }))}
              placeholder="Describe any symptoms you're experiencing"
              rows={2}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="insurance">Insurance Provider</Label>
              <Input
                id="insurance"
                value={formData.insurance}
                onChange={(e) => setFormData(prev => ({ ...prev, insurance: e.target.value }))}
                placeholder="Insurance company name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="emergencyContact">Emergency Contact</Label>
              <Input
                id="emergencyContact"
                value={formData.emergencyContact}
                onChange={(e) => setFormData(prev => ({ ...prev, emergencyContact: e.target.value }))}
                placeholder="Emergency contact number"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Any specific concerns, requirements, or additional information"
              rows={3}
            />
          </div>

          <div className="flex gap-3">
            <Button type="button" variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
              {t('common.cancel')}
            </Button>
            <Button type="submit" className="flex-1">
              Book Appointment
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}