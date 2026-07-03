import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
    LayoutDashboard, Users, Package, FileText, Receipt,
    BarChart3, Settings, X, Zap, Wallet, Plug, LogOut, ShieldAlert
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/AuthContext";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter
} from "@/components/ui/dialog";

const navItems = [
    { path: "/", label: "Dashboard", icon: LayoutDashboard },
    { path: "/clients", label: "Clientes", icon: Users },
    { path: "/products", label: "Productos", icon: Package },
    { path: "/quotes", label: "Cotizaciones", icon: FileText },
    { path: "/invoices", label: "Facturas", icon: Receipt },
    { path: "/expenses", label: "Gastos", icon: Wallet },
    { path: "/integrations", label: "Integraciones", icon: Plug },
    { path: "/reports", label: "Reportes", icon: BarChart3 },
    { path: "/settings", label: "Configuración", icon: Settings },
];

const proNavItems = [
    { label: "Multi-sucursales", icon: Zap },
    { label: "Factura Fiscal (DGII)", icon: Zap },
    { label: "Reparaciones Pro", icon: Zap },
    { label: "Contabilidad Completa", icon: Zap },
];

export default function Sidebar({ open, onClose }) {
    const location = useLocation();
    const { logout } = useAuth();
    const [proDialogOpen, setProDialogOpen] = useState(false);

    return (
        <>
            {open && (
                <div
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
                    onClick={onClose}
                />
            )}
            <aside className={cn(
                "fixed top-0 left-0 z-50 h-full w-64 bg-card border-r border-border flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-auto",
                open ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="p-6 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2.5" onClick={onClose}>
                        <img src="/posent-logo.png" alt="POSENT Logo" className="w-8 h-8 object-contain" />
                        <div>
                            <h1 className="text-lg font-bold tracking-tight text-foreground">POSENT Free</h1>
                        </div>
                    </Link>
                    <Button variant="ghost" size="icon" className="lg:hidden" onClick={onClose}>
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path ||
                            (item.path !== "/" && location.pathname.startsWith(item.path));
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={onClose}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                                    isActive
                                        ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                                        : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                                )}
                            >
                                <item.icon className="w-4.5 h-4.5" />
                                {item.label}
                            </Link>
                        );
                    })}

                    <div className="pt-4 border-t border-border mt-4">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-3 mb-2">Exclusivo de POSENT PRO</p>
                        {proNavItems.map((item) => (
                            <button
                                key={item.label}
                                onClick={() => {
                                    onClose();
                                    setProDialogOpen(true);
                                }}
                                className="flex w-full items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 text-muted-foreground/60 hover:text-primary hover:bg-secondary cursor-pointer"
                            >
                                <div className="flex items-center gap-3">
                                    <item.icon className="w-4.5 h-4.5 text-muted-foreground/40" />
                                    <span>{item.label}</span>
                                </div>
                                <span className="text-[9px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full font-bold">PRO</span>
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => logout()}
                        className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 text-destructive hover:bg-destructive/10 cursor-pointer mt-4"
                    >
                        <LogOut className="w-4.5 h-4.5" />
                        Cerrar sesión
                    </button>
                </nav>

                <div className="p-4 mx-3 mb-3 rounded-lg bg-secondary/50 text-center flex flex-col gap-1">
                    <p className="text-[10px] text-muted-foreground">
                        Estás en la versión gratuita de
                    </p>
                    <p className="text-xs font-bold text-foreground">POSENT Free</p>
                    <a 
                        href="https://posentrd.com" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-[11px] text-primary font-bold hover:underline mt-1"
                    >
                        Prueba POSENT PRO 🚀
                    </a>
                </div>
            </aside>

            <Dialog open={proDialogOpen} onOpenChange={setProDialogOpen}>
                <DialogContent className="sm:max-w-[425px] bg-card border-border">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-primary font-bold text-lg">
                            <ShieldAlert className="w-5 h-5 text-primary" />
                            ¡Pásate a POSENT PRO! 🚀
                        </DialogTitle>
                        <DialogDescription className="pt-2 text-sm text-muted-foreground">
                            Esta función está disponible de manera ilimitada en la versión completa de **POSENT PRO**. 
                            <br /><br />
                            Disfruta de:
                            <ul className="list-disc list-inside mt-2 space-y-1 text-xs">
                                <li>Multi-sucursales e inventario compartido</li>
                                <li>Facturación fiscal con RNC e ITBIS (DGII)</li>
                                <li>Módulo Pro de Órdenes y Reparaciones</li>
                                <li>Contabilidad avanzada y reportes financieros</li>
                                <li>Productos y facturas ilimitadas</li>
                            </ul>
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="mt-4 flex sm:justify-between gap-2">
                        <Button variant="ghost" onClick={() => setProDialogOpen(false)}>
                            Seguir en Free
                        </Button>
                        <a href="https://posentrd.com/subscription" target="_blank" rel="noopener noreferrer">
                            <Button className="font-bold shadow-md shadow-primary/20">
                                Ver Planes PRO 💳
                            </Button>
                        </a>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}