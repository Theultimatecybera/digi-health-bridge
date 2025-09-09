export interface User {
  id: string;
  name: string;
  email: string;
  role: 'worker' | 'doctor';
  phone?: string;
  profileImage?: string;
  workerDetails?: WorkerDetails;
  doctorDetails?: DoctorDetails;
}

export interface WorkerDetails {
  healthId: string;
  dateOfBirth: string;
  nationality: string;
  emergencyContact: string;
  bloodGroup: string;
  allergies: string[];
}

export interface DoctorDetails {
  licenseNumber: string;
  specialization: string;
  hospital: string;
  experience: number;
}

export interface HealthRecord {
  id: string;
  workerId: string;
  type: 'vaccination' | 'prescription' | 'checkup' | 'report' | 'certificate';
  title: string;
  description: string;
  doctorName: string;
  doctorId?: string;
  date: string;
  fileUrl?: string;
  status: 'pending' | 'approved' | 'completed';
  category: string;
}

export interface Appointment {
  id: string;
  workerId: string;
  doctorId: string;
  workerName: string;
  doctorName: string;
  date: string;
  time: string;
  type: string;
  status: 'pending' | 'approved' | 'completed' | 'cancelled';
  notes?: string;
}

export interface Language {
  code: 'en' | 'hi';
  name: string;
  nativeName: string;
}

export interface Translations {
  [key: string]: {
    en: string;
    hi: string;
  };
}