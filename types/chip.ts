export interface Chip {
  id: string;
  phoneNumber: string;
  status: "PENDING" | "ACTIVE" | "PAUSED" | "COMPLETED" | "BLOCKED";
  daysLeft?: number;
  messagesExchanged?: number;
  lastActivity?: string;
  isConnected?: boolean; // Adicionado para refletir o status da conexão
  isSimulating?: boolean; // Adicionado para refletir o status da simulação
}
