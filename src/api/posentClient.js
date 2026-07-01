import axios from 'axios';

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
}, (error) => {
  return Promise.reject(error);
});

// Almacenar el token de registro temporalmente para simular el OTP
let registerToken = null;

export const posent = {
  auth: {
    loginViaEmailPassword: async (email, password) => {
      try {
        const res = await api.post('/auth/login', { email, password });
        if (res.data && res.data.token) {
          localStorage.setItem('posent_access_token', res.data.token);
        }
        return res.data?.user;
      } catch (err) {
        throw new Error(err.response?.data?.message || 'Error en inicio de sesión');
      }
    },
    loginWithGoogle: async (googleToken) => {
      try {
        const res = await api.post('/auth/google', { token: googleToken });
        if (res.data && res.data.token) {
          localStorage.setItem('posent_access_token', res.data.token);
        }
        return res.data?.user;
      } catch (err) {
        throw new Error(err.response?.data?.message || 'Error en inicio de sesión con Google');
      }
    },
    register: async ({ email, password }) => {
      try {
        const namePart = email.split('@')[0];
        const defaultName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
        const res = await api.post('/auth/register', {
          email,
          password,
          nombre: defaultName,
          nombreNegocio: `Negocio de ${defaultName}`
        });
        if (res.data && res.data.token) {
          registerToken = res.data.token;
        }
        return res.data;
      } catch (err) {
        throw new Error(err.response?.data?.message || 'Error en el registro');
      }
    },
    verifyOtp: async ({ email, otpCode }) => {
      if (registerToken) {
        const token = registerToken;
        registerToken = null;
        return { access_token: token };
      }
      throw new Error('No hay registro previo para verificar');
    },
    resendOtp: async (email) => {
      return { success: true };
    },
    setToken: (token) => {
      if (token) {
        localStorage.setItem('posent_access_token', token);
      } else {
        localStorage.removeItem('posent_access_token');
      }
    },
    loginWithProvider: (provider, redirect) => {
      alert('Inicio de sesión social no disponible localmente. Use correo y contraseña.');
    },
    resetPasswordRequest: async (email) => {
      return { success: true, message: 'Si el correo está registrado, se envió una solicitud.' };
    },
    resetPassword: async ({ resetToken, newPassword }) => {
      return { success: true };
    },
    me: async () => {
      try {
        const res = await api.get('/auth/me');
        return res.data?.user;
      } catch (err) {
        throw err.response || err;
      }
    },
    logout: (redirectUrl) => {
      localStorage.removeItem('posent_access_token');
      if (redirectUrl) {
        window.location.href = '/login';
      }
    },
    redirectToLogin: (redirectUrl) => {
      window.location.href = '/login';
    }
  },
  entities: {
    Client: {
      list: async (sort, limit) => {
        const res = await api.get('/customers');
        return (res.data?.data || []).map(c => ({
          id: c._id,
          name: c.nombre,
          phone: c.telefono || '',
          email: c.email || '',
          address: c.direccion ? (typeof c.direccion === 'string' ? c.direccion : `${c.direccion.calle || ''} ${c.direccion.ciudad || ''}`) : '',
          notes: c.notas || '',
          created_date: c.created_at || c.fecha_registro
        }));
      },
      create: async (data) => {
        const payload = {
          nombre: data.name,
          telefono: data.phone,
          email: data.email,
          direccion: data.address,
          notas: data.notes
        };
        const res = await api.post('/customers', payload);
        const c = res.data.data;
        return {
          id: c._id,
          name: c.nombre,
          phone: c.telefono,
          email: c.email,
          address: c.direccion,
          notes: c.notes
        };
      },
      update: async (id, data) => {
        const payload = {
          nombre: data.name,
          telefono: data.phone,
          email: data.email,
          direccion: data.address,
          notas: data.notes
        };
        const res = await api.put(`/customers/${id}`, payload);
        const c = res.data.data;
        return {
          id: c._id,
          name: c.nombre,
          phone: c.telefono,
          email: c.email,
          address: c.direccion,
          notes: c.notes
        };
      },
      delete: async (id) => {
        await api.delete(`/customers/${id}`);
        return { success: true };
      }
    },
    Product: {
      list: async (sort, limit) => {
        const res = await api.get('/products');
        return (res.data?.data || []).map(p => ({
          id: p._id,
          name: p.nombre,
          description: p.descripcion || '',
          price: p.precio,
          cost: p.costo || 0,
          stock: p.stock_actual || 0,
          category: p.categoria || 'producto',
          code: p.codigo
        }));
      },
      create: async (data) => {
        const payload = {
          nombre: data.name,
          descripcion: data.description,
          precio: data.price,
          costo: data.cost || 0,
          stock_actual: data.stock || 0,
          categoria: data.category || 'producto',
          codigo: data.code || 'PROD-' + Date.now().toString().slice(-6)
        };
        const res = await api.post('/products', payload);
        const p = res.data.data;
        return {
          id: p._id,
          name: p.nombre,
          description: p.descripcion,
          price: p.precio,
          cost: p.costo,
          stock: p.stock_actual,
          category: p.categoria,
          code: p.codigo
        };
      },
      update: async (id, data) => {
        const payload = {
          nombre: data.name,
          descripcion: data.description,
          precio: data.price,
          costo: data.cost || 0,
          stock_actual: data.stock || 0,
          categoria: data.category || 'producto',
          codigo: data.code
        };
        const res = await api.put(`/products/${id}`, payload);
        const p = res.data.data;
        return {
          id: p._id,
          name: p.nombre,
          description: p.descripcion,
          price: p.precio,
          cost: p.costo,
          stock: p.stock_actual,
          category: p.categoria,
          code: p.codigo
        };
      },
      delete: async (id) => {
        await api.delete(`/products/${id}`);
        return { success: true };
      }
    },
    Expense: {
      list: async (sort, limit) => {
        const res = await api.get('/expenses');
        return (res.data?.data || []).map(e => ({
          id: e._id,
          description: e.concepto,
          amount: e.monto,
          expense_date: e.fecha,
          category: e.categoria,
          supplier: e.proveedor || ''
        }));
      },
      create: async (data) => {
        const payload = {
          concepto: data.description,
          monto: Number(data.amount),
          fecha: data.expense_date || new Date(),
          categoria: data.category || 'otros',
          proveedor: data.supplier,
          metodo_pago: 'efectivo'
        };
        const res = await api.post('/expenses', payload);
        const e = res.data.data;
        return {
          id: e._id,
          description: e.concepto,
          amount: e.monto,
          expense_date: e.fecha,
          category: e.categoria,
          supplier: e.proveedor
        };
      },
      update: async (id, data) => {
        const payload = {
          concepto: data.description,
          monto: Number(data.amount),
          fecha: data.expense_date,
          categoria: data.category || 'otros',
          proveedor: data.supplier
        };
        const res = await api.put(`/expenses/${id}`, payload);
        const e = res.data.data;
        return {
          id: e._id,
          description: e.concepto,
          amount: e.monto,
          expense_date: e.fecha,
          category: e.categoria,
          supplier: e.proveedor
        };
      },
      delete: async (id) => {
        await api.delete(`/expenses/${id}`);
        return { success: true };
      }
    },
    Invoice: {
      list: async (sort, limit) => {
        const res = await api.get('/sales');
        const sales = res.data?.data || [];
        return sales
          .filter(s => s.estado !== 'cotizacion')
          .map(s => ({
            id: s._id,
            invoice_number: s.numero_venta,
            client_id: s.cliente_id?._id || s.cliente_id || '',
            client_name: s.cliente_nombre || '',
            items: (s.items || []).map(item => ({
              product_id: item.producto_id,
              name: item.nombre,
              quantity: item.cantidad,
              unit_price: item.precio_unitario,
              subtotal: item.subtotal,
              discount_percent: item.descuento || 0
            })),
            tax_rate: s.impuestos ? Math.round((s.impuestos / (s.subtotal || 1)) * 100) : 18,
            tax_amount: s.impuestos || 0,
            subtotal: s.subtotal || 0,
            total: s.total || 0,
            notes: s.notas || '',
            status: s.estado === 'completada' ? 'pagada' : s.estado,
            issue_date: s.fecha?.split('T')[0] || new Date().toISOString().split('T')[0],
            due_date: s.fecha?.split('T')[0] || new Date().toISOString().split('T')[0],
            payment_method: s.metodo_pago || 'efectivo',
            payments: s.payments || [],
            amount_paid: s.amount_paid || 0,
            balance_due: s.balance_due ?? s.total
          }));
      },
      create: async (data) => {
        const items = (data.items || []).map(item => ({
          producto_id: item.product_id || undefined,
          nombre: item.name,
          cantidad: item.quantity,
          precio_unitario: item.unit_price,
          subtotal: item.subtotal,
          descuento: item.discount_percent || 0
        }));
        const payload = {
          items,
          subtotal: data.subtotal,
          descuento_total: 0,
          impuestos: data.tax_amount || 0,
          total: data.total,
          metodo_pago: data.payment_method || 'efectivo',
          cliente_id: data.client_id || undefined,
          cliente_nombre: data.client_name,
          notas: data.notes,
          estado: data.status === 'pagada' ? 'completada' : 'pendiente',
          payments: data.payments || [],
          amount_paid: data.amount_paid || 0,
          balance_due: data.balance_due
        };
        const res = await api.post('/sales', payload);
        return { id: res.data.data?._id, ...data };
      },
      update: async (id, data) => {
        const payload = {};
        if (data.status !== undefined) payload.estado = data.status === 'pagada' ? 'completada' : data.status;
        if (data.payments !== undefined) payload.payments = data.payments;
        if (data.amount_paid !== undefined) payload.amount_paid = data.amount_paid;
        if (data.balance_due !== undefined) payload.balance_due = data.balance_due;
        if (data.notes !== undefined) payload.notas = data.notes;

        const res = await api.patch(`/sales/${id}`, payload);
        return { id, ...data };
      },
      delete: async (id) => {
        await api.delete(`/sales/${id}`);
        return { success: true };
      }
    },
    Quote: {
      list: async (sort, limit) => {
        const res = await api.get('/sales?estado=cotizacion');
        const sales = res.data?.data || [];
        return sales.map(s => ({
          id: s._id,
          quote_number: s.numero_venta,
          client_id: s.cliente_id?._id || s.cliente_id || '',
          client_name: s.cliente_nombre || '',
          items: (s.items || []).map(item => ({
            product_id: item.producto_id,
            name: item.nombre,
            quantity: item.cantidad,
            unit_price: item.precio_unitario,
            subtotal: item.subtotal,
            discount_percent: item.descuento || 0
          })),
          tax_rate: s.impuestos ? Math.round((s.impuestos / (s.subtotal || 1)) * 100) : 18,
          tax_amount: s.impuestos || 0,
          subtotal: s.subtotal || 0,
          total: s.total || 0,
          notes: s.notas || '',
          status: s.estado || 'cotizacion',
          created_date: s.fecha,
          valid_until: s.fecha
        }));
      },
      create: async (data) => {
        const items = (data.items || []).map(item => ({
          producto_id: item.product_id || undefined,
          nombre: item.name,
          cantidad: item.quantity,
          precio_unitario: item.unit_price,
          subtotal: item.subtotal,
          descuento: item.discount_percent || 0
        }));
        const payload = {
          items,
          subtotal: data.subtotal,
          descuento_total: 0,
          impuestos: data.tax_amount || 0,
          total: data.total,
          metodo_pago: 'efectivo',
          cliente_id: data.client_id || undefined,
          cliente_nombre: data.client_name,
          notas: data.notes,
          estado: 'cotizacion'
        };
        const res = await api.post('/sales', payload);
        return { id: res.data.data?._id, ...data };
      },
      update: async (id, data) => {
        const payload = {};
        if (data.status !== undefined) payload.estado = data.status;
        if (data.notes !== undefined) payload.notas = data.notes;

        const res = await api.patch(`/sales/${id}`, payload);
        return { id, ...data };
      },
      delete: async (id) => {
        await api.delete(`/sales/${id}`);
        return { success: true };
      }
    },
    BusinessSettings: {
      list: async () => {
        try {
          const res = await api.get('/settings/business');
          if (res.data && res.data.data) {
            return [{ id: 'business', ...res.data.data }];
          }
          return [{ id: 'business' }];
        } catch (err) {
          return [{ id: 'business' }];
        }
      },
      create: async (data) => {
        const res = await api.post('/settings/business', data);
        return { id: 'business', ...res.data.data };
      },
      update: async (id, data) => {
        const res = await api.post('/settings/business', data);
        return { id: 'business', ...res.data.data };
      }
    }
  },
  integrations: {
    Core: {
      UploadFile: async ({ file }) => {
        const formData = new FormData();
        formData.append('image', file);
        const res = await api.post('/upload/file', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        return { file_url: res.data.data.url };
      }
    }
  }
};
