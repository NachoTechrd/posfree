import { cn } from "@/lib/utils";

export default function StatCard({ title, value, icon: Icon, trend, className }) {
    return (
        <div className={cn(
            "bg-card rounded-xl border border-border p-5 relative overflow-hidden group hover:shadow-lg transition-all duration-300",
            className
        )}>
            <div className="flex items-start justify-between">
                <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{title}</p>
                    <p className="text-2xl font-bold text-foreground">{value}</p>
                    {trend && (
                        <p className="text-xs text-muted-foreground">{trend}</p>
                    )}
                </div>
                {Icon && (
                    <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
                        <Icon className="w-5 h-5" />
                    </div>
                )}
            </div>
            <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-primary/50 to-accent/50 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
    );
}