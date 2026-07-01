import { Menu, Plus, Moon, Sun, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/AuthContext";

export default function TopBar({ onMenuClick }) {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [dark, setDark] = useState(() => document.documentElement.classList.contains("dark"));

    useEffect(() => {
        document.documentElement.classList.toggle("dark", dark);
    }, [dark]);

    return (
        <header className="sticky top-0 z-30 bg-card/80 backdrop-blur-md border-b border-border px-4 lg:px-6 h-14 flex items-center justify-between gap-4">
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMenuClick}>
                <Menu className="w-5 h-5" />
            </Button>

            <div className="flex-1" />

            <div className="flex items-center gap-2">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setDark(!dark)}
                    className="text-muted-foreground"
                >
                    {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </Button>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button size="sm" className="gap-2 shadow-md shadow-primary/20">
                            <Plus className="w-4 h-4" />
                            <span className="hidden sm:inline">Crear</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => navigate("/quotes/new")}>
                            Nueva Cotización
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate("/invoices/new")}>
                            Nueva Factura
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate("/clients/new")}>
                            Nuevo Cliente
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate("/products/new")}>
                            Nuevo Producto
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                {user && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="relative h-8 w-8 rounded-full border border-border p-0 overflow-hidden ml-1">
                                {user.fotoUrl ? (
                                    <img src={user.fotoUrl} alt={user.nombre || "User"} className="h-full w-full object-cover" />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center bg-secondary text-secondary-foreground font-semibold text-xs uppercase">
                                        {(user.nombre || user.email || "U").slice(0, 2)}
                                    </div>
                                )}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <div className="flex items-center justify-start gap-2 p-2.5">
                                <div className="flex flex-col space-y-0.5 leading-none">
                                    {user.nombre && <p className="font-semibold text-sm text-foreground">{user.nombre}</p>}
                                    {user.email && <p className="text-xs text-muted-foreground truncate max-w-[180px]">{user.email}</p>}
                                </div>
                            </div>
                            <DropdownMenuItem className="border-t border-border focus:bg-destructive/10 focus:text-destructive text-destructive cursor-pointer gap-2 mt-1" onClick={() => logout()}>
                                <LogOut className="w-4 h-4" />
                                <span>Cerrar sesión</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </div>
        </header>
    );
}