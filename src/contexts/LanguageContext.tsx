import React, { createContext, useContext, useState } from 'react';
import { Language, Translations } from '@/types';

interface LanguageContextType {
  currentLanguage: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const languages: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' }
];

const translations: Translations = {
  // Navigation
  'nav.dashboard': { en: 'Dashboard', hi: 'डैशबोर्ड' },
  'nav.records': { en: 'Health Records', hi: 'स्वास्थ्य रिकॉर्ड' },
  'nav.qrcode': { en: 'Digital ID', hi: 'डिजिटल पहचान' },
  'nav.appointments': { en: 'Appointments', hi: 'अपॉइंटमेंट' },
  'nav.profile': { en: 'Profile', hi: 'प्रोफाइल' },
  
  // Authentication
  'auth.login': { en: 'Login', hi: 'लॉगिन' },
  'auth.signup': { en: 'Sign Up', hi: 'साइन अप' },
  'auth.email': { en: 'Email', hi: 'ईमेल' },
  'auth.password': { en: 'Password', hi: 'पासवर्ड' },
  'auth.name': { en: 'Full Name', hi: 'पूरा नाम' },
  'auth.phone': { en: 'Phone Number', hi: 'फोन नंबर' },
  'auth.role.worker': { en: 'Health Worker', hi: 'स्वास्थ्य कार्यकर्ता' },
  'auth.role.doctor': { en: 'Doctor', hi: 'डॉक्टर' },
  
  // Dashboard
  'dashboard.welcome': { en: 'Welcome', hi: 'स्वागत है' },
  'dashboard.records.total': { en: 'Total Records', hi: 'कुल रिकॉर्ड' },
  'dashboard.appointments.upcoming': { en: 'Upcoming Appointments', hi: 'आगामी अपॉइंटमेंट' },
  'dashboard.health.id': { en: 'Health ID', hi: 'स्वास्थ्य पहचान' },
  
  // Records
  'records.upload': { en: 'Upload Record', hi: 'रिकॉर्ड अपलोड करें' },
  'records.type.vaccination': { en: 'Vaccination', hi: 'टीकाकरण' },
  'records.type.prescription': { en: 'Prescription', hi: 'नुस्खा' },
  'records.type.checkup': { en: 'Health Checkup', hi: 'स्वास्थ्य जांच' },
  'records.type.report': { en: 'Medical Report', hi: 'चिकित्सा रिपोर्ट' },
  'records.type.certificate': { en: 'Medical Certificate', hi: 'चिकित्सा प्रमाणपत्र' },
  
  // QR Code
  'qr.title': { en: 'Digital Health ID', hi: 'डिजिटल स्वास्थ्य पहचान' },
  'qr.download': { en: 'Download QR Code', hi: 'QR कोड डाउनलोड करें' },
  'qr.print': { en: 'Print', hi: 'प्रिंट करें' },
  
  // Appointments
  'appointments.book': { en: 'Book Appointment', hi: 'अपॉइंटमेंट बुक करें' },
  'appointments.status.pending': { en: 'Pending', hi: 'लंबित' },
  'appointments.status.approved': { en: 'Approved', hi: 'स्वीकृत' },
  'appointments.status.completed': { en: 'Completed', hi: 'पूर्ण' },
  'appointments.status.cancelled': { en: 'Cancelled', hi: 'रद्द' },
  
  // Common
  'common.save': { en: 'Save', hi: 'सेव करें' },
  'common.cancel': { en: 'Cancel', hi: 'रद्द करें' },
  'common.submit': { en: 'Submit', hi: 'जमा करें' },
  'common.loading': { en: 'Loading...', hi: 'लोड हो रहा है...' },
  'common.error': { en: 'Error', hi: 'त्रुटि' },
  'common.success': { en: 'Success', hi: 'सफलता' },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(languages[0]);

  const setLanguage = (language: Language) => {
    setCurrentLanguage(language);
    localStorage.setItem('preferredLanguage', language.code);
  };

  const t = (key: string): string => {
    return translations[key]?.[currentLanguage.code] || key;
  };

  return (
    <LanguageContext.Provider value={{
      currentLanguage,
      setLanguage,
      t
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export { languages };