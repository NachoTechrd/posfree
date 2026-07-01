import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const statusStyles = {
    borrador: "bg-secondary text-secondary-foreground",
    enviada: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
    aprobada: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
    rechazada: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
    pendiente: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
    pagada: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
    vencida: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
    abono: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300",
    anulada: "bg-gray-200 text-gray-500 dark:bg-gray-800 dark:text-gray-400",
};

const statusLabels = {
    borrador: "Borrador",
    enviada: "Enviada",
    aprobada: "Aprobada",
    rechazada: "Rechazada",
    pendiente: "Pendiente",
    pagada: "Pagada",
    vencida: "Vencida",
    abono: "Abono",
    anulada: "Anulada",
};

export default function StatusBadge({ status }) {
    return (
        <Badge className={cn("font-medium text-xs border-0", statusStyles[status] || "bg-secondary text-secondary-foreground")}>
            {statusLabels[status] || status}
        </Badge>
    );
}