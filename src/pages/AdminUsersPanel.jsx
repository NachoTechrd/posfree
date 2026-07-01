import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Search,
  Edit,
  Trash2,
  RefreshCw,
  Shield,
  X,
  CheckCircle,
  AlertTriangle,
  UserCheck,
  UserX
} from 'lucide-react';
import { toast } from 'sonner';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('posent_access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default function AdminUsersPanel() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [planFilter, setPlanFilter] = useState('all');
  
  // Modals state
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  
  // Edit form state
  const [editPlan, setEditPlan] = useState('free');
  const [editStatus, setEditStatus] = useState('trial');
  const [editRole, setEditRole] = useState('owner');
  const [editActivo, setEditActivo] = useState(true);
  const [editEndDate, setEditEndDate] = useState('');
  const [editTrialEndsAt, setEditTrialEndsAt] = useState('');
  const [saving, setSaving] = useState(false);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/users', {
        headers: { 'x-admin-key': 'ejncndjcehcdb' }
      });
      if (res.data && res.data.success) {
        setUsers(res.data.data);
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleOpenEdit = (user) => {
    setSelectedUser(user);
    setEditPlan(user.subscription?.plan || 'free');
    setEditStatus(user.subscription?.status || 'trial');
    setEditRole(user.rol || 'owner');
    setEditActivo(user.activo !== false);
    
    // Format dates for inputs (YYYY-MM-DD)
    if (user.subscription?.endDate) {
      setEditEndDate(new Date(user.subscription.endDate).toISOString().split('T')[0]);
    } else {
      setEditEndDate('');
    }
    
    if (user.subscription?.trialEndsAt) {
      setEditTrialEndsAt(new Date(user.subscription.trialEndsAt).toISOString().split('T')[0]);
    } else {
      setEditTrialEndsAt('');
    }
    
    setEditDialogOpen(true);
  };

  const handleSaveUser = async () => {
    if (!selectedUser) return;
    
    try {
      setSaving(true);
      const payload = {
        activo: editActivo,
        rol: editRole,
        subscription: {
          plan: editPlan,
          status: editStatus,
          endDate: editEndDate ? new Date(editEndDate) : null,
          trialEndsAt: editTrialEndsAt ? new Date(editTrialEndsAt) : null
        }
      };

      const res = await api.put(`/admin/users/${selectedUser._id}`, payload, {
        headers: { 'x-admin-key': 'ejncndjcehcdb' }
      });

      if (res.data && res.data.success) {
        toast.success('Usuario actualizado exitosamente');
        setEditDialogOpen(false);
        loadUsers();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al guardar cambios');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteUser = async (userId, userEmail) => {
    if (!window.confirm(`¿Estás seguro de que deseas eliminar permanentemente al usuario ${userEmail}? Esta acción no se puede deshacer.`)) {
      return;
    }

    try {
      const res = await api.delete(`/admin/users/${userId}`, {
        headers: { 'x-admin-key': 'ejncndjcehcdb' }
      });
      if (res.data && res.data.success) {
        toast.success('Usuario eliminado exitosamente');
        loadUsers();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al eliminar usuario');
    }
  };

  // Filter users based on query and plan
  const filteredUsers = users.filter((u) => {
    const matchesSearch = 
      (u.nombre || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.telefono || '').toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesPlan = planFilter === 'all' || (u.subscription?.plan || 'free') === planFilter;
    
    return matchesSearch && matchesPlan;
  });

  const getPlanBadge = (plan) => {
    switch (plan) {
      case 'pro': return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-800">PRO</span>;
      case 'enterprise': return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-800">ENTERPRISE</span>;
      case 'basic': return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">BASIC</span>;
      default: return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">FREE</span>;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active': return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">ACTIVO</span>;
      case 'trial': return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">PRUEBA</span>;
      case 'cancelled': return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">CANCELADO</span>;
      default: return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800">INACTIVO</span>;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-foreground">Control de Usuarios y Licencias</h1>
              <p className="text-sm text-muted-foreground">Panel secreto de sincronización de POSENT Free & PRO</p>
            </div>
          </div>
          <button
            onClick={loadUsers}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-all duration-200"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refrescar
          </button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="relative md:col-span-2">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar por nombre, correo o teléfono..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
          <div>
            <select
              value={planFilter}
              onChange={(e) => setPlanFilter(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            >
              <option value="all">Todos los planes</option>
              <option value="free">POSENT Free</option>
              <option value="basic">POSENT Basic</option>
              <option value="pro">POSENT Pro</option>
              <option value="enterprise">POSENT Enterprise</option>
            </select>
          </div>
        </div>

        {/* Users Table */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <LoaderSpinner />
          </div>
        ) : (
          <div className="overflow-x-auto border border-border rounded-xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted/50 border-b border-border text-sm font-semibold text-muted-foreground">
                  <th className="p-4">Usuario / Negocio</th>
                  <th className="p-4">Contacto</th>
                  <th className="p-4">Rol</th>
                  <th className="p-4">Plan</th>
                  <th className="p-4">Estado Plan</th>
                  <th className="p-4">Acceso</th>
                  <th className="p-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-sm text-foreground">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-muted-foreground">
                      No se encontraron usuarios
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => (
                    <tr key={u._id} className="hover:bg-muted/20 transition-colors">
                      <td className="p-4">
                        <div className="font-semibold">{u.nombre}</div>
                        <div className="text-xs text-muted-foreground">{u.negocio?.nombre || 'Negocio no configurado'}</div>
                      </td>
                      <td className="p-4">
                        <div>{u.email}</div>
                        {u.telefono && <div className="text-xs text-muted-foreground">{u.telefono}</div>}
                      </td>
                      <td className="p-4">
                        <span className="capitalize px-2 py-0.5 rounded bg-secondary text-secondary-foreground text-xs font-medium">
                          {u.rol || 'owner'}
                        </span>
                      </td>
                      <td className="p-4">{getPlanBadge(u.subscription?.plan)}</td>
                      <td className="p-4">{getStatusBadge(u.subscription?.status)}</td>
                      <td className="p-4">
                        {u.activo !== false ? (
                          <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-semibold">
                            <UserCheck className="w-3.5 h-3.5" /> Habilitado
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground font-semibold">
                            <UserX className="w-3.5 h-3.5" /> Bloqueado
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <div className="inline-flex items-center gap-2">
                          <button
                            onClick={() => handleOpenEdit(u)}
                            className="p-1.5 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                            title="Editar usuario"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(u._id, u.email)}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Eliminar permanentemente"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

      </div>

      {/* Edit Dialog Modal */}
      {editDialogOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-card rounded-2xl border border-border shadow-lg overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-5 border-b border-border bg-muted/20">
              <h3 className="text-lg font-bold text-foreground">Editar Cuenta y Suscripción</h3>
              <button
                onClick={() => setEditDialogOpen(false)}
                className="p-1 text-muted-foreground hover:bg-accent rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-4">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">USUARIO SELECCIONADO</label>
                <div className="text-sm font-semibold">{selectedUser.nombre}</div>
                <div className="text-xs text-muted-foreground">{selectedUser.email}</div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">PLAN DE SUSCRIPCIÓN</label>
                  <select
                    value={editPlan}
                    onChange={(e) => setEditPlan(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  >
                    <option value="free">Free</option>
                    <option value="basic">Basic</option>
                    <option value="pro">Pro</option>
                    <option value="enterprise">Enterprise</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">ESTADO SUSCRIPCIÓN</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  >
                    <option value="trial">Trial</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">FIN PRUEBA (TRIAL)</label>
                  <input
                    type="date"
                    value={editTrialEndsAt}
                    onChange={(e) => setEditTrialEndsAt(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">FIN SUSCRIPCIÓN</label>
                  <input
                    type="date"
                    value={editEndDate}
                    onChange={(e) => setEditEndDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">ROL DEL USUARIO</label>
                <select
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                >
                  <option value="owner">Owner (Propietario)</option>
                  <option value="admin">Admin</option>
                  <option value="manager">Manager</option>
                  <option value="employee">Employee</option>
                  <option value="cashier">Cashier</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-3.5 bg-muted/40 border border-border rounded-xl">
                <div>
                  <div className="text-sm font-semibold text-foreground">Cuenta Habilitada</div>
                  <div className="text-xs text-muted-foreground">Permitir inicio de sesión en el sistema</div>
                </div>
                <button
                  type="button"
                  onClick={() => setEditActivo(!editActivo)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${editActivo ? 'bg-primary' : 'bg-gray-200'}`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${editActivo ? 'translate-x-5' : 'translate-x-0'}`}
                  />
                </button>
              </div>
            </div>
            
            {/* Modal Footer */}
            <div className="p-4 border-t border-border bg-muted/20 flex justify-end gap-2.5">
              <button
                onClick={() => setEditDialogOpen(false)}
                className="px-4 py-2 border border-border rounded-xl text-sm font-semibold hover:bg-accent hover:text-accent-foreground transition-all duration-200"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveUser}
                disabled={saving}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/95 transition-all duration-200 shadow-sm disabled:opacity-50"
              >
                {saving ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function LoaderSpinner() {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      <p className="text-sm text-muted-foreground">Obteniendo usuarios...</p>
    </div>
  );
}
