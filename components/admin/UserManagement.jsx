import React, { useEffect, useState } from 'react';
import { getAllUsers, updateUserRole, deleteUser } from '@/app/actions/adminActions';

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

  if (loading && users.length === 0) return (
    <div className="flex h-64 items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-[#e6e8ea] border-t-[#4f46e5] rounded-full animate-spin" />
        <p className="text-sm font-semibold text-[#464555]">Mengambil Data User...</p>
      </div>
    </div>
  );

  return (
    <div suppressHydrationWarning className="px-4 md:px-8 pb-8">
      {/* Header & Search */}
      <div className="bg-white rounded-3xl shadow-sm p-5 md:p-6 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-lg font-bold" style={{ fontFamily: 'Manrope, sans-serif' }}>Daftar Pengguna</h2>
          <p className="text-xs font-medium text-[#464555]/60 mt-1">Total {users.length} user terdaftar di database</p>
        </div>
        <div className="relative w-full sm:w-72">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#464555]/50 text-xl">search</span>
          <input 
            type="text" 
            placeholder="Cari nama atau email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#f7f9fb] border-none rounded-xl py-2.5 pl-10 pr-4 text-sm font-medium outline-none focus:ring-2 focus:ring-[#3525cd]/20 transition-all"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left border-collapse">
            <thead className="bg-[#f7f9fb] text-xs font-bold text-[#464555] uppercase tracking-wider">
              <tr>
                <th className="p-4 pl-6">Profil</th>
                <th className="p-4">Email</th>
                <th className="p-4">Role</th>
                <th className="p-4">Bergabung</th>
                <th className="p-4 pr-6">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm font-medium">
              {filteredUsers.length > 0 ? filteredUsers.map((user, i) => (
                <tr key={user.id} className="border-b border-[#464555]/5 hover:bg-[#f7f9fb] transition-colors">
                  <td className="p-4 pl-6">
                    <div className="flex items-center gap-3">
                      <img 
                        src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName || 'U'}&background=e2dfff&color=3525cd&rounded=true`} 
                        className="w-10 h-10 rounded-xl object-cover border border-[#e6e8ea]"
                        alt=""
                      />
                      <div>
                        <div className="font-bold text-sm">{user.displayName || 'Anonim'}</div>
                        <div className="text-[10px] text-[#464555]/50 font-semibold">UID: {user.id.substring(0, 8)}...</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-[#464555] text-xs font-semibold">{user.email}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                      user.role === 'admin' 
                        ? 'bg-[#4f46e5]/10 text-[#4f46e5]' 
                        : 'bg-[#e6e8ea] text-[#464555]'
                    }`}>
                      {user.role === 'admin' ? '🛡️ ADMIN' : '👤 USER'}
                    </span>
                  </td>
                  <td className="p-4 text-xs text-[#464555]/70 font-semibold">
                    {new Date(user.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </td>
                  <td className="p-4 pr-6">
                    <button 
                      className="px-4 py-2 bg-[#f7f9fb] hover:bg-[#e6e8ea] border border-[#e6e8ea] rounded-lg text-xs font-bold transition-colors"
                      onClick={() => setSelectedUser(user)}
                    >
                      KELOLA
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="p-12 text-center text-sm text-[#464555]/50 font-semibold">
                    Tidak ada user ditemukan
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[2000] p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 relative">
            <button 
              onClick={() => !isMutating && setSelectedUser(null)} 
              className="absolute right-5 top-5 text-[#464555] hover:text-[#191c1e] transition-colors"
            >
              <span className="material-symbols-outlined text-2xl">close</span>
            </button>

            <div className="text-center mb-6">
              <img 
                src={selectedUser.photoURL || `https://ui-avatars.com/api/?name=${selectedUser.displayName || 'U'}&background=e2dfff&color=3525cd&rounded=true`} 
                className="w-20 h-20 rounded-2xl mx-auto mb-4 border-2 border-[#e6e8ea]"
                alt=""
              />
              <h3 className="text-lg font-bold" style={{ fontFamily: 'Manrope, sans-serif' }}>{selectedUser.displayName}</h3>
              <p className="text-xs font-semibold text-[#464555]/60">{selectedUser.email}</p>
            </div>

            <div className="flex flex-col gap-4">
              <div className="bg-[#f7f9fb] rounded-2xl p-5">
                <p className="text-[10px] font-bold text-[#464555] uppercase tracking-wider mb-3">🔧 Ubah Role Pengguna</p>
                <div className="flex gap-3">
                  <button 
                    disabled={isMutating || selectedUser.role === 'admin'}
                    onClick={() => handleUpdateRole('admin')}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                      selectedUser.role === 'admin' 
                        ? 'bg-[#4f46e5] text-white opacity-50 cursor-not-allowed' 
                        : 'bg-gradient-to-br from-[#4f46e5] to-[#2170e4] text-white hover:shadow-lg'
                    }`}
                  >
                    JADIKAN ADMIN
                  </button>
                  <button 
                    disabled={isMutating || selectedUser.role === 'user'}
                    onClick={() => handleUpdateRole('user')}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                      selectedUser.role === 'user' 
                        ? 'bg-[#e6e8ea] text-[#464555] opacity-50 cursor-not-allowed' 
                        : 'bg-[#e6e8ea] text-[#191c1e] hover:bg-[#d1d5db]'
                    }`}
                  >
                    JADI USER BIASA
                  </button>
                </div>
              </div>

              <div className="bg-[#ffdad6]/30 rounded-2xl p-5 border border-[#ba1a1a]/10">
                <p className="text-[10px] font-bold text-[#ba1a1a] uppercase tracking-wider mb-3">⚠️ Zona Bahaya</p>
                <button 
                  disabled={isMutating}
                  onClick={handleDeleteUser}
                  className="w-full py-3 bg-[#ba1a1a] hover:bg-[#93000a] text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-base">delete_forever</span>
                  HAPUS AKUN PERMANEN
                </button>
              </div>
            </div>

            {isMutating && (
              <div className="absolute inset-0 bg-white/70 rounded-3xl flex items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-8 h-8 border-3 border-[#e6e8ea] border-t-[#4f46e5] rounded-full animate-spin" />
                  <span className="text-xs font-bold text-[#464555]">MEMPROSES...</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
