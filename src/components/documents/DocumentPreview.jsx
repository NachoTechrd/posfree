import { useState } from "react";
import { Printer, Pencil, DollarSign, Share2, ArrowRightLeft, Trash2, LayoutTemplate, FileText, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/formatters";
import DocumentClassic from "@/components/documents/DocumentClassic";
import DocumentTicket from "@/components/documents/DocumentTicket";

const statusConfig = {
    pagada: { label: "PAGADA", bg: "#dcfce7", color: "#16a34a", border: "#86efac" },
    pendiente: { label: "PENDIENTE", bg: "#fef9c3", color: "#ca8a04", border: "#fde047" },
    vencida: { label: "VENCIDA", bg: "#fee2e2", color: "#dc2626", border: "#fca5a5" },
    borrador: { label: "BORRADOR", bg: "#f1f5f9", color: "#64748b", border: "#cbd5e1" },
    enviada: { label: "ENVIADA", bg: "#dbeafe", color: "#2563eb", border: "#93c5fd" },
    aprobada: { label: "APROBADA", bg: "#dcfce7", color: "#16a34a", border: "#86efac" },
    rechazada: { label: "RECHAZADA", bg: "#fee2e2", color: "#dc2626", border: "#fca5a5" },
};

export default function DocumentPreview({
    type = "invoice", // "invoice" | "quote"
    doc,
    biz,
    onPrint,
    onEdit,
    onDelete,
    onMarkPaid,
    onConvert,
    onWhatsApp,
    isPending,
}) {
    const [viewMode, setViewMode] = useState("design"); // "design" | "classic" | "ticket"
    const isInvoice = type === "invoice";
    const docNumber = isInvoice ? doc.invoice_number : doc.quote_number;
    const status = statusConfig[doc.status] || statusConfig.pendiente;

    const handlePrint = () => {
        const orig = document.title;
        document.title = docNumber || (isInvoice ? "Factura" : "Cotizacion");
        // For ticket mode, set page size via style
        if (viewMode === "ticket") {
            const style = document.createElement("style");
            style.id = "ticket-print-style";
            style.textContent = `@media print { @page { size: 58mm auto; margin: 0; } }`;
            document.head.appendChild(style);
        }
        window.print();
        document.title = orig;
        const s = document.getElementById("ticket-print-style");
        if (s) s.remove();
    };

    return (
        <>
            {/* Print styles */}
            <style>{`
        @media print {
          @page {
            size: A4;
            margin: 10mm;
          }
          body * { visibility: hidden !important; }
          #doc-printable, #doc-printable * { visibility: visible !important; }
          #doc-printable {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            box-shadow: none !important;
            border-radius: 0 !important;
          }
          #doc-actions { display: none !important; }
          table { page-break-inside: avoid; }
          tr { page-break-inside: avoid; }
        }
      `}</style>

            {/* Action bar */}
            <div id="doc-actions" className="flex items-center justify-between mb-6 flex-wrap gap-3 print:hidden">
                <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors" onClick={() => window.history.back()}>
                    ← Volver
                </button>
                <div className="flex gap-2 flex-wrap justify-end">
                    {/* Format toggle */}
                    <div className="flex items-center border border-border rounded-md overflow-hidden text-xs">
                        <button
                            onClick={() => setViewMode("design")}
                            className={`flex items-center gap-1.5 px-3 py-1.5 font-medium transition-colors ${viewMode === "design" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary"}`}
                        >
                            <LayoutTemplate className="w-3.5 h-3.5" /> Diseño
                        </button>
                        <button
                            onClick={() => setViewMode("classic")}
                            className={`flex items-center gap-1.5 px-3 py-1.5 font-medium transition-colors ${viewMode === "classic" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary"}`}
                        >
                            <FileText className="w-3.5 h-3.5" /> Clásica
                        </button>
                        <button
                            onClick={() => setViewMode("ticket")}
                            className={`flex items-center gap-1.5 px-3 py-1.5 font-medium transition-colors ${viewMode === "ticket" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary"}`}
                        >
                            <Receipt className="w-3.5 h-3.5" /> Ticket 58mm
                        </button>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => onDelete && onDelete()} className="text-destructive gap-1.5">
                        <Trash2 className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={handlePrint} className="gap-1.5">
                        <Printer className="w-4 h-4" /> Imprimir / PDF
                    </Button>
                    {onWhatsApp && (
                        <Button variant="outline" size="sm" onClick={onWhatsApp} className="gap-1.5">
                            <Share2 className="w-4 h-4" /> WhatsApp
                        </Button>
                    )}
                    {onEdit && (
                        <Button variant="outline" size="sm" onClick={onEdit} className="gap-1.5">
                            <Pencil className="w-4 h-4" /> Editar
                        </Button>
                    )}
                    {isInvoice && onMarkPaid && (
                        <Button size="sm" onClick={onMarkPaid} disabled={isPending} className="gap-1.5 shadow-md shadow-primary/20">
                            <DollarSign className="w-4 h-4" />
                            {doc.status === "pagada" ? "Ver / Agregar Pago" : "Registrar Pago"}
                        </Button>
                    )}
                    {!isInvoice && onConvert && !doc.converted_to_invoice && (
                        <Button size="sm" onClick={onConvert} disabled={isPending} className="gap-1.5 shadow-md shadow-primary/20">
                            <ArrowRightLeft className="w-4 h-4" />
                            {isPending ? "Convirtiendo..." : "Convertir a Factura"}
                        </Button>
                    )}
                </div>
            </div>

            {/* Classic format */}
            {viewMode === "classic" && <DocumentClassic type={type} doc={doc} biz={biz} />}

            {/* Ticket 58mm */}
            {viewMode === "ticket" && <DocumentTicket type={type} doc={doc} biz={biz} />}

            {/* The printable document (design format) */}
            {viewMode === "design" && <div id="doc-printable" style={{ fontFamily: "'Inter', sans-serif", background: "#fff", borderRadius: "16px", overflow: "hidden", boxShadow: "0 4px 40px rgba(0,0,0,0.12)", maxWidth: "860px", margin: "0 auto" }}>

                {/* ── HEADER ── */}
                <div style={{ background: "#0a1628", padding: "32px 40px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "24px" }}>
                    {/* Left: branding */}
                    <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                        <div style={{ width: "56px", height: "56px", borderRadius: "12px", background: "rgba(6,182,212,0.15)", border: "1.5px solid rgba(6,182,212,0.4)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            {biz?.logo_url ? (
                                <img src={biz.logo_url} alt="logo" style={{ width: "44px", height: "44px", objectFit: "cover", borderRadius: "8px" }} />
                            ) : (
                                <span style={{ fontSize: "22px" }}>📱</span>
                            )}
                        </div>
                        <div>
                            <div style={{ fontSize: "22px", fontWeight: 800, color: "#fff", lineHeight: 1.1 }}>
                                Nacho<span style={{ color: "#06b6d4" }}>Tech</span>RD
                            </div>
                            <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: "4px", letterSpacing: "0.03em" }}>
                                Reparación · Tecnología · Soluciones Digitales
                            </div>
                            {biz?.address && <div style={{ fontSize: "11px", color: "#64748b", marginTop: "8px" }}>{biz.address}</div>}
                            {biz?.phone && <div style={{ fontSize: "11px", color: "#64748b" }}>{biz.phone}</div>}
                            {biz?.website && <div style={{ fontSize: "11px", color: "#06b6d4" }}>{biz.website}</div>}
                            {biz?.email && <div style={{ fontSize: "11px", color: "#64748b" }}>{biz.email}</div>}
                        </div>
                    </div>

                    {/* Right: doc type + number + dates + status */}
                    <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: "38px", fontWeight: 900, color: "#06b6d4", letterSpacing: "0.08em", lineHeight: 1 }}>
                            {isInvoice ? "FACTURA" : "COTIZACIÓN"}
                        </div>
                        <div style={{ fontSize: "16px", fontWeight: 700, color: "#fff", marginTop: "6px" }}>{docNumber}</div>
                        <div style={{ marginTop: "12px", display: "flex", flexDirection: "column", gap: "4px", alignItems: "flex-end" }}>
                            {isInvoice ? (
                                <>
                                    <div style={{ fontSize: "11px", color: "#94a3b8" }}>
                                        <span style={{ color: "#64748b" }}>Emisión: </span>{formatDate(doc.issue_date)}
                                    </div>
                                    <div style={{ fontSize: "11px", color: "#94a3b8" }}>
                                        <span style={{ color: "#64748b" }}>Vencimiento: </span>{formatDate(doc.due_date)}
                                    </div>
                                </>
                            ) : (
                                doc.valid_until && (
                                    <div style={{ fontSize: "11px", color: "#94a3b8" }}>
                                        <span style={{ color: "#64748b" }}>Válida hasta: </span>{formatDate(doc.valid_until)}
                                    </div>
                                )
                            )}
                            <div style={{ marginTop: "8px", display: "inline-flex", alignItems: "center", padding: "4px 12px", borderRadius: "999px", background: status.bg, color: status.color, border: `1px solid ${status.border}`, fontSize: "11px", fontWeight: 700, letterSpacing: "0.06em" }}>
                                {status.label}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── FROM / TO ── */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0", borderBottom: "1px solid #e2e8f0" }}>
                    <div style={{ padding: "24px 40px", borderRight: "1px solid #e2e8f0" }}>
                        <div style={{ fontSize: "10px", fontWeight: 700, color: "#94a3b8", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "8px" }}>Facturado por</div>
                        <div style={{ fontSize: "14px", fontWeight: 700, color: "#0f172a" }}>{biz?.business_name || "NachoTechRD"}</div>
                        {biz?.address && <div style={{ fontSize: "12px", color: "#64748b", marginTop: "3px" }}>{biz.address}</div>}
                        {biz?.email && <div style={{ fontSize: "12px", color: "#64748b" }}>{biz.email}</div>}
                        {biz?.phone && <div style={{ fontSize: "12px", color: "#64748b" }}>{biz.phone}</div>}
                    </div>
                    <div style={{ padding: "24px 40px" }}>
                        <div style={{ fontSize: "10px", fontWeight: 700, color: "#94a3b8", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "8px" }}>Facturado a</div>
                        <div style={{ fontSize: "14px", fontWeight: 700, color: "#0f172a" }}>{doc.client_name}</div>
                    </div>
                </div>

                {/* ── ITEMS TABLE ── */}
                <div style={{ padding: "32px 40px" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                        <thead>
                            <tr style={{ background: "#f8fafc", borderBottom: "2px solid #e2e8f0" }}>
                                <th style={{ padding: "10px 12px", textAlign: "left", fontWeight: 700, color: "#64748b", fontSize: "11px", letterSpacing: "0.06em", textTransform: "uppercase", width: "32px" }}>#</th>
                                <th style={{ padding: "10px 12px", textAlign: "left", fontWeight: 700, color: "#64748b", fontSize: "11px", letterSpacing: "0.06em", textTransform: "uppercase" }}>Descripción</th>
                                <th style={{ padding: "10px 12px", textAlign: "center", fontWeight: 700, color: "#64748b", fontSize: "11px", letterSpacing: "0.06em", textTransform: "uppercase", width: "70px" }}>Cant.</th>
                                <th style={{ padding: "10px 12px", textAlign: "right", fontWeight: 700, color: "#64748b", fontSize: "11px", letterSpacing: "0.06em", textTransform: "uppercase", width: "110px" }}>Precio Unit.</th>
                                {/* discount col */}
                                <th style={{ padding: "10px 12px", textAlign: "right", fontWeight: 700, color: "#64748b", fontSize: "11px", letterSpacing: "0.06em", textTransform: "uppercase", width: "110px" }}>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {doc.items?.map((item, idx) => (
                                <tr key={idx} style={{ background: idx % 2 === 0 ? "#fff" : "#f8fafc", borderBottom: "1px solid #f1f5f9" }}>
                                    <td style={{ padding: "12px 12px", color: "#94a3b8", fontWeight: 600 }}>{idx + 1}</td>
                                    <td style={{ padding: "12px 12px" }}>
                                        <div style={{ fontWeight: 600, color: "#0f172a" }}>{item.name}</div>
                                        {item.description && <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: "2px" }}>{item.description}</div>}
                                    </td>
                                    <td style={{ padding: "12px 12px", textAlign: "center", color: "#334155" }}>{item.quantity}</td>
                                    <td style={{ padding: "12px 12px", textAlign: "right", color: "#334155" }}>{formatCurrency(item.unit_price)}</td>
                                    <td style={{ padding: "12px 12px", textAlign: "right", fontWeight: 700, color: "#0f172a" }}>
                                        {item.discount_percent > 0 && (
                                            <span style={{ fontSize: "10px", color: "#16a34a", marginRight: "4px" }}>-{item.discount_percent}%</span>
                                        )}
                                        {formatCurrency(item.subtotal)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* ── TOTALS ── */}
                <div style={{ display: "flex", justifyContent: "flex-end", padding: "0 40px 32px" }}>
                    <div style={{ width: "280px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #f1f5f9", fontSize: "13px", color: "#64748b" }}>
                            <span>Subtotal</span>
                            <span style={{ fontWeight: 600, color: "#334155" }}>{formatCurrency(doc.subtotal)}</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #f1f5f9", fontSize: "13px", color: "#64748b" }}>
                            <span>ITBIS ({doc.tax_rate ?? 18}%)</span>
                            <span style={{ fontWeight: 600, color: "#334155" }}>{formatCurrency(doc.tax_amount)}</span>
                        </div>
                        <div style={{ marginTop: "8px", background: "#0a1628", borderRadius: "12px", padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span style={{ fontSize: "13px", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em" }}>Total a pagar</span>
                            <span style={{ fontSize: "22px", fontWeight: 900, color: "#06b6d4" }}>{formatCurrency(doc.total)}</span>
                        </div>

                        {/* Payment summary for invoices */}
                        {isInvoice && (doc.amount_paid > 0 || doc.balance_due != null) && (
                            <div style={{ marginTop: "8px", display: "flex", flexDirection: "column", gap: "4px" }}>
                                {doc.amount_paid > 0 && (
                                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#16a34a", fontWeight: 600 }}>
                                        <span>Pagado</span>
                                        <span>- {formatCurrency(doc.amount_paid)}</span>
                                    </div>
                                )}
                                {doc.balance_due > 0 && (
                                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#dc2626", fontWeight: 700 }}>
                                        <span>Saldo pendiente</span>
                                        <span>{formatCurrency(doc.balance_due)}</span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* ── PAYMENTS HISTORY (invoices only) ── */}
                {isInvoice && doc.payments?.length > 0 && (
                    <div style={{ padding: "0 40px 32px" }}>
                        <div style={{ fontSize: "12px", fontWeight: 700, color: "#64748b", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "10px" }}>Historial de Pagos</div>
                        <div style={{ borderRadius: "10px", border: "1px solid #e2e8f0", overflow: "hidden" }}>
                            {doc.payments.map((p, idx) => (
                                <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 16px", background: idx % 2 === 0 ? "#fff" : "#f8fafc", borderBottom: idx < doc.payments.length - 1 ? "1px solid #f1f5f9" : "none" }}>
                                    <div>
                                        <div style={{ fontSize: "13px", fontWeight: 600, color: "#0f172a", textTransform: "capitalize" }}>{p.method}</div>
                                        <div style={{ fontSize: "11px", color: "#94a3b8" }}>{formatDate(p.date)}{p.notes && ` · ${p.notes}`}</div>
                                    </div>
                                    <div style={{ fontSize: "14px", fontWeight: 700, color: "#16a34a" }}>+{formatCurrency(p.amount)}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ── CONVERTED NOTICE (quotes only) ── */}
                {!isInvoice && doc.converted_to_invoice && (
                    <div style={{ margin: "0 40px 24px", background: "#dcfce7", border: "1px solid #86efac", borderRadius: "10px", padding: "12px 16px", fontSize: "13px", color: "#16a34a", fontWeight: 600 }}>
                        ✓ Esta cotización fue convertida a factura
                    </div>
                )}

                {/* ── FOOTER ── */}
                <div style={{ borderTop: "1px solid #e2e8f0", padding: "24px 40px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
                    <div>
                        <div style={{ fontSize: "11px", fontWeight: 700, color: "#64748b", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "6px" }}>Notas & Términos</div>
                        <div style={{ fontSize: "12px", color: "#64748b", lineHeight: 1.6 }}>
                            {doc.notes || biz?.default_notes || "Gracias por su preferencia."}
                        </div>
                    </div>
                    <div>
                        <div style={{ fontSize: "11px", fontWeight: 700, color: "#64748b", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "8px" }}>Métodos de Pago</div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                            {["Efectivo", "Tarjeta", "Transferencia"].map((m) => (
                                <span key={m} style={{ padding: "3px 10px", borderRadius: "999px", background: "#f1f5f9", border: "1px solid #e2e8f0", fontSize: "11px", fontWeight: 600, color: "#475569" }}>{m}</span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── BOTTOM BAR ── */}
                <div style={{ background: "#0a1628", padding: "12px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
                    <span style={{ fontSize: "11px", color: "#475569" }}>Generado por <span style={{ color: "#06b6d4", fontWeight: 700 }}>NachoFacturas</span> · NachoTechRD</span>
                    <span style={{ fontSize: "11px", color: "#475569" }}>© {new Date().getFullYear()} NachoTechRD. Todos los derechos reservados.</span>
                </div>
            </div>}
        </>
    );
}