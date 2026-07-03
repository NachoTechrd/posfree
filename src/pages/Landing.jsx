import { useNavigate } from "react-router-dom";
import { FileText, Receipt, Package, DollarSign, ArrowRight, ShieldCheck, Zap, Sparkles, MessageCircle, Users, TrendingUp, Star, CheckCircle, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Landing() {
    const navigate = useNavigate();

    const features = [
        {
            icon: Receipt,
            color: "from-violet-500 to-purple-600",
            glow: "shadow-violet-500/25",
            title: "Facturación Ilimitada",
            desc: "Genera facturas al contado o a crédito con QR y código de barras. Impresión en ticket o formato clásico en segundos.",
        },
        {
            icon: Package,
            color: "from-blue-500 to-cyan-500",
            glow: "shadow-blue-500/25",
            title: "Control de Inventario",
            desc: "Catálogo con fotos, SKU, precios y alertas de stock mínimo. Nunca más te quedes sin mercancía.",
        },
        {
            icon: FileText,
            color: "from-emerald-500 to-teal-500",
            glow: "shadow-emerald-500/25",
            title: "Cotizaciones Rápidas",
            desc: "Envía presupuestos en PDF. Conviértelos en facturas de venta con un solo clic en cuestión de segundos.",
        },
        {
            icon: DollarSign,
            color: "from-amber-500 to-orange-500",
            glow: "shadow-amber-500/25",
            title: "Gastos y Caja Diaria",
            desc: "Registra salidas de dinero y mira tu efectivo real del día al instante para evitar pérdidas invisibles.",
        },
    ];

    const stats = [
        { value: "100%", label: "Gratuito para siempre" },
        { value: "5 min", label: "Para iniciar y facturar" },
        { value: "0 DOP", label: "Sin cargos ocultos" },
    ];

    const benefits = [
        "Sin tarjeta de crédito requerida",
        "Acceso desde cualquier dispositivo",
        "Datos seguros en la nube",
        "Sin publicidad invasiva",
        "Soporte en español",
        "Listo para República Dominicana",
    ];

    return (
        <div className="min-h-screen bg-[#06080f] text-white font-sans flex flex-col overflow-x-hidden">

            {/* Animated Background Layer */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-[-200px] left-[-200px] w-[700px] h-[700px] bg-violet-700/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-150px] right-[-150px] w-[600px] h-[600px] bg-blue-600/8 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-indigo-600/5 rounded-full blur-[80px]" />
            </div>

            {/* Header / Navbar */}
            <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#06080f]/80 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <img src="/posent-logo.png" alt="POSENT Logo" className="h-8 w-auto" />
                        <span className="font-extrabold text-xl tracking-tight text-white">
                            POSENT <span className="text-white/40 font-light">Free</span>
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button
                            variant="ghost"
                            onClick={() => navigate("/login")}
                            className="text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 transition-all"
                        >
                            Iniciar Sesión
                        </Button>
                        <Button
                            onClick={() => navigate("/register")}
                            className="text-sm font-bold bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg shadow-violet-500/20 border-0 transition-all hover:scale-[1.03]"
                        >
                            Empezar Gratis
                        </Button>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative z-10 pt-16 pb-24 md:pt-28 md:pb-36 text-center">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-sm font-semibold text-violet-300">
                        <Sparkles className="w-4 h-4" />
                        100% Gratis · Sin tarjetas · Sin límite de tiempo
                    </div>

                    {/* Headline */}
                    <div className="space-y-4">
                        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tighter leading-[0.95] text-white">
                            El sistema de ventas
                            <br />
                            <span className="bg-gradient-to-r from-violet-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                                que tu negocio merece.
                            </span>
                        </h1>
                        <p className="text-lg sm:text-xl text-white/50 max-w-2xl mx-auto leading-relaxed font-light">
                            Facturación, inventario, cotizaciones y control de caja en un solo lugar.
                            Diseñado para comercios y tiendas de República Dominicana.
                        </p>
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-2">
                        <Button
                            size="lg"
                            onClick={() => navigate("/register")}
                            className="w-full sm:w-auto h-14 px-10 text-base font-bold bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-xl shadow-violet-500/30 border-0 hover:scale-[1.03] transition-all duration-200 flex gap-2.5"
                        >
                            Crear mi Cuenta Gratis
                            <ArrowRight className="w-5 h-5" />
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            onClick={() => navigate("/login")}
                            className="w-full sm:w-auto h-14 px-10 text-base font-semibold border-white/10 text-white/70 bg-white/5 hover:bg-white/10 hover:text-white hover:border-white/20 transition-all"
                        >
                            Ver Demo
                        </Button>
                    </div>

                    {/* Stats Bar */}
                    <div className="pt-6 flex flex-col sm:flex-row justify-center items-center gap-8 sm:gap-16">
                        {stats.map((s, i) => (
                            <div key={i} className="text-center">
                                <div className="text-3xl font-black bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">{s.value}</div>
                                <div className="text-xs text-white/40 mt-1 uppercase tracking-widest font-medium">{s.label}</div>
                            </div>
                        ))}
                    </div>

                    {/* App Preview */}
                    <div className="pt-8 max-w-4xl mx-auto">
                        <div className="relative rounded-2xl overflow-hidden border border-white/8 shadow-2xl shadow-black/60">
                            {/* Chrome bar */}
                            <div className="bg-[#0f111a] px-4 py-3 flex items-center gap-2 border-b border-white/5">
                                <div className="flex gap-1.5">
                                    <div className="w-3 h-3 rounded-full bg-red-500/60" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                                    <div className="w-3 h-3 rounded-full bg-green-500/60" />
                                </div>
                                <div className="flex-1 mx-4 bg-white/5 rounded-md px-3 py-1 text-xs text-white/30 font-mono text-left">
                                    free.posentrd.com/dashboard
                                </div>
                            </div>
                            {/* Dashboard Mock */}
                            <div className="bg-[#0a0c16] p-6 aspect-[16/8] flex flex-col gap-4">
                                <div className="grid grid-cols-4 gap-3">
                                    {[
                                        { label: "Ventas Hoy", value: "RD$12,450", color: "from-violet-600/20 to-violet-600/5", border: "border-violet-500/20", text: "text-violet-400" },
                                        { label: "Facturas", value: "24", color: "from-blue-600/20 to-blue-600/5", border: "border-blue-500/20", text: "text-blue-400" },
                                        { label: "Productos", value: "138", color: "from-emerald-600/20 to-emerald-600/5", border: "border-emerald-500/20", text: "text-emerald-400" },
                                        { label: "Clientes", value: "67", color: "from-amber-600/20 to-amber-600/5", border: "border-amber-500/20", text: "text-amber-400" },
                                    ].map((card, i) => (
                                        <div key={i} className={`bg-gradient-to-b ${card.color} rounded-xl border ${card.border} p-3`}>
                                            <div className="text-white/40 text-xs mb-1">{card.label}</div>
                                            <div className={`text-xl font-black ${card.text}`}>{card.value}</div>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex-1 grid grid-cols-3 gap-3">
                                    <div className="col-span-2 bg-white/3 rounded-xl border border-white/5 p-3 flex flex-col gap-2">
                                        <div className="text-white/30 text-xs">Últimas Facturas</div>
                                        {["Farmacia Don Pedro", "Almacén El Parque", "Tienda Rosy"].map((n, i) => (
                                            <div key={i} className="flex justify-between items-center py-1 border-b border-white/5 last:border-0">
                                                <span className="text-white/60 text-xs">{n}</span>
                                                <span className="text-emerald-400 text-xs font-bold">RD${(Math.random() * 5000 + 500).toFixed(0)}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="bg-white/3 rounded-xl border border-white/5 p-3">
                                        <div className="text-white/30 text-xs mb-2">Estado Caja</div>
                                        <div className="text-2xl font-black text-emerald-400">RD$8,200</div>
                                        <div className="text-white/30 text-xs mt-1">efectivo en mano</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="relative z-10 py-24 border-t border-white/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-white/50 uppercase tracking-widest">
                            Funcionalidades
                        </div>
                        <h2 className="text-4xl font-black tracking-tight text-white">
                            Todo lo que necesitas para{" "}
                            <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
                                crecer tu negocio
                            </span>
                        </h2>
                        <p className="text-white/40 text-lg">Herramientas profesionales listas para usar en cualquier dispositivo, desde el primer minuto.</p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {features.map((f, i) => (
                            <div
                                key={i}
                                className="group relative bg-white/3 rounded-2xl border border-white/8 p-6 hover:bg-white/6 hover:border-white/15 transition-all duration-300 hover:-translate-y-2 cursor-default"
                            >
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} shadow-lg ${f.glow} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                                    <f.icon className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-base font-bold text-white mb-2">{f.title}</h3>
                                <p className="text-sm text-white/45 leading-relaxed">{f.desc}</p>
                                <div className="mt-4 flex items-center gap-1 text-xs text-violet-400 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                                    Explorar <ChevronRight className="w-3 h-3" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Benefits / Why Free Section */}
            <section className="relative z-10 py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="space-y-6">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-400 uppercase tracking-widest">
                                <ShieldCheck className="w-3.5 h-3.5" /> Sin trampa
                            </div>
                            <h2 className="text-4xl font-black tracking-tight text-white leading-tight">
                                Gratuito de verdad.
                                <br />
                                <span className="text-white/40 font-light">No hay letras pequeñas.</span>
                            </h2>
                            <p className="text-white/50 text-lg leading-relaxed">
                                Nuestra misión es digitalizar los pequeños comercios y tiendas de República Dominicana.
                                Las funciones esenciales de POSENT Free son y serán siempre gratuitas.
                                Cuando crezcas, tienes <span className="text-violet-400 font-semibold">POSENT PRO</span> esperándote.
                            </p>
                            <div className="grid grid-cols-2 gap-3">
                                {benefits.map((b, i) => (
                                    <div key={i} className="flex items-center gap-2.5">
                                        <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                                        <span className="text-sm text-white/60">{b}</span>
                                    </div>
                                ))}
                            </div>
                            <Button
                                size="lg"
                                onClick={() => navigate("/register")}
                                className="mt-2 h-13 px-8 font-bold bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg shadow-violet-500/20 border-0 hover:scale-[1.02] transition-all flex gap-2"
                            >
                                Comenzar Ahora — Es Gratis <ArrowRight className="w-4 h-4" />
                            </Button>
                        </div>
                        <div className="space-y-4">
                            {[
                                { icon: Zap, color: "text-violet-400", bg: "bg-violet-500/10 border-violet-500/20", title: "Listo en 5 minutos", desc: "Regístrate, crea tu negocio y emite tu primera factura sin necesidad de tutoriales." },
                                { icon: Users, color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20", title: "Para todo tu equipo", desc: "Agrega empleados y cajeros con roles y permisos diferenciados sin costos adicionales." },
                                { icon: TrendingUp, color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20", title: "Reportes en tiempo real", desc: "Ve tus ventas del día, semana y mes. Toma mejores decisiones con datos reales de tu negocio." },
                                { icon: MessageCircle, color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20", title: "Integración con Whabot", desc: "Conecta con Whabot Pro para enviar facturas y alertas de cobro por WhatsApp automáticamente." },
                            ].map((item, i) => (
                                <div key={i} className={`flex gap-4 p-4 rounded-xl border ${item.bg} bg-white/2 hover:bg-white/4 transition-all`}>
                                    <div className={`w-10 h-10 rounded-lg ${item.bg} flex items-center justify-center shrink-0`}>
                                        <item.icon className={`w-5 h-5 ${item.color}`} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white text-sm">{item.title}</h4>
                                        <p className="text-white/45 text-xs mt-0.5 leading-relaxed">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Social Proof / Testimonials Section */}
            <section className="relative z-10 py-20 border-t border-white/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
                    <div>
                        <div className="flex justify-center gap-1 mb-3">
                            {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />)}
                        </div>
                        <h2 className="text-3xl font-black text-white">Comerciantes que ya llevan el control</h2>
                        <p className="text-white/40 mt-2">Únete a los negocios que ahorraron horas de trabajo cada semana.</p>
                    </div>
                    <div className="grid sm:grid-cols-3 gap-5">
                        {[
                            { quote: "Antes llevaba todo en papel y me perdía facturas. Ahora con POSENT sé exactamente cuánto tengo en caja cada día.", name: "Carmen V.", biz: "Minimarket Los Pinos" },
                            { quote: "El control de inventario me salvó. Las alertas de stock me dicen antes de quedarme sin mercancía. Increíble para ser gratis.", name: "Roberto M.", biz: "Ferretería San Juan" },
                            { quote: "Mis clientes me piden factura en PDF y yo la genero en 10 segundos. Profesional al 100% sin pagar nada.", name: "Ana L.", biz: "Boutique Latina" },
                        ].map((t, i) => (
                            <div key={i} className="bg-white/3 rounded-2xl border border-white/8 p-6 text-left hover:bg-white/5 transition-all">
                                <div className="flex gap-0.5 mb-4">
                                    {[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 text-amber-400 fill-amber-400" />)}
                                </div>
                                <p className="text-white/60 text-sm leading-relaxed italic mb-4">"{t.quote}"</p>
                                <div>
                                    <div className="text-white font-bold text-sm">{t.name}</div>
                                    <div className="text-white/30 text-xs">{t.biz}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="relative z-10 py-24 md:py-32">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-violet-600/20 to-indigo-600/20 rounded-3xl blur-3xl" />
                        <div className="relative bg-gradient-to-br from-white/5 to-white/2 rounded-3xl border border-white/10 p-12 md:p-16 space-y-6">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-xs font-semibold text-violet-300">
                                <Sparkles className="w-3.5 h-3.5" /> Empieza hoy mismo
                            </div>
                            <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-white">
                                Tu negocio merece
                                <br />
                                <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
                                    herramientas de verdad.
                                </span>
                            </h2>
                            <p className="text-white/50 text-lg max-w-xl mx-auto">
                                Sin cargos ocultos, sin tarjetas, sin excusas. Regístrate ahora y emite tu primera factura en menos de 5 minutos.
                            </p>
                            <Button
                                size="lg"
                                onClick={() => navigate("/register")}
                                className="h-14 px-12 text-base font-bold bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-2xl shadow-violet-500/30 border-0 hover:scale-[1.04] transition-all duration-200 flex gap-2 mx-auto"
                            >
                                Crear mi Cuenta Gratis
                                <ArrowRight className="w-5 h-5" />
                            </Button>
                            <p className="text-white/25 text-sm">100% gratis · Sin tarjeta · Listo en 5 min</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="relative z-10 mt-auto border-t border-white/5 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2.5">
                        <img src="/posent-logo.png" alt="POSENT Logo" className="h-6 w-auto brightness-0 invert opacity-40" />
                        <span className="text-sm font-bold text-white/40">POSENT Free</span>
                    </div>
                    <p className="text-xs text-white/20">© {new Date().getFullYear()} POSENT. Todos los derechos reservados.</p>
                    <div className="flex gap-4 text-xs text-white/30">
                        <a href="/terminos" className="hover:text-white/60 transition-colors">Términos</a>
                        <a href="/privacidad" className="hover:text-white/60 transition-colors">Privacidad</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
