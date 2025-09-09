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
  FileText, 
  Upload, 
  Plus, 
  Calendar, 
  User, 
  Shield,
  Syringe,
  Pill,
  Heart,
  FileCheck,
  ChevronRight
} from 'lucide-react';
import { mockHealthRecords } from '@/data/mockData';
import { MainLayout } from '@/components/layout/MainLayout';
import { useToast } from '@/hooks/use-toast';
import { HealthRecord } from '@/types';

export default function Records() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

  const userRecords = mockHealthRecords.filter(record => record.workerId === user?.id);

  const recordTypes = [
    { value: 'all', label: 'All Records', icon: FileText },
    { value: 'vaccination', label: t('records.type.vaccination'), icon: Syringe },
    { value: 'prescription', label: t('records.type.prescription'), icon: Pill },
    { value: 'checkup', label: t('records.type.checkup'), icon: Heart },
    { value: 'certificate', label: t('records.type.certificate'), icon: FileCheck },
  ];

  const filteredRecords = selectedFilter === 'all' 
    ? userRecords 
    : userRecords.filter(record => record.type === selectedFilter);

  const getRecordIcon = (type: string) => {
    switch (type) {
      case 'vaccination': return Syringe;
      case 'prescription': return Pill;
      case 'checkup': return Heart;
      case 'certificate': return FileCheck;
      default: return FileText;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'default';
      case 'approved': return 'secondary';
      case 'pending': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{t('nav.records')}</h1>
            <p className="text-muted-foreground mt-1">
              Manage and view your complete medical history
            </p>
          </div>
          <UploadRecordDialog 
            open={uploadDialogOpen} 
            onOpenChange={setUploadDialogOpen}
          />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {recordTypes.slice(1).map((type, index) => {
            const count = userRecords.filter(r => r.type === type.value).length;
            const Icon = type.icon;
            return (
              <Card key={type.value} className="shadow-card">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{count}</p>
                      <p className="text-sm text-muted-foreground">{type.label}</p>
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
                {recordTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <TabsTrigger key={type.value} value={type.value} className="flex items-center gap-2">
                      <Icon className="w-4 h-4" />
                      <span className="hidden sm:inline">{type.label}</span>
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </Tabs>
          </CardContent>
        </Card>

        {/* Records List */}
        <div className="space-y-4">
          {filteredRecords.length === 0 ? (
            <Card className="shadow-card">
              <CardContent className="p-8 text-center">
                <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No Records Found</h3>
                <p className="text-muted-foreground mb-4">
                  {selectedFilter === 'all' 
                    ? "You haven't uploaded any medical records yet." 
                    : `No ${selectedFilter} records found.`}
                </p>
                <Button onClick={() => setUploadDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  {t('records.upload')}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredRecords.map((record) => {
                const Icon = getRecordIcon(record.type);
                return (
                  <Card key={record.id} className="shadow-card hover:shadow-medical transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Icon className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-lg mb-1">{record.title}</h3>
                              <p className="text-muted-foreground text-sm mb-2 line-clamp-2">
                                {record.description}
                              </p>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <User className="w-4 h-4" />
                                  {record.doctorName}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-4 h-4" />
                                  {new Date(record.date).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <Badge variant={getStatusColor(record.status) as any}>
                                {record.status}
                              </Badge>
                              <ChevronRight className="w-5 h-5 text-muted-foreground" />
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

function UploadRecordDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    type: '',
    title: '',
    description: '',
    category: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate upload
    toast({
      title: t('common.success'),
      description: 'Health record uploaded successfully!',
    });
    
    onOpenChange(false);
    setFormData({ type: '', title: '', description: '', category: '' });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          {t('records.upload')}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Health Record</DialogTitle>
          <DialogDescription>
            Add a new medical record to your digital health profile
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="type">Record Type</Label>
            <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select record type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="vaccination">{t('records.type.vaccination')}</SelectItem>
                <SelectItem value="prescription">{t('records.type.prescription')}</SelectItem>
                <SelectItem value="checkup">{t('records.type.checkup')}</SelectItem>
                <SelectItem value="report">{t('records.type.report')}</SelectItem>
                <SelectItem value="certificate">{t('records.type.certificate')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="e.g., COVID-19 Vaccination"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Brief description of the medical record"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="file">Upload Document (Optional)</Label>
            <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center">
              <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground mb-2">
                Drag and drop files here, or click to browse
              </p>
              <Button type="button" variant="outline" size="sm">
                Choose Files
              </Button>
            </div>
          </div>

          <div className="flex gap-3">
            <Button type="button" variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
              {t('common.cancel')}
            </Button>
            <Button type="submit" className="flex-1">
              {t('records.upload')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}