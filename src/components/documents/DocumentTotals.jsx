import { formatCurrency } from "@/lib/formatters";

export default function DocumentTotals({ subtotal, taxRate, taxAmount, total, onTaxRateChange }) {
    return (
        <div className="bg-secondary/30 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
                {onTaxRateChange ? (
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <span>ITBIS</span>
                        <input
                            type="number"
                            min="0"
                            max="100"
                            value={taxRate}
                            onChange={(e) => onTaxRateChange(Number(e.target.value))}
                            className="w-14 h-7 px-2 text-center text-sm border border-input rounded-md bg-background focus:outline-none focus:ring-1 focus:ring-ring"
                        />
                        <span>%</span>
                    </div>
                ) : (
                    <span className="text-muted-foreground">ITBIS ({taxRate}%)</span>
                )}
                <span className="font-medium">{formatCurrency(taxAmount)}</span>
            </div>
            <div className="border-t border-border pt-2 flex justify-between">
                <span className="font-semibold">Total</span>
                <span className="text-xl font-bold text-primary">{formatCurrency(total)}</span>
            </div>
        </div>
    );
}