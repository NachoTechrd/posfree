import { Link, useLocation } from "react-router-dom";
import {
    LayoutDashboard, Users, Package, FileText, Receipt,
    BarChart3, Settings, X, Zap, Wallet, Plug
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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

export default function Sidebar({ open, onClose }) {
    const location = useLocation();

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
                        <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
                            <Zap className="w-5 h-5 text-primary-foreground" />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold tracking-tight text-foreground">NachoFacturas</h1>
                        </div>
                    </Link>
                    <Button variant="ghost" size="icon" className="lg:hidden" onClick={onClose}>
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                <nav className="flex-1 px-3 space-y-1">
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
                </nav>

                <div className="p-4 mx-3 mb-3 rounded-lg bg-secondary/50 text-center">
                    <p className="text-[10px] text-muted-foreground">
                        Powered by <span className="font-semibold text-foreground">NachoTechRD</span>
                    </p>
                </div>
            </aside>
        </>
    );
}