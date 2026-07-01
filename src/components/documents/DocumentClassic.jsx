import { formatCurrency, formatDate } from "@/lib/formatters";
import { useAuth } from "@/lib/AuthContext";

const statusConfig = {
    pagada: { label: "PAGADA", bg: "#dcfce7", color: "#16a34a", border: "#86efac" },
    pendiente: { label: "PENDIENTE", bg: "#fef9c3", color: "#ca8a04", border: "#fde047" },
    vencida: { label: "VENCIDA", bg: "#fee2e2", color: "#dc2626", border: "#fca5a5" },
    borrador: { label: "BORRADOR", bg: "#f1f5f9", color: "#64748b", border: "#cbd5e1" },
    enviada: { label: "ENVIADA", bg: "#dbeafe", color: "#2563eb", border: "#93c5fd" },
    aprobada: { label: "APROBADA", bg: "#dcfce7", color: "#16a34a", border: "#86efac" },
    rechazada: { label: "RECHAZADA", bg: "#fee2e2", color: "#dc2626", border: "#fca5a5" },
};

// Simple barcode-like visual (decorative)
function BarcodeStripes({ value = "" }) {
    // Generate pseudo-random stripe widths from string
    const stripes = Array.from({ length: 40 }, (_, i) => {
        const char = value.charCodeAt(i % value.length) || 50;
        return (char % 3) + 1;
    });
    return (
        <div style={{ display: "flex", alignItems: "flex-end", height: "40px", gap: "1px" }}>
            {stripes.map((w, i) => (
                <div
                    key={i}
                    style={{
                        width: `${w}px`,
                        height: i % 5 === 0 ? "40px" : i % 2 === 0 ? "32px" : "28px",
                        background: "#0f172a",
                        flexShrink: 0,
                    }}
                />
            ))}
        </div>
    );
}

// Simple QR-like visual (decorative grid)
function QRCode({ value = "" }) {
    const size = 7;
    const cells = Array.from({ length: size * size }, (_, i) => {
        const char = value.charCodeAt(i % value.length) || 0;
        return (char + i) % 3 !== 0;
    });
    // Force corner squares (QR style)
    const cornerCells = [0, 1, 2, 3, 4, 5, 6, 7, 13, 14, 20, 21, 27, 28, 34, 35, 41, 42, 43, 44, 45, 46, 47, 48];
    cornerCells.forEach((c) => { if (c < cells.length) cells[c] = true; });

    return (
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${size}, 6px)`, gap: "1px" }}>
            {cells.map((filled, i) => (
                <div key={i} style={{ width: "6px", height: "6px", background: filled ? "#0f172a" : "#fff", border: "0.5px solid #e2e8f0" }} />
            ))}
        </div>
    );
}

export default function DocumentClassic({ type = "invoice", doc, biz }) {
    const { user } = useAuth();
    const isInvoice = type === "invoice";
    const docNumber = isInvoice ? doc.invoice_number : doc.quote_number;
    const status = statusConfig[doc.status] || statusConfig.pendiente;
    const businessName = biz?.business_name || user?.negocio?.nombre || user?.nombre || "Mi Negocio";

    return (
        <div id="doc-printable" style={{ fontFamily: "'Inter', sans-serif", background: "#fff", maxWidth: "860px", margin: "0 auto", border: "1px solid #e2e8f0", borderRadius: "8px", overflow: "hidden" }}>

            {/* Header */}
            <div style={{ borderBottom: "3px solid #0f172a", padding: "24px 32px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ display: "flex", gap: "14px", alignItems: "center" }}>
                    {biz?.logo_url ? (
                        <img src={biz.logo_url} alt="logo" style={{ width: "52px", height: "52px", objectFit: "cover", borderRadius: "6px" }} />
                    ) : (
                        <div style={{ width: "52px", height: "52px", background: "#f1f5f9", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px" }}>📱</div>
                    )}
                    <div>
                        <div style={{ fontSize: "20px", fontWeight: 800, color: "#0f172a" }}>{businessName}</div>
                        <div style={{ fontSize: "11px", color: "#64748b", marginTop: "2px" }}>Reparación · Tecnología · Soluciones Digitales</div>
                        {biz?.phone && <div style={{ fontSize: "11px", color: "#64748b" }}>{biz.phone}</div>}
                        {biz?.email && <div style={{ fontSize: "11px", color: "#64748b" }}>{biz.email}</div>}
                    </div>
                </div>
                <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "28px", fontWeight: 900, color: "#0f172a", letterSpacing: "0.04em" }}>
                        {isInvoice ? "FACTURA" : "COTIZACIÓN"}
                    </div>
                    <div style={{ fontSize: "15px", fontWeight: 700, color: "#475569", marginTop: "4px" }}>{docNumber}</div>
                    <div style={{ marginTop: "8px", display: "inline-flex", alignItems: "center", padding: "3px 10px", borderRadius: "4px", background: status.bg, color: status.color, border: `1px solid ${status.border}`, fontSize: "10px", fontWeight: 700, letterSpacing: "0.06em" }}>
                        {status.label}
                    </div>
                </div>
            </div>

            {/* Billing Details */}
            <div style={{ padding: "32px 32px 24px 32px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px" }}>
                <div>
                    <div style={{ fontSize: "11px", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px" }}>EMISOR</div>
                    <div style={{ fontSize: "13px", fontWeight: 600, color: "#0f172a" }}>{businessName}</div>
                </div>
            </div>

            {/* Info grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0", borderBottom: "1px solid #e2e8f0" }}>
                <div style={{ padding: "16px 24px", borderRight: "1px solid #e2e8f0" }}>
                    <div style={{ fontSize: "10px", fontWeight: 700, color: "#94a3b8", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "6px" }}>Cliente</div>
                    <div style={{ fontSize: "13px", fontWeight: 700, color: "#0f172a" }}>{doc.client_name}</div>
                </div>
                <div style={{ padding: "16px 24px", borderRight: "1px solid #e2e8f0" }}>
                    <div style={{ fontSize: "10px", fontWeight: 700, color: "#94a3b8", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "6px" }}>
                        {isInvoice ? "Fecha de Emisión" : "Fecha"}
                    </div>
                    <div style={{ fontSize: "13px", color: "#334155" }}>
                        {isInvoice ? formatDate(doc.issue_date) : formatDate(doc.created_date)}
                    </div>
                    {isInvoice && doc.due_date && (
                        <>
                            <div style={{ fontSize: "10px", fontWeight: 700, color: "#94a3b8", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "2px", marginTop: "8px" }}>Vencimiento</div>
                            <div style={{ fontSize: "13px", color: "#334155" }}>{formatDate(doc.due_date)}</div>
                        </>
                    )}
                    {!isInvoice && doc.valid_until && (
                        <>
                            <div style={{ fontSize: "10px", fontWeight: 700, color: "#94a3b8", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "2px", marginTop: "8px" }}>Válida hasta</div>
                            <div style={{ fontSize: "13px", color: "#334155" }}>{formatDate(doc.valid_until)}</div>
                        </>
                    )}
                </div>
                <div style={{ padding: "16px 24px" }}>
                    <div style={{ fontSize: "10px", fontWeight: 700, color: "#94a3b8", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "6px" }}>Empresa</div>
                    <div style={{ fontSize: "13px", fontWeight: 600, color: "#0f172a" }}>{businessName}</div>
                    {biz?.address && <div style={{ fontSize: "11px", color: "#64748b", marginTop: "2px" }}>{biz.address}</div>}
                </div>
            </div>

            {/* Items table */}
            <div style={{ padding: "20px 32px" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
                    <thead>
                        <tr style={{ background: "#0f172a" }}>
                            <th style={{ padding: "8px 10px", textAlign: "left", color: "#fff", fontSize: "10px", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", width: "28px" }}>#</th>
                            <th style={{ padding: "8px 10px", textAlign: "left", color: "#fff", fontSize: "10px", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>Descripción</th>
                            <th style={{ padding: "8px 10px", textAlign: "center", color: "#fff", fontSize: "10px", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", width: "60px" }}>Cant.</th>
                            <th style={{ padding: "8px 10px", textAlign: "right", color: "#fff", fontSize: "10px", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", width: "100px" }}>P. Unit.</th>
                            <th style={{ padding: "8px 10px", textAlign: "right", color: "#fff", fontSize: "10px", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", width: "100px" }}>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {doc.items?.map((item, idx) => (
                            <tr key={idx} style={{ borderBottom: "1px solid #f1f5f9" }}>
                                <td style={{ padding: "10px 10px", color: "#94a3b8", fontSize: "11px" }}>{idx + 1}</td>
                                <td style={{ padding: "10px 10px" }}>
                                    <div style={{ fontWeight: 600, color: "#0f172a" }}>{item.name}</div>
                                    {item.description && <div style={{ fontSize: "10px", color: "#94a3b8", marginTop: "1px" }}>{item.description}</div>}
                                </td>
                                <td style={{ padding: "10px 10px", textAlign: "center", color: "#334155" }}>{item.quantity}</td>
                                <td style={{ padding: "10px 10px", textAlign: "right", color: "#334155" }}>{formatCurrency(item.unit_price)}</td>
                                <td style={{ padding: "10px 10px", textAlign: "right", fontWeight: 700, color: "#0f172a" }}>
                                    {item.discount_percent > 0 && (
                                        <span style={{ fontSize: "9px", color: "#16a34a", marginRight: "4px" }}>-{item.discount_percent}%</span>
                                    )}
                                    {formatCurrency(item.subtotal)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Totals + QR/Barcode */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", padding: "0 32px 24px", gap: "24px" }}>
                {/* QR + Barcode */}
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    <div>
                        <div style={{ fontSize: "9px", fontWeight: 700, color: "#94a3b8", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "6px" }}>Código QR</div>
                        <QRCode value={docNumber || "DOC"} />
                        <div style={{ fontSize: "9px", color: "#94a3b8", marginTop: "4px", textAlign: "center" }}>{docNumber}</div>
                    </div>
                    <div>
                        <div style={{ fontSize: "9px", fontWeight: 700, color: "#94a3b8", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "6px" }}>Código de Barras</div>
                        <BarcodeStripes value={docNumber || "DOC"} />
                        <div style={{ fontSize: "9px", color: "#94a3b8", marginTop: "4px", letterSpacing: "0.1em" }}>{(docNumber || "").replace(/\D/g, "").padEnd(12, "0").slice(0, 12)}</div>
                    </div>
                </div>

                {/* Totals */}
                <div style={{ width: "260px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #f1f5f9", fontSize: "12px", color: "#64748b" }}>
                        <span>Subtotal</span>
                        <span style={{ fontWeight: 600, color: "#334155" }}>{formatCurrency(doc.subtotal)}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #f1f5f9", fontSize: "12px", color: "#64748b" }}>
                        <span>ITBIS ({doc.tax_rate ?? 18}%)</span>
                        <span style={{ fontWeight: 600, color: "#334155" }}>{formatCurrency(doc.tax_amount)}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 14px", background: "#0f172a", borderRadius: "6px", marginTop: "6px" }}>
                        <span style={{ fontSize: "12px", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em" }}>TOTAL</span>
                        <span style={{ fontSize: "18px", fontWeight: 900, color: "#fff" }}>{formatCurrency(doc.total)}</span>
                    </div>
                    {isInvoice && doc.amount_paid > 0 && (
                        <div style={{ marginTop: "6px", display: "flex", flexDirection: "column", gap: "3px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#16a34a", fontWeight: 600 }}>
                                <span>Pagado</span><span>- {formatCurrency(doc.amount_paid)}</span>
                            </div>
                            {doc.balance_due > 0 && (
                                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#dc2626", fontWeight: 700 }}>
                                    <span>Saldo pendiente</span><span>{formatCurrency(doc.balance_due)}</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Payment History */}
            {isInvoice && doc.payments?.length > 0 && (
                <div style={{ padding: "0 32px 20px" }}>
                    <div style={{ fontSize: "10px", fontWeight: 700, color: "#64748b", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "8px" }}>Historial de Pagos</div>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "11px", border: "1px solid #e2e8f0", borderRadius: "6px", overflow: "hidden" }}>
                        <thead>
                            <tr style={{ background: "#f8fafc" }}>
                                <th style={{ padding: "6px 10px", textAlign: "left", color: "#64748b", fontWeight: 600 }}>Fecha</th>
                                <th style={{ padding: "6px 10px", textAlign: "left", color: "#64748b", fontWeight: 600 }}>Método</th>
                                <th style={{ padding: "6px 10px", textAlign: "left", color: "#64748b", fontWeight: 600 }}>Referencia</th>
                                <th style={{ padding: "6px 10px", textAlign: "right", color: "#64748b", fontWeight: 600 }}>Monto</th>
                            </tr>
                        </thead>
                        <tbody>
                            {doc.payments.map((p, idx) => (
                                <tr key={idx} style={{ borderTop: "1px solid #f1f5f9" }}>
                                    <td style={{ padding: "6px 10px", color: "#334155" }}>{formatDate(p.date)}</td>
                                    <td style={{ padding: "6px 10px", color: "#334155", textTransform: "capitalize" }}>{p.method}</td>
                                    <td style={{ padding: "6px 10px", color: "#94a3b8" }}>{p.notes || "—"}</td>
                                    <td style={{ padding: "6px 10px", textAlign: "right", fontWeight: 700, color: "#16a34a" }}>+{formatCurrency(p.amount)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Converted notice */}
            {!isInvoice && doc.converted_to_invoice && (
                <div style={{ margin: "0 32px 16px", background: "#dcfce7", border: "1px solid #86efac", borderRadius: "6px", padding: "10px 14px", fontSize: "12px", color: "#16a34a", fontWeight: 600 }}>
                    ✓ Esta cotización fue convertida a factura
                </div>
            )}

            {/* Footer */}
            <div style={{ borderTop: "1px solid #e2e8f0", padding: "16px 32px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
                <div style={{ fontSize: "11px", color: "#64748b" }}>
                    {doc.notes || biz?.default_notes || "Gracias por su preferencia."}
                </div>
                <div style={{ fontSize: "10px", color: "#94a3b8" }}>Generado por <span style={{ color: "#0f172a", fontWeight: 700 }}>POSENT Free</span></div>
            </div>
        </div>
    );
}