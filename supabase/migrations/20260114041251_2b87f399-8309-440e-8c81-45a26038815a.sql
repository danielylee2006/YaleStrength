-- Create enum for lift types
CREATE TYPE public.lift_type AS ENUM ('bench', 'squat', 'deadlift');

-- Create enum for lift verification status
CREATE TYPE public.lift_status AS ENUM ('pending', 'verified', 'rejected');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  class_year INTEGER,
  college TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create lifts table
CREATE TABLE public.lifts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  lift_type lift_type NOT NULL,
  weight INTEGER NOT NULL CHECK (weight > 0),
  video_url TEXT,
  status lift_status NOT NULL DEFAULT 'pending',
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  verified_at TIMESTAMP WITH TIME ZONE,
  notes TEXT
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lifts ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
ON public.profiles FOR SELECT
USING (true);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = id);

-- Lifts policies
CREATE POLICY "Lifts are viewable by everyone"
ON public.lifts FOR SELECT
USING (true);

CREATE POLICY "Users can insert their own lifts"
ON public.lifts FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own lifts"
ON public.lifts FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own lifts"
ON public.lifts FOR DELETE
USING (auth.uid() = user_id);

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Trigger for profiles updated_at
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Function to create profile on signup (validates Yale email)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if email ends with @yale.edu
  IF NEW.email NOT LIKE '%@yale.edu' THEN
    RAISE EXCEPTION 'Only Yale email addresses (@yale.edu) are allowed';
  END IF;
  
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger for auto-creating profile on signup
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();

-- Create storage bucket for lift videos
INSERT INTO storage.buckets (id, name, public)
VALUES ('lift-videos', 'lift-videos', true);

-- Storage policies for lift videos
CREATE POLICY "Anyone can view lift videos"
ON storage.objects FOR SELECT
USING (bucket_id = 'lift-videos');

CREATE POLICY "Authenticated users can upload lift videos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'lift-videos' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update their own videos"
ON storage.objects FOR UPDATE
USING (bucket_id = 'lift-videos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own videos"
ON storage.objects FOR DELETE
USING (bucket_id = 'lift-videos' AND auth.uid()::text = (storage.foldername(name))[1]);