import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus, Mail, Lock, Loader2 } from "lucide-react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import AuthLayout from "@/components/AuthLayout";
import { toast } from "@/components/ui/use-toast";

export default function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showOtp, setShowOtp] = useState(false);
    const [otpCode, setOtpCode] = useState("");

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
                            setError(err.message || "Error al registrarse con Google");
                        } finally {
                            setLoading(false);
                        }
                    },
                    auto_select: false,
                    cancel_on_tap_outside: true,
                    use_fedcm_for_prompt: false,
                });

                const container = document.getElementById('googleRegisterBtnContainer');
                if (container) {
                    window.google.accounts.id.renderButton(container, {
                        type: 'standard',
                        theme: 'outline',
                        size: 'large',
                        text: 'signup_with',
                        shape: 'rectangular',
                        logo_alignment: 'left',
                        width: container.clientWidth || 384,
                    });
                }
            } catch (err) {
                console.error('Error al inicializar Google Sign-In para registro:', err);
            }
        };

        if (!showOtp) {
            initializeGoogle();
        }
    }, [showOtp]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        if (password !== confirmPassword) {
            setError("Las contraseñas no coinciden");
            return;
        }
        setLoading(true);
        try {
            await base44.auth.register({ email, password });
            setShowOtp(true);
        } catch (err) {
            setError(err.message || "Error al registrar");
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async () => {
        setError("");
        setLoading(true);
        try {
            const result = await base44.auth.verifyOtp({ email, otpCode });
            if (result?.access_token) {
                base44.auth.setToken(result.access_token);
            }
            window.location.href = "/";
        } catch (err) {
            setError(err.message || "Código de verificación inválido");
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        setError("");
        try {
            await base44.auth.resendOtp(email);
            toast({
                title: "Código enviado",
                description: "Revisa tu correo para el nuevo código.",
            });
        } catch (err) {
            setError(err.message || "Error al reenviar código");
        }
    };

    if (showOtp) {
        return (
            <AuthLayout
                icon={Mail}
                title="Verifica tu correo"
                subtitle={`Enviamos un código a ${email}`}
            >
                {error && (
                    <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                        {error}
                    </div>
                )}
                <div className="flex justify-center mb-6">
                    <InputOTP
                        maxLength={6}
                        value={otpCode}
                        onChange={setOtpCode}
                        autoFocus
                        autoComplete="one-time-code"
                    >
                        <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                        </InputOTPGroup>
                    </InputOTP>
                </div>
                <Button
                    className="w-full h-12 font-medium"
                    onClick={handleVerify}
                    disabled={loading || otpCode.length < 6}
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Verificando...
                        </>
                    ) : (
                        "Verificar"
                    )}
                </Button>
                <p className="text-center text-sm text-muted-foreground mt-4">
                    ¿No recibiste el código?{" "}
                    <button onClick={handleResend} className="text-primary font-medium hover:underline">
                        Reenviar
                    </button>
                </p>
            </AuthLayout>
        );
    }

    return (
        <AuthLayout
            icon={UserPlus}
            title="Crea tu cuenta"
            subtitle="Regístrate para comenzar"
            footer={
                <>
                    ¿Ya tienes cuenta?{" "}
                    <Link to="/login" className="text-primary font-medium hover:underline">
                        Iniciar sesión
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
                    <Label htmlFor="password">Contraseña</Label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
                        <Input
                            id="password"
                            type="password"
                            autoComplete="new-password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="pl-10 h-12"
                            required
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="confirm">Confirmar Contraseña</Label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
                        <Input
                            id="confirm"
                            type="password"
                            autoComplete="new-password"
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="pl-10 h-12"
                            required
                        />
                    </div>
                </div>
                <Button type="submit" className="w-full h-12 font-medium" disabled={loading}>
                    {loading ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Creando cuenta...
                        </>
                    ) : (
                        "Crear cuenta"
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
                <div id="googleRegisterBtnContainer" className="w-full flex justify-center" />
            </div>
        </AuthLayout>
    );
}