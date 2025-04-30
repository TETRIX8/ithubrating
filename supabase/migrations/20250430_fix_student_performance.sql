
-- First, let's modify student_profiles to add description field if it doesn't exist
ALTER TABLE IF EXISTS public.student_profiles 
ADD COLUMN IF NOT EXISTS description TEXT;

-- Next, let's make sure student_performance table has the structure we need
-- If it exists, we'll drop and recreate it with the right schema
DROP TABLE IF EXISTS public.student_performance;

CREATE TABLE public.student_performance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id TEXT NOT NULL,
    attendance_percent NUMERIC NOT NULL,
    average_grade NUMERIC NOT NULL,
    score_points NUMERIC NOT NULL,
    max_score_points NUMERIC NOT NULL,
    study_period_name TEXT NOT NULL,
    study_period_status TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add unique constraint on student_id to support our upsert operation
ALTER TABLE public.student_performance ADD CONSTRAINT student_performance_student_id_key UNIQUE (student_id);

-- Enable Row Level Security
ALTER TABLE public.student_performance ENABLE ROW LEVEL SECURITY;

-- Create RLS policy to allow all operations for now
CREATE POLICY "Allow full access to student_performance"
ON public.student_performance
FOR ALL 
TO authenticated, anon
USING (true)
WITH CHECK (true);
