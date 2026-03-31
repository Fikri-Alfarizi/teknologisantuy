'use client';

import { useState, useRef } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useSession, signIn as nextAuthSignIn } from 'next-auth/react';
import { storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { FaUserCircle, FaLink, FaDiscord, FaGoogle, FaSave, FaImage, FaUpload } from 'react-icons/fa';

export default function ProfileSettings() {
  const { user, userProfile, updateUserProfile, signInWithGoogle } = useAuth();
  const { data: session } = useSession();
  
  const [displayName, setDisplayName] = useState(userProfile?.displayName || '');
  const [photoURL, setPhotoURL] = useState(userProfile?.photoURL || '');
  const [uploadFile, setUploadFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  
  const fileInputRef = useRef(null);

  // Fallback avatar
  const currentAvatar = photoURL || userProfile?.photoURL || (session?.user?.image) || `https://ui-avatars.com/api/?name=${(displayName || 'User').replace(/ /g, '+')}&background=ffe600&color=000`;

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 2 * 1024 * 1024) {
        setErrorMsg('Ukuran file maksimal 2MB!');
        return;
      }
      setUploadFile(file);
      // Create local preview
      setPhotoURL(URL.createObjectURL(file));
      setSuccessMsg('Foto dipilih! Jangan lupa klik Simpan.');
    }
  };

  const handleSaveProfile = async () => {
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      let finalPhotoURL = photoURL;

      // Jika ada file yang mau diupload
      if (uploadFile) {
        setSuccessMsg('Mengunggah gambar ke server...');
        const fileRef = ref(storage, `avatars/${user.uid}_${Date.now()}`);
        await uploadBytes(fileRef, uploadFile);
        finalPhotoURL = await getDownloadURL(fileRef);
        setPhotoURL(finalPhotoURL);
      }

      await updateUserProfile({
        displayName: displayName,
        photoURL: finalPhotoURL
      });

      setSuccessMsg('Profil berhasil diperbarui!');
      setUploadFile(null);
      
    } catch (error) {
      console.error(error);
      setErrorMsg('Gagal memperbarui profil: ' + error.message);
    } finally {
      setLoading(false);
      setTimeout(() => setSuccessMsg(''), 5000);
    }
  };

  const linkGoogle = async () => {
    try {
      await signInWithGoogle();
      setSuccessMsg('Akun Google berhasil ditautkan/diperbarui!');
    } catch (err) {
      setErrorMsg('Gagal menautkan akun Google.');
    }
  };

  return (
    <div className="settings-wrapper">
      <div className="settings-container">
        {(!user && !session) ? (
          <div className="dash-auth-container">
            <div className="dash-locked-card">
              <FaUserCircle className="lock-icon text-yellow-500" />
              <h1>Akses Ditolak</h1>
              <p>Harap login terlebih dahulu untuk mengakses menu pengaturan profil, mengganti nama, atau mengunggah Avatar Anda.</p>
            </div>
          </div>
        ) : (
          <>
            <h1 className="page-title"><FaUserCircle className="title-icon text-yellow-500" /> Pengaturan Profil</h1>

            {successMsg && <div className="alert alert-success">{successMsg}</div>}
            {errorMsg && <div className="alert alert-error">{errorMsg}</div>}

            <div className="settings-grid">
              {/* KOLOM KIRI - EDIT PROFIL */}
              <div className="neo-box">
                 <div className="box-header">INFORMASI DASAR</div>
                 
                 {/* Foto Profil Area */}
                 <div className="avatar-section">
                    <div className="avatar-wrapper">
                      <img src={currentAvatar} alt="Profile" className="avatar-preview" />
                      <span className="avatar-badge">VIP</span>
                    </div>
                    
                    <div className="avatar-controls">
                       <p className="font-bold text-gray-400 text-xs mb-3 uppercase">Pilih Mode Ganti Foto:</p>
                       
                       <div className="flex-col gap-3">
                         {/* BROWSE FILE */}
                         <button 
                           onClick={() => fileInputRef.current?.click()} 
                           className="neo-btn btn-secondary w-full flex items-center justify-center gap-2 mb-3"
                         >
                           <FaUpload /> Upload dari Perangkat (Max 2MB)
                         </button>
                         <input 
                           type="file" 
                           accept="image/png, image/jpeg, image/webp" 
                           ref={fileInputRef} 
                           className="hidden" 
                           style={{ display: 'none' }}
                           onChange={handleFileChange}
                         />
                         
                         <div className="divider-text">ATAU</div>

                         {/* URL LINK */}
                         <div className="input-group">
                           <label><FaImage /> TEMPEL LINK URL GAMBAR</label>
                           <input 
                             type="url" 
                             placeholder="https://..." 
                             value={photoURL} 
                             onChange={(e) => {
                               setPhotoURL(e.target.value);
                               setUploadFile(null); // Reset file if URL is typed
                             }}
                             className="neo-input"
                           />
                         </div>
                       </div>
                    </div>
                 </div>

                 {/* Display Name Input */}
                 <div className="input-group mt-6">
                    <label>DISPLAY NAME (NAMA TAMPILAN)</label>
                    <input 
                      type="text" 
                      value={displayName} 
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Ketik nama kerenmu..."
                      className="neo-input font-bold"
                      maxLength={25}
                    />
                 </div>

                 {/* Save Button */}
                 <button 
                   onClick={handleSaveProfile} 
                   disabled={loading}
                   className="neo-btn btn-primary w-full mt-6 flex items-center justify-center gap-2"
                 >
                    {loading ? (
                       <div className="animate-spin spinner-small"></div>
                    ) : (
                       <><FaSave /> SIMPAN PERUBAHAN</>
                    )}
                 </button>
              </div>

              {/* KOLOM KANAN - LINKED ACCOUNTS */}
              <div className="neo-box h-fit">
                 <div className="box-header">KONEKSI AKUN PIHAK KETIGA</div>
                 <p className="text-xs text-gray-400 font-bold mb-6">Sambungkan akunmu agar lebih mudah login dan membuka fitur eksklusif.</p>
                 
                 <div className="flex flex-col gap-4">
                    {/* DISCORD LINK */}
                    <div className="linked-card border-discord">
                       <div className="flex items-center gap-4 link-content">
                         <div className="icon-box bg-discord"><FaDiscord /></div>
                         <div>
                           <div className="link-title">Akun Discord</div>
                           <div className="link-status">
                             {session ? session.user.username : 'Belum Tersambung'}
                           </div>
                         </div>
                       </div>
                       {!session ? (
                         <button onClick={() => nextAuthSignIn('discord')} className="link-btn border-discord">Sambungkan</button>
                       ) : (
                         <span className="badge-connected">AKTIF</span>
                       )}
                    </div>

                    {/* GOOGLE LINK */}
                    <div className="linked-card border-google">
                       <div className="flex items-center gap-4 link-content">
                         <div className="icon-box bg-google"><FaGoogle /></div>
                         <div>
                           <div className="link-title">Akun Google</div>
                           <div className="link-status">
                             {user?.providerData?.find(p => p.providerId === 'google.com') ? (user.email) : 'Belum Tersambung'}
                           </div>
                         </div>
                       </div>
                       {!user?.providerData?.find(p => p.providerId === 'google.com') ? (
                         <button onClick={linkGoogle} className="link-btn border-google">Sambungkan</button>
                       ) : (
                         <span className="badge-connected">AKTIF</span>
                       )}
                    </div>
                 </div>
              </div>
            </div>
          </>
        )}
      </div>

      <style jsx>{`
        .dash-auth-container { display: flex; align-items: center; justify-content: center; min-height: 70vh; padding: 20px; font-family: sans-serif; }
        .dash-locked-card { background: #1e1f22; padding: 50px 40px; border: 4px solid #000; box-shadow: 12px 12px 0px #000; text-align: center; max-width: 500px; width: 100%; border-radius: 4px; }
        .lock-icon { font-size: 80px; margin: 0 auto 20px auto; display: block; }
        .dash-locked-card h1 { color: #fff; font-size: 32px; font-weight: 950; text-transform: uppercase; letter-spacing: -1px; margin: 0 0 15px 0; }
        .dash-locked-card p { color: #b5bac1; font-weight: 700; line-height: 1.6; margin: 0; font-size: 15px; }
        
        .settings-wrapper { min-height: 100vh; background: #2b2d31; color: #fff; padding: 40px 20px; font-family: 'Space Grotesk', sans-serif; }
        .settings-container { max-width: 900px; margin: 0 auto; }
        .page-title { font-size: 32px; font-weight: 950; text-transform: uppercase; letter-spacing: -1px; display: flex; align-items: center; gap: 12px; margin-bottom: 30px; border-bottom: 4px solid #1e1f22; padding-bottom: 20px; }

        .alert { padding: 16px; margin-bottom: 24px; font-weight: 900; text-transform: uppercase; border: 2px solid #000; box-shadow: 4px 4px 0 rgba(0,0,0,0.5); font-size: 14px; }
        .alert-success { background: rgba(74,222,128,0.2); border-color: #4ade80; color: #4ade80; }
        .alert-error { background: rgba(239,68,68,0.2); border-color: #ef4444; color: #ef4444; }

        .mt-6 { margin-top: 24px; }
        .gap-2 { gap: 8px; }
        .w-full { width: 100%; }
        .text-xs { font-size: 12px; }
        .text-sm { font-size: 14px; }
        .text-yellow-500 { color: #eab308; }

        .settings-grid { display: grid; grid-template-columns: 3fr 2fr; gap: 24px; }
        @media (max-width: 768px) { .settings-grid { grid-template-columns: 1fr; } }

        .neo-box { background: #1e1f22; border: 4px solid #000; padding: 24px; box-shadow: 8px 8px 0 rgba(0,0,0,0.5); border-radius: 4px; }
        .h-fit { height: fit-content; }
        .box-header { font-size: 14px; font-weight: 950; text-transform: uppercase; letter-spacing: 2px; color: #ffe600; margin-bottom: 24px; padding-bottom: 12px; border-bottom: 2px dashed #313338; }

        .avatar-section { display: flex; gap: 24px; align-items: flex-start; }
        @media (max-width: 500px) { .avatar-section { flex-direction: column; align-items: center; } .avatar-controls { width: 100%; } }
        
        .avatar-wrapper { position: relative; }
        .avatar-preview { width: 120px; height: 120px; min-width: 120px; border-radius: 0; border: 4px solid #000; box-shadow: 4px 4px 0 #ffe600; object-fit: cover; background: #2b2d31; }
        .avatar-badge { position: absolute; bottom: -10px; right: -10px; background: #000; color: #ffe600; font-size: 10px; font-weight: 950; padding: 4px 8px; border: 2px solid #ffe600; text-transform: uppercase; }
        .avatar-controls { flex: 1; }

        .divider-text { text-align: center; font-size: 10px; font-weight: 900; color: #80848e; margin: 12px 0; letter-spacing: 2px; position: relative; }
        .divider-text::before, .divider-text::after { content: ''; position: absolute; top: 50%; width: 40%; height: 1px; background: #313338; }
        .divider-text::before { left: 0; } .divider-text::after { right: 0; }

        .flex-col { display: flex; flex-direction: column; }
        .flex { display: flex; }
        .items-center { align-items: center; }
        .justify-center { justify-content: center; }
        .justify-between { justify-content: space-between; }
        .gap-4 { gap: 16px; }
        .mb-3 { margin-bottom: 12px; }
        .mb-6 { margin-bottom: 24px; }
        
        .input-group label { display: flex; align-items: center; gap: 8px; font-size: 11px; font-weight: 900; color: #b5bac1; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 1px; }
        .neo-input { width: 100%; background: #2b2d31; color: #fff; border: 2px solid #000; padding: 12px 14px; outline: none; transition: 0.2s; box-shadow: inset 4px 4px 0 rgba(0,0,0,0.2); }
        .neo-input:focus { border-color: #ffe600; box-shadow: 4px 4px 0 #ffe600; }

        .neo-btn { padding: 14px 20px; font-weight: 950; text-transform: uppercase; letter-spacing: 1px; border: 2px solid #000; cursor: pointer; transition: all 0.2s; box-shadow: 4px 4px 0 #000; }
        .neo-btn:active:not(:disabled) { transform: translate(2px, 2px); box-shadow: 2px 2px 0 #000; }
        .btn-primary { background: #ffe600; color: #000; }
        .btn-primary:hover:not(:disabled) { background: #e6ce00; transform: translateY(-2px); box-shadow: 6px 6px 0 #000; }
        .btn-secondary { background: #dbdee1; color: #000; font-size: 12px; }
        .btn-secondary:hover { background: #fff; }
        .neo-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .linked-card { display: flex; align-items: center; justify-content: space-between; background: #2b2d31; border: 2px solid #000; padding: 16px; border-radius: 4px; flex-wrap: wrap; gap: 12px; margin-bottom: 16px; }
        .icon-box { width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; font-size: 20px; border: 2px solid #000; color: #fff; }
        
        .link-content { display: flex; align-items: center; gap: 16px; }
        .link-title { font-size: 14px; font-weight: 950; text-transform: uppercase; color: #fff; }
        .link-status { font-size: 12px; color: #9ca3af; font-weight: 700; }
        
        .border-discord { border-left: 6px solid #5865F2; }
        .bg-discord { background: #5865F2; }
        
        .border-google { border-left: 6px solid #ea4335; }
        .bg-google { background: #ea4335; }

        .link-btn { background: transparent; padding: 6px 12px; font-weight: 900; font-size: 10px; text-transform: uppercase; cursor: pointer; transition: 0.2s; border: 2px solid; }
        .link-btn.border-discord { color: #5865F2; border-color: #5865F2; }
        .link-btn.border-google { color: #ea4335; border-color: #ea4335; }
        .link-btn.border-discord:hover { background: #5865F2; color: #fff; }
        .link-btn.border-google:hover { background: #ea4335; color: #fff; }
        
        .badge-connected { background: #4ade80; color: #000; border: 2px solid #000; padding: 4px 10px; font-size: 10px; font-weight: 900; box-shadow: 2px 2px 0 #000; }
        
        .spinner-small { width: 20px; height: 20px; border: 3px solid #000; border-top-color: transparent; border-radius: 50%; animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
