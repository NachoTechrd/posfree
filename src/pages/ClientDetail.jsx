import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Phone, Mail, MapPin, FileText, Receipt, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/shared/StatusBadge";
import { formatCurrency, formatDate } from "@/lib/formatters";

export default function ClientDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const { data: clients = [] } = useQuery({
        queryKey: ["clients"],
        queryFn: () => base44.entities.Client.list(),
    });
    const client = clients.find((c) => c.id === id);

    const { data: quotes = [] } = useQuery({
        queryKey: ["quotes"],
        queryFn: () => base44.entities.Quote.list("-created_date"),
    });

    const { data: invoices = [] } = useQuery({
        queryKey: ["invoices"],
        queryFn: () => base44.entities.Invoice.list("-created_date"),
    });

    const clientQuotes = quotes.filter((q) => q.client_id === id);
    const clientInvoices = invoices.filter((i) => i.client_id === id);

    // All payments across all client invoices
    const allPayments = clientInvoices.flatMap((inv) =>
        (inv.payments || []).map((p) => ({
            ...p,
            invoice_number: inv.invoice_number,
            invoice_id: inv.id,
        }))
    ).sort((a, b) => new Date(b.date) - new Date(a.date));

    const totalPaid = allPayments.reduce((sum, p) => sum + p.amount, 0);
    const totalBalance = clientInvoices.reduce((sum, inv) => sum + (inv.balance_due ?? 0), 0);

    if (!client) {
        return (
            <div className="p-8 text-center text-muted-foreground">
                <p>Cliente no encontrado</p>
                <Button variant="outline" onClick={() => navigate("/clients")} className="mt-4">Volver</Button>
            </div>
        );
    }

    return (
        <div className="p-4 lg:p-8 max-w-5xl mx-auto space-y-6">
            <Button variant="ghost" onClick={() => navigate("/clients")} className="gap-2">
                <ArrowLeft className="w-4 h-4" /> Clientes
            </Button>

            <div className="bg-card rounded-xl border border-border p-6">
                <h1 className="text-2xl font-bold text-foreground">{client.name}</h1>
                <div className="flex flex-wrap gap-4 mt-3 text-sm text-muted-foreground">
                    {client.phone && <span className="flex items-center gap-1.5"><Phone className="w-4 h-4" />{client.phone}</span>}
                    {client.email && <span className="flex items-center gap-1.5"><Mail className="w-4 h-4" />{client.email}</span>}
                    {client.address && <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" />{client.address}</span>}
                </div>
            </div>

            {/* Quotes */}
            <div className="bg-card rounded-xl border border-border">
                <div className="p-5 border-b border-border flex items-center gap-2">
                    <FileText className="w-4 h-4 text-primary" />
                    <h2 className="font-semibold">Cotizaciones ({clientQuotes.length})</h2>
                </div>
                <div className="divide-y divide-border">
                    {clientQuotes.length === 0 ? (
                        <p className="p-5 text-sm text-muted-foreground text-center">Sin cotizaciones</p>
                    ) : clientQuotes.map((q) => (
                        <div key={q.id} className="p-4 flex justify-between items-center hover:bg-secondary/50 cursor-pointer" onClick={() => navigate(`/quotes/${q.id}`)}>
                            <div>
                                <p className="text-sm font-medium">{q.quote_number}</p>
                                <p className="text-xs text-muted-foreground">{formatDate(q.created_date)}</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-sm font-semibold">{formatCurrency(q.total)}</span>
                                <StatusBadge status={q.status} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Invoices */}
            <div className="bg-card rounded-xl border border-border">
                <div className="p-5 border-b border-border flex items-center gap-2">
                    <Receipt className="w-4 h-4 text-primary" />
                    <h2 className="font-semibold">Facturas ({clientInvoices.length})</h2>
                </div>
                <div className="divide-y divide-border">
                    {clientInvoices.length === 0 ? (
                        <p className="p-5 text-sm text-muted-foreground text-center">Sin facturas</p>
                    ) : clientInvoices.map((inv) => (
                        <div key={inv.id} className="p-4 flex justify-between items-center hover:bg-secondary/50 cursor-pointer" onClick={() => navigate(`/invoices/${inv.id}`)}>
                            <div>
                                <p className="text-sm font-medium">{inv.invoice_number}</p>
                                <p className="text-xs text-muted-foreground">{formatDate(inv.issue_date)}</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="text-right">
                                    <p className="text-sm font-semibold">{formatCurrency(inv.total)}</p>
                                    {inv.balance_due > 0 && (
                                        <p className="text-xs text-destructive font-medium">Saldo: {formatCurrency(inv.balance_due)}</p>
                                    )}
                                </div>
                                <StatusBadge status={inv.status} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Payment History */}
            <div className="bg-card rounded-xl border border-border">
                <div className="p-5 border-b border-border flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-primary" />
                        <h2 className="font-semibold">Historial de Abonos ({allPayments.length})</h2>
                    </div>
                    {allPayments.length > 0 && (
                        <div className="flex gap-4 text-sm">
                            <span className="text-muted-foreground">Total abonado: <span className="font-bold text-green-600">{formatCurrency(totalPaid)}</span></span>
                            {totalBalance > 0 && (
                                <span className="text-muted-foreground">Saldo total: <span className="font-bold text-destructive">{formatCurrency(totalBalance)}</span></span>
                            )}
                        </div>
                    )}
                </div>
                <div className="divide-y divide-border">
                    {allPayments.length === 0 ? (
                        <p className="p-5 text-sm text-muted-foreground text-center">Sin abonos registrados</p>
                    ) : allPayments.map((p, idx) => (
                        <div key={idx} className="p-4 flex justify-between items-center hover:bg-secondary/50 cursor-pointer" onClick={() => navigate(`/invoices/${p.invoice_id}`)}>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                                    <CreditCard className="w-4 h-4 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium capitalize">{p.method}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {formatDate(p.date)} · Factura <span className="font-medium text-primary">{p.invoice_number}</span>
                                        {p.notes && ` · ${p.notes}`}
                                    </p>
                                </div>
                            </div>
                            <span className="text-sm font-bold text-green-600">+{formatCurrency(p.amount)}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}