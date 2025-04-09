"use client";

import http from "@/http";
import Image from "next/image";
import { useState } from "react";

interface QRCodeModalProps {
  qrCode: string | null;
  onClose: () => void;
}

const QRCodeModal: React.FC<QRCodeModalProps> = ({ qrCode, onClose }) => (
  <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-50">
    <div className="relative bg-white rounded-lg shadow-xl p-6">
      <h3 className="text-lg font-semibold mb-4">Conecte seu WhatsApp</h3>
      {qrCode ? (
        <Image
          src={qrCode}
          alt="QR Code WhatsApp"
          width={200}
          height={200}
          className="mx-auto"
        />
      ) : (
        <p>Carregando QR Code...</p>
      )}
      <p className="text-sm text-gray-500 mt-2">
        Escaneie este código com a câmera do seu WhatsApp.
      </p>
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
      >
        <svg
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  </div>
);

interface WhatsAppConnectorProps {
  chipId: string;
  onConnectionSuccess: (chipId: string) => void;
  onConnectionError: (chipId: string, error: string) => void;
  isConnected: boolean;
}

const WhatsAppConnector: React.FC<WhatsAppConnectorProps> = ({
  chipId,
  onConnectionSuccess,
  onConnectionError,
  isConnected,
}) => {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<
    "idle" | "loading" | "connected" | "error"
  >("idle");
  const [checkConnectionIntervalId, setCheckConnectionIntervalId] =
    useState<NodeJS.Timeout | null>(null);

  const handleConnectClick = async () => {
    setIsModalOpen(true);
    setQrCode(null);
    setConnectionStatus("loading");

    try {
      const response = await http.post("/chips/connect", { chipId });
      if (!response) {
        setConnectionStatus("error");
        onConnectionError(chipId, "Erro ao obter o QR Code.");
        return;
      }
      setQrCode(response.data.qrCode);

      const intervalId = setInterval(async () => {
        try {
          const statusResponse = await http.get(`/chips/status/${chipId}`);
          console.log("statusResponse: ", statusResponse);
          if (statusResponse.data.status === "CONNECTED") {
            setConnectionStatus("connected");
            clearInterval(intervalId);
            setCheckConnectionIntervalId(null);
            setIsModalOpen(false);
            onConnectionSuccess(chipId);
          }
        } catch (error) {
          console.error("Erro ao verificar o status da conexão:", error);
        }
      }, 3000);

      setCheckConnectionIntervalId(intervalId);
    } catch (error: any) {
      setConnectionStatus("error");
      setQrCode(null);
      onConnectionError(
        chipId,
        error.message || "Erro ao conectar o WhatsApp."
      );
    }
  };

  return (
    <div>
      {!isConnected && (
        <button
          onClick={handleConnectClick}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Conectar WhatsApp
        </button>
      )}
      {isModalOpen && (
        <QRCodeModal qrCode={qrCode} onClose={() => setIsModalOpen(false)} />
      )}
      {connectionStatus === "error" && (
        <p className="text-red-500 mt-2">Erro ao conectar o WhatsApp.</p>
      )}
      {connectionStatus === "connected" && (
        <p className="text-green-500 mt-2">WhatsApp conectado com sucesso!</p>
      )}
    </div>
  );
};

export default WhatsAppConnector;
