import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogIn, Mail, Lock, Loader2 } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const loadGoogleScript = () => {
            return new Promise((resolve) => {
                if (document.querySelector('script[src="https://accounts.google.com/gsi/client"]')) {
                    resolve();
                    return;
                }
                const script = document.createElement('script');
                script.src = 'https://accounts.google.com/gsi/client';
                script.async = true;
                script.defer = true;
                script.onload = () => resolve();
                document.body.appendChild(script);
            });
        };

        const initializeGoogle = async () => {
            try {
                await loadGoogleScript();
                if (!window.google) return;

                window.google.accounts.id.initialize({
                    client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || '1090069992500-etv0mm1jq5tkhvm3m54reu785u60tse6.apps.googleusercontent.com',
                    callback: async (response) => {
                        if (!response.credential) {
                            setError("No se pudo obtener el token de Google");
                            return;
                        }
                        setLoading(true);
                        setError("");
                        try {
                            await base44.auth.loginWithGoogle(response.credential);
                            window.location.href = "/";
                        } catch (err) {
                            setError(err.message || "Error al iniciar sesión con Google");
                        } finally {
                            setLoading(false);
                        }
                    },
                    auto_select: false,
                    cancel_on_tap_outside: true,
                    use_fedcm_for_prompt: false,
                });

                const container = document.getElementById('googleBtnContainer');
                if (container) {
                    window.google.accounts.id.renderButton(container, {
                        type: 'standard',
                        theme: 'outline',
                        size: 'large',
                        text: 'signin_with',
                        shape: 'rectangular',
                        logo_alignment: 'left',
                        width: container.clientWidth || 384,
                    });
                }
            } catch (err) {
                console.error('Error al inicializar Google Sign-In:', err);
            }
        };

        initializeGoogle();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await base44.auth.loginViaEmailPassword(email, password);
            window.location.href = "/";
        } catch (err) {
            setError(err.message || "Correo o contraseña incorrectos");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout
            icon={LogIn}
            title="Bienvenido"
            subtitle="Inicia sesión en tu cuenta"
            footer={
                <>
                    ¿No tienes cuenta?{" "}
                    <Link to="/register" className="text-primary font-medium hover:underline">
                        Crear una
                    </Link>
                </>
            }
        >
            {error && (
                <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="email">Correo electrónico</Label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
                        <Input
                            id="email"
                            type="email"
                            autoComplete="email"
                            autoFocus
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="pl-10 h-12"
                            required
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="password">Contraseña</Label>
                        <Link to="/forgot-password" className="text-xs text-primary hover:underline">
                            ¿Olvidaste tu contraseña?
                        </Link>
                    </div>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
                        <Input
                            id="password"
                            type="password"
                            autoComplete="current-password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="pl-10 h-12"
                            required
                        />
                    </div>
                </div>
                <Button type="submit" className="w-full h-12 font-medium" disabled={loading}>
                    {loading ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Iniciando sesión...
                        </>
                    ) : (
                        "Iniciar sesión"
                    )}
                </Button>
            </form>

            <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">O continúa con</span>
                </div>
            </div>

            <div className="flex justify-center w-full min-h-[44px]">
                <div id="googleBtnContainer" className="w-full flex justify-center" />
            </div>
        </AuthLayout>
    );
}