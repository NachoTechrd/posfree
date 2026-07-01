import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useState } from "react";
import { generateNumber } from "@/lib/formatters";
import DocumentPreview from "@/components/documents/DocumentPreview";

export default function QuoteDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [showDelete, setShowDelete] = useState(false);

    const { data: quotes = [] } = useQuery({
        queryKey: ["quotes"],
        queryFn: () => base44.entities.Quote.list(),
    });
    const quote = quotes.find((q) => q.id === id);

    const { data: settings = [] } = useQuery({
        queryKey: ["settings"],
        queryFn: () => base44.entities.BusinessSettings.list(),
    });
    const biz = settings[0] || {};

    const convertMutation = useMutation({
        mutationFn: async () => {
            const invNum = generateNumber("FAC", biz.next_invoice_number || 1);
            const today = new Date().toISOString().split("T")[0];
            const dueDate = new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0];

            const invoice = await base44.entities.Invoice.create({
                invoice_number: invNum,
                client_id: quote.client_id,
                client_name: quote.client_name,
                items: quote.items,
                subtotal: quote.subtotal,
                tax_rate: quote.tax_rate,
                tax_amount: quote.tax_amount,
                total: quote.total,
                status: "pendiente",
                issue_date: today,
                due_date: dueDate,
                notes: quote.notes,
                payments: [],
                amount_paid: 0,
                balance_due: quote.total,
                quote_id: quote.id,
            });

            await base44.entities.Quote.update(quote.id, {
                converted_to_invoice: true,
                invoice_id: invoice.id,
                status: "aprobada",
            });

            if (biz.id) {
                await base44.entities.BusinessSettings.update(biz.id, {
                    next_invoice_number: (biz.next_invoice_number || 1) + 1,
                });
            }

            return invoice;
        },
        onSuccess: (invoice) => {
            queryClient.invalidateQueries({ queryKey: ["quotes"] });
            queryClient.invalidateQueries({ queryKey: ["invoices"] });
            queryClient.invalidateQueries({ queryKey: ["settings"] });
            navigate(`/invoices/${invoice.id}`);
        },
    });

    const deleteMutation = useMutation({
        mutationFn: () => base44.entities.Quote.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["quotes"] });
            navigate("/quotes");
        },
    });

    if (!quote) {
        return (
            <div className="p-8 text-center text-muted-foreground">
                <p>Cotización no encontrada</p>
                <Button variant="outline" onClick={() => navigate("/quotes")} className="mt-4">Volver</Button>
            </div>
        );
    }

    return (
        <div className="p-4 lg:p-8">
            <DocumentPreview
                type="quote"
                doc={quote}
                biz={biz}
                onEdit={() => navigate(`/quotes/${id}/edit`)}
                onDelete={() => setShowDelete(true)}
                onConvert={() => convertMutation.mutate()}
                isPending={convertMutation.isPending}
            />

            <AlertDialog open={showDelete} onOpenChange={setShowDelete}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Eliminar cotización?</AlertDialogTitle>
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