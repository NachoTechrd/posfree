import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Receipt, Plus, Search, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import EmptyState from "@/components/shared/EmptyState";
import { formatCurrency, formatDate } from "@/lib/formatters";

const categories = [
    { value: "inventario", label: "Inventario" },
    { value: "alquiler", label: "Alquiler" },
    { value: "servicios", label: "Servicios" },
    { value: "marketing", label: "Marketing" },
    { value: "nomina", label: "Nómina" },
    { value: "herramientas", label: "Herramientas" },
    { value: "transporte", label: "Transporte" },
    { value: "otro", label: "Otro" },
];

const businessUnits = ["NachoTechRD", "POSENT PRO", "Whabot Pro", "NTDESWEB", "General"];

const emptyExpense = {
    description: "",
    amount: "",
    expense_date: new Date().toISOString().split("T")[0],
    category: "otro",
    business_unit: "NachoTechRD",
    supplier: "",
    payment_method: "efectivo",
    notes: "",
};

const categoryColors = {
    inventario: "bg-blue-100 text-blue-700",
    alquiler: "bg-purple-100 text-purple-700",
    servicios: "bg-cyan-100 text-cyan-700",
    marketing: "bg-pink-100 text-pink-700",
    nomina: "bg-orange-100 text-orange-700",
    herramientas: "bg-yellow-100 text-yellow-700",
    transporte: "bg-green-100 text-green-700",
    otro: "bg-gray-100 text-gray-700",
};

export default function Expenses() {
    const queryClient = useQueryClient();
    const [search, setSearch] = useState("");
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(emptyExpense);
    const [deleteId, setDeleteId] = useState(null);

    const { data: expenses = [], isLoading } = useQuery({
        queryKey: ["expenses"],
        queryFn: () => base44.entities.Expense.list("-expense_date"),
    });

    const saveMutation = useMutation({
        mutationFn: (data) => {
            const parsed = { ...data, amount: Number(data.amount) };
            return editing
                ? base44.entities.Expense.update(editing.id, parsed)
                : base44.entities.Expense.create(parsed);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["expenses"] });
            setDialogOpen(false);
            setEditing(null);
            setForm(emptyExpense);
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id) => base44.entities.Expense.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["expenses"] });
            setDeleteId(null);
        },
    });

    const filtered = expenses.filter(
        (e) =>
            e.description?.toLowerCase().includes(search.toLowerCase()) ||
            e.supplier?.toLowerCase().includes(search.toLowerCase()) ||
            e.category?.toLowerCase().includes(search.toLowerCase())
    );

    const totalThisMonth = expenses
        .filter((e) => {
            const d = e.expense_date ? new Date(e.expense_date) : null;
            if (!d) return false;
            const now = new Date();
            return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
        })
        .reduce((s, e) => s + (e.amount || 0), 0);

    const openEdit = (exp) => {
        setEditing(exp);
        setForm({
            description: exp.description || "",
            amount: exp.amount || "",
            expense_date: exp.expense_date || "",
            category: exp.category || "otro",
            business_unit: exp.business_unit || "NachoTechRD",
            supplier: exp.supplier || "",
            payment_method: exp.payment_method || "efectivo",
            notes: exp.notes || "",
        });
        setDialogOpen(true);
    };

    const openNew = () => {
        setEditing(null);
        setForm(emptyExpense);
        setDialogOpen(true);
    };

    return (
        <div className="p-4 lg:p-8 max-w-5xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Gastos</h1>
                    <p className="text-sm text-muted-foreground">
                        {expenses.length} registros · Este mes: <span className="font-semibold text-destructive">{formatCurrency(totalThisMonth)}</span>
                    </p>
                </div>
                <Button onClick={openNew} className="gap-2 shadow-md shadow-primary/20">
                    <Plus className="w-4 h-4" /> Nuevo Gasto
                </Button>
            </div>

            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Buscar gastos..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
            </div>

            {filtered.length === 0 && !isLoading ? (
                <EmptyState
                    icon={Receipt}
                    title="Sin gastos"
                    description="Registra los gastos de tu negocio."
                    actionLabel="Nuevo Gasto"
                    onAction={openNew}
                />
            ) : (
                <div className="space-y-2">
                    {filtered.map((exp) => (
                        <div key={exp.id} className="bg-card rounded-xl border border-border p-4 flex items-center justify-between hover:shadow-md transition-shadow">
                            <div className="min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <p className="font-semibold text-foreground">{exp.description}</p>
                                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${categoryColors[exp.category] || "bg-gray-100 text-gray-700"}`}>
                                        {categories.find((c) => c.value === exp.category)?.label || exp.category}
                                    </span>
                                    {exp.business_unit && <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">{exp.business_unit}</span>}
                                </div>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                    {formatDate(exp.expense_date)}
                                    {exp.supplier && ` · ${exp.supplier}`}
                                    {exp.payment_method && ` · ${exp.payment_method}`}
                                </p>
                                {exp.notes && <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{exp.notes}</p>}
                            </div>
                            <div className="flex items-center gap-3 ml-4">
                                <p className="text-lg font-bold text-destructive">{formatCurrency(exp.amount)}</p>
                                <div className="flex gap-1">
                                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(exp)}>
                                        <Pencil className="w-3.5 h-3.5" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setDeleteId(exp.id)}>
                                        <Trash2 className="w-3.5 h-3.5 text-destructive" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Form Dialog */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>{editing ? "Editar Gasto" : "Nuevo Gasto"}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label>Descripción *</Label>
                            <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Descripción del gasto" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>Monto *</Label>
                                <Input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} placeholder="0.00" />
                            </div>
                            <div>
                                <Label>Fecha *</Label>
                                <Input type="date" value={form.expense_date} onChange={(e) => setForm({ ...form, expense_date: e.target.value })} />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>Categoría</Label>
                                <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        {categories.map((c) => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label>Método de Pago</Label>
                                <Select value={form.payment_method} onValueChange={(v) => setForm({ ...form, payment_method: v })}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="efectivo">Efectivo</SelectItem>
                                        <SelectItem value="transferencia">Transferencia</SelectItem>
                                        <SelectItem value="tarjeta">Tarjeta</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>Unidad de Negocio</Label>
                                <Select value={form.business_unit} onValueChange={(v) => setForm({ ...form, business_unit: v })}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        {businessUnits.map((u) => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label>Proveedor</Label>
                                <Input value={form.supplier} onChange={(e) => setForm({ ...form, supplier: e.target.value })} placeholder="Nombre del proveedor" />
                            </div>
                        </div>
                        <div>
                            <Label>Notas</Label>
                            <Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Notas adicionales..." rows={2} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
                        <Button onClick={() => saveMutation.mutate(form)} disabled={!form.description || !form.amount || saveMutation.isPending}>
                            {saveMutation.isPending ? "Guardando..." : "Guardar"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Eliminar gasto?</AlertDialogTitle>
                        <AlertDialogDescription>Esta acción no se puede deshacer.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => deleteMutation.mutate(deleteId)} className="bg-destructive text-destructive-foreground">Eliminar</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}