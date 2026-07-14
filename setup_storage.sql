-- 1. Buat bucket baru bernama 'documents' dan set menjadi publik
INSERT INTO storage.buckets (id, name, public) 
VALUES ('documents', 'documents', true);

-- 2. Buat policy agar semua orang bisa melihat gambar/file (READ)
CREATE POLICY "Public Access" 
ON storage.objects FOR SELECT 
USING ( bucket_id = 'documents' );

-- 3. Buat policy agar bisa upload (INSERT)
CREATE POLICY "Allow Uploads" 
ON storage.objects FOR INSERT 
WITH CHECK ( bucket_id = 'documents' );

-- 4. Buat policy agar bisa update/delete file (opsional)
CREATE POLICY "Allow Updates" 
ON storage.objects FOR UPDATE 
USING ( bucket_id = 'documents' );

CREATE POLICY "Allow Deletes" 
ON storage.objects FOR DELETE 
USING ( bucket_id = 'documents' );
