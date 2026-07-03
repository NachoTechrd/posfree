import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import axios from "axios";
import { Plug, CheckCircle2, XCircle, Copy, RefreshCw, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

function generateApiKey() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    return "nf_" + Array.from({ length: 40 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

function IntegrationCard({ title, logo, connected, children }) {
    return (
        <div className="bg-card rounded-xl border border-border p-6 space-y-5">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-xl">
                        {logo}
                    </div>
                    <h2 className="text-lg font-semibold text-foreground">{title}</h2>
                </div>
                <Badge className={connected
                    ? "bg-emerald-100 text-emerald-700 border-0"
                    : "bg-secondary text-muted-foreground border-0"}>
                    {connected
                        ? <><CheckCircle2 className="w-3 h-3 mr-1 inline" />Conectado</>
                        : <><XCircle className="w-3 h-3 mr-1 inline" />Desconectado</>}
                </Badge>
            </div>
            {children}
        </div>
    );
}

export default function Integrations() {
    const queryClient = useQueryClient();
    const [testingWhabot, setTestingWhabot] = useState(false);
    const [form, setForm] = useState({
        posent_webhook_url: "",
        posent_api_key: "",
        posent_active: false,
        whabot_webhook_url: "",
        whabot_api_key: "",
        whabot_alerts_vencidas: false,
        whabot_confirmacion_pago: false,
        whabot_phone: "",
        api_key_interna: "",
    });

    const { data: settings = [] } = useQuery({
        queryKey: ["settings"],
        queryFn: () => base44.entities.BusinessSettings.list(),
    });
    const biz = settings[0] || {};

    useEffect(() => {
        if (biz.id) {
            setForm({
                posent_webhook_url: biz.posent_webhook_url || "",
                posent_api_key: biz.posent_api_key || "",
                posent_active: biz.posent_active || false,
                whabot_webhook_url: biz.whabot_webhook_url || "",
                whabot_api_key: biz.whabot_api_key || "",
                whabot_alerts_vencidas: biz.whabot_alerts_vencidas || false,
                whabot_confirmacion_pago: biz.whabot_confirmacion_pago || false,
                whabot_phone: biz.whabot_phone || "",
                api_key_interna: biz.api_key_interna || generateApiKey(),
            });
        }
    }, [biz.id]);

    const saveMutation = useMutation({
        mutationFn: (data) => {
            if (biz.id) return base44.entities.BusinessSettings.update(biz.id, data);
            return base44.entities.BusinessSettings.create({ business_name: "Mi Negocio", ...data });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["settings"] });
            toast.success("Configuración guardada");
        },
        onError: (err) => {
            const message = err.response?.data?.message || err.message || "Error al guardar la configuración";
            toast.error(message);
        }
    });

    const save = (patch) => {
        const updated = { ...form, ...patch };
        setForm(updated);
        saveMutation.mutate(updated);
    };

    const handleTest = async (system) => {
        if (system !== "whabot") return;
        if (!form.whabot_webhook_url || !form.whabot_api_key) {
            toast.error("Ingresa la URL del Webhook y el Identificador de Instancia primero");
            return;
        }
        setTestingWhabot(true);
        try {
            // Primero guarda la configuración actual
            await saveMutation.mutateAsync(form);
            // Luego llama al endpoint de prueba real
            const apiBase = import.meta.env.VITE_API_URL || "http://localhost:3002/api";
            const token = localStorage.getItem("posent_access_token") || "";
            const { data: apiResp } = await axios.post(
                `${apiBase}/settings/whabot/test`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (apiResp.success) {
                toast.success("✅ ¡Conexión exitosa! Revisa tu WhatsApp, deberías recibir un mensaje de prueba.");
            } else {
                toast.error(apiResp.message || "Error al probar la conexión");
            }
        } catch (err) {
            const msg = err?.response?.data?.message || err?.message || "Error al probar la conexión";
            toast.error(`❌ ${msg}`);
        } finally {
            setTestingWhabot(false);
        }
    };


    const copyApiKey = () => {
        navigator.clipboard.writeText(form.api_key_interna);
        toast.success("API Key copiada");
    };

    const regenerateApiKey = () => {
        const newKey = generateApiKey();
        save({ api_key_interna: newKey });
        toast.success("API Key regenerada y guardada");
    };

    const whabotConnected = !!(form.whabot_webhook_url && form.whabot_api_key);

    const endpoint = `${window.location.origin}/api/webhook/invoices`;

    return (
        <div className="p-4 lg:p-8 max-w-3xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                    <Plug className="w-6 h-6 text-primary" /> Integraciones
                </h1>
                <p className="text-sm text-muted-foreground mt-1">Conecta POSENT Free con tus sistemas externos</p>
            </div>

            {/* Whabot Pro */}
            <IntegrationCard title="Whabot Pro" logo="💬" connected={whabotConnected}>
                <div className="space-y-4">
                    <div>
                        <Label>URL del Webhook de Whabot</Label>
                        <Input
                            value={form.whabot_webhook_url}
                            onChange={(e) => setForm({ ...form, whabot_webhook_url: e.target.value })}
                            onBlur={() => saveMutation.mutate(form)}
                            placeholder="https://whabot.pro/webhook/..."
                        />
                    </div>
                    <div>
                        <Label>Identificador de Instancia (Whabot Pro)</Label>
                        <Input
                            type="text"
                            value={form.whabot_api_key}
                            onChange={(e) => setForm({ ...form, whabot_api_key: e.target.value })}
                            onBlur={() => saveMutation.mutate(form)}
                            placeholder="ej. WHABOT_xxxxxxxxxxxx"
                        />
                        <p className="text-xs text-muted-foreground mt-1">Copia el "Identificador de Instancia" desde tu panel de Whabot Pro → Integraciones → POSENT.</p>
                    </div>
                    <div>
                        <Label>Número de WhatsApp del negocio</Label>
                        <Input
                            value={form.whabot_phone}
                            onChange={(e) => setForm({ ...form, whabot_phone: e.target.value })}
                            onBlur={() => saveMutation.mutate(form)}
                            placeholder="+18091234567"
                        />
                    </div>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                            <div>
                                <p className="text-sm font-medium text-foreground">Alertas de facturas vencidas</p>
                                <p className="text-xs text-muted-foreground">Notificar por WhatsApp cuando una factura vence</p>
                            </div>
                            <Switch
                                checked={form.whabot_alerts_vencidas}
                                onCheckedChange={(v) => save({ whabot_alerts_vencidas: v })}
                            />
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                            <div>
                                <p className="text-sm font-medium text-foreground">Confirmación de pago</p>
                                <p className="text-xs text-muted-foreground">Enviar mensaje al cliente cuando se registra un pago</p>
                            </div>
                            <Switch
                                checked={form.whabot_confirmacion_pago}
                                onCheckedChange={(v) => save({ whabot_confirmacion_pago: v })}
                            />
                        </div>
                    </div>
                    <Button
                        variant="outline"
                        onClick={() => handleTest("whabot")}
                        disabled={testingWhabot}
                        className="gap-2"
                    >
                        {testingWhabot ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plug className="w-4 h-4" />}
                        Probar conexión
                    </Button>
                </div>
            </IntegrationCard>

            {/* API Key interna */}
            <div className="bg-card rounded-xl border border-border p-6 space-y-5">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-xl">🔑</div>
                    <div>
                        <h2 className="text-lg font-semibold text-foreground">Configuración de API (recibir datos)</h2>
                        <p className="text-xs text-muted-foreground">Usa estas credenciales en sistemas externos para enviar datos a POSENT Free</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <Label>Tu API Key</Label>
                        <div className="flex gap-2">
                            <Input readOnly value={form.api_key_interna} className="font-mono text-xs bg-secondary" />
                            <Button variant="outline" size="icon" onClick={copyApiKey}><Copy className="w-4 h-4" /></Button>
                            <Button variant="outline" size="icon" onClick={regenerateApiKey}><RefreshCw className="w-4 h-4" /></Button>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Haz clic en <Copy className="w-3 h-3 inline" /> para copiar o en <RefreshCw className="w-3 h-3 inline" /> para regenerar</p>
                    </div>

                    <div>
                        <Label>Endpoint para recibir facturas</Label>
                        <div className="flex gap-2">
                            <Input readOnly value={endpoint} className="font-mono text-xs bg-secondary" />
                            <Button variant="outline" size="icon" onClick={() => { navigator.clipboard.writeText(endpoint); toast.success("Endpoint copiado"); }}>
                                <Copy className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>

                    <div className="p-4 rounded-lg bg-secondary/50 space-y-2 text-sm text-muted-foreground">
                        <p className="font-semibold text-foreground">¿Cómo usar el endpoint?</p>
                        <p>Envía un <code className="bg-secondary px-1 rounded text-xs font-mono">POST</code> al endpoint con el header:</p>
                        <code className="block bg-background border border-border rounded p-2 text-xs font-mono">Authorization: Bearer {"<Tu API Key>"}</code>
                        <p>El cuerpo debe ser un JSON con los campos de la factura (client_name, items, total, etc.).</p>
                    </div>
                </div>
            </div>
        </div>
    );
}