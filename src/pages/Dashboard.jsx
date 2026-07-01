import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { useNavigate } from "react-router-dom";
import { FileText, Receipt, DollarSign, Clock, Plus, ArrowRight, TrendingDown, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import StatCard from "@/components/shared/StatCard";
import StatusBadge from "@/components/shared/StatusBadge";
import { formatCurrency, formatDate } from "@/lib/formatters";

const BUSINESS_UNITS = ["NachoTechRD", "POSENT PRO", "Whabot Pro", "NTDESWEB"];
const LEAD_SOURCES = ["WhatsApp", "TikTok", "Instagram", "Facebook", "Referido", "Presencial", "Web", "Otro"];

const unitColors = {
    "NachoTechRD": "bg-blue-500",
    "POSENT PRO": "bg-purple-500",
    "Whabot Pro": "bg-green-500",
    "NTDESWEB": "bg-orange-500",
};

const sourceIcons = {
    WhatsApp: "💬", TikTok: "🎵", Instagram: "📸", Facebook: "👥",
    Referido: "🤝", Presencial: "🏪", Web: "🌐", Otro: "📋",
};

export default function Dashboard() {
    const navigate = useNavigate();

    const { data: quotes = [] } = useQuery({
        queryKey: ["quotes"],
        queryFn: () => base44.entities.Quote.list("-created_date", 50),
    });

    const { data: invoices = [] } = useQuery({
        queryKey: ["invoices"],
        queryFn: () => base44.entities.Invoice.list("-created_date", 100),
    });

    const { data: expenses = [] } = useQuery({
        queryKey: ["expenses"],
        queryFn: () => base44.entities.Expense.list("-expense_date", 100),
    });

    const totalInvoiced = invoices.reduce((sum, inv) => sum + (inv.total || 0), 0);
    const totalPending = invoices
        .filter((inv) => inv.status === "pendiente" || inv.status === "abono")
        .reduce((sum, inv) => sum + (inv.balance_due || inv.total || 0), 0);
    const recentQuotes = quotes.slice(0, 5);
    const recentInvoices = invoices.slice(0, 5);

    // This month stats
    const now = new Date();
    const thisMonth = (arr, amountKey) =>
        arr.filter((x) => {
            const d = new Date(x.expense_date || x.issue_date || x.created_date);
            return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
        }).reduce((s, x) => s + (x[amountKey] || 0), 0);

    const monthIncome = thisMonth(invoices, "total");
    const monthExpenses = thisMonth(expenses, "amount");
    const monthBalance = monthIncome - monthExpenses;

    // By business unit
    const byUnit = useMemo(() =>
        BUSINESS_UNITS.map((unit) => ({
            unit,
            total: invoices.filter((i) => i.business_unit === unit).reduce((s, i) => s + (i.total || 0), 0),
            count: invoices.filter((i) => i.business_unit === unit).length,
        })).filter((u) => u.count > 0),
        [invoices]
    );

    const maxUnit = byUnit.length ? Math.max(...byUnit.map((u) => u.total)) : 1;

    // By lead source
    const bySource = useMemo(() =>
        LEAD_SOURCES.map((src) => ({
            src,
            total: invoices.filter((i) => i.lead_source === src).reduce((s, i) => s + (i.total || 0), 0),
            count: invoices.filter((i) => i.lead_source === src).length,
        })).filter((s) => s.count > 0).sort((a, b) => b.total - a.total),
        [invoices]
    );

    const maxSource = bySource.length ? Math.max(...bySource.map((s) => s.total)) : 1;

    return (
        <div className="p-4 lg:p-8 space-y-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Dashboard</h1>
                    <p className="text-sm text-muted-foreground mt-1">Resumen de tu negocio</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => navigate("/quotes/new")} className="gap-2">
                        <Plus className="w-4 h-4" /> Cotización
                    </Button>
                    <Button onClick={() => navigate("/invoices/new")} className="gap-2 shadow-md shadow-primary/20">
                        <Plus className="w-4 h-4" /> Factura
                    </Button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard title="Cotizaciones" value={quotes.length} icon={FileText} />
                <StatCard title="Facturas" value={invoices.length} icon={Receipt} />
                <StatCard title="Total Facturado" value={formatCurrency(totalInvoiced)} icon={DollarSign} />
                <StatCard title="Por Cobrar" value={formatCurrency(totalPending)} icon={Clock} />
            </div>

            {/* Monthly balance */}
            <div className="grid sm:grid-cols-3 gap-4">
                <div className="bg-card rounded-xl border border-border p-4">
                    <div className="flex items-center gap-2 mb-1">
                        <TrendingUp className="w-4 h-4 text-success" />
                        <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Ingresos del Mes</span>
                    </div>
                    <p className="text-2xl font-bold text-success">{formatCurrency(monthIncome)}</p>
                </div>
                <div className="bg-card rounded-xl border border-border p-4">
                    <div className="flex items-center gap-2 mb-1">
                        <TrendingDown className="w-4 h-4 text-destructive" />
                        <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Gastos del Mes</span>
                    </div>
                    <p className="text-2xl font-bold text-destructive">{formatCurrency(monthExpenses)}</p>
                </div>
                <div className="bg-card rounded-xl border border-border p-4">
                    <div className="flex items-center gap-2 mb-1">
                        <DollarSign className={`w-4 h-4 ${monthBalance >= 0 ? "text-success" : "text-destructive"}`} />
                        <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Balance del Mes</span>
                    </div>
                    <p className={`text-2xl font-bold ${monthBalance >= 0 ? "text-success" : "text-destructive"}`}>
                        {formatCurrency(monthBalance)}
                    </p>
                </div>
            </div>

            {/* Business Unit + Lead Source */}
            <div className="grid lg:grid-cols-2 gap-6">
                {/* By Business Unit */}
                <div className="bg-card rounded-xl border border-border p-5">
                    <h2 className="font-semibold text-foreground mb-4">Facturado por Unidad de Negocio</h2>
                    {byUnit.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-4">Sin datos aún</p>
                    ) : (
                        <div className="space-y-3">
                            {byUnit.sort((a, b) => b.total - a.total).map(({ unit, total, count }) => (
                                <div key={unit}>
                                    <div className="flex items-center justify-between text-sm mb-1">
                                        <span className="font-medium text-foreground">{unit}</span>
                                        <span className="text-muted-foreground">{formatCurrency(total)} · {count} facturas</span>
                                    </div>
                                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full ${unitColors[unit] || "bg-primary"}`}
                                            style={{ width: `${(total / maxUnit) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* By Lead Source */}
                <div className="bg-card rounded-xl border border-border p-5">
                    <h2 className="font-semibold text-foreground mb-4">Ventas por Canal de Origen</h2>
                    {bySource.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-4">Sin datos aún</p>
                    ) : (
                        <div className="space-y-3">
                            {bySource.map(({ src, total, count }) => (
                                <div key={src}>
                                    <div className="flex items-center justify-between text-sm mb-1">
                                        <span className="font-medium text-foreground">{sourceIcons[src]} {src}</span>
                                        <span className="text-muted-foreground">{formatCurrency(total)} · {count}</span>
                                    </div>
                                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                                        <div className="h-full rounded-full bg-accent" style={{ width: `${(total / maxSource) * 100}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Recent Activity */}
            <div className="grid lg:grid-cols-2 gap-6">
                <div className="bg-card rounded-xl border border-border">
                    <div className="p-5 flex items-center justify-between border-b border-border">
                        <h2 className="font-semibold text-foreground">Cotizaciones Recientes</h2>
                        <Button variant="ghost" size="sm" onClick={() => navigate("/quotes")} className="gap-1 text-xs text-muted-foreground">
                            Ver todas <ArrowRight className="w-3 h-3" />
                        </Button>
                    </div>
                    <div className="divide-y divide-border">
                        {recentQuotes.length === 0 ? (
                            <p className="p-5 text-sm text-muted-foreground text-center">Sin cotizaciones aún</p>
                        ) : (
                            recentQuotes.map((q) => (
                                <div key={q.id} className="p-4 flex items-center justify-between hover:bg-secondary/50 cursor-pointer transition-colors" onClick={() => navigate(`/quotes/${q.id}`)}>
                                    <div>
                                        <p className="text-sm font-medium text-foreground">{q.quote_number || "—"}</p>
                                        <p className="text-xs text-muted-foreground">{q.client_name}</p>
                                    </div>
                                    <div className="text-right flex items-center gap-3">
                                        <span className="text-sm font-semibold">{formatCurrency(q.total)}</span>
                                        <StatusBadge status={q.status} />
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="bg-card rounded-xl border border-border">
                    <div className="p-5 flex items-center justify-between border-b border-border">
                        <h2 className="font-semibold text-foreground">Facturas Recientes</h2>
                        <Button variant="ghost" size="sm" onClick={() => navigate("/invoices")} className="gap-1 text-xs text-muted-foreground">
                            Ver todas <ArrowRight className="w-3 h-3" />
                        </Button>
                    </div>
                    <div className="divide-y divide-border">
                        {recentInvoices.length === 0 ? (
                            <p className="p-5 text-sm text-muted-foreground text-center">Sin facturas aún</p>
                        ) : (
                            recentInvoices.map((inv) => (
                                <div key={inv.id} className="p-4 flex items-center justify-between hover:bg-secondary/50 cursor-pointer transition-colors" onClick={() => navigate(`/invoices/${inv.id}`)}>
                                    <div>
                                        <p className="text-sm font-medium text-foreground">{inv.invoice_number || "—"}</p>
                                        <p className="text-xs text-muted-foreground">{inv.client_name}</p>
                                        {inv.business_unit && <span className="text-xs text-primary">{inv.business_unit}</span>}
                                    </div>
                                    <div className="text-right flex items-center gap-3">
                                        <span className="text-sm font-semibold">{formatCurrency(inv.total)}</span>
                                        <StatusBadge status={inv.status} />
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}