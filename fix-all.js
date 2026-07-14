import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://htlikyvrtujtizdlmgew.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0bGlreXZydHVqdGl6ZGxtZ2V3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIyODM4MDUsImV4cCI6MjA5Nzg1OTgwNX0.H6q1_WQ1jPgH3kvSniPyfm9XeQAezckNsTCY_-j0viw';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function fixAll() {
  console.log('=== STEP 1: Seeding Roles ===');
  
  const roles = [
    { id: 1, name: 'super_admin', description: 'Manajemen user dan data aplikasi' },
    { id: 2, name: 'ketua', description: 'Menyetujui surat, upload TTD' },
    { id: 3, name: 'sekretaris', description: 'Proses surat, upload TTD + stempel' },
    { id: 4, name: 'anggota', description: 'Mengajukan surat, lihat riwayat' },
  ];

  const { data: rolesData, error: rolesError } = await supabase
    .from('roles')
    .upsert(roles, { onConflict: 'id' })
    .select();

  if (rolesError) {
    console.error('Roles seeding FAILED:', rolesError.message, rolesError.code, rolesError.details);
    console.log('\nThis likely means you need to re-run the SQL schema in the Supabase SQL Editor.');
    console.log('Or RLS is blocking inserts. Let me try a workaround...\n');
  } else {
    console.log('Roles seeded:', rolesData);
  }

  // Verify roles
  const { data: checkRoles } = await supabase.from('roles').select('*');
  console.log('Roles in database:', checkRoles);

  console.log('\n=== STEP 2: Seeding Articles ===');
  
  const articles = [
    { id: 1, title: 'Kegiatan Kajian Rutin', slug: 'kegiatan-kajian-rutin', date: '2026-01-15', author: 'Admin', category: 'Kegiatan', content: 'Kajian rutin mingguan untuk meningkatkan wawasan keislaman.', status: 'Published' },
    { id: 2, title: 'Pelatihan Kepemimpinan', slug: 'pelatihan-kepemimpinan', date: '2026-02-10', author: 'Admin', category: 'Kegiatan', content: 'Program kepemimpinan untuk pelajar aktif.', status: 'Published' },
    { id: 3, title: 'Bakti Sosial Pelajar', slug: 'bakti-social-pelajar', date: '2026-03-05', author: 'Admin', category: 'Sosial', content: 'Kegiatan sosial untuk membantu masyarakat sekitar.', status: 'Published' },
  ];

  const { data: articlesData, error: articlesError } = await supabase
    .from('articles')
    .upsert(articles, { onConflict: 'id' })
    .select();

  if (articlesError) {
    console.error('Articles seeding FAILED:', articlesError.message);
  } else {
    console.log('Articles seeded:', articlesData?.length, 'rows');
  }

  console.log('\n=== STEP 3: Login and Create Profile ===');
  
  const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
    email: 'admin@example.com',
    password: 'password',
  });

  if (loginError) {
    console.error('Login FAILED:', loginError.message);
    return;
  }

  console.log('Login SUCCESS! User:', loginData.user.id);

  // Check if profile already exists
  const { data: existingProfile } = await supabase
    .from('users')
    .select('*')
    .eq('id', loginData.user.id)
    .maybeSingle();

  if (existingProfile) {
    console.log('Profile already exists:', existingProfile);
  } else {
    console.log('No profile found. Creating...');
    const meta = loginData.user.user_metadata;
    const { data: newProfile, error: profileError } = await supabase
      .from('users')
      .insert({
        id: loginData.user.id,
        name: meta.name || 'Admin',
        email: loginData.user.email,
        role_id: meta.role_id || 1,
        nia: meta.nia || '00000',
        phone: meta.phone || '',
      })
      .select('*, roles(name)')
      .single();

    if (profileError) {
      console.error('Profile creation FAILED:', profileError.message, profileError.code, profileError.details);
    } else {
      console.log('Profile created:', newProfile);
    }
  }

  // Create profiles for other users too
  console.log('\n=== STEP 4: Signing out and logging in as other users to create their profiles ===');
  await supabase.auth.signOut();

  const otherUsers = [
    { email: 'ketua@example.com', password: 'password' },
    { email: 'sekretaris@example.com', password: 'password' },
    { email: 'anggota@example.com', password: 'password' },
  ];

  for (const u of otherUsers) {
    const { data: ld, error: le } = await supabase.auth.signInWithPassword(u);
    if (le) {
      console.error(`Login ${u.email} FAILED:`, le.message);
      continue;
    }
    console.log(`Login ${u.email} OK - ID: ${ld.user.id}`);

    const { data: ep } = await supabase.from('users').select('*').eq('id', ld.user.id).maybeSingle();
    if (ep) {
      console.log(`  Profile already exists for ${u.email}`);
    } else {
      const meta = ld.user.user_metadata;
      const { error: ie } = await supabase.from('users').insert({
        id: ld.user.id,
        name: meta.name || u.email.split('@')[0],
        email: ld.user.email,
        role_id: meta.role_id || 4,
        nia: meta.nia || null,
        phone: meta.phone || null,
      });
      if (ie) {
        console.error(`  Profile creation FAILED for ${u.email}:`, ie.message);
      } else {
        console.log(`  Profile created for ${u.email}`);
      }
    }

    await supabase.auth.signOut();
  }

  console.log('\n=== DONE ===');
  // Final check
  const { data: allRoles } = await supabase.from('roles').select('*');
  const { data: allUsers } = await supabase.from('users').select('*, roles(name)');
  const { data: allArticles } = await supabase.from('articles').select('id, title');
  console.log('Roles:', JSON.stringify(allRoles));
  console.log('Users:', JSON.stringify(allUsers));
  console.log('Articles:', JSON.stringify(allArticles));
}

fixAll();
