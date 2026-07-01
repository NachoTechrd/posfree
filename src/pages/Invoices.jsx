import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { useNavigate } from "react-router-dom";
import { Receipt, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EmptyState from "@/components/shared/EmptyState";
import StatusBadge from "@/components/shared/StatusBadge";
import { formatCurrency, formatDate } from "@/lib/formatters";

export default function Invoices() {
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    const { data: invoices = [], isLoading } = useQuery({
        queryKey: ["invoices"],
        queryFn: () => base44.entities.Invoice.list("-created_date"),
    });

    const filtered = invoices.filter((inv) => {
        const matchesSearch = inv.invoice_number?.toLowerCase().includes(search.toLowerCase()) ||
            inv.client_name?.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter === "all" || inv.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="p-4 lg:p-8 max-w-5xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Facturas</h1>
                    <p className="text-sm text-muted-foreground">{invoices.length} facturas</p>
                </div>
                <Button onClick={() => navigate("/invoices/new")} className="gap-2 shadow-md shadow-primary/20">
                    <Plus className="w-4 h-4" /> Nueva Factura
                </Button>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input placeholder="Buscar..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
                </div>
                <Tabs value={statusFilter} onValueChange={setStatusFilter}>
                    <TabsList>
                        <TabsTrigger value="all">Todas</TabsTrigger>
                        <TabsTrigger value="pendiente">Pendiente</TabsTrigger>
                        <TabsTrigger value="abono">Abono</TabsTrigger>
                        <TabsTrigger value="pagada">Pagada</TabsTrigger>
                        <TabsTrigger value="vencida">Vencida</TabsTrigger>
                        <TabsTrigger value="anulada">Anulada</TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>

            {filtered.length === 0 && !isLoading ? (
                <EmptyState
                    icon={Receipt}
                    title="Sin facturas"
                    description="Crea tu primera factura profesional."
                    actionLabel="Nueva Factura"
                    onAction={() => navigate("/invoices/new")}
                />
            ) : (
                <div className="space-y-2">
                    {filtered.map((inv) => (
                        <div
                            key={inv.id}
                            className="bg-card rounded-xl border border-border p-4 flex items-center justify-between hover:shadow-md transition-shadow cursor-pointer"
                            onClick={() => navigate(`/invoices/${inv.id}`)}
                        >
                            <div className="min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <p className="font-semibold text-foreground">{inv.invoice_number || "Sin número"}</p>
                                    <StatusBadge status={inv.status} />
                                    {inv.business_unit && <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">{inv.business_unit}</span>}
                                    {inv.lead_source && <span className="text-xs bg-secondary text-muted-foreground px-2 py-0.5 rounded-full">{inv.lead_source}</span>}
                                </div>
                                <p className="text-sm text-muted-foreground mt-0.5">{inv.client_name}</p>
                                <p className="text-xs text-muted-foreground">Emitida: {formatDate(inv.issue_date)} · Vence: {formatDate(inv.due_date)}</p>
                            </div>
                            <div className="text-right ml-4">
                                <p className="text-lg font-bold text-foreground">{formatCurrency(inv.total)}</p>
                                {inv.balance_due > 0 && inv.status !== "pagada" && (
                                    <p className="text-xs text-amber-600">Pendiente: {formatCurrency(inv.balance_due)}</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}