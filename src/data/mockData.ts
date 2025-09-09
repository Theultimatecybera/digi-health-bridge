import { HealthRecord, Appointment } from '@/types';

export const mockHealthRecords: HealthRecord[] = [
  {
    id: '1',
    workerId: '1',
    type: 'vaccination',
    title: 'COVID-19 Vaccination',
    description: 'Second dose of Covishield vaccine administered',
    doctorName: 'Dr. प्रिया शर्मा',
    doctorId: '2',
    date: '2024-01-15',
    status: 'completed',
    category: 'Vaccination'
  },
  {
    id: '2',
    workerId: '1',
    type: 'checkup',
    title: 'Annual Health Checkup',
    description: 'Complete blood count, BP monitoring, general examination',
    doctorName: 'Dr. अमित पटेल',
    date: '2024-02-20',
    status: 'completed',
    category: 'Preventive Care'
  },
  {
    id: '3',
    workerId: '1',
    type: 'prescription',
    title: 'Fever and Cough Treatment',
    description: 'Prescribed medication for viral fever and persistent cough',
    doctorName: 'Dr. प्रिया शर्मा',
    doctorId: '2',
    date: '2024-03-05',
    status: 'completed',
    category: 'Treatment'
  },
  {
    id: '4',
    workerId: '1',
    type: 'certificate',
    title: 'Fit for Work Certificate',
    description: 'Medical certificate confirming fitness for construction work',
    doctorName: 'Dr. राजेश गुप्ता',
    date: '2024-03-10',
    status: 'approved',
    category: 'Certification'
  },
  {
    id: '5',
    workerId: '1',
    type: 'report',
    title: 'X-Ray Report - Chest',
    description: 'Chest X-ray showing clear lungs, no abnormalities detected',
    doctorName: 'Dr. सुनीता वर्मा',
    date: '2024-03-12',
    status: 'completed',
    category: 'Diagnostic'
  }
];

export const mockAppointments: Appointment[] = [
  {
    id: '1',
    workerId: '1',
    doctorId: '2',
    workerName: 'राम कुमार',
    doctorName: 'Dr. प्रिया शर्मा',
    date: '2024-03-25',
    time: '10:00 AM',
    type: 'General Consultation',
    status: 'approved',
    notes: 'Follow-up for previous treatment'
  },
  {
    id: '2',
    workerId: '1',
    doctorId: '3',
    workerName: 'राम कुमार',
    doctorName: 'Dr. अमित पटेल',
    date: '2024-03-28',
    time: '2:30 PM',
    type: 'Health Checkup',
    status: 'pending'
  },
  {
    id: '3',
    workerId: '1',
    doctorId: '2',
    workerName: 'राम कुमार',
    doctorName: 'Dr. प्रिया शर्मा',
    date: '2024-04-05',
    time: '9:15 AM',
    type: 'Vaccination',
    status: 'pending',
    notes: 'Hepatitis B vaccination due'
  }
];

export const mockDoctors = [
  {
    id: '2',
    name: 'Dr. प्रिया शर्मा',
    specialization: 'General Medicine',
    hospital: 'City General Hospital',
    experience: '8 years'
  },
  {
    id: '3',
    name: 'Dr. अमित पटेल',
    specialization: 'Internal Medicine',
    hospital: 'Metro Health Center',
    experience: '12 years'
  },
  {
    id: '4',
    name: 'Dr. राजेश गुप्ता',
    specialization: 'Occupational Health',
    hospital: 'Workers Health Clinic',
    experience: '15 years'
  }
];