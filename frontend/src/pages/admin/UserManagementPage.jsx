import React, { useEffect, useState } from 'react';
import { 
  Users, 
  Shield, 
  ShieldAlert, 
  Trash2, 
  Mail, 
  Search, 
  UserCog,
  ChevronDown,
  MoreVertical,
  Check
} from 'lucide-react';
import useDataStore from '../../store/dataStore';
import Card from '../../components/ui/Card';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ConfirmModal from '../../components/common/ConfirmModal';
import { USER_ROLES, ROLE_BADGES } from '../../utils/constants';
import { toast } from 'react-hot-toast';

export default function UserManagementPage() {
  const { allUsers, usersLoading, fetchUsers, updateUserRole, deleteUser } = useDataStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('ALL');
  const [isUpdating, setIsUpdating] = useState(null); // stores userId being updated
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, userId: null, userName: '' });

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleRoleChange = async (userId, newRole) => {
    setIsUpdating(userId);
    const result = await updateUserRole(userId, newRole);
    if (result.success) {
      toast.success(`Role updated to ${newRole}`);
    } else {
      toast.error(result.message);
    }
    setIsUpdating(null);
  };

  const handleDeleteClick = (userId, userName) => {
    setDeleteModal({ isOpen: true, userId, userName });
  };

  const handleConfirmDelete = async () => {
    const { userId } = deleteModal;
    if (!userId) return;

    const loadingToast = toast.loading('Deleting user...');
    const result = await deleteUser(userId);
    if (result.success) {
      toast.success('User deleted successfully', { id: loadingToast });
    } else {
      toast.error(result.message, { id: loadingToast });
    }
    setDeleteModal({ isOpen: false, userId: null, userName: '' });
  };

  const filteredUsers = allUsers.filter(u => {
    const matchesSearch = u.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          u.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'ALL' || u.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">User Management</h1>
          <p className="text-sm text-gray-500 font-bold">Manage staff roles and user access</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-surface-dark border border-gray-100 dark:border-gray-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/20"
            />
          </div>
          
          <select 
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="px-4 py-2 bg-white dark:bg-surface-dark border border-gray-100 dark:border-gray-800 rounded-xl text-sm font-bold focus:outline-none"
          >
            <option value="ALL">All Roles</option>
            {Object.values(USER_ROLES).map(role => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {usersLoading && allUsers.length === 0 ? (
          <div className="py-20 flex justify-center">
            <LoadingSpinner size="lg" text="Fetching users..." />
          </div>
        ) : filteredUsers.length === 0 ? (
          <Card className="py-20 text-center border-dashed">
            <Users className="w-12 h-12 text-gray-200 mx-auto mb-4" />
            <p className="text-gray-500 font-bold">No users found matching your filters.</p>
          </Card>
        ) : (
          <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50/50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-800">
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">User Details</th>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Current Role</th>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Change Role</th>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                  {filteredUsers.map(user => (
                    <tr key={user.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm ${user.role === 'ADMIN' ? 'bg-brand-orange text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'}`}>
                            {user.name?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-black text-gray-900 dark:text-white">{user.name}</p>
                            <div className="flex items-center gap-1.5 text-xs text-gray-500">
                              <Mail className="w-3 h-3" />
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black border ${ROLE_BADGES[user.role]}`}>
                          {user.role === 'ADMIN' ? <Shield className="w-3 h-3" /> : user.role === 'CUSTOMER' ? <Users className="w-3 h-3" /> : <UserCog className="w-3 h-3" />}
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center">
                          {user.role !== 'ADMIN' ? (
                            <select 
                              disabled={isUpdating === user.id}
                              value={user.role}
                              onChange={(e) => handleRoleChange(user.id, e.target.value)}
                              className="text-xs font-bold bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-brand-orange/20 cursor-pointer disabled:opacity-50"
                            >
                              {Object.values(USER_ROLES).filter(r => r !== 'ADMIN').map(role => (
                                <option key={role} value={role}>{role}</option>
                              ))}
                            </select>
                          ) : (
                            <span className="text-[10px] font-black text-gray-400 uppercase italic">Immutable</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {user.role !== 'ADMIN' ? (
                          <button 
                            onClick={() => handleDeleteClick(user.id, user.name)}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all"
                            title="Delete User"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        ) : (
                          <ShieldAlert className="w-4 h-4 text-brand-orange mx-auto opacity-20" />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      <ConfirmModal 
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, userId: null, userName: '' })}
        onConfirm={handleConfirmDelete}
        title="Delete User"
        message={`Are you sure you want to delete "${deleteModal.userName}"? This action cannot be undone and all their data will be permanently removed.`}
        confirmText="Yes, Delete"
        variant="danger"
      />
    </div>
  );
}
