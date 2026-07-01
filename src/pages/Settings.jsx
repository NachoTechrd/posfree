import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Save, Upload, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function Settings() {
    const queryClient = useQueryClient();

    const { data: settings = [] } = useQuery({
        queryKey: ["settings"],
        queryFn: () => base44.entities.BusinessSettings.list(),
    });
    const biz = settings[0];

    const [form, setForm] = useState({
        business_name: "",
        phone: "",
        email: "",
        address: "",
        website: "",
        currency: "DOP",
        tax_rate: 18,
        default_notes: "",
        logo_url: "",
        social_media: { instagram: "", facebook: "", whatsapp: "" },
    });

    useEffect(() => {
        if (biz) {
            setForm({
                business_name: biz.business_name || "",
                phone: biz.phone || "",
                email: biz.email || "",
                address: biz.address || "",
                website: biz.website || "",
                currency: biz.currency || "DOP",
                tax_rate: biz.tax_rate ?? 18,
                default_notes: biz.default_notes || "",
                logo_url: biz.logo_url || "",
                social_media: biz.social_media || { instagram: "", facebook: "", whatsapp: "" },
            });
        }
    }, [biz]);

    const saveMutation = useMutation({
        mutationFn: (data) =>
            biz
                ? base44.entities.BusinessSettings.update(biz.id, { ...data, tax_rate: Number(data.tax_rate) })
                : base44.entities.BusinessSettings.create({ ...data, tax_rate: Number(data.tax_rate), next_quote_number: 1, next_invoice_number: 1 }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["settings"] });
            toast.success("Configuración guardada");
        },
    });

    const handleLogoUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const { file_url } = await base44.integrations.Core.UploadFile({ file });
        setForm({ ...form, logo_url: file_url });
    };

    return (
        <div className="p-4 lg:p-8 max-w-3xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Configuración</h1>
                    <p className="text-sm text-muted-foreground">Datos de tu negocio</p>
                </div>
                <Button onClick={() => saveMutation.mutate(form)} disabled={saveMutation.isPending} className="gap-2 shadow-md shadow-primary/20">
                    <Save className="w-4 h-4" />
                    {saveMutation.isPending ? "Guardando..." : "Guardar"}
                </Button>
            </div>

            <div className="bg-card rounded-xl border border-border p-6 space-y-6">
                {/* Logo */}
                <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-xl bg-secondary flex items-center justify-center overflow-hidden border border-border">
                        {form.logo_url ? (
                            <img src={form.logo_url} alt="Logo" className="w-full h-full object-cover" />
                        ) : (
                            <Building2 className="w-8 h-8 text-muted-foreground" />
                        )}
                    </div>
                    <div>
                        <Label htmlFor="logo-upload" className="cursor-pointer">
                            <div className="flex items-center gap-2 text-sm font-medium text-primary hover:underline">
                                <Upload className="w-4 h-4" /> Subir logo
                            </div>
                        </Label>
                        <input id="logo-upload" type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                        <p className="text-xs text-muted-foreground mt-1">PNG, JPG. Máximo 2MB</p>
                    </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                        <Label>Nombre del negocio *</Label>
                        <Input value={form.business_name} onChange={(e) => setForm({ ...form, business_name: e.target.value })} placeholder="Mi Negocio" />
                    </div>
                    <div>
                        <Label>Teléfono</Label>
                        <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="809-000-0000" />
                    </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                        <Label>Correo electrónico</Label>
                        <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="correo@negocio.com" />
                    </div>
                    <div>
                        <Label>Sitio web</Label>
                        <Input value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} placeholder="www.minegocio.com" />
                    </div>
                </div>

                <div>
                    <Label>Dirección</Label>
                    <Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Dirección completa" />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                        <Label>Moneda</Label>
                        <Input value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })} placeholder="DOP" />
                    </div>
                    <div>
                        <Label>ITBIS (%)</Label>
                        <Input type="number" value={form.tax_rate} onChange={(e) => setForm({ ...form, tax_rate: e.target.value })} min="0" max="100" />
                    </div>
                </div>

                <h3 className="text-sm font-semibold text-foreground pt-2">Redes Sociales</h3>
                <div className="grid sm:grid-cols-3 gap-4">
                    <div>
                        <Label>Instagram</Label>
                        <Input value={form.social_media.instagram} onChange={(e) => setForm({ ...form, social_media: { ...form.social_media, instagram: e.target.value } })} placeholder="@usuario" />
                    </div>
                    <div>
                        <Label>Facebook</Label>
                        <Input value={form.social_media.facebook} onChange={(e) => setForm({ ...form, social_media: { ...form.social_media, facebook: e.target.value } })} placeholder="facebook.com/pagina" />
                    </div>
                    <div>
                        <Label>WhatsApp</Label>
                        <Input value={form.social_media.whatsapp} onChange={(e) => setForm({ ...form, social_media: { ...form.social_media, whatsapp: e.target.value } })} placeholder="809-000-0000" />
                    </div>
                </div>

                <div>
                    <Label>Notas por defecto en documentos</Label>
                    <Textarea value={form.default_notes} onChange={(e) => setForm({ ...form, default_notes: e.target.value })} placeholder="Estas notas aparecerán en tus cotizaciones y facturas" rows={3} />
                </div>
            </div>

            <div className="text-center">
                <p className="text-xs text-muted-foreground">Powered by <a href="https://posentrd.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-foreground hover:underline">POSENT PRO</a></p>
            </div>
        </div>
    );
}