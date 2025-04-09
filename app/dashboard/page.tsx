"use client";

import ChipCard from "@/components/chip-card";
import DashboardLayout from "@/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import http from "@/http";
import { BarChart2, Plus, Settings, Smartphone } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type ChipStatus = "PENDING" | "ACTIVE" | "PAUSED" | "COMPLETED" | "BLOCKED";

interface ChipProps {
  id: string;
  phoneNumber: string;
  status: ChipStatus;
  createdAt: string;
  updatedAt: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const token = localStorage.getItem("warmzap:userData");

  if (!token) {
    router.push("/auth/login");
  }

  const [chips, setChips] = useState<ChipProps[]>([]);

  useEffect(() => {
    const fetchChips = async () => {
      try {
        const response = await http.get("/api/chips");
        setChips(response.data);
      } catch (error) {
        console.error("Erro ao buscar chips:", error);
      }
    };

    fetchChips();
  }, []);

  const activeChips = chips.filter((chip) => chip.status === "ACTIVE");
  const completedChips = chips.filter((chip) => chip.status === "COMPLETED");

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Link href="/dashboard/connect-whatsapp/new">
          {" "}
          {/* Link para a nova página de conexão */}
          <Button className="bg-green-600 hover:bg-green-700">
            <Plus className="mr-2 h-4 w-4" /> Conectar WhatsApp{" "}
            {/* Texto mais genérico */}
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Chips Ativos</CardTitle>
            <Smartphone className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeChips.length}</div>
            {/* <p className="text-xs text-gray-500">+2 na última semana</p> */}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Chips Conectados ao WhatsApp {/* Alterei o texto */}
            </CardTitle>
            <BarChart2 className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {chips.filter((chip) => chip.status === "ACTIVE").length}{" "}
              {/* Adaptei a lógica */}
            </div>
            {/* <p className="text-xs text-gray-500">+125 na última semana</p> */}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Chips Completados
            </CardTitle>
            <Settings className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedChips.length}</div>
            {/* <p className="text-xs text-gray-500">+1 na última semana</p> */}
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">Chips Ativos</TabsTrigger>
          <TabsTrigger value="whatsapp">Conectar WhatsApp</TabsTrigger>
          <TabsTrigger value="completed">Completados</TabsTrigger>
          <TabsTrigger value="all">Todos</TabsTrigger>
        </TabsList>
        <TabsContent value="active" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {activeChips.map((chip) => (
              <ChipCard key={chip.id} chip={chip} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="whatsapp" className="space-y-4">
          <h2>Conectar WhatsApp a um Chip Existente</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {chips.map((chip) => (
              <Card key={chip.id}>
                <CardHeader>
                  <CardTitle>{chip.phoneNumber}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Status: {chip.status}</p>
                  <Link href={`/dashboard/connect-whatsapp/${chip.id}`}>
                    <Button>Conectar WhatsApp</Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
            {chips.length === 0 && <p>Nenhum chip registrado.</p>}
          </div>
          <div className="mt-4">
            <h2>Conectar Novo Número ao WhatsApp</h2>
            <p>
              Clique no botão abaixo para conectar um novo número ao WhatsApp.
            </p>
            <Link href="/dashboard/connect-whatsapp/new">
              <Button>Conectar Novo Número</Button>
            </Link>
          </div>
        </TabsContent>
        <TabsContent value="completed" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {completedChips.map((chip) => (
              <ChipCard key={chip.id} chip={chip} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {chips.map((chip) => (
              <ChipCard key={chip.id} chip={chip} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
