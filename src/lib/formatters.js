export function formatCurrency(amount, currency = "DOP") {
    if (amount == null || isNaN(amount)) return `${currency} 0.00`;
    return `${currency} ${Number(amount).toLocaleString("es-DO", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatDate(dateStr) {
    if (!dateStr) return "—";
    const d = new Date(dateStr);
    return d.toLocaleDateString("es-DO", { day: "2-digit", month: "short", year: "numeric" });
}

export function generateNumber(prefix, num) {
    return `${prefix}-${String(num).padStart(5, "0")}`;
}