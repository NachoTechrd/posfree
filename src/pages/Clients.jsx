import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import { toast } from "sonner";
import { getLimit } from "@/lib/utils";
import { Users, Plus, Search, Phone, Mail, MapPin, Trash2, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import EmptyState from "@/components/shared/EmptyState";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader, AlertDialogTitle
} from "@/components/ui/alert-dialog";

const emptyClient = { name: "", phone: "", email: "", address: "", notes: "" };

export default function Clients() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [search, setSearch] = useState("");
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(emptyClient);
    const [deleteId, setDeleteId] = useState(null);

    const { data: clients = [], isLoading } = useQuery({
        queryKey: ["clients"],
        queryFn: () => base44.entities.Client.list("-created_date"),
    });

    const saveMutation = useMutation({
        mutationFn: (data) =>
            editing
                ? base44.entities.Client.update(editing.id, data)
                : base44.entities.Client.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["clients"] });
            setDialogOpen(false);
            setEditing(null);
            setForm(emptyClient);
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id) => base44.entities.Client.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["clients"] });
            setDeleteId(null);
        },
    });

    const filtered = clients.filter((c) =>
        c.name?.toLowerCase().includes(search.toLowerCase()) ||
        c.email?.toLowerCase().includes(search.toLowerCase()) ||
        c.phone?.includes(search)
    );

    const openEdit = (client) => {
        setEditing(client);
        setForm({ name: client.name || "", phone: client.phone || "", email: client.email || "", address: client.address || "", notes: client.notes || "" });
        setDialogOpen(true);
    };

    const openNew = () => {
        const limit = getLimit(user, 'clients');
        if (clients.length >= limit) {
            toast.error(`Límite alcanzado: Tu plan actual permite un máximo de ${limit} clientes. Para registrar más, por favor actualiza a POSENT PRO.`);
            return;
        }
        setEditing(null);
        setForm(emptyClient);
        setDialogOpen(true);
    };

    return (
        <div className="p-4 lg:p-8 max-w-5xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Clientes</h1>
                    <p className="text-sm text-muted-foreground">{clients.length} clientes registrados</p>
                </div>
                <Button onClick={openNew} className="gap-2 shadow-md shadow-primary/20">
                    <Plus className="w-4 h-4" /> Nuevo Cliente
                </Button>
            </div>

            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                    placeholder="Buscar clientes..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10"
                />
            </div>

            {filtered.length === 0 && !isLoading ? (
                <EmptyState
                    icon={Users}
                    title="Sin clientes"
                    description="Agrega tu primer cliente para comenzar a crear cotizaciones y facturas."
                    actionLabel="Nuevo Cliente"
                    onAction={openNew}
                />
            ) : (
                <div className="grid gap-3">
                    {filtered.map((client) => (
                        <div
                            key={client.id}
                            className="bg-card rounded-xl border border-border p-4 flex items-center justify-between hover:shadow-md transition-shadow cursor-pointer"
                            onClick={() => navigate(`/clients/${client.id}`)}
                        >
                            <div className="space-y-1 min-w-0">
                                <p className="font-semibold text-foreground truncate">{client.name}</p>
                                <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                                    {client.phone && (
                                        <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{client.phone}</span>
                                    )}
                                    {client.email && (
                                        <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{client.email}</span>
                                    )}
                                    {client.address && (
                                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{client.address}</span>
                                    )}
                                </div>
                            </div>
                            <div className="flex gap-1 ml-2">
                                <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); openEdit(client); }}>
                                    <Pencil className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); setDeleteId(client.id); }}>
                                    <Trash2 className="w-4 h-4 text-destructive" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Client Dialog */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editing ? "Editar Cliente" : "Nuevo Cliente"}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label>Nombre *</Label>
                            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nombre completo" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>Teléfono</Label>
                                <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="809-000-0000" />
                            </div>
                            <div>
                                <Label>Correo</Label>
                                <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="correo@ejemplo.com" />
                            </div>
                        </div>
                        <div>
                            <Label>Dirección</Label>
                            <Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Dirección" />
                        </div>
                        <div>
                            <Label>Notas</Label>
                            <Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Notas adicionales" />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
                        <Button onClick={() => saveMutation.mutate(form)} disabled={!form.name || saveMutation.isPending}>
                            {saveMutation.isPending ? "Guardando..." : "Guardar"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation */}
            <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Eliminar cliente?</AlertDialogTitle>
                        <AlertDialogDescription>Esta acción no se puede deshacer.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => deleteMutation.mutate(deleteId)} className="bg-destructive text-destructive-foreground">
                            Eliminar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}