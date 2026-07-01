import { Menu, Plus, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function TopBar({ onMenuClick }) {
    const navigate = useNavigate();
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
            </div>
        </header>
    );
}