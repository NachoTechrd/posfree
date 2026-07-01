import React from "react";
import { Zap } from "lucide-react";

export default function AuthLayout({ icon: Icon, title, subtitle, footer, children }) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-10">
                    <div className="flex items-center justify-center gap-2.5 mb-6">
                        <img src="/logo.png" alt="POSENT Logo" className="w-9 h-9 object-contain" />
                        <span className="text-xl font-bold text-foreground">POSENT Free</span>
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
                    Powered by <a href="https://posentrd.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-foreground hover:underline">POSENT PRO</a>
                </p>
            </div>
        </div>
    );
}