import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  FileText, 
  Calendar, 
  QrCode, 
  TrendingUp, 
  Shield, 
  Users,
  Stethoscope,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { mockHealthRecords, mockAppointments } from '@/data/mockData';
import { MainLayout } from '@/components/layout/MainLayout';

export default function Dashboard() {
  const { user } = useAuth();
  const { t } = useLanguage();

  if (!user) return null;

  if (user.role === 'doctor') {
    return <DoctorDashboard />;
  }

  return <WorkerDashboard />;
}

function WorkerDashboard() {
  const { user } = useAuth();
  const { t } = useLanguage();

  const userRecords = mockHealthRecords.filter(record => record.workerId === user?.id);
  const userAppointments = mockAppointments.filter(apt => apt.workerId === user?.id);
  const upcomingAppointments = userAppointments.filter(apt => apt.status === 'approved' || apt.status === 'pending');

  const stats = [
    {
      title: t('dashboard.records.total'),
      value: userRecords.length,
      icon: FileText,
      color: 'bg-primary',
      description: 'Medical records stored'
    },
    {
      title: t('dashboard.appointments.upcoming'),
      value: upcomingAppointments.length,
      icon: Calendar,
      color: 'bg-success',
      description: 'Scheduled appointments'
    },
    {
      title: 'Health Score',
      value: '92%',
      icon: TrendingUp,
      color: 'bg-warning',
      description: 'Overall health rating'
    },
    {
      title: 'Vaccinations',
      value: userRecords.filter(r => r.type === 'vaccination').length,
      icon: Shield,
      color: 'bg-destructive',
      description: 'Completed vaccines'
    }
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{t('dashboard.welcome')}, {user?.name}</h1>
            <p className="text-muted-foreground mt-1">
              {t('dashboard.health.id')}: <span className="font-mono font-medium">{user?.workerDetails?.healthId}</span>
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="px-3 py-1">
              <Shield className="w-4 h-4 mr-2" />
              Verified Worker
            </Badge>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="shadow-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <div className={`w-8 h-8 rounded-lg ${stat.color} flex items-center justify-center text-white`}>
                  <stat.icon className="w-4 h-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your health records efficiently</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button className="h-20 flex-col gap-2">
                <QrCode className="w-6 h-6" />
                View Digital ID
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2">
                <FileText className="w-6 h-6" />
                Upload Record
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2">
                <Calendar className="w-6 h-6" />
                Book Appointment
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Records & Appointments */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Records */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Recent Health Records</CardTitle>
              <CardDescription>Your latest medical entries</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {userRecords.slice(0, 3).map((record) => (
                  <div key={record.id} className="flex items-center gap-3 p-3 rounded-lg border">
                    <div className="w-2 h-2 rounded-full bg-success"></div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{record.title}</p>
                      <p className="text-xs text-muted-foreground">{record.doctorName}</p>
                    </div>
                    <Badge variant={record.status === 'completed' ? 'default' : 'secondary'}>
                      {record.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Appointments */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Upcoming Appointments</CardTitle>
              <CardDescription>Your scheduled medical visits</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingAppointments.slice(0, 3).map((appointment) => (
                  <div key={appointment.id} className="flex items-center gap-3 p-3 rounded-lg border">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Stethoscope className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{appointment.doctorName}</p>
                      <p className="text-xs text-muted-foreground">
                        {appointment.date} at {appointment.time}
                      </p>
                    </div>
                    <Badge variant={appointment.status === 'approved' ? 'default' : 'secondary'}>
                      {appointment.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}

function DoctorDashboard() {
  const { user } = useAuth();
  const { t } = useLanguage();

  const stats = [
    {
      title: 'Total Patients',
      value: '124',
      icon: Users,
      color: 'bg-primary',
      description: 'Active patient records'
    },
    {
      title: "Today's Appointments",
      value: '8',
      icon: Calendar,
      color: 'bg-success',
      description: 'Scheduled for today'
    },
    {
      title: 'Records Reviewed',
      value: '45',
      icon: FileText,
      color: 'bg-warning',
      description: 'This week'
    },
    {
      title: 'QR Scans',
      value: '12',
      icon: QrCode,
      color: 'bg-destructive',
      description: 'Patient ID verifications'
    }
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Welcome, {user?.name}</h1>
            <p className="text-muted-foreground mt-1">
              {user?.doctorDetails?.specialization} • {user?.doctorDetails?.hospital}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Badge className="px-3 py-1">
              <Stethoscope className="w-4 h-4 mr-2" />
              Licensed Doctor
            </Badge>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="shadow-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <div className={`w-8 h-8 rounded-lg ${stat.color} flex items-center justify-center text-white`}>
                  <stat.icon className="w-4 h-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Doctor Tools</CardTitle>
            <CardDescription>Access patient records and manage appointments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button className="h-20 flex-col gap-2">
                <QrCode className="w-6 h-6" />
                Scan Patient QR
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2">
                <FileText className="w-6 h-6" />
                Patient Records
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2">
                <Calendar className="w-6 h-6" />
                View Appointments
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Today's Schedule & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Today's Appointments */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Today's Schedule</CardTitle>
              <CardDescription>Your appointments for today</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockAppointments.slice(0, 3).map((appointment) => (
                  <div key={appointment.id} className="flex items-center gap-3 p-3 rounded-lg border">
                    <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center">
                      <Clock className="w-4 h-4 text-success" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{appointment.workerName}</p>
                      <p className="text-xs text-muted-foreground">
                        {appointment.time} • {appointment.type}
                      </p>
                    </div>
                    <Badge variant={appointment.status === 'approved' ? 'default' : 'secondary'}>
                      {appointment.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activities */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest patient interactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-lg border">
                  <CheckCircle className="w-5 h-5 text-success" />
                  <div className="flex-1">
                    <p className="font-medium text-sm">Record approved for राम कुमार</p>
                    <p className="text-xs text-muted-foreground">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg border">
                  <QrCode className="w-5 h-5 text-primary" />
                  <div className="flex-1">
                    <p className="font-medium text-sm">QR Code scanned for patient verification</p>
                    <p className="text-xs text-muted-foreground">4 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg border">
                  <AlertCircle className="w-5 h-5 text-warning" />
                  <div className="flex-1">
                    <p className="font-medium text-sm">New appointment request pending</p>
                    <p className="text-xs text-muted-foreground">6 hours ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}