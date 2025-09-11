-- First, create user profiles table with proper role verification
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  role TEXT NOT NULL CHECK (role IN ('patient', 'healthcare_provider', 'admin')),
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create healthcare providers table for verified medical professionals
CREATE TABLE public.healthcare_providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  license_number TEXT NOT NULL UNIQUE,
  specialization TEXT NOT NULL,
  hospital_affiliation TEXT,
  verification_status TEXT NOT NULL DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
  verification_date TIMESTAMP WITH TIME ZONE,
  verified_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.healthcare_providers ENABLE ROW LEVEL SECURITY;

-- Create security definer function to get user role
CREATE OR REPLACE FUNCTION public.get_user_role(user_uuid UUID)
RETURNS TEXT
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT role FROM public.profiles WHERE id = user_uuid;
$$;

-- Create security definer function to check if user is verified healthcare provider
CREATE OR REPLACE FUNCTION public.is_verified_healthcare_provider(user_uuid UUID)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.profiles p
    JOIN public.healthcare_providers hp ON p.id = hp.user_id
    WHERE p.id = user_uuid 
    AND p.role = 'healthcare_provider' 
    AND p.is_verified = true 
    AND hp.verification_status = 'verified'
  );
$$;

-- Profiles table policies
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = id);

CREATE POLICY "Verified healthcare providers can view patient profiles" 
ON public.profiles 
FOR SELECT 
USING (public.is_verified_healthcare_provider(auth.uid()) AND role = 'patient');

-- Healthcare providers table policies
CREATE POLICY "Users can view their own healthcare provider record" 
ON public.healthcare_providers 
FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own healthcare provider record" 
ON public.healthcare_providers 
FOR INSERT 
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can manage healthcare provider verifications" 
ON public.healthcare_providers 
FOR ALL 
USING (public.get_user_role(auth.uid()) = 'admin');

-- Drop the insecure existing policies on medical_records
DROP POLICY IF EXISTS "Doctors can view their patient records" ON public.medical_records;
DROP POLICY IF EXISTS "Healthcare providers can insert medical records" ON public.medical_records;
DROP POLICY IF EXISTS "Patients and doctors can update records" ON public.medical_records;

-- Create secure policies for medical_records
CREATE POLICY "Patients can view their own medical records" 
ON public.medical_records 
FOR SELECT 
USING (patient_id = auth.uid());

CREATE POLICY "Patients can insert their own medical records" 
ON public.medical_records 
FOR INSERT 
WITH CHECK (patient_id = auth.uid());

CREATE POLICY "Patients can update their own medical records" 
ON public.medical_records 
FOR UPDATE 
USING (patient_id = auth.uid());

CREATE POLICY "Verified healthcare providers can view all medical records" 
ON public.medical_records 
FOR SELECT 
USING (public.is_verified_healthcare_provider(auth.uid()));

CREATE POLICY "Verified healthcare providers can insert medical records" 
ON public.medical_records 
FOR INSERT 
WITH CHECK (public.is_verified_healthcare_provider(auth.uid()));

CREATE POLICY "Verified healthcare providers can update medical records" 
ON public.medical_records 
FOR UPDATE 
USING (public.is_verified_healthcare_provider(auth.uid()));

-- Fix appointments table policies similarly
DROP POLICY IF EXISTS "Healthcare providers can manage appointments" ON public.appointments;

CREATE POLICY "Verified healthcare providers can manage appointments" 
ON public.appointments 
FOR ALL 
USING (public.is_verified_healthcare_provider(auth.uid()));

-- Update patients table policies
DROP POLICY IF EXISTS "Healthcare providers can view patient profiles" ON public.patients;

CREATE POLICY "Verified healthcare providers can view patient profiles" 
ON public.patients 
FOR SELECT 
USING (public.is_verified_healthcare_provider(auth.uid()));

-- Create function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, role)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', ''),
    new.email,
    COALESCE(new.raw_user_meta_data->>'role', 'patient')
  );
  RETURN new;
END;
$$;

-- Trigger to create profile when user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Create indexes for performance
CREATE INDEX idx_profiles_role ON public.profiles(role);
CREATE INDEX idx_healthcare_providers_verification ON public.healthcare_providers(verification_status);
CREATE INDEX idx_medical_records_patient_id ON public.medical_records(patient_id);
CREATE INDEX idx_appointments_patient_id ON public.appointments(patient_id);

-- Add comments for security documentation
COMMENT ON FUNCTION public.is_verified_healthcare_provider IS 'Security function to verify healthcare provider credentials and verification status';
COMMENT ON FUNCTION public.get_user_role IS 'Security function to get authenticated user role';
COMMENT ON TABLE public.healthcare_providers IS 'Verified healthcare providers with proper credential verification';
COMMENT ON TABLE public.profiles IS 'User profiles with role-based access control';