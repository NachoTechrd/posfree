import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Search, User, UserPlus, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

export default function ClientSelector({ clientId, clientName, onChange }) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [newClientOpen, setNewClientOpen] = useState(false);
    const [newClient, setNewClient] = useState({ name: "", phone: "", email: "" });

    const queryClient = useQueryClient();

    const { data: clients = [] } = useQuery({
        queryKey: ["clients"],
        queryFn: () => base44.entities.Client.list("-created_date"),
    });

    const createMutation = useMutation({
        mutationFn: (data) => base44.entities.Client.create(data),
        onSuccess: (created) => {
            queryClient.invalidateQueries({ queryKey: ["clients"] });
            onChange(created.id, created.name);
            setNewClientOpen(false);
            setOpen(false);
            setNewClient({ name: "", phone: "", email: "" });
        },
    });

    const filtered = clients.filter((c) =>
        c.name?.toLowerCase().includes(search.toLowerCase()) ||
        c.phone?.includes(search)
    );

    return (
        <div>
            <Label>Cliente *</Label>
            <div className="flex gap-2">
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button variant="outline" className="flex-1 justify-start gap-2 font-normal">
                            <User className="w-4 h-4 text-muted-foreground" />
                            {clientName || "Seleccionar cliente..."}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-72 p-2" align="start">
                        <div className="relative mb-2">
                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                            <Input
                                placeholder="Buscar por nombre o teléfono..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-8"
                                autoFocus
                            />
                        </div>
                        <div className="max-h-48 overflow-y-auto space-y-0.5">
                            {filtered.map((c) => (
                                <button
                                    key={c.id}
                                    className="w-full text-left px-3 py-2 rounded-md hover:bg-secondary text-sm"
                                    onClick={() => {
                                        onChange(c.id, c.name);
                                        setOpen(false);
                                        setSearch("");
                                    }}
                                >
                                    <p className="font-medium">{c.name}</p>
                                    {c.phone && <p className="text-xs text-muted-foreground">{c.phone}</p>}
                                </button>
                            ))}
                            {filtered.length === 0 && (
                                <p className="text-xs text-muted-foreground text-center py-3">Sin resultados</p>
                            )}
                        </div>
                        <div className="border-t border-border mt-2 pt-2">
                            <button
                                className="w-full flex items-center gap-2 px-3 py-2 rounded-md hover:bg-primary/10 text-sm text-primary font-medium"
                                onClick={() => { setNewClientOpen(true); setOpen(false); }}
                            >
                                <UserPlus className="w-4 h-4" /> Crear nuevo cliente
                            </button>
                        </div>
                    </PopoverContent>
                </Popover>

                {clientId && (
                    <Button variant="ghost" size="icon" onClick={() => onChange("", "")} className="text-muted-foreground">
                        <X className="w-4 h-4" />
                    </Button>
                )}
            </div>

            {/* Quick create dialog */}
            <Dialog open={newClientOpen} onOpenChange={setNewClientOpen}>
                <DialogContent className="max-w-sm">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <UserPlus className="w-4 h-4" /> Nuevo Cliente
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-3">
                        <div>
                            <Label>Nombre *</Label>
                            <Input
                                value={newClient.name}
                                onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                                placeholder="Nombre completo"
                                autoFocus
                            />
                        </div>
                        <div>
                            <Label>Teléfono</Label>
                            <Input
                                value={newClient.phone}
                                onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                                placeholder="+18091234567"
                            />
                        </div>
                        <div>
                            <Label>Correo</Label>
                            <Input
                                value={newClient.email}
                                onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                                placeholder="correo@ejemplo.com"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setNewClientOpen(false)}>Cancelar</Button>
                        <Button
                            onClick={() => createMutation.mutate(newClient)}
                            disabled={!newClient.name || createMutation.isPending}
                        >
                            {createMutation.isPending ? "Guardando..." : "Crear y seleccionar"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}