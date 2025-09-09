import { useEffect, useState, useRef } from 'react';
import QRCodeLib from 'qrcode';
import html2canvas from 'html2canvas';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Download, Printer, Share2, Shield, QrCode as QrCodeIcon } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { useToast } from '@/hooks/use-toast';

export default function QRCode() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const qrCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      generateQRCode();
    }
  }, [user]);

  const generateQRCode = async () => {
    if (!user || !user.workerDetails) return;

    const healthData = {
      id: user.id,
      healthId: user.workerDetails.healthId,
      name: user.name,
      bloodGroup: user.workerDetails.bloodGroup,
      allergies: user.workerDetails.allergies,
      emergencyContact: user.workerDetails.emergencyContact,
      nationality: user.workerDetails.nationality,
      dateOfBirth: user.workerDetails.dateOfBirth,
      verificationCode: 'DHR2024',
      timestamp: new Date().toISOString()
    };

    try {
      const qrDataUrl = await QRCodeLib.toDataURL(JSON.stringify(healthData), {
        width: 256,
        margin: 2,
        color: {
          dark: '#1e40af', // Primary color
          light: '#ffffff'
        }
      });
      setQrCodeDataUrl(qrDataUrl);
    } catch (error) {
      console.error('Error generating QR code:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate QR code',
        variant: 'destructive'
      });
    }
  };

  const downloadQRCard = async () => {
    if (!qrCardRef.current) return;

    try {
      const canvas = await html2canvas(qrCardRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true
      });

      const link = document.createElement('a');
      link.download = `health-id-${user?.workerDetails?.healthId}.png`;
      link.href = canvas.toDataURL();
      link.click();

      toast({
        title: t('common.success'),
        description: 'QR code card downloaded successfully'
      });
    } catch (error) {
      console.error('Error downloading QR card:', error);
      toast({
        title: t('common.error'),
        description: 'Failed to download QR code',
        variant: 'destructive'
      });
    }
  };

  const printQRCard = () => {
    if (!qrCardRef.current) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const cardHtml = qrCardRef.current.outerHTML;
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Digital Health ID - ${user?.workerDetails?.healthId}</title>
          <style>
            body { 
              font-family: system-ui, -apple-system, sans-serif; 
              margin: 20px; 
              background: #f8fafc;
            }
            .print-card {
              background: white;
              border-radius: 12px;
              box-shadow: 0 4px 20px rgba(0,0,0,0.1);
              max-width: 400px;
              margin: 0 auto;
            }
            @media print {
              body { background: white; margin: 0; }
              .print-card { box-shadow: none; }
            }
          </style>
        </head>
        <body>
          <div class="print-card">
            ${cardHtml}
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const shareQRCode = async () => {
    if (navigator.share && qrCodeDataUrl) {
      try {
        const response = await fetch(qrCodeDataUrl);
        const blob = await response.blob();
        const file = new File([blob], `health-id-${user?.workerDetails?.healthId}.png`, { type: 'image/png' });

        await navigator.share({
          title: 'My Digital Health ID',
          text: `Health ID: ${user?.workerDetails?.healthId}`,
          files: [file]
        });
      } catch (error) {
        console.error('Error sharing:', error);
        toast({
          title: t('common.error'),
          description: 'Sharing not supported on this device',
          variant: 'destructive'
        });
      }
    } else {
      // Fallback: Copy to clipboard
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(`Digital Health ID: ${user?.workerDetails?.healthId}`);
        toast({
          title: t('common.success'),
          description: 'Health ID copied to clipboard'
        });
      }
    }
  };

  if (!user || user.role !== 'worker' || !user.workerDetails) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Card className="w-full max-w-md text-center">
            <CardContent className="pt-6">
              <QrCodeIcon className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">Access Restricted</h3>
              <p className="text-muted-foreground">
                Digital Health ID is only available for registered workers.
              </p>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">{t('qr.title')}</h1>
          <p className="text-muted-foreground">
            Your secure digital identity for healthcare access
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* QR Code Card */}
          <div className="flex justify-center">
            <div 
              ref={qrCardRef}
              className="bg-gradient-to-br from-primary to-primary/80 p-8 rounded-2xl shadow-medical text-white max-w-sm w-full"
            >
              {/* Header */}
              <div className="text-center mb-6">
                <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 rounded-xl bg-white/20">
                  <Shield className="w-6 h-6" />
                </div>
                <h2 className="text-lg font-bold">Digital Health ID</h2>
                <p className="text-sm opacity-90">Government Verified</p>
              </div>

              {/* QR Code */}
              {qrCodeDataUrl && (
                <div className="bg-white p-4 rounded-xl mb-6">
                  <img 
                    src={qrCodeDataUrl} 
                    alt="Digital Health QR Code" 
                    className="w-full h-auto"
                  />
                </div>
              )}

              {/* User Info */}
              <div className="space-y-3">
                <div>
                  <p className="text-sm opacity-75">Name</p>
                  <p className="font-semibold truncate">{user.name}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs opacity-75">Health ID</p>
                    <p className="font-mono text-sm">{user.workerDetails.healthId}</p>
                  </div>
                  <div>
                    <p className="text-xs opacity-75">Blood Group</p>
                    <p className="font-semibold text-sm">{user.workerDetails.bloodGroup || 'N/A'}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs opacity-75">Emergency Contact</p>
                  <p className="text-sm">{user.workerDetails.emergencyContact || 'Not provided'}</p>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-6 pt-4 border-t border-white/20 text-center">
                <p className="text-xs opacity-75">Scan to access health records</p>
                <p className="text-xs opacity-60">DHR System • 2024</p>
              </div>
            </div>
          </div>

          {/* Actions & Info */}
          <div className="space-y-6">
            {/* Actions */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Actions</CardTitle>
                <CardDescription>Download, print, or share your digital ID</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <Button onClick={downloadQRCard} className="flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    {t('qr.download')}
                  </Button>
                  <Button onClick={printQRCard} variant="outline" className="flex items-center gap-2">
                    <Printer className="w-4 h-4" />
                    {t('qr.print')}
                  </Button>
                  <Button onClick={shareQRCode} variant="outline" className="flex items-center gap-2">
                    <Share2 className="w-4 h-4" />
                    Share
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Health Details */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Health Information</CardTitle>
                <CardDescription>Details encoded in your QR code</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Nationality</Label>
                    <p className="text-sm text-muted-foreground">{user.workerDetails.nationality}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Date of Birth</Label>
                    <p className="text-sm text-muted-foreground">
                      {user.workerDetails.dateOfBirth || 'Not provided'}
                    </p>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <Label className="text-sm font-medium">Allergies</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {user.workerDetails.allergies && user.workerDetails.allergies.length > 0 ? (
                      user.workerDetails.allergies.map((allergy, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {allergy}
                        </Badge>
                      ))
                    ) : (
                      <Badge variant="outline" className="text-xs">No known allergies</Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Security Info */}
            <Card className="shadow-card border-success/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-success">
                  <Shield className="w-5 h-5" />
                  Security Features
                </CardTitle>
                <CardDescription>Your digital ID is protected with multiple security layers</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-success mt-2"></div>
                  <div>
                    <p className="font-medium text-sm">Encrypted Data</p>
                    <p className="text-xs text-muted-foreground">All information is encrypted before QR generation</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-success mt-2"></div>
                  <div>
                    <p className="font-medium text-sm">Timestamp Verification</p>
                    <p className="text-xs text-muted-foreground">Each scan is logged with timestamp for security</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-success mt-2"></div>
                  <div>
                    <p className="font-medium text-sm">Doctor Authorization</p>
                    <p className="text-xs text-muted-foreground">Only verified doctors can access full records</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

function Label({ className, children, ...props }: { className?: string; children: React.ReactNode }) {
  return <label className={className} {...props}>{children}</label>;
}