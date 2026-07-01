import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Package, Plus, Search, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import EmptyState from "@/components/shared/EmptyState";
import { formatCurrency } from "@/lib/formatters";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader, AlertDialogTitle
} from "@/components/ui/alert-dialog";

const categories = [
    { value: "producto", label: "Producto" },
    { value: "servicio", label: "Servicio" },
    { value: "instalacion", label: "Instalación" },
    { value: "mantenimiento", label: "Mantenimiento" },
    { value: "consultoria", label: "Consultoría" },
    { value: "otro", label: "Otro" },
];

const businessUnits = ["NachoTechRD", "POSENT PRO", "Whabot Pro", "NTDESWEB", "General"];
const emptyProduct = { name: "", description: "", price: "", cost_price: "", sku: "", category: "producto", business_unit: "NachoTechRD", stock_quantity: 0, low_stock_alert: 3 };

export default function Products() {
    const queryClient = useQueryClient();
    const [search, setSearch] = useState("");
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(emptyProduct);
    const [deleteId, setDeleteId] = useState(null);

    const { data: products = [], isLoading } = useQuery({
        queryKey: ["products"],
        queryFn: () => base44.entities.Product.list("-created_date"),
    });

    const saveMutation = useMutation({
        mutationFn: (data) => {
            const parsed = { ...data, price: Number(data.price), cost_price: data.cost_price ? Number(data.cost_price) : undefined, stock_quantity: Number(data.stock_quantity || 0), low_stock_alert: Number(data.low_stock_alert || 3) };
            return editing ? base44.entities.Product.update(editing.id, parsed) : base44.entities.Product.create(parsed);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
            setDialogOpen(false);
            setEditing(null);
            setForm(emptyProduct);
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id) => base44.entities.Product.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
            setDeleteId(null);
        },
    });

    const filtered = products.filter((p) =>
        p.name?.toLowerCase().includes(search.toLowerCase()) ||
        p.description?.toLowerCase().includes(search.toLowerCase()) ||
        p.category?.toLowerCase().includes(search.toLowerCase())
    );

    const openEdit = (product) => {
        setEditing(product);
        setForm({ name: product.name || "", description: product.description || "", price: product.price || "", cost_price: product.cost_price || "", sku: product.sku || "", category: product.category || "producto", business_unit: product.business_unit || "NachoTechRD", stock_quantity: product.stock_quantity ?? 0, low_stock_alert: product.low_stock_alert ?? 3 });
        setDialogOpen(true);
    };

    const openNew = () => {
        setEditing(null);
        setForm(emptyProduct);
        setDialogOpen(true);
    };

    return (
        <div className="p-4 lg:p-8 max-w-5xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Productos y Servicios</h1>
                    <p className="text-sm text-muted-foreground">{products.length} registrados</p>
                </div>
                <Button onClick={openNew} className="gap-2 shadow-md shadow-primary/20">
                    <Plus className="w-4 h-4" /> Nuevo Producto
                </Button>
            </div>

            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Buscar productos..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
            </div>

            {filtered.length === 0 && !isLoading ? (
                <EmptyState
                    icon={Package}
                    title="Sin productos"
                    description="Agrega productos o servicios a tu catálogo."
                    actionLabel="Nuevo Producto"
                    onAction={openNew}
                />
            ) : (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {filtered.map((product) => (
                        <div key={product.id} className="bg-card rounded-xl border border-border p-4 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-2">
                                <Badge variant="secondary" className="text-xs capitalize">{product.category?.replace("_", " ")}</Badge>
                                <div className="flex gap-1">
                                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(product)}>
                                        <Pencil className="w-3.5 h-3.5" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setDeleteId(product.id)}>
                                        <Trash2 className="w-3.5 h-3.5 text-destructive" />
                                    </Button>
                                </div>
                            </div>
                            <h3 className="font-semibold text-foreground">{product.name}</h3>
                            {product.sku && <p className="text-xs text-muted-foreground font-mono">SKU: {product.sku}</p>}
                            {product.description && (
                                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{product.description}</p>
                            )}
                            <p className="text-lg font-bold text-primary mt-3">{formatCurrency(product.price)}</p>
                            {product.cost_price > 0 && (
                                <p className="text-xs text-muted-foreground">Costo: {formatCurrency(product.cost_price)}</p>
                            )}
                            <div className="flex items-center justify-between mt-2">
                                <span className="text-xs text-muted-foreground">Stock: <span className={product.stock_quantity <= product.low_stock_alert ? "text-destructive font-semibold" : ""}>{product.stock_quantity ?? 0}</span></span>
                                {product.business_unit && <Badge variant="outline" className="text-xs">{product.business_unit}</Badge>}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editing ? "Editar Producto" : "Nuevo Producto"}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label>Nombre *</Label>
                            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nombre del producto" />
                        </div>
                        <div>
                            <Label>Descripción</Label>
                            <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Descripción" />
                        </div>
                        <div>
                            <Label>SKU / Código</Label>
                            <Input value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} placeholder="Ej: PROD-001" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>Precio de Venta *</Label>
                                <Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="0.00" />
                            </div>
                            <div>
                                <Label>Precio de Costo</Label>
                                <Input type="number" value={form.cost_price} onChange={(e) => setForm({ ...form, cost_price: e.target.value })} placeholder="0.00" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>Stock Actual</Label>
                                <Input type="number" value={form.stock_quantity} onChange={(e) => setForm({ ...form, stock_quantity: e.target.value })} placeholder="0" />
                            </div>
                            <div>
                                <Label>Alerta Stock Mínimo</Label>
                                <Input type="number" value={form.low_stock_alert} onChange={(e) => setForm({ ...form, low_stock_alert: e.target.value })} placeholder="3" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>Categoría</Label>
                                <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        {categories.map((c) => (
                                            <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label>Unidad de Negocio</Label>
                                <Select value={form.business_unit} onValueChange={(v) => setForm({ ...form, business_unit: v })}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        {businessUnits.map((u) => (
                                            <SelectItem key={u} value={u}>{u}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
                        <Button onClick={() => saveMutation.mutate(form)} disabled={!form.name || !form.price || saveMutation.isPending}>
                            {saveMutation.isPending ? "Guardando..." : "Guardar"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Eliminar producto?</AlertDialogTitle>
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