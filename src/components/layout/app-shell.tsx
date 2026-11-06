"use client";

import * as React from "react";
import { Sidebar } from "./sidebar";
import { Header } from "./header";
import { X } from "lucide-react";

export interface AppShellUser {
  id: string;
  name: string;
  email: string;
  role: string;
  organization: string;
}

interface AppShellProps {
  children: React.ReactNode;
  user?: AppShellUser;
}

export function AppShell({ children, user }: AppShellProps) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = React.useState(false);
  const [collapsed, setCollapsed] = React.useState(false);

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#071B2B] flex flex-col antialiased transition-colors">
      <div className="flex h-screen overflow-hidden">
        {/* Desktop Sidebar */}
        <div className="hidden lg:flex shrink-0">
          <Sidebar
            collapsed={collapsed}
            onToggleCollapse={() => setCollapsed((prev) => !prev)}
          />
        </div>

        {/* Mobile Sidebar Overlay */}
        {mobileSidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="fixed inset-0 bg-[#071B2B]/70 backdrop-blur-xs transition-opacity"
              onClick={() => setMobileSidebarOpen(false)}
            />
            <div className="fixed inset-y-0 left-0 w-64 bg-[#071B2B] flex flex-col z-10 shadow-2xl animate-in slide-in-from-left duration-200 border-r border-[#163854]">
              <div className="absolute top-4 right-3 z-10">
                <button
                  onClick={() => setMobileSidebarOpen(false)}
                  className="p-1.5 rounded-lg text-[#8ca3b5] hover:text-white hover:bg-[#0c263d]"
                  aria-label="Close sidebar"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <Sidebar onItemClick={() => setMobileSidebarOpen(false)} />
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#fafafa] dark:bg-[#071B2B]">
          <Header
            onMenuToggle={() => setMobileSidebarOpen(true)}
            userName={user?.name}
            userRole={user?.role}
            activeOrgName={user?.organization}
          />
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto w-full">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
