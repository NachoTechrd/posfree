import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

export default function AppLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen overflow-hidden">
            <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <TopBar onMenuClick={() => setSidebarOpen(true)} />
                <main className="flex-1 overflow-y-auto pt-[env(safe-area-inset-top,0px)] pb-[calc(4rem+env(safe-area-inset-bottom,0px))] lg:pt-0 lg:pb-0">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
