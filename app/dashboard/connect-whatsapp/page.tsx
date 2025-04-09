"use client"; // Mark as client component to use useState, useEffect

import WhatsAppConnector from "@/components/whatsapp-connector";
import http from "@/http";
import { Chip } from "@/types/chip";
import { useEffect, useState } from "react";

const ConnectWhatsAppPage = () => {
  const [chips, setChips] = useState<Chip[]>([]);
  const [connectedChips, setConnectedChips] = useState<string[]>([]);
  const [simulationChips, setSimulationChips] = useState<string[]>([]);
  const [errorChips, setErrorChips] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [errorLoading, setErrorLoading] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserChips = async () => {
      setLoading(true);
      setErrorLoading(null);
      try {
        const response = await http.get<Chip[]>("/chips");
        if (response) {
          setChips(response.data);
        } else {
          setErrorLoading("Erro ao buscar os chips do usuário.");
        }
      } catch (error: any) {
        console.error("Erro ao buscar os chips:", error);
        setErrorLoading(error.message || "Erro ao buscar os chips.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserChips();
  }, []);

  const handleConnectionSuccess = (chipId: string) => {
    setConnectedChips((prev) => [...prev, chipId]);
    setErrorChips((prev) => {
      const newErrors = { ...prev };
      delete newErrors[chipId]; // Remove a entrada de erro se a conexão for bem-sucedida
      return newErrors;
    });
    // Atualizar a lista de chips para refletir o status de conexão
    setChips((prevChips) =>
      prevChips.map((chip) =>
        chip.id === chipId ? { ...chip, isConnected: true } : chip
      )
    );
  };

  const handleConnectionError = (chipId: string, error: string) => {
    setErrorChips((prev) => ({ ...prev, [chipId]: error }));
    setConnectedChips((prev) => prev.filter((id) => id !== chipId));
    // Atualizar a lista de chips para refletir o erro de conexão
    setChips((prevChips) =>
      prevChips.map((chip) =>
        chip.id === chipId ? { ...chip, isConnected: false } : chip
      )
    );
  };

  const handleStartSimulation = async (chipIdToSimulate: string) => {
    setSimulationChips((prev) => [...prev, chipIdToSimulate]);
    try {
      const response = await http.post(
        `/simulations/start/${chipIdToSimulate}`
      );
      if (!response) {
        console.error("Erro ao iniciar a simulação");
        setSimulationChips((prev) =>
          prev.filter((id) => id !== chipIdToSimulate)
        );
        // Mostrar erro ao usuário
      } else {
        alert(`Simulação iniciada para o chip: ${chipIdToSimulate}`);
        // Atualizar a lista de chips para refletir o status da simulação (se necessário)
        setChips((prevChips) =>
          prevChips.map((chip) =>
            chip.id === chipIdToSimulate
              ? { ...chip, isSimulating: true }
              : chip
          )
        );
      }
    } catch (error: any) {
      console.error("Erro ao iniciar a simulação:", error);
      setSimulationChips((prev) =>
        prev.filter((id) => id !== chipIdToSimulate)
      );
      // Mostrar erro ao usuário
    }
  };

  const handlePauseSimulation = async (chipIdToPause: string) => {
    setSimulationChips((prev) => prev.filter((id) => id !== chipIdToPause));
    try {
      const response = await http.post(
        `/api/simulations/pause/${chipIdToPause}`
      );
      if (!response) {
        console.error("Erro ao pausar a simulação");
        // Mostrar erro ao usuário
      } else {
        alert(`Simulação pausada para o chip: ${chipIdToPause}`);
        // Atualizar a lista de chips para refletir o status da simulação (se necessário)
        setChips((prevChips) =>
          prevChips.map((chip) =>
            chip.id === chipIdToPause ? { ...chip, isSimulating: false } : chip
          )
        );
      }
    } catch (error: any) {
      console.error("Erro ao pausar a simulação:", error);
      // Mostrar erro ao usuário
    }
  };

  if (loading) {
    return <div>Carregando chips...</div>;
  }

  if (errorLoading) {
    return <div>Erro ao carregar chips: {errorLoading}</div>;
  }

  return (
    <div>
      <h1>Conectar WhatsApps</h1>
      {chips.map((chip) => (
        <div key={chip.id} className="mb-4 border p-4 rounded">
          <h3>Chip: {chip.phoneNumber}</h3>
          <WhatsAppConnector
            chipId={chip.id}
            onConnectionSuccess={handleConnectionSuccess}
            onConnectionError={(error) => handleConnectionError(chip.id, error)}
            isConnected={connectedChips.includes(chip.id)}
          />

          {connectedChips.includes(chip.id) &&
            !simulationChips.includes(chip.id) && (
              <button
                onClick={() => handleStartSimulation(chip.id)}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-2"
                disabled={simulationChips.includes(chip.id)}
              >
                Iniciar Simulação
              </button>
            )}
          {simulationChips.includes(chip.id) && (
            <button
              onClick={() => handlePauseSimulation(chip.id)}
              className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded mt-2"
            >
              Pausar Simulação
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default ConnectWhatsAppPage;
