import { formatCurrency, formatDate } from "@/lib/formatters";
import { useAuth } from "@/lib/AuthContext";

// Barcode component using bwip-js API
function BarcodeStripes({ value = "" }) {
    const cleanValue = (value || "").trim();
    if (!cleanValue) return null;
    const barcodeUrl = `https://bwipjs-api.metafloor.com/?bcid=code128&text=${encodeURIComponent(cleanValue)}&scale=2&rotate=N&includeText=false`;
    return (
        <img src={barcodeUrl} alt="Barcode" style={{ width: "130px", height: "35px", objectFit: "contain", margin: "0 auto" }} />
    );
}

// QR Code component using qrserver API
function QRCode({ value = "" }) {
    const cleanValue = (value || "").trim();
    if (!cleanValue) return null;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(cleanValue)}`;
    return (
        <img src={qrUrl} alt="QR Code" style={{ width: "80px", height: "80px", margin: "0 auto" }} />
    );
}

export default function DocumentTicket({ type = "invoice", doc, biz }) {
    const { user } = useAuth();
    const isInvoice = type === "invoice";
    const docNumber = isInvoice ? doc.invoice_number : doc.quote_number;
    const businessName = biz?.business_name || user?.negocio?.nombre || user?.nombre || "Mi Negocio";

    return (
        <div
            id="doc-printable"
            style={{
                fontFamily: "'Courier New', Courier, monospace",
                background: "#fff",
                width: "58mm",
                maxWidth: "58mm",
                margin: "0 auto",
                padding: "4mm 3mm",
                fontSize: "9px",
                color: "#000",
                border: "1px dashed #ccc",
            }}
        >
            {/* Logo + negocio */}
            <div style={{ textAlign: "center", marginBottom: "6px", borderBottom: "1px dashed #000", paddingBottom: "6px" }}>
                {biz?.logo_url && (
                    <div style={{ display: "flex", justifyContent: "center", marginBottom: "4px" }}>
                        <img src={biz.logo_url} alt="logo" style={{ width: "40px", height: "40px", objectFit: "cover", borderRadius: "6px" }} />
                    </div>
                )}
                <div style={{ fontSize: "12px", fontWeight: 900, letterSpacing: "0.05em" }}>{businessName}</div>
                {biz?.address && <div style={{ fontSize: "8px", color: "#444" }}>{biz.address}</div>}
                {biz?.phone && <div style={{ fontSize: "8px", color: "#444" }}>Tel: {biz.phone}</div>}
                {biz?.email && <div style={{ fontSize: "8px", color: "#444" }}>{biz.email}</div>}
            </div>

            {/* Tipo + número */}
            <div style={{ textAlign: "center", marginBottom: "6px" }}>
                <div style={{ fontSize: "13px", fontWeight: 900, letterSpacing: "0.08em" }}>
                    {isInvoice ? "*** FACTURA ***" : "*** COTIZACIÓN ***"}
                </div>
                <div style={{ fontSize: "10px", fontWeight: 700 }}>{docNumber}</div>
                <div style={{ fontSize: "8px", color: "#555", marginTop: "2px" }}>
                    {isInvoice ? `Emisión: ${formatDate(doc.issue_date)}` : `Fecha: ${formatDate(doc.created_date)}`}
                    {isInvoice && doc.due_date && ` | Vence: ${formatDate(doc.due_date)}`}
                </div>
            </div>

            {/* Cliente */}
            <div style={{ borderTop: "1px dashed #000", borderBottom: "1px dashed #000", padding: "4px 0", marginBottom: "6px" }}>
                <div style={{ fontWeight: 700 }}>CLIENTE:</div>
                <div>{doc.client_name}</div>
            </div>

            {/* Items */}
            <div style={{ marginBottom: "6px" }}>
                {doc.items?.map((item, idx) => (
                    <div key={idx} style={{ marginBottom: "4px" }}>
                        <div style={{ fontWeight: 700, fontSize: "9px" }}>{item.name}</div>
                        {item.description && <div style={{ fontSize: "8px", color: "#555" }}>{item.description}</div>}
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "9px" }}>
                            <span>{item.quantity} x {formatCurrency(item.unit_price)}</span>
                            <span style={{ fontWeight: 700 }}>{formatCurrency(item.subtotal)}</span>
                        </div>
                        {item.discount_percent > 0 && (
                            <div style={{ fontSize: "8px", color: "#555" }}>Descuento: -{item.discount_percent}%</div>
                        )}
                    </div>
                ))}
            </div>

            {/* Totals */}
            <div style={{ borderTop: "1px dashed #000", paddingTop: "4px", marginBottom: "6px" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>Subtotal:</span><span>{formatCurrency(doc.subtotal)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>ITBIS ({doc.tax_rate ?? 18}%):</span><span>{formatCurrency(doc.tax_amount)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 900, fontSize: "12px", marginTop: "3px", borderTop: "1px solid #000", paddingTop: "3px" }}>
                    <span>TOTAL:</span><span>{formatCurrency(doc.total)}</span>
                </div>
                {isInvoice && doc.amount_paid > 0 && (
                    <>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "9px" }}>
                            <span>Pagado:</span><span>- {formatCurrency(doc.amount_paid)}</span>
                        </div>
                        {doc.balance_due > 0 && (
                            <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: "10px" }}>
                                <span>SALDO:</span><span>{formatCurrency(doc.balance_due)}</span>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Payment history */}
            {isInvoice && doc.payments?.length > 0 && (
                <div style={{ borderTop: "1px dashed #000", paddingTop: "4px", marginBottom: "6px" }}>
                    <div style={{ fontWeight: 700, marginBottom: "3px" }}>PAGOS RECIBIDOS:</div>
                    {doc.payments.map((p, idx) => (
                        <div key={idx} style={{ display: "flex", justifyContent: "space-between", fontSize: "8px" }}>
                            <span>{formatDate(p.date)} · {p.method}</span>
                            <span>+{formatCurrency(p.amount)}</span>
                        </div>
                    ))}
                </div>
            )}

            {/* Notas */}
            {(doc.notes || biz?.default_notes) && (
                <div style={{ borderTop: "1px dashed #000", paddingTop: "4px", marginBottom: "6px", fontSize: "8px", color: "#555" }}>
                    {doc.notes || biz?.default_notes}
                </div>
            )}

            {/* QR + Barcode */}
            <div style={{ borderTop: "1px dashed #000", paddingTop: "6px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
                <QRCode value={docNumber || "DOC"} />
                <BarcodeStripes value={docNumber || "DOC"} />
                <div style={{ fontSize: "8px", letterSpacing: "0.1em" }}>
                    {(docNumber || "").replace(/\D/g, "").padEnd(12, "0").slice(0, 12)}
                </div>
                <div style={{ fontSize: "7px", color: "#888", marginTop: "2px" }}>
                    Gracias por su preferencia · POSENT Free
                </div>
            </div>
        </div>
    );
}