"use client";

import { Button } from "@/components/ui/button";
import {
  BarChart2,
  Home,
  Menu,
  MessageSquare,
  Settings,
  Smartphone,
  User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import LogoutButton from "./LogoutButton";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Meus Chips", href: "/dashboard/chips", icon: Smartphone },
    { name: "Simulações", href: "/dashboard/simulations", icon: MessageSquare },
    { name: "Relatórios", href: "/dashboard/reports", icon: BarChart2 },
    { name: "Configurações", href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsSidebarOpen(true)}
          className="bg-white"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-auto lg:z-auto ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } flex flex-col h-full`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <Image src="/mori.png" width={200} height={2} alt="PIX" />
        </div>

        <nav className="flex-1 px-2 py-4 space-y-1 ">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  isActive
                    ? "bg-green-50 text-green-600"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <item.icon
                  className={`mr-3 h-5 w-5 ${
                    isActive ? "text-green-600" : "text-gray-500"
                  }`}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center p-4">
          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
            <User className="h-4 w-4 text-gray-600" />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-700">Usuário Demo</p>

            <LogoutButton />
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
          <div className="container mx-auto max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
