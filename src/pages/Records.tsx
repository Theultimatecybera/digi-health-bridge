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
import { mockHealthRecords, mockDoctors } from '@/data/mockData';
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
    doctorId: '',
    recordDate: '',
    expiryDate: '',
    privacy: 'private',
    tags: '',
    notes: ''
  });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate upload
    toast({
      title: t('common.success'),
      description: 'Health record uploaded successfully!',
    });
    
    onOpenChange(false);
    setFormData({ 
      type: '', title: '', description: '', doctorId: '', recordDate: '', 
      expiryDate: '', privacy: 'private', tags: '', notes: '' 
    });
    setSelectedFiles([]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          {t('records.upload')}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Upload Health Record</DialogTitle>
          <DialogDescription>
            Add a new medical record to your digital health profile
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Record Type *</Label>
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
                  <SelectItem value="lab-results">Lab Results</SelectItem>
                  <SelectItem value="imaging">Medical Imaging</SelectItem>
                  <SelectItem value="allergy">Allergy Information</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="privacy">Privacy Level</Label>
              <Select value={formData.privacy} onValueChange={(value) => setFormData(prev => ({ ...prev, privacy: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select privacy level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="private">Private (Only me)</SelectItem>
                  <SelectItem value="healthcare">Healthcare Providers</SelectItem>
                  <SelectItem value="emergency">Emergency Access</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Record Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="e.g., COVID-19 Vaccination Certificate"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="doctorId">Healthcare Provider</Label>
              <Select value={formData.doctorId} onValueChange={(value) => setFormData(prev => ({ ...prev, doctorId: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select provider (optional)" />
                </SelectTrigger>
                <SelectContent>
                  {mockDoctors.map((doctor) => (
                    <SelectItem key={doctor.id} value={doctor.id}>
                      {doctor.name} - {doctor.specialization}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="recordDate">Record Date *</Label>
              <Input
                id="recordDate"
                type="date"
                value={formData.recordDate}
                onChange={(e) => setFormData(prev => ({ ...prev, recordDate: e.target.value }))}
                max={new Date().toISOString().split('T')[0]}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="expiryDate">Expiry Date (if applicable)</Label>
            <Input
              id="expiryDate"
              type="date"
              value={formData.expiryDate}
              onChange={(e) => setFormData(prev => ({ ...prev, expiryDate: e.target.value }))}
              min={new Date().toISOString().split('T')[0]}
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
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input
              id="tags"
              value={formData.tags}
              onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
              placeholder="e.g., annual, routine, follow-up"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="file">Upload Documents</Label>
            <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center">
              <input
                type="file"
                id="fileInput"
                multiple
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files) {
                    setSelectedFiles(Array.from(e.target.files));
                  }
                }}
              />
              <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground mb-2">
                Drag and drop files here, or click to browse
              </p>
              <p className="text-xs text-muted-foreground mb-3">
                Supports PDF, JPG, PNG, DOC files (Max 10MB each)
              </p>
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={() => document.getElementById('fileInput')?.click()}
              >
                Choose Files
              </Button>
            </div>
            {selectedFiles.length > 0 && (
              <div className="mt-3 space-y-2">
                <p className="text-sm font-medium">{selectedFiles.length} file(s) selected:</p>
                <div className="space-y-1">
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between text-sm p-2 bg-muted rounded">
                      <span className="truncate">{file.name}</span>
                      <span className="text-muted-foreground ml-2">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Any additional information or notes about this record"
              rows={2}
            />
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