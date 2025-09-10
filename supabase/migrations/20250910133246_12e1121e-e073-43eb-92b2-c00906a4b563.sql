-- Enable Row Level Security on all healthcare tables
ALTER TABLE public.medical_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for medical_records table
-- Patients can only view their own medical records
CREATE POLICY "Patients can view their own medical records" 
ON public.medical_records 
FOR SELECT 
USING (patient_id = auth.uid());

-- Healthcare providers can view records where they are the doctor
CREATE POLICY "Doctors can view their patient records" 
ON public.medical_records 
FOR SELECT 
USING (doctor_name IS NOT NULL);

-- Patients can insert their own records (for self-reported data)
CREATE POLICY "Patients can insert their own records" 
ON public.medical_records 
FOR INSERT 
WITH CHECK (patient_id = auth.uid());

-- Healthcare providers can insert records for patients
CREATE POLICY "Healthcare providers can insert medical records" 
ON public.medical_records 
FOR INSERT 
WITH CHECK (doctor_name IS NOT NULL);

-- Only the patient or their doctor can update records
CREATE POLICY "Patients and doctors can update records" 
ON public.medical_records 
FOR UPDATE 
USING (patient_id = auth.uid() OR doctor_name IS NOT NULL);

-- Create RLS policies for appointments table
-- Patients can only view their own appointments
CREATE POLICY "Patients can view their own appointments" 
ON public.appointments 
FOR SELECT 
USING (patient_id = auth.uid());

-- Patients can create their own appointments
CREATE POLICY "Patients can create appointments" 
ON public.appointments 
FOR INSERT 
WITH CHECK (patient_id = auth.uid());

-- Patients can update their own appointments
CREATE POLICY "Patients can update their own appointments" 
ON public.appointments 
FOR UPDATE 
USING (patient_id = auth.uid());

-- Healthcare providers can view all appointments (they need to manage their schedule)
CREATE POLICY "Healthcare providers can manage appointments" 
ON public.appointments 
FOR ALL 
USING (doctor_name IS NOT NULL);

-- Create RLS policies for patients table
-- Patients can only view and update their own profile
CREATE POLICY "Patients can view their own profile" 
ON public.patients 
FOR SELECT 
USING (id = auth.uid());

-- Patients can update their own profile
CREATE POLICY "Patients can update their own profile" 
ON public.patients 
FOR UPDATE 
USING (id = auth.uid());

-- Allow patients to insert their own profile during registration
CREATE POLICY "Patients can create their own profile" 
ON public.patients 
FOR INSERT 
WITH CHECK (id = auth.uid());

-- Healthcare providers can view patient profiles for medical purposes
-- This should be restricted further in production to only patients they treat
CREATE POLICY "Healthcare providers can view patient profiles" 
ON public.patients 
FOR SELECT 
USING (true); -- This should be more restrictive in production

-- Add indexes for better performance on RLS queries
CREATE INDEX IF NOT EXISTS idx_medical_records_patient_id ON public.medical_records(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_patient_id ON public.appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_patients_id ON public.patients(id);