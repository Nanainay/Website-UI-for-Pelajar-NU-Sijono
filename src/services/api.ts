import { supabase } from './supabase';

export function setToken(newToken: string | null) {
  if (newToken) {
    localStorage.setItem('jwt_token', newToken);
  } else {
    localStorage.removeItem('jwt_token');
  }
}

export function getToken() {
  return localStorage.getItem('jwt_token');
}

export const api = {
  // ==========================================
  // 1. SISTEM AUTENTIKASI (SUPABASE AUTH)
  // ==========================================
  
  login: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;

    const authUser = data.user;
    const meta = authUser.user_metadata || {};

    // Ambil profil pengguna lengkap beserta perannya dari tabel public.users
    let { data: userData, error: userError } = await supabase
      .from('users')
      .select('*, roles(name)')
      .eq('id', authUser.id)
      .maybeSingle();

    // Jika profil belum ada (trigger tidak berjalan), buat secara otomatis
    if (!userData && !userError) {
      const roleId = meta.role_id ? Number(meta.role_id) : 4;
      const { data: newProfile, error: insertError } = await supabase
        .from('users')
        .insert({
          id: authUser.id,
          name: meta.name || authUser.email?.split('@')[0] || 'User',
          email: authUser.email || email,
          role_id: roleId,
          nia: meta.nia || null,
          phone: meta.phone || null,
        })
        .select('*, roles(name)')
        .single();

      if (insertError) {
        console.error('Gagal membuat profil otomatis:', insertError.message);
        // Fallback: gunakan data dari auth metadata langsung
        const roleName = roleId === 1 ? 'super_admin' : roleId === 2 ? 'ketua' : roleId === 3 ? 'sekretaris' : 'anggota';
        const token = data.session?.access_token || '';
        setToken(token);
        return {
          token,
          user: {
            id: authUser.id,
            name: meta.name || 'User',
            email: authUser.email || email,
            role: roleName,
            nia: meta.nia || '',
            phone: meta.phone || ''
          }
        };
      }
      userData = newProfile;
    }

    if (userError) {
      console.error('Error fetching profile:', userError.message);
    }

    const token = data.session?.access_token || '';
    setToken(token);

    // Fallback jika userData masih null
    const roleName = userData?.roles?.name || (meta.role_id === 1 ? 'super_admin' : meta.role_id === 2 ? 'ketua' : meta.role_id === 3 ? 'sekretaris' : 'anggota');

    return {
      token,
      user: {
        id: userData?.id || authUser.id,
        name: userData?.name || meta.name || 'User',
        email: userData?.email || authUser.email || email,
        role: roleName,
        nia: userData?.nia || meta.nia || '',
        phone: userData?.phone || meta.phone || ''
      }
    };
  },

  logout: async () => {
    setToken(null);
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  me: async () => {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) throw new Error('Pengguna tidak terautentikasi');

    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*, roles(name)')
      .eq('id', user.id)
      .single();

    if (userError || !userData) {
      throw new Error(userError?.message || 'Profil pengguna tidak ditemukan');
    }

    return {
      user: {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        role: userData.roles?.name || 'anggota'
      }
    };
  },

  // ==========================================
  // 2. MANAJEMEN SURAT (LETTER WORKFLOW)
  // ==========================================

  getLetters: async (status?: string) => {
    let query = supabase
      .from('letter_requests')
      .select('*, users!fk_user(name, email, roles(name)), letter_documents(*)')
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;
    if (error) throw error;

    // Memetakan properti agar sesuai dengan format yang diharapkan oleh komponen React
    return data.map(item => {
      let actualPurpose = item.purpose;
      let actualName = item.users?.name || 'Unknown';
      if (actualPurpose && actualPurpose.startsWith('[NAMA: ')) {
        const match = actualPurpose.match(/\[NAMA: (.*?)\] (.*)/s);
        if (match) {
          actualName = match[1];
          actualPurpose = match[2];
        }
      }
      
      const docs = Array.isArray(item.letter_documents) ? item.letter_documents[0] : item.letter_documents;
      
      return {
        ...item,
        user_name: actualName,
        purpose: actualPurpose,
        user_email: item.users?.email || '',
        user_role: item.users?.roles?.name || 'anggota',
        letter_number: docs?.letter_number || item.letter_number,
        content: docs?.content || item.content,
        issue_date: docs?.issue_date || item.issue_date,
        sekretaris_signature: docs?.sekretaris_signature || item.sekretaris_signature,
        sekretaris_stamp: docs?.sekretaris_stamp || item.sekretaris_stamp,
        ketua_signature: docs?.ketua_signature || item.ketua_signature,
      };
    });
  },

  getMyLetters: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Pengguna tidak terautentikasi');

    const { data, error } = await supabase
      .from('letter_requests')
      .select('*, users!fk_user(name, email, roles(name)), letter_documents(*)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data.map(item => {
      let actualPurpose = item.purpose;
      let actualName = item.users?.name || 'Unknown';
      if (actualPurpose && actualPurpose.startsWith('[NAMA: ')) {
        const match = actualPurpose.match(/\[NAMA: (.*?)\] (.*)/s);
        if (match) {
          actualName = match[1];
          actualPurpose = match[2];
        }
      }
      
      const docs = Array.isArray(item.letter_documents) ? item.letter_documents[0] : item.letter_documents;
      
      return {
        ...item,
        user_name: actualName,
        purpose: actualPurpose,
        user_email: item.users?.email || '',
        user_role: item.users?.roles?.name || 'anggota',
        letter_number: docs?.letter_number || item.letter_number,
        content: docs?.content || item.content,
        issue_date: docs?.issue_date || item.issue_date,
        sekretaris_signature: docs?.sekretaris_signature || item.sekretaris_signature,
        sekretaris_stamp: docs?.sekretaris_stamp || item.sekretaris_stamp,
        ketua_signature: docs?.ketua_signature || item.ketua_signature,
      };
    });
  },

  getLetterById: async (id: number) => {
    const { data, error } = await supabase
      .from('letter_requests')
      .select('*, users!fk_user(name, email, roles(name)), letter_documents(*)')
      .eq('id', id)
      .single();

    if (error) throw error;

    let actualPurpose = data.purpose;
    let actualName = data.users?.name || 'Unknown';
    if (actualPurpose && actualPurpose.startsWith('[NAMA: ')) {
      const match = actualPurpose.match(/\[NAMA: (.*?)\] (.*)/s);
      if (match) {
        actualName = match[1];
        actualPurpose = match[2];
      }
    }

    const docs = Array.isArray(data.letter_documents) ? data.letter_documents[0] : data.letter_documents;
    
    return {
      ...data,
      user_name: actualName,
      purpose: actualPurpose,
      user_email: data.users?.email || '',
      user_role: data.users?.roles?.name || 'anggota',
      letter_number: docs?.letter_number || data.letter_number,
      content: docs?.content || data.content,
      issue_date: docs?.issue_date || data.issue_date,
      sekretaris_signature: docs?.sekretaris_signature || data.sekretaris_signature,
      sekretaris_stamp: docs?.sekretaris_stamp || data.sekretaris_stamp,
      ketua_signature: docs?.ketua_signature || data.ketua_signature,
    };
  },

  submitLetter: async (data: { type: string; purpose: string; phone: string; requestedName?: string }) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Pengguna tidak terautentikasi');

    const finalPurpose = data.requestedName 
      ? `[NAMA: ${data.requestedName}] ${data.purpose}` 
      : data.purpose;

    const { data: newLetter, error } = await supabase
      .from('letter_requests')
      .insert({
        user_id: user.id,
        type: data.type,
        purpose: finalPurpose,
        phone: data.phone,
        status: 'menunggu'
      })
      .select()
      .single();

    if (error) throw error;
    return { message: 'Pengajuan surat berhasil dikirim', id: newLetter.id };
  },

  prosesLetter: async (id: number, data: {
    letterNumber: string; content: string; issueDate: string;
    sekretarisSignature: string; sekretarisStamp: string;
  }) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Pengguna tidak terautentikasi');

    // 1. Perbarui status surat pengajuan menjadi menunggu tanda tangan ketua
    const { error: reqError } = await supabase
      .from('letter_requests')
      .update({ status: 'menunggu_ttd_ketua' })
      .eq('id', id);

    if (reqError) throw reqError;

    // 2. Buat atau perbarui detail dokumen surat resmi
    const { error: docError } = await supabase
      .from('letter_documents')
      .upsert({
        letter_id: id,
        letter_number: data.letterNumber,
        content: data.content,
        issue_date: data.issueDate,
        sekretaris_signature: data.sekretarisSignature,
        sekretaris_stamp: data.sekretarisStamp,
        processed_by_sekretaris: user.id
      }, { onConflict: 'letter_id' });

    if (docError) throw docError;

    return { message: 'Surat berhasil diproses oleh sekretaris' };
  },

  ttdKetuaLetter: async (id: number, data: { ketuaSignature: string }) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Pengguna tidak terautentikasi');

    // 1. Perbarui status surat menjadi selesai
    const { error: reqError } = await supabase
      .from('letter_requests')
      .update({ status: 'selesai' })
      .eq('id', id);

    if (reqError) throw reqError;

    // 2. Bubuhkan tanda tangan ketua dan catat ID penyetuju
    const { error: docError } = await supabase
      .from('letter_documents')
      .update({
        ketua_signature: data.ketuaSignature,
        approved_by_ketua: user.id
      })
      .eq('letter_id', id);

    if (docError) throw docError;

    return { message: 'Surat berhasil disetujui oleh ketua' };
  },

  tolakLetter: async (id: number, reason: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Pengguna tidak terautentikasi');

    const { error } = await supabase
      .from('letter_requests')
      .update({
        status: 'ditolak',
        rejection_reason: reason,
        rejected_by: user.id
      })
      .eq('id', id);

    if (error) throw error;
    return { message: 'Surat berhasil ditolak' };
  },

  selesaiLetter: async (id: number, data: { letterNumber: string }) => {
    const { error } = await supabase
      .from('letter_requests')
      .update({ status: 'selesai' })
      .eq('id', id);

    if (error) throw error;
    return { message: 'Status surat diubah menjadi selesai' };
  },

  // ==========================================
  // 3. MANAJEMEN USER (ADMIN PANEL)
  // ==========================================

  getUsers: async () => {
    const { data, error } = await supabase
      .from('users')
      .select('*, roles(name)')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data.map(item => ({
      ...item,
      role: item.roles?.name || 'anggota',
      last_sign_in_at: item.created_at, // Supabase tracks this in auth.users; using created_at as fallback
    }));
  },

  // Pendaftaran user baru dilakukan via Supabase Auth
  createUser: async (data: { name: string; email: string; password?: string; role_id: number; nia?: string; phone?: string }) => {
    // Sebagai admin, kita mendaftarkan user baru melalui method signUp. 
    // Data tambahan (role_id, nia, phone, name) dilewatkan sebagai user_metadata.
    // Trigger PostgreSQL di Supabase secara otomatis akan memindahkan data ini ke tabel public.users.
    // Simpan token admin saat ini agar tidak ter-logout jika Supabase menimpa sesi
    const currentSession = await supabase.auth.getSession();
    
    const { data: signUpData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password || 'password123', // password default
      options: {
        data: {
          name: data.name,
          role_id: data.role_id,
          nia: data.nia || '',
          phone: data.phone || ''
        }
      }
    });

    if (error) throw error;
    
    // Karena trigger PostgreSQL mungkin tidak ada/berjalan, 
    // kita masukkan secara manual ke tabel public.users agar langsung muncul di tabel Admin
    if (signUpData.user) {
      const { error: insertError } = await supabase
        .from('users')
        .insert({
          id: signUpData.user.id,
          name: data.name,
          email: data.email,
          role_id: data.role_id,
          nia: data.nia || null,
          phone: data.phone || null,
        });
        
      if (insertError) {
        console.error("Gagal insert ke tabel users:", insertError.message);
      }
    }
    
    // Kembalikan sesi admin jika ternyata tertimpa (karena SignUp di client sering otomatis login)
    if (currentSession.data.session && signUpData.session && currentSession.data.session.user.id !== signUpData.session.user.id) {
       await supabase.auth.setSession(currentSession.data.session);
    }

    return { message: 'Pengguna berhasil dibuat', id: signUpData.user?.id || 0 };
  },

  updateUserRole: async (id: string | number, role_id: number) => {
    const { error } = await supabase
      .from('users')
      .update({ role_id })
      .eq('id', id);

    if (error) throw error;
    return { message: 'Peran pengguna berhasil diperbarui' };
  },

  updateUser: async (id: string | number, data: any) => {
    const { error } = await supabase
      .from('users')
      .update(data)
      .eq('id', id);

    if (error) throw error;
    return { message: 'Data pengguna berhasil diperbarui' };
  },

  deleteUser: async (id: string | number) => {
    // Catatan: Menghapus data dari tabel public.users akan memicu cascade delete karena relasi foreign key
    // Namun untuk menghapus secara total dari auth.users Supabase, idealnya dilakukan di dashboard Supabase Auth.
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { message: 'Pengguna berhasil dihapus dari tabel publik' };
  },

  // ==========================================
  // 4. PENYIMPANAN BERKAS (SUPABASE STORAGE)
  // ==========================================

  uploadFile: async (file: File, type: string) => {
    const fileExt = file.name.split('.').pop();
    // Buat nama berkas unik untuk menghindari bentrokan
    const fileName = `${type}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const filePath = `${type}/${fileName}`;

    // Unggah berkas ke bucket bernama 'documents' yang harus dibuat publik di Supabase
    const { data, error } = await supabase.storage
      .from('documents')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) throw error;

    // Dapatkan URL publik dari berkas yang diunggah
    const { data: { publicUrl } } = supabase.storage
      .from('documents')
      .getPublicUrl(filePath);

    return {
      url: publicUrl,
      original_size: file.size,
      compressed_size: file.size,
      format: fileExt || ''
    };
  },

  // ==========================================
  // 5. STATISTIK DASHBOARD (REAL-TIME QUERIES)
  // ==========================================

  getDashboardStats: async () => {
    // Mengambil jumlah total surat menunggu (pending)
    const { count: pendingCount, error: err1 } = await supabase
      .from('letter_requests')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'menunggu');

    if (err1) throw err1;

    // Mengambil jumlah total surat selesai (done)
    const { count: doneCount, error: err2 } = await supabase
      .from('letter_requests')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'selesai');

    if (err2) throw err2;

    // Mengambil jumlah total surat sedang diproses
    const { count: processingCount, error: err3 } = await supabase
      .from('letter_requests')
      .select('*', { count: 'exact', head: true })
      .in('status', ['dicek_sekretaris', 'menunggu_ttd_ketua']);

    if (err3) throw err3;

    // Mengambil riwayat pengajuan surat dalam 7 hari terakhir
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const { data: recentLetters, error: err4 } = await supabase
      .from('letter_requests')
      .select('created_at')
      .gte('created_at', sevenDaysAgo.toISOString());

    if (err4) throw err4;

    // Menyusun deret tanggal 7 hari terakhir
    const last7Dates = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d.toISOString().split('T')[0];
    });

    // Menghitung jumlah surat per hari
    const last7 = last7Dates.map(dateStr => {
      const count = recentLetters?.filter(item => {
        const itemDate = new Date(item.created_at).toISOString().split('T')[0];
        return itemDate === dateStr;
      }).length || 0;
      return { date: dateStr, count };
    });

    return {
      stats: {
        pending_letters: pendingCount || 0,
        done_letters: doneCount || 0,
        processing_letters: processingCount || 0
      },
      last7
    };
  }
};
