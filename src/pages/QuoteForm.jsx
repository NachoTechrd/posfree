import { useState, useEffect, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
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

export default function QuoteForm() {
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

    const { data: quotes = [] } = useQuery({
        queryKey: ["quotes"],
        queryFn: () => base44.entities.Quote.list(),
        enabled: isEdit,
    });
    const existing = quotes.find((q) => q.id === id);

    const [form, setForm] = useState({
        client_id: "",
        client_name: "",
        items: [],
        tax_rate: 18,
        notes: "",
        valid_until: "",
        status: "borrador",
        business_unit: myBusiness,
        lead_source: "",
    });

    useEffect(() => {
        if (existing) {
            setForm({
                client_id: existing.client_id || "",
                client_name: existing.client_name || "",
                items: existing.items || [],
                tax_rate: existing.tax_rate ?? 18,
                notes: existing.notes || "",
                valid_until: existing.valid_until || "",
                status: existing.status || "borrador",
                business_unit: existing.business_unit || myBusiness,
                lead_source: existing.lead_source || "",
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
                return base44.entities.Quote.update(id, data);
            } else {
                let quoteNum = generateNumber("COT", biz.next_quote_number || 1);
                const result = await base44.entities.Quote.create({ ...data, quote_number: quoteNum });
                if (biz.id) {
                    await base44.entities.BusinessSettings.update(biz.id, {
                        next_quote_number: (biz.next_quote_number || 1) + 1,
                    });
                }
                return result;
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["quotes"] });
            queryClient.invalidateQueries({ queryKey: ["settings"] });
            navigate("/quotes");
        },
    });

    const handleSave = () => {
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
                <Button variant="ghost" onClick={() => navigate("/quotes")} className="gap-2">
                    <ArrowLeft className="w-4 h-4" /> Cotizaciones
                </Button>
                <Button onClick={handleSave} disabled={!form.client_id || form.items.length === 0 || saveMutation.isPending} className="gap-2 shadow-md shadow-primary/20">
                    <Save className="w-4 h-4" />
                    {saveMutation.isPending ? "Guardando..." : "Guardar"}
                </Button>
            </div>

            <h1 className="text-2xl font-bold text-foreground">
                {isEdit ? "Editar Cotización" : "Nueva Cotización"}
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
                                <SelectItem value="borrador">Borrador</SelectItem>
                                <SelectItem value="enviada">Enviada</SelectItem>
                                <SelectItem value="aprobada">Aprobada</SelectItem>
                                <SelectItem value="rechazada">Rechazada</SelectItem>
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
                        <Label>ITBIS (%)</Label>
                        <Input type="number" value={form.tax_rate} onChange={(e) => setForm({ ...form, tax_rate: Number(e.target.value) })} min="0" max="100" />
                    </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                        <Label>Válida hasta</Label>
                        <Input type="date" value={form.valid_until} onChange={(e) => setForm({ ...form, valid_until: e.target.value })} />
                    </div>
                </div>

                <LineItemsEditor items={form.items} onChange={(items) => setForm({ ...form, items })} />

                <DocumentTotals subtotal={subtotal} taxRate={form.tax_rate} taxAmount={taxAmount} total={total} onTaxRateChange={(v) => setForm({ ...form, tax_rate: v })} />

                <div>
                    <Label>Notas y Condiciones</Label>
                    <Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Notas adicionales..." rows={3} />
                </div>
            </div>
        </div>
    );
}