import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { formatCurrency } from "@/lib/formatters";
import DocumentPreview from "@/components/documents/DocumentPreview";

export default function InvoiceDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [showDelete, setShowDelete] = useState(false);
    const [paymentOpen, setPaymentOpen] = useState(false);
    const [payment, setPayment] = useState({
        date: new Date().toISOString().split("T")[0],
        amount: "",
        method: "efectivo",
        notes: "",
    });

    const fillFullAmount = () => {
        if (invoice) {
            setPayment((p) => ({ ...p, amount: String(invoice.balance_due ?? invoice.total) }));
        }
    };

    const { data: invoices = [] } = useQuery({
        queryKey: ["invoices"],
        queryFn: () => base44.entities.Invoice.list(),
    });
    const invoice = invoices.find((inv) => inv.id === id);

    const { data: settings = [] } = useQuery({
        queryKey: ["settings"],
        queryFn: () => base44.entities.BusinessSettings.list(),
    });
    const biz = settings[0] || {};

    const paymentMutation = useMutation({
        mutationFn: async () => {
            const newPayment = { ...payment, amount: Number(payment.amount) };
            const payments = [...(invoice.payments || []), newPayment];
            const amountPaid = payments.reduce((s, p) => s + p.amount, 0);
            const balanceDue = (invoice.total || 0) - amountPaid;
            const status = balanceDue <= 0 ? "pagada" : "pendiente";
            return base44.entities.Invoice.update(id, {
                payments,
                amount_paid: amountPaid,
                balance_due: Math.max(0, balanceDue),
                status,
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["invoices"] });
            setPaymentOpen(false);
            setPayment({ date: new Date().toISOString().split("T")[0], amount: "", method: "efectivo", notes: "" });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: () => base44.entities.Invoice.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["invoices"] });
            navigate("/invoices");
        },
    });

    if (!invoice) {
        return (
            <div className="p-8 text-center text-muted-foreground">
                <p>Factura no encontrada</p>
                <Button variant="outline" onClick={() => navigate("/invoices")} className="mt-4">Volver</Button>
            </div>
        );
    }

    const shareWhatsApp = () => {
        const msg = `*${invoice.invoice_number}*\nCliente: ${invoice.client_name}\nTotal: ${formatCurrency(invoice.total)}\nEstado: ${invoice.status}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, "_blank");
    };

    return (
        <div className="p-4 lg:p-8">
            <DocumentPreview
                type="invoice"
                doc={invoice}
                biz={biz}
                onEdit={() => navigate(`/invoices/${id}/edit`)}
                onDelete={() => setShowDelete(true)}
                onMarkPaid={() => setPaymentOpen(true)}
                onWhatsApp={shareWhatsApp}
                isPending={paymentMutation.isPending}
            />

            {/* Payment Dialog */}
            <Dialog open={paymentOpen} onOpenChange={setPaymentOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Registrar Pago</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        {/* Balance summary */}
                        <div className="bg-secondary/40 rounded-lg p-3 grid grid-cols-3 gap-2 text-center text-sm">
                            <div>
                                <p className="text-muted-foreground text-xs">Total factura</p>
                                <p className="font-bold">{formatCurrency(invoice.total)}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground text-xs">Ya pagado</p>
                                <p className="font-bold text-green-600">{formatCurrency(invoice.amount_paid || 0)}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground text-xs">Saldo pendiente</p>
                                <p className="font-bold text-destructive">{formatCurrency(invoice.balance_due ?? invoice.total)}</p>
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-1">
                                <Label>Monto a pagar *</Label>
                                <button
                                    type="button"
                                    onClick={fillFullAmount}
                                    className="text-xs text-primary font-medium hover:underline"
                                >
                                    Pagar total ({formatCurrency(invoice.balance_due ?? invoice.total)})
                                </button>
                            </div>
                            <Input
                                type="number"
                                value={payment.amount}
                                onChange={(e) => setPayment({ ...payment, amount: e.target.value })}
                                placeholder="0.00"
                                autoFocus
                            />
                            {payment.amount && (
                                <p className="text-xs text-muted-foreground mt-1">
                                    Saldo restante: {formatCurrency(Math.max(0, (invoice.balance_due ?? invoice.total) - Number(payment.amount)))}
                                </p>
                            )}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>Fecha</Label>
                                <Input type="date" value={payment.date} onChange={(e) => setPayment({ ...payment, date: e.target.value })} />
                            </div>
                            <div>
                                <Label>Método</Label>
                                <Select value={payment.method} onValueChange={(v) => setPayment({ ...payment, method: v })}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="efectivo">Efectivo</SelectItem>
                                        <SelectItem value="transferencia">Transferencia</SelectItem>
                                        <SelectItem value="tarjeta">Tarjeta</SelectItem>
                                        <SelectItem value="cheque">Cheque</SelectItem>
                                        <SelectItem value="otro">Otro</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div>
                            <Label>Notas / Referencia</Label>
                            <Input value={payment.notes} onChange={(e) => setPayment({ ...payment, notes: e.target.value })} placeholder="Ej: Transferencia #12345, cuota 1 de 3..." />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setPaymentOpen(false)}>Cancelar</Button>
                        <Button onClick={() => paymentMutation.mutate()} disabled={!payment.amount || paymentMutation.isPending}>
                            {paymentMutation.isPending ? "Guardando..." : "Registrar Pago"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <AlertDialog open={showDelete} onOpenChange={setShowDelete}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Eliminar factura?</AlertDialogTitle>
                        <AlertDialogDescription>Esta acción no se puede deshacer.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => deleteMutation.mutate()} className="bg-destructive text-destructive-foreground">
                            Eliminar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}