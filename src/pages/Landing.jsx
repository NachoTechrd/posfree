import { useNavigate } from "react-router-dom";
import { FileText, Receipt, Package, DollarSign, ArrowRight, ShieldCheck, Zap, Sparkles, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Landing() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col overflow-x-hidden">
            {/* Header / Navbar */}
            <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/70 backdrop-blur-md transition-all">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <img src="/posent-logo.png" alt="POSENT Logo" className="h-9 w-auto" />
                        <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-primary to-indigo-600 bg-clip-text text-transparent">
                            POSENT <span className="text-slate-700 font-medium">Free</span>
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" onClick={() => navigate("/login")} className="text-sm font-semibold text-slate-600 hover:text-slate-900">
                            Iniciar Sesión
                        </Button>
                        <Button onClick={() => navigate("/register")} className="shadow-md shadow-primary/10 text-sm font-semibold bg-primary hover:bg-primary/90 text-white">
                            Empezar Gratis
                        </Button>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 bg-gradient-to-b from-indigo-50/40 via-white to-slate-50">
                {/* Decorative gradients */}
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-xs font-semibold text-indigo-700 animate-pulse">
                        <Sparkles className="w-3.5 h-3.5" /> 100% Gratis para siempre y sin tarjetas
                    </div>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-none">
                        Controla tu Facturación, <br />
                        <span className="bg-gradient-to-r from-primary via-indigo-600 to-violet-600 bg-clip-text text-transparent">
                            Inventario y Gastos sin Límites
                        </span>
                    </h1>
                    <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed">
                        El sistema en la nube gratuito diseñado especialmente para tiendas, comercios y pequeños negocios de República Dominicana. Agiliza tus ventas hoy mismo.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
                        <Button size="lg" onClick={() => navigate("/register")} className="w-full sm:w-auto h-12 px-8 text-base font-bold bg-primary hover:bg-primary/95 text-white shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform flex gap-2">
                            Crear mi Cuenta Gratis <ArrowRight className="w-5 h-5" />
                        </Button>
                        <Button size="lg" variant="outline" onClick={() => navigate("/login")} className="w-full sm:w-auto h-12 px-8 text-base font-semibold border-slate-300 text-slate-700 bg-white hover:bg-slate-50">
                            Probar Demo
                        </Button>
                    </div>

                    {/* Screenshot Mockup placeholder with styling */}
                    <div className="pt-12 md:pt-16 max-w-4xl mx-auto">
                        <div className="bg-white rounded-2xl p-2.5 shadow-2xl border border-slate-200/60 overflow-hidden relative group">
                            <div className="aspect-[16/9] bg-gradient-to-tr from-slate-100 to-indigo-50/50 rounded-xl border border-slate-100 flex items-center justify-center overflow-hidden">
                                <div className="p-8 text-center space-y-4">
                                    <div className="inline-flex p-4 bg-primary/10 rounded-2xl text-primary">
                                        <Zap className="w-12 h-12" />
                                    </div>
                                    <p className="text-lg font-bold text-slate-800">Panel de Control Inteligente</p>
                                    <p className="text-sm text-slate-500 max-w-sm">Mira tus ventas del día, el balance en efectivo en tu caja y el estado de tus cuentas por cobrar en tiempo real.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Core Features Section */}
            <section className="py-20 bg-white border-y border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
                        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Todo lo que tu negocio necesita para crecer</h2>
                        <p className="text-slate-600">Herramientas profesionales listas para usar en tu computadora, tablet o teléfono celular.</p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Feature 1 */}
                        <div className="bg-slate-50 rounded-2xl border border-slate-200/80 p-6 hover:shadow-lg transition-all duration-300 group hover:-translate-y-1">
                            <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                                <Receipt className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">Facturación Ilimitada</h3>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                Genera facturas al contado o a crédito. Imprime en formato clásico o ticket con **Códigos QR y de Barras reales** y escaneables de forma nativa.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="bg-slate-50 rounded-2xl border border-slate-200/80 p-6 hover:shadow-lg transition-all duration-300 group hover:-translate-y-1">
                            <div className="w-12 h-12 bg-indigo-500/10 text-indigo-500 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                                <Package className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">Control de Inventario</h3>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                Administra tu catálogo de productos y servicios con **fotos reales**, SKU, precios de costo y venta. Monitorea alertas de stock mínimo para no quedarte sin mercancía.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="bg-slate-50 rounded-2xl border border-slate-200/80 p-6 hover:shadow-lg transition-all duration-300 group hover:-translate-y-1">
                            <div className="w-12 h-12 bg-violet-500/10 text-violet-500 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                                <FileText className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">Cotizaciones Rápidas</h3>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                Envía presupuestos y cotizaciones profesionales por PDF a tus clientes. Conviértelas en facturas de venta con un solo botón en segundos.
                            </p>
                        </div>

                        {/* Feature 4 */}
                        <div className="bg-slate-50 rounded-2xl border border-slate-200/80 p-6 hover:shadow-lg transition-all duration-300 group hover:-translate-y-1">
                            <div className="w-12 h-12 bg-emerald-500/10 text-emerald-500 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                                <DollarSign className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">Gastos y Caja</h3>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                Registra tus salidas de dinero y mantén un cálculo real e inmediato del efectivo en mano del día a día para evitar pérdidas.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Whabot Integration banner */}
            <section className="py-16 bg-gradient-to-r from-emerald-50 via-teal-50 to-indigo-50 border-b border-slate-200">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="space-y-3 text-center md:text-left">
                        <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-xs font-semibold text-emerald-800">
                            <MessageCircle className="w-3.5 h-3.5 fill-current" /> Whabot Pro Sync
                        </div>
                        <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">Conéctalo con tu WhatsApp</h3>
                        <p className="text-slate-600 max-w-xl">
                            ¿Tienes una cuenta de pago de Whabot Pro? Vincúlala de forma exclusiva con tu POSENT Free y envía facturas, alertas de cobro y agradecimientos por WhatsApp de forma automatizada.
                        </p>
                    </div>
                    <Button onClick={() => navigate("/register")} className="h-12 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold shrink-0">
                        Probar Sincronización
                    </Button>
                </div>
            </section>

            {/* Why Free Section */}
            <section className="py-20 bg-slate-50">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">¿Por qué es gratuito?</h2>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
                        Nuestra misión es apoyar la digitalización y el crecimiento de los micro y pequeños negocios en el país. Por eso, las funciones básicas de POSENT Free son y serán siempre gratis. Cuando tu negocio crezca y necesites control avanzado, podrás subir a POSENT PRO.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 max-w-3xl mx-auto">
                        <div className="flex flex-col items-center gap-2">
                            <ShieldCheck className="w-8 h-8 text-primary" />
                            <span className="font-bold text-slate-800">Seguro & Confiable</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <Zap className="w-8 h-8 text-primary" />
                            <span className="font-bold text-slate-800">100% Online</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <Sparkles className="w-8 h-8 text-primary" />
                            <span className="font-bold text-slate-800">Sin Publicidad Molesta</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Bottom CTA Banner */}
            <section className="py-16 md:py-24 bg-gradient-to-r from-primary to-indigo-700 text-white text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10 mix-blend-multiply" />
                <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                    <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Lleva el control de tu negocio al siguiente nivel</h2>
                    <p className="text-indigo-100 text-lg max-w-lg mx-auto">Únete a cientos de comerciantes que ya ahorran horas de trabajo cada semana.</p>
                    <div className="pt-2">
                        <Button size="lg" onClick={() => navigate("/register")} className="h-12 px-8 bg-white hover:bg-slate-100 text-primary font-bold shadow-lg">
                            Crear mi Cuenta Gratis
                        </Button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="mt-auto bg-slate-950 text-slate-400 py-8 border-t border-slate-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <img src="/posent-logo.png" alt="POSENT Logo" className="h-6 w-auto brightness-0 invert opacity-60" />
                        <span className="text-sm font-bold text-slate-300">POSENT Free</span>
                    </div>
                    <p className="text-xs">© {new Date().getFullYear()} POSENT. Todos los derechos reservados.</p>
                </div>
            </footer>
        </div>
    );
}
