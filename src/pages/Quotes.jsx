import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { useNavigate } from "react-router-dom";
import { FileText, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EmptyState from "@/components/shared/EmptyState";
import StatusBadge from "@/components/shared/StatusBadge";
import { formatCurrency, formatDate } from "@/lib/formatters";

export default function Quotes() {
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    const { data: quotes = [], isLoading } = useQuery({
        queryKey: ["quotes"],
        queryFn: () => base44.entities.Quote.list("-created_date"),
    });

    const filtered = quotes.filter((q) => {
        const matchesSearch = q.quote_number?.toLowerCase().includes(search.toLowerCase()) ||
            q.client_name?.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter === "all" || q.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="p-4 lg:p-8 max-w-5xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Cotizaciones</h1>
                    <p className="text-sm text-muted-foreground">{quotes.length} cotizaciones</p>
                </div>
                <Button onClick={() => navigate("/quotes/new")} className="gap-2 shadow-md shadow-primary/20">
                    <Plus className="w-4 h-4" /> Nueva Cotización
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
                        <TabsTrigger value="borrador">Borrador</TabsTrigger>
                        <TabsTrigger value="enviada">Enviada</TabsTrigger>
                        <TabsTrigger value="aprobada">Aprobada</TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>

            {filtered.length === 0 && !isLoading ? (
                <EmptyState
                    icon={FileText}
                    title="Sin cotizaciones"
                    description="Crea tu primera cotización en menos de un minuto."
                    actionLabel="Nueva Cotización"
                    onAction={() => navigate("/quotes/new")}
                />
            ) : (
                <div className="space-y-2">
                    {filtered.map((q) => (
                        <div
                            key={q.id}
                            className="bg-card rounded-xl border border-border p-4 flex items-center justify-between hover:shadow-md transition-shadow cursor-pointer"
                            onClick={() => navigate(`/quotes/${q.id}`)}
                        >
                            <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                    <p className="font-semibold text-foreground">{q.quote_number || "Sin número"}</p>
                                    <StatusBadge status={q.status} />
                                </div>
                                <p className="text-sm text-muted-foreground mt-0.5">{q.client_name}</p>
                                <p className="text-xs text-muted-foreground">{formatDate(q.created_date)}</p>
                            </div>
                            <p className="text-lg font-bold text-foreground ml-4">{formatCurrency(q.total)}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}