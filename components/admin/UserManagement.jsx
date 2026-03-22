import React, { useEffect, useState } from 'react';
import { getAllUsers, updateUserRole, deleteUser } from '@/app/actions/adminActions';
import { FaUserShield, FaUserCircle, FaSearch, FaHistory, FaTimes, FaUserEdit, FaTrash, FaExclamationTriangle } from 'react-icons/fa';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isMutating, setIsMutating] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    const result = await getAllUsers();
    if (result.success) {
      setUsers(result.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUpdateRole = async (newRole) => {
    if (!selectedUser) return;
    setIsMutating(true);
    const result = await updateUserRole(selectedUser.id, newRole);
    if (result.success) {
      alert(`Role ${selectedUser.displayName} berhasil diubah menjadi ${newRole}!`);
      setSelectedUser(null);
      fetchUsers();
    } else {
      alert("Gagal mengubah role: " + result.error);
    }
    setIsMutating(false);
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    if (!confirm(`APAKAH KAMU YAKIN? Akun ${selectedUser.displayName} akan dihapus PERMANEN dari database!`)) return;
    
    setIsMutating(true);
    const result = await deleteUser(selectedUser.id);
    if (result.success) {
      alert(`User ${selectedUser.displayName} telah dihapus.`);
      setSelectedUser(null);
      fetchUsers();
    } else {
      alert("Gagal menghapus user: " + result.error);
    }
    setIsMutating(false);
  };

  const filteredUsers = users.filter(user => 
    user.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && users.length === 0) return <div style={{ fontWeight: 800, textTransform: 'uppercase', color: '#666' }}>Mengambil Data User...</div>;

  return (
    <div suppressHydrationWarning style={{ display: 'flex', flexDirection: 'column', gap: '25px', position: 'relative' }}>
      {/* Header & Search */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', border: '4px solid #000', boxShadow: '10px 10px 0 #000', padding: '20px' }}>
         <div>
            <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 950, textTransform: 'uppercase' }}>Daftar Pengguna</h2>
            <p style={{ margin: 0, fontSize: '12px', fontWeight: 700, opacity: 0.6 }}>Total {users.length} user terdaftar di database</p>
         </div>
         <div style={{ position: 'relative', width: '300px' }}>
            <FaSearch style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#888' }} />
            <input 
               type="text" 
               placeholder="Cari nama atau email..."
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               style={{ 
                  width: '100%', padding: '12px 15px 12px 45px', border: '3px solid #000', 
                  fontSize: '14px', fontWeight: 700, outline: 'none'
               }}
            />
         </div>
      </div>

      {/* Users Table */}
      <div style={{ background: '#fff', border: '4px solid #000', boxShadow: '12px 12px 0 #000', overflow: 'hidden' }}>
         <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
               <thead style={{ background: '#ffe600', borderBottom: '4px solid #000' }}>
                  <tr style={{ fontSize: '12px', fontWeight: 950, textTransform: 'uppercase', color: '#000' }}>
                     <th style={{ padding: '18px 25px' }}>Profil</th>
                     <th style={{ padding: '18px 25px' }}>Email</th>
                     <th style={{ padding: '18px 25px' }}>Role</th>
                     <th style={{ padding: '18px 25px' }}>Bergabung</th>
                     <th style={{ padding: '18px 25px' }}>Action</th>
                  </tr>
               </thead>
               <tbody>
                  {filteredUsers.length > 0 ? filteredUsers.map((user, i) => (
                     <tr key={user.id} style={{ borderBottom: '2px solid #000', background: i % 2 === 0 ? '#fff' : '#fcfcfc', color: '#000' }}>
                        <td style={{ padding: '15px 25px' }}>
                           <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                              <img 
                                 src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName || 'U'}&background=ffe600&color=000`} 
                                 style={{ width: '45px', height: '45px', border: '2px solid #000', borderRadius: '50%' }}
                              />
                              <div>
                                 <div style={{ fontWeight: 900, fontSize: '15px' }}>{user.displayName || 'Anonim'}</div>
                                 <div style={{ fontSize: '10px', color: '#888', fontWeight: 800 }}>UID: {user.id.substring(0, 8)}...</div>
                              </div>
                           </div>
                        </td>
                        <td style={{ padding: '15px 25px', fontWeight: 700, fontSize: '13px' }}>{user.email}</td>
                        <td style={{ padding: '15px 25px' }}>
                           <span style={{ 
                              padding: '6px 12px', border: '2px solid #000', 
                              background: user.role === 'admin' ? '#ffe600' : '#eee',
                              fontSize: '10px', fontWeight: 950, textTransform: 'uppercase'
                           }}>
                              {user.role === 'admin' ? <><FaUserShield /> Admin</> : <><FaUserCircle /> User</>}
                           </span>
                        </td>
                        <td style={{ padding: '15px 25px', fontSize: '12px', fontWeight: 800 }}>
                           {new Date(user.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </td>
                        <td style={{ padding: '15px 25px' }}>
                           <button style={{ 
                              background: '#eee', border: '2px solid #000', padding: '8px 12px', 
                              fontSize: '11px', fontWeight: 900, cursor: 'pointer', transition: '0.2s'
                           }} onClick={() => setSelectedUser(user)}>
                              KELOLA
                           </button>
                        </td>
                     </tr>
                  )) : (
                     <tr>
                        <td colSpan="5" style={{ padding: '50px', textAlign: 'center', fontWeight: 800, opacity: 0.5 }}>
                           Tidak ada user ditemukan
                        </td>
                     </tr>
                  )}
               </tbody>
            </table>
         </div>
      </div>

      {/* Edit Modal - Neobrutalist Premium */}
      {selectedUser && (
        <div style={{ 
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', 
          background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 
        }}>
          <div style={{ 
            background: '#fff', border: '6px solid #000', boxShadow: '15px 15px 0 #000', 
            width: '450px', padding: '30px', position: 'relative' 
          }}>
             <button 
                onClick={() => !isMutating && setSelectedUser(null)} 
                style={{ position: 'absolute', right: '15px', top: '15px', background: 'none', border: 'none', cursor: 'pointer' }}
             >
                <FaTimes size={24} />
             </button>

             <div style={{ textAlign: 'center', marginBottom: '25px' }}>
                <img 
                   src={selectedUser.photoURL || `https://ui-avatars.com/api/?name=${selectedUser.displayName || 'U'}&background=ffe600&color=000`} 
                   style={{ width: '80px', height: '80px', border: '4px solid #000', borderRadius: '50%', marginBottom: '15px' }}
                />
                <h3 style={{ margin: 0, fontWeight: 950, fontSize: '20px' }}>{selectedUser.displayName}</h3>
                <p style={{ margin: 0, fontSize: '12px', fontWeight: 700, color: '#666' }}>{selectedUser.email}</p>
             </div>

             <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div style={{ border: '2px solid #000', padding: '15px', background: '#f8f9fa' }}>
                   <div style={{ fontSize: '11px', fontWeight: 900, marginBottom: '10px', textTransform: 'uppercase' }}>🔧 Ubah Role Pengguna</div>
                   <div style={{ display: 'flex', gap: '10px' }}>
                      <button 
                         disabled={isMutating || selectedUser.role === 'admin'}
                         onClick={() => handleUpdateRole('admin')}
                         style={{ 
                            flex: 1, padding: '10px', border: '2px solid #000', background: selectedUser.role === 'admin' ? '#000' : '#ffe600',
                            color: selectedUser.role === 'admin' ? '#fff' : '#000', fontWeight: 950, cursor: 'pointer', opacity: selectedUser.role === 'admin' ? 0.5 : 1
                         }}
                      >
                         BE JADI ADMIN
                      </button>
                      <button 
                         disabled={isMutating || selectedUser.role === 'user'}
                         onClick={() => handleUpdateRole('user')}
                         style={{ 
                            flex: 1, padding: '10px', border: '2px solid #000', background: selectedUser.role === 'user' ? '#000' : '#fff',
                            color: selectedUser.role === 'user' ? '#fff' : '#000', fontWeight: 950, cursor: 'pointer', opacity: selectedUser.role === 'user' ? 0.5 : 1
                         }}
                      >
                         JADI USER BIASA
                      </button>
                   </div>
                </div>

                <div style={{ border: '2px solid #dc3545', padding: '15px', background: '#fff5f5' }}>
                   <div style={{ fontSize: '11px', fontWeight: 900, marginBottom: '10px', textTransform: 'uppercase', color: '#dc3545' }}>⚠️ Zona Bahaya</div>
                   <button 
                      disabled={isMutating}
                      onClick={handleDeleteUser}
                      style={{ 
                         width: '100%', padding: '12px', border: '2px solid #000', background: '#dc3545',
                         color: '#fff', fontWeight: 950, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'
                      }}
                   >
                      <FaTrash /> HAPUS AKUN PERMANEN
                   </button>
                </div>
             </div>

             {isMutating && (
               <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 950 }}>
                  MEMPROSES...
               </div>
             )}
          </div>
        </div>
      )}
    </div>
  );
}
