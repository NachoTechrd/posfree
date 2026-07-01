import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Plus, Trash2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/formatters";
import {
    Popover, PopoverContent, PopoverTrigger
} from "@/components/ui/popover";

const CATEGORY_LABELS = {
    todos: "Todos",
    instalacion: "📹 Cámaras",
    mantenimiento: "🔧 Reparación",
    servicio: "💻 Servicios Web/Soft",
    producto: "📦 Productos",
    consultoria: "🎓 Consultoría",
    otro: "Otro",
};

export default function LineItemsEditor({ items, onChange }) {
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("todos");

    const { data: products = [] } = useQuery({
        queryKey: ["products"],
        queryFn: () => base44.entities.Product.list("-created_date"),
    });

    const filteredProducts = products.filter((p) => {
        const matchSearch = p.name?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchCat = categoryFilter === "todos" || p.category === categoryFilter;
        return matchSearch && matchCat;
    });

    const addProduct = (product) => {
        const newItem = {
            product_id: product.id,
            name: product.name,
            description: product.description || "",
            quantity: 1,
            unit_price: product.price,
            discount_percent: 0,
            subtotal: product.price,
        };
        onChange([...items, newItem]);
        setSearchOpen(false);
        setSearchTerm("");
    };

    const addBlankItem = () => {
        onChange([...items, {
            product_id: "",
            name: "",
            description: "",
            quantity: 1,
            unit_price: 0,
            discount_percent: 0,
            subtotal: 0,
        }]);
    };

    const updateItem = (index, field, value) => {
        const updated = [...items];
        updated[index] = { ...updated[index], [field]: value };
        const qty = updated[index].quantity || 0;
        const price = updated[index].unit_price || 0;
        const discount = updated[index].discount_percent || 0;
        updated[index].subtotal = qty * price * (1 - discount / 100);
        onChange(updated);
    };

    const removeItem = (index) => {
        onChange(items.filter((_, i) => i !== index));
    };

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground">Líneas</h3>
                <div className="flex gap-2">
                    <Popover open={searchOpen} onOpenChange={setSearchOpen}>
                        <PopoverTrigger asChild>
                            <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                                <Search className="w-3 h-3" /> Buscar Producto
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80 p-2" align="end">
                            <Input
                                placeholder="Buscar..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="mb-2"
                                autoFocus
                            />
                            <div className="flex flex-wrap gap-1 mb-2">
                                {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                                    <button
                                        key={key}
                                        onClick={() => setCategoryFilter(key)}
                                        className={`text-xs px-2 py-1 rounded-full border transition-colors ${categoryFilter === key
                                                ? "bg-primary text-primary-foreground border-primary"
                                                : "bg-secondary text-secondary-foreground border-border hover:bg-secondary/80"
                                            }`}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>
                            <div className="max-h-52 overflow-y-auto space-y-1">
                                {filteredProducts.map((p) => (
                                    <button
                                        key={p.id}
                                        className="w-full text-left px-3 py-2 rounded-md hover:bg-secondary text-sm flex justify-between"
                                        onClick={() => addProduct(p)}
                                    >
                                        <span className="truncate">{p.name}</span>
                                        <span className="text-muted-foreground ml-2">{formatCurrency(p.price)}</span>
                                    </button>
                                ))}
                                {filteredProducts.length === 0 && (
                                    <p className="text-xs text-muted-foreground text-center py-4">Sin resultados</p>
                                )}
                            </div>
                        </PopoverContent>
                    </Popover>
                    <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={addBlankItem}>
                        <Plus className="w-3 h-3" /> Línea
                    </Button>
                </div>
            </div>

            {items.length === 0 ? (
                <div className="text-center py-8 text-sm text-muted-foreground border border-dashed border-border rounded-lg">
                    Agrega productos o líneas personalizadas
                </div>
            ) : (
                <div className="space-y-2">
                    {/* Header - hidden on mobile */}
                    <div className="hidden md:grid md:grid-cols-12 gap-2 text-xs font-medium text-muted-foreground px-1">
                        <span className="col-span-4">Descripción</span>
                        <span className="col-span-2">Cantidad</span>
                        <span className="col-span-2">Precio</span>
                        <span className="col-span-1">Desc.%</span>
                        <span className="col-span-2 text-right">Subtotal</span>
                        <span className="col-span-1"></span>
                    </div>

                    {items.map((item, idx) => (
                        <div key={idx} className="bg-secondary/30 rounded-lg p-3 space-y-2 md:space-y-0 md:grid md:grid-cols-12 md:gap-2 md:items-center">
                            <div className="md:col-span-4">
                                <Input
                                    value={item.name}
                                    onChange={(e) => updateItem(idx, "name", e.target.value)}
                                    placeholder="Nombre"
                                    className="text-sm"
                                />
                            </div>
                            <div className="grid grid-cols-3 gap-2 md:col-span-5 md:grid-cols-3">
                                <Input
                                    type="number"
                                    value={item.quantity}
                                    onChange={(e) => updateItem(idx, "quantity", Number(e.target.value))}
                                    placeholder="Cant."
                                    min="0"
                                    className="text-sm"
                                />
                                <Input
                                    type="number"
                                    value={item.unit_price}
                                    onChange={(e) => updateItem(idx, "unit_price", Number(e.target.value))}
                                    placeholder="Precio"
                                    min="0"
                                    step="0.01"
                                    className="text-sm"
                                />
                                <Input
                                    type="number"
                                    value={item.discount_percent}
                                    onChange={(e) => updateItem(idx, "discount_percent", Number(e.target.value))}
                                    placeholder="%"
                                    min="0"
                                    max="100"
                                    className="text-sm"
                                />
                            </div>
                            <div className="md:col-span-2 text-right font-semibold text-sm">
                                {formatCurrency(item.subtotal)}
                            </div>
                            <div className="md:col-span-1 flex justify-end">
                                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => removeItem(idx)}>
                                    <Trash2 className="w-3.5 h-3.5 text-destructive" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}