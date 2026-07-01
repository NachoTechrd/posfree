import { Toaster } from "@/components/ui/toaster"
import { Toaster as SonnerToaster } from "sonner"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ProtectedRoute from '@/components/ProtectedRoute';

import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';

import AppLayout from '@/components/layout/AppLayout';
import Dashboard from '@/pages/Dashboard';
import Clients from '@/pages/Clients';
import ClientDetail from '@/pages/ClientDetail';
import Products from '@/pages/Products';
import Quotes from '@/pages/Quotes';
import QuoteForm from '@/pages/QuoteForm';
import QuoteDetail from '@/pages/QuoteDetail';
import Invoices from '@/pages/Invoices';
import InvoiceForm from '@/pages/InvoiceForm';
import InvoiceDetail from '@/pages/InvoiceDetail';
import Reports from '@/pages/Reports';
import Settings from '@/pages/Settings';
import Expenses from '@/pages/Expenses';
import Integrations from '@/pages/Integrations';

const AuthenticatedApp = () => {
    const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

    if (isLoadingPublicSettings || isLoadingAuth) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                    <p className="text-sm text-muted-foreground">Cargando NachoFacturas...</p>
                </div>
            </div>
        );
    }

    if (authError) {
        if (authError.type === 'user_not_registered') {
            return <UserNotRegisteredError />;
        } else if (authError.type === 'auth_required') {
            navigateToLogin();
            return null;
        }
    }

    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            <Route element={<ProtectedRoute unauthenticatedElement={<Navigate to="/login" replace />} />}>
                <Route element={<AppLayout />}>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/clients" element={<Clients />} />
                    <Route path="/clients/new" element={<Clients />} />
                    <Route path="/clients/:id" element={<ClientDetail />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/products/new" element={<Products />} />
                    <Route path="/quotes" element={<Quotes />} />
                    <Route path="/quotes/new" element={<QuoteForm />} />
                    <Route path="/quotes/:id" element={<QuoteDetail />} />
                    <Route path="/quotes/:id/edit" element={<QuoteForm />} />
                    <Route path="/invoices" element={<Invoices />} />
                    <Route path="/invoices/new" element={<InvoiceForm />} />
                    <Route path="/invoices/:id" element={<InvoiceDetail />} />
                    <Route path="/invoices/:id/edit" element={<InvoiceForm />} />
                    <Route path="/expenses" element={<Expenses />} />
                    <Route path="/integrations" element={<Integrations />} />
                    <Route path="/reports" element={<Reports />} />
                    <Route path="/settings" element={<Settings />} />
                </Route>
            </Route>

            <Route path="*" element={<PageNotFound />} />
        </Routes>
    );
};

function App() {
    return (
        <AuthProvider>
            <QueryClientProvider client={queryClientInstance}>
                <Router>
                    <AuthenticatedApp />
                </Router>
                <Toaster />
                <SonnerToaster position="top-right" />
            </QueryClientProvider>
        </AuthProvider>
    )
}

export default App