-- 1. Hapus user lama jika ada (untuk menghindari konflik email / uuid)
DELETE FROM auth.users WHERE email IN ('admin@example.com', 'ketua@example.com', 'sekretaris@example.com', 'anggota@example.com');

-- 2. Pastikan extension pgcrypto aktif untuk enkripsi password
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 3. Tambah Admin (admin@example.com / admin123)
DO $$ 
DECLARE 
    v_user_id UUID := gen_random_uuid();
    v_email TEXT := 'admin@example.com';
BEGIN
    INSERT INTO auth.users (
        id, instance_id, aud, role, email, encrypted_password, 
        email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
        confirmation_token, email_change, email_change_token_new, recovery_token
    ) VALUES (
        v_user_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 
        v_email, crypt('admin123', gen_salt('bf')), NOW(),
        '{"provider":"email","providers":["email"]}',
        '{"name":"Super Admin","role_id":1,"nia":"00000","phone":"08123456789"}', NOW(), NOW(),
        '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) VALUES (
        gen_random_uuid()::text, v_user_id, v_user_id::text, 
        json_build_object('sub', v_user_id::text, 'email', v_email)::jsonb,
        'email', NOW(), NOW(), NOW()
    );
END $$;

-- 4. Tambah Ketua (ketua@example.com / ketua123)
DO $$ 
DECLARE 
    v_user_id UUID := gen_random_uuid();
    v_email TEXT := 'ketua@example.com';
BEGIN
    INSERT INTO auth.users (
        id, instance_id, aud, role, email, encrypted_password, 
        email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
        confirmation_token, email_change, email_change_token_new, recovery_token
    ) VALUES (
        v_user_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 
        v_email, crypt('ketua123', gen_salt('bf')), NOW(),
        '{"provider":"email","providers":["email"]}',
        '{"name":"Wildan","role_id":2,"nia":"11111","phone":"08123456781"}', NOW(), NOW(),
        '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) VALUES (
        gen_random_uuid()::text, v_user_id, v_user_id::text, 
        json_build_object('sub', v_user_id::text, 'email', v_email)::jsonb,
        'email', NOW(), NOW(), NOW()
    );
END $$;

-- 5. Tambah Sekretaris (sekretaris@example.com / sekretaris123)
DO $$ 
DECLARE 
    v_user_id UUID := gen_random_uuid();
    v_email TEXT := 'sekretaris@example.com';
BEGIN
    INSERT INTO auth.users (
        id, instance_id, aud, role, email, encrypted_password, 
        email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
        confirmation_token, email_change, email_change_token_new, recovery_token
    ) VALUES (
        v_user_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 
        v_email, crypt('sekretaris123', gen_salt('bf')), NOW(),
        '{"provider":"email","providers":["email"]}',
        '{"name":"Ahmad Fauzi","role_id":3,"nia":"22222","phone":"08123456782"}', NOW(), NOW(),
        '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) VALUES (
        gen_random_uuid()::text, v_user_id, v_user_id::text, 
        json_build_object('sub', v_user_id::text, 'email', v_email)::jsonb,
        'email', NOW(), NOW(), NOW()
    );
END $$;

-- 6. Tambah Anggota (anggota@example.com / anggota123)
DO $$ 
DECLARE 
    v_user_id UUID := gen_random_uuid();
    v_email TEXT := 'anggota@example.com';
BEGIN
    INSERT INTO auth.users (
        id, instance_id, aud, role, email, encrypted_password, 
        email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
        confirmation_token, email_change, email_change_token_new, recovery_token
    ) VALUES (
        v_user_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 
        v_email, crypt('anggota123', gen_salt('bf')), NOW(),
        '{"provider":"email","providers":["email"]}',
        '{"name":"Budi Santoso","role_id":4,"nia":"12345","phone":"08123456789"}', NOW(), NOW(),
        '', '', '', ''
    );

    INSERT INTO auth.identities (
        id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
    ) VALUES (
        gen_random_uuid()::text, v_user_id, v_user_id::text, 
        json_build_object('sub', v_user_id::text, 'email', v_email)::jsonb,
        'email', NOW(), NOW(), NOW()
    );
END $$;
