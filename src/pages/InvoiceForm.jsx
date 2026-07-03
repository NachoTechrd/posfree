import { useState, useEffect, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { toast } from "sonner";
import { getLimit } from "@/lib/utils";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ClientSelector from "@/components/documents/ClientSelector";
import LineItemsEditor from "@/components/documents/LineItemsEditor";
import DocumentTotals from "@/components/documents/DocumentTotals";
import { generateNumber } from "@/lib/formatters";

export default function InvoiceForm() {
    const { user } = useAuth();
    const myBusiness = user?.negocio?.nombre || user?.nombre || "Mi Negocio";
    const businessUnits = [myBusiness, "General"];

    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const isEdit = !!id;

    const { data: settings = [] } = useQuery({
        queryKey: ["settings"],
        queryFn: () => base44.entities.BusinessSettings.list(),
    });
    const biz = settings[0] || {};

    const { data: invoices = [] } = useQuery({
        queryKey: ["invoices"],
        queryFn: () => base44.entities.Invoice.list(),
    });
    const existing = invoices.find((inv) => inv.id === id);

    const today = new Date().toISOString().split("T")[0];
    const defaultDue = new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0];

    const [form, setForm] = useState({
        client_id: "",
        client_name: "",
        items: [],
        tax_rate: 18,
        notes: "",
        issue_date: today,
        due_date: defaultDue,
        status: "pendiente",
        business_unit: myBusiness,
        lead_source: "",
        payment_method: "",
    });

    useEffect(() => {
        if (existing) {
            setForm({
                client_id: existing.client_id || "",
                client_name: existing.client_name || "",
                items: existing.items || [],
                tax_rate: existing.tax_rate ?? 18,
                notes: existing.notes || "",
                issue_date: existing.issue_date || today,
                due_date: existing.due_date || defaultDue,
                status: existing.status || "pendiente",
                business_unit: existing.business_unit || myBusiness,
                lead_source: existing.lead_source || "",
                payment_method: existing.payment_method || "",
            });
        } else if (biz.tax_rate != null) {
            setForm((f) => ({ ...f, tax_rate: biz.tax_rate }));
        }
    }, [existing, biz.tax_rate]);

    const subtotal = useMemo(() => form.items.reduce((s, i) => s + (i.subtotal || 0), 0), [form.items]);
    const taxAmount = subtotal * (form.tax_rate / 100);
    const total = subtotal + taxAmount;

    const saveMutation = useMutation({
        mutationFn: async (data) => {
            if (isEdit) {
                return base44.entities.Invoice.update(id, data);
            } else {
                const invNum = generateNumber("FAC", biz.next_invoice_number || 1);
                const result = await base44.entities.Invoice.create({ ...data, invoice_number: invNum, payments: [], amount_paid: 0, balance_due: data.total });
                if (biz.id) {
                    await base44.entities.BusinessSettings.update(biz.id, {
                        next_invoice_number: (biz.next_invoice_number || 1) + 1,
                    });
                }
                return result;
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["invoices"] });
            queryClient.invalidateQueries({ queryKey: ["settings"] });
            navigate("/invoices");
        },
    });

    const handleSave = () => {
        if (!isEdit) {
            const limit = getLimit(user, 'invoices');
            
            // Filtrar facturas creadas este mes
            const thisMonth = new Date().getMonth();
            const thisYear = new Date().getFullYear();
            const monthlyInvoices = invoices.filter(inv => {
                if (!inv.created_date) return false;
                const d = new Date(inv.created_date);
                return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
            });

            if (monthlyInvoices.length >= limit) {
                toast.error(`Límite mensual alcanzado: Tu plan actual permite un máximo de ${limit} facturas al mes. Para facturar sin límites, por favor actualiza a POSENT PRO.`);
                return;
            }
        }
        saveMutation.mutate({
            ...form,
            subtotal,
            tax_amount: taxAmount,
            total,
        });
    };

    return (
        <div className="p-4 lg:p-8 max-w-3xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <Button variant="ghost" onClick={() => navigate("/invoices")} className="gap-2">
                    <ArrowLeft className="w-4 h-4" /> Facturas
                </Button>
                <Button onClick={handleSave} disabled={!form.client_id || form.items.length === 0 || saveMutation.isPending} className="gap-2 shadow-md shadow-primary/20">
                    <Save className="w-4 h-4" />
                    {saveMutation.isPending ? "Guardando..." : "Guardar"}
                </Button>
            </div>

            <h1 className="text-2xl font-bold text-foreground">
                {isEdit ? "Editar Factura" : "Nueva Factura"}
            </h1>

            <div className="bg-card rounded-xl border border-border p-5 space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                    <ClientSelector
                        clientId={form.client_id}
                        clientName={form.client_name}
                        onChange={(cId, cName) => setForm({ ...form, client_id: cId, client_name: cName })}
                    />
                    <div>
                        <Label>Estado</Label>
                        <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="pendiente">Pendiente</SelectItem>
                                <SelectItem value="abono">Abono</SelectItem>
                                <SelectItem value="pagada">Pagada</SelectItem>
                                <SelectItem value="vencida">Vencida</SelectItem>
                                <SelectItem value="anulada">Anulada</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="grid sm:grid-cols-3 gap-4">
                    <div>
                        <Label>Unidad de Negocio</Label>
                        <Select value={form.business_unit} onValueChange={(v) => setForm({ ...form, business_unit: v })}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                {businessUnits.map((unit) => (
                                    <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label>Canal de Origen</Label>
                        <Select value={form.lead_source} onValueChange={(v) => setForm({ ...form, lead_source: v })}>
                            <SelectTrigger><SelectValue placeholder="Seleccionar..." /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                                <SelectItem value="TikTok">TikTok</SelectItem>
                                <SelectItem value="Instagram">Instagram</SelectItem>
                                <SelectItem value="Facebook">Facebook</SelectItem>
                                <SelectItem value="Referido">Referido</SelectItem>
                                <SelectItem value="Presencial">Presencial</SelectItem>
                                <SelectItem value="Web">Web</SelectItem>
                                <SelectItem value="Otro">Otro</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label>Método de Pago</Label>
                        <Select value={form.payment_method} onValueChange={(v) => setForm({ ...form, payment_method: v })}>
                            <SelectTrigger><SelectValue placeholder="Seleccionar..." /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="efectivo">Efectivo</SelectItem>
                                <SelectItem value="transferencia">Transferencia</SelectItem>
                                <SelectItem value="tarjeta">Tarjeta</SelectItem>
                                <SelectItem value="mixto">Mixto</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="grid sm:grid-cols-3 gap-4">
                    <div>
                        <Label>Fecha emisión</Label>
                        <Input type="date" value={form.issue_date} onChange={(e) => setForm({ ...form, issue_date: e.target.value })} />
                    </div>
                    <div>
                        <Label>Fecha vencimiento</Label>
                        <Input type="date" value={form.due_date} onChange={(e) => setForm({ ...form, due_date: e.target.value })} />
                    </div>
                    <div>
                        <Label>ITBIS (%)</Label>
                        <Input type="number" value={form.tax_rate} onChange={(e) => setForm({ ...form, tax_rate: Number(e.target.value) })} min="0" max="100" />
                    </div>
                </div>

                <LineItemsEditor items={form.items} onChange={(items) => setForm({ ...form, items })} />

                <DocumentTotals subtotal={subtotal} taxRate={form.tax_rate} taxAmount={taxAmount} total={total} onTaxRateChange={(v) => setForm({ ...form, tax_rate: v })} />

                <div>
                    <Label>Notas</Label>
                    <Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Notas adicionales..." rows={3} />
                </div>
            </div>
        </div>
    );
}