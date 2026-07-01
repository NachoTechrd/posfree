import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { BarChart3, TrendingUp, Users, Clock } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StatCard from "@/components/shared/StatCard";
import { formatCurrency } from "@/lib/formatters";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function Reports() {
    const [period, setPeriod] = useState("month");

    const { data: invoices = [] } = useQuery({
        queryKey: ["invoices"],
        queryFn: () => base44.entities.Invoice.list("-created_date"),
    });

    const stats = useMemo(() => {
        const totalRevenue = invoices.filter(i => i.status === "pagada").reduce((s, i) => s + (i.total || 0), 0);
        const totalPending = invoices.filter(i => i.status === "pendiente").reduce((s, i) => s + (i.balance_due || i.total || 0), 0);
        const pendingCount = invoices.filter(i => i.status === "pendiente").length;

        // Group by period
        const grouped = {};
        invoices.forEach((inv) => {
            const date = new Date(inv.issue_date || inv.created_date);
            let key;
            if (period === "day") {
                key = date.toLocaleDateString("es-DO", { day: "2-digit", month: "short" });
            } else if (period === "week") {
                const week = Math.ceil(date.getDate() / 7);
                key = `Sem ${week} - ${date.toLocaleDateString("es-DO", { month: "short" })}`;
            } else {
                key = date.toLocaleDateString("es-DO", { month: "short", year: "2-digit" });
            }
            grouped[key] = (grouped[key] || 0) + (inv.total || 0);
        });

        const chartData = Object.entries(grouped).map(([name, total]) => ({ name, total })).slice(-12);

        // Top clients
        const clientTotals = {};
        invoices.forEach((inv) => {
            clientTotals[inv.client_name] = (clientTotals[inv.client_name] || 0) + (inv.total || 0);
        });
        const topClients = Object.entries(clientTotals)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5)
            .map(([name, total]) => ({ name, total }));

        return { totalRevenue, totalPending, pendingCount, chartData, topClients };
    }, [invoices, period]);

    return (
        <div className="p-4 lg:p-8 max-w-6xl mx-auto space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-foreground">Reportes</h1>
                <p className="text-sm text-muted-foreground">Análisis de ventas y facturación</p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                <StatCard title="Ingresos" value={formatCurrency(stats.totalRevenue)} icon={TrendingUp} />
                <StatCard title="Pendiente" value={formatCurrency(stats.totalPending)} icon={Clock} />
                <StatCard title="Facturas Pendientes" value={stats.pendingCount} icon={BarChart3} />
            </div>

            {/* Chart */}
            <div className="bg-card rounded-xl border border-border p-5">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="font-semibold text-foreground">Ventas</h2>
                    <Tabs value={period} onValueChange={setPeriod}>
                        <TabsList>
                            <TabsTrigger value="day">Día</TabsTrigger>
                            <TabsTrigger value="week">Semana</TabsTrigger>
                            <TabsTrigger value="month">Mes</TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>
                {stats.chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={stats.chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                            <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                            <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                            <Tooltip
                                formatter={(value) => formatCurrency(value)}
                                contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "0.5rem" }}
                            />
                            <Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <p className="text-center py-12 text-sm text-muted-foreground">Sin datos para mostrar</p>
                )}
            </div>

            {/* Top Clients */}
            <div className="bg-card rounded-xl border border-border">
                <div className="p-5 border-b border-border flex items-center gap-2">
                    <Users className="w-4 h-4 text-primary" />
                    <h2 className="font-semibold">Clientes con más compras</h2>
                </div>
                <div className="divide-y divide-border">
                    {stats.topClients.length === 0 ? (
                        <p className="p-5 text-sm text-muted-foreground text-center">Sin datos</p>
                    ) : (
                        stats.topClients.map((client, idx) => (
                            <div key={client.name} className="p-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                                        {idx + 1}
                                    </div>
                                    <p className="font-medium text-foreground">{client.name}</p>
                                </div>
                                <p className="font-semibold">{formatCurrency(client.total)}</p>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}