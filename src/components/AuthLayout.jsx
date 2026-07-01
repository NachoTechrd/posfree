import React from "react";
import { Zap } from "lucide-react";

export default function AuthLayout({ icon: Icon, title, subtitle, footer, children }) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-10">
                    <div className="flex items-center justify-center gap-2.5 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                            <Zap className="w-5 h-5 text-primary-foreground" />
                        </div>
                        <span className="text-xl font-bold text-foreground">NachoFacturas</span>
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">{title}</h1>
                    {subtitle && <p className="text-muted-foreground mt-2">{subtitle}</p>}
                </div>
                <div className="bg-card rounded-2xl shadow-sm border border-border p-8">
                    {children}
                </div>
                {footer && (
                    <p className="text-center text-sm text-muted-foreground mt-6">{footer}</p>
                )}
                <p className="text-center text-[10px] text-muted-foreground mt-4">
                    Powered by <span className="font-semibold text-foreground">NachoTechRD</span>
                </p>
            </div>
        </div>
    );
}